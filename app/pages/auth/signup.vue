<template>
  <div class="flex items-center justify-center min-h-screen font-poppins px-4 bg-page-gradient">
    <div class="w-full max-w-md text-mainText py-12">
      <h2 class="text-2xl font-semibold text-center mb-8 font-poppins">Get Started Now</h2>

      <!-- Global Error Message -->
      <p v-if="globalError" class="text-error text-sm mb-3 text-center font-poppins">{{ globalError }}</p>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block mb-1 text-sm font-poppins">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            :class="inputClass('email')"
          />
          <p v-if="errors.email" class="text-error text-xs mt-1">{{ errors.email }}</p>
        </div>

        <!-- Phone -->
        <div>
          <label class="block mb-1 text-sm font-poppins">Phone Number</label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="Enter your phone number"
            :class="inputClass('phone')"
          />
          <p v-if="errors.phone" class="text-error text-xs mt-1">{{ errors.phone }}</p>
        </div>

        <!-- Password -->
        <div class="relative">
          <label class="block mb-1 text-sm font-poppins">Password</label>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            :class="inputClass('password')"
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

        <!-- Confirm Password -->
        <div class="relative"> 
          <label class="block mb-1 text-sm font-poppins">Confirm Password</label>
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm your password"
            :class="inputClass('confirmPassword')"
          />

                <!-- Toggle Eye Icon -->
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
            <label class="text-sm whitespace-nowrap font-poppins">Date of birth:</label>

            <div class="flex gap-2 w-full">
              <!-- Month -->
              <div class="relative w-1/3">
                <input
                  v-model="dob.month"
                  @focus="activeField = 'month'"
                  @blur="activeField = ''"
                  type="text"
                  inputmode="numeric"
                  maxlength="2"
                  placeholder="MM"
                  class="w-full bg-bgDark rounded-md px-3 py-3 text-md text-white focus:ring-1 focus:ring-primary 
                   focus:outline-none placeholder:text-inputsIn pr-8 transition-all duration-200"
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
                  @focus="activeField = 'year'"
                  @blur="activeField = ''"
                  type="text"
                  inputmode="numeric"
                  maxlength="4"
                  placeholder="YYYY"
                  class="w-full bg-bgDark rounded-md px-3 py-3 text-md text-white focus:outline-none focus:ring-1 focus:ring-primary
              placeholder:text-inputsIn pr-8 transition-all duration-200"
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
                    @click="dob.year = `${y}`; dropdown = ''"
                    class="px-3 py-1 text-sm hover:bg-primary cursor-pointer"
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
          <label class="text-sm">I agree to the <span class="underline">terms & policy</span></label>
        </div>
        <p v-if="errors.agree" class="text-error text-xs mt-1">{{ errors.agree }}</p>

        <!-- SMS Consent (optional) -->
        <div class="flex items-center mt-2 space-x-2">
          <input v-model="form.smsConsent" type="checkbox" class="accent-primary cursor-pointer" />
          <label class="text-sm">I agree to receive SMS from <span class="font-semibold">EGAMETSTORE</span></label>
        </div>
        <p v-if="errors.smsConsent" class="text-error text-xs mt-1">{{ errors.smsConsent }}</p>
        
        <!-- Signup Button -->
        <AppLink
          type="submit"
          full
          class="h-10 mt-5 font-poppins font-semibold"
        >
          Signup
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
        <img src="/games/Signinwith1.svg" alt="" class="cursor-pointer" />
        <img src="/games/Signinwith2.svg" alt="" class="cursor-pointer" />
        <img src="/games/Signinwith3.svg" alt="" class="cursor-pointer" />
        <img src="/games/Signinwith4.svg" alt="" class="cursor-pointer" />
      </div>

      <!-- Login Link -->
      <p class="text-center text-md text-mainText">
        Have an account?
        <NuxtLink to="/auth/login" class="text-primary hover:underline">Sign In</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '~/stores/userStore.js'
import { navigateTo, useRuntimeConfig } from '#app'
import { useToast } from '#imports'

const toast = useToast()
const userStore = useUserStore()
const config = useRuntimeConfig()

// Password toggle
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Form data
const form = ref({
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agree: false,
  smsConsent: false,
})

// DOB + dropdowns
const dob = ref({ day: '', month: '', year: '' })
const dropdown = ref('')
const activeField = ref('')
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

// Errors + global
const errors = ref({})
const globalError = ref('')

// Input CSS
const inputClass = (field) => [
  'w-full h-10 p-2 text-sm rounded-md text-onFooter bg-bgDark font-poppins focus:outline-none transition-all duration-200 placeholder:text-inputsIn',
  errors.value[field] ? 'border border-error' : 'border border-transparent focus:border-primary',
].join(' ')

// Dropdown toggle
function openDropdown(field) {
  dropdown.value = dropdown.value === field ? '' : field
}

// Form validation
const validateForm = () => {
  errors.value = {}
  globalError.value = ''

  if (!form.value.email) errors.value.email = 'Email is required.'
  if (!form.value.phone) errors.value.phone = 'Phone number is required.'
  if (!form.value.password) errors.value.password = 'Password is required.'
  if (!form.value.confirmPassword) errors.value.confirmPassword = 'Confirm your password.'
  else if (form.value.password !== form.value.confirmPassword) errors.value.confirmPassword = 'Passwords do not match.'
  if (!dob.value.day || !dob.value.month || !dob.value.year) errors.value.dob = 'Date of birth is required.'
  if (!form.value.agree) errors.value.agree = 'You must accept the terms.'
  if (!form.value.smsConsent) errors.value.smsConsent = 'You must receive SMS.'

  return Object.keys(errors.value).length === 0
}

// Handle signup with API
const handleSignup = async () => {
  if (!validateForm()) {
    globalError.value = 'Please fix the highlighted fields.'
    return
  }

  try {
    const body = new FormData()
    body.append('email', form.value.email)
    body.append('phone', form.value.phone)
    body.append('password', form.value.password)
    body.append('dob', `${dob.value.year}-${dob.value.month}-${dob.value.day}`)
    body.append('smsConsent', form.value.smsConsent)

    const res = await $fetch(`${config.NUXT_PUBLIC_API_BASE}/users/register`, {
      method: 'POST',
      body,
      headers: { lang: 'ar' },
    })

    if (!res.status) throw new Error(res.message || 'Signup failed')

    toast.success({
      title: 'Success!',
      message: res.message,
      position: 'topCenter',
      duration: 3000,
      class: 'bg-[#1E1F22] text-white border-l-4 border-green-500',
    })

    // Optional: save token in store
    if (res.data?.token) {
      userStore.setUser({ token: res.data.token, email: form.value.email, phone: form.value.phone })
    }

    setTimeout(() => navigateTo('/auth/login'), 1500)
  } catch (err) {
    globalError.value = err.message || 'Signup failed'

    toast.error({
      title: 'Error!',
      message: err.message || 'Signup failed',
      position: 'topCenter',
      duration: 3000,
      class: 'bg-[#1E1F22] text-white border-l-4 border-red-500',
    })
  }
}

definePageMeta({ layout: 'auth' })
</script>

