<template>
  <div class="min-h-screen text-mainText py-10 px-6 md:px-16 ">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 font-poppins">

      <!--Left: Cart Items -->
      <div class="flex-1 space-y-6">
        <div v-for="item in cartItems" :key="item.id"
          class="flex flex-col md:flex-row gap-5 border border-onFooter/80 rounded-xl bg-[#22262B] p-5 relative">
          <!--Remove Button -->
          <button @click="removeItem(item.id)"
            class="absolute top-3 right-3 text-onMainText/70 hover:text-red-500 transition" title="Remove item">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>

          <!-- Image -->
          <NuxtImg densities="x1" quality="80" loading="lazy" format="webp" :src="item.image" alt="game"
            class="w-40 h-44 object-cover rounded-lg" />

          <!-- Info -->
          <div class="flex flex-col space-y-3 justify-between w-full">
            <!-- Title + Price -->
            <div class="text-mainText">
              <h2 class="text-lg">{{ item.title }}</h2>
              <p class="text-base mt-1 font-semibold">{{ item.price }} EGP</p>
            </div>

            <!-- Qty Controls -->
            <div class="flex border items-center border-onMainText/30 rounded-xl overflow-hidden w-fit">
              <button @click="decreaseQty(item)" class="px-3 py-1 hover:bg-primary transition">-</button>
              <span class="px-5 py-1 text-primary">{{ item.quantity }}</span>
              <button @click="increaseQty(item)" class="px-3 py-1 hover:bg-primary transition">+</button>
            </div>

            <!-- Extra Info -->
            <div class="flex flex-col flex-wrap gap-4 text-sm text-onMainText">
              <span class="text-orange-400 font-medium uppercase">{{ item.shipping || 'Free Shipping' }}</span>
              <span class="text-lg text-yellow-400">{{ item.rating }}<span
                  class="text-onFooter text-sm">/100</span></span>
              <span class="text-green-600 font-medium">{{ item.stockStatus }}</span>
            </div>
          </div>
        </div>

        <p v-if="!cartItems.length" class="text-center text-onMainText/60 mt-16 text-lg">
          Your cart is empty
        </p>
      </div>

      <!-- Right: Order Summary -->
      <div class="w-full lg:w-[350px] bg-[#282C32]/70 border border-outline rounded-xl p-6 h-fit self-start">
        <h3 class="text-lg font-semibold text-mainText mb-8">Order Summary</h3>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <p>Sub Total:</p>
            <p class="font-semibold">EGP{{ subtotal.toFixed(2) }}</p>
          </div>
          <hr class="text-mainText mb-2">
          <div class="flex justify-between">
            <p>Shipping estimate:</p>
            <p class="font-semibold">EGP{{ shipping.toFixed(2) }}</p>
          </div>
          <hr class="text-mainText">
          <div class="flex justify-between mb-2">
            <p>Tax estimate:</p>
            <p class="font-semibold">EGP{{ tax.toFixed(2) }}</p>
          </div>
          <hr class="text-mainText mb-3">
        </div>

        <div class="flex justify-between text-sm font-semibold mt-2">
          <p>ORDER TOTAL:</p>
          <p>EGP{{ total.toFixed(2) }}</p>
        </div>

        <div class="flex justify-center">

            <AppButton to="/checkout" variant="primary" extraClass="w-full mt-6 py-3 px-12 
          text-md rounded-full text-mainText font-medium hover:opacity-90 transition-all duration-300">
              Checkout
            </AppButton>
        </div>
      </div>
    </div>

    <!--Toast Notification -->
    
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useOrdersStore } from '~/stores/ordersStore.js'
import { useCart } from '~/composables/useCart.js'

const ordersStore = useOrdersStore()
const { removeFromCart } = useCart()

onMounted(() => {
  ordersStore.loadOrdersFromStorage()
})

// Computed values
const cartItems = computed(() => ordersStore.cart)
const subtotal = computed(() =>
  ordersStore.cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
)
const shipping = computed(() => 600)
const tax = computed(() => 137)
const total = computed(() => subtotal.value + shipping.value + tax.value)

// Cart functions
const increaseQty = (item) => {
  ordersStore.updateQuantity(item.id, item.quantity + 1)
}

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    ordersStore.updateQuantity(item.id, item.quantity - 1)
  }
}

const removeItem = (id) => {
  // use composable so toast is shown and store is updated
  removeFromCart(id)
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
