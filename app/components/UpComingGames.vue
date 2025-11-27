<template>
  <section class="mt-16 text-white w-full relative">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 sm:px-6 lg:px-7">
      <h2 class="text-2xl font-semibold font-vazirmatn">Up Coming Games</h2>
      <NuxtLink
        :to="`/category/preorders`"
        class="text-onGoNext text-lg font-vazirmatn flex items-center cursor-pointer hover:text-primary transition"
      >
        View All
        <Icon name="mdi:chevron-right" alt="" class="w-10 h-10" />
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10 text-onMainText">Loading upcoming games...</div>

    <!-- Slider -->
    <div v-else class="relative mt-8">
      <div ref="slider" class="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-6 sm:px-8 lg:px-10">
        <div
          v-for="game in games"
          :key="game.id"
          class="flex-shrink-0 w-[60%] sm:w-[45%] md:w-[29%] lg:w-[23%] xl:w-[19.5%]"
        >
          <GameDetails :product="game" class="border border-outline" />
        </div>
      </div>

      <!-- Arrows -->
      <button
        @click="scrollLeft"
        class="hidden md:flex absolute -left-3 lg:left-2 xl:-left-5 top-1/2 -translate-y-1/2 z-30 bg-black/20 p-1 hover:bg-primary/70 transition"
      >
     <Icon name="heroicons:chevron-left" class="w-12 h-12" />
      </button>
      <button
        @click="scrollRight"
        class="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-30 bg-black/20 p-1 hover:bg-primary/70 transition"
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
import { ref, computed, onMounted, nextTick } from 'vue'
import products from '../../data/products.json'

const games = ref([])
const loading = ref(true)
const slider = ref(null)
const cardWidth = ref(0)
const currentPage = ref(0)
const windowWidth = ref(1280)

onMounted(async () => {
  if (process.client) {
    windowWidth.value = window.innerWidth
    window.addEventListener('resize', () => (windowWidth.value = window.innerWidth))

    try {
      games.value = (products || [])
        .filter((item) => item.category === 'preorders')
        .slice(0, 30)
    } catch (e) {
      console.error('Failed to load preorders:', e)
    } finally {
      loading.value = false
    }

    await nextTick()
    if (slider.value) {
      const first = slider.value.querySelector('div')
      if (first) cardWidth.value = first.offsetWidth + 16
    }
  }
})

const visibleCards = computed(() => {
  const w = windowWidth.value
  if (w >= 1280) return 5
  if (w >= 1024) return 4
  if (w >= 820) return 3
  return 2
})

const pages = computed(() => Math.ceil(games.value.length / visibleCards.value))
const currentDot = computed(() => Math.min(Math.round((currentPage.value * 5) / (pages.value - 1)), 5))

function scrollLeft() {
  slider.value?.scrollBy({ left: -cardWidth.value * visibleCards.value, behavior: 'smooth' })
  currentPage.value = Math.max(currentPage.value - 1, 0)
}

function scrollRight() {
  slider.value?.scrollBy({ left: cardWidth.value * visibleCards.value, behavior: 'smooth' })
  currentPage.value = Math.min(currentPage.value + 1, pages.value - 1)
}
</script>

<style scoped>
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>
