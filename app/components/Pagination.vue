<template>
  <div class="flex justify-center font-inter items-center gap-2">

    <!-- Prev Button -->
    <button
      v-if="showEdges"
      :disabled="page === 1"
      @click="emitPage(1)"
      class="page-btn"
    >
      <template v-if="iconsOnly">
        <Icon name="heroicons:chevron-left" class="text-2xl font-semibold" />
      </template>
      <template v-else>
        ‹ Prev
      </template>
    </button>

    <!-- Page Numbers -->
    <button
      v-for="n in visiblePages"
      :key="n + '-page'"
      :disabled="n === '...'"
      @click="n !== '...' && $emit('update:page', n)"
      :class="[
        'px-4 py-2 rounded-md text-base font-medium transition hidden sm:block',
        n === page
          ? 'bg-primary text-mainText'
          : 'bg-transparent text-onMainText hover:text-white hover:bg-outline border border-onOutline',
        n === '...' ? 'cursor-default border-none text-onMainText opacity-60' : ''
      ]"
    >
      {{ n }}
    </button>

    <!-- Next -->
    <button
      :disabled="page === totalPages"
      @click="emitPage(page + 1)"
      class="page-btn"
    >
      <template v-if="iconsOnly">
        <Icon name="heroicons:chevron-right" class="text-2xl font-semibold" />
      </template>
      <template v-else>
        Next ›
      </template>
    </button>

    <!-- Last Page -->
    <button
      v-if="showEdges"
      :disabled="page === totalPages"
      @click="emitPage(totalPages)"
      class="page-btn"
    >
      <Icon v-if="iconsOnly" name="heroicons:chevron-double-right" class="text-xl" />
      <span v-else>Last</span>
    </button>

  </div>
</template>

<script setup>
const props = defineProps({
  total: Number,
  perPage: { type: Number, default: 16 },
  page: { type: Number, default: 1 },
  iconsOnly: { type: Boolean, default: false }
})

const emits = defineEmits(['update:page'])

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.perPage))
)

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = props.page

  // Always show first page
  pages.push(1)

  // Calculate window (2 before, 2 after)
  const start = Math.max(2, current - 2)
  const end = Math.min(total - 1, current + 2)

  // Add dots if needed after first page
  if (start > 2) pages.push('...')

  // Middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Add dots before last page
  if (end < total - 1) pages.push('...')

  // Always show last page
  if (total > 1) pages.push(total)

  return pages
})
</script>

<style scoped>
.page-btn {
  @apply px-3 py-2 text-base rounded-md border border-onOutline text-mainText hover:bg-outline hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed;
}
</style>
