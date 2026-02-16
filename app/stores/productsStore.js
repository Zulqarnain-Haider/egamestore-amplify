import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#app'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    pagination: {},
    loading: false,
    error: null
  }),

  actions: {

    // ==========================
    // Helpers
    // ==========================
    _getApiBase() {
      const config = useRuntimeConfig()
      return config.public.apiBase
    },

    async fetchProducts(countryId, subcategoryId, page = 1, perPage = 16, sortType = null) {
      this.loading = true
      this.error = null

      try {
        const params = { 
            category_id: subcategoryId,
            country_id: countryId,
            page,
            per_page: perPage
          }
       // ONLY send sort_type if it exists
    if (sortType) {
      params.sort_type = sortType
    }
    const response = await $fetch(`${this._getApiBase()}/cards/category`, {
          params,
          headers: { 'Accept-language': 'en' }
        })

        console.log('Products API Response:', response)

        if (response.status && response.data?.cards) {
          this.products = response.data.cards
          this.pagination = {
            current_page: response.data.current_page,
            per_page: response.data.per_page,
            total: response.data.total,
            has_more: response.data.has_more
          }
        } else {
          this.products = []
          this.error = 'No products found'
        }
      } catch (err) {
        console.error('Fetch Products Error:', err)
        this.products = []
        this.error = err.message || 'Failed to load products'
      } finally {
        this.loading = false
      }
    }
  }
})
