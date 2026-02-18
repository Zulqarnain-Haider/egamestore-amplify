<template>
  <section
    class="relative min-h-screen flex flex-col md:-mt-[2.3rem] md:flex-row
           items-center justify-center text-white px-4 md:px-10 overflow-hidden"
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
      class="w-full md:w-1/2 flex flex-col justify-center font-inter
             max-w-md mx-auto rounded-3xl p-9 md:p-14 transition-all duration-500"
    >
      <!-- Icon -->
      <div class="flex mb-4">
        <NuxtImg
          src="/compressed/New folder/ForgotPasswordLock.png"
          alt="Main Icon"
          quality="80"
          densities="x1"
          loading="lazy"
          class="h-16 w-16"
        />
      </div>

      <!-- Heading -->
      <h2 class="text-2xl md:text-3xl font-semibold text-left mb-2">
        {{ t('resetPasswordTitle') }}
      </h2>
      <p class="text-inputsIn text-sm pr-6 text-left mb-6 md:mb-12">
        {{ t('resetPasswordSubtitle') }}
      </p>

      <!-- New Password -->
      <div class="relative mb-4">
        <Icon name="mdi-lock"
          class="w-4 h-4 absolute left-3 top-11 -translate-y-1/2 text-inputsIn"
        />
        <label class="block mb-1 text-sm text-inputsIn">{{ t('newPasswordLabel') }}</label>
        <input
          v-model="newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          :placeholder="t('newPasswordPlaceholder')"
          class="w-full bg-bgDark rounded-md py-2 pl-10 pr-10
                 outline outline-1 outline-mainText/80 focus:outline-none
                 text-inputsIn placeholder:text-inputsIn
                 focus:ring-1 focus:ring-primary z-10"
        />
        <Icon
          :name="showNewPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
          class="w-4 h-4 absolute right-3 top-11 -translate-y-1/2
                 text-inputsIn cursor-pointer z-20"
          @click="showNewPassword = !showNewPassword"
        />
      </div>

      <!-- Confirm Password -->
      <div class="relative mb-4">
        <Icon name="mdi-lock"
          class="w-4 h-4 absolute left-3 top-11 -translate-y-1/2 text-inputsIn"
        />
        <label class="block mb-1 text-sm text-inputsIn">{{ t('confirmNewPasswordLabel') }}</label>
        <input
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          :placeholder="t('confirmNewPasswordPlaceholder')"
          class="w-full bg-bgDark rounded-md py-2 pl-10 pr-10
                 outline outline-1 outline-mainText/80
                 focus:outline-none text-inputsIn
                 placeholder:text-inputsIn
                 focus:ring-1 focus:ring-primary z-10"
        />
        <Icon
          :name="showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
          class="w-4 h-4 absolute right-3 top-11 -translate-y-1/2
                 text-inputsIn cursor-pointer z-20"
          @click="showConfirmPassword = !showConfirmPassword"
        />
      </div>

      <!-- Error -->
      <p v-if="error" class="text-red-500 text-sm mb-2">
        {{ error }}
      </p>

      <!-- Save Button -->
      <AppLink
        full
        class="h-9 text-lg font-poppins mt-3"
        :disabled="loading"
        @click="saveNewPassword"
      >
        {{ loading ? t('saving') : t('saveNewPassword') }}
      </AppLink>

      <p class="text-mainText text-center text-md mt-4 md:mt-7 whitespace-nowrap">
        {{ t('rememberOldPassword') }}
        <NuxtLink to="/auth/login" class="text-primary hover:underline">
          {{ t('signInLink') }}
        </NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { navigateTo, useRuntimeConfig, useHead } from '#imports'

definePageMeta({ layout: 'auth' })

useHead({
  title: 'Reset Password | eGameStore',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const config = useRuntimeConfig()
const { t } = useI18n()

const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const saveNewPassword = async () => {
  error.value = ''

  if (!newPassword.value || !confirmPassword.value) {
    error.value = t('errorFieldsRequired')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = t('errorPasswordMismatch')
    return
  }

  const resetCode = localStorage.getItem('resetCode')
  if (!resetCode) {
    error.value = t('errorSessionExpired')
    return
  }

  loading.value = true

  try {
    const fd = new FormData()
    fd.append('reset_code', resetCode)
    fd.append('new_password', newPassword.value)

    const res = await $fetch(
      `${config.public.apiBase}/users/resetPassword`,
      { method: 'POST', body: fd }
    )

    if (res?.status) {
      localStorage.removeItem('resetCode')
      localStorage.removeItem('resetIdentifier')
      navigateTo('/auth/changedsuccessfully')
    } else {
      error.value = res.message
    }
  } catch {
    error.value = t('errorSomethingWrong')
  }

  loading.value = false
}
</script>
