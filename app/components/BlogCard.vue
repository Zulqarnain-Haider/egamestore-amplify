<template>
  <NuxtLink
    :to="postUrl"
    class="bg-bgDark rounded-xl overflow-hidden shadow-md hover:shadow-lg font-poppins transition-all relative"
  >
    <!-- Image with gradient overlay -->
    <div class="relative">
      <NuxtImg
        densities="x1"
        quality="80"
        format="webp"
        :src="image"
        alt="blog image"
        class="w-full h-52 object-cover"
      />
      <div class="absolute inset-0 bg-black/30"></div>

      <!-- Dynamic Tag -->
      <span
        class="absolute top-3 left-3 text-white text-md px-3 py-1 rounded-xl font-medium"
        :class="tagClass"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col gap-3">
      <h3 class="text-xl font-semibold leading-tight">
        {{ title }}
      </h3>

      <p class="text-md text-onFooter line-clamp-3">
        {{ description }}
      </p>

      <!-- Author Info -->
      <div class="flex items-center gap-3 mt-4">
        <NuxtImg
          v-if="authorImage"
          densities="x1"
          quality="80"
          format="webp"
          loading="lazy"
          :src="authorImage || '/games/BlogUser1.jpg'"
          alt="author"
          class="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p class="text-sm font-medium">{{ author }}</p>
          <span class="text-xs text-onFooter">{{ time }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: { type: [Number, String], required: true }, // ✅ added
  image: String,
  tag: { type: String, default: 'General' },
  title: String,
  description: String,
  author: String,
  authorImage: String,
  time: String,
  slug: String
})

/* ✅ FINAL URL LOGIC */
const postUrl = computed(() => {
  return props.slug
    ? `/news-blog/${props.id}/${props.slug}`
    : `/news-blog/${props.id}`
})

const tagClass = computed(() => {
  switch (props.tag?.toLowerCase()) {
    case 'features':
    case 'general':
      return 'bg-orange-600'
    case 'patch notes':
      return 'bg-green-600'
    case 'esports':
      return 'bg-purple-600'
    case 'sales':
    case 'sale':
      return 'bg-red-600'
    default:
      return 'bg-gray-600'
  }
})
</script>
