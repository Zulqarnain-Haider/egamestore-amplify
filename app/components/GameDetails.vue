<template>
  <NuxtLink
    :to="`/product/${product.id}`"
    class="relative bg-surface border border-outline rounded-xl p-3 sm:p-4 md:p-5 shadow-md 
    hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full"
  >
    <!-- Game Image -->
    <div class="relative mb-2 md:mb-1 xl:mb-3">
      <NuxtImg densities="x1" quality="80" format="webp" loading="lazy"
        :src="product.image"
        :alt="product.title"
        class="w-full h-[180px] sm:h-[180px] md:h-[180px] lg:h-[190px] xl:h-[230px] object-cover rounded-lg"
      />
    </div>

    <!-- Title -->
    <h3 class="font-semibold text-xs sm:text-xs md:text-sm text-mainText truncate">
      {{ product.title }}
    </h3>

    <!-- Price -->
    <div class="flex items-center justify-between mt-2 md:mt-1 xl:mt-2">
      <div class="flex items-center gap-1">
        <span class="line-through text-onMainText text-xs lg:text-sm xl:text-md">
          {{ product.oldPrice }}$ 
        </span>
        <span class="text-mainText text-sm lg:text-[15px] xl:text-[17px]">
          {{ product.price }}$ 
        </span>
      </div>
    </div>

    <!-- Pre-Order CTA: Calendar + Button -->
    <div class="flex justify-between items-center mt-3 gap-2 text-white text-xs sm:text-[11px] lg:text-[13px] xl:text-[14px]">
      <!-- Calendar + Date -->
      <div class="flex items-center text-onMainText gap-2 md:gap-1 whitespace-nowrap">
        <Icon name="material-symbols:calendar-month"
          class="w-4 h-4 sm:w-3 sm:h-3 lg:h-4 lg:w-4 opacity-80 self-center"
        />
        <span class="flex items-center">{{ product.releaseDate }}</span>
      </div>

      <!-- Pre-Order Button with Arrow -->
      <button
        @click.stop.prevent="handlePreOrder"
        class="group flex items-center gap-1 cursor-pointer whitespace-nowrap transition-transform duration-300 hover:scale-105"
      >
        <span class="font-vazirmatn">{{ product.buttonText || 'Pre-Order' }}</span>
        <Icon name="heroicons:arrow-long-right"
          alt="Arrow"
          class="w-3 h-3 sm:w-5 sm:h-5 text-orange-600 font-semibold transition-transform duration-300 group-hover:translate-x-1.5"
        />
      </button>
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

const handlePreOrder = () => {
  addToCart(props.product) // Real product from API
}
</script>