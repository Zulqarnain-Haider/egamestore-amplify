<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <!-- Main Card -->
      <div
        class="relative flex flex-col items-center justify-center
         text-center w-[90%] max-w-lg aspect-[4/5] sm:aspect-[4/4] md:aspect-[3/4]
         overflow-hidden sm:p-8 rounded-[3rem] shadow-2xl animate-fadeIn"
      >
        <NuxtImg
          src="/games/PopupMainCard.png"
          alt="Popup Background"
          quality="80"
          densities="x1"
          format="webp"
          preload
          class="absolute inset-0 w-full h-full object-contain object-center z-0"
        />

        <!-- Success Content -->
        <div class="flex flex-col items-center justify-center space-y-6 scale-90">
          <NuxtImg quality="80" densities="x1" loading="lazy"
            src="/games/ResetPasswordSuccess.png"
            alt="Success"
            class="w-16 h-16 sm:w-20 sm:h-20"
          />
          <h2
            class="text-mainText font-semibold tracking-wide max-w-[60%] mx-auto text-xl sm:text-2xl leading-snug"
          >
            {{ t('profileUpdateSuccessTitle') }}
          </h2>
          <button
            @click="closeModal"
            class="bg-primary w-full text-white px-8 py-2 rounded-md hover:bg-orange-600 transition"
          >
           {{ t('commonOk') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['close'])

const closeModal = () => emit('close')
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
