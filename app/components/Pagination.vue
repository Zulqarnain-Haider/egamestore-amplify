<template>
  <div class="flex justify-center items-center gap-2">

    <button
      :disabled="page === 1"
      @click="$emit('update:page', page - 1)"
      class="page-btn"
    >
      ‹ Prev
    </button>

    <button
      v-for="n in visiblePages"
      :key="n"
      :disabled="n === '...'"
      @click="n !== '...' && $emit('update:page', n)"
      :class="[
        'px-4 py-2 rounded-md',
        n === page ? 'bg-primary text-white' : 'border'
      ]"
    >
      {{ n }}
    </button>

    <button
      :disabled="page === totalPages"
      @click="$emit('update:page', page + 1)"
      class="page-btn"
    >
      Next ›
    </button>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: Number,
  perPage: Number,
  page: Number
})

const totalPages = computed(() =>
  Math.ceil(props.total / props.perPage)
)

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, props.page - 2)
  const end = Math.min(totalPages.value, props.page + 2)

  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
</script>

<style scoped>
.page-btn {
  @apply px-3 py-2 border rounded-md disabled:opacity-50;
}
</style>
