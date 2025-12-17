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
          src="/games/ForgotPasswordLock.svg"
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
        <label class="block mb-1 text-sm text-inputsIn ">New Password</label>
        <input
          :type="showNewPassword ? 'text' : 'password'"
          v-model="newPassword"
          placeholder="New Password"
          class="w-full bg-bgDark rounded-md py-2 pl-10 pr-10 outline outline-1 outline-mainText/80 focus:outline-none text-inputsIn 
           placeholder:text-inputsIn focus:ring-1 focus:ring-primary"
        />
      
         <Icon
              :name="showNewPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
              class="w-4 h-4 absolute right-3 top-11 -translate-y-1/2 text-inputsIn cursor-pointer"
               @click="showNewPassword = !showNewPassword"
            />
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
        <label class="block mb-1 text-sm text-inputsIn ">Confirm New Password</label>
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          placeholder="Confirm New Password"
          class="w-full bg-bgDark rounded-md py-2 pl-10 pr-10 outline outline-1 outline-mainText/80
           focus:outline-none text-inputsIn placeholder:text-inputsIn focus:ring-1 focus:ring-primary"
        />
         <Icon
              :name="showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
              class="w-4 h-4 absolute right-3 top-11 -translate-y-1/2 text-inputsIn cursor-pointer"
               @click="showConfirmPassword = !showConfirmPassword"
            />
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

const router = useRouter()

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

  // Email or username
  const identifier = localStorage.getItem('resetIdentifier')

  // Reset Code → jo OTP user ne dala tha
  const resetCode = localStorage.getItem('resetCode')

  if (!identifier || !resetCode) {
    error.value = 'Something went wrong. Please restart the process.'
    return
  }

  loading.value = true

  try {
    const formData = new FormData()
    formData.append('reset_code', resetCode)
    formData.append('new_password', newPassword.value)

    const res = await $fetch(
      'https://api.egamestore.com/api/users/resetPassword',
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        }
      }
    )

    console.log('Reset Password Response:', res)

    if (res?.status === true) {
      // Clear identifiers
      localStorage.removeItem('resetIdentifier')
      localStorage.removeItem('resetCode')

      router.push('/auth/changedsuccessfully')
    } else {
      error.value = res?.errors?.[0] || res?.message || 'Failed to reset password.'
    }
  } catch (err) {
    console.log('Reset Password Error:', err)

    if (err?.data?.errors) {
      error.value = Object.values(err.data.errors)[0][0]
    } else {
      error.value = err?.data?.message || 'Something went wrong.'
    }
  }

  loading.value = false
}

definePageMeta({
  layout: 'auth'
})
</script>

