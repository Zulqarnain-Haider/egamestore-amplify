<template>
  <div class="min-h-screen text-mainText font-poppins flex flex-col items-center py-8 px-3 sm:px-6 md:px-10 animate-fadeIn">
    <div class="w-full max-w-7xl flex flex-col md:flex-row gap-8">

      <!-- Sidebar -->
      <aside class="w-full md:w-64 lg:w-72 flex-shrink-0 p-4 md:p-2 border rounded-lg border-primary md:border-none">
        <FiltersSidebar
          :genresList="genresList"
          :modelValue="filters"
          @update:modelValue="onFilterUpdate"
          @clear="clearFilters"
        />
      </aside>

      <!-- Products -->
      <section class="flex-1 flex flex-col w-full">
        
        <!-- Sorting -->
        <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
          <span class="flex gap-1 items-center text-sm sm:text-base">
            <NuxtLink class="text-mainText text-lg hover:text-primary" to="/">Home</NuxtLink>
            <Icon name="heroicons-chevron-right-20-solid" class="text-mainText w-7 h-7"/>
            <NuxtLink :to="`/category/${categoryId}`" class="hover:text-primary">{{ categoryName }}</NuxtLink>
            <Icon name="heroicons-chevron-right-20-solid" class="text-mainText w-7 h-7"/>
            <h2 class="font-medium capitalize whitespace-nowrap">Products</h2>
          </span>

          <div class="flex items-center gap-2 text-sm sm:text-base relative">
            <span class="text-mainText/80 text-xl whitespace-nowrap">Sort by:</span>

            <div class="relative">
              <select
                v-model="sortBy"
                @change="handleSort"
                class="bg-bgDark border appearance-none border-outline rounded-lg text-md px-4 py-2 pr-10 cursor-pointer text-mainText focus:outline-none"
              >
                <option value="asc_price">Price: Low → High</option>
                <option value="desc_price">Price: High → Low</option>
                <option value="default">Default</option>
              </select>

              <Icon
                name="heroicons-chevron-down-20-solid"
                class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none w-6 h-6 sm:w-7 sm:h-7 text-mainText"
              />
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-20 text-onMainText">
          Loading...
        </div>

        <!-- Products Grid -->
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
        >
          <GameCard
            v-for="(p, index) in products"
            :key="p.id + '-' + index"
            :product="normalizeProduct(p)"
          />
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="total > perPage"
          :total="total"
          :perPage="perPage"
          :page="filters.page"
          @update:page="val => (filters.page = val)"
          class="mt-10"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '~/stores/productsStore.js'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

const loading = ref(true)
const error = ref(null)
const sortBy = ref('asc_price')  // Default to API sort

const countryId = computed(() => route.params.id)
const categoryId = computed(() => route.query.category)
const subcategoryId = computed(() => route.query.subcategory)

const categoryNames = {
  '50': 'PC Games',
  '1': 'PlayStation',
  '2': 'Xbox',
  '5': 'Nintendo'
}

const categoryName = computed(() => categoryNames[categoryId.value] || 'Category')

// Use store data
const products = computed(() => productsStore.products)
const pagination = computed(() => productsStore.pagination)

const total = computed(() => pagination.value.total || 0)
const perPage = computed(() => pagination.value.per_page || 16)

// Filters state
const genresList = ref([
  { name: 'Action', count: 15 },
  { name: 'Adventure', count: 23 },
  { name: 'Racing', count: 8 },
  { name: 'Puzzle', count: 12 },
  { name: 'Simulation', count: 5 },
])

const filters = ref({
  genres: [],
  minPrice: 0,
  maxPrice: 200,
  page: 1,
})

const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    console.log('🔄 Fetching products for country:', countryId.value, 'subcategory:', subcategoryId.value)
    await productsStore.fetchProducts(countryId.value, subcategoryId.value, filters.value.page, perPage.value, sortBy.value)
    // products aur pagination auto update honge
    console.log('✅ Products loaded:', products.value.length)
    
    if (!products.value.length) {
      error.value = 'No products available'
    }
  } catch (err) {
    console.error('❌ Products Page Error:', err)
    error.value = 'Failed to load products. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleSort = () => {
  fetchData()  // API call with new sort_type
}

// Normalize product data to match GameCard props
const normalizeProduct = (product) => {
  return {
    id: product.id,
    title: product.name,
    image: product.img,
    price: product.price,
    oldPrice: product.price_after_discount || product.price,
    discount: product.price_after_discount ? Math.round(((product.price - product.price_after_discount) / product.price) * 100) : 0,
    rating: product.reviews_avg_rating || 0,
  }
}

const onFilterUpdate = (val) => {
  filters.value = { ...filters.value, ...val }
  fetchData()
}

const clearFilters = () => {
  filters.value = { genres: [], minPrice: 0, maxPrice: 200, page: 1 }
  fetchData()
}

// Watch filters
watch(filters, () => {
  fetchData()
}, { deep: true })

onMounted(() => {
  console.log('🏁 Products Page Mounted - Country ID:', countryId.value, 'Subcategory ID:', subcategoryId.value)
  fetchData()
})
</script>