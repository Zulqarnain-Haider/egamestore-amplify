<template>
  <section class="mt-16 text-white w-full relative">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 sm:px-6 lg:px-7">
      <h2 class="text-2xl font-semibold font-vazirmatn">Bestsellers</h2>
      <NuxtLink
        :to="`/category/bestsellers`"
        class="text-onGoNext text-lg font-vazirmatn flex items-center cursor-pointer hover:text-primary transition"
      >
        View All
        <Icon name="mdi:chevron-right" class="w-10 h-10" />
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10 text-onMainText">
      Loading bestsellers...
    </div>

    <!-- Slider -->
    <div v-else class="relative mt-8 overflow-visible z-[1]">
      <div
        ref="slider"
        class="flex gap-4 py-2 overflow-x-auto scroll-smooth scrollbar-hide px-6 sm:px-8 lg:px-10"
      >
        <div
          v-for="(g, i) in products"
          :key="g.id"
          class="flex-shrink-0 w-[60%] sm:w-[45%] md:w-[29%] lg:w-[23%] xl:w-[19.5%]"
        >
         <GameCard
        class="border border-onOutline"
        :product="g"
        />
        </div>
      </div>

      <!-- Left Arrow -->
      <button
        @click="scrollLeft"
        class="hidden md:flex absolute -left-3 lg:left-2 xl:-left-5 top-1/2 -translate-y-1/2 z-[60] bg-black/10 p-1 border border-white hover:bg-primary/70 transition"
      >
     <Icon name="heroicons:chevron-left" class="w-12 h-12" /> 
          </button>

      <!-- Right Arrow -->
      <button
        @click="scrollRight"
        class="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-[60] bg-black/10 p-1 border border-white hover:bg-primary/70 transition"
      >
     <Icon name="heroicons:chevron-right" class="w-12 h-12" />
      </button>
    </div>

    <!-- Pagination Dots (Always 6) -->
    <div class="flex justify-center items-center mt-6 gap-2">
      <span
        v-for="i in 6"
        :key="i"
        class="rounded-full transition-all duration-300"
        :class="[
          currentDot === i - 1 ? 'bg-primary w-3 h-3' : 'bg-white/30 w-2 h-2'
        ]"
      ></span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const products = ref([])
const loading = ref(true)
const slider = ref(null)
const cardWidth = ref(0)
const currentPage = ref(0)
const width = ref(1024) // fallback for SSR

// Window width helpers
const getWindowWidth = () => (typeof window !== 'undefined' ? window.innerWidth : 1024)
const updateWidth = () => (width.value = getWindowWidth())
const getVisibleCards = () => {
  const w = width.value
  if (w >= 1536) return 6
  if (w >= 1280) return 5
  if (w >= 1024) return 4
  if (w >= 820) return 3
  return 2
}

// Pagination & dots
const pages = computed(() => Math.ceil(products.value.length / getVisibleCards()))
const currentDot = computed(() => {
  if (pages.value <= 6) return currentPage.value
  const step = (pages.value - 1) / 5
  return Math.min(Math.round(currentPage.value / step), 5)
})

// Scroll functions
const updateCurrentPage = (dir) => {
  currentPage.value = Math.min(Math.max(currentPage.value + dir, 0), pages.value - 1)
}

const scrollLeft = () => {
  if (!slider.value) return
  slider.value.scrollBy({ left: -cardWidth.value * getVisibleCards(), behavior: 'smooth' })
  updateCurrentPage(-1)
}

const scrollRight = () => {
  if (!slider.value) return
  slider.value.scrollBy({ left: cardWidth.value * getVisibleCards(), behavior: 'smooth' })
  updateCurrentPage(1)
}

// Manual scroll tracking
const handleScroll = () => {
  if (!slider.value || cardWidth.value === 0) return
  const scrollLeft = slider.value.scrollLeft
  const cardsVisible = getVisibleCards()
  const newPage = Math.round(scrollLeft / (cardWidth.value * cardsVisible))
  currentPage.value = Math.min(newPage, pages.value - 1)
}

// Fetch bestsellers from API
const config = useRuntimeConfig()
onMounted(async () => {
  updateWidth()
  window.addEventListener('resize', updateWidth)

  try {
    const data = await $fetch(`https://api.egyptgamestore.com/api/products/best-selling?limit=15&days=30`, {
      headers: {
      "Accept-language": "en",
      // "Accept": "*/*" 
     },
    })
        console.log("API RAW:", data)  

if (data.status && data.data.products) {
  products.value = data.data.products.map(p => ({
    id: p.id,
    slug: p.slug || p.id, // fallback if slug missing
    title: p.name,
    image: p.main_image || p.img || (p.images?.[0]?.image ?? ''),
    discount:
      p.price_after_discount && p.price_after_discount < p.price
        ? Math.round(((p.price - p.price_after_discount) / p.price) * 100)
        : 0,
    price:
      p.price_after_discount && p.price_after_discount < p.price
        ? p.price_after_discount
        : p.price,
    oldPrice:
      p.price_after_discount && p.price_after_discount < p.price
        ? p.price
        : null,
    rating: p.reviews_avg_rating || 0
  }))
}
    else console.error('Failed to load bestsellers', data.message)
  } catch (err) {
    console.error('API Error:', err)
  } finally {
    loading.value = false
  }

  await nextTick()
  if (slider.value) {
    const firstCard = slider.value.querySelector('div')
    if (firstCard) {
      const style = getComputedStyle(firstCard)
      cardWidth.value = firstCard.offsetWidth + parseInt(style.marginRight)
    }
    slider.value.addEventListener('scroll', handleScroll)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidth)
  slider.value?.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
