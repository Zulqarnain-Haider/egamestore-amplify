<template>
  <section class="p-2 md:p-0 text-white">
    <h2 class="text-xl md:text-2xl font-semibold mb-4">
      Related Items
    </h2>

    <!-- Skeleton Loader (Instagram-like) -->
    <div
      v-if="loading"
      class="flex gap-5 px-3 md:px-0 py-3 overflow-x-auto scrollbar-hide"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="min-w-[85%] sm:min-w-[48%] md:min-w-[45%] lg:min-w-[30%]
               bg-[#1F2227] rounded-lg p-4 animate-pulse"
      >
        <div class="h-44 bg-[#2A2E35] rounded-lg mb-4"></div>
        <div class="h-4 bg-[#2A2E35] rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-[#2A2E35] rounded w-1/2"></div>
      </div>
    </div>

    <!-- Products -->
    <div
      v-else-if="products.length > 0"
      class="flex gap-5 px-3 md:px-0 py-3 overflow-x-auto scroll-smooth scrollbar-hide"
    >
      <RelatedItemCard
        v-for="card in products"
        :key="card.id"
        :card="card"
        class="min-w-[85%] sm:min-w-[48%] md:min-w-[45%] lg:min-w-[30%]"
      />
    </div>

    <!-- Empty -->
    <p
      v-else
      class="text-onMainText text-sm"
    >
      No related products found.
    </p>
  </section>
</template>

<script setup>

defineProps({
  products: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
 