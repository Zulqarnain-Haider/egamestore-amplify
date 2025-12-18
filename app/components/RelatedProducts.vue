<template>
  <section class="p-2 md:p-0 text-white">
    <h2 class="text-xl md:text-2xl font-semibold mb-4">Related Items</h2>

    <!-- Scrollable Wrapper -->
    <div
      ref="slider"
      class="flex gap-5 px-3 md:px-0 py-3 overflow-x-auto scroll-smooth scrollbar-hide"
      v-if="products.length > 0"
    >
      <RelatedItemCard
        v-for="product in products"
        :key="product.id"
        :image="product.image"
        :title="product.title"
        :price="product.price"
        :rating="product.rating"
        class="min-w-[85%] sm:min-w-[48%] md:min-w-[45%] lg:min-w-[30%]"
      />
    </div>

    <!-- Agar products nahi hain -->
    <p v-else class="text-onMainText">No related products found.</p>
  </section>
</template>

<script setup>
import RelatedItemCard from '~/components/RelatedItemCard.vue'  // Ensure import karo

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  }
})

// Debug log
console.log('RelatedProducts received products:', props.products)
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