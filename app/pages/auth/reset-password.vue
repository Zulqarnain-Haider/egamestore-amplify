<template>
  <section
    class="relative min-h-screen flex flex-col md:-mt-[2.3rem] md:flex-row items-center justify-center text-white px-4 md:px-10 overflow-hidden"
  >
    <!-- Left Image -->
    <div class="w-full md:w-1/2 flex justify-center mb-8 md:mb-0 z-10">
      <NuxtImg
        src="/games/ForgotPasswordLeft.png"
        alt="Forgot Password Left"
        quality="80"
        format="webp"
        densities="x1"
        loading="lazy"
        class="max-w-md w-full object-contain"
      />
    </div>

    <!-- Right Content -->
    <div
      class="w-full md:w-1/2 flex flex-col justify-center font-inter max-w-md mx-auto rounded-3xl p-9 md:p-14 transition-all duration-500"
    >
      <!-- Icon -->
      <div class="flex mb-4">
        <NuxtImg
          src="/games/ForgotPasswordMainEmail.svg"
          alt="Main Icon"
          quality="80"
          densities="x1"
          loading="lazy"
        />
      </div>

      <!-- Heading -->
      <h2 class="text-2xl md:text-3xl font-semibold text-left mb-2">
        Set New Password
      </h2>
      <p class="text-inputsIn text-sm pr-6 text-left mb-6 md:mb-12">
        Enter your new password to complete the reset process
      </p>

      <!-- New Password -->
      <div class="relative mb-4">
        <NuxtImg
          src="/games/InputsLockicon.svg"
          alt="Lock Icon"
          quality="80"
          densities="x1"
          loading="lazy"
          class="absolute left-3 top-11 -translate-y-1/2 text-inputsIn"
        />
        <label class="block mb-1 text-sm">New Password</label>
        <input
          :type="showNewPassword ? 'text' : 'password'"
          v-model="newPassword"
          placeholder="New Password"
          class="w-full bg-bgDark rounded-md py-2 pl-10 pr-10 focus:outline-none placeholder:text-inputsIn focus:ring-1 focus:ring-primary"
        />
        <i
          :class="showNewPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
          class="absolute right-3 top-11 -translate-y-1/2 text-inputsIn cursor-pointer"
          @click="showNewPassword = !showNewPassword"
        ></i>
      </div>

      <!-- Confirm Password -->
      <div class="relative mb-4">
        <NuxtImg
          src="/games/InputsLockicon.svg"
          alt="Lock Icon"
          quality="80"
          densities="x1"
          loading="lazy"
          class="absolute left-3 top-11 -translate-y-1/2 text-inputsIn"
        />
        <label class="block mb-1 text-sm">Confirm New Password</label>
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          placeholder="Confirm New Password"
          class="w-full bg-bgDark rounded-md py-2 pl-10 pr-10 focus:outline-none placeholder:text-inputsIn focus:ring-1 focus:ring-primary"
        />
        <i
          :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
          class="absolute right-3 top-11 -translate-y-1/2 text-inputsIn cursor-pointer"
          @click="showConfirmPassword = !showConfirmPassword"
        ></i>
      </div>

      <!-- Error -->
      <p v-if="error" class="text-red-500 text-sm mb-2">{{ error }}</p>

      <!-- Save Button -->
      <AppLink
        full
        class="h-9 text-lg font-poppins mt-3"
        @click="saveNewPassword"
        :disabled="loading"
      >
        {{ loading ? 'Saving...' : 'Save New Password' }}
      </AppLink>

      <p class="text-mainText text-center text-md mt-4 md:mt-7 whitespace-nowrap">
        Remember old password?
        <NuxtLink
          to="/auth/login"
          class="text-primary cursor-pointer hover:underline"
        >
          Sign in
        </NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const saveNewPassword = async () => {
  error.value = ''

  if (!newPassword.value.trim() || !confirmPassword.value.trim()) {
    error.value = 'Please fill in both fields.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  // ✅ Get the user identifier (email or username) from localStorage
  const identifier = localStorage.getItem('resetIdentifier')

  if (!identifier) {
    error.value = 'Something went wrong. Please restart the reset process.'
    return
  }

  loading.value = true

  // Simulate delay for demo realism
  await new Promise(resolve => setTimeout(resolve, 800))

  // ✅ Use your Pinia store action
  const result = userStore.resetPassword(identifier, newPassword.value)

  loading.value = false

  if (!result.success) {
    error.value = result.message
    return
  }

  // Clear resetIdentifier
  localStorage.removeItem('resetIdentifier')

  // ✅ Redirect to success page
  router.push('/auth/changedsuccessfully')
}

definePageMeta({
  layout: 'auth'
})
</script>
