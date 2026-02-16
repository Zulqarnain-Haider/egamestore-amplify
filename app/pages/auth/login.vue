<template>
  <div class="flex items-center justify-center min-h-screen font-poppins px-4 bg-page-gradient">
    <div class="w-full max-w-md text-mainText py-12">

      <!-- Heading -->
      <h1 class="text-2xl font-semibold text-center mb-4">
        {{ t('loginTitle') }}
      </h1>
      <p class="text-center text-sm text-mainText mb-10">
        {{ t('loginSubtitle') }}
      </p>

      <!-- Global Error -->
      <p
        v-if="globalError"
        class="text-error text-sm mb-3 text-center"
      >
        {{ globalError }}
      </p>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">

        <!-- Email / Phone -->
        <div>
          <label class="block mb-1 text-sm">{{ t('emailOrPhone') }}</label>
          <input
            v-model="identifier"
            type="text"
            :placeholder="t('emailOrPhonePlaceholder')"
            :class="inputClass('identifier')"
          />
          <p
            v-if="errors.identifier"
            class="text-error text-xs mt-1"
          >
            {{ errors.identifier }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-1 text-sm">{{ t('password') }}</label>
        
          <!-- Input wrapper -->
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="t('passwordPlaceholder')"
              :class="inputClass('password') + ' pr-10'"
            />
        
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-onFooter flex items-center"
              @click="showPassword = !showPassword"
            >
              <Icon
                :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
                class="w-5 h-5"
              />
            </button>
          </div>
        
          <p
            v-if="errors.password"
            class="text-error text-xs mt-1"
          >
            {{ errors.password }}
          </p>
        </div>

        <!-- Remember Me + Forgot -->
        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="accent-primary w-4 h-4"
            />
            <span>{{ t('rememberMe') }}</span>
          </label>

          <NuxtLink
            to="/auth/forgot-password"
            class="text-xs underline text-primary hover:text-primary/80"
          >
            {{ t('forgotPassword') }}
          </NuxtLink>
        </div>

        <!-- Submit -->
        <AppLink
          type="submit"
          full
          class="h-10 font-semibold"
          :disabled="loading"
        >
          {{ loading ? t('loggingIn') : t('login') }}
        </AppLink>
      </form>

      <!-- Divider -->
      <div class="flex items-center justify-center my-6 text-onMainText relative">
        <span class="border-t border-2 border-white w-1/2"></span>
        <span class="text-sm bg-white px-1 text-black">Or</span>
        <span class="border-t border-2 border-white w-1/2"></span>
      </div>

      <!-- Social Icons -->
      <div class="flex justify-center gap-4 mb-6">
        <NuxtImg
         densities="x1" quality="85" preload
        src="/games/Signinwith1.png" alt="" class="cursor-pointer" />
        <NuxtImg
         densities="x1" quality="85" preload
         src="/games/Signinwith2.png" alt="" class="cursor-pointer" />
        <NuxtImg
         densities="x1" quality="85" preload
         src="/games/Signinwith3.png" alt="" class="cursor-pointer"
         @click="handleSocialLogin('facebook')"
         />
        <NuxtImg
         densities="x1" quality="85" preload
         src="/games/Signinwith4.png" alt="" class="cursor-pointer"
         @click="handleSocialLogin('google')"
         />
      </div>

      <!-- Signup -->
      <p class="text-center text-sm mt-6">
        {{ t('noAccount') }}
        <NuxtLink to="/auth/signup" class="text-primary hover:underline">
          {{ t('signUp') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { navigateTo, useCookie } from '#app'
import { googleTokenLogin } from 'vue3-google-login'
import { useAuth } from '~/composables/useAuth'
// import { useTurnstile } from '~/composables/useTurnstile'
import { useToast } from '#imports'

const { t, locale } = useI18n()
// const { execute, verified } = useTurnstile()


/* -----------------------------------
 * Meta (Auth pages should not be indexed)
 * ----------------------------------- */
definePageMeta({
  layout: 'auth',
  middleware: 'guest-only',
})

useHead({
  title: 'Login | eGameStore',
  meta: [
    {
      name: 'description',
      content: 'Log in to your eGameStore account to access purchases and profile.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
})

/* -----------------------------------
 * State
 * ----------------------------------- */
const auth = useAuth()
const toast = useToast()

const identifier = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const loading = ref(false)
const errors = ref({})
const globalError = ref('')

// onMounted(() => {
//   execute()
// })

/* -----------------------------------
 * Clear errors on input change
 * ----------------------------------- */
watch([identifier, password], () => {
  errors.value = {}
  globalError.value = ''
})

/* -----------------------------------
 * Input class helper
 * ----------------------------------- */
const inputClass = (field) => [
  'w-full h-10 p-2 text-sm rounded-md bg-bgDark text-onPrimary/80 placeholder:text-inputsIn focus:outline-none',
  errors.value[field]
    ? 'border border-error'
    : 'border border-transparent focus:border-primary',
].join(' ')

/* -----------------------------------
 * Validation
 * ----------------------------------- */
const validateForm = () => {
  errors.value = {}

  if (!identifier.value) {
    errors.value.identifier = t('errorEmailRequired')
  }

  if (!password.value) {
    errors.value.password = t('errorPasswordRequired')
  }

  return Object.keys(errors.value).length === 0
}

/* -----------------------------------
 * Login handler
 * ----------------------------------- */
const handleLogin = async () => {
  if (!validateForm()) return

  if (!verified.value) {
    // execute()
    
    toast.error({
      title: 'Verification',
      message: 'Please wait while we verify you...',
      position: 'topCenter'
    })
    return
  }

  loading.value = true

  const currentLocale = locale.value

  try {
    const res = await auth.login(identifier.value, password.value, currentLocale)

    loading.value = false

    if (!res.success) {
      // execute()
      globalError.value = res.message || t('loginFailed')
      toast.error({
        title: t('loginFailedTitle'),
        message: globalError.value,
        position: 'topCenter',
      })
      return
    }

    // Activation required → OTP page
    if (res.otpRequired) {
      toast.info({
        title: t('accountActivation'),
        message: t('pleaseVerifyOTP'),
        position: 'topCenter',
      })
      return navigateTo('/auth/otp-verification?type=activation')
    }

    // Success → Home
    toast.success({
      title: t('welcomeBack'),
      message: t('loginSuccessful'),
      position: 'topCenter',
    })

    if (rememberMe.value) {
      useCookie('rememberMe', { maxAge: 60 * 60 * 24 * 30 }).value = true
    }

    navigateTo('/')
  } catch (err) {
    loading.value = false
    globalError.value = t('somethingWentWrong')
    toast.error({
      title: t('error'),
      message: globalError.value,
      position: 'topCenter',
    })
  }
}

const handleSocialLogin = async (provider) => {
  if (!verified.value) {
    // execute()
    
    toast.error({
      title: 'Verification',
      message: 'Please wait while we verify you...',
      position: 'topCenter'
    })
    return
  }
  
  try {
    // Facebook not supported yet
    if (provider !== 'google') {
      toast.error({
        title: t('errorTitle'),
        message: t('googleOnlyError') || 'Facebook login is not supported yet',
        position: 'bottomRight',
      })
      return
    }

    // Google OAuth
    const response = await googleTokenLogin()

    const oauthToken = response?.access_token
    if (!oauthToken) {
      toast.error({
        title: t('errorTitle'),
        message: t('googleTokenError'),
        position: 'topCenter',
      })
      return
    }

    const currentLocale = locale.value

    const res = await auth.socialLogin('google', oauthToken, currentLocale)

    if (!res.success) {
      toast.error({
        title: t('errorTitle'),
        message: res.message,
        position: 'topCenter',
      })
      return
    }

    toast.success({
      title: t('successTitle'),
      message: t('loggedInSuccessfully'),
      position: 'topCenter',
      duration: 2500,
    })

    // Activation check
    navigateTo(res.otpRequired ? '/auth/otp-verification' : '/')

  } catch (err) {
    toast.error({
      title: t('errorTitle'),
      message: err?.message || t('googleLoginFailed'),
      position: 'topCenter',
    })
  }
}

</script>