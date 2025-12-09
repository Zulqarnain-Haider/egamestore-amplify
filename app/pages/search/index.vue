<template>
  <div
    class="min-h-screen text-mainText font-poppins flex flex-col items-center py-8 px-3 sm:px-6 md:px-10 animate-fadeIn"
  >
    <div class="w-full max-w-7xl flex flex-col md:flex-row gap-8">

      <!-- Sidebar (Filters) – optional -->
      <aside
        class="w-full md:w-64 lg:w-72 flex-shrink-0 p-4 md:p-2 border rounded-lg border-primary md:border-none"
      >
        <FiltersSidebar
          :genresList="genresList"
          :modelValue="filters"
          @update:modelValue="onFilterUpdate"
          @clear="clearFilters"
        />
      </aside>

      <!-- Products Section -->
      <section class="flex-1 flex flex-col w-full">
        <!-- Breadcrumb + Sorting -->
        <div class="flex flex-wrap items-center mb-6 gap-4">
          <div class="flex items-center gap-3 text-sm sm:text-base">
            <NuxtLink class="text-mainText text-lg hover:text-primary" to="/">Home</NuxtLink>
            <i class="fa-solid fa-chevron-right text-sm text-mainText"></i>
            <h2 class="font-medium">Search Results</h2>
          </div>

          <div class="flex items-center gap-2 text-sm sm:text-base relative">
            <span class="text-onMainText/80 text-xl">Sort by:</span>

              
            <div class="relative">
            <select v-model="sortBy"
              class="bg-bgDark border appearance-none border-outline rounded-lg text-md 
              px-4 py-2 pr-10 cursor-pointer text-mainText focus:outline-none">
              <option value="default">Default</option>
              <option value="priceAsc">Price: Low → High</option>
              <option value="priceDesc">Price: High → Low</option>
              <option value="rating">Rating</option>
            </select>

            <!-- Custom Arrow Icon -->
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

        <!-- No results -->
        <div v-else-if="!paginatedProducts.length" class="text-center py-20 text-onMainText">
          <p class="text-lg">No products found for “{{ searchQuery }}”</p>
        </div>

        <!-- Product Grid -->
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
        >
          <!-- Loop through products -->
          <template v-for="p in paginatedProducts" :key="p.id">
            <!-- Pre-order Card -->
            <GameDetails
              v-if="p.category === 'preorders'"
              :product="p"
            />

            <!-- Normal Game Card -->
            <GameCard
              v-else
              :product="p"
            />
          </template>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="total > perPage"
          :total="total"
          :perPage="perPage"
          :page="filters.page"
          @update:page="val => filters.page = val"
          class="mt-10"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import productsData from '~/../data/products.json' 

// -------------------------------------------------
// 1. Route & search term
// -------------------------------------------------
const route = useRoute()
const searchQuery = ref((route.query.q || '').toString().trim())

// -------------------------------------------------
// 2. Data / Filters
// -------------------------------------------------
const loading = ref(false)
const products = ref([])
const perPage = 16
const sortBy = ref('default')

const genresList = ref([
  { name: 'Action', count: 15 },
  { name: 'Adventure', count: 23 },
  { name: 'Racing', count: 8 },
  { name: 'Puzzle', count: 12 },
  { name: 'Simulation', count: 5 }
])

const filters = ref({
  genres: [],
  minPrice: 0,
  maxPrice: 200,
  page: 1
})

// -------------------------------------------------
// 3. Computed
// -------------------------------------------------
const total = computed(() => products.value.length)

const sortedProducts = computed(() => {
  let list = [...products.value]
  if (sortBy.value === 'priceAsc') list.sort((a, b) => a.price - b.price)
  if (sortBy.value === 'priceDesc') list.sort((a, b) => b.price - a.price)
  if (sortBy.value === 'rating') list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  return list
})

const paginatedProducts = computed(() => {
  const start = (filters.value.page - 1) * perPage
  return sortedProducts.value.slice(start, start + perPage)
})

// -------------------------------------------------
// 4. Fetch locally from products.json
// -------------------------------------------------
async function fetchProducts() {
  loading.value = true
  try {
    let filtered = productsData

    //Filter by search query (match title exactly like overlay)
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        p => p.title?.toLowerCase().includes(q)
      )
    }

    //Filter by genres
    if (filters.value.genres.length > 0) {
      filtered = filtered.filter(p => filters.value.genres.includes(p.genre))
    }

    //Filter by price range
    filtered = filtered.filter(
      p => p.price >= filters.value.minPrice && p.price <= filters.value.maxPrice
    )

    products.value = filtered
  } catch (e) {
    console.error('Search data error', e)
    products.value = []
  } finally {
    loading.value = false
  }
}

// -------------------------------------------------
// 5. Filter helpers
// -------------------------------------------------
function onFilterUpdate(val) {
  filters.value = { ...filters.value, ...val, page: 1 }
  fetchProducts()
}

function clearFilters() {
  filters.value = { genres: [], minPrice: 0, maxPrice: 200, page: 1 }
  fetchProducts()
}

// -------------------------------------------------
// 6. React to URL changes
// -------------------------------------------------
watch(() => route.query.q, (newQ) => {
  const q = (newQ || '').toString().trim()
  if (q !== searchQuery.value) {
    searchQuery.value = q
    filters.value.page = 1
    fetchProducts()
  }
}, { immediate: true })

// -------------------------------------------------
// 7. Initial load
// -------------------------------------------------
onMounted(() => {
  if (searchQuery.value) fetchProducts()
})
</script>
