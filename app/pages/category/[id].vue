<template>
  <div
    class="min-h-screen text-mainText font-poppins flex flex-col items-center py-8 px-3 sm:px-6 md:px-10 animate-fadeIn">
    <div class="w-full max-w-7xl flex flex-col md:flex-row gap-8">

      <!-- Sidebar (Filters) -->
      <aside class="w-full md:w-64 lg:w-72 flex-shrink-0 p-4 md:p-2 border rounded-lg border-primary md:border-none">
        <FiltersSidebar :genresList="genresList" :modelValue="filters" @update:modelValue="onFilterUpdate"
          @clear="clearFilters" />
      </aside>

      <!--  Products Section -->
      <section class="flex-1 flex flex-col w-full">
        <!-- Sorting Bar -->
        <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
          <span class="flex gap-3 items-center text-sm sm:text-base">
            <NuxtLink class="text-mainText text-lg hover:text-primary" to="/">Home</NuxtLink>
            <i class="fa-solid fa-chevron-right text-sm text-mainText"></i>
            <h2 class="font-medium capitalize">{{ categoryTitle }}</h2>
          </span>

          <div class="flex items-center gap-2 text-sm sm:text-base">
            <span class="text-mainText/80 text-xl">Sort by:</span>
            <select v-model="sortBy"
              class="bg-bgDark border border-outline rounded-lg text-sm px-3 py-2 text-mainText focus:outline-none">
              <option value="default">Default</option>
              <option value="priceAsc">Price: Low → High</option>
              <option value="priceDesc">Price: High → Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        <!-- Product Grid -->
        <div v-if="loading" class="text-center py-20 text-onMainText">
          Loading...
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          <!--Pre-orders -->
          <GameDetails v-if="category === 'preorders'" v-for="p in paginatedProducts" :key="p.id" :product="p" />

          <!-- Normal Game Cards -->
          <GameCard v-else v-for="(p, index) in paginatedProducts" :key="p.id + '-' + index" :product="p" />
        </div>

        <!-- Pagination -->
        <Pagination v-if="total > perPage" :total="total" :perPage="perPage" :page="filters.page"
          @update:page="val => filters.page = val" class="mt-10" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import productData from '../../../data/products.json'

/* -------------------- CATEGORY HANDLING -------------------- */
const route = useRoute()
const category = ref(route.params.id)

const categoryTitle = computed(() => {
  const map = {
    pc: 'PC Games',
    xbox: 'Xbox Games',
    playstation: 'PlayStation Games',
    nintendo: 'Nintendo',
    gifts: 'Gift Cards',
    deals: 'Deals',
    preorders: 'Pre-orders',
    trending: 'Trending Games',
    bestsellers: 'Best Sellers',
    upcominggames: 'Up Coming Games'
  }
  return map[category.value] || 'Games'
})

/* -------------------- DATA STATE -------------------- */
const loading = ref(false)
const products = ref([])

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

const perPage = 16
const sortBy = ref('default')

/* -------------------- COMPUTED -------------------- */
const total = computed(() => products.value.length)

const sortedProducts = computed(() => {
  let sorted = [...products.value]
  if (sortBy.value === 'priceAsc') sorted.sort((a, b) => a.price - b.price)
  else if (sortBy.value === 'priceDesc') sorted.sort((a, b) => b.price - a.price)
  else if (sortBy.value === 'rating') sorted.sort((a, b) => b.rating - a.rating)
  return sorted
})

const paginatedProducts = computed(() => {
  const start = (filters.value.page - 1) * perPage
  return sortedProducts.value.slice(start, start + perPage)
})

/* -------------------- METHODS -------------------- */
function fetchProducts() {
  loading.value = true

  // Filter by category
  let filtered = productData.filter(p => p.category === category.value)

  // Apply filters
  if (filters.value.genres.length)
    filtered = filtered.filter(p => filters.value.genres.includes(p.genre))
  filtered = filtered.filter(p =>
    p.price >= filters.value.minPrice && p.price <= filters.value.maxPrice
  )

  products.value = filtered
  loading.value = false
}

function onFilterUpdate(val) {
  filters.value = { ...filters.value, ...val }
  fetchProducts()
}

function clearFilters() {
  filters.value = { genres: [], minPrice: 0, maxPrice: 200, page: 1 }
  fetchProducts()
}

/* -------------------- LIFECYCLE -------------------- */
onMounted(fetchProducts)
watch(() => route.params.id, newVal => {
  category.value = newVal
  fetchProducts()
})
</script>
