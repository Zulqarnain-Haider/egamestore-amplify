<template>
  <div
    v-if="auth.user && auth.isActivated"
    class="min-h-screen font-poppins text-mainText flex flex-col items-center py-10 animate-fadeIn"
  >
    <!-- Profile Card -->
    <div
      class="w-[90%] max-w-6xl bg-bgDark rounded-2xl flex items-center gap-6 px-6 py-6 shadow-lg"
    >
      <!-- Avatar -->
      <div
        class="relative w-20 aspect-square rounded-full border-4 border-mainText overflow-hidden cursor-pointer group"
        @click="triggerFileInput"
      >
        <NuxtImg
          densities="x1"
          quality="80"
          format="webp"
          loading="lazy"
          :src="previewImage || '/games/ProfileAvatar.png'"
          alt="User Avatar"
          class="w-full h-full object-cover bg-center transition-transform duration-300 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          <Icon name="heroicons-outline:camera" class="text-white text-xl" />
        </div>

        <input
          type="file"
          accept="image/*"
          ref="fileInput"
          class="hidden"
          @change="handleFileUpload"
        />
      </div>

      <!-- User Info -->
      <div class="flex flex-col">
        <h2 class="text-2xl font-semibold text-mainText">
          {{ user.fullName || t('profileGuestUser') }}
        </h2>
        <p class="text-onMainText text-sm">{{ user.username || t('profileGuestUsername') }}</p>
        <div class="flex items-center gap-2 mt-1 text-sm text-onMainText">
          <Icon name="mdi:star" class="text-secondary" />
          <span class="text-mainText">{{ t('profileLevel', { level: 47 }) }}</span>
          <span>•</span>
          <span>{{ t('profileMemberSince', { year: user.memberSince || '2026' }) }}</span>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="w-[90%] max-w-6xl mt-8 flex justify-end">
      <AppButton
        @click="saveChanges"
        variant="primary"
        :width="160"
        :height="44"
        extraClass="px-3 py-2 text-sm sm:text-base rounded-lg"
      >
        {{ t('profileSaveChanges') }}
      </AppButton>
    </div>

    <!-- Info Section -->
    <div class="w-[90%] max-w-6xl mt-10">
      <div class="flex items-center gap-2 mb-4">
        <Icon name="mdi-account" class="w-7 h-7 text-primary" />
        <h3 class="text-lg font-semibold text-mainText">
          {{ t('profilePersonalInfo') }}
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left -->
        <div class="flex flex-col gap-6">
          <div>
            <label class="block text-sm text-onMainText mb-1">{{ t('profileFullName') }}</label>
            <input
              v-model="user.fullName"
              type="text"
              :placeholder="t('profileFullNamePlaceholder')"
              class="w-full bg-bgDark text-mainText px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm text-onMainText mb-1">{{ t('profileEmail') }}</label>
            <input
              v-model="user.email"
              type="email"
              readonly
              class="w-full bg-bgDark text-mainText px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm text-onMainText mb-1">{{ t('profileBio') }}</label>
            <textarea
              v-model="user.bio"
              rows="4"
              class="w-full bg-bgDark text-mainText px-4 py-3 rounded-lg outline-none resize-none focus:ring-2 focus:ring-primary"
              :placeholder="t('profileBioPlaceholder')"
            />
          </div>
        </div>

        <!-- Right -->
        <div class="flex flex-col gap-6">
          <div>
            <label class="block text-sm text-onMainText mb-1">{{ t('profileUsername') }}</label>
            <input
              v-model="user.username"
              type="text"
              :placeholder="t('profileUsernamePlaceholder')"
              class="w-full bg-bgDark text-mainText px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm text-onMainText mb-1">{{ t('profilePhone') }}</label>
            <input
              v-model="user.phone"
              type="text"
              class="w-full bg-bgDark text-mainText px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div class="relative">
            <label class="block text-sm text-onMainText mb-1">{{ t('profilePassword') }}</label>
            <input
              type="password"
              value="***********"
              readonly
              class="w-full bg-bgDark text-mainText px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              class="absolute right-3 top-9 text-primary underline text-sm"
              @click="showPasswordModal = true"
            >
              {{ t('profileChange') }}
            </button>
          </div>

          <PasswordChangeModal
            :visible="showPasswordModal"
            @close="showPasswordModal = false"
          />

          <ProfileSaveSuccessModal
            :visible="showSuccessModal"
            @close="showSuccessModal = false"
          />

          <div>
            <label class="block text-sm text-onMainText mb-1">
              {{ t('profileBirthday') }}
            </label>
            <input
              v-model="user.dob"
              type="date"
              class="w-full bg-bgDark text-mainText px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Not logged in -->
  <div
    v-else
    class="flex flex-col items-center justify-center min-h-screen text-center text-mainText animate-fadeIn"
  >
    <div
      class="bg-[#282C32]/80 backdrop-blur-md border border-primary/30 rounded-2xl p-10 shadow-2xl w-[90%] max-w-md"
    >
      <NuxtImg
        src="/games/ForgotPasswordLock.png"
        densities="x1"
        quality="80"
        format="webp"
        loading="lazy"
        alt="Lock Icon"
        class="w-20 h-20 mx-auto mb-6 opacity-90"
      />
      <h2 class="text-2xl font-semibold mb-3 text-white">
        {{ t('profileNotLoggedInTitle') }}
      </h2>
      <p class="text-onMainText mb-8">
        {{ t('profileNotLoggedInDesc') }}
      </p>

      <NuxtLink
        to="/auth/login"
        replace
        class="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-[1.03] shadow-md"
      >
        {{ t('profileGoToLogin') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useUser } from '~/composables/useUser'
import { useToast, useHead } from '#imports'

definePageMeta({ middleware: 'profile-guard' })

const toast = useToast()
const auth = useAuth()
const userComposable = useUser()
const { t } = useI18n()

const showPasswordModal = ref(false)
const showSuccessModal = ref(false)

const user = reactive({
  fullName: '',
  username: '',
  email: '',
  bio: '',
  phone: '',
  dob: '',
  avatar: '',
  memberSince: new Date().getFullYear(),
})

const previewImage = ref('/games/ProfileAvatar.png')

const normalizeAvatar = (avatar) => {
  if (!avatar) return '/games/ProfileAvatar.png'
  return avatar.replace(/(\.svg)+$/, '.svg')
}


watch(
  () => auth.user.value,
  (u) => {
    if (!u) return
    Object.assign(user, u)
    previewImage.value = normalizeAvatar(u.avatar)
  },
  { immediate: true }
)

const isSaving = ref(false)

const saveChanges = async () => {
  if (isSaving.value) return
  isSaving.value = true

  try {
    const res = await userComposable.updateProfile({
      email: user.email,
      phone: user.phone,
      dob: user.dob,
    })

    if (!res.success) {
      toast.error('Update failed')
      return
    }

    showSuccessModal.value = true
    toast.success('Profile updated')
  } finally {
    isSaving.value = false
  }
}


const fileInput = ref(null)
const triggerFileInput = () => fileInput.value?.click()

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (ev) => {
    previewImage.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

useHead({
  title: 'My Profile | eGameStore',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
    {
      name: 'description',
      content: 'Manage your eGameStore profile, personal information, and account settings.',
    },

    // Open Graph (safe defaults)
    {
      property: 'og:title',
      content: 'My Profile | eGameStore',
    },
    {
      property: 'og:description',
      content: 'Manage your eGameStore account settings and personal information.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
  ],
})
</script>

<style scoped>
input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>