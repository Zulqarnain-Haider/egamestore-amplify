<template>
  <div v-if="productStore.loading" class="min-h-screen text-mainText font-poppins">
    <div class="w-[90%] max-w-7xl mx-auto flex flex-col gap-10 animate-fadeIn">
      <ProductOverviewSkeleton />
    </div>
  </div>
  
  <div v-else-if="productStore.error" class="text-center py-10 text-onMainText">Error: {{ productStore.error }}</div>
  <div v-else-if="!productStore.product" class="text-center py-10 text-onMainText">Product not found.</div>

  <div v-else class="min-h-screen text-mainText font-poppins">
    <div class="w-[90%] max-w-7xl mx-auto flex flex-col gap-10 animate-fadeIn">
      <!-- Conditionally show overview based on category -->
      <div v-if="route.query.static">
        <RelatedOverview :product="productStore.product" />
      </div>

      <div v-else>
        <div v-if="productStore.product.category === 'preorders'">
          <PreOrderOverview :product="productStore.product" />
        </div>

        <div v-else>
          <ProductOverview :product="productStore.product" />
        </div>
      </div>

      <!-- Highlights -->
      <ProductHighlights />

      <!-- Tabs -->
      <ProductTabs :product="productStore.product" />

      <ProductFAQ />

      <!-- Related -->
      <RelatedProducts :products="productStore.relatedProducts" class="mt-2" />

      <!-- Customer Reviews -->
      <ProductReviews :reviews="productStore.product.reviews" :currentUser="currentUser" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/userStore'
import { useProductStore } from '~/stores/productStore'
import ProductOverviewSkeleton from '~/components/ProductOverviewSkeleton.vue'

const route = useRoute()
const userStore = useUserStore()
const productStore = useProductStore()

const currentUser = ref(null)

onMounted(() => {
  currentUser.value = userStore.currentUser
  const id = route.params.id

  if (id.startsWith('related-')) {
    productStore.product = {
      id,
      title: 'Minecraft Java Edition',
      image: '/games/RelatedItem.png',
      price: 1249.99,
      rating: 80,
      platforms: ['PC', 'Xbox', 'PlayStation'],
      regions: ['Global']
    }
    productStore.relatedProducts = []
  } else {
    productStore.fetchProduct(Number(id))
  }
})
</script>