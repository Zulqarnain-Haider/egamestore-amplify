<template>
  <div
    class="min-h-screen text-mainText font-poppins flex flex-col items-center py-8 px-3 sm:px-6 md:px-10 animate-fadeIn"
  >
    <div class="w-full max-w-7xl flex flex-col md:flex-row gap-8">

      <!-- Sidebar (Filters) – STATIC -->
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

        <!-- Breadcrumb + Sorting (UNCHANGED) -->
        <div class="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div class="flex items-center gap-3 text-sm sm:text-base">
            <NuxtLink class="text-mainText text-lg hover:text-primary" to="/">{{ t('home') }}</NuxtLink>
            <i class="fa-solid fa-chevron-right text-sm text-mainText"></i>
            <h2 class="font-medium">{{ t('searchResults') }} {{ searchQuery }}</h2>
          </div>

          <div class="flex items-center gap-2 text-sm sm:text-base relative">
            <span class="text-onMainText/80 text-xl">{{ t('sortBy') }}</span>

            <div class="relative">
              <select
                v-model="sortBy"
                class="bg-bgDark border appearance-none border-outline rounded-lg text-md 
                px-4 py-2 pr-10 cursor-pointer text-mainText focus:outline-none"
              >
                <option value="default">Default</option>
                <option value="priceAsc">Price: Low → High</option>
                <option value="priceDesc">Price: High → Low</option>
                <option value="rating">Rating</option>
              </select>

              <Icon
                name="heroicons-chevron-down-20-solid"
                class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none w-6 h-6 text-mainText"
              />
            </div>
          </div>
        </div>

        <!-- GRID -->
        <div
          class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
        >
          <!-- Skeletons (SSR + Client) -->
          <ProductCardSkeleton
            v-if="pending"
            v-for="i in perPage"
            :key="'skeleton-' + i"
          />

          <!-- Products -->
          <ProductCard
            v-else
            v-for="p in paginatedProducts"
            :key="p.id"
            :product="p"
          />
        </div>

        <!-- Empty -->
        <div
          v-if="!pending && !paginatedProducts.length"
          class="text-center py-20 text-onMainText"
        >
          <Icon name="mdi:magnify" class="w-16 h-16 text-primary/50 mx-auto mb-4" />
          <p class="text-lg">No products found for "{{ searchQuery }}"</p>
        </div>

        <!-- Pagination -->
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
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAsyncData } from '#app'

const route = useRoute()
const config = useRuntimeConfig()
const { t } = useI18n()

/* -------------------------
   STATIC FILTERS (UNCHANGED)
-------------------------- */
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

/* -------------------------
   STATE
-------------------------- */
const searchQuery = computed(() =>
  (route.query.q || '').toString().trim()
)

const perPage = 16
const currentPage = ref(1)
const sortBy = ref('default')

/* -------------------------
   SSR SEARCH FETCH
-------------------------- */
const { data, pending } = await useAsyncData(
  () => `search-${searchQuery.value}`,
  async () => {
    if (!searchQuery.value) {
      return { products: [] }
    }

    const res = await $fetch(
      `${config.public.apiBase}/products/search`,
      {
        params: { search: searchQuery.value }
      }
    )

    return {
      products: [
        ...(res?.data?.products?.products || []),
        ...(res?.data?.cards?.cards || [])
      ]
    }
  },
  { watch: [searchQuery] }
)

/* -------------------------
   TRANSFORM
-------------------------- */
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
      ? Math.round(
          ((apiProduct.price - apiProduct.price_after_discount) /
            apiProduct.price) *
            100
        )
      : 0,
    rating: apiProduct.reviews_avg_rating
      ? Math.round(apiProduct.reviews_avg_rating * 20)
      : 80,
    stock: apiProduct.stock || 0,
    reviews_count: apiProduct.reviews_count || 0
  }
}

const allProducts = computed(() =>
  (data.value?.products || []).map(transformProduct)
)

/* -------------------------
   SORT + PAGINATE
-------------------------- */
const sortedProducts = computed(() => {
  const list = [...allProducts.value]
  if (sortBy.value === 'priceAsc') list.sort((a, b) => a.price - b.price)
  else if (sortBy.value === 'priceDesc') list.sort((a, b) => b.price - a.price)
  else if (sortBy.value === 'rating') list.sort((a, b) => b.rating - a.rating)
  return list
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return sortedProducts.value.slice(start, start + perPage)
})

const totalProducts = computed(() => allProducts.value.length)

/* -------------------------
   WATCHERS
-------------------------- */
watch(sortBy, () => (currentPage.value = 1))

definePageMeta({
  isr: 300 // regenerate every 5 minutes
})
</script>
