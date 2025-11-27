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

    <!-- Hero Section -->
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
         class="px-12 py-4 text-xs font-poppins rounded-full">
          Read More
        </AppButton>
      </div>
    </section>

    <!-- Blog Cards -->
    <section
      class="max-w-7xl mx-auto py-16 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 font-poppins"
    >
      <BlogCard
        v-for="(blog, i) in blogs"
        :key="i"
        :image="blog.img"
        :tag="blog.tags?.[0]?.name || 'General'"
        :title="blog.title"
        :description="shortDesc(blog.desc)"
        :author="blog.author?.name || 'Admin'"
        :authorImage="blog.author?.img || '/blogs/BlogUser1.jpg'"
        :time="formatDate(blog.created_at)"
        :slug="blog.slug"
      />
    </section>

    <!-- Load More -->
    <div class="flex justify-center items-center text-center pb-20" v-if="!pending && blogs.length && !allLoaded">
      <AppButton
        variant="primary"
        class="px-8 py-3 rounded-xl"
        @click="loadBlogs"
        :disabled="pending"
      >
        <span v-if="pending">Loading...</span>
        <span v-else>Load More Articles</span>
      </AppButton>
    </div>

    <!-- Loading & Error -->
    <div v-if="pending" class="text-center text-gray-400 py-16">
      Loading blogs...
    </div>
    <div v-else-if="error" class="text-center text-red-400 py-16">
      Failed to load blogs.
    </div>
    <div v-else-if="!blogs.length && !pending" class="text-center text-gray-400 py-16">
      No posts found for this category.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()

const blogs = ref([])
const limit = 9
const page = ref(1)
const activeType = ref('blog') // default category
const pending = ref(false)
const error = ref(false)
const allLoaded = ref(false)

//Load posts (category + pagination)
const loadBlogs = async () => {
  if (pending.value || allLoaded.value) return
  pending.value = true
  error.value = false

  try {
    const { data } = await useFetch(
      `${config.public.apiBase}/posts?type=${activeType.value}&limit=${limit}&page=${page.value}`,
      { headers: { Accept: 'application/json' } }
    )

    const newBlogs = data.value?.data?.posts || []
    if (newBlogs.length) {
      blogs.value.push(...newBlogs)
      page.value++
    } else {
      allLoaded.value = true
    }
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    pending.value = false
  }
}

// Switch category (Blogs / News)
const switchType = (type) => {
  if (activeType.value === type) return
  activeType.value = type
  blogs.value = []
  page.value = 1
  allLoaded.value = false
  loadBlogs()
}

onMounted(() => loadBlogs())

// Helpers
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
