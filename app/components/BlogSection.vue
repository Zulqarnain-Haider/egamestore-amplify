<template>
  <section class="w-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 sm:px-7 lg:px-8 mb-6">
      <h2 class="text-2xl font-semibold text-white font-vazirmatn">{{ t('blogPosts') }}</h2>
      <NuxtLink to="/news-blog"
        class="text-primary text-lg font-vazirmatn flex items-center cursor-pointer hover:text-primary transition"
      >
        {{ t('viewAll') }}
      <Icon name="mdi:chevron-right" class="w-10 h-10" />
         </NuxtLink>
    </div>

    <!-- BLOG GRID -->
    <div class="px-4 sm:px-6">
      <div v-if="isReady">
      <!--Desktop / Tablet -->
      <div class="hidden md:flex flex-col lg:flex-row gap-5 transition-all duration-700"
        :class="{ 'animate-slide-in': true }"
         >
        <!-- Featured -->
        <div
          v-if="currentSet.length && currentSet[4]"
          @click="goToBlog(currentSet[4].slug)"
          class="w-full lg:w-1/2 relative rounded-2xl cursor-pointer overflow-hidden transition-all duration-700"
        >
          <NuxtImg
          densities="x1" quality="80" format="webp" loading="lazy"
            :src="currentSet[4].image"
            alt="Featured Blog"
            class="w-full h-[400px] object-cover rounded-2xl"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 rounded-2xl"
          >
            <h3 class="text-xl md:text-2xl text-white mb-1">{{ currentSet[4].title }}</h3>
            <p class="text-md md:text-lg text-white">{{ currentSet[4].category }}</p>
          </div>
        </div>

        <!-- 4 Smaller -->
        <div class="w-full lg:w-1/2 grid grid-cols-2 gap-4">
          <div
            v-for="(blog, i) in currentSet.length ? currentSet.slice(0, 4) : []"
            :key="i"
            @click="goToBlog(blog.slug)"
            class="relative rounded-2xl overflow-hidden group transition-all duration-700"
          >
            <NuxtImg
          densities="x1" quality="80" format="webp" loading="lazy"
              :src="blog.image"
              alt="Blog Thumbnail"
              class="w-full h-[190px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-2 md:p-3"
            >
              <h3 class="text-sm text-white leading-tight mb-1">{{ blog.title }}</h3>
              <p class="text-sm tracking-wide text-white">{{ blog.category }}</p>
            </div>
          </div>
        </div>
      </div>

      <!--Mobile layout -->
      <div
        class="md:hidden flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth
         transition-all duration-500 px-2 py-1"
        ref="mobileScroll"
      >
        <div
          v-for="(blog, i) in [...allBlogs].slice().reverse()"
          :key="i"
           @click="goToBlog(blog.slug)"
          class="flex none min-w-[70%] h-[170px] snap-start cursor-pointer relative rounded-2xl overflow-hidden"
        >
          <NuxtImg
          densities="x1" quality="80" format="webp" loading="lazy"
            :src="blog.image"
            alt="Blog Thumbnail"
            class="absoulte inset-0 w-full h-full object-cover rounded-2xl"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-3"
          >
            <h3 class="text-[13px] text-white leading-tight mb-1 font-poppins">{{ blog.title }}</h3>
            <p class="text-[12px] tracking-wide text-white font-poppins">{{ blog.category }}</p>
          </div>
        </div>
      </div>
      </div>
    </div>

    <!-- Pagination Dots -->
    <div class="flex justify-center mt-8 gap-2 items-center">
      <span
        v-for="n in 5"
        :key="n"
        class="rounded-full transition-all duration-300 flex items-center justify-center"
        :class="[
          (n - 1) === currentDot
            ? 'bg-primary w-2.5 h-2.5 scale-110'
            : 'bg-gray-500/50 w-2 h-2'
        ]"
      ></span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// I18N
const { t } = useI18n()

// --------------------------------------
// RuntimeConfig (From .env)
// --------------------------------------
const config = useRuntimeConfig()

// --------------------------------------
// Local fallback (your existing static blogs)
// --------------------------------------
// const fallbackBlogs = [
//   { image: '/games/BlogPoster1.png', title: 'FC25 Prepares for October 2024 Release with Enhanced', category: 'Realism' },
//   { image: '/games/BlogPoster2.png', title: 'FC25 Prepares for October 2024', category: 'Release with Enhanced Realism' },
//   { image: '/games/BlogPoster3.png', title: 'Marvel’s Wolverine Set for an Epic', category: '2025 Launch on PS5' },
//   { image: '/games/BlogPoster4.png', title: 'The Witcher 4 Expected to Bring Back', category: 'Fan-Favorite Characters' },
//   { image: '/games/BlogPoster5.png', title: 'Star Wars Outlaws Combines Open', category: '-World Action and Storytelling' },
// ]

const allBlogs = ref([])
const activeIndex = ref(0)
const mobileScroll = ref(null)

const pending = ref(true)
const error = ref(null)


// -----------------------
// FETCH BLOGS
// -----------------------
const loadBlogs = async () => {
  try {
    const { data } = await useFetch(
      `${config.public.apiBase}/posts`,
      {
     server: false,
     headers: { Accept: "application/json" },
     query: {
        type: "blog",      // <-- REQUIRED
        per_page: 25       // optional
      }
     }
    )

    const posts = data.value?.data?.posts || data.value?.data || []

    allBlogs.value = posts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      category: post.tags?.[0]?.name || "Blog",
      image: post.img?.startsWith("/")
        ? config.public.apiBase.replace('/api', "") + post.img
        : post.img
    }))

  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    pending.value = false
  }
}

// -----------------------
// CLICK HANDLER FOR CARDS
// -----------------------
const goToBlog = (slug) => {
  navigateTo(`/blogs/${slug}`)
}

// -----------------------
// SLIDER COMPUTED
// -----------------------
const currentDot = computed(() => activeIndex.value % 5)
const isReady = computed(() => allBlogs.value.length >= 5 && !pending.value)

const currentSet = computed(() => {
  const len = allBlogs.value.length
    if (len < 5) return []   // prevent crash ✔

  const s = activeIndex.value

  return [
    allBlogs.value[(s + 4) % len],
    allBlogs.value[(s + 3) % len],
    allBlogs.value[(s + 2) % len],
    allBlogs.value[(s + 1) % len],
    allBlogs.value[s % len],
  ]
})

let intervalId = null

onMounted(async () => {
 await loadBlogs()

     if (allBlogs.value.length > 0) {
  intervalId = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % allBlogs.value.length

    if (mobileScroll.value) {
      mobileScroll.value.scrollTo({
        left: (activeIndex.value * mobileScroll.value.scrollWidth) / allBlogs.value.length,
        behavior: "smooth"
      })
    }
  
  }, 4000)
}
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.bg-primary {
  background-color: theme('colors.primary');
}

/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
@media (max-width: 640px) {
  /* Make mobile cards more compact and aligned like categories */
  .rounded-xl {
    border-radius: 0.75rem !important;
  }

  .h-\[140px\] {
    height: 130px !important;
  }

  .text-\[13px\] {
    font-size: 12.5px !important;
  }

  .text-\[12px\] {
    font-size: 11px !important;
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slideInRight 0.8s ease-out;
}

</style>
