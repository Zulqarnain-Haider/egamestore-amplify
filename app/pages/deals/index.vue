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
          <span class="flex gap-3 items-center text-sm sm:text-base">
            <NuxtLink class="text-mainText text-lg hover:text-primary" to="/">Home</NuxtLink>
            <i class="fa-solid fa-chevron-right text-sm text-mainText"></i>
            <h2 class="font-medium whitespace-nowrap">Deals</h2>
          </span>

          <div class="flex items-center gap-2 text-sm sm:text-base relative">
            <span class="text-mainText/80 text-xl whitespace-nowrap">Sort by:</span>

            <div class="relative">
              <select
                v-model="sortBy"
                class="bg-bgDark border appearance-none border-outline rounded-lg text-md px-4 py-2 pr-10 cursor-pointer text-mainText focus:outline-none"
              >
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
        <div v-if="pending" class="text-center py-20 text-onMainText">
          Loading...
        </div>

        <!-- Products Grid -->
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
        >
          <GameCard
            v-for="p in paginatedProducts"
            :key="p.id"
            :product="{
              id: p.id,
              title: p.name,
              image: p.img,
              discount: p.price_after_discount
                ? Math.round(((p.price - p.price_after_discount) / p.price) * 100)
                : 0,
              price: p.price_after_discount ?? p.price,
              oldPrice: p.price_after_discount ? p.price : null,
              rating: p.reviews_count || 0
            }"
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
import { ref, computed } from "vue";

const config = useRuntimeConfig();

const filters = ref({
  genres: [],
  minPrice: 0,
  maxPrice: 200,
  page: 1,
});

const sortBy = ref("default");
const perPage = 16;

/* --- Nuxt's SSR Fetch --- */
const { data, pending, error } = await useFetch(
  `${config.public.apiBase}/products/deals`,
  {
    headers: { lang: "en" },
    // caching enabled by default
  }
);

/* Clean extracted data */
const products = computed(() => data.value?.data?.cards || []);

/* Sorting */
const sortedProducts = computed(() => {
  let sorted = [...products.value];

  if (sortBy.value === "priceAsc") sorted.sort((a, b) => a.price - b.price);
  if (sortBy.value === "priceDesc") sorted.sort((a, b) => b.price - a.price);
  if (sortBy.value === "rating") sorted.sort((a, b) => b.rating - a.rating);

  return sorted;
});

const total = computed(() => sortedProducts.value.length);

/* Pagination */
const paginatedProducts = computed(() => {
  const start = (filters.value.page - 1) * perPage;
  return sortedProducts.value.slice(start, start + perPage);
});

/* Filters */
function onFilterUpdate(val) {
  filters.value = { ...filters.value, ...val };
}

function clearFilters() {
  filters.value = { genres: [], minPrice: 0, maxPrice: 200, page: 1 };
}

/* sidebar genres */
const genresList = ref([
  { name: "Action", count: 15 },
  { name: "Adventure", count: 23 },
  { name: "Racing", count: 8 },
  { name: "Puzzle", count: 12 },
  { name: "Simulation", count: 5 },
]);
</script>
