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

    async fetchProducts(countryId, subcategoryId, page = 1, perPage = 16, sortType = 'asc_price') {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch(`${this._getApiBase()}/cards/category`, {
          params: { 
            category_id: subcategoryId,
            country_id: countryId,
            sort_type: sortType,
            page,
            per_page: perPage
          },
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
