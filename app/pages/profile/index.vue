<template>
  <div
    v-if="userStore.currentUser && userStore.currentUser.activation_str === 'active'"
    class="min-h-screen font-poppins text-mainText flex flex-col items-center py-10 animate-fadeIn"
  >
    <!-- Profile Card -->
    <div
      class="w-[90%] max-w-6xl bg-bgDark rounded-2xl flex items-center gap-6 px-6 py-6 shadow-lg"
    >
      <!-- Avatar -->
      <div
        class="relative w-20 aspect-square  rounded-full border-4 border-mainText overflow-hidden cursor-pointer group"
        @click="triggerFileInput"
      >
         <NuxtImg
         densities="x1" quality="80" format="webp" loading="lazy"
         :src="previewImage"
          alt="User Avatar"
          class="w-full h-full object-cover bg-center transition-transform duration-300 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
       <Icon name="heroicons-outline:camera" class="text-white text-xl" />
       <!-- <Icon name="heroicons:camera" class="text-white text-xl" /> -->
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
          {{ user.fullName || 'Guest User' }}
        </h2>
        <p class="text-onMainText text-sm">{{ user.username || '@Guest' }}</p>
        <div class="flex items-center gap-2 mt-1 text-sm text-onMainText">
          <Icon name="mdi:star" class="text-secondary" />
          <span class="text-mainText">Level 47 Gamer</span>
          <span>•</span>
          <span>Member since {{ user.memberSince || '2024' }}</span>
        </div>
      </div>
    </div>


 
<!--ave Changes Button -->
<div class="w-[90%] max-w-6xl mt-8 flex justify-end">
  <AppButton
    @click="saveChanges"
    variant="primary"
    :width="160"
    :height="44"
    extraClass="px-3 py-2 text-sm sm:text-base rounded-lg"
  >
    Save Changes
  </AppButton>
</div>

    <!-- Info Section -->
    <div class="w-[90%] max-w-6xl mt-10">
      <div class="flex items-center gap-2 mb-4">
        <Icon name="mdi-account"  class="w-7 h-7 text-primary" />
        <h3 class="text-lg font-semibold text-mainText">Personal Information</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col gap-6">
          <div>
            <label class="block text-sm text-onMainText mb-1">Full Name</label>
            <input
              v-model="user.fullName"
              type="text"
              placeholder="Enter your full name"
              class="w-full bg-bgDark text-mainText px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm text-onMainText mb-1">Email</label>
            <input
              v-model="user.email"
              type="email"
              readonly
              class="w-full bg-bgDark text-mainText px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm text-onMainText mb-1">Bio</label>
            <textarea
              v-model="user.bio"
              rows="4"
              class="w-full bg-bgDark text-mainText px-4 py-3 rounded-lg outline-none resize-none focus:ring-2 focus:ring-primary"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div>
            <label class="block text-sm text-onMainText mb-1">Username</label>
            <input
              v-model="user.username"
              type="text"
              placeholder="Enter your username"
              class="w-full bg-bgDark text-mainText px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm text-onMainText mb-1">Phone</label>
            <input
              v-model="user.phone"
              type="text"
              class="w-full bg-bgDark text-mainText px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div class="relative">
            <label class="block text-sm text-onMainText mb-1">Password</label>
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
              change
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
            <label class="block text-sm text-onMainText mb-1">Birthday date</label>
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

  <!-- If user not logged in -->
  <div
    v-else
    class="flex flex-col items-center justify-center min-h-screen text-center text-mainText animate-fadeIn"
  >
    <div
      class="bg-[#282C32]/80 backdrop-blur-md border border-primary/30 rounded-2xl p-10 shadow-2xl w-[90%] max-w-md"
    >
      <NuxtImg
        src="/games/ForgotPasswordLock.png"
        densities="x1" quality="80" format="webp" loading="lazy"
        alt="Lock Icon"
        class="w-20 h-20 mx-auto mb-6 opacity-90"
      />
      <h2 class="text-2xl font-semibold mb-3 text-white">
        You’re not logged in
      </h2>
      <p class="text-onMainText mb-8">
        Please log in to access your profile and manage your account settings.
      </p>

      <NuxtLink
        to="/auth/login"
        replace
        class="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-[1.03] shadow-md"
      >
        Go to Login
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useUserStore } from '~/stores/userStore'
import { useToast } from '#imports'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: 'profile-guard'
})

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()

// Reactive user object
const user = reactive({
  fullName: '',
  username: '',
  email: '',
  bio: '',
  phone: '',
  dob: '',
  avatar: '',
  memberSince: new Date().getFullYear()
})

// Preview image
const previewImage = ref('/games/ProfileAvatar.png')

// Sync user from store
watch(
  () => userStore.currentUser,
  (newUser) => {
    if (!newUser) return
    Object.assign(user, newUser)
    previewImage.value = newUser.avatar || '/games/ProfileAvatar.png'
  },
  { immediate: true }
)

// Save Changes
const showSuccessModal = ref(false)
const saveChanges = async () => {
  try {
    const res = await userStore.updateUser(user)

    if (res.success) {
      showSuccessModal.value = true
      toast.success({
        title: 'Success!',
        message: 'Profile updated successfully',
        position: 'topCenter'
      })
    } else {
      toast.error({
        title: 'Error!',
        message: res.message || 'Failed to update profile',
        position: 'topCenter'
      })
    }
  } catch (err) {
    toast.error({
      title: 'Error!',
      message: 'Unexpected error occurred',
      position: 'topCenter'
    })
  }
}

// Avatar Upload
const fileInput = ref(null)
const triggerFileInput = () => fileInput.value?.click()

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (event) => {
    const base64 = event.target.result
    user.avatar = base64
    userStore.updateProfileImage(base64)
  }
  reader.readAsDataURL(file)
}

const showPasswordModal = ref(false)
</script>


<style scoped>
input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>
