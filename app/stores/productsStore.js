import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    pagination: {},
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchProducts(countryId, subcategoryId, page = 1 , perPage = 16, sortType = 'as_price') {
      this.loading = true
      this.error = null
      
      try {
        const response = await $fetch('https://api.egamestore.com/api/cards/category', {
          params: { 
            category_id: subcategoryId,
            country_id: countryId,
            sort_type: sortType,
            page: page,
            per_page: perPage
          },
          headers: { 
            'Accept-language': 'en'
          }
        })
        
        console.log('✅ Products API Response:', response)
        
        if (response.status && response.data && response.data.cards) {
          this.products = response.data.cards
          this.pagination = response.data  // Store pagination data
        } else {
          this.error = 'No products found'
          this.products = []
        }
      } catch (err) {
        console.error('❌ Fetch Products Error:', err)
        this.error = err.message || 'Failed to load products'
        this.products = []
      } finally {
        this.loading = false
      }
    }
  }
})