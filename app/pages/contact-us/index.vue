<template>
  <div class="min-h-screen text-mainText py-10 px-6 md:px-12">
    <div class="max-w-7xl mx-auto flex flex-col gap-10 font-poppins">
      <h1 class="text-2xl font-semibold font-inter">New Ticket</h1>

      <div class="grid lg:grid-cols-2 gap-6">
        <!-- LEFT -->
        <div>
          <!-- Name -->
          <label class="label">Name</label>
          <input v-model="form.name" class="input" placeholder="" />
          <p v-if="errors.name" class="text-error text-xs mt-1">{{ errors.name }}</p>

          <!-- Reason -->
          <label class="label mt-4">Select Reason</label>
          <div class="relative">
            <div
              class="input flex justify-between items-center cursor-pointer select-none pr-10"
              @click="toggleDropdown"
            >
              <span class="truncate"
              :class="form.reason ? 'text-mainText' : 'text-onFooter/50'"
              >
                {{ form.reason || 'Select' }}
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
                <li
                  v-for="(r, index) in ticketStore.reasons"
                  :key="r"
                  @click="selectReason(r)"
                  class="px-4 py-2 text-sm cursor-pointer transition-colors duration-200"
                  :class="[
                        index === highlightedIndex
                      ? 'bg-primary/20 text-mainText'
                      : 'text-mainText hover:bg-primary/20'
                  ]"
                >
                  {{ r }}
                </li>
              </ul>
            </transition>
          </div>
          <p v-if="errors.reason" class="text-error text-xs mt-1">{{ errors.reason }}</p>

          <!-- Subject -->
          <label class="label mt-4">Subject</label>
          <input v-model="form.subject" class="input" placeholder="" />
          <p v-if="errors.subject" class="text-error text-xs mt-1">{{ errors.subject }}</p>

          <!-- Attachment -->
          <label class="label mt-4">Attachment</label>
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
                <span @click.stop="triggerFile" class="text-primary cursor-pointer">Click here</span>
                to upload or drop files here
              </span>
            </div>
            <input ref="fileInput" type="file" class="hidden" @change="onFileChange" />
          </div>
        </div>

        <!-- RIGHT -->
        <div>
          <label class="label">Email Address</label>
          <input v-model="form.email" class="input" placeholder="Enter your email" />
          <p v-if="errors.email" class="text-error text-xs mt-1">{{ errors.email }}</p>

          <label class="label mt-4">Message</label>
          <textarea
            v-model="form.message"
            rows="8"
            class="input resize-none"
            placeholder="Describe your issue..."
          ></textarea>
          <p v-if="errors.message" class="text-error text-xs mt-1">{{ errors.message }}</p>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex justify-center font-poppins mt-4">
        <button
          @click="submit"
          class="bg-primary text-white px-10 py-3 rounded-full hover:opacity-90 transition"
        >
          Send Message
        </button>
      </div>

      <!-- Guest Note -->
      <p
        v-if="!isLoggedIn"
        class="text-center text-onFooter mt-2 underline cursor-pointer font-poppins"
      >
        Don't have an account?
        <NuxtLink to="/auth/signup" class="text-primary">Signup</NuxtLink>
      </p>

      <!-- Previous Tickets -->
      <section
        v-if="ticketStore.tickets.length"
        class="mt-10 bg-bgDark border border-onMainText rounded-xl py-4 font-poppins px-0"
      >
        <h3 class="text-lg font-semibold mb-4 px-4 pb-4 border-b border-onMainText">
          Previous Tickets
        </h3>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="px-4">
              <tr class="text-onFooter">
                <th class="text-left pb-3 px-4">Ticket</th>
                <th class="text-left pb-3 px-4">Order</th>
                <th class="text-left pb-3 px-4">Created At</th>
                <th class="text-left pb-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(t, i) in ticketStore.tickets"
                :key="t.id"
                :class="['hover:bg-bgLight/30 transition',
                i === 0 ? '' : 'border-t border-onMainText'
              ]"
              >
                <td class="py-4 px-4">
                  <button class="text-mainText hover:text-primary" @click="openConversation(t.id)">
                    {{ t.id }}
                  </button>
                </td>
                <td class="px-4">{{ t.orderId || '—' }}</td>
                <td class="text-onFooter px-4">{{ formatDate(t.createdAt) }}</td>
                <td class="px-4">
  <span
    :class="t.status === 'active'
      ? 'text-green-600 py-1 rounded-full text-sm'
      : 'text-onFooter py-1 rounded-full text-sm'"
  >
    {{ t.status === 'active' ? 'Active' : 'Closed' }}
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useTicketStore } from '~/stores/ticketStore.js'
import { useUserStore } from '~/stores/userStore.js'
import { useRouter } from 'vue-router'

const ticketStore = useTicketStore()
const userStore = useUserStore()
const router = useRouter()
const { $toast } = useNuxtApp()

const highlightedIndex = ref(0)
const dropdownOpen = ref(false)
const fileInput = ref(null)
const fileName = ref('')
const errors = ref({})

const form = ref({
  name: userStore.currentUser?.name || '',
  email: userStore.currentUser?.email || '',
  reason: '',
  subject: '',
  message: '',
  orderId: '',
  attachments: [],
})

const isLoggedIn = computed(() => !!userStore.currentUser)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
    if (dropdownOpen.value) highlightedIndex.value = 0 // first item highlighted
}

onMounted(() => {
  if (process.client) window.addEventListener('keydown', handleKey)
})

onBeforeUnmount(() => {
  if (process.client) window.removeEventListener('keydown', handleKey)
})

function handleKey(e) {
  if (dropdownOpen.value ) 
  if(['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
    e.preventDefault()

    if (e.key === 'ArrowDown') {
      highlightedIndex.value =
        (highlightedIndex.value + 1) % ticketStore.reasons.length
    } else if (e.key === 'ArrowUp') {
      highlightedIndex.value =
        (highlightedIndex.value - 1 + ticketStore.reasons.length) %
        ticketStore.reasons.length
    } else if (e.key === 'Enter') {
      const r = ticketStore.reasons[highlightedIndex.value]
      selectReason(r)
    }
  }
}

function selectReason(r) {
  form.value.reason = r
  dropdownOpen.value = false
}

function triggerFile() {
  fileInput.value?.click()
}
function onFileChange(e) {
  const f = e.target.files?.[0]
  if (!f) return
  fileName.value = f.name
  form.value.attachments.push({ name: f.name, size: f.size, fileType: f.type })
}

function formatDate(dt) {
  try {
    return new Date(dt).toLocaleDateString()
  } catch {
    return dt
  }
}

function validateForm() {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'Name is required.'
  if (!form.value.email) errors.value.email = 'Email is required.'
  if (!form.value.reason) errors.value.reason = 'Please select a reason.'
  if (!form.value.subject) errors.value.subject = 'Subject is required.'
  if (!form.value.message) errors.value.message = 'Message cannot be empty.'
  return Object.keys(errors.value).length === 0
}

function submit() {
  if (!validateForm()) {
    $toast.error('Please fix the highlighted fields.', {
      autoClose: 2000,
      position: 'top-right',
      theme: 'dark',
    })
    return
  }

  const ticketId = ticketStore.createTicket({ ...form.value })

  $toast.success('Ticket created successfully!', {
    autoClose: 2000,
    position: 'top-right',
    theme: 'dark',
  })

  router.push({ path: '/contact/conversation', query: { id: ticketId } })
}

function openConversation(id) {
  const ticket = ticketStore.getTicketById(id)
  if (ticket.status === 'closed') {
    $toast.error('This ticket is closed and cannot be reopened.', {
      autoClose: 2000,
      position: 'top-right',
      theme: 'dark'
    })
    return
  }
  router.push({ path: '/contact-us/chat', query: { id } })
}
</script>

<style scoped>
.input {
  @apply w-full px-3 py-3 rounded-xl bg-bgDark text-sm sm:text-base outline-none transition duration-200 placeholder:text-onFooter/50 border border-transparent focus:border-primary;
}
.label {
  @apply block text-[15px] text-mainText mb-2;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
