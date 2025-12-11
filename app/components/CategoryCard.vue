<template>
  <div 
    class="border border-onOutline rounded-lg p-3 hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
    @click="handleClick"
  >
    <NuxtImg 
     densities="x1"
     format="webp"
     loading="lazy"
      :src="category.logo" 
      :alt="category.name" 
      class="w-full h-32 sm:h-40 object-cover rounded-md mb-2 group-hover:scale-105 transition-transform" 
    />
    <div class="font-semibold text-center items-center text-mainText bg-primary rounded-md p-1 transition-colors">
    <h3 class="text-sm ">
      {{ category.name }}
    </h3>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  category: { 
    type: Object, 
    required: true 
  }
})

const emit = defineEmits(['select'])

const handleClick = () => {
  console.log('Category clicked:', props.category)
  emit('select', props.category.id)  // Yeh hi chahiye – parent handle karega
}
</script>