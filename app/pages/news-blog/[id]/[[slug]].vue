<template>
  <div class="min-h-screen text-mainText font-poppins bg-bgDark">
    <section v-if="pending" class="text-center py-16 text-onMainText">
      Loading post...
    </section>

    <section v-else-if="error" class="text-center py-16 text-error">
      Failed to load post.
    </section>

    <section v-else class="max-w-5xl mx-auto py-10 px-4">
      <!-- Title -->
      <h1 class="text-3xl sm:text-4xl font-bold text-white text-center mb-6">
        {{ post.title }}
      </h1>

      <!-- Tags -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <span
          v-for="tag in post.tags"
          :key="tag.id"
          class="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm"
        >
          {{ tag.name }}
        </span>
      </div>

      <!-- Image -->
      <div class="rounded-2xl overflow-hidden shadow-lg mb-8">
        <NuxtImg
          :src="post.img"
          densities="x1"
          quality="85"
          format="webp"
          loading="lazy"
          class="w-full object-cover"
          alt="blog image"
        />
      </div>

      <!-- Description -->
      <article
        class="prose prose-invert max-w-none text-gray-200"
        v-html="post.desc"
      ></article>

      <!-- Meta Info -->
      <div class="mt-10 border-t border-gray-700 pt-5 text-sm text-gray-400 text-center">
        <p>Published on {{ formatDate(post.created_at) }}</p>
        <p v-if="post.author?.name">By {{ post.author.name }}</p>

        <NuxtImg
          v-if="post.author?.image"
          densities="x1"
          quality="80"
          format="webp"
          loading="lazy"
          :src="post.author.image"
          alt="author"
          class="w-10 h-10 rounded-full mx-auto mt-2"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const config = useRuntimeConfig()
const route = useRoute()

/* =========================
   ROUTE PARAMS
========================= */
const postId = computed(() => Number(route.params.id))

/* =========================
   FETCH BY ID (SSR SAFE)
========================= */
const { data, pending, error } = await useFetch(
  () => `${config.public.apiBase}/posts/${postId.value}`,
  {
    headers: { Accept: 'application/json' }
  }
)

/* =========================
   DATA
========================= */
const post = computed(() => data.value?.data || {})

/* =========================
   HELPERS
========================= */
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<style scoped>
.prose p {
  margin-bottom: 1.2em;
  line-height: 1.8;
}
</style>
