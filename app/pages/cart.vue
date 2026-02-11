<template>
  <div class="min-h-screen text-mainText py-10 px-6 md:px-16">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 font-poppins">

      <!--Left: Cart Items -->
      <div class="flex-1 space-y-6">
        <NuxtLink v-for="item in cartItems" 
         :key="item.id"
         :to="`/product/${item.id}`"
          class="flex flex-col md:flex-row gap-5 border border-onFooter/80 rounded-xl
           bg-[#22262B] hover:border-primary transition p-5 relative">
          <!--Remove Button -->
          <button
            class="absolute top-3 right-3 text-onMainText/70 hover:text-red-500 transition" :title="t('cartRemoveItem')"
            @click.stop.prevent="removeItem(item.id)"
            >
            <Icon name="mdi:close" class="w-5 h-5"/>
          </button>

          <!-- Image -->
          <NuxtImg densities="x1" quality="80" loading="lazy" format="webp" :src="item.image" alt="game"
            class="w-40 h-44 object-cover rounded-lg" />

          <!-- Info -->
          <div class="flex flex-col space-y-3 justify-between w-full">
            <!-- Title + Price -->
            <div class="text-mainText">
              <h2 class="text-lg">{{ item.title }}</h2>
              <p class="text-base mt-1 font-semibold">{{ item.price }} USD</p>
            </div>

            <!-- Qty Controls -->
            <div class="flex border items-center border-onMainText/30 rounded-xl overflow-hidden w-fit">
              <button class="px-3 py-1 hover:bg-primary transition" @click.stop.prevent="decreaseQty(item)">-</button>
              <span class="px-5 py-1 text-primary">{{ item.qty }}</span>
              <button class="px-3 py-1 hover:bg-primary transition" @click.stop.prevent="increaseQty(item)">+</button>
            </div>

            <!-- Extra Info -->
            <div class="flex flex-col flex-wrap gap-4 text-sm text-onMainText">
              <span class="text-orange-400 font-medium uppercase">{{ item.shipping || t('cartFreeShipping') }}</span>
              <span class="text-lg text-yellow-400 flex items-center gap-1">
                <NuxtImg src="/games/fi.jpg" alt="rating" quality="80" width="20" height="20" densities="x1"
                  loading="lazy" class="w-4 h-4 sm:w-5 sm:h-5" />{{ item.rating }}<span
                  class="text-onFooter text-sm">/100</span>
              </span>
              <span class="text-green-600 font-medium">{{ item.stockStatus }}</span>
            </div>
          </div>
        </NuxtLink>

        <p v-if="!cartItems.length" class="text-center text-onMainText/60 mt-16 text-lg">
          {{ t('cartEmpty') }}
        </p>
      </div>

      <!-- Right: Order Summary -->
      <div class="w-full lg:w-[370px] bg-[#282C32]/70 border border-outline rounded-xl p-6 h-fit self-start">
        <h3 class="text-lg font-semibold text-mainText mb-8">{{ t('cartOrderSummary') }}</h3>
  
        <!-- Checkout-style Product List -->
           <div class="mb-6">
             <!-- Header -->
             <div
               class="flex justify-between text-xs uppercase
              border-b border-white pb-2 mb-3"
             >
          <span>{{ t('checkoutProduct') }}</span>
          <span>{{ t('checkoutPrice') }}</span>
         </div>

             <!-- Empty -->
             <p
               v-if="!cartItems.length"
               class="text-center text-onMainText/60 text-sm py-4"
             >
               {{ t('cartEmpty') }}
             </p>

             <!-- Items -->
             <div
               v-for="item in cartItems"
               :key="item.id"
               class="flex justify-between items-center py-3
                      border-b border-outline/40  text-sm"
             >
               <div class="flex items-center gap-3">
                 <NuxtImg
                   :src="item.image"
                   densities="x1"
                   quality="80"
                   format="webp"
                   class="w-10 h-10 object-cover rounded"
                 />
                 <div>
                   <p class="font-medium text-mainText leading-tight">
                     {{ item.title }}
                   </p>
                   <p class="text-sm text-onMainText">
                     x{{ item.qty }}
                   </p>
                 </div>
               </div>

               <p class="font-semibold ml-3 flex-nowrap">
                 {{ (item.price * item.qty).toFixed(2) }}USD
               </p>
             </div>
           </div>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <p>{{ t('cartSubtotal') }}:</p>
            <p class="font-semibold">USD {{ cartTotal.toFixed(2) }}</p>
          </div>
          <hr class="text-mainText mb-2">
          
          <!-- <hr class="text-mainText mb-2">
          <div class="flex justify-between">
            <p>Shipping estimate:</p>
            <p class="font-semibold">USD 600</p>
          </div>
          <hr class="text-mainText">
          <div class="flex justify-between mb-2">
            <p>Tax estimate:</p>
            <p class="font-semibold">USD 137</p>
          </div>
          <hr class="text-mainText mb-3"> -->
        </div>

        <div class="flex justify-between text-sm font-semibold mt-2">
          <p>{{ t('cartOrderTotal') }}:</p>
          <p>USD {{ cartTotal.toFixed(2) }}</p>
        </div>

        <div class="flex justify-center">
          <AppButton to="/checkout" variant="primary" extraClass="w-full mt-6 py-3 px-12 
          text-md rounded-full text-mainText font-medium hover:opacity-90 transition-all duration-300">
            {{ t('cartCheckout') }}
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import { useCart } from '~/composables/useCart'

const cartStore = useCartStore()
const { t } = useI18n()
const { updateQty, removeCard } = useCart()

onMounted(() => {
  cartStore.fetchCart({})
})

/**
 * Normalize backend cart item to UI-friendly structure
 */
const cartItems = computed(() =>
  cartStore.items.map(item => {
    const hasDiscount =
      item.price_after_discount &&
      item.price_after_discount > 0 &&
      item.price_after_discount < item.price

    return {
      id: item.id,
      title: item.name,
      image: item.img,
      qty: item.qty,
      price: hasDiscount ? item.price_after_discount : item.price,
      oldPrice: hasDiscount ? item.price : null,

      // Rating (same logic as product cards)
      rating: item.reviews_avg_rating
        ? Math.round(item.reviews_avg_rating)
        : 0,

      // Shipping logic
      shipping:
        item.delivery_time && item.delivery_time.length
          ? item.delivery_time
          : 'Free Shipping',

      // Stock logic (ported from old Vue mixin)
      stockStatus:
        item.type === 2 || (item.type === 1 && item.stock === 0)
          ? t('cartOutOfStock')
          : t('cartInStock')
    }
  })
)

// Use API total directly from cart store
const cartTotal = computed(() => cartStore.totalPrice || 0)

const increaseQty = async (item) => {
  await updateQty(item, item.qty + 1)
}

const decreaseQty = async (item) => {
  if (item.qty > 1) {
    await updateQty(item, item.qty - 1)
  }
}

const removeItem = async (id) => {
  await removeCard(id)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>