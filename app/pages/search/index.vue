<template>
  <div
    class="min-h-screen text-mainText font-poppins flex flex-col items-center py-8 px-3 sm:px-6 md:px-10 animate-fadeIn"
  >
    <div class="w-full max-w-7xl flex flex-col md:flex-row gap-8">

      <!-- Sidebar (Filters) – Static for now -->
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
        <div class="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div class="flex items-center gap-3 text-sm sm:text-base">
            <NuxtLink class="text-mainText text-lg hover:text-primary" to="/">Home</NuxtLink>
            <i class="fa-solid fa-chevron-right text-sm text-mainText"></i>
            <h2 class="font-medium">Search Results: {{ searchQuery }}</h2>
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

              <Icon
                name="heroicons-chevron-down-20-solid"
                class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none w-6 h-6 sm:w-7 sm:h-7 text-mainText"
              />
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-20">
          <Icon name="mdi:loading" class="w-12 h-12 text-primary animate-spin mx-auto" />
          <p class="text-onMainText mt-4">Searching...</p>
        </div>

        <!-- No results -->
        <div v-else-if="!paginatedProducts.length" class="text-center py-20 text-onMainText">
          <Icon name="mdi:magnify" class="w-16 h-16 text-primary/50 mx-auto mb-4" />
          <p class="text-lg">No products found for "{{ searchQuery }}"</p>
        </div>

        <!-- Product Grid -->
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
        >
          <template v-for="p in paginatedProducts" :key="p.id">
            <GameDetails v-if="p.category === 'preorders'" :product="p" />
            <GameCard v-else :product="p" />
          </template>
        </div>

        <Pagination
          v-if="totalProducts > perPage"
          :total="totalProducts"
          :perPage="perPage"
          :page="currentPage"
          @update:page="onPageChange"
          class="mt-10"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const searchQuery = ref((route.query.q || '').toString().trim())

const loading = ref(false)
const products = ref([])
const cards = ref([])
const perPage = 16
const sortBy = ref('default')
const currentPage = ref(1)

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

function transformProduct(apiProduct) {
  return {
    id: apiProduct.id,
    title: apiProduct.name || apiProduct.short_name || 'Unknown Game',
    image: apiProduct.img || '/games/default-game.png',
    price: apiProduct.price_after_discount > 0 
      ? apiProduct.price_after_discount 
      : apiProduct.price || 0,
    oldPrice: apiProduct.price_after_discount > 0 
      ? apiProduct.price 
      : apiProduct.price * 1.2,
    discount: apiProduct.price_after_discount > 0 
      ? Math.round(((apiProduct.price - apiProduct.price_after_discount) / apiProduct.price) * 100)
      : 0,
    rating: apiProduct.reviews_avg_rating 
      ? Math.round(apiProduct.reviews_avg_rating * 20)
      : 80,
    category: apiProduct.type === 0 ? 'preorders' : 'normal',
    releaseDate: apiProduct.date_start || 'TBA',
    buttonText: 'Pre-Order',
    desc: apiProduct.desc || '',
    regions: apiProduct.regions || [],
    languages: apiProduct.languages || [],
    stock: apiProduct.stock || 0,
    reviews_count: apiProduct.reviews_count || 0
  }
}

const allProducts = computed(() => [
  ...products.value.map(transformProduct),
  ...cards.value.map(transformProduct)
])

const totalProducts = computed(() => allProducts.value.length)

const sortedProducts = computed(() => {
  let list = [...allProducts.value]
  if (sortBy.value === 'priceAsc') list.sort((a, b) => a.price - b.price)
  else if (sortBy.value === 'priceDesc') list.sort((a, b) => b.price - a.price)
  else if (sortBy.value === 'rating') list.sort((a, b) => b.rating - a.rating)
  return list
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return sortedProducts.value.slice(start, start + perPage)
})

async function fetchProducts() {
  if (!searchQuery.value) return
  loading.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/products/search`, {
      params: { search: searchQuery.value }
    })
    products.value = response?.data?.products?.products || []
    cards.value = response?.data?.cards?.cards || []
  } catch (e) {
    products.value = []
    cards.value = []
  } finally {
    loading.value = false
  }
}

watch(() => route.query.q, (q) => {
  searchQuery.value = (q || '').toString().trim()
  currentPage.value = 1
  fetchProducts()
})

watch(sortBy, () => currentPage.value = 1)

onMounted(() => {
  if (searchQuery.value) fetchProducts()
})
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
