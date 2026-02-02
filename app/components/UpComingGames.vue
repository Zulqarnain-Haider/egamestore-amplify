<template>
  <section class="mt-16 text-white w-full relative">
    <!-- Header -->
    <div class="flex items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 lg:px-7">
      <h2 class="text-2xl font-semibold font-vazirmatn whitespace-nowrap">
        {{ t('upComingGames') }}
      </h2>

      <NuxtLink
        to="/games?type=preorders"
        class="text-onGoNext text-lg font-vazirmatn flex items-center
               cursor-pointer hover:text-primary transition whitespace-nowrap"
      >
        {{ t('viewAll') }}
        <Icon name="mdi:chevron-right" class="w-7 h-7 sm:w-10 sm:h-10 mb-1" />
      </NuxtLink>
    </div>

    <!-- ===============================
         LOADING (SKELETON)
         =============================== -->
    <div v-if="loading" class="relative mt-8">
      <div
        class="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide
               px-6 sm:px-8 lg:px-10"
      >
        <div
          v-for="i in visibleCards"
          :key="i"
          class="flex-shrink-0
                 w-[60%] sm:w-[45%] md:w-[29%]
                 lg:w-[23%] xl:w-[19.5%]"
        >
          <ProductCardSkeleton />
        </div>
      </div>
    </div>

    <!-- ===============================
         REAL SLIDER
         =============================== -->
    <div v-else class="relative mt-8">
      <div
        ref="slider"
        class="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide
               px-6 sm:px-8 lg:px-10"
      >
        <div
          v-for="game in games"
          :key="game.id"
          class="flex-shrink-0
                 w-[60%] sm:w-[45%] md:w-[29%]
                 lg:w-[23%] xl:w-[19.5%]"
        >
          <PreorderCard
            class="border border-onOutline"
            :product="game"
          />
        </div>
      </div>

      <!-- Arrows -->
      <button
        class="hidden md:flex absolute -left-3 lg:left-2 xl:-left-5
               top-1/2 -translate-y-1/2 z-30
               bg-black/40 p-1 hover:bg-primary/70 transition"
        @click="scrollLeft"
      >
        <Icon name="heroicons:chevron-left" class="w-12 h-12" />
      </button>

      <button
        class="hidden md:flex absolute -right-5
               top-1/2 -translate-y-1/2 z-30
               bg-black/40 p-1 hover:bg-primary/70 transition"
        @click="scrollRight"
      >
        <Icon name="heroicons:chevron-right" class="w-12 h-12" />
      </button>
    </div>

    <!-- ===============================
         DOTS (DATA DRIVEN)
         =============================== -->
    <div class="flex justify-center items-center mt-6 gap-2">
      <span
        v-for="i in pages"
        :key="i"
        class="rounded-full transition-all duration-300"
        :class="[
          currentPage === i - 1
            ? 'bg-primary w-4 h-4'
            : 'bg-onPrimary w-2 h-2'
        ]"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import preorders from '../../data/preorders.json'

// I18N
const { t } = useI18n()

/* ---------------------------
   DATA (STATIC)
--------------------------- */
const games = computed(() =>
  Array.isArray(preorders) ? preorders.slice(0, 30) : []
)

const loading = ref(false)

/* ---------------------------
   SLIDER STATE
--------------------------- */
const slider = ref(null)
const cardWidth = ref(0)
const currentPage = ref(0)
const windowWidth = ref(1280)

/* WINDOW WIDTH */
const getWindowWidth = () =>
  typeof window !== 'undefined' ? window.innerWidth : 1024

const updateWidth = () => {
  windowWidth.value = getWindowWidth()
}

/* RESPONSIVE CARD COUNT */
const visibleCards = computed(() => {
  const w = windowWidth.value
  if (w >= 1280) return 5
  if (w >= 1024) return 4
  if (w >= 820) return 3
  return 2
})

/* PAGES (SINGLE SOURCE OF TRUTH) */
const pages = computed(() =>
  Math.max(1, Math.ceil(games.value.length / visibleCards.value))
)

/* SCROLL */
function scrollLeft() {
  slider.value?.scrollBy({
    left: -cardWidth.value * visibleCards.value,
    behavior: 'smooth'
  })
}

function scrollRight() {
  slider.value?.scrollBy({
    left: cardWidth.value * visibleCards.value,
    behavior: 'smooth'
  })
}

function handleScroll() {
  if (!slider.value || cardWidth.value === 0) return

  const perPage = cardWidth.value * visibleCards.value
  const rawPage = Math.round(slider.value.scrollLeft / perPage)

  currentPage.value = rawPage % pages.value
}


/* CLIENT-ONLY MEASURE */
onMounted(async () => {
  windowWidth.value = getWindowWidth()
  window.addEventListener('resize', updateWidth)

  await nextTick()
  if (slider.value) {
    const first = slider.value.querySelector('div')
    if (first) {
      const style = getComputedStyle(first)
      cardWidth.value = first.offsetWidth + parseInt(style.marginRight)
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
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
