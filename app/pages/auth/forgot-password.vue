<template>
  <section
    class="min-h-screen flex flex-col md:flex-row -mt-[2.3rem] md:-mt-[2.3rem]
           items-center justify-center text-white px-4 md:px-10"
  >
    <!-- Left Image -->
    <div class="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
      <NuxtImg
        src="/games/ForgotPasswordLeft.png"
        alt="Forgot password illustration"
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
             max-w-md mx-auto rounded-3xl p-9 md:p-14"
    >
      <!-- Icon -->
      <div class="flex mb-4">
        <NuxtImg
          src="/compressed/New folder/ForgotPasswordLock.png"
          alt="Forgot password lock icon"
          quality="80"
          densities="x1"
          loading="lazy"
          format="webp"
          class="w-16 h-16"
        />
      </div>

      <!-- Heading -->
      <h2 class="text-2xl md:text-3xl font-semibold text-left mb-2">
        {{ t('forgotPasswordTitle') }}
      </h2>
      <p class="text-inputsIn text-xs text-left mb-6 md:mb-12">
        {{ t('forgotPasswordSubtitle') }}
      </p>

      <!-- Email Input -->
      <div class="relative mb-4">
        <Icon
          name="mdi-email"
          class="absolute left-3 top-5 -translate-y-1/2 w-5 h-5 text-primary"
        />
        <input
          v-model="email"
          type="email"
          :placeholder="t('forgotPasswordEmailPlaceholder')"
          class="w-full bg-bgDark rounded-md py-2 pl-10 pr-3
                 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <p v-if="error" class="text-red-500 text-sm mt-2">
          {{ error }}
        </p>
      </div>

      <!-- Submit Button -->
      <AppLink
        full
        class="h-9 font-semibold font-poppins mt-3"
        :disabled="loading"
        @click="handleSubmit"
      >
        {{ loading ? t('forgotPasswordSending') : t('forgotPasswordSubmit') }}
      </AppLink>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { navigateTo, useHead } from '#imports'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'auth' })

useHead({
  title: 'Forgot Password | eGameStore',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const auth = useAuth()
const { t, locale } = useI18n()
const email = ref('')
const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  if (!email.value) {
    error.value = t('errorEmailRequiredForgot')
    return
  }

  loading.value = true

  try {
    const res = await auth.requestPasswordReset(email.value, locale.value)

    if (res?.data?.status) {
      localStorage.setItem('resetIdentifier', email.value)
      navigateTo('/auth/otp-verification?type=reset')
    } else {
      error.value = res?.data?.message || t('errorForgotRequestFailed')
    }
  } catch {
    error.value = t('errorForgotRequestFailed')
  }

  loading.value = false
}
</script>