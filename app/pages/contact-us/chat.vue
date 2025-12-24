<template>
  <div class="min-h-screen text-mainText py-10 px-6 md:px-12">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-semibold mb-6 font-inter">Ticket Conversation</h1>

      <div class="flex flex-col lg:flex-row bg-[#1E2126] shadow-sm font-inter rounded-2xl overflow-hidden">
        <!-- Left Section: Chat -->
        <div class="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-onFooter/20">
          <!-- Header -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
              <NuxtImg densities="x1" quality="80" loading="lazy" src="/games/ChatHeadPhone.svg" />
            </div>
            <div>
              <div class="text-lg font-semibold">Support Chat</div>
              <div v-if="ticket?.reason?.show_orders === true && ticket?.order_id" class="text-sm text-onFooter">Game Order #{{ ticket?.order_id || '—' }}</div>
              <div v-else class="text-sm text-onFooter">{{ ticket?.reason?.name }}</div>
            </div>
          </div>

          <!-- Chat messages -->
          <div ref="chatWrap" class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <ChatMessage
              v-for="msg in messages"
              :key="msg.id"
              :message="msg"
              :support-name="'Support'"
            />
            <div v-if="!messages?.length" class="h-full flex items-center justify-center text-onFooter/70 text-sm">
              No messages yet. Start a conversation below 👇
            </div>
          </div>
          <!-- Selected Images Chips -->
          <div
            v-if="selectedImages.length"
            class="flex flex-wrap gap-2 mb-3"
          >
            <div
              v-for="(file, index) in selectedImages"
              :key="index"
              class="flex items-center gap-2 bg-[#2E364A] text-xs px-3 py-2 rounded-full"
            >
              <span class="truncate max-w-[120px]">
                {{ file.name }}
              </span>
          
              <button
                @click="removeImage(index)"
                class="text-onFooter hover:text-error transition"
              >
                ✕
              </button>
            </div>
          </div>
          <!-- Input box -->
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
                :disabled="!canSend || sending"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full 
                       flex items-center justify-center shadow-md transition
                       disabled:opacity-40 disabled:cursor-not-allowed
                       bg-chat-gradient text-white hover:opacity-90"
              >
                <Icon name="ph:paper-plane-tilt-bold" size="18" />
              </button>
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg"
                class="hidden"
                @change="onImageSelect"
              />
              
              <button
                @click="fileInput?.click()"
                class="absolute right-14 top-1/2 -translate-y-1/2 text-onFooter"
              >
                <Icon name="mdi:paperclip" size="20" />
              </button>
            </div>
          </div>
        </div>

        <!-- Right Section: Ticket Details -->
        <div class="w-full bg-gradient-to-b from-[#1E2126] bg-[#201f1f] lg:w-[380px] p-6 flex flex-col gap-4">
          <h2 class="text-mainText font-semibold text-2xl">Ticket Details</h2>

          <!-- Ticket Info -->
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
                      : 'bg-onFooter text-mainText/80 px-3 py-1 rounded-full text-xs'">
                    {{ ticket?.status }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">Priority:</span>
                  <span class="bg-[#EAB30833] px-3 py-1 rounded-full text-[#FACC15]">{{ ticket?.priority || 'Medium' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">Created:</span>
                  <span class="text-mainText">{{ formatCreatedDate(ticket?.created_at) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">Last Updated:</span>
                  <span class="text-mainText flex items-center gap-1">
                    <Icon name="lucide:clock" class="w-4 h-4 text-mainText/60" />
                    {{ formatUpdatedDate(ticket?.updated_at) }}
                  </span>
                </div>
              </div>
            </transition>
          </div>

          <!-- User Details -->
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

          <!-- Order Details -->
          <div v-show="ticket?.reason?.show_orders === true && ticket?.order_id" class="bg-[#2E364A] rounded-lg" >
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
                <div><strong>Order ID:</strong> {{ ticket?.order_id || '—' }}</div>
                <div><strong>Platform:</strong> {{ ticket?.platform || '—' }}</div>
              </div>
            </transition>
          </div>

          <!-- Action Button -->
          <AppButton
            variant="primary"
            class="w-full font-poppins bg-primary text-white px-4 py-3 rounded-full hover:bg-primary/90 transition"
            @click="makeResolved"
          >
            Mark as Resolved
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTicketStore } from '~/stores/ticketStore.js'
import { useToast } from '#imports'

const ticketStore = useTicketStore()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const chatWrap = ref(null)
const newMsg = ref('')
const sending = ref(false)
const fileInput = ref(null)
const selectedImages = ref([]) 
const ticketUuid = ref(null)
const openSection = ref('ticketInfo')
const isLoaded = ref(false)
const timeNow = ref(Date.now())


function onImageSelect(e) {
  const files = Array.from(e.target.files)

  files.forEach(file => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return // 5MB guard

    selectedImages.value.push(file)
  })

  e.target.value = ''
}

function removeImage(index) {
  selectedImages.value.splice(index, 1)
}


function toggleSection(section) {
  openSection.value = openSection.value === section ? null : section
}

// Load ticket details
onMounted(async () => {
  ticketUuid.value = route.query.uuid

  if (!ticketUuid.value || typeof ticketUuid.value !== 'string') {
    return router.replace('/contact-us')
  }

  await ticketStore.fetchTicketDetails(ticketUuid.value)
  isLoaded.value = true
  scrollToBottom()
})


const ticket = computed(() => ticketStore.ticketDetails || {})
const canSend = computed(() => {
  return newMsg.value.trim().length > 0 || selectedImages.value.length > 0
})
const messages = computed(() => {
  if (!ticketStore.replies) return []

  return ticketStore.replies.map(reply => ({
    id: reply.id,
    text: reply.message && reply.message !== 'null' ? reply.message : '',
    time: reply.created_at,
    sender: reply.replier === 'Customer' ? 'user' : 'support',
    images: reply.images || [],
  }))
})

function scrollToBottom() {
  nextTick(() => {
    if (chatWrap.value) chatWrap.value.scrollTop = chatWrap.value.scrollHeight
  })
}

watch(messages, scrollToBottom, { deep: true })

async function send() {
  if (sending.value) return
  if (!newMsg.value.trim() && !selectedImages.value.length) return

  sending.value = true

  try {
    const res = await ticketStore.sendReply(
      ticketUuid.value,
      newMsg.value,
      selectedImages.value
    )

    // backend-level failure (reply limit etc.)
    if (!res.status) {
      toast.error({
        title: 'Message not sent',
        message: res.errors?.[0] || res.message || 'Something went wrong',
        position: 'topCenter',
        duration: 3000,
      })
      return
    }

    // success
    newMsg.value = ''
    selectedImages.value = []
    scrollToBottom()

  } catch (error) {
    toast.error({
      title: 'Error',
      message: `Failed to send message: ${error.message || error}`,
      position: 'topCenter',
      duration: 3000,
    })
  } finally {
    sending.value = false
  }
}

// Message Guard


async function makeResolved() {
  try {
    const res = await ticketStore.closeTicket(ticketUuid.value)
    if (res.status) {
      toast.success({ title: 'Success', message: 'Ticket closed', position: 'topCenter', duration: 2500 })
      ticketStore.ticketDetails.status = 'closed'
    }
  } catch {
    toast.error({ title: 'Error', message: 'Failed to close ticket', position: 'topCenter', duration: 3000 })
  }
}

// Formatting functions
function formatCreatedDate(dt) {
  try {
    return new Date(dt).toLocaleString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit', hour12:true }).replace(',', '').replace(' ', ' at ')
  } catch { return dt }
}

function formatUpdatedDate(dt) {
  try {
    timeNow.value
    const updated = new Date(dt)
    const diffSec = Math.floor((Date.now() - updated.getTime())/1000)
    if (diffSec < 60) return 'just now'
    const diffMin = Math.floor(diffSec/60)
    if (diffMin < 60) return `${diffMin} minute${diffMin>1?'s':''} ago`
    const diffHour = Math.floor(diffMin/60)
    if (diffHour < 24) return `${diffHour} hour${diffHour>1?'s':''} ago`
    const diffDay = Math.floor(diffHour/24)
    if (diffDay < 30) return `${diffDay} day${diffDay>1?'s':''} ago`
    const diffMonth = Math.floor(diffDay/30)
    if (diffMonth < 12) return `${diffMonth} month${diffMonth>1?'s':''} ago`
    const diffYear = Math.floor(diffDay/365)
    return `${diffYear} year${diffYear>1?'s':''} ago`
  } catch { return dt }
}
</script>

<style scoped>
.input { @apply w-full px-5 py-4 rounded-full bg-[#2E364A] outline-none text-sm; }
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }

::-webkit-scrollbar { width: 0; height: 0; }
* { scrollbar-width: none; -ms-overflow-style: none; }
</style>
