<template>
  <div class="flex justify-center font-inter items-center gap-2">
    <!-- Prev Button -->
    <button
      :disabled="page <= 1"
      @click="$emit('update:page', page - 1)"
      class="px-7 py-2 text-md rounded-md border border-onOutline text-mainText hover:bg-outline hover:text-white transition disabled:opacity-50"
    >
    <template v-if="iconsOnly">
        <i class="fa-solid fa-chevron-left text-xl"></i>
      </template>
      <template v-else>
        ‹ Prev
      </template>
    </button>

    <!-- Page Numbers -->  
    <button
      v-for="n in totalPages"
      :key="n"
      @click="$emit('update:page', n)"
      :class="[
        'px-5 py-2 rounded-md text-md font-medium transition',
        n === page
          ? 'bg-primary text-mainText'
          : 'bg-transparent text-onMainText hover:text-white hover:bg-outline border border-onOutline'
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
        <Icon name="" class="text-xl" />
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
  iconsOnly: { type: Boolean, default: false } // NEW PROP
})
const emits = defineEmits(['update:page'])
const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.perPage))
)
</script>
