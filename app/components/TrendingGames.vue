<template>
  <section class="mt-16 w-full relative">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 sm:px-6 lg:px-7">
      <h2 class="text-2xl font-semibold font-vazirmatn">
        {{ t('trendingGames') }}
      </h2>

      <NuxtLink
        to="/games?type=latest"
        class="text-onGoNext text-lg font-vazirmatn flex items-center
               cursor-pointer hover:text-primary transition"
      >
        {{ t('viewAll') }}
        <Icon name="mdi:chevron-right" class="w-10 h-10" />
      </NuxtLink>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="relative mt-8">
      <div
        class="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide
               px-6 sm:px-8 lg:px-10"
      >
        <div
          v-for="i in visibleCards"
          :key="i"
          class="flex-shrink-0
                 w-[60%] sm:w-[45%] md:w-[29%] lg:w-[23%] xl:w-[19.5%]"
        >
          <ProductCardSkeleton />
        </div>
      </div>
    </div>

    <!-- SLIDER -->
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
                 w-[60%] sm:w-[45%] md:w-[29%] lg:w-[23%] xl:w-[19.5%]"
        >
          <ProductCard
            :product="{
              id: game.id,
              title: game.name,
              image:
                game.main_image ||
                game.img ||
                (game.images?.[0]?.image ?? ''),
              discount:
                game.price_after_discount &&
                game.price_after_discount < game.price
                  ? Math.round(
                      ((game.price - game.price_after_discount) / game.price) * 100
                    )
                  : 0,
              price:
                game.price_after_discount &&
                game.price_after_discount < game.price
                  ? game.price_after_discount
                  : game.price,
              oldPrice:
                game.price_after_discount &&
                game.price_after_discount < game.price
                  ? game.price
                  : null,
              rating: game.reviews_avg_rating || 0
            }"
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

    <!-- DOTS -->
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
const { t, locale } = useI18n()
const config = useRuntimeConfig()

/* ---------------------------
   SSR FETCH (ONLY CHANGE)
--------------------------- */
const { data, pending } = await useFetch(
  `${config.public.apiBase}/products/latest?limit=26`,
  {
    headers: { 'lang': locale.value },
    key: 'trending-games'
  }
)

const games = computed(() => data.value?.data?.cards || [])
const loading = computed(() => pending.value)

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

/* SLIDER SETUP (CLIENT ONLY) */
function setupSlider() {
  if (!slider.value) return
  const first = slider.value.querySelector('div')
  if (first) {
    const style = getComputedStyle(first)
    cardWidth.value = first.offsetWidth + parseInt(style.marginRight)
  }
  slider.value.addEventListener('scroll', handleScroll)
}

/* RESPONSIVE COUNT */
const visibleCards = computed(() => {
  const w = windowWidth.value
  if (w >= 1280) return 5
  if (w >= 1024) return 4
  if (w >= 820) return 3
  return 2
})

/* PAGES (DATA DRIVEN) */
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
  const left = slider.value.scrollLeft
  const perPage = cardWidth.value * visibleCards.value
  currentPage.value = Math.min(
    Math.round(left / perPage),
    pages.value - 1
  )
}

/* LIFECYCLE */
onMounted(async () => {
  windowWidth.value = getWindowWidth()
  window.addEventListener('resize', updateWidth)

  await nextTick()
  setupSlider()
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
