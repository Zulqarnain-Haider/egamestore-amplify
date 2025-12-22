import { defineStore } from 'pinia'

export const useCountriesStore = defineStore('countries', {
  state: () => ({
    countries: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchCountries(subcategoryId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await $fetch('https://api.egamestore.com/api/countries', {
          params: { category_id: subcategoryId },
          headers: { 'Accept-language': 'en' }
        })
        
        console.log('Countries:', response)
        
        if (response.status && response.data) {
          this.countries = response.data
        } else {
          this.error = 'No countries found'
          this.countries = []
        }
      } catch (err) {
        console.error('Fetch Countries Error:', err)
        this.error = err.message
        this.countries = []
      } finally {
        this.loading = false
      }
    }
  }
})
