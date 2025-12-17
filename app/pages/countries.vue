<template>
  <div class="min-h-screen text-mainText font-poppins flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-7xl">
      
      <!-- Breadcrumb -->
      <div class="mb-6 text-lg flex items-center gap-1">
        <NuxtLink to="/" class="hover:text-primary text-mainText">Home</NuxtLink>
        <Icon name="heroicons-chevron-right-20-solid" class="text-mainText w-7 h-7" />
        <NuxtLink :to="`/category/${categoryId}`" class="hover:text-primary text-mainText">
          {{ categoryName }}
        </NuxtLink>
        <Icon name="heroicons-chevron-right-20-solid" class="text-mainText w-7 h-7" />
        <span class="text-mainText">{{ subcategoryName || 'Subcategory' }}</span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SkeletonCard v-for="n in 10" :key="n" :height="80" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-error text-lg mb-4">{{ error }}</p>
        <button @click="fetchData" class="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90">
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!countries.length" class="text-center py-12">
        <p class="text-onFooter text-lg">No countries available</p>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCountriesStore } from '~/stores/countriesStore.js'

const route = useRoute()
const router = useRouter()
const countriesStore = useCountriesStore()

const countries = ref([])
const loading = ref(true)
const error = ref(null)

const categoryId = computed(() => route.query.category)
const subcategoryId = computed(() => route.query.subcategory)

const categoryNames = {
  '50': 'PC Games',
  '1': 'PlayStation',
  '2': 'Xbox',
  '5': 'Nintendo'
}
const categoryName = computed(() => categoryNames[categoryId.value] || 'Category')

// If you want to fetch subcategory name dynamically, you can adjust
const subcategoryName = computed(() => `Subcategory ${subcategoryId.value || ''}`)

const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const idToUse = subcategoryId.value || categoryId.value
    await countriesStore.fetchCountries(idToUse)
    countries.value = countriesStore.countries
    
    if (!countries.value.length) {
      error.value = 'No countries available for this category'
    }
  } catch (err) {
    console.error('Country Page Error:', err)
    error.value = 'Failed to load countries. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleCountrySelect = (countryId) => {
  router.push(`/country/${countryId}?category=${categoryId.value}&subcategory=${subcategoryId.value}`)
}

// Watch query changes
watch(() => route.query, fetchData, { deep: true })

onMounted(fetchData)
</script>
