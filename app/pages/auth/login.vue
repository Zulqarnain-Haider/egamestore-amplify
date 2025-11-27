<template>
  <div class="flex items-center justify-center min-h-screen font-poppins px-4 bg-page-gradient">
    <div class="w-full max-w-md text-mainText py-12">
      <!-- Heading -->
      <h2 class="text-2xl font-semibold text-center mb-4 font-poppins">Welcome back!</h2>
      <p class="text-center text-sm text-mainText mb-10 font-poppins">
        Enter your credentials to access your account
      </p>

      <!-- Global Error Message -->
      <p v-if="globalError" class="text-error text-sm mb-3 text-center font-poppins">
        {{ globalError }}
      </p>

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
            :class="inputClass('password') + ' pr-28'"
          />

          <!-- Toggle Eye Icon -->
  <button
    type="button"
    class="absolute right-2 top-12 -translate-y-1/2 text-onFooter"
    @click="showPassword = !showPassword"
  >
    <Icon
      :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
      class="w-5 h-5"
    />
  </button>


          <p v-if="errors.password" class="text-error text-xs mt-1">{{ errors.password }}</p>
        </div>

        <!-- Remember Me Checkbox -->
        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="accent-primary w-4 h-4 cursor-pointer"
            />
            <span class="text-mainText text-sm">Remember for 30 days</span>
          </label>

           <NuxtLink
            to="/auth/forgot-password"
            class="-translate-y-[45%] text-xs underline text-primary hover:text-primary/80 cursor-pointer"
          >
            forgot password?
          </NuxtLink>

        </div>

        <!-- Login Button -->
        <AppLink type="submit" full class="h-10 mt-5 font-poppins font-semibold">
          Login
        </AppLink>
      </form>

      <!-- Divider -->
      <div class="flex items-center justify-center my-6 text-onMainText relative">
        <span class="border-t border-2 border-white w-1/2"></span>
        <span class="text-sm bg-white px-1 text-black">Or</span>
        <span class="border-t border-2 border-white w-1/2"></span>
      </div>

      <!-- Social Icons -->
      <div class="flex justify-center gap-4 mt-12 mb-6">
        <img src="/games/Signinwith1.svg" alt="Google" class="cursor-pointer" />
        <img src="/games/Signinwith2.svg" alt="Facebook" class="cursor-pointer" />
        <img src="/games/Signinwith3.svg" alt="Apple" class="cursor-pointer" />
        <img src="/games/Signinwith4.svg" alt="Twitter" class="cursor-pointer" />
      </div>

      <!-- Signup Link -->
      <p class="text-center text-sm text-mainText">
        Don’t have an account?
        <NuxtLink to="/auth/signup" class="text-primary hover:underline">Sign Up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { navigateTo, useRuntimeConfig, useCookie } from '#app'
import { useUserStore } from '~/stores/userStore.js'
import { useToast } from '#imports'

const toast = useToast()
const userStore = useUserStore()
const config = useRuntimeConfig()

const identifier = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const errors = ref({})
const globalError = ref('')

// Tailwind input style
const inputClass = (field) => [
  'w-full h-10 p-2 text-sm rounded-md bg-bgDark text-onFooter font-poppins focus:outline-none transition-all duration-200 placeholder:text-inputsIn',
  errors.value[field] ? 'border border-error' : 'border border-transparent focus:border-primary',
].join(' ')

// Form validation
const validateForm = () => {
  errors.value = {}
  globalError.value = ''

  if (!identifier.value) errors.value.identifier = 'Email or phone is required.'
  if (!password.value) errors.value.password = 'Password is required.'

  return Object.keys(errors.value).length === 0
}

// Login logic with API
const handleLogin = async () => {
  if (!validateForm()) {
    globalError.value = 'Please fix the highlighted fields.'
    return
  }

  try {
    // 1. Check user existence (optional but useful for API flow)
    const checkBody = new FormData()
    checkBody.append('email_or_phone', identifier.value)
    
    const checkRes = await $fetch(`${config.NUXT_PUBLIC_API_BASE}/users/check-user-existence`, {
      method: 'POST',
      body: checkBody,
      headers: { lang: 'ar' },
    })

    if (!checkRes.status) throw new Error(checkRes.message || 'User does not exist')

    // 2. Perform login
    const loginBody = new FormData()
    loginBody.append('email', identifier.value)
    loginBody.append('password', password.value)

    const res = await $fetch(`${config.NUXT_PUBLIC_API_BASE}/users/login`, {
      method: 'POST',
      body: loginBody,
    })

    if (!res.status) throw new Error(res.message || 'Login failed')

    // Save user in Pinia
    userStore.setUser({
      id: res.data.id,
      token: res.data.token,
      email: res.data.email,
      phone: res.data.phone,
      dob: res.data.dob,
      activation_str: res.data.activation_str,
    })

    // Remember Me (cookie)
    if (rememberMe.value) {
      const rememberCookie = useCookie('rememberMe')
      rememberCookie.value = true
    }

    globalError.value = ''
    await nextTick()

    toast.success({
      title: 'Success!',
      message: res.message,
      position: 'topCenter',
      duration: 3000,
      pauseOnHover: true,
      class: 'bg-[#1E1F22] text-white border-l-4 border-green-500',
    })

    setTimeout(() => navigateTo('/profile'), 500)
  } catch (err) {
    globalError.value = err.message || 'Login failed'

    toast.error({
      title: 'Error!',
      message: err.message || 'Login failed',
      position: 'topCenter',
      duration: 3000,
      pauseOnHover: true,
      class: 'bg-[#1E1F22] text-white border-l-4 border-red-500',
    })
  }
}

definePageMeta({ layout: 'auth' })
</script>

