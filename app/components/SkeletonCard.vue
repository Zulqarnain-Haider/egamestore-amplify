<template>
  <div :class="wrapperClasses + ' animate-pulse bg-surface rounded-lg overflow-hidden'">
    <!-- Image Placeholder -->
    <div :class="imageClasses + ' bg-gray-300 mb-2'"></div>

    <!-- Title Placeholder -->
    <div :class="titleClasses + ' bg-gray-300 rounded h-4'"></div>

    <!-- Optional extra line -->
    <div v-if="showExtraLine" class="bg-gray-300 rounded h-3 mt-1 w-3/4"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  width: { type: String, default: 'full' },   // e.g. 'full', '48', '1/2'
  height: { type: String, default: '60' },   // image height in px
  showExtraLine: { type: Boolean, default: true },
})

const wrapperClasses = `flex flex-col items-center w-${props.width}`
const imageClasses = `w-full h-[${props.height}px] rounded-md`
const titleClasses = `w-3/4`
</script>

<style scoped>
/* CSS me @apply remove kar diya */
</style>
