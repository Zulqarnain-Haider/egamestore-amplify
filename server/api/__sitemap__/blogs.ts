// server/api/__sitemap__/blogs.ts - PRODUCTION READY
import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrl } from '#sitemap/types'

// Cache posts for 1 hour in production
const CACHE_TTL = 60 * 60 * 1000 // 1 hour in milliseconds
let cachedPosts: any[] | null = null
let lastFetchTime = 0

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  
  // Check cache in production
  const isProduction = process.env.NODE_ENV === 'production'
  const now = Date.now()
  
  if (isProduction && cachedPosts && (now - lastFetchTime) < CACHE_TTL) {
    console.log(`📦 Using cached posts (${cachedPosts.length} items)`)
    return transformPosts(cachedPosts)
  }

  try {
    console.log('🔄 Fetching fresh posts from API...')
    
    let allPosts: any[] = []
    let currentPage = 1
    let totalPages = 1
    
    // First fetch to get pagination info
    const firstResponse = await $fetch(`${config.public.apiBase}/posts`, {
      params: {
        per_page: 100,
        page: 1,
      },
      headers: { Accept: 'application/json' },
    })
    
    allPosts = firstResponse?.data?.posts || []
    totalPages = firstResponse?.data?.last_page || 1
    
    // Fetch remaining pages if needed
    if (totalPages > 1) {
      const pagePromises = []
      
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(
          $fetch(`${config.public.apiBase}/posts`, {
            params: {
              per_page: 100,
              page: page,
            },
            headers: { Accept: 'application/json' },
          }).catch(err => {
            console.warn(`Failed to fetch page ${page}:`, err.message)
            return { data: { posts: [] } } // Return empty on error
          })
        )
      }
      
      const responses = await Promise.all(pagePromises)
      responses.forEach(response => {
        allPosts = [...allPosts, ...(response?.data?.posts || [])]
      })
    }
    
    console.log(`✅ Successfully fetched ${allPosts.length} posts from ${totalPages} pages`)
    
    // Update cache
    cachedPosts = allPosts
    lastFetchTime = now
    
    return transformPosts(allPosts)
    
  } catch (error) {
    console.error('❌ Failed to fetch posts for sitemap:', error)
    
    // If we have cached data, use it even if it's stale
    if (cachedPosts) {
      console.log('⚠️ Using stale cached data due to API error')
      return transformPosts(cachedPosts)
    }
    
    return []
  }
})

// Helper function to transform posts to sitemap format
function transformPosts(posts: any[]): SitemapUrl[] {
  return posts.map((post: any) => {
    const url = post.slug
      ? `/news-blog/${post.id}/${post.slug}`
      : `/news-blog/${post.id}`

    // Fix date format: "2021-05-12 01:45:01" -> "2021-05-12T01:45:01Z"
    const rawDate = post.modified || post.updated_at || post.created_at
    const lastmod = rawDate ? rawDate.replace(' ', 'T') + 'Z' : new Date().toISOString()

    return {
      loc: url,
      lastmod,
      changefreq: 'weekly',
      priority: 0.7,
    } satisfies SitemapUrl
  })
}