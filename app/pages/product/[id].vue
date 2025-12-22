<template>
  <!-- ======================================
       LOADING (SSR + CSR SAFE)
       ====================================== -->
  <div
    v-if="productStore.loading"
    class="min-h-screen text-mainText font-poppins"
  >
    <div class="w-[90%] max-w-7xl mx-auto flex flex-col gap-10 animate-fadeIn">
      <ProductOverviewSkeleton />
    </div>
  </div>

  <!-- ======================================
       ERROR (ONLY IF FETCH FAILED)
       ====================================== -->
  <div
    v-else-if="productStore.error"
    class="text-center py-10 text-onMainText"
  >
    {{ productStore.error }}
  </div>

  <!-- ======================================
       PRODUCT CONTENT
       ====================================== -->
  <div
    v-else
    class="min-h-screen text-mainText font-poppins"
  >
    <div class="w-[90%] max-w-7xl mx-auto flex flex-col gap-10 animate-fadeIn">
      <!-- Product Overview -->
      <ProductOverview :product="productStore.product" />

      <!-- Highlights (static) -->
      <ProductHighlights />

      <!-- Tabs -->
      <ProductTabs :product="productStore.product" />

      <!-- FAQ (static) -->
      <ProductFAQ />

      <!-- Related Products -->
      <RelatedProducts
        :products="productStore.relatedProducts"
        :loading="productStore.loading"
      />

      <!-- Reviews -->
      <ProductReviews
        :product="productStore.product"
        :reviews="productStore.product.reviews"
        :loading="productStore.loading"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * SSR FRIENDLY PRODUCT PAGE
 * ----------------------------------
 * This page fetches data on SERVER
 * and avoids "Product not found" flashes.
 */

import { useRoute } from 'vue-router'
import { useProductStore } from '~/stores/productStore'
import ProductOverviewSkeleton from '~/components/ProductOverviewSkeleton.vue'

const route = useRoute()
const productStore = useProductStore()

/**
 * Parse ID safely
 */
const id = Number(route.params.id)

/**
 * SERVER-SIDE FETCH
 * ----------------------------------
 * Awaiting here ensures:
 * - SSR renders full product HTML
 * - Skeleton only appears when needed
 */
if (!Number.isNaN(id)) {
  await productStore.fetchProduct(id)
} else {
  productStore.error = 'Invalid product'
}

/**
 * SEO META (SSR READY)
 */
useHead(() => {
  const p = productStore.product

  return {
    title: p
      ? `${p.name} | eGameStore`
      : 'Product | eGameStore',
    meta: [
      {
        name: 'description',
        content: p?.desc
          ? p.desc.replace(/<[^>]*>/g, '').slice(0, 160)
          : 'Buy games at best prices on eGameStore'
      }
    ]
  }
})
</script>
