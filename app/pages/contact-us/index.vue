<template>
  <div class="min-h-screen text-mainText py-10 px-6 md:px-12">
    <div class="max-w-7xl mx-auto flex flex-col gap-10 font-poppins">
      <h1 class="text-2xl font-semibold font-inter">{{ t('ticketNewTitle') }}</h1>

      <div class="grid lg:grid-cols-2 gap-6">
        <!-- LEFT -->
        <div>
          <!-- Name -->
          <label class="label">{{ t('ticketName') }}</label>
          <input v-model="form.name" class="input" placeholder="" />
          <p v-if="errors.name" class="text-error text-xs mt-1">{{ errors.name }}</p>

          <!-- Reason -->
          <label class="label mt-4">{{ t('ticketSelectReason') }}</label>
          <div class="relative">
            <div
              class="input flex justify-between items-center cursor-pointer select-none pr-10"
              @click="toggleDropdown"
            >
              <span class="truncate" :class="form.reason ? 'text-mainText' : 'text-onFooter/50'">
                {{ form.reason?.name || t('ticketSelect') }}
              </span>
              <Icon
                name="heroicons:chevron-down"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-onFooter text-lg transition-transform duration-300"
                :class="{ 'rotate-180': dropdownOpen }"
              />
            </div>

            <!-- Dropdown -->
            <transition name="fade">
              <ul
                v-if="dropdownOpen"
                class="absolute w-full bg-bgDark py-2 rounded-xl mt-1 z-20 shadow-lg overflow-hidden"
              >
                <li v-if="loadingReasons" class="px-4 py-2 text-sm text-onFooter text-center">
                  Loading reasons...
                </li>
                <li v-else-if="reasonsError" class="px-4 py-2 text-sm text-error text-center">
                  Failed to load reasons
                </li>
                <li
                  v-else
                  v-for="(r, index) in reasons"
                  :key="r.id"
                  @click="selectReason(r)"
                  class="px-4 py-2 text-sm cursor-pointer transition-colors duration-200"
                  :class="[index === highlightedIndex ? 'bg-primary/20 text-mainText' : 'text-mainText hover:bg-primary/20']"
                >
                  {{ r.name }}
                </li>
              </ul>
            </transition>
          </div>
          <p v-if="errors.reason" class="text-error text-xs mt-1">{{ errors.reason }}</p>
          <!-- Order Dropdown (Logged-in) -->
          <div v-if="requiresOrder && isLoggedIn" class="mt-4">
            <label class="label">{{ t('ticketSelectOrder') }}</label>
          
            <div class="relative">
              <div
                class="input flex justify-between items-center cursor-pointer select-none pr-10"
                @click="toggleOrderDropdown"
              >
                <span
                  class="truncate"
                  :class="selectedOrder ? 'text-mainText' : 'text-onFooter/50'"
                >
                  {{ selectedOrder?.name || t('ticketSelectOrderPlaceholder')  }}
                </span>
          
                <Icon
                  name="heroicons:chevron-down"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-onFooter text-lg transition-transform duration-300"
                  :class="{ 'rotate-180': orderDropdownOpen }"
                />
              </div>
          
              <transition name="fade">
                <ul
                  v-if="orderDropdownOpen"
                  class="absolute w-full bg-bgDark py-2 rounded-xl mt-1 z-20 shadow-lg overflow-hidden"
                >
                  <li
                    v-if="loadingOrders"
                    class="px-4 py-2 text-sm text-onFooter text-center"
                  >
                    Loading orders...
                  </li>
          
                  <li
                    v-else
                    v-for="order in orders"
                    :key="order.id"
                    @click="selectOrder(order)"
                    class="px-4 py-2 text-sm cursor-pointer transition-colors duration-200 text-mainText hover:bg-primary/20"
                  >
                    {{ order.name }}
                  </li>
                </ul>
              </transition>
            </div>
          </div>

          <!-- Order Input (Guest) -->
          <div v-if="requiresOrder && !isLoggedIn" class="mt-4">
            <label class="label">{{ t('ticketOrderNumber') }}</label>
            <input
              v-model="form.orderId"
              class="input"
              :placeholder="t('ticketOrderNumberPlaceholder')"
            />
          </div>
          <p v-if="errors.orderId" class="text-error text-xs mt-1">
            {{ errors.orderId }}
          </p>
          <!-- Subject -->
          <label class="label mt-4">{{ t('ticketSubject') }}</label>
          <input v-model="form.subject" class="input" placeholder="" />
          <p v-if="errors.subject" class="text-error text-xs mt-1">{{ errors.subject }}</p>

          <!-- Attachment -->
          <label class="label mt-4">{{ t('ticketAttachment') }}</label>
          <div class="flex items-center gap-3">
            <div
              @click="triggerFile"
              class="flex-1 flex text-onFooter bg-bgDark/60 px-3 py-2 items-center rounded-xl cursor-pointer"
            >
              <button
                @click.stop="triggerFile"
                class="flex items-center gap-2 mr-3 bg-mainText px-6 py-2 rounded-md"
              >
                <NuxtImg src="/wallet/TicketUpload.svg" densities="x1" quality="80" loading="lazy" />
              </button>
              <span v-if="fileName">{{ fileName }}</span>
              <span v-else class="text-onFooter">
                <span @click.stop="triggerFile" class="text-primary cursor-pointer">{{ t('ticketUploadClick') }}</span>
                {{ t('ticketUploadText') }}
              </span>
            </div>
            <input ref="fileInput" type="file" class="hidden" @change="onFileChange" multiple />
          </div>
        </div>

        <!-- RIGHT -->
        <div>
          <label class="label">{{ t('ticketEmail') }}</label>
          <input v-model="form.email" class="input" :placeholder="t('ticketEmailPlaceholder')" />
          <p v-if="errors.email" class="text-error text-xs mt-1">{{ errors.email }}</p>

          <label class="label mt-4">{{ t('ticketMessage') }}</label>
          <textarea
            v-model="form.message"
            rows="8"
            class="input resize-none"
            :placeholder="t('ticketMessagePlaceholder')"
          ></textarea>
          <p v-if="errors.message" class="text-error text-xs mt-1">{{ errors.message }}</p>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex justify-center font-poppins mt-4">
        <button
          @click="submitTicket"
          class="bg-primary text-white px-10 py-3 rounded-full hover:opacity-90 transition"
        >
          {{ t('ticketSendMessage') }}
        </button>
      </div>

      <!-- Guest Note -->
      <p v-if="!isLoggedIn" class="text-center text-onFooter mt-2 underline cursor-pointer font-poppins">
        {{ t('ticketNoAccount') }}
        <NuxtLink to="/auth/signup" class="text-primary">{{ t('ticketSignup') }}</NuxtLink>
      </p>

      <!-- Previous Tickets -->
      <section v-if="ticketStore.tickets.length" class="mt-10 bg-bgDark border border-onMainText rounded-xl py-4 font-poppins px-0">
        <h3 class="text-lg font-semibold mb-4 px-4 pb-4 border-b border-onMainText">
          {{ t('ticketPrevious') }}
        </h3>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="px-4">
              <tr class="text-onFooter">
                <th class="text-left pb-3 px-4">{{ t('ticketTableTicket') }}</th>
                <th class="text-left pb-3 px-4">{{ t('ticketTableOrder') }}</th>
                <th class="text-left pb-3 px-4">{{ t('ticketTableCreated') }}</th>
                <th class="text-left pb-3 px-4">{{ t('ticketTableStatus') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(t, i) in ticketStore.tickets"
                :key="t.id"
                :class="['hover:bg-bgLight/30 transition', i === 0 ? '' : 'border-t border-onMainText']"
                @click="openConversation(t.uuid)"
              >
                <td class="py-4 px-4">
                  <button class="text-mainText hover:text-primary" >
                    {{ t.id }}
                  </button>
                </td>
                <td class="px-4">{{ t.order_id || '—' }}</td>
                <td class="text-onFooter px-4">{{ formatDate(t.created_at) }}</td>
                <td class="px-4">
                  <span :class="t.status === 'active' ? 'text-green-600 py-1 rounded-full text-sm' : 'text-onFooter py-1 rounded-full text-sm'">
                    {{ t.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTicketStore } from '~/stores/ticketStore.js'
import { useUserStore } from '~/stores/userStore.js'
import { useTurnstile } from '~/composables/useTurnstile'
import { useRouter } from 'vue-router'
import { useToast } from '#imports'

const { t, locale } = useI18n()
const { execute, verified } = useTurnstile()
const ticketStore = useTicketStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const highlightedIndex = ref(0)
const dropdownOpen = ref(false)
const fileInput = ref(null)
const fileName = ref('')
const errors = ref({})

const reasons = ref([])
const loadingReasons = ref(false)
const reasonsError = ref(false)

const orders = ref([])
const loadingOrders = ref(false)
const ordersFetched = ref(false)
const orderDropdownOpen = ref(false)
const selectedOrder = ref(null)


const form = ref({
  name: userStore.currentUser?.name || '',
  email: userStore.currentUser?.email || '',
  reason: null,
  subject: '',
  message: '',
  orderId: '',
  attachments: [],
})

const orderFromQuery = route.query.order

if (orderFromQuery) {
  const found = orders.value.find(o => o.id == orderFromQuery)
  if (found) {
    form.value.orderId = found.id
  }
}

const isLoggedIn = computed(() => !!userStore.currentUser)
const requiresOrder = computed(() => {
  return form.value.reason?.show_orders === true
})

async function fetchReasons() {
  loadingReasons.value = true
  reasonsError.value = false
  try {
    const response = await $fetch('https://api.egamestore.com/api/reasons', {
      headers: { lang: 'en' }
    })
    if (response.status && response.data) {
      reasons.value = response.data
    } else {
      reasonsError.value = true
      toast.error({ title: t('ticketToastError'), message: t('ticketToastLoadReasonsFail'), position: 'topCenter', duration: 3000 })
    }
  } catch (err) {
    reasonsError.value = true
    toast.error({ title: t('ticketToastConnectionError'), message: t('ticketToastLoadReasonsRetry'), position: 'topCenter', duration: 4000 })
  } finally {
    loadingReasons.value = false
  }
}

async function fetchOrders() {
  if (!isLoggedIn.value || ordersFetched.value) return

  loadingOrders.value = true
  try {
    const res = await $fetch(
      'https://api.egamestore.com/api/users/orders/pagination?status=all&per_page=20000&page=1',
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
          'lang': locale.value,
        },
      }
    )

    if (res.status && res.data?.orders) {
      orders.value = res.data.orders
      ordersFetched.value = true
    } else {
      toast.error({
        title: t('ticketToastError'),
        message: t('ticketToastLoadOrdersFail'),
        position: 'topCenter',
        duration: 3000,
      })
    }
  } catch (err) {
    toast.error({
      title: t('ticketToastConnectionError'),
      message: t('ticketToastLoadOrdersRetry'),
      position: 'topCenter',
      duration: 3000,
    })
  } finally {
    loadingOrders.value = false
  }
}

watch(
  () => form.value.reason,
  (reason) => {
    if (reason?.show_orders && isLoggedIn.value) {
      fetchOrders()
    } else {
      form.value.orderId = ''
    }
  }
)

watch(
  () => requiresOrder.value,
  (val) => {
    if (!val) {
      selectedOrder.value = null
      form.value.orderId = ''
      orderDropdownOpen.value = false
    }
  }
)


function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) highlightedIndex.value = 0
}

function selectReason(reason) {
  form.value.reason = reason
  form.value.orderId = ''
  dropdownOpen.value = false
}

function toggleOrderDropdown() {
  orderDropdownOpen.value = !orderDropdownOpen.value
}

function selectOrder(order) {
  selectedOrder.value = order
  form.value.orderId = order.id
  orderDropdownOpen.value = false
}


function triggerFile() { fileInput.value?.click() }

function onFileChange(e) {
  const files = Array.from(e.target.files)
  files.forEach(f => {
    form.value.attachments.push({ file: f, name: f.name, size: f.size })
  })
  fileName.value = form.value.attachments.map(f => f.name).join(', ')
  toast.success({ title: t('ticketToastFileAttached'), message: fileName.value, position: 'topCenter', duration: 2000 })
}

function formatDate(dt) {
  try { return new Date(dt).toLocaleDateString() } catch { return dt }
}

function validateForm() {
  errors.value = {}
  if (!form.value.name) errors.value.name = t('ticketErrorName')
  if (!form.value.email) errors.value.email = t('ticketErrorEmail')
  if (!form.value.reason) errors.value.reason = t('ticketErrorReason')
  if (!form.value.subject) errors.value.subject = t('ticketErrorSubject')
  if (!form.value.message) errors.value.message = t('ticketErrorMessage')
  if (requiresOrder.value && !form.value.orderId) {
     errors.value.orderId = t('ticketErrorOrder')
   }
  return Object.keys(errors.value).length === 0
}

async function submitTicket() {
  if (!validateForm()) return
  if (!verified.value) {
    execute()

    toast.error({
      title: 'Verification',
      message: 'Please wait while we verify you...',
      position: 'topCenter'
    })
    return
  }

  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message,
      reasonId: form.value.reason.id,
      orderId: requiresOrder.value ? form.value.orderId : '',
      attachments: form.value.attachments.map(f => f.file || f)
    }
    const response = await ticketStore.createTicket(payload)
    if (!response.status) {
      execute()
    }
    if (response.status) {
      toast.success({ title: t('ticketToastSuccess'), message: t('ticketToastCreated'), position: 'topCenter', duration: 2500 })
      router.push({ path: '/contact-us/chat', query: { uuid: response.data.uuid } })
    } else throw new Error(response.message || 'Failed to create ticket')
  } catch (err) {
    toast.error({ title: t('ticketToastError'), message: err.message, position: 'topCenter', duration: 3000 })
  }
}

function openConversation(uuid) {
  const ticket = ticketStore.getTicketById(uuid)
  if (!ticket || ticket.status === 'closed') {
    toast.error({ title: t('ticketToastClosedTitle'), message: t('ticketToastClosedMsg'), position: 'topCenter', duration: 3000 })
    return
  }
  router.push({ path: '/contact-us/chat', query: { uuid: uuid } })
}

let reasonsFetched = false
onMounted(() => {
  // Execute Turnstile
  execute()

  if (isLoggedIn.value) ticketStore.fetchTickets()
  if (!reasonsFetched) { fetchReasons(); reasonsFetched = true }
})
</script>

<style scoped>
.input { @apply w-full px-3 py-3 rounded-xl bg-bgDark text-sm sm:text-base outline-none transition duration-200 placeholder:text-onFooter/50 border border-transparent focus:border-primary; }
.label { @apply block text-[15px] text-mainText mb-2; }
.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-5px); }
</style>
