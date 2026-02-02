<template>
  <transition name="fade">
    <div
      v-if="visible"
      @click="closeModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <!--Card -->
      <div
        @click.stop
        class="relative flex flex-col items-center justify-center
         text-center w-[90%] max-w-lg aspect-[4/5] sm:aspect-[4/4] md:aspect-[3/4] 
         overflow-hidden sm:p-8 rounded-[3rem] shadow-2xl animate-fadeIn">
    <NuxtImg
     src="/games/PopupMainCard.png"
     alt="Popup Background"
     quality="80"
     format="webp"
     densities="x1" 
     preload
     width="858px" height="663px" angle="0 deg"
    class="absolute inset-0 w-full h-full object-contain object-center z-0"/>

        <!--SUCCESS CONTENT -->
        <template v-if="success">
          <div class="flex flex-col items-center justify-center space-y-6 scale-[0.7]">
            <NuxtImg
            densities="x1" quality="80" fromat="webp" loading="lazy"
              src="/games/ResetPasswordSuccess.png"
              alt="Success"
              class="w-16 h-16 sm:w-20 sm:h-20"
            />
            <h2 class="text-mainText font-semibold tracking-wide max-w-[50%] mx-auto text-xl sm:text-2xl leading-snug">
              {{ t('passwordChangeSuccessTitle') }}
            </h2>
            <button
              @click="closeModal"
              class="bg-primary w-full text-mainText px-8 py-2 rounded-md hover:bg-orange-600 transition"
            >
             {{ t('home') }}
            </button>
          </div>
        </template>

        <!--PASSWORD FORM CONTENT -->
        <template v-else>
          <div class="flex flex-col items-center w-full max-w-xs 
          sm:max-w-sm  space-y-4 sm:space-y-5 scale-[0.46] sm:scale-[0.57]">
            <NuxtImg
              src="/games/ForgotPasswordLock.png"
              alt="Lock"
              class="w-16 h-16 sm:w-20 sm:h-20 self-start ml-2 sm:ml-0"
            />

            <div class="text-left">
              <h2 class="text-mainText font-semibold text-2xl mb-1">
                {{ t('setNewPasswordTitle') }}
              </h2>
              <p class="text-inputsIn text-xs sm:text-sm mb-4 pr-4 sm:pr-8">
                {{ t('setNewPasswordDesc') }}
              </p>
            </div>

             <!-- Global Error -->
        <p v-if="globalError" class="text-error text-sm mb-2 text-center">{{ globalError }}</p>

            <form @submit.prevent="handleSave" class="w-full space-y-3 sm:space-y-4">
              <!-- Current Password -->
              <div class="text-left text-xs sm:text-sm">
                <label class="block text-inputsIn mb-1">
                  {{ t('currentPasswordLabel') }}
                </label>
                <div class="relative">
                    <Icon name="mdi-lock"
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-onFooter/70"
                  />
                  <input
                    :type="showCurrent ? 'text' : 'password'"
                    v-model="currentPassword"
                    :placeholder="t('currentPasswordPlaceholder')"
                    class="w-full bg-transparent border border-outline rounded-md 
                    px-10 py-2 focus:outline-none focus:border-primary placeholder-onFooter/70"
                    :class="errors.current ? 'border-error' : 'border-outline focus:border-primary'"
                  />
                  <button
                    type="button"
                    @click="showCurrent = !showCurrent"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-inputsIn"
                  >
             <Icon :name="showCurrent ? 'heroicons:eye-slash' : 'heroicons:eye'"
                  class="text-onFooter/70 w-5 h-5"  />
                  </button>
                </div>
                  <p v-if="errors.current" class="text-error text-xs mt-1">{{ errors.current }}</p>
              </div>

              <!-- New Password -->
              <div class="text-left text-xs sm:text-sm">
                <label class="block text-inputsIn mb-1">
                  Enter New Password
                </label>
                <div class="relative">
                    <Icon name="mdi-lock" 
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-onFooter/70"
                  />
                  <input
                    :type="showNew ? 'text' : 'password'"
                    v-model="newPassword"
                    placeholder="Enter new password"
                    class="w-full bg-transparent border border-outline rounded-md
                     px-10 py-2 focus:outline-none focus:border-primary placeholder-onFooter/70"
                   :class="errors.new ? 'border-error' : 'border-outline focus:border-primary'"
                  />
                  <button
                    type="button"
                    @click="showNew = !showNew"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-inputsIn"
                  >
           <Icon :name="showNew ? 'heroicons:eye-slash' : 'heroicons:eye'"
                  class="text-onFooter/70 w-5 h-5"   />
                        </button>
                </div>
              <p v-if="errors.new" class="text-error text-xs mt-1">{{ errors.new }}</p>
              </div>

              <!-- Confirm Password -->
              <div class="text-left text-xs sm:text-sm">
                <label class="block text-inputsIn mb-1">
                  Confirm New Password
                </label>
                <div class="relative">
                    <Icon name="mdi-lock" 
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-onFooter/70"
                  />
                  <input
                    :type="showConfirm ? 'text' : 'password'"
                    v-model="confirmPassword"
                    placeholder="Confirm new password"
                    class="w-full bg-transparent border border-outline rounded-md
                     px-10 py-2 focus:outline-none focus:border-primary placeholder-onFooter/70"
                   :class="errors.confirm ? 'border-error' : 'border-outline focus:border-primary'"
                  />
                  <button
                    type="button"
                    @click="showConfirm = !showConfirm"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-inputsIn"
                  >
                    <Icon :name="showConfirm ? 'heroicons:eye-slash' : 'heroicons:eye'"
                     class="text-onFooter/70 w-5 h-5" />
                  </button>
                </div>
                <p v-if="errors.confirm" class="text-error text-xs mt-1">{{ errors.confirm }}</p>
              </div>

              <button
                type="submit"
                class="w-full bg-primary text-white py-2 rounded-md hover:bg-orange-600 transition"
              >
                {{ t('saveNewPassword') }}
              </button>

              <NuxtLink to="/auth/forgot-password">
                <p class="text-xs mt-3 underline cursor-pointer text-primary">
                  {{ t('forgotPasswordTitle') }}
                </p>
              </NuxtLink>
            </form> 
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useUser} from '~/composables/useUser'

const { t } = useI18n()
const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close'])

const user = useUser()

const success = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const errors = ref({})
const globalError = ref('')

const handleSave = async () => {
  errors.value = {}
  globalError.value = ''

  if (!currentPassword.value) errors.value.current = t('errorEnterCurrentPassword')
  if (!newPassword.value) errors.value.new = t('errorEnterNewPassword')
  if (!confirmPassword.value) errors.value.confirm = t('errorConfirmNewPassword')
  if (newPassword.value !== confirmPassword.value) {
    errors.value.confirm = t('errorPasswordMismatch')
  }

  if (Object.keys(errors.value).length) {
    globalError.value = t('errorFixFields')
    return
  }

  const res = await user.updatePassword(
    currentPassword.value,
    newPassword.value
  )

  if (!res.success) {
    globalError.value = res.message || t('errorUpdatePasswordFailed')
    return
  }

  success.value = true
}

const closeModal = () => {
  success.value = false
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  emit('close')
}


watch(
  () => props.visible,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
