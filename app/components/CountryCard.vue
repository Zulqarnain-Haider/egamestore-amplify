<template>
  <div 
    class="border border-onOutline rounded-lg p-3 hover:shadow-lg hover:border-primary transition-all cursor-pointer flex flex-col items-center group"
    @click="handleClick"
  >
    <!-- Country Flag -->
    <NuxtImg
     densities="x1"
     format="webp"
     loading="lazy" 
      :src="country.flag" 
      :alt="country.name" 
      class="w-full h-28 sm:h-36 object-cover rounded-md mb-2 group-hover:scale-105 transition-transform" 
    />

    <!-- Country Name -->
     <div class="w-full p-1 rounded-md font-semibold items-center text-center bg-primary text-mainText hover:opacity-10 transition-colors">
    <h3 class="text-sm sm:text-base ">
      {{ country.name }}
    </h3>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  country: { 
    type: Object, 
    required: true 
  }
})

const emit = defineEmits(['select'])

const handleClick = () => {
  console.log('Country clicked:', props.country)
  emit('select', props.country.id)
}
</script>