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

          <!-- PayPal -->
          <div
            class="flex items-baseline justify-between p-2 rounded-lg cursor-pointer transition-all"
            :class="selectedPayment === 'paypal'
              ? 'border-primary  scale-[1.01]'
              : 'border-onMainText hover:border-primary/60'"
            @click="selectPayment('paypal')"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-5 h-5 rounded-full border flex items-center justify-center"
                :class="selectedPayment === 'paypal' ? 'border-primary' : 'border-primary'"
              >
                <div v-if="selectedPayment === 'paypal'" class="w-2.5 h-2.5 bg-primary rounded-full"></div>
              </div>
              <img src="/games/PayPal.png" alt="PayPal" class="object-contain" />
              <span class="text-mainText items-baseline text-md font-medium">PayPal</span>
            </div>
          </div>

          <!-- Card -->
          <div
            class="flex flex-col rounded-lg p-2 cursor-pointer mt-2 transition-all"
            :class="selectedPayment === 'card'
              ? 'border-primary scale-[1.01]'
              : 'border-onMainText hover:border-primary/60'"
            @click="selectPayment('card')"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-5 h-5 rounded-full border flex items-center justify-center"
                  :class="selectedPayment === 'card' ? 'border-primary' : 'border-primary'"
                >
                  <div v-if="selectedPayment === 'card'" class="w-2.5 h-2.5 bg-primary rounded-full"></div>
                </div>
                <div class="flex items-center gap-2">
                  <img src="/games/VISA.png" alt="Visa" class="object-contain" />
                  <img src="/games/Stripe.png" alt="Stripe" class="object-contain" />
                  <img src="/games/AximBank.png" alt="Axim" class="object-contain" />
                  <img src="/games/GooglePay.png" alt="Gpay" class="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--Card Details (always visible) -->
        <div class="space-y-4 mt-5">
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
              <input v-model="form.cvc" type="text" :class="inputClass('cvc')" placeholder="654 *" class="input"  data-has-asterisk="true"
 />
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
              <NuxtImg densities="x1" quality="80" format="webp" loading="lazy" :src="item.image" class="w-12 h-12 object-cover" />
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

          <p class="mt-4 text-xs max-w-xs text-mainText">
            Have a coupon? <span class="text-primary underline cursor-pointer">Click here to enter your code</span>
          </p>

          <div class="flex justify-center items-center mt-10">
            <AppButton
              @click="placeOrder"
              variant="primary"
              extraClass="w-full justify-center items-center px-8 py-3 rounded-full text-md hover:opacity-90 transition-all"
            >
              Place Order
            </AppButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="fade">
      <div
        v-if="toast.visible"
        class="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm"
      >
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useOrdersStore } from '~/stores/ordersStore.js'
import { navigateTo } from '#app'

const ordersStore = useOrdersStore()
onMounted(() => ordersStore.loadOrdersFromStorage())

const cartItems = computed(() => ordersStore.cart)
const subtotal = computed(() => ordersStore.cart.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0))
const shipping = computed(() => 9.5)
const total = computed(() => subtotal.value + shipping.value)

const toast = reactive({ visible: false, message: '' })
function showToast(msg) {
  toast.message = msg
  toast.visible = true
  setTimeout(() => (toast.visible = false), 2000)
}

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

const selectedPayment = ref('paypal')
const errors = reactive({})

function inputClass(field) {
  return [
    'input',
    errors[field] ? 'border-error focus:border-error' : 'focus:border-primary focus:ring-1 focus:ring-primary',
  ]
}

function selectPayment(method) {
  selectedPayment.value = method
  showToast(`${method === 'paypal' ? '💰 PayPal' : '💳 Card'} selected successfully!`)
}

function validateForm() {
  for (const k in errors) delete errors[k]

  if (!form.value.firstName) errors.firstName = 'First name is required.'
  if (!form.value.lastName) errors.lastName = 'Last name is required.'
  if (!form.value.address) errors.address = 'Address is required.'
  if (!form.value.city) errors.city = 'City is required.'
  if (!form.value.state) errors.state = 'State is required.'
  if (!form.value.postalCode) errors.postalCode = 'Postal code is required.'

  if (!form.value.cardName) errors.cardName = "Cardholder's name is required."
  if (!form.value.cardNumber) errors.cardNumber = 'Card number is required.'
  if (!form.value.expiry) errors.expiry = 'Expiry is required.'
  if (!form.value.cvc) errors.cvc = 'CVC is required.'

  if (!ordersStore.cart.length) {
    showToast('Your cart is empty.')
    return false
  }

  return Object.keys(errors).length === 0
}

function placeOrder() {
  if (!validateForm()) return

  const order = {
    id: Date.now(),
    ...form.value,
    paymentMethod: selectedPayment.value,
    items: [...ordersStore.cart],
    subtotal: subtotal.value,
    shipping: shipping.value,
    total: total.value,
    date: new Date().toISOString(),
  }

  ordersStore.addOrder(order)
  ordersStore.clearCart()
  showToast('✅ Order placed successfully!')
  setTimeout(() => navigateTo('/orders'), 1400)
}
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
  color: #ef4444; /* Tailwind red-500 */
}

/* =============================
    Red * inside placeholder
   ============================= */
.input {
  position: relative;
}

/* Normal placeholder color */
.input::placeholder {
  color: #9ca3af;
}

/* Inputs that have asterisk placeholders */
.input[data-has-asterisk="true"]::after {
  content: '*';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #ef4444; /* red */
  pointer-events: none;
  opacity: 0.9;
}

/* Jab user type kare, to * chhup jaye */
.input[data-has-asterisk="true"]:not(:placeholder-shown)::after {
  content: '';
}

/* =============================
   Toast fade animation
   ============================= */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

