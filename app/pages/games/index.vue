<template>
  <div
    class="min-h-screen text-mainText font-poppins
           flex flex-col items-center
           py-8 px-3 sm:px-6 md:px-10 animate-fadeIn"
  >
    <div class="w-full max-w-7xl flex flex-col md:flex-row gap-8">

      <!-- SIDEBAR -->
      <aside
        class="w-full md:w-64 lg:w-72 flex-shrink-0
               p-4 md:p-2 border rounded-lg
               border-primary md:border-none"
      >
        <FiltersSidebar
          :genresList="genresList"
          :modelValue="filters"
          @update:modelValue="onFilterUpdate"
          @clear="clearFilters"
        />
      </aside>

      <!-- CONTENT -->
      <section class="flex-1 flex flex-col w-full">

        <!-- HEADER -->
        <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
          <span class="flex gap-2 items-center text-sm sm:text-base">
            <NuxtLink to="/" class="text-mainText text-lg hover:text-primary">
              {{ t('home') }}
            </NuxtLink>
            <Icon name="heroicons-chevron-right-20-solid" class="w-6 h-6" />
            <h1 class="font-medium capitalize whitespace-nowrap">
              {{ pageTitle }}
            </h1>
          </span>

          <!-- SORTING -->
          <div
            v-if="!isStaticType"
            class="flex items-center gap-2 text-sm sm:text-base relative"
          >
            <span class="text-mainText/80 text-xl whitespace-nowrap">
              {{ t('sortBy') }}
            </span>

            <div class="relative">
              <select
                v-model="sortBy"
                class="bg-bgDark border appearance-none
                       border-outline rounded-lg
                       text-md px-4 py-2 pr-10
                       cursor-pointer text-mainText
                       focus:outline-none"
              >
                <option value="default">Default</option>
                <option value="asc_price">Price: Low → High</option>
                <option value="desc_price">Price: High → Low</option>
                <option value="rating">Rating</option>
              </select>

              <Icon
                name="heroicons-chevron-down-20-solid"
                class="absolute right-2 top-1/2
                       -translate-y-1/2 pointer-events-none w-6 h-6"
              />
            </div>
          </div>
        </div>

        <!-- LOADING -->
        <div
          v-if="loading"
          class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <ProductCardSkeleton v-for="n in 8" :key="n" />
        </div>

        <!-- EMPTY -->
        <div
          v-else-if="products.length === 0"
          class="text-center py-20 text-onMainText text-lg"
        >
          {{ t('noGamesFound') }}
        </div>

        <!-- GRID -->
        <div
          v-else
          class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <!-- PREORDERS -->
          <template v-if="type === 'preorders'">
            <PreorderCard
              v-for="p in products"
              :key="p.id"
              :product="p"
            />
          </template>
        
          <!-- ALL OTHERS (API + GIFT CARDS JSON) -->
          <template v-else>
            <ProductCard
              v-for="p in products"
              :key="p.id"
              :product="p"
            />
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// Use I18n
const { t } = useI18n()
/* ----------------------------------
   ROUTING
---------------------------------- */
const route = useRoute()

const type = computed(() => route.query.type || 'latest')

/* ----------------------------------
   TYPE HELPERS
---------------------------------- */
const STATIC_TYPES = ['preorders', 'giftcards']
const isStaticType = computed(() => STATIC_TYPES.includes(type.value))

/* ----------------------------------
   PAGE META (SEO)
---------------------------------- */
const PAGE_META = {
  latest: {
    title: 'Trending Games',
    description: 'Discover trending games at the best prices.'
  },
  bestsellers: {
    title: 'Bestsellers',
    description: 'Top selling games loved worldwide.'
  },
  deals: {
    title: 'Deals',
    description: 'Best gaming deals and discounts.'
  },
  preorders: {
    title: 'Upcoming Games',
    description: 'Pre-order upcoming games.'
  },
  giftcards: {
    title: 'Gift Cards',
    description: 'Buy digital gaming gift cards instantly.'
  }
}

const pageTitle = computed(
  () => PAGE_META[type.value]?.title || 'Games'
)

useHead(() => ({
  title: `${pageTitle.value} | eGameStore`,
  meta: [
    {
      name: 'description',
      content:
        PAGE_META[type.value]?.description ||
        'Browse games on eGameStore.'
    }
  ]
}))

/* ----------------------------------
   FILTERS (UI ONLY)
---------------------------------- */
const filters = ref({
  genres: [],
  minPrice: 0,
  maxPrice: 200
})

const sortBy = ref('default')

const onFilterUpdate = (val) => {
  filters.value = { ...filters.value, ...val }
}

const clearFilters = () => {
  filters.value = { genres: [], minPrice: 0, maxPrice: 200 }
}

/* ----------------------------------
   STORE
---------------------------------- */
const gameListingStore = useGameListingStore()

const { pending } = await useAsyncData(
  () => `games-${type.value}`,
  () => gameListingStore.fetchByType(type.value),
  { watch: [type] }
)

/* ----------------------------------
   SORTING (CLIENT SIDE)
---------------------------------- */
const sortedProducts = computed(() => {
  const arr = [...gameListingStore.items]

  if (sortBy.value === 'asc_price')
    arr.sort((a, b) => a.price - b.price)

  if (sortBy.value === 'desc_price')
    arr.sort((a, b) => b.price - a.price)

  if (sortBy.value === 'rating')
    arr.sort((a, b) => b.rating - a.rating)

  return arr
})

const loading = computed(
  () => pending.value || gameListingStore.loading
)

const products = computed(() => sortedProducts.value)

/* ----------------------------------
   STATIC SIDEBAR DATA
---------------------------------- */
const genresList = ref([
  { name: 'Action', count: 0 },
  { name: 'Adventure', count: 0 },
  { name: 'Racing', count: 0 },
  { name: 'Simulation', count: 0 }
])
definePageMeta({
  isr: 300 // regenerate every 5 minutes
})
</script>
