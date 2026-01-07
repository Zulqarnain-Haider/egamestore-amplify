<template>
  <section class="min-h-screen flex flex-col md:flex-row md:-mt-[2.3rem] items-center justify-center text-white px-4 md:px-10">
    <div class="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
      <NuxtImg
        src="/games/ForgotPasswordLeft.png"
        alt="OTP Verification"
        quality="80"
        format="webp"
        densities="x1"
        loading="lazy"
        class="max-w-md w-full object-contain rounded-3xl"
      />
    </div>

    <div class="w-full md:w-1/2 flex flex-col font-inter justify-center max-w-md mx-auto rounded-3xl p-10 md:p-16">
      <h2 class="text-2xl md:text-3xl font-semibold mb-2">
        {{ t('otpTitle') }}
      </h2>

      <p class="text-inputsIn text-xs mb-7 md:mb-12">
        {{ t('otpSubtitle') }}
      </p>

      <div
        :class="[
          'flex justify-center space-x-1 mb-4',
          { 'animate-shake': showError },
        ]"
      >
        <input
          v-for="(_, i) in 6"
          :key="i"
          ref="otpInputs"
          v-model="otp[i]"
          maxlength="1"
          class="w-12 h-12 text-center text-lg rounded-full border bg-transparent"
          @input="handleInput(i)"
          @keydown.backspace="handleBackspace(i)"
        />
      </div>

      <p v-if="errorMessage" class="text-error text-center text-sm mb-2">
        {{ errorMessage }}
      </p>

      <AppLink full class="h-9 mt-3" @click="verifyOtp">
        {{ t('otpVerify') }}
      </AppLink>

      <p class="text-mainText text-center text-sm mt-6">
        <template v-if="isTimerRunning">
          {{ t('otpResendIn') }} {{ formatTime(timer) }}
        </template>
        <template v-else>
          <span class="text-primary cursor-pointer" @click="resendOtp">
            {{ t('otpResendCode') }}
          </span>
        </template>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, navigateTo } from '#imports'
import { useAuth } from '~/composables/useAuth'
import { useUser } from '~/composables/useUser'

definePageMeta({
  layout: 'auth',
  middleware: 'otp',
})

const route = useRoute()
const auth = useAuth()
const user = useUser()
const { t, locale } = useI18n()

const otpFlow = route.query.type || 'activation'

const resetEmail =
  route.query.email ||
  (process.client ? localStorage.getItem('resetIdentifier') : '')

const otp = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const errorMessage = ref('')
const showError = ref(false)

const timer = ref(0)
const isTimerRunning = ref(false)
let timerInterval = null

const startTimer = () => {
  timer.value = 59
  isTimerRunning.value = true
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    timer.value > 0 ? timer.value-- : clearInterval(timerInterval)
  }, 1000)
}

const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

const handleInput = (i) => {
  errorMessage.value = ''
  if (otp.value[i] && i < 5) otpInputs.value[i + 1]?.focus()
}

const handleBackspace = (i) => {
  if (!otp.value[i] && i > 0) otpInputs.value[i - 1]?.focus()
}

const resendOtp = async () => {
  startTimer()
  if (otpFlow === 'reset') {
    await auth.requestPasswordReset(resetEmail, locale.value)
  } else {
    await auth.resendCode(locale.value)
  }
}

const verifyOtp = async () => {
  const code = otp.value.join('')
  if (code.length !== 6) {
    errorMessage.value = t('enter6DigitOTP')
    showError.value = true
    return
  }

  if (otpFlow === 'reset') {
    localStorage.setItem('resetCode', code)
    return navigateTo('/auth/reset-password')
  }

  const res = await user.activateAccount(code, locale.value)
  if (!res.success) {
    errorMessage.value = res.message
    return
  }

  navigateTo('/')
}

onMounted(async () => {
  startTimer()
  if (otpFlow === 'activation') {
    await auth.resendCode()
  }
  nextTick(() => otpInputs.value[0]?.focus())
})

onUnmounted(() => clearInterval(timerInterval))
</script>

<style scoped>
@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%,60%{transform:translateX(-6px)}
  40%,80%{transform:translateX(6px)}
}
.animate-shake{animation:shake .4s}
</style>