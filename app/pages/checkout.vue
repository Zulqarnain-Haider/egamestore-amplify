<template>
  <div class="min-h-screen text-mainText py-10 px-4 sm:px-8 lg:px-16">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 font-poppins">

      <!-- LEFT: Personal + Address + Payment -->
      <div class="flex-1 rounded-2xl space-y-6 px-4 lg:px-0">
        <h2 class="text-md sm:text-lg font-semibold">Personal details</h2>

        <!-- Personal row -->
        <div class="grid md:grid-cols-2 gap-5">
          <div>
            <label class="label">First Name <span class="text-error">*</span></label>
            <input v-model="form.firstName" type="text" :class="inputClass('firstName')" placeholder="First name *" class="placeholder-asterisk" />
            <p v-if="errors.firstName" class="text-error text-xs mt-1">{{ errors.firstName }}</p>
          </div>

          <div>
            <label class="label">Last Name <span class="text-error">*</span></label>
            <input v-model="form.lastName" type="text" :class="inputClass('lastName')" placeholder="Last name *" class="placeholder-asterisk" />
            <p v-if="errors.lastName" class="text-error text-xs mt-1">{{ errors.lastName }}</p>
          </div>
        </div>

        <!-- Address -->
        <div class="grid grid-cols-1 gap-5">
          <div class="grid md:grid-cols-2 gap-5">
            <div>
              <label class="label">Address line <span class="text-error">*</span></label>
              <input v-model="form.address" :class="inputClass('address')" placeholder="P.o.Box 1223 *" class="placeholder-asterisk" />
              <p v-if="errors.address" class="text-error text-xs mt-1">{{ errors.address }}</p>
            </div>
            <div>
              <label class="label">City <span class="text-error">*</span></label>
              <input v-model="form.city" :class="inputClass('city')" placeholder="City *" class="placeholder-asterisk" />
              <p v-if="errors.city" class="text-error text-xs mt-1">{{ errors.city }}</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-5">
            <div>
              <label class="label">State <span class="text-error">*</span></label>
              <input v-model="form.state" :class="inputClass('state')" placeholder="Arush,Tanzania *" class="placeholder-asterisk" />
              <p v-if="errors.state" class="text-error text-xs mt-1">{{ errors.state }}</p>
            </div>
            <div>
              <label class="label">Postal code <span class="text-error">*</span></label>
              <input v-model="form.postalCode" :class="inputClass('postalCode')" placeholder="9090 *" class="placeholder-asterisk" />
              <p v-if="errors.postalCode" class="text-error text-xs mt-1">{{ errors.postalCode }}</p>
            </div>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="mt-4">
          <h3 class="text-md sm:text-lg font-semibold mb-3">Payment methods</h3>

          <!-- Loading State -->
          <div v-if="loadingPayments" class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span class="ml-3 text-sm text-onFooter">Loading payment methods...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="paymentsError" class="bg-error/10 border border-error/30 rounded-lg p-4 text-center">
            <p class="text-error text-sm">Failed to load payment methods</p>
            <button @click="fetchPaymentMethods" class="text-primary text-xs underline mt-2">Retry</button>
          </div>

          <!-- Payment Options -->
          <div v-else class="space-y-2">
            <div
              v-for="method in paymentMethods"
              :key="method.id"
              class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border"
              :class="selectedPaymentId === method.id
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-onMainText hover:border-primary/60'"
              @click="selectPayment(method)"
            >
              <div class="flex items-center gap-3">
                <!-- Radio Button -->
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                  :class="selectedPaymentId === method.id ? 'border-primary' : 'border-onMainText'"
                >
                  <div v-if="selectedPaymentId === method.id" class="w-2.5 h-2.5 bg-primary rounded-full"></div>
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

              <!-- Fee Info (if any) -->
              <span v-if="method.fee" class="text-xs text-onFooter">
                +{{ method.fee }}
              </span>
            </div>
          </div>
        </div>

        <!-- Card Details (show only if card payment is selected) -->
        <div v-if="selectedPaymentRequiresCard" class="space-y-4 mt-5">
          <h2 class="text-mainText text-xl font-semibold mb-3">Card Details</h2>

          <div>
            <label class="label">Cardholder's name <span class="text-error">*</span></label>
            <input v-model="form.cardName" type="text" :class="inputClass('cardName')" placeholder="Seen on your card *" class="placeholder-asterisk" />
            <p v-if="errors.cardName" class="text-error text-xs mt-1">{{ errors.cardName }}</p>
          </div>

          <div>
            <label class="label">Card number <span class="text-error">*</span></label>
            <input v-model="form.cardNumber" type="text" :class="inputClass('cardNumber')" placeholder="Seen on your card *" class="placeholder-asterisk" />
            <p v-if="errors.cardNumber" class="text-error text-xs mt-1">{{ errors.cardNumber }}</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label">Expiry <span class="text-error">*</span></label>
              <input v-model="form.expiry" type="text" :class="inputClass('expiry')" placeholder="20/30 *" class="placeholder-asterisk" />
              <p v-if="errors.expiry" class="text-error text-xs mt-1">{{ errors.expiry }}</p>
            </div>
            <div>
              <label class="label">CVC <span class="text-error">*</span></label>
              <input v-model="form.cvc" type="text" :class="inputClass('cvc')" placeholder="654 *" class="input" data-has-asterisk="true" />
              <p v-if="errors.cvc" class="text-error text-xs mt-1">{{ errors.cvc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Order summary -->
      <div class="w-full lg:w-[400px] mt-8">
        <h3 class="text-lg sm:text-xl font-semibold mb-4">Your Order</h3>
        <div class="bg-bgLight/10 border border-outline rounded-xl p-6">
          <div class="border-b border-mainText pb-2 mb-3 flex justify-between text-sm uppercase">
            <span>Product</span>
            <span>Sub Total</span>
          </div>

          <div v-for="item in cartItems" :key="item.id" class="flex justify-between text-sm py-3 border-b border-outline/40 last:border-none items-center">
            <div class="flex items-center gap-3">
              <NuxtImg
               densities="x1" quality="80" format="webp" loading="lazy" 
               :src="item.image" class="w-12 h-12 object-cover" />
              <div>
                <p class="font-medium">{{ item.title }}</p>
                <p class="text-sm text-mainText">{{ item.category }}</p>
                <p class="text-sm text-mainText">x{{ item.quantity }}</p>
              </div>
            </div>
          </div>

          <div class="text-[13px] flex justify-between mt-4">
            <p>Worldwide Standard Shipping Free</p>
            <p class="text-error font-medium">+ $9.50</p>
          </div>

          <div class="flex justify-between font-semibold mt-2 border-t border-onOutline pt-3">
            <p>Order Total</p>
            <p class="text-green-600">${{ total.toFixed(2) }}</p>
          </div>

          <p class="mt-4 text-xs max-w-xs text-mainText"
          @click="showCouponInput = !showCouponInput">
            Have a coupon?
             <span class="text-primary underline cursor-pointer">Click here to enter your code</span>
          </p>

<!-- Coupon Input Field -->
<div v-if="showCouponInput" class="mt-3 flex items-center gap-3">
  <input
    v-model="couponCode"
    type="text"
    placeholder="Enter coupon code"
    class="w-full px-3 py-2 rounded-lg bg-bgDark text-sm outline-none border border-outline focus:border-primary"
  />
  
  <button
    @click="applyCoupon"
    class="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition"
  >
    Apply
  </button>
</div>

<!-- Success or Error Message -->
<p v-if="couponMessage" :class="couponSuccess ? 'text-green-500' : 'text-error'" class="text-xs mt-1">
  {{ couponMessage }}
</p>
           
          <div class="flex justify-center items-center mt-10">
            <AppButton
              @click="placeOrder"
              variant="primary"
              :disabled="!selectedPaymentId"
              extraClass="w-full justify-center items-center px-8 py-3 rounded-full text-md hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place Order
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from '~/stores/ordersStore.js'
import { navigateTo } from '#app'
import { useToast } from '#imports'

const ordersStore = useOrdersStore()
const toast = useToast()

// Cart & Totals
const cartItems = computed(() => ordersStore.cart)
const subtotal = computed(() => ordersStore.cart.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0))
const shipping = computed(() => 9.5)
const total = computed(() => subtotal.value + shipping.value)

// Form
const form = ref({
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
})

// Payment States
const selectedPaymentId = ref(null)
const selectedPaymentMethod = ref(null)
const paymentMethods = ref([])
const loadingPayments = ref(false)
const paymentsError = ref(false)
const errors = ref({})

// Check if selected payment requires card details
const selectedPaymentRequiresCard = computed(() => {
  if (!selectedPaymentMethod.value) return false
  const name = selectedPaymentMethod.value.name?.toLowerCase() || ''
  // Show card form for visa, mastercard, stripe, credit card, etc.
  return name.includes('card') || name.includes('visa') || name.includes('stripe') || name.includes('credit')
})

// Helper
function inputClass(field) {
  return [
    'input',
    errors.value[field] ? 'border-error focus:border-error' : 'focus:border-primary focus:ring-1 focus:ring-primary',
  ]
}

// ===================
// Fetch Payment Methods
// ===================
async function fetchPaymentMethods() {
  loadingPayments.value = true
  paymentsError.value = false
  
  try {
    const token = localStorage.getItem('token') // Get JWT token
    
    if (!token) {
      toast.error({
        title: 'Authentication Required',
        message: 'Please login to continue',
        position: 'topCenter',
        duration: 3000
      })
      setTimeout(() => navigateTo('/auth/login'), 1500)
      return
    }

    const response = await $fetch('https://api.egamestore.com/api/payments', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'lang': 'en'
      },
      params: {
        platform: 'web',
        is_buy_now: 1,
        card_id: 3679, // Replace with actual card_id from cart
        qty: 1
      }
    })

    console.log('✅ Payment Methods Response:', response)

    if (response.status && response.data) {
      paymentMethods.value = response.data
      
      // Auto-select first payment method
      if (paymentMethods.value.length > 0) {
        selectPayment(paymentMethods.value[0])
      }
      
      toast.success({
        title: 'Payment Methods Loaded',
        message: `${paymentMethods.value.length} payment options available`,
        position: 'topCenter',
        duration: 2000
      })
    } else {
      paymentsError.value = true
      toast.error({
        title: 'Payment Error',
        message: response.message || 'Failed to load payment methods',
        position: 'topCenter',
        duration: 4000
      })
    }
  } catch (error) {
    paymentsError.value = true
    console.error('❌ Payment Methods Error:', error)
    
    // Check if it's an auth error
    if (error.statusCode === 401 || error.statusCode === 403) {
      toast.error({
        title: 'Session Expired',
        message: 'Please login again',
        position: 'topCenter',
        duration: 3000
      })
      setTimeout(() => navigateTo('/auth/login'), 1500)
    } else {
      toast.error({
        title: 'Connection Error',
        message: 'Unable to load payment methods. Please try again.',
        position: 'topCenter',
        duration: 4000
      })
    }
  } finally {
    loadingPayments.value = false
  } 
}

// ===================
// Select Payment
// ===================
function selectPayment(method) {
  selectedPaymentId.value = method.id
  selectedPaymentMethod.value = method
  
  console.log('Selected Payment:', method)
  
  toast.success({
    title: 'Payment Selected',
    message: `${method.name} selected`,
    position: 'topCenter',
    duration: 2000
  })
}


const showCouponInput = ref(false)
const couponCode = ref('')
const couponMessage = ref('')
const couponSuccess = ref(false)


async function applyCoupon() {
  couponMessage.value = ''
  couponSuccess.value = false

  const token = localStorage.getItem('token')

  if (!token) {
    toast.error({
      title: 'Login Required',
      message: 'Please login to apply coupon',
      position: 'topCenter'
    })
    return
  }

  try {
    const response = await $fetch('https://api.egamestore.com/api/users/points-summary', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        lang: 'en'
      },
      params: {
        status: 'all'
      }
    })

    console.log("Coupon API Response:", response)

    // 👉 Backend ne coupon code diya hoga testing ke liye
    // Example: "TEST10"
    const backendCoupon = "TESTTT" // <-- TEST coupon yahan rakho

    if (couponCode.value.trim().toUpperCase() === backendCoupon) {
      couponSuccess.value = true
      couponMessage.value = 'Coupon applied successfully!'

      // Dummy: apply 10% discount
      const discount = subtotal.value * 0.10
      ordersStore.applyDiscount(discount)

      toast.success({
        title: 'Coupon Applied',
        message: 'Your discount has been added!',
        position: 'topCenter'
      })
    } else {
      couponMessage.value = 'Invalid coupon code'
      couponSuccess.value = false

      toast.error({
        title: 'Invalid Coupon',
        message: 'Please enter a valid coupon.',
        position: 'topCenter'
      })
    }
  } catch (err) {
    console.log("Coupon Error:", err)
    couponMessage.value = 'Unable to apply coupon right now'
    couponSuccess.value = false

    toast.error({
      title: 'Error',
      message: 'Failed to verify coupon',
      position: 'topCenter'
    })
  }
}

// ===================
// Form Validation
// ===================
function validateForm() {
  errors.value = {}

  if (!form.value.firstName) errors.value.firstName = 'First name is required.'
  if (!form.value.lastName) errors.value.lastName = 'Last name is required.'
  if (!form.value.address) errors.value.address = 'Address is required.'
  if (!form.value.city) errors.value.city = 'City is required.'
  if (!form.value.state) errors.value.state = 'State is required.'
  if (!form.value.postalCode) errors.value.postalCode = 'Postal code is required.'

  // Only validate card details if card payment is selected
  if (selectedPaymentRequiresCard.value) {
    if (!form.value.cardName) errors.value.cardName = "Cardholder's name is required."
    if (!form.value.cardNumber) errors.value.cardNumber = 'Card number is required.'
    if (!form.value.expiry) errors.value.expiry = 'Expiry is required.'
    if (!form.value.cvc) errors.value.cvc = 'CVC is required.'
  }

  if (!selectedPaymentId.value) {
    toast.error({
      title: 'Payment Required',
      message: 'Please select a payment method',
      position: 'topCenter',
      duration: 3000
    })
    return false
  }

  if (!ordersStore.cart.length) {
    toast.error({
      title: 'Cart Empty',
      message: 'Your cart is empty.',
      position: 'topCenter',
      duration: 3000
    })
    return false
  }

  return Object.keys(errors.value).length === 0
}

// ===================
// Place Order
// ===================
function placeOrder() {
  if (!validateForm()) {
    toast.error({
      title: 'Validation Error',
      message: 'Please fill all required fields',
      position: 'topCenter',
      duration: 3000
    })
    return
  }

  // Show loading
  const loadingToast = toast.loading({
    title: 'Placing Order',
    message: 'Please wait...',
    position: 'topCenter'
  })


   try {
    // Prepare FormData for API
    const formData = new FormData()
    
    // Personal details
    formData.append('full_name', `${form.value.firstName} ${form.value.lastName}`)
    formData.append('country', 'Egypt') // Static
    formData.append('city', form.value.city)
    formData.append('street_address', form.value.address)
    formData.append('phone', '01129609891') // Static phone
    formData.append('ip_address', '192.168.1.1') // Static IP
    
    // Shipping & Payment
    formData.append('shipping_method', 1) // Default
    formData.append('payment_id', selectedPaymentId.value)
    formData.append('wallet_number', '01129609891') // Static
    formData.append('payment_method', selectedPaymentMethod.value.id)
    
    // Coupon & Points
    if (couponCode.value) formData.append('coupon', couponCode.value)
    formData.append('redeem_points', 0)
    
    // Products (for cart items)
    cartItems.value.forEach((item, index) => {
      formData.append('product_id', item.id)
      formData.append('qty', item.quantity)
      if (index === 0) formData.append('is_buy_now', 1)
    })
    
    // Call API
    const result = await ordersStore.createOrder(formData)
    
    // Success
    toast.dismiss(loadingToast)
    toast.success({
      title: 'Order Placed',
      message: `Order #${result.order_id} created successfully!`,
      position: 'topCenter',
      duration: 3000
    })
    
    // Clear cart & redirect
    ordersStore.clearCart()
    setTimeout(() => navigateTo('/orders'), 1500)
    
  } catch (err) {
    toast.dismiss(loadingToast)
    console.error('Place Order Error:', err)
    
    toast.error({
      title: 'Order Failed',
      message: err.message || 'Failed to place order. Try again.',
      position: 'topCenter',
      duration: 4000
    })
  }
}
    
    // Call API
    const result = await ordersStore.createOrder(formData)
    
    // Success
    toast.dismiss(loadingToast)
    toast.success({
      title: 'Order Placed',
      message: `Order #${result.order_id} created successfully!`,
      position: 'topCenter',
      duration: 3000
    })
    
    // Clear cart & redirect
    ordersStore.clearCart()
    setTimeout(() => navigateTo('/orders'), 1500)
    
  } catch (err) {
    toast.dismiss(loadingToast)
    console.error('Place Order Error:', err)
    
    toast.error({
      title: 'Order Failed',
      message: err.message || 'Failed to place order. Try again.',
      position: 'topCenter',
      duration: 4000
    })
  }

  const order = {
    id: Date.now(),
    ...form.value,
    paymentMethod: selectedPaymentMethod.value.name,
    paymentMethodId: selectedPaymentId.value,
    items: [...ordersStore.cart],
    subtotal: subtotal.value,
    shipping: shipping.value,
    total: total.value,
    date: new Date().toISOString(),
  }

  ordersStore.addOrder(order)
  ordersStore.clearCart()
  
  toast.success({
    title: 'Order Placed',
    message: '✅ Order placed successfully!',
    position: 'topCenter',
    duration: 2500
  })
  
  setTimeout(() => navigateTo('/orders'), 1400)
}

onMounted(() => {
  ordersStore.loadOrdersFromStorage()
  fetchPaymentMethods()
})
</script> -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from '~/stores/ordersStore.js'
import { navigateTo } from '#app'
import { useToast } from '#imports'

const ordersStore = useOrdersStore()
const toast = useToast()

// Cart & Totals
const cartItems = computed(() => ordersStore.cart)
const subtotal = computed(() => ordersStore.cart.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0))
const shipping = computed(() => 9.5)
const total = computed(() => subtotal.value + shipping.value)

// Form
const form = ref({
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
})

// Payment States
const selectedPaymentId = ref(null)
const selectedPaymentMethod = ref(null)
const paymentMethods = ref([])
const loadingPayments = ref(false)
const paymentsError = ref(false)
const errors = ref({})

// Check if selected payment requires card details
const selectedPaymentRequiresCard = computed(() => {
  if (!selectedPaymentMethod.value) return false
  const name = selectedPaymentMethod.value.name?.toLowerCase() || ''
  return name.includes('card') || name.includes('visa') || name.includes('stripe') || name.includes('credit')
})

// Helper
function inputClass(field) {
  return [
    'input',
    errors.value[field] ? 'border-error focus:border-error' : 'focus:border-primary focus:ring-1 focus:ring-primary',
  ]
}

// ===================
// Fetch Payment Methods
// ===================
async function fetchPaymentMethods() {
  loadingPayments.value = true
  paymentsError.value = false
  
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      toast.error({
        title: 'Authentication Required',
        message: 'Please login to continue',
        position: 'topCenter',
        duration: 3000
      })
      setTimeout(() => navigateTo('/auth/login'), 1500)
      return
    }

    const response = await $fetch('https://api.egamestore.com/api/payments', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-language': 'en'
      },
      params: {
        platform: 'web',
        is_buy_now: 1,
        card_id: 3679,
        qty: 1
      }
    })

    console.log('✅ Payment Methods Response:', response)

    if (response.status && response.data) {
      paymentMethods.value = response.data
      
      if (paymentMethods.value.length > 0) {
        selectPayment(paymentMethods.value[0])
      }
      
      toast.success({
        title: 'Payment Methods Loaded',
        message: `${paymentMethods.value.length} payment options available`,
        position: 'topCenter',
        duration: 2000
      })
    } else {
      paymentsError.value = true
      toast.error({
        title: 'Payment Error',
        message: response.message || 'Failed to load payment methods',
        position: 'topCenter',
        duration: 4000
      })
    }
  } catch (error) {
    paymentsError.value = true
    console.error('❌ Payment Methods Error:', error)
    
    if (error.statusCode === 401 || error.statusCode === 403) {
      toast.error({
        title: 'Session Expired',
        message: 'Please login again',
        position: 'topCenter',
        duration: 3000
      })
      setTimeout(() => navigateTo('/auth/login'), 1500)
    } else {
      toast.error({
        title: 'Connection Error',
        message: 'Unable to load payment methods. Please try again.',
        position: 'topCenter',
        duration: 4000
      })
    }
  } finally {
    loadingPayments.value = false
  } 
}

// ===================
// Select Payment
// ===================
function selectPayment(method) {
  selectedPaymentId.value = method.id
  selectedPaymentMethod.value = method
  
  console.log('Selected Payment:', method)
  
  toast.success({
    title: 'Payment Selected',
    message: `${method.name} selected`,
    position: 'topCenter',
    duration: 2000
  })
}

const showCouponInput = ref(false)
const couponCode = ref('')
const couponMessage = ref('')
const couponSuccess = ref(false)

async function applyCoupon() {
  couponMessage.value = ''
  couponSuccess.value = false

  const token = localStorage.getItem('token')

  if (!token) {
    toast.error({
      title: 'Login Required',
      message: 'Please login to apply coupon',
      position: 'topCenter'
    })
    return
  }

  try {
    const response = await $fetch('https://api.egamestore.com/api/users/points-summary', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept-language': 'en'
      },
      params: {
        status: 'all'
      }
    })

    console.log("Coupon API Response:", response)

    const backendCoupon = "TESTTT"

    if (couponCode.value.trim().toUpperCase() === backendCoupon) {
      couponSuccess.value = true
      couponMessage.value = 'Coupon applied successfully!'

      const discount = subtotal.value * 0.10
      ordersStore.applyDiscount(discount)

      toast.success({
        title: 'Coupon Applied',
        message: 'Your discount has been added!',
        position: 'topCenter'
      })
    } else {
      couponMessage.value = 'Invalid coupon code'
      couponSuccess.value = false

      toast.error({
        title: 'Invalid Coupon',
        message: 'Please enter a valid coupon.',
        position: 'topCenter'
      })
    }
  } catch (err) {
    console.log("Coupon Error:", err)
    couponMessage.value = 'Unable to apply coupon right now'
    couponSuccess.value = false

    toast.error({
      title: 'Error',
      message: 'Failed to verify coupon',
      position: 'topCenter'
    })
  }
}

// ===================
// Form Validation
// ===================
function validateForm() {
  errors.value = {}

  if (!form.value.firstName) errors.value.firstName = 'First name is required.'
  if (!form.value.lastName) errors.value.lastName = 'Last name is required.'
  if (!form.value.address) errors.value.address = 'Address is required.'
  if (!form.value.city) errors.value.city = 'City is required.'
  if (!form.value.state) errors.value.state = 'State is required.'
  if (!form.value.postalCode) errors.value.postalCode = 'Postal code is required.'

  if (selectedPaymentRequiresCard.value) {
    if (!form.value.cardName) errors.value.cardName = "Cardholder's name is required."
    if (!form.value.cardNumber) errors.value.cardNumber = 'Card number is required.'
    if (!form.value.expiry) errors.value.expiry = 'Expiry is required.'
    if (!form.value.cvc) errors.value.cvc = 'CVC is required.'
  }

  if (!selectedPaymentId.value) {
    toast.error({
      title: 'Payment Required',
      message: 'Please select a payment method',
      position: 'topCenter',
      duration: 3000
    })
    return false
  }

  if (!ordersStore.cart.length) {
    toast.error({
      title: 'Cart Empty',
      message: 'Your cart is empty.',
      position: 'topCenter',
      duration: 3000
    })
    return false
  }

  return Object.keys(errors.value).length === 0
}

// ===================
// Place Order
// ===================
async function placeOrder() {
  if (!validateForm()) {
    toast.error({
      title: 'Validation Error',
      message: 'Please fill all required fields',
      position: 'topCenter',
      duration: 3000
    })
    return
  }

  const loadingToast = toast.loading({
    title: 'Placing Order',
    message: 'Please wait...',
    position: 'topCenter'
  })

  try {
    const formData = new FormData()
    
    formData.append('full_name', `${form.value.firstName} ${form.value.lastName}`)
    formData.append('country', 'Egypt')
    formData.append('city', form.value.city)
    formData.append('street_address', form.value.address)
    formData.append('phone', '01129609891')
    formData.append('ip_address', '192.168.1.1')
    
    formData.append('shipping_method', 1)
    formData.append('payment_id', selectedPaymentId.value)
    formData.append('wallet_number', '01129609891')
    formData.append('payment_method', selectedPaymentMethod.value.id)
    
    if (couponCode.value) formData.append('coupon', couponCode.value)
    formData.append('redeem_points', 0)
    
    cartItems.value.forEach((item, index) => {
      formData.append('product_id', item.id)
      formData.append('qty', item.quantity)
      if (index === 0) formData.append('is_buy_now', 1)
    })
    
    const result = await ordersStore.createOrder(formData)
    
    toast.dismiss(loadingToast)
    toast.success({
      title: 'Order Placed',
      message: `Order #${result.order_id} created successfully!`,
      position: 'topCenter',
      duration: 3000
    })
    
    ordersStore.clearCart()
    setTimeout(() => navigateTo('/orders'), 1500)
    
  } catch (err) {
    toast.dismiss(loadingToast)
    console.error('Place Order Error:', err)
    
    toast.error({
      title: 'Order Failed',
      message: err.message || 'Failed to place order. Try again.',
      position: 'topCenter',
      duration: 4000
    })
  }
}

onMounted(() => {
  ordersStore.loadOrdersFromStorage()
  fetchPaymentMethods()
})
</script>


<style scoped>
.input {
  @apply w-full px-3 py-2 rounded-lg bg-bgDark text-sm sm:text-base
    outline-none transition duration-200 placeholder:text-onFooter/70;
}

.label {
  @apply block mb-1 text-sm font-medium;
}

.text-error {
  color: #ef4444;
}

.input::placeholder {
  color: #9ca3af;
}

.input[data-has-asterisk="true"]::after {
  content: '*';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #ef4444;
  pointer-events: none;
  opacity: 0.9;
}

.input[data-has-asterisk="true"]:not(:placeholder-shown)::after {
  content: '';
}
</style>