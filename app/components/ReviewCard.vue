<template>
  <div
    :class="[
      'relative flex flex-col items-center transition-all duration-500 py-10 px-6 overflow-visible',
    variant === 'main' ? 'scale-105 opacity-100 z-20' :
    variant === 'left' ? 'scale-90 opacity-70 z-10 -translate-y-3' :
    variant === 'right' ? 'scale-90 opacity-70 z-10 translate-y-3' :
    'hidden'
      ]"
    style="min-height: 400px;"
  >
  <!--Background Vector -->
<NuxtImg 
densities="x1" quality="80" format="webp" preload
  :src="bgImage"
  alt="review-card-bg"
  class="absolute inset-0 object-contain z-0"
/>

  <!--Avatar -->
  <div
    :class="[
      'absolute rounded-full overflow-hidden bg-black z-20 transition-all duration-500',
      variant === 'main' ? 'w-20 h-20 -top-10' :
      variant === 'left' ? 'w-16 h-16 -top-4 ' :
      'w-16 h-16  -top-4'
    ]"
  >
    <NuxtImg
    densities="x1" quality="60" format="webp" loading="lazy"
    :src="image" alt="avatar" class="w-full h-full object-cover" />
  </div>

  <!--Name -->
  <h3
    :class="[
      'font-poppins font-semibold text-white mb-1 z-20 transition-all duration-500',
      variant === 'main' ? 'text-lg' :
      variant === 'left' ? 'text-sm mt-5 opacity-80' :
      'text-sm mt-5 opacity-80'
    ]"
  >
    {{ name }}
  </h3>

    <!--Stars -->
    <div
      class="flex justify-center mb-2 z-20 transition-all duration-500"
      :class="[isActive ? 'scale-100' : 'scale-90 opacity-70']"
    >
      <Icon
        v-for="n in 5"
        :key="n"
        :name="n <= (rating || 0) ? 'mdi:star' : 'mdi:star-outline'"
        class="mx-0.5 text-sm text-primary"
      />
    </div>

  <!--Text -->
  <p
    :class="[
      'font-poppins text-gray-200 leading-relaxed mx-auto z-20 transition-all duration-500 text-left break-words whitespace-normal overflow-hidden',
      variant === 'main' ? 'text-xs opacity-100 max-w-[240px]' :
      variant === 'left' ? 'text-[10px] opacity-70 text-center max-w-[200px]' :
      'text-[10px] opacity-70 text-center max-w-[200px]'
    ]"
  >
    {{ text }}
  </p>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string
  name: string
  rating: number
  text: string
  isActive?: boolean
  bgImage: string
  variant: "main" | "left" | "right" | "hidden"
}>()
</script>

<style scoped>
/* FontAwesome Stars Styling */
.fas,
.far {
  transition: color 0.3s ease;
}
.fas {
  color: #FF6A16;
}
.far {
  color: transparent;
  -webkit-text-stroke: 1px #FF6A16;
}
:deep(img[alt="review-card-bg"]) {
  filter: drop-shadow(0 5px 15px rgba(0,0,0,0.4));
}

</style>
