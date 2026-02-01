<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm
             flex items-center justify-center
             z-50 px-4"
    >
      <!-- Card -->
      <div
        class="relative w-full
               max-w-full sm:max-w-4xl
               h-[76vh] sm:h-[82vh]
               rounded-[2.8rem]
               overflow-hidden
               white-space-normal
               textalign-truncate
               shadow-2xl animate-fadeIn
               bg-[url('/games/PopupMainCard.png')] bg-cover bg-center bg-no-repeat"
      >
        <!-- Content Wrapper -->
        <div
          class="relative z-10 flex flex-col h-full
                 px-4 sm:px-10
                 py-16 sm:py-28"
        >
          <!-- Title -->
          <div class="flex justify-center mb-4 sm:mb-5">
            <h2 class="text-lg sm:text-xl font-semibold text-mainText">
              {{ t('howToRedeem') }}
            </h2>
          </div>

          <!-- Scrollable Content -->
          <div
            class="flex-1 rounded-2xl
                   px-5 sm:px-7
                   py-3 sm:py-5
                   overflow-y-auto custom-scroll"
          >
            <div
              v-if="pending"
              class="text-center text-xs sm:text-sm text-inputsIn mt-10"
            >
              {{ t('loading') }}
            </div>

            <div
              v-else-if="error"
              class="text-center text-xs sm:text-sm text-error mt-10"
            >
              {{ error }}
            </div>

            <div
              v-else
              class="redeem_wrapper
                     text-xs sm:text-sm
                     leading-snug sm:leading-relaxed
                     text-mainText"
              v-html="redeemContent"
            />
          </div>

          <!-- Footer -->
          <div class="flex justify-center mt-4 sm:mt-6">
            <button
              @click="$emit('update:modelValue', false)"
              class="px-8 sm:px-10 py-2 rounded-md
                     bg-primary text-onPrimary
                     text-sm font-semibold
                     hover:bg-orange-600 transition"
            >
              {{ t('close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const { t, locale } = useI18n()
const props = defineProps({
  modelValue: Boolean,
})

defineEmits(['update:modelValue'])

const config = useRuntimeConfig()

// Fetch redeem data
const { data: redeemData, pending, error } = await useFetch(
  `${config.public.apiBase}/redeem`,
  {
    headers: { 
      lang: locale.value,
      // Add authorization if needed
      // Authorization: `Bearer ${token}`
    },
    lazy: true,
    server: true // SSR support
  }
)

const redeemContent = computed(() => {
  if (!redeemData.value?.status) {
    return `<p class="text-error">Failed to load redeem instructions</p>`
  }
  
  return redeemData.value?.data?.content || 
    `<p class="text-onMainText">No redeem instructions available.</p>`
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Content spacing */
.redeem_wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

/* Reduce vertical pressure on mobile */
@media (max-width: 640px) {
  .redeem_wrapper {
    gap: 0.75rem;
  }

  .redeem_wrapper p {
    line-height: 1.45;
  }
}

.redeem_wrapper ul {
  padding-left: 1.25rem;
  list-style: disc;
}

.redeem_wrapper ol {
  padding-left: 1.25rem;
  list-style: decimal;
}

/* Custom Scrollbar */
.custom-scroll::-webkit-scrollbar {
  width: 5px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #ff6916;
  border-radius: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
</style>