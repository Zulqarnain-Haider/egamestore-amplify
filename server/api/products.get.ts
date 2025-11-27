import productsData from '../../data/products.json'

export default defineEventHandler(async (event) => {
  try {
    const query   = getQuery(event)
    const category = (query.category || '').toString().toLowerCase()
    const genres   = (query.genres || '').toString().split(',').filter(Boolean)
    const minPrice = Number(query.minPrice ?? 0)
    const maxPrice = Number(query.maxPrice ?? 999)
    const q        = (query.q || '').toString().trim().toLowerCase()

    // Use imported data directly
    const allProducts = productsData

    let filtered = allProducts.filter((p: any) => {
      if (category && p.category?.toLowerCase() !== category) return false
      if (p.price < minPrice || p.price > maxPrice) return false
      if (genres.length && !genres.some(g => p.genres?.includes(g))) return false
      if (q && !p.title?.toLowerCase().includes(q)) return false
      return true
    })

    return filtered
  } catch (err) {
    console.error('API Error:', err)
    return { 
      error: 'Failed to load products',
      details: err instanceof Error ? err.message : String(err)
    }
  }
})