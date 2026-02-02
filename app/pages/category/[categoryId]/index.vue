<template>
  <div class="min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 lg:mb-12 mx-auto">
    <!-- Breadcrumb -->
    <div class="mb-6 text-lg flex items-center gap-1">
      <NuxtLink to="/" class="hover:text-primary text-mainText">{{ t('home') }}</NuxtLink>
      <Icon name="heroicons-chevron-right-20-solid" class="text-mainText w-7 h-7" />
      <span class="text-mainText">{{ categoryName }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <SkeletonCard v-for="n in 8" :key="n" />
    </div>

    <!-- Error State -->
    <!-- <div v-else-if="error" class="text-center py-12">
      <p class="text-error text-lg mb-4">{{ error }}</p>
      <NuxtLink
      to="/"
        class="bg-primary text-white px-6 py-2 mt-4 rounded-lg hover:opacity-90"
        >
        Go To Home
      </NuxtLink>
    </div> -->


    <!-- Empty State -->
    <div v-else-if="categories.length === 0" class="text-center py-12">
      <p class="text-onFooter text-lg">{{ t('noSubcategoriesFound') }}</p>
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
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '~/stores/categoriesStore'
import { useCategoryContext } from '~/composables/useCategoryContext'
import { useHead } from '#app'

const router = useRouter()
const { t } = useI18n()
const categoriesStore = useCategoriesStore()

// Route context
const { categoryId } = useCategoryContext()

const categories = ref([])
const loading = ref(true)
const error = ref(null)

// Category name
const categoryName = computed(() =>
  categoriesStore.getCategoryName(categoryId.value)
)

// Dynamic SEO meta tags
useHead({
  title: `${categoryName.value} - eGameStore`,
  meta: [
    { name: 'description', content: `Browse all ${categoryName.value} subcategories and games on eGameStore.` },
    { name: 'keywords', content: `${categoryName.value}, gaming, eGameStore, buy games` },
    { property: 'og:title', content: `${categoryName.value} - eGameStore` },
    { property: 'og:description', content: `Browse all ${categoryName.value} subcategories and games.` }
  ]
})

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

// Navigate to subcategory → countries page
const handleCategorySelect = (subcategoryId) => {
  router.push(`/category/${categoryId.value}/subcategory/${subcategoryId}`)
}

onMounted(fetchData)
watch(categoryId, fetchData)
</script>
