<template>
  <div class="flex justify-center items-center gap-2 font-inter select-none">

    <!-- First Page -->
    <button
      v-if="showEdges"
      :disabled="page === 1"
      @click="emitPage(1)"
      class="page-btn"
    >
      <Icon v-if="iconsOnly" name="heroicons:chevron-double-left" class="text-xl" />
      <span v-else>First</span>
    </button>

    <!-- Prev -->
    <button
      :disabled="page === 1"
      @click="emitPage(page - 1)"
      class="page-btn"
    >
      <Icon v-if="iconsOnly" name="heroicons:chevron-left" class="text-xl" />
      <span v-else>‹ Prev</span>
    </button>

    <!-- Page Numbers -->
    <button
      v-for="n in totalPages"
      :key="n"
      @click="emitPage(n)"
      :class="[
        'px-4 py-2 rounded-md text-base font-medium transition hidden sm:block',
        n === page
          ? 'bg-primary text-mainText'
          : 'bg-transparent text-onMainText hover:bg-outline hover:text-white border border-onOutline'
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
      <Icon v-if="iconsOnly" name="heroicons:chevron-right" class="text-xl" />
      <span v-else>Next ›</span>
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
  iconsOnly: { type: Boolean, default: false },
  showEdges: { type: Boolean, default: false }
})

const emit = defineEmits(['update:page'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)))

const emitPage = (n) => {
  if (n !== props.page && n >= 1 && n <= totalPages.value) {
    emit('update:page', n)
  }
}
</script>

<style scoped>
.page-btn {
  @apply px-3 py-2 text-base rounded-md border border-onOutline text-mainText hover:bg-outline hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed;
}
</style>
