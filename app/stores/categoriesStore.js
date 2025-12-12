import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    parentCategories: [],
    childrenCategories: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchParentCategories() {
      this.loading = true
      this.error = null
      
      try {
        const response = await $fetch('https://api.egamestore.com/api/categories/parents', {
          headers: { 
            'Accept-language': 'en'
          }
        })
        
        console.log('✅ Parent Categories:', response)
        
        if (response.status && response.data) {
          this.parentCategories = response.data
        } else {
          this.error = 'Failed to load categories'
        }
      } catch (err) {
        console.error('❌ Fetch Parent Categories Error:', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    
    async fetchChildren(categoryId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await $fetch(`https://api.egamestore.com/api/categories/children`, {
          params: { category_id: categoryId },
          headers: { 
            'Accept-language': 'en'
          }
        })
        
        console.log('✅ Children Categories:', response)
        
        if (response.status && response.data) {
          this.childrenCategories = response.data
        } else {
          this.error = 'No subcategories found'
          this.childrenCategories = []
        }
      } catch (err) {
        console.error('❌ Fetch Children Categories Error:', err)
        this.error = err.message
        this.childrenCategories = []
      } finally {
        this.loading = false
      }
    }
  }
})