<template>
  <div :class="wrapperClasses + ' animate-pulse bg-surface rounded-lg overflow-hidden flex flex-col items-center'">
    <!-- Image Placeholder -->
    <div :class="`w-full aspect-[1200/630] rounded-md bg-gray-300 mb-2`"></div>

    <!-- Title Placeholder -->
    <div class="w-3/4 h-4 bg-gray-300 rounded mb-1"></div>

    <!-- Optional extra line -->
    <div v-if="showExtraLine" class="w-3/4 h-3 bg-gray-300 rounded"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  showExtraLine: { type: Boolean, default: true }
})

const wrapperClasses = 'w-full'
</script>