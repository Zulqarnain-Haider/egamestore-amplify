import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    parentCategories: [],
    childrenCategories: [],
    loading: false,
    error: null
  }),

  actions: {
    // Fetch top-level categories (PC, PlayStation, Xbox, etc.)
    async fetchParentCategories() {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch(
          'https://api.egamestore.com/api/categories/parents',
          {
            headers: { 'Accept-language': 'en' }
          }
        )

        if (response.status && response.data) {
          this.parentCategories = response.data
        } else {
          this.error = 'Failed to load categories'
        }
      } catch (err) {
        console.error('Fetch Parent Categories Error:', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // Fetch subcategories for a given parent category
    async fetchChildren(categoryId) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch(
          'https://api.egamestore.com/api/categories/children',
          {
            params: { category_id: categoryId },
            headers: { 'Accept-language': 'en' }
          }
        )

        if (response.status && response.data) {
          this.childrenCategories = response.data
        } else {
          this.childrenCategories = []
          this.error = 'No subcategories found'
        }
      } catch (err) {
        console.error('Fetch Children Categories Error:', err)
        this.childrenCategories = []
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // Get parent category name by ID
    getCategoryName(categoryId) {
      if (!categoryId) return 'Category'

      const category = this.parentCategories.find(
        c => String(c.id) === String(categoryId)
      )
      return category?.name || 'Category'
    },

    // Get subcategory name by ID
    getSubcategoryName(subcategoryId) {
      if (!subcategoryId) return 'Subcategory'

      const subcategory = this.childrenCategories.find(
        c => String(c.id) === String(subcategoryId)
      )
      return subcategory?.name || 'Subcategory'
    }
  }
})
