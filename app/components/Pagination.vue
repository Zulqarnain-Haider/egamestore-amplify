<template>
  <div class="flex justify-center font-inter items-center gap-2">

    <!-- Prev Button -->
    <button
      :disabled="page <= 1"
      @click="$emit('update:page', page - 1)"
      class="px-3 py-2 text-md rounded-md border border-onOutline text-mainText hover:bg-outline hover:text-white transition disabled:opacity-50"
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
        'px-5 py-2 rounded-md text-md font-medium transition',
        n === page
          ? 'bg-primary text-mainText'
          : 'bg-transparent text-onMainText hover:text-white hover:bg-outline border border-onOutline',
        n === '...' ? 'cursor-default border-none text-onMainText opacity-60' : ''
      ]"
    >
      {{ n }}
    </button>

    <!-- Next Button -->
    <button
      :disabled="page >= totalPages"
      @click="$emit('update:page', page + 1)"
      class="px-3 py-2 text-md rounded-md border border-onOutline text-mainText hover:bg-outline hover:text-white transition disabled:opacity-50"
    >
      <template v-if="iconsOnly">
        <Icon name="heroicons:chevron-right" class="text-2xl font-semibold" />
      </template>
      <template v-else>
        Next ›
      </template>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  total: { type: Number, default: 0 },
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
