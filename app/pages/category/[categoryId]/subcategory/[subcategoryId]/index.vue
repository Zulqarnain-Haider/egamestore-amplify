<template>
  <div class="w-full min-h-screen px-4 sm:px-6 lg:px-8 mb-10 lg:mb-12 max-w-7xl mx-auto">
    <!-- Breadcrumb -->
    <div class="mb-6 text-lg flex items-center gap-1">
      <NuxtLink to="/" class="hover:text-primary text-mainText">{{ t('home') }}</NuxtLink>
      <Icon name="heroicons-chevron-right-20-solid" class="text-mainText w-7 h-7" />

      <NuxtLink
        :to="`/category/${categoryId}`"
        class="hover:text-primary text-mainText"
      >
        {{ categoryName }}
      </NuxtLink>

      <Icon name="heroicons-chevron-right-20-solid" class="text-mainText w-7 h-7 mb-1" />
      <span class="text-mainText whitespace-nowrap text-">{{ subcategoryName }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <SkeletonCard v-for="n in 10" :key="n" :height="80" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-error text-lg mb-4">{{ error }}</p>
      <button
        @click="fetchData"
        class="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
      >
        {{ t('retry') }}
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!countries.length" class="text-center py-12">
      <p class="text-onFooter text-lg">{{ t('noCountriesAvailable') }}</p>
    </div>

    <!-- Countries Grid -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <CountryCard
        v-for="country in countries"
        :key="country.id"
        :country="country"
        @select="handleCountrySelect"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '~/stores/categoriesStore'
import { useCountriesStore } from '~/stores/countriesStore'
import { useCategoryContext } from '~/composables/useCategoryContext'
import { useHead } from '#app'

const router = useRouter()
const { t } = useI18n()
const countriesStore = useCountriesStore()
const categoriesStore = useCategoriesStore()

// Route params
const { categoryId, subcategoryId } = useCategoryContext()

const countries = ref([])
const loading = ref(true)
const error = ref(null)

// Names from store
const categoryName = computed(() =>
  categoriesStore.getCategoryName(categoryId.value)
)
const subcategoryName = computed(() =>
  categoriesStore.getSubcategoryName(subcategoryId.value)
)

// SEO meta tags
useHead({
  title: `${subcategoryName.value} - ${categoryName.value} | EGameStore`,
  meta: [
    {
      name: 'description',
      content: `Browse all countries for ${subcategoryName.value} in ${categoryName.value} on EGameStore.`
    },
    {
      name: 'keywords',
      content: `${categoryName.value}, ${subcategoryName.value}, countries, gaming, EGameStore`
    },
    { property: 'og:title', content: `${subcategoryName.value} - ${categoryName.value} | EGameStore` },
    { property: 'og:description', content: `Browse all countries for ${subcategoryName.value} in ${categoryName.value}.` }
  ]
})

// Fetch countries
const fetchData = async () => {
  loading.value = true
  error.value = null

  try {
    // Load subcategories first
    await categoriesStore.fetchChildren(categoryId.value)

    // Fetch countries for current subcategory
    await countriesStore.fetchCountries(subcategoryId.value)
    countries.value = countriesStore.countries

    if (!countries.value.length) {
      error.value = 'No countries available'
    }
  } catch (err) {
    console.error('Countries Page Error:', err)
    error.value = 'Failed to load countries. Please try again.'
  } finally {
    loading.value = false
  }
}

// Navigate to product listing page
const handleCountrySelect = (countryId) => {
  router.push(
    `/category/${categoryId.value}/subcategory/${subcategoryId.value}/country/${countryId}`
  )
}

onMounted(fetchData)
watch(subcategoryId, fetchData)
</script>
