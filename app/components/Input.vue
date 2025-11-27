<template>
  <input
    :type="type"
    :placeholder="placeholder"
    v-model="model"
    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
  />
</template>

<script setup>
const model = defineModel()
defineProps({
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' }
})
</script>
