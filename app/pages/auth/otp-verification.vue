<template>
  <section
    class="min-h-screen flex flex-col md:flex-row md:-mt-[2.3rem] items-center justify-center text-white px-4 md:px-10"
  >
    <!-- Left Image -->
    <div class="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
      <NuxtImg
        src="/games/ForgotPasswordLeft.png"
        alt="OTP Verification Illustration"
        quality="80"
        format="webp"
        densities="x1"
        loading="lazy"
        class="max-w-md w-full object-contain rounded-3xl"
      />
    </div>

    <!-- Right Side -->
    <div class="w-full md:w-1/2 flex flex-col font-inter justify-center max-w-md mx-auto rounded-3xl p-10 md:p-16">
      <!-- Icon -->
      <div class="flex mb-6">
        <NuxtImg
          densities="x1" quality="80" format="webp" loading="lazy"
          src="/games/ForgotPasswordMainEmail.svg" alt="OTP Icon"
        />
      </div>

      <!-- Heading -->
      <h2 class="text-2xl md:text-3xl font-semibold mb-2">OTP Verification</h2>
      <p class="text-inputsIn text-xs mb-7 md:mb-12">
        Check your email or phone to see the verification code
      </p>

      <!-- OTP Inputs -->
      <div
        :class="[
          'flex justify-center space-x-1 mb-4 transition-transform duration-200',
          { 'animate-shake': showError },
        ]"
      >
        <input
          v-for="(digit, index) in 6"
          :key="index"
          type="text"
          maxlength="1"
          v-model="otp[index]"
          @input="handleInput(index)"
          ref="otpInputs"
          @keydown.backspace="handleBackspace(index)"
          class="w-12 h-12 text-center text-lg rounded-full border transition-all duration-200 bg-transparent focus:outline-none"
          :class="[
            showError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-500 focus:border-primary focus:ring-1 focus:ring-primary',
          ]"
        />
      </div>

      <!-- Error -->
      <p
        v-if="errorMessage"
        class="text-error text-center text-sm mb-2 flex items-center gap-1 justify-center"
      >
        <span
          class="flex items-center justify-center w-3 h-3 rounded-full bg-error text-black text-xs"
          >!</span
        >
        {{ errorMessage }}
      </p>

      <!-- Verify Button -->
      <AppLink full class="h-9 font-semibold font-poppins mt-3" @click="verifyOtp">
        Verify
      </AppLink>

      <!-- Timer / Resend -->
      <p class="text-mainText text-center text-sm mt-4 md:mt-7">
        <template v-if="isTimerRunning">
          Resend code in
          <span class="text-primary font-semibold">{{ formatTime(timer) }}</span>
        </template>
        <template v-else>
          Didn’t receive the code?
          <span @click.stop="resendOtp"
           class="text-primary cursor-pointer inline-block hover:underline"
           style="pointer-events: auto;"
          >
            Resend code
          </span>
        </template>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '~/stores/userStore'
import { useToast } from '#imports'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const toast = useToast()

// FLOW TYPE
const otpFlow = ref(route.query.type || 'activation')

// EMAIL (activation → store se, reset → query se)
const userEmail = ref(
  route.query.email ||
  userStore.currentUser?.email ||
  localStorage.getItem('resetIdentifier') ||
  ''
)

// OTP
const otp = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const errorMessage = ref('')
const showError = ref(false)

// TIMER
const timer = ref(0)
const isTimerRunning = ref(false)
let timerInterval = null

// TIMER fn
const startTimer = () => {
  timer.value = 59
  isTimerRunning.value = true

  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timer.value > 0) timer.value--
    else {
      isTimerRunning.value = false
      clearInterval(timerInterval)
    }
  }, 1000)
}

// Format MM:SS
const formatTime = (s) => {
  const m = String(Math.floor(s / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return `${m}:${sec}`
}

// OTP input handlers
const handleInput = (i) => {
  showError.value = false
  errorMessage.value = ''
  if (otp.value[i].length === 1 && i < 5) {
    otpInputs.value[i + 1]?.focus()
  }
}

const handleBackspace = (i) => {
  if (otp.value[i] === '' && i > 0) {
    otpInputs.value[i - 1]?.focus()
  }
}

// RESEND OTP
const resendOtp = async () => {
  startTimer()

  try {
    if (otpFlow.value === 'reset') {
      await userStore.requestPasswordReset(userEmail.value)
    } else {
      await userStore.resendCode()
    }
    toast.success('OTP sent!')
  } catch (e) {
    console.error(e)
  }
}

// VERIFY OTP
const verifyOtp = async () => {
  const code = otp.value.join('')

  if (code.length !== 6) {
    showError.value = true
    errorMessage.value = 'Enter 6-digit OTP'
    return
  }

  // RESET FLOW
  if (otpFlow.value === 'reset') {
    localStorage.setItem('resetCode', code)
    return router.push('/auth/reset-password')
  }

  // ACTIVATION FLOW
  const res = await userStore.activateAccount(code)

  if (!res.success) {
    errorMessage.value = res.message || 'Invalid OTP'
    showError.value = true
    return
  }

  toast.success('Account activated!')
  router.push('/profile')
}

// AUTO SEND OTP on mount
onMounted(async () => {
  startTimer()

  if (otpFlow.value === 'activation') {
    await userStore.resendCode()
  }

  if (otpFlow.value === 'reset') {
    await userStore.requestPasswordReset(userEmail.value)
  }

  nextTick(() => {
    if (otpInputs.value && otpInputs.value[0]) {
    otpInputs.value[0]?.focus()
    }
  })
})

onUnmounted(() => clearInterval(timerInterval))

definePageMeta({ layout: 'auth' })
</script>



<style scoped>
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
  100% { transform: translateX(0); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
