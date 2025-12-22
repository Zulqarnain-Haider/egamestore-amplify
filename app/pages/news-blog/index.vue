<template>
  <div class="min-h-screen text-mainText font-poppins">
    <!-- Category Buttons -->
    <section class="flex items-center justify-center text-center py-8 space-x-4">
      <AppButton
        :variant="activeType === 'blog' ? 'primary' : 'outline'"
        class="px-16 py-3 text-sm rounded-xl transition-all duration-300"
        :class="{ 'border border-outline text-white': activeType === 'blog' }"
        @click="switchType('blog')"
      >
        Blogs
      </AppButton>
      <AppButton
        :variant="activeType === 'news' ? 'primary' : 'outline'"
        class="px-16 py-3 text-sm rounded-xl transition-all duration-300"
        @click="switchType('news')"
      >
        News
      </AppButton>
    </section>

    <!-- Hero Section (UNCHANGED) -->
    <section
      class="relative max-w-7xl mx-auto xl:rounded-2xl overflow-hidden bg-cover bg-center font-poppins"
    >
      <NuxtImg
        src="/games/BlogBg.jpg"
        alt="Blog Background"
        densities="x1"
        quality="85"
        format="webp"
        preload
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-l from-gray-800/70 via-gray-800/60 to-bgDark/60"
      ></div>

      <div
        class="flex flex-col items-start relative z-10 px-8 py-10 sm:py-16 sm:px-10 max-w-md text-white space-y-2"
      >
        <span class="text-primary text-sm font-semibold">Breaking</span>
        <h2 class="text-3xl sm:text-4xl font-bold leading-tight">
          Cyberpunk 2077: Phantom Liberty
        </h2>
        <p class="text-sm sm:text-base text-mainText mt-3">
          Explore Dogtown, uncover a deadly spy conspiracy, and unlock new
          missions, weapons, and abilities.
        </p>
        <AppButton
          variant="primary"
          class="px-12 py-4 text-xs font-poppins rounded-full"
        >
          Read More
        </AppButton>
      </div>
    </section>

    <!-- Blog Cards -->
    <section
      class="max-w-7xl mx-auto py-16 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 font-poppins"
    >
      <!-- Skeletons (NO v-if + v-for on same tag) -->
      <template v-if="pending && !blogs.length">
        <BlogCardSkeleton
          v-for="i in limit"
          :key="'skeleton-' + i"
        />
      </template>

      <!-- Cards -->
      <template v-else>
        <BlogCard
          v-for="blog in blogs"
          :key="blog.id"
          :id="blog.id"
          :image="blog.img || blog.image"
          :tag="blog.tags?.[0]?.name || 'General'"
          :title="blog.title"
          :description="shortDesc(blog.desc)"
          :author="blog.author?.name || 'Admin'"
          :authorImage="blog.author?.img || '/games/BlogUser1.jpg'"
          :time="formatDate(blog.created_at)"
          :slug="blog.slug"
        />
      </template>
    </section>

    <!-- Load More -->
    <div
      class="flex justify-center items-center text-center pb-20"
      v-if="!pending && blogs.length && !allLoaded"
    >
      <AppButton
        variant="primary"
        class="px-8 py-3 rounded-xl"
        @click="loadBlogs"
        :disabled="pending"
      >
        Load More Articles
      </AppButton>
    </div>

    <!-- Loading / Error / Empty -->
    <div v-if="pending && blogs.length" class="text-center text-gray-400 py-16">
      Loading blogs...
    </div>
    <div v-else-if="error" class="text-center text-red-400 py-16">
      Failed to load blogs.
    </div>
    <div
      v-else-if="!blogs.length && !pending"
      class="text-center text-gray-400 py-16"
    >
      No posts found for this category.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

/* =======================
   SEO + META + OG TAGS
======================= */
useHead({
  title: 'Blogs & News | Egypt Game Store',
  meta: [
    {
      name: 'description',
      content:
        'Read the latest gaming blogs and news including releases, updates, patch notes, and industry insights.',
    },
    { property: 'og:title', content: 'Blogs & News | Egypt Game Store' },
    {
      property: 'og:description',
      content:
        'Latest gaming blogs and breaking news from Egypt Game Store.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/games/BlogBg.jpg' },
    { property: 'og:url', content: 'https://egamestore.com/news-blog' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})

/* =======================
   STATE
======================= */
const config = useRuntimeConfig()

const blogs = ref([])
const limit = 9
const page = ref(1)
const activeType = ref('blog')
const pending = ref(false)
const error = ref(false)
const allLoaded = ref(false)

/* =======================
   SSR FETCH (INITIAL)
======================= */
const { refresh } = await useAsyncData(
  () => `blogs-${activeType.value}-${page.value}`,
  async () => {
    pending.value = true
    error.value = false

    try {
      const res = await $fetch(`${config.public.apiBase}/posts`, {
        params: {
          type: activeType.value,
          limit,
          page: page.value,
        },
        headers: { Accept: 'application/json' },
      })

      const posts = res?.data?.posts || []

      if (page.value === 1) {
        blogs.value = posts
      } else {
        blogs.value.push(...posts)
      }

      if (!posts.length) {
        allLoaded.value = true
      }
    } catch (e) {
      console.error(e)
      error.value = true
    } finally {
      pending.value = false
    }
  }
)

/* =======================
   ACTIONS
======================= */
const loadBlogs = async () => {
  if (pending.value || allLoaded.value) return
  page.value++
  await refresh()
}

const switchType = async (type) => {
  if (activeType.value === type) return
  activeType.value = type
  page.value = 1
  blogs.value = []
  allLoaded.value = false
  await refresh()
}

/* =======================
   HELPERS
======================= */
const shortDesc = (html) => {
  if (!html) return ''
  const text = html.replace(/<[^>]+>/g, '')
  return text.length > 100 ? text.slice(0, 100) + '...' : text
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
