<template>
  <div class="min-h-screen px-4 sm:px-6 lg:px-8 mb-10 lg:mb-12">
    <!-- Breadcrumb -->
    <div class="mb-6 text-lg flex items-center gap-1 border-b border-primary">
      <NuxtLink to="/" class="hover:text-primary text-mainText">Home</NuxtLink>
       <Icon
          name="heroicons-chevron-right-20-solid" class="text-mainText w-7 h-7"/>
      <span class="text-mainText">{{ categoryName }}</span>
    </div>

    <!-- Page Title -->
    <!-- <h1 class="text-2xl sm:text-3xl font-bold text-mainText mb-6">
      {{ categoryName }} - Sub Categories
    </h1> -->

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <SkeletonCard v-for="n in 8" :key="n" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-error text-lg mb-4">{{ error }}</p>
      <button @click="fetchData" class="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90">
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!categories.length" class="text-center py-12">
      <p class="text-onFooter text-lg">No subcategories found</p>
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <CategoryCard
        v-for="cat in categories" 
        :key="cat.id" 
        :category="cat" 
        @select="handleCategorySelect"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoriesStore } from '~/stores/categoriesStore.js'

const route = useRoute()
const router = useRouter()
const categoriesStore = useCategoriesStore()

const categories = ref([])
const loading = ref(true)
const error = ref(null)

// Get category ID from route
const categoryId = computed(() => route.params.id)

// Category names mapping
const categoryNames = {
  '50': 'PC Games',
  '1': 'PlayStation',
  '2': 'Xbox',
  '5': 'Nintendo'
}

const categoryName = computed(() => categoryNames[categoryId.value] || 'Category')

// Fetch subcategories
const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    await categoriesStore.fetchChildren(categoryId.value)
    categories.value = categoriesStore.childrenCategories
    
    if (!categories.value.length) {
      error.value = 'No subcategories available for this category'
    }
  } catch (err) {
    console.error('Category Page Error:', err)
    error.value = 'Failed to load categories. Please try again.'
  } finally {
    loading.value = false
  }
}

// Handle category selection - Go to separate countries page
const handleCategorySelect = (subcategoryId) => {
  console.log('Selected subcategory:', subcategoryId)
  router.push({
    path: '/countries',
    query: { category: route.params.id, subcategory: subcategoryId }
  })
}

onMounted(() => {
  console.log('Category Page Mounted - ID:', categoryId.value)
  fetchData()
})

watch(() => route.params.id, () => {
  fetchData()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>