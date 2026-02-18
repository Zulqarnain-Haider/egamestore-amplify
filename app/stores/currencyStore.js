import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    selectedCurrency: null,
    initialized: false
  }),

  actions: {
    setCurrency(currency) {
      this.selectedCurrency = currency
      if (process.client) {
        localStorage.setItem('selectedCurrency', JSON.stringify(currency))
      }
    },

    initCurrency(defaultCurrency) {
      if (this.initialized) return

      if (process.client) {
        const saved = localStorage.getItem('selectedCurrency')

        if (saved) {
          this.selectedCurrency = JSON.parse(saved)
        } else {
          this.selectedCurrency = defaultCurrency
        }
      } else {
        this.selectedCurrency = defaultCurrency
      }

      this.initialized = true
    }
  }
})
