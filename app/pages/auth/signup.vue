<template>
  <div class="flex items-center justify-center min-h-screen font-poppins px-4 bg-page-gradient">
    <div class="w-full max-w-md text-mainText py-12">
      <h2 class="text-2xl font-semibold text-center mb-8 font-poppins">{{ t('signupTitle') }}</h2>

      <!-- Global Error Message -->
      <p v-if="globalError" class="text-error text-sm mb-3 text-center font-poppins">{{ globalError }}</p>

      <form class="space-y-4" @submit.prevent="handleSignup">
        <!-- Email -->
        <div>
          <label class="block mb-1 text-sm font-poppins">{{ t('email') }}</label>
          <input
            v-model="form.email"
            type="email"
            :placeholder="t('emailPlaceholder')"
            :class="inputClass('email')"
          />
          <p v-if="errors.email" class="text-error text-xs mt-1">{{ errors.email }}</p>
        </div>

        <!-- Phone -->
        <div>
          <label class="block mb-1 text-sm font-poppins">{{ t('phoneNumber') }}</label>
            <VueTelInput
            v-model="form.phone"
            mode="international"
            :preferredCountries="['US','PK','AE']"
            :disabledFetchingCountry="true"
            :placeholder="t('phonePlaceholder')"
            @validate="onPhoneValidate"
            :inputOptions="{
            showDialCode: true,
            showDialCodeInList: true,
            placeholder: t('phonePlaceholder'),
            }"
            :class="[{ error: errors.phone }]"
         />
          <p v-if="errors.phone" class="text-error text-xs mt-1">{{ errors.phone }}</p>
        </div>

        <!-- Password -->
        <div class="relative">
          <label class="block mb-1 text-sm font-poppins">{{ t('password') }}</label>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="t('passwordPlaceholder')"
            :class="inputClass('password')"
          />
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

        <!-- Confirm Password -->
        <div class="relative"> 
          <label class="block mb-1 text-sm font-poppins">{{ t('confirmPassword') }}</label>
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="t('confirmPasswordPlaceholder')"
            :class="inputClass('confirmPassword')"
          />
          <button
            type="button"
            class="absolute right-2 top-12 -translate-y-1/2 text-onFooter"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <Icon
              :name="showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
              class="w-5 h-5"
            />
          </button>
          <p v-if="errors.confirmPassword" class="text-error text-xs mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <!-- Date of Birth -->
        <div class="w-full mt-4">
          <div class="flex items-center gap-4">
            <label class="text-sm whitespace-nowrap font-poppins">{{ t('dateOfBirth') }}</label>

            <div class="flex gap-2 w-full">
              <!-- Month -->
              <div class="relative w-1/3">
                <input
                  v-model="dob.month"
                  @focus="activeField = 'month'"
                  @blur="activeField = ''"
                    @input="onMonthInput"
                  type="text"
                  inputmode="numeric"
                  maxlength="2"
                  placeholder="MM"
                  class="w-full bg-bgDark rounded-md px-3 py-3 text-md text-white focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-inputsIn pr-8 transition-all duration-200"
                />
                <i
                  class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-inputsIn cursor-pointer"
                  @click="openDropdown('month')"
                ></i>

                <div
                  v-if="dropdown === 'month'"
                  class="absolute z-10 bg-bgDark border-2 border-outline rounded-md mt-1 max-h-40 overflow-y-auto w-full shadow-lg"
                >
                  <div
                    v-for="m in 12"
                    :key="m"
                    @click="dob.month = m < 10 ? `0${m}` : `${m}`; dropdown = ''"
                    class="px-3 py-1 text-sm hover:bg-primary cursor-pointer"
                  >
                    {{ m < 10 ? `0${m}` : m }}
                  </div>
                </div>
              </div>

              <!-- Day -->
              <div class="relative w-1/3">
                <input
                  v-model="dob.day"
                  @focus="activeField = 'day'"
                  @blur="activeField = ''"
                    @input="onDayInput"
                  type="text"
                  inputmode="numeric"
                  maxlength="2"
                  placeholder="DD"
                  class="w-full bg-bgDark rounded-md px-3 py-3 text-md text-white focus:ring-1 focus:ring-primary
                   focus:outline-none placeholder:text-inputsIn pr-8 transition-all duration-200"
                />
                <i
                  class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-inputsIn cursor-pointer"
                  @click="openDropdown('day')"
                ></i>

                <div
                  v-if="dropdown === 'day'"
                  class="absolute z-10 bg-bgDark border-2 border-outline rounded-md mt-1 max-h-40 overflow-y-auto w-full shadow-lg"
                >
                  <div
                    v-for="d in 31"
                    :key="d"
                    @click="dob.day = d < 10 ? `0${d}` : `${d}`; dropdown = ''"
                    class="px-3 py-1 text-sm hover:bg-primary cursor-pointer"
                  >
                    {{ d < 10 ? `0${d}` : d }}
                  </div>
                </div>
              </div>

              <!-- Year -->
              <div class="relative w-1/3">
                <input
                  v-model="dob.year"
                    @input="onYearInput"
                  type="text"
                  inputmode="numeric"
                  maxlength="4"
                  placeholder="YYYY"
                  class="w-full bg-bgDark rounded-md px-3 py-3 text-md text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-inputsIn pr-8 transition-all duration-200"
                  @focus="activeField = 'year'"
                  @blur="activeField = ''"
                />
                <i
                  class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-inputsIn cursor-pointer"
                  @click="openDropdown('year')"
                ></i>

                <div
                  v-if="dropdown === 'year'"
                  class="absolute z-10 bg-bgDark border-2 border-outline rounded-md mt-1 max-h-40 overflow-y-auto w-full shadow-lg"
                >
                  <div
                    v-for="y in years"
                    :key="y"
                    class="px-3 py-1 text-sm hover:bg-primary cursor-pointer"
                    @click="dob.year = `${y}`; dropdown = ''"
                  >
                    {{ y }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p v-if="errors.dob" class="text-error text-xs mt-1 ml-[105px]">{{ errors.dob }}</p>
        </div>

        <!-- Terms -->
        <div class="flex items-center mt-3 space-x-2">
          <input v-model="form.agree" type="checkbox" class="accent-primary cursor-pointer" />
          <label class="text-sm">
          {{ t('agreeTermsPrefix') }}
          <button
            type="button"
            class="underline text-primary"
            @click="showTerms = true"
          >
            {{ t('termsAndPolicy') }}
          </button>
        </label>
        </div>
        <p v-if="errors.agree" class="text-error text-xs mt-1">{{ errors.agree }}</p>

        <!-- SMS Consent (optional) -->
        <div class="flex items-center mt-2 space-x-2">
          <input v-model="form.agree_sms" type="checkbox" class="accent-primary cursor-pointer" />
          <label class="text-sm">{{ t('agreeSms') }} <span class="font-semibold">{{ t('brandName') }}</span></label>
        </div>
        <p v-if="errors.agree_sms" class="text-error text-xs mt-1">{{ errors.agree_sms }}</p>
        
        <!-- Signup Button -->
        <AppLink
          type="submit"
          full
          class="h-10 mt-5 font-poppins font-semibold"
        >
          {{ t('signup') }}
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

      <!-- Login Link -->
      <p class="text-center text-md text-mainText">
        {{ t('haveAccount') }}
        <NuxtLink to="/auth/login" class="text-primary hover:underline">{{ t('signIn') }}</NuxtLink>
      </p>
    </div>
    <!-- Terms Modal -->
    <TermsModal v-model="showTerms" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { googleTokenLogin } from 'vue3-google-login'

import { navigateTo } from '#app'
import { useToast } from '#imports'

// Import VueTelInput
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/dist/vue-tel-input.css'

const toast = useToast()
const auth = useAuth()
const { t, locale } = useI18n()


// Password toggle
const showPassword = ref(false)
const showConfirmPassword = ref(false)
// Terms Modal Toggle
const showTerms = ref(false)


// Form
const form = ref({
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agree: false,
  agree_sms: false,
})

const onMonthInput = () => {
  let val = dob.value.month.replace(/\D/g, '')

  if (+val > 12) val = '12'
  if (+val < 1 && val !== '') val = '01'

  dob.value.month = val
}

const onDayInput = () => {
  let val = dob.value.day.replace(/\D/g, '')

  if (+val > 31) val = '31'
  if (+val < 1 && val !== '') val = '01'

  dob.value.day = val
}

const CURRENT_YEAR = new Date().getFullYear()

const onYearInput = () => {
  let val = dob.value.year.replace(/\D/g, '')

  if (+val > CURRENT_YEAR) val = CURRENT_YEAR.toString()
  if (+val < 1900 && val.length === 4) val = '1900'

  dob.value.year = val
}


const phoneIsValid = ref(false) // will track if user input is valid

const onPhoneValidate = (event) => {
  phoneIsValid.value = event.valid
}


// DOB
const dob = ref({ day: '', month: '', year: '' })
const dropdown = ref('')
const activeField = ref('')
const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)

// Errors
const errors = ref({})
const globalError = ref('')

// Input style
const inputClass = (field) => [
  'w-full h-10 p-2 text-sm rounded-md text-onPrimary/80 bg-bgDark font-poppins focus:outline-none transition-all duration-200 placeholder:text-inputsIn',
  errors.value[field] ? 'border border-error' : 'border border-transparent focus:border-primary',
].join(' ')

function openDropdown(field) {
  dropdown.value = dropdown.value === field ? '' : field
}

// Validate fields
const validateForm = () => {
  errors.value = {}
  globalError.value = ''

  if (!form.value.email) errors.value.email = t('errorEmailRequired')
  if (!form.value.phone || !phoneIsValid.value) errors.value.phone = t('errorPhoneInvalid')
  if (!form.value.password) errors.value.password = t('errorPasswordRequired')
  if (!form.value.confirmPassword) errors.value.confirmPassword = t('errorConfirmPassword')
  else if (form.value.password !== form.value.confirmPassword)
    errors.value.confirmPassword = t('errorPasswordMismatch')

  if (!dob.value.day || !dob.value.month || !dob.value.year)
    errors.value.dob = t('errorDobRequired')

  if (!form.value.agree) errors.value.agree = t('errorAgreeTerms')
  if (!form.value.agree_sms) errors.value.agree_sms = t('errorAgreeSms')

  return Object.keys(errors.value).length === 0
}


// Handle Signup Through auth composable
const handleSignup = async () => {
  if (!validateForm()) {
    globalError.value = t('fixErrors')
    return
  }

  const cleanPhone = form.value.phone.replace(/\s+/g, '').replace(/[()-]/g, '')

  // Create DOB format YYYY-MM-DD
  const pad = (val) => val.toString().padStart(2, '0')
  const finalDob = `${dob.value.year}-${dob.value.month}-${dob.value.day}`

  const payload = {
    email: form.value.email,
    phone: cleanPhone,
    password: form.value.password,
    // password_confirmation: form.value.confirmPassword,
    dob: finalDob,
    agree_sms: form.value.agree_sms ? 1 : 0,
  }

  const currentLocale = locale.value
  
  const res = await auth.signup(payload, currentLocale) 

  if (!res.success) {
    globalError.value = res.message
  
    // Show main message
    toast.error({
      title: t('errorTitle'),
      message: res.message,
      position: 'topCenter',
    })
  
    // Show each validation error
    if (res.errors && res.errors.length > 0) {
      res.errors.forEach(err => {
        toast.error({
          title: t('validationErrorTitle'),
          message: err,
          position: "topCenter",
          duration: 3500
        })
      })
    }
  
    return
  }

  toast.success({
    title: t('signupSuccessTitle'),
    message: res.message,
    position: 'topCenter',
    duration: 2500,
  })

  setTimeout(() => navigateTo('/auth/otp-verification'), 1000)
}


// Social Login
const handleSocialLogin = async (provider) => {
  try {
    if (provider !== 'google') {
      toast.error({
        title: t('errorTitle'),
        message: t('googleOnlyError'),
      })
      return
    }

    // Get REAL Google OAuth access token
    const response = await googleTokenLogin()

    const oauthToken = response?.access_token
    if (!oauthToken) {
      toast.error({
        title: t('errorTitle'),
        message: t('googleTokenError'),
      })
      return
    }

    const currentLocale = locale.value

    // Send token to backend (same as old Vue)
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

    // Activation flow
    navigateTo(res.otpRequired ? '/auth/otp-verification' : '/')

  } catch (err) {
    toast.error({
      title: t('errorTitle'),
      message: err?.message || t('googleLoginFailed'),
    })
  }
}



definePageMeta({
  layout: 'auth',
  middleware: 'guest-only',
})

</script>


<style>
/* Parent wrapper bg (matches your input fields) */
.vue-tel-input {
  background-color: #17191D !important; /* same as bg-bgDark */
  border: 1px solid transparent !important;
  border-radius: 6px !important;
  height: 40px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  box-shadow: none !important;
  transition: border-color 0.2s ease !important;
}


/* Focus = primary border */
.vue-tel-input:focus-within {
  border-color: #FF6916 !important; /* your primary color */
}


/* Error Border (Jab aap class se "border-error" lagayen) */
.vue-tel-input.error {
  border-color: #D91B1B !important;
}

/* Actual text input */
.vue-tel-input input {
  background-color: transparent !important;
  border: none !important;
  /* color: white !important; */
  font-size: 14px !important;
  padding: 8px !important;
  height: 42px !important;
  outline: none !important;
  box-shadow: none !important;
}


/* Country dropdown button */
.vti__dropdown {
  background: transparent !important;
  border-right: 1px solid #333 !important;
  color: white !important;
  padding: 0 10px !important;
}

/* Dropdown list (full dark mode) */
.vti__dropdown-list {
  background: #17191D  !important;
  border: 1px solid #333 !important;
  border-radius: 6px !important;
  color: #fff !important;
  max-height: 200px !important;
}

/* Dropdown items */
.vti__dropdown-item {
  background-color: transparent !important;
  /* background: #1e1e1e !important; */
  padding: 8px !important;
}

.vti__dropdown-item:hover {
  background: #1e1e1e !important;
}

/* Remove default shadows everywhere */
.vue-tel-input *,
.vti__dropdown,
.vti__dropdown-list {
  box-shadow: none !important;
}

</style>