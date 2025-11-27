<template>
  <div v-if="!product" class="text-center py-10 text-onMainText">Loading product...</div>

  <div v-else class="min-h-screen text-mainText font-poppins">
    <div class="w-[90%] max-w-7xl mx-auto flex flex-col gap-10 animate-fadeIn">

      <!--Conditionally show overview based on category -->
      <div v-if="route.query.static">
     <RelatedOverview :product="product" />
    </div>
  
     <div v-else>
      <div v-if="product.category === 'preorders'">
        <PreOrderOverview :product="product" />
      </div>

      <div v-else>
        <ProductOverview :product="product" />
      </div>
      </div>


      <!--Highlights -->
      <ProductHighlights />

      <!--Tabs -->
      <ProductTabs :product="product" />
   
      <ProductFAQ /> 
        
      <!--Related -->
      <RelatedProducts :products="relatedProducts" class="mt-2" />

      <!--Customer Reviews -->
      <!-- <ProductReviews 
        :reviews="reviews" 
        :currentUser="currentUser"
      /> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/userStore'
import productData from '../../../data/products.json'

const route = useRoute()
const userStore = useUserStore()

const loading = ref(true)
const product = ref(null)
const relatedProducts = ref([])
const reviews = ref([])
const currentUser = ref(null)

onMounted(() => {
  try {
     const id = route.params.id

    if (id.startsWith('related-')) {
      // Static related item product
      product.value = {
        id,
        title: 'Minecraft Java Edition',
        image: '/games/RelatedItem.png',
        price: 1249.99,
        rating: 80,
        platforms: ['PC', 'Xbox', 'PlayStation'],
        regions: ['Global']
      }
      } else {
     const allProducts = productData || []
    const currentId = Number(route.params.id)
    const foundProduct = allProducts.find(p => p.id === currentId)
    product.value = foundProduct || null

    if (product.value) {
      relatedProducts.value = allProducts.filter(
        p => p.category === product.value.category && p.id !== currentId
      )
      reviews.value = product.value.reviews || []
    }
  }
    currentUser.value = userStore.currentUser
  } catch (error) {
    console.error('❌ Failed to load product details:', error)
  } finally {
    loading.value = false
  }
})
</script>
