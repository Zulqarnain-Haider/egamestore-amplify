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

        <!-- Breadcrumb + Sorting -->
        <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
          <span class="flex gap-1 items-center text-sm sm:text-base">
            <NuxtLink class="text-mainText text-lg hover:text-primary" to="/">{{ t('home') }}</NuxtLink>
            <Icon name="heroicons-chevron-right-20-solid" class="text-mainText w-7 h-7"/>
            <NuxtLink :to="`/category/${categoryId}`" class="hover:text-primary">
              {{ categoryName }}
            </NuxtLink>
            <Icon name="heroicons-chevron-right-20-solid" class="text-mainText w-7 h-7"/>
            <NuxtLink
              v-if="subcategoryName"
              :to="`/category/${categoryId}/subcategory/${subcategoryId}`"
              class="hover:text-primary font-medium capitalize whitespace-nowrap"
            >
              {{ subcategoryName }}
            </NuxtLink>
          </span>

          <div class="flex items-center gap-2 text-sm sm:text-base relative">
            <span class="text-mainText/80 text-xl whitespace-nowrap">Sort by:</span>
            <div class="relative">
              <select
                v-model="sortBy"
                @change="fetchData"
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
        <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCardSkeleton v-for="n in 8" :key="n" />
        </div>

        <!-- Products -->
        <div v-else-if="products.length > 0" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard v-for="p in products" :key="p.id" :product="normalizeProduct(p)" />
        </div>
  

        <!-- Empty State -->
<div
  v-else
  class="flex flex-col items-center justify-center py-20 text-center"
>
  <Icon
    name="heroicons-archive-box-x-mark-20-solid"
    class="w-16 h-16 text-mainText/40 mb-4"
  />
  <h3 class="text-xl font-semibold text-mainText mb-2">
   {{ t ('noProductsTitle') }}
  </h3>
  <p class="text-mainText/70 max-w-md">
        {{ t('noProductsDescStart') }}
 <span class="font-medium font-poppins text-primary">
    {{ subcategoryName || categoryName }}
  </span>     {{ t('noProductsDescEnd') }} </p>
  
</div>
        <!-- Pagination -->
        <Pagination
          v-if="total > perPage"
          :total="total"
          :perPage="perPage"
          :page="page"
          @update:page="p => router.push({ query: { ...route.query, page: p } })"
          class="mt-10"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '#imports'
import { useProductsStore } from '~/stores/productsStore'
import { useCategoriesStore } from '~/stores/categoriesStore'
import { useCategoryContext } from '~/composables/useCategoryContext'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()
const { categoryId, subcategoryId, countryId } = useCategoryContext()

const loading = ref(true)
const sortBy = ref('asc_price')
const page = computed(() => Number(route.query.page || 1))

const products = computed(() => productsStore.products)
const pagination = computed(() => productsStore.pagination)
const total = computed(() => pagination.value.total || 0)
const perPage = computed(() => pagination.value.per_page || 16)

const categoryName = computed(() => categoriesStore.getCategoryName(categoryId.value))
const subcategoryName = computed(() => categoriesStore.getSubcategoryName(subcategoryId.value))

// SEO (SSR-safe)
useHead(() => ({
  title: subcategoryName.value
    ? `${subcategoryName.value} Products | eGameStore`
    : 'Products | eGameStore',
  meta: [
    {
      name: 'description',
      content: subcategoryName.value
        ? `Buy ${subcategoryName.value} at best prices on eGameStore.`
        : 'Browse products on eGameStore.'
    }
  ]
}))

// Filters
const filters = ref({
  genres: [],
  minPrice: 0,
  maxPrice: 200
})

// Fetch products
const fetchData = async () => {
  loading.value = true
  try {
    await categoriesStore.fetchChildren(categoryId.value)
    await productsStore.fetchProducts(
      countryId.value,
      subcategoryId.value,
      page.value,
      perPage.value,
      sortBy.value
    )
  } finally {
    loading.value = false
  }
}

// Product normalizer (fix discount & price)
const normalizeProduct = (product) => {
  const hasDiscount =
    product.price_after_discount &&
    product.price_after_discount > 0 &&
    product.price_after_discount < product.price

  return {
    id: product.id,
    title: product.name,
    image: product.img,
    price: hasDiscount ? product.price_after_discount : product.price,
    oldPrice: hasDiscount ? product.price : null,
    discount: hasDiscount
      ? Math.round(((product.price - product.price_after_discount) / product.price) * 100)
      : 0,
    rating: product.reviews_avg_rating || 0,
    category: product.category,
    subCategory: product.sub_category,
    country: product.country
  }
}

// Watchers
watch(() => route.query.page, fetchData)
watch(countryId, fetchData)
watch(subcategoryId, fetchData)

onMounted(fetchData)

definePageMeta({
  isr: 300 // regenerate every 5 minutes
})
</script>
