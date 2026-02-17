import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    selectedCurrency: null,   
  }),

  actions: {
    setCurrency(currency) {
      this.selectedCurrency = currency
      localStorage.setItem('selectedCurrency', JSON.stringify(currency))
    },

    initCurrency(defaultCurrency) {
      const saved = localStorage.getItem('selectedCurrency')
      if (saved) {
        this.selectedCurrency = JSON.parse(saved)
      } else {
        this.selectedCurrency = defaultCurrency
      }
    }
  }
})
