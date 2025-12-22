<template>
  <div class="min-h-screen text-mainText py-10 px-4 sm:px-8 lg:px-16">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 font-poppins">

      <!-- LEFT: Personal + Address + Payment -->
      <div class="flex-1 rounded-2xl space-y-6 px-4 lg:px-0">
        <h2 class="text-md sm:text-lg font-semibold">Personal details</h2>

        <!-- Full Name (spans 2 columns) -->
        <div>
          <label class="label">Full Name <span class="text-error">*</span></label>
          <input 
            v-model="form.fullName" 
            type="text" 
            :class="inputClass('fullName')" 
            placeholder="Enter your full name *" 
          />
          <p v-if="errors.fullName" class="text-error text-xs mt-1">{{ errors.fullName }}</p>
        </div>

        <!-- Address -->
        <div class="grid grid-cols-1 gap-5">
          <h3 class="text-md sm:text-lg font-semibold mt-4">Delivery Address</h3>

          <div class="grid md:grid-cols-2 gap-5">
            <div>
              <label class="label">Country <span class="text-error">*</span></label>
              <input 
                v-model="form.country" 
                :class="inputClass('country')" 
                placeholder="Country *" 
              />
              <p v-if="errors.country" class="text-error text-xs mt-1">{{ errors.country }}</p>
            </div>
            <div>
              <label class="label">City <span class="text-error">*</span></label>
              <input 
                v-model="form.city" 
                :class="inputClass('city')" 
                placeholder="City *" 
              />
              <p v-if="errors.city" class="text-error text-xs mt-1">{{ errors.city }}</p>
            </div>
          </div>

          <div>
            <label class="label">Street Address <span class="text-error">*</span></label>
            <input 
              v-model="form.address" 
              :class="inputClass('address')" 
              placeholder="Street address *" 
            />
            <p v-if="errors.address" class="text-error text-xs mt-1">{{ errors.address }}</p>
          </div>

          <div>
            <label class="label">Phone Number <span class="text-error">*</span></label>
            <input 
              v-model="form.phone" 
              :class="inputClass('phone')" 
              placeholder="Phone number *" 
              type="tel"
            />
            <p v-if="errors.phone" class="text-error text-xs mt-1">{{ errors.phone }}</p>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="mt-6">
          <h3 class="text-md sm:text-lg font-semibold mb-3">Payment methods</h3>

          <!-- Loading State -->
          <div v-if="checkoutStore.loadingPayments" class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span class="ml-3 text-sm text-onFooter">Loading payment methods...</span>
          </div>

          <!-- Payment Options -->
          <div v-else class="space-y-2">
            <div
              v-for="method in checkoutStore.paymentMethods"
              :key="method.id"
              class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border"
              :class="checkoutStore.selectedPaymentId === method.id
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-onMainText hover:border-primary/60'"
              @click="selectPaymentMethod(method.id)"
            >
              <div class="flex items-center gap-3">
                <!-- Radio Button -->
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                  :class="checkoutStore.selectedPaymentId === method.id ? 'border-primary' : 'border-onMainText'"
                >
                  <div v-if="checkoutStore.selectedPaymentId === method.id" class="w-2.5 h-2.5 bg-primary rounded-full"></div>
                </div>

                <!-- Payment Icon -->
                <NuxtImg
                  v-if="method.logo"
                  :src="method.logo"
                  :alt="method.name"
                  class="w-10 h-10 object-contain"
                  densities="x1"
                  quality="80"
                  format="webp"
                  loading="lazy"
                />

                <!-- Payment Name -->
                <span class="text-mainText text-sm font-medium">{{ method.name }}</span>
              </div>
            </div>

            <p v-if="!checkoutStore.paymentMethods.length && !checkoutStore.loadingPayments" 
               class="text-center text-onFooter text-sm py-4">
              No payment methods available
            </p>
          </div>
        </div>
      </div>

      <!-- RIGHT: Order summary -->
      <div class="w-full lg:w-[400px] mt-8">
        <h3 class="text-lg sm:text-xl font-semibold mb-4">Order Summary</h3>
        <div class="bg-bgLight/10 border border-outline rounded-xl p-6">
          
          <!-- Cart Items -->
          <div class="border-b border-mainText pb-2 mb-3 flex justify-between text-sm uppercase">
            <span>Product</span>
            <span>Price</span>
          </div>

          <div v-if="displayItems.length === 0" class="text-center text-onFooter text-sm py-4">
            Loading items...
          </div>

          <div v-for="item in displayItems" :key="item.id" 
               class="flex justify-between text-sm py-3 border-b border-outline/40 last:border-none items-center">
            <div class="flex items-center gap-3">
              <NuxtImg
                densities="x1" 
                quality="80" 
                format="webp" 
                loading="lazy" 
                :src="item.img" 
                class="w-12 h-12 object-cover rounded" 
              />
              <div>
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-xs text-onMainText">x{{ item.qty }}</p>
              </div>
            </div>
            <p class="font-semibold">{{ (item.price * item.qty).toFixed(2) }} USD</p>
          </div>

          <!-- Price Breakdown -->
          <div v-if="checkoutStore.cartPrice" class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <p>Subtotal:</p>
              <p class="font-semibold">{{ checkoutStore.cartPrice.cart_price?.toFixed(2) || '0.00' }} USD</p>
            </div>

            <div v-if="checkoutStore.cartPrice.shipping_fees > 0" class="flex justify-between">
              <p>Shipping:</p>
              <p class="font-semibold">{{ checkoutStore.cartPrice.shipping_fees.toFixed(2) }} USD</p>
            </div>

            <div v-if="checkoutStore.cartPrice.payment_fee > 0" class="flex justify-between">
              <p>Payment Fee:</p>
              <p class="font-semibold">{{ checkoutStore.cartPrice.payment_fee.toFixed(2) }} USD</p>
            </div>

            <div v-if="checkoutStore.cartPrice.discount > 0" class="flex justify-between text-green-600">
              <p>Discount ({{ checkoutStore.cartPrice.discount_type }}):</p>
              <p class="font-semibold">-{{ checkoutStore.cartPrice.discount.toFixed(2) }} USD</p>
            </div>

            <div v-if="checkoutStore.cartPrice.wallet_discount > 0" class="flex justify-between text-green-600">
              <p>Wallet Discount:</p>
              <p class="font-semibold">-{{ checkoutStore.cartPrice.wallet_discount.toFixed(2) }} USD</p>
            </div>
          </div>

          <!-- Total -->
          <div class="flex justify-between font-semibold text-lg mt-4 pt-3 border-t border-onOutline">
            <p>Total:</p>
            <p class="text-green-600">
              {{ checkoutStore.cartPrice?.total_price?.toFixed(2) || '0.00' }} USD
            </p>
          </div>

          <!-- Coupon Section -->
          <div class="mt-4">
            <p class="text-xs text-mainText cursor-pointer" @click="showCouponInput = !showCouponInput">
              Have a coupon?
              <span class="text-primary underline">Click here to enter your code</span>
            </p>

            <!-- Coupon Input -->
            <div v-if="showCouponInput" class="mt-3 flex items-center gap-3">
              <input
                v-model="couponCode"
                type="text"
                placeholder="Enter coupon code"
                :disabled="checkoutStore.loadingCoupon || !!checkoutStore.appliedCoupon"
                class="w-full px-3 py-2 rounded-lg bg-bgDark text-sm outline-none border border-outline focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
              
              <button
                v-if="!checkoutStore.appliedCoupon"
                @click="handleApplyCoupon"
                :disabled="checkoutStore.loadingCoupon || !couponCode.trim()"
                class="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {{ checkoutStore.loadingCoupon ? 'Checking...' : 'Apply' }}
              </button>

              <button
                v-else
                @click="handleRemoveCoupon"
                class="px-4 py-2 bg-error text-white rounded-lg text-sm hover:opacity-90 transition cursor-pointer"
              >
                Remove
              </button>
            </div>

            <!-- Coupon Success Message -->
            <p v-if="checkoutStore.appliedCoupon" class="text-green-500 text-xs mt-2">
              ✓ {{ checkoutStore.appliedCoupon.message }}
            </p>
          </div>

          <!-- Place Order Button -->
          <div class="flex justify-center items-center mt-6">
            <button
              @click="handlePlaceOrder"
              :disabled="placing || checkoutStore.loadingPrice || !checkoutStore.selectedPaymentId"
              class="w-full px-8 py-3 rounded-full text-md bg-primary text-onPrimary hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              {{ placing ? 'Placing Order...' : 'Place Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useCheckoutStore } from '~/stores/checkoutStore'
import { useCartStore } from '~/stores/cartStore'
import { useCheckout } from '~/composables/useCheckout'
import { useRoute } from '#app'

const checkoutStore = useCheckoutStore()
const cartStore = useCartStore()
const route = useRoute()
const { initCheckout, applyCoupon, removeCoupon, selectPayment, placeOrder } = useCheckout()

// Buy Now Parameters
const isBuyNow = computed(() => route.query.is_buy_now === '1')
const buyNowCardId = computed(() => route.query.card_id ? parseInt(route.query.card_id) : null)
const buyNowQty = computed(() => route.query.qty ? parseInt(route.query.qty) : 1)

// Form State
const form = ref({
  fullName: '',
  country: '',
  city: '',
  address: '',
  phone: ''
})

const errors = ref({})
const showCouponInput = ref(false)
const couponCode = ref('')
const placing = ref(false)

// Display Items (either buy now item or cart items)
const displayItems = computed(() => {
  console.log('Cart items:', cartStore.items)
  return cartStore.items
})

// Input Class Helper with error state
function inputClass(field) {
  const baseClasses = 'w-full px-3 py-2 rounded-lg bg-bgDark text-sm sm:text-base outline-none transition duration-200 placeholder:text-onFooter/70'
  
  if (errors.value[field]) {
    return `${baseClasses} border-2 border-error focus:border-error`
  }
  
  return `${baseClasses} border border-outline focus:border-primary focus:ring-1 focus:ring-primary`
}

// Auto-fill address from store
watch(() => checkoutStore.address, (address) => {
  if (address) {
    form.value.fullName = address.full_name || ''
    form.value.country = address.country || ''
    form.value.city = address.city || ''
    form.value.address = address.street_address || ''
    form.value.phone = address.phone || ''
  }
}, { immediate: true })

// Watch for payment selection changes to update price
watch(() => checkoutStore.selectedPaymentId, (newPaymentId) => {
  if (newPaymentId) {
    const params = {
      payment_id: newPaymentId
    }
    
    if (checkoutStore.appliedCoupon?.code) {
      params.coupon = checkoutStore.appliedCoupon.code
    }

    if (isBuyNow.value) {
      params.is_buy_now = 1
      params.card_id = buyNowCardId.value
      params.qty = buyNowQty.value
    }

    checkoutStore.fetchCartPrice(params)
  }
})

// Payment Selection
const selectPaymentMethod = (paymentId) => {
  selectPayment(paymentId)
}

// Coupon Handlers
const handleApplyCoupon = async () => {
  await applyCoupon(
    couponCode.value, 
    isBuyNow.value, 
    buyNowCardId.value, 
    buyNowQty.value
  )
}

const handleRemoveCoupon = () => {
  couponCode.value = ''
  removeCoupon()
}

// Validate form before submission
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.fullName?.trim()) {
    errors.value.fullName = 'Full name is required'
  }
  
  if (!form.value.country?.trim()) {
    errors.value.country = 'Country is required'
  }
  
  if (!form.value.city?.trim()) {
    errors.value.city = 'City is required'
  }
  
  if (!form.value.address?.trim()) {
    errors.value.address = 'Street address is required'
  }
  
  if (!form.value.phone?.trim()) {
    errors.value.phone = 'Phone number is required'
  }
  
  return Object.keys(errors.value).length === 0
}

// Place Order
const handlePlaceOrder = async () => {
  console.log('Place order clicked')
  
  if (!validateForm()) {
    console.log('Validation failed:', errors.value)
    return
  }
  
  placing.value = true
  
  try {
    const result = await placeOrder(
      form.value,
      isBuyNow.value,
      buyNowCardId.value,
      buyNowQty.value
    )
    console.log('Order result:', result)
  } finally {
    placing.value = false
  }
}

// Initialize on mount
onMounted(async () => {
  console.log('Checkout mounted - isBuyNow:', isBuyNow.value, 'cardId:', buyNowCardId.value)
  
  // If buy now, fetch cart with buy now params first
  if (isBuyNow.value && buyNowCardId.value) {
    console.log('Fetching buy now cart...')
    await cartStore.fetchCart({
      is_buy_now: 1,
      card_id: buyNowCardId.value,
      qty: buyNowQty.value
    })
    console.log('Buy now cart fetched:', cartStore.items)
  } else {
    console.log('Fetching regular cart...')
    await cartStore.fetchCart()
    console.log('Regular cart fetched:', cartStore.items)
  }

  await initCheckout(
    isBuyNow.value,
    buyNowCardId.value,
    buyNowQty.value
  )
})

// Cleanup on unmount
onBeforeUnmount(() => {
  checkoutStore.reset()
})
</script>

<style scoped>
.label {
  @apply block mb-1 text-sm font-medium;
}
</style>