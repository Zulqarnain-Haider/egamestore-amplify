<template>
  <div 
    class="rounded-xl p-3 cursor-pointer group transition-all
           bg-bgLight border border-[#3A3F45]
           hover:border-primary hover:shadow-[0_0_12px_#FF6A16AA] hover:scale-[1.02]"
    @click="handleClick"
  >
    <!-- Image Wrapper: True 1200x630 Aspect Ratio -->
    <div class="w-full aspect-[1200/630] overflow-hidden rounded-lg">
      <NuxtImg 
        densities="x1"
        format="webp"
        loading="lazy"
        :src="category.logo"
        :alt="category.name"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Title -->
    <div 
      class="font-semibold text-center mt-3 text-onPrimary 
             bg-primary py-2 rounded-md tracking-wide"
    >
      <h3 
        class="uppercase 
               text-[10px] sm:text-xs md:text-sm lg:text-base 
               leading-tight px-1 break-words"
      >
        {{ category.name }}
      </h3>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  category: { type: Object, required: true }
})

const emit = defineEmits(['select'])

const handleClick = () => {
  emit('select', props.category.id)
}
</script>
