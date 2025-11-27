<template>
  <div class="min-h-screen text-mainText py-10 px-6 md:px-12">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-semibold mb-6 font-inter">Ticket Conversation</h1>

      <!-- Main container with border and 2 sections -->
      <div class="flex flex-col lg:flex-row bg-[#1E2126] shadow-sm font-inter rounded-2xl overflow-hidden">
        <!-- Left Section: Chat -->
        <div class="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-onFooter/20">
          <!-- Header -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
              <NuxtImg densities="x1" quality="80" loading="lazy" src="/wallet/ChatHeadPhone.svg" />
            </div>
            <div>
              <div class="text-lg font-semibold">Support Chat</div>
              <div class="text-sm text-onFooter">Game Order #{{ ticket?.orderId || '—' }}</div>
            </div>
          </div>

          <!-- Chat messages -->
          <div ref="chatWrap" class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <ChatMessage
              v-for="msg in messages"
              :key="msg.id"
              :message="msg"
              :support-name="'Alex Support'"
            />
          <!-- Show empty state if no messages -->
    <div v-if="!messages?.length" class="h-full flex items-center justify-center text-onFooter/70 text-sm">
      No messages yet. Start a conversation below 👇
    </div>
          </div>

       <!-- Input box fixed at bottom -->
         <div class="mt-4 flex-shrink-0">
            <div class="relative">
            <input
              v-model="newMsg"
              placeholder="Type your message..."
              class="input pr-14"
              @keyup.enter="send"
            />
            <button
              @click="send"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-chat-gradient flex items-center 
              justify-center text-white shadow-md hover:opacity-90 transition"
            >
              <Icon name="ph:paper-plane-tilt-bold" size="18" />
            </button>
          </div>
        </div>
        </div>
  
        <!-- Right Section: Ticket Details -->
        <div class="w-full bg-gradient-to-b from-[#1E2126] bg-[#201f1f] lg:w-[380px] p-6 flex flex-col gap-4">
          <h2 class="text-mainText font-semibold text-2xl">Ticket Details</h2>
          <!-- Ticket Info Dropdown -->
          <div class="bg-[#2E364A] rounded-lg">
            <div
              class="flex justify-between items-center p-4 cursor-pointer select-none"
              @click="toggleSection('ticketInfo')"
            >
              <div class="flex items-center gap-2 text-primary">
                <Icon name="mdi:ticket-confirmation-outline" size="20" />
                <h3 class="text-base font-semibold text-mainText">Ticket Information</h3>
              </div>
              <Icon
                name="mdi:chevron-down"
                size="22"
                class="transition-transform duration-300 text-mainText/60"
                :class="{ 'rotate-180': openSection === 'ticketInfo' }"
              />
            </div>

            <transition name="fade">
              <div v-if="openSection === 'ticketInfo'" class="px-4 pb-4 text-sm text-mainText/50 space-y-3">
                <div class="flex justify-between">
                  <span class="font-medium">Ticket ID:</span>
                  <span class="text-blue-400">#{{ ticket?.id }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="font-medium">Status:</span>
                  <span
                    :class="ticket?.status === 'active'
                      ? 'bg-green-300 text-green-600 px-3 py-1 rounded-full text-xs'
                      : 'bg-onFooter text-mainText/80 px-3 py-1 rounded-full text-xs'"
                  >
                  {{ ticket?.status === 'active' ? 'Active' : 'Closed' }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="font-medium">Priority:</span>
                  <span class="bg-[#EAB30833] px-3 py-1 rounded-full text-[#FACC15] bg-">{{ ticket?.priority || 'Medium' }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="font-medium">Created:</span>
                  <span class="text-mainText">{{ formatCreatedDate(ticket.createdAt) }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="font-medium">Last Updated:</span>
                    <span class="text-mainText flex items-center gap-1">
                      <Icon name="lucide:clock" class="w-4 h-4 text-mainText/60" />
                      {{ formatUpdatedDate(ticket.updatedAt) }}
                 </span>
                </div>
              </div>
            </transition>
          </div>

          <!-- User Details Dropdown -->
          <div class="bg-[#2E364A] rounded-lg">
            <div
              class="flex justify-between items-center p-4 cursor-pointer select-none"
              @click="toggleSection('userDetails')"
            >
              <div class="flex items-center gap-2 text-primary">
                <Icon name="mdi:account-circle-outline" size="20" />
                <h3 class="text-base text-mainText">User Details</h3>
              </div>
              <Icon
                name="mdi:chevron-down"
                size="22"
                class="transition-transform duration-300 text-mainText/60"
                :class="{ 'rotate-180': openSection === 'userDetails' }"
              />
            </div>

            <transition name="fade">
              <div v-if="openSection === 'userDetails'" class="px-4 pb-4 text-sm text-onFooter space-y-2">
                <div><strong>Name:</strong> {{ ticket?.name || '—' }}</div>
                <div><strong>Email:</strong> {{ ticket?.email || '—' }}</div>
              </div>
            </transition>
          </div>

          <!-- Order Details Dropdown -->
          <div class="bg-[#2E364A] rounded-lg">
            <div
              class="flex justify-between items-center p-4 cursor-pointer select-none"
              @click="toggleSection('orderDetails')"
            >
              <div class="flex items-center gap-2 text-primary">
                <Icon name="mdi:clipboard-list-outline" size="20" />
                <h3 class="text-base text-mainText">Order Details</h3>
              </div>
              <Icon
                name="mdi:chevron-down"
                size="22"
                class="transition-transform duration-300 text-mainText/60"
                :class="{ 'rotate-180': openSection === 'orderDetails' }"
              />
            </div>

            <transition name="fade">
              <div v-if="openSection === 'orderDetails'" class="px-4 pb-4 text-sm text-onFooter space-y-2">
                <div><strong>Order ID:</strong> {{ ticket?.orderId || '—' }}</div>
                <div><strong>Platform:</strong> {{ ticket?.platform || '—' }}</div>
              </div>
            </transition>
          </div>

          <!-- Action Button -->
          <AppButton
          variant="primary"
            @click="makeResolved"
            class="w-full font-poppins bg-primary text-white px-4 py-3 rounded-full hover:bg-primary/90 transition"
          >
            Make as resolved
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTicketStore } from '~/stores/ticketStore.js'


const route = useRoute()
const router = useRouter()
const ticketStore = useTicketStore()

const chatWrap = ref(null)
const newMsg = ref('')
const ticketId = ref(null)
const openSection = ref('ticketInfo') // default open
const isLoaded = ref(false)
const timeNow = ref(Date.now()) // used for auto-refresh

// Auto-update timer
let timer = null

function toggleSection(section) {
  openSection.value = openSection.value === section ? null : section
}

onMounted(async () => {
  ticketStore.loadFromStorage()
  ticketId.value = Number(route.query.id)
  if (!ticketId.value) return router.replace('/contact')

  await nextTick()
  const found = ticketStore.getTicketById(ticketId.value)
  if (!found) return router.replace('/contact')

  ticketStore.selectTicket(ticketId.value)
  isLoaded.value = true
  scrollToBottom()

   // update every 60 seconds
  timer = setInterval(() => {
    timeNow.value = Date.now()
  }, 60000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const ticket = computed(() => ticketStore.getTicketById(ticketId.value) || {})
const messages = computed(() => ticketStore.getMessagesFor(ticketId.value) || [])

function scrollToBottom() {
  nextTick(() => {
    const el = chatWrap.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

watch(messages, scrollToBottom, { deep: true })

function send() {
  if (!newMsg.value.trim()) return
  ticketStore.addMessage(ticketId.value, { sender: 'user', text: newMsg.value })
  newMsg.value = ''
  setTimeout(() => {
    ticketStore.addMessage(ticketId.value, { sender: 'support', text: "Thanks — we'll check and get back to you shortly." })
  }, 1200)
}

function makeResolved() {
  ticketStore.closeTicket(ticketId.value)
}

// new formatting functions
function formatCreatedDate(dt) {
  try {
    const date = new Date(dt)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).replace(',', '').replace(' ', ' at ')
  } catch {
    return dt
  }
}

function formatUpdatedDate(dt) {
  try {
    // using `timeNow.value` to re-trigger every minute
    timeNow.value
    const updated = new Date(dt)
    const diffMs = Date.now() - updated.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    const diffMonth = Math.floor(diffDay / 30)
    const diffYear = Math.floor(diffDay / 365)

    if (diffSec < 60) return 'just now'
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
    if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
    if (diffMonth < 12)
      return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`
    return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`
  } catch {
    return dt
  }
}
</script>


<style scoped>
.input {
  @apply w-full px-5 py-4 rounded-full bg-[#2E364A] outline-none text-sm;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Hide scrollbar for Chrome, Safari, Edge */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* Hide scrollbar for Firefox */
* {
  scrollbar-width: none;
  -ms-overflow-style: none; /* for IE and Edge */
}

</style>


