// server/api/__sitemap__/categories-and-products.ts
import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrl } from '#sitemap/types'

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const sitemapUrls: SitemapUrl[] = []
  
  // Only process these specific parent category IDs
  const TARGET_PARENT_CATEGORY_IDS = [50, 1, 2, 5];
  
  try {
    console.log('🔄 Fetching parent categories...')
    const allParentCategories = await fetchAllPages(
      `${config.public.apiBase}/categories/parents`,
      'categories'
    )

    const parentCategories = allParentCategories.filter(category => 
      TARGET_PARENT_CATEGORY_IDS.includes(category.id)
    )

    console.log(`🎯 Processing ${parentCategories.length} target categories: ${TARGET_PARENT_CATEGORY_IDS.join(', ')}`)

    // Process each parent category
    for (const parentCategory of parentCategories) {
      const parentCategoryId = parentCategory.id
      const parentCategoryName = parentCategory.name
      
      // Add parent category URL
      sitemapUrls.push({
        loc: `/category/${parentCategoryId}`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8,
      })

      console.log(`\n📂 Processing "${parentCategoryName}" (ID: ${parentCategoryId})...`)

      // Fetch subcategories
      const subcategories = await fetchWithRetry(
        `${config.public.apiBase}/categories/children`,
        { category_id: parentCategoryId }
      )

      const subcategoriesData = subcategories?.data || []

      // Process each subcategory
      for (const subcategory of subcategoriesData) {
        const subcategoryId = subcategory.id
        const subcategoryName = subcategory.name
        
        // Add subcategory URL
        sitemapUrls.push({
          loc: `/category/${parentCategoryId}/subcategory/${subcategoryId}`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.7,
        })

        console.log(`   └─ Subcategory "${subcategoryName}" (ID: ${subcategoryId})`)

        // Fetch countries
        let countriesData = []
        try {
          const countries = await fetchWithRetry(
            `${config.public.apiBase}/countries`,
            { category_id: subcategoryId }
          )
          countriesData = countries?.data || []
          console.log(`      ℹ️  ${countriesData.length} countries`)
        } catch (countryError) {
          console.log(`      📊 0 countries, 0 products`)
          continue
        }

        if (countriesData.length === 0) {
          console.log(`      📊 0 countries, 0 products`)
          continue
        }

        let totalProductsAdded = 0
        let countriesAdded = 0

        // Process each country
        for (const country of countriesData) {
          const countryId = country.id
          const countryName = country.name

          // ALWAYS add country URL
          sitemapUrls.push({
            loc: `/category/${parentCategoryId}/subcategory/${subcategoryId}/country/${countryId}`,
            lastmod: new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.6,
          })
          countriesAdded++

          // Try to fetch products
          try {
            const products = await fetchAllProductPages(
              config.public.apiBase,
              countryId,
              subcategoryId
            )

            if (products.length > 0) {
              // Add product URLs
              products.forEach(product => {
                sitemapUrls.push({
                  loc: `/product/${product.id}`,
                  lastmod: formatDate(product.updated_at || product.created_at),
                  changefreq: 'daily',
                  priority: 0.9,
                })
              })
              totalProductsAdded += products.length
              console.log(`         ✅ ${countryName}: ${products.length} products`)
            }
          } catch (productError) {
            // Silent fail - country URL already added
          }
        }

        console.log(`      📊 ${countriesAdded} countries, ${totalProductsAdded} products`)
      }
    }

    console.log(`\n✅ Generated ${sitemapUrls.length} total URLs`)
    console.log(`   - Categories: ${sitemapUrls.filter(u => u.loc.match(/^\/category\/\d+$/)).length}`)
    console.log(`   - Subcategories: ${sitemapUrls.filter(u => u.loc.match(/\/subcategory\/\d+$/)).length}`)
    console.log(`   - Countries: ${sitemapUrls.filter(u => u.loc.match(/\/country\/\d+$/)).length}`)
    console.log(`   - Products: ${sitemapUrls.filter(u => u.loc.match(/^\/product\/\d+$/)).length}`)
    
    return sitemapUrls

  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error)
    return []
  }
})

// ======================
// HELPER FUNCTIONS
// ======================

async function fetchAllPages(baseUrl: string, dataKey: string, params: any = {}): Promise<any[]> {
  let allItems: any[] = []
  let currentPage = 1
  let hasMore = true

  while (hasMore) {
    try {
      const response = await $fetch(baseUrl, {
        params: { ...params, page: currentPage, per_page: 100 },
        headers: { 'Accept-language': 'en' },
      })

      const items = response?.data?.[dataKey] || response?.data || []
      allItems = [...allItems, ...items]
      
      hasMore = response?.data?.has_more || 
                (response?.data?.current_page < response?.data?.last_page)
      
      if (items.length === 0) hasMore = false
      
      currentPage++
      if (hasMore) await new Promise(resolve => setTimeout(resolve, 50))
      
    } catch (error) {
      hasMore = false
    }
  }

  return allItems
}

async function fetchAllProductPages(
  apiBase: string, 
  countryId: number, 
  subcategoryId: number
): Promise<any[]> {
  let allProducts: any[] = []
  let currentPage = 1
  let hasMore = true
  const MAX_PAGES = 100

  while (hasMore && currentPage <= MAX_PAGES) {
    try {
      const url = `${apiBase}/cards/category`
      const params = {
        country_id: countryId,
        category_id: subcategoryId,
        page: currentPage,
        per_page: 100,
        sort_type: 'asc_price',
      }

      // Log the FIRST request for debugging
      if (currentPage === 1) {
        console.log(`         🔍 Testing: ${url}?${new URLSearchParams(params as any).toString()}`)
      }

      const response = await $fetch(url, {
        params,
        headers: { 'Accept-language': 'en' },
        timeout: 10000,
      })

      const products = response?.data?.cards || []
      const total = response?.data?.total || 0
      
      // Early exit if no products
      if (currentPage === 1 && total === 0) {
        return []
      }
      
      if (products.length > 0) {
        allProducts = [...allProducts, ...products]
      }
      
      hasMore = response?.data?.has_more === true
      currentPage++
      
      if (hasMore) await new Promise(resolve => setTimeout(resolve, 50))
      
    } catch (error) {
      if (currentPage === 1) throw error
      hasMore = false
    }
  }

  return allProducts
}

async function fetchWithRetry(url: string, params: any = {}, maxRetries = 3): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await $fetch(url, {
        params,
        headers: { 'Accept-language': 'en' },
        timeout: 10000,
      })
    } catch (error) {
      if (attempt === maxRetries) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return new Date().toISOString()
  return dateString.replace(' ', 'T') + 'Z'
}