<template>
  <section class="mt-16 w-full relative">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 sm:px-6 lg:px-7">
      <h2 class="text-2xl font-semibold font-vazirmatn">Trending Games</h2>
      <NuxtLink
        :to="`/category/trending`"
        class="text-onGoNext text-lg font-vazirmatn flex items-center cursor-pointer hover:text-primary transition"
      >
        View All
        <Icon 
        name="mdi:chevron-right" alt="" class="w-10 h-10"/>
    </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10 text-onMainText">Loading trending games...</div>

    <!-- Slider -->
    <div v-else class="relative mt-8">
      <div ref="slider" class="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-6 sm:px-8 lg:px-10">
        <div
          v-for="game in games"
          :key="game.id"
          class="flex-shrink-0 w-[60%] sm:w-[45%] md:w-[29%] lg:w-[23%] xl:w-[19.5%]"
        >
          <GameCard :product="game"/>
        </div>
      </div>

      <!-- Arrows -->
      <button
        @click="scrollLeft"
        class="hidden md:flex absolute -left-3 lg:left-2 xl:-left-5 top-1/2 -translate-y-1/2 z-30 bg-black/40 p-1 hover:bg-primary/70 transition"
      >
      <Icon name="heroicons:chevron-left" class="w-12 h-12" />
      </button>
      <button
        @click="scrollRight"
        class="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-30 bg-black/40 p-1 hover:bg-primary/70 transition"
      >
     <Icon name="heroicons:chevron-right" class="w-12 h-12" />
      </button>
    </div>

    <!-- Dots -->
    <div class="flex justify-center items-center mt-6 gap-2">
      <span
        v-for="i in 6"
        :key="i"
        class="rounded-full transition-all duration-300"
        :class="[currentDot === i - 1 ? 'bg-primary w-4 h-4' : 'bg-onPrimary w-2 h-2']"
      ></span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import products from '../../data/products.json'

const games = ref([])
const loading = ref(true)
const slider = ref(null)
const cardWidth = ref(0)
const currentPage = ref(0)
const windowWidth = ref(1280)


// Safely get window width
const getWindowWidth = () => {
  if (typeof window !== 'undefined' && window.innerWidth) {
    return window.innerWidth
  }
  return 1024
}

// Update on resize
const updateWidth = () => {
  windowWidth.value = getWindowWidth()
}


// Load data + initial setup
onMounted(async () => {
  if (process.client) {

    windowWidth.value = window.innerWidth
    window.addEventListener('resize', updateWidth)

    try {
      games.value = (products || [])
        .filter((item) => item.category === 'trending')
        .slice(0, 30)
    } catch (e) {
      console.error('Failed to load trending:', e)
    } finally {
      loading.value = false
    }

    await nextTick()

    if (slider.value) {
      const first = slider.value.querySelector('div')
      if (first) {
        const style = getComputedStyle(first)
        cardWidth.value = first.offsetWidth + parseInt(style.marginRight)
      }

      //Add scroll sync for dots
      slider.value.addEventListener('scroll', handleScroll)
    }
  }
})


// Responsive visible cards
const visibleCards = computed(() => {
  const w = windowWidth.value
  if (w >= 1280) return 5
  if (w >= 1024) return 4
  if (w >= 820) return 3
  return 2
})


// Pages
const pages = computed(() =>
  Math.ceil(games.value.length / visibleCards.value)
)


// Dots logic
const currentDot = computed(() => {
  if (pages.value <= 6) return currentPage.value
  const step = (pages.value - 1) / 5
  return Math.min(Math.round(currentPage.value / step), 5)
})


// Scroll left
function scrollLeft() {
  slider.value?.scrollBy({
    left: -cardWidth.value * visibleCards.value,
    behavior: 'smooth',
  })
    setTimeout(handleScroll, 300) // 🔥 ensure dots update after scroll

  currentPage.value = Math.max(currentPage.value - 1, 0)
}

// Scroll right
function scrollRight() {
  slider.value?.scrollBy({
    left: cardWidth.value * visibleCards.value,
    behavior: 'smooth',
  })
    setTimeout(handleScroll, 300) // 🔥 ensure dots update after scroll

  currentPage.value = Math.min(currentPage.value + 1, pages.value - 1)
}


// Manual scroll → update current page
function handleScroll() {
  if (!slider.value || cardWidth.value === 0) return

  const scrollLeft = slider.value.scrollLeft
  const perPage = cardWidth.value * visibleCards.value

  const newPage = Math.round(scrollLeft / perPage)

  currentPage.value = Math.min(newPage, pages.value - 1)
}


// Cleanup
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWidth)
  }
  slider.value?.removeEventListener('scroll', handleScroll)
})
</script>


<style scoped>
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>
