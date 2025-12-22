<template>
  <transition name="fade" class="mt-0 pt-0">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black/70 
      backdrop-blur-sm flex items-center justify-center z-[9999] overflow-hidden
       !m-0 !p-0 w-screen h-screen"
    >
      <!-- ================= Main Popup Card ================= -->
      <div
        class="relative flex flex-col items-center justify-center text-center
         w-[90%] max-w-md sm:max-w-lg
         overflow-hidden p-8 md:p-10 animate-fadeIn"
      >
        <!-- Background Image -->
        <NuxtImg
          src="/games/PopupMainCard.png"
          alt="Popup Background"
          format="webp"
          densities="x1"
          quality="80"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-contain object-center z-0"
        />

        <!-- ================= Content ================= -->
        <div
          class="relative z-10 flex flex-col scale-75 md:scale-90 font-poppins items-center justify-center w-full space-y-5"
        >
          <!-- Heading -->
          <h2 class="text-xl sm:text-2xl font-semibold text-mainText">
            Your Code
          </h2>

          <!-- ================= Codes List ================= -->
          <!-- NEW: supports multiple codes (old Vue behavior) -->
          <div
            v-if="resolvedCodes.length"
            class="w-full border border-outline rounded-xl py-4 px-4 text-left max-h-40 overflow-y-auto"
          >
            <div
              v-for="(item, index) in resolvedCodes"
              :key="index"
              class="mb-3 last:mb-0"
            >
              <p class="text-sm text-onMainText">PIN:</p>
              <p class="text-lg break-all font-semibold text-mainText">
                {{ item.code }}
              </p>

              <p class="text-sm text-onMainText mt-1">Serial:</p>
              <p class="text-sm break-all text-gray-100">
                {{ item.serial }}
              </p>
            </div>
          </div>

          <!-- ================= Legacy Fallback (DO NOT REMOVE) ================= -->
          <!-- This keeps backward compatibility -->
          <template v-else>
            <!-- Key Box -->
            <div
              class="w-full border border-outline rounded-xl font-normal py-4 px-4 text-center"
            >
              <p class="text-xl sm:text-2xl break-all">
                {{ orderKey || 'XXXX-XXXX-XXXX-XXXX' }}
              </p>
            </div>

            <!-- Serial Box -->
            <div
              class="w-full rounded-xl py-2 px-4 text-center"
            >
              <p class="text-sm font-semibold sm:text-base text-mainText">
                Serial:
                <span class="text-gray-100 font-normal tex-sm">
                  {{ serial || 'XXXXXXXXXXXXXXX' }}
                </span>
              </p>
            </div>
          </template>

          <!-- ================= Copy & Close Buttons ================= -->
          <div class="flex justify-between items-center w-full gap-3">
            <AppButton
              variant="outline"
              full
              :height="42"
              extraClass="text-sm flex items-center rounded-full justify-center"
              @click="copyKey"
            >
              Copy
            </AppButton>

            <AppButton
              variant="outline"
              full
              :height="42"
              extraClass="text-sm flex items-center rounded-full justify-center"
              @click="$emit('close')"
            >
              Close
            </AppButton>
          </div>

          <!-- ================= Bottom Buttons ================= -->
          <div class="flex items-center w-full gap-3">
            <button
              class="w-full py-3 text-onError bg-error/70 hover:bg-red/80 rounded-full text-sm flex items-center justify-center gap-2"
              @click="reportProblem"
            >
              Report problem
            </button>

            <AppButton
              variant="primary"
              full
              :height="42"
              extraClass="text-sm flex items-center rounded-full justify-center gap-2"
              @click="goToRedeem"
            >
              <Icon
                name="heroicons-solid:question-mark-circle"
                class="text-xl text-white"
              />
              How to redeem
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useToast, useRouter } from '#imports'
import { useOrdersStore } from '~/stores/ordersStore.js'

/* ================= Setup ================= */
const toast = useToast()
const router = useRouter()
const ordersStore = useOrdersStore()

/* ================= Props (DO NOT REMOVE ANY) ================= */
const props = defineProps({
  visible: Boolean,

  // Legacy single-code props (kept intentionally)
  orderKey: { type: String, default: '' },
  serial: { type: String, default: '' },

  // NEW: multiple codes support
  codes: { type: Array, default: () => [] },

  // Legacy (kept, unused now)
  itemId: { type: Number, default: null }
})

const emit = defineEmits(['close', 'codesFetched'])

/* ================= Resolved Codes ================= */
/**
 * Priority:
 * 1. codes[] (new system, multiple)
 * 2. orderKey + serial (legacy fallback)
 */
const resolvedCodes = computed(() => {
  if (Array.isArray(props.codes) && props.codes.length) {
    return props.codes
  }

  if (props.orderKey) {
    return [
      {
        code: props.orderKey,
        serial: props.serial
      }
    ]
  }

  return []
})

/* ================= Actions ================= */
const copyKey = () => {
  if (!resolvedCodes.value.length) return

  const pins = resolvedCodes.value.map(c => c.code).join(', ')
  navigator.clipboard.writeText(pins)

  toast.success({
    title: 'Success!',
    message:
      resolvedCodes.value.length > 1
        ? 'All PINs copied!'
        : 'PIN copied!',
    position: 'topRight',
    duration: 3000,
    pauseOnHover: true,
    class: 'bg-[#1E1F22] text-white border-l-4 border-green-500'
  })
}

const reportProblem = () => {
  const orderId = ordersStore.selectedOrder?.id
  router.push(orderId ? `/contact-us?order=${orderId}` : '/contact-us')
}

const goToRedeem = () => {
  router.push('/product_activation')
}

/* ================= Watchers ================= */
watch(
  () => props.visible,
  (isVisible) => {
    // SSR-safe body lock
    if (process.client) {
      document.body.style.overflow = isVisible ? 'hidden' : 'auto'
    }
  }
)
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
