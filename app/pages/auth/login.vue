<template>
  <div class="flex items-center justify-center min-h-screen font-poppins px-4 bg-page-gradient">
    <div class="w-full max-w-md text-mainText py-12">

      <!-- Heading -->
      <h2 class="text-2xl font-semibold text-center mb-4">Welcome back!</h2>
      <p class="text-center text-sm text-mainText mb-10">
        Enter your credentials to access your account
      </p>

      <!-- Global Error -->
      <p v-if="globalError" class="text-error text-sm mb-3 text-center">{{ globalError }}</p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email / Phone -->
        <div>
          <label class="block mb-1 text-sm">Email or Phone</label>
          <input
            v-model="identifier"
            type="text"
            placeholder="Enter your email or phone"
            :class="inputClass('identifier')"
          />
          <p v-if="errors.identifier" class="text-error text-xs mt-1">{{ errors.identifier }}</p>
        </div>

        <!-- Password -->
        <div class="relative">
          <label class="block mb-1 text-sm">Password</label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            :class="inputClass('password') + ' pr-10'"
          />
          <button type="button" class="absolute right-2 top-1/2 text-onFooter" @click="showPassword = !showPassword">
            <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5" />
          </button>
          <p v-if="errors.password" class="text-error text-xs mt-1">{{ errors.password }}</p>
        </div>

        <!-- Remember Me + Forgot -->
        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="rememberMe" class="accent-primary w-4 h-4" />
            <span>Remember for 30 days</span>
          </label>

          <NuxtLink to="/auth/forgot-password" class="text-xs underline text-primary hover:text-primary/80">
            Forgot password?
          </NuxtLink>
        </div>

        <!-- Login Button -->
        <AppLink type="submit" full class="h-10 font-semibold" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </AppLink>
      </form>

      <!-- Signup Link -->
      <p class="text-center text-sm mt-6">
        Don't have an account?
        <NuxtLink to="/auth/signup" class="text-primary hover:underline">Sign Up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { navigateTo, useCookie } from '#app'
import { useUserStore } from '~/stores/userStore.js'
import { useToast } from '#imports'

const toast = useToast()
const userStore = useUserStore()

const identifier = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const errors = ref({})
const globalError = ref('')
const loading = ref(false)

// Clear errors on input change
watch([identifier, password], () => {
  globalError.value = ''
  errors.value = {}
})

// Input class helper
const inputClass = (field) =>
  [
    'w-full h-10 p-2 text-sm rounded-md bg-bgDark text-onFooter focus:outline-none placeholder:text-inputsIn',
    errors.value[field] ? 'border border-error' : 'border border-transparent focus:border-primary',
  ].join(' ')

// Simple validation
const validateForm = () => {
  errors.value = {}
  globalError.value = ''

  if (!identifier.value) errors.value.identifier = 'Email or phone is required.'
  if (!password.value) errors.value.password = 'Password is required.'

  return Object.keys(errors.value).length === 0
}

// Login handler
const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    const res = await userStore.login(identifier.value, password.value)
    loading.value = false

    if (!res.success) {
      globalError.value = res.message || 'Login failed.'
      toast.error({ 
        title: 'Login Failed',
         message: globalError.value,
         position: 'topCenter',
         duration: 4000 })
      return
    }

    // OTP required? → redirect to OTP page
    if (res.otpRequired) {
      toast.info({
         title: 'Account Activation', 
         message: 'Please verify your OTP.',
         position: 'topCenter',
         duration: 3000 })
      navigateTo('/auth/otp-verification')
      return
    }

    // Active user → success toast + profile/dashboard
    toast.success({ title: 'Welcome Back!',
     message: res.message || 'Login successful',
     position: 'topCenter',
     duration: 2500 })

    // Remember Me
    if (rememberMe.value) {
      useCookie('rememberMe', { maxAge: 60 * 60 * 24 * 30 }).value = true
    }

    await nextTick()
    navigateTo('/profile')

  } catch (err) {
    loading.value = false
    console.error('Login error:', err)
    globalError.value = 'Network error. Please try again.'
    toast.error({ title: 'Error', message: globalError.value, position: 'topCenter', duration: 4000 })
  }
}

definePageMeta({ layout: 'auth' })
</script>
