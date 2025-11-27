<template>
  <NuxtLink :to="`/product/${product.id}`" class="relative bg-surface border border-onOutline rounded-xl p-3 sm:p-4 md:p-5 shadow-md 
    hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">

    <!-- Game Image -->
    <div class="relative mb-2 md:mb-1 xl:mb-3">
      <NuxtImg :src="product.image" :alt="product.title" format="webp" quality="75" densities="x1 x2" loading="lazy"
        class="w-full h-[180px] sm:h-[180px] md:h-[180px] lg:h-[190px] xl:h-[230px] object-cover rounded-lg"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
      <span v-if="product.discount" class="absolute top-0 left-0 bg-onGoNext text-onError 
        text-xs md:text-sm font-vazirmatn px-2 py-1 rounded-lg z-20">
        {{ product.discount }}%
      </span>
    </div>

    <!-- Title + Stars -->
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-xs sm:text-xs md:text-sm text-mainText truncate">
        {{ product.title }}
      </h3>
      <div class="flex text-primary text-[10px]">
        <template v-for="n in 5" :key="n">
          <Icon :name="n <= Math.round(product.rating / 20) ? 'mdi:star' : 'mdi:star-outline'" class="h-3 w-3 md:w-4 md:h-4" />
        </template>
      </div>
    </div>

    <!-- Price + Rating -->
    <div class="flex items-center justify-between mt-2 md:mt-1 xl:mt-2">
      <div class="flex items-end gap-1 md:gap-1 xl:gap-2">
        <span class="line-through text-onMainText text-xs sm:text-sm flex items-baseline">
          {{ product.oldPrice }}$ 
        </span>
        <span class="text-mainText text-xs sm:text-base flex items-baseline">
          {{ product.price }}$ 
        </span>
      </div>
      <div class="flex items-center gap-1 font-medium">
        <NuxtImg src="/games/fi.jpg" alt="rating" quality="80" width="20" height="20" densities="x1" loading="lazy"
          class="w-4 h-4 sm:w-5 sm:h-5" />
        <span class="text-yellow-400 font-semibold text-xs sm:text-sm">{{ product.rating }}</span>
        <span class="text-onMainText text-xs">/100</span>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex gap-2 mt-3 md:mt-1 xl:mt-3">
      <AppButton 
        class="flex-1" 
        :height="38" 
        variant="outline" 
        extraClass="text-xs py-2 px-2 rounded-xl whitespace-nowrap"
        @click.stop.prevent="handleAddToCart"
      >
        Add to Cart
      </AppButton>
      <AppButton 
        to="/checkout" 
        class="flex-1" 
        :height="38" 
        variant="primary" 
        extraClass="text-xs py-2 px-2 rounded-xl whitespace-nowrap"
      >
        Buy Now
      </AppButton>
    </div>
  </NuxtLink>
</template>

<script setup>
import { useCart } from '~/composables/useCart.js'

const { addToCart } = useCart()

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const handleAddToCart = () => {
  addToCart(props.product)
}
</script>