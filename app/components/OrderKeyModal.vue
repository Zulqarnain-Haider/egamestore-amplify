<template>
  <transition name="fade" class="mt-0 pt-0">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black/70 
      backdrop-blur-sm flex items-center justify-center z-[9999] overflow-hidden
       !m-0 !p-0 w-screen h-screen"
    >
      <!--Main Popup Card -->
      <div
        class="relative flex flex-col items-center justify-center text-center
         w-[90%] max-w-md sm:max-w-lg
         overflow-hidden p-8 md:p-10 animate-fadeIn"
      >
        <!--Background Image -->
        <NuxtImg
          src="/games/PopupMainCard.png"
          alt="Popup Background"
          format="webp"
          densities="x1"
          quality="80"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-contain object-center z-0"
        />

        <!-- Content -->
        <div class="relative z-10 flex flex-col scale-75 md:scale-90 font-poppins items-center justify-center w-full space-y-5">
          <!-- Heading -->
          <h2 class="text-xl sm:text-2xl font-semibold text-mainText">Your Code</h2>

          <!-- Key Box -->
          <div
            class="w-full border border-outline rounded-xl font-normal py-4 px-4 text-center"
          >
            <p class="text-xl sm:text-2xl break-all">
              {{ orderKey || 'XXXX-XXXX-XXXX-XXXX' }}
            </p>
          </div>

          <!-- Serial Box -->
          <div
            class="w-full rounded-xl py-2 px-4 text-center"
          >
            <p class="text-sm font-semibold sm:text-base text-mainText">
              Serial:
              <span class="text-gray-100 font-normal tex-sm">
                {{ serial || 'XXXXXXXXXXXXXXX' }}
              </span>
            </p>
          </div>

          <!-- Copy & Close Buttons -->
          <div class="flex justify-between items-center w-full gap-3">
            <AppButton
              variant="outline"
              full
              :height="42"
              extraClass="text-sm flex items-center rounded-full justify-center"
              @click="copyKey"
            >
               Copy
            </AppButton>
  <!-- <i class="fa-solid fa-copy"></i> -->
            <AppButton
              variant="outline"
              full
              :height="42"
              extraClass="text-sm flex items-center rounded-full justify-center"
              @click="$emit('close')"
            >
               Close
            </AppButton>
            <!-- <i class="fa-solid fa-xmark"></i> -->
          </div>

          <!-- Bottom Buttons -->
          <div class="flex items-center w-full gap-3">
            <button class="w-full py-3 text-onError bg-error/70 hover:bg-red/80 rounded-full text-sm flex items-center justify-center gap-2">
                Report problem
            </button> 

            <AppButton
              variant="primary"
              full
              :height="42"
              extraClass="text-sm flex items-center rounded-full justify-center gap-2"
            >
              <i class="fa-solid fa-question-circle"></i> How to redeem
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  orderKey: { type: String, default: 'jklsd-hfksj-fjse2-0384j' },
  serial: { type: String, default: 'jjdkjdk435tnkjlkowopweo439=' }
})

const emit = defineEmits(['close'])

const copyKey = () => {
  navigator.clipboard.writeText(props.orderKey)
}

watch(
  () => props.visible,
  (isVisible) => {
    document.body.style.overflow = isVisible ? 'hidden' : 'auto'
  }
)

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
