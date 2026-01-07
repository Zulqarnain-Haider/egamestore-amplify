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
               max-w-[92%] sm:max-w-4xl
               h-[76vh] sm:h-[82vh]
               rounded-[2.8rem]
               overflow-hidden
               white-space-normal
               textalign-truncate
               shadow-2xl animate-fadeIn
               bg-[url('/games/PopupMainCard.png')] bg-cover bg-center bg-no-repeat"
      >
        <!-- Background -->
        <!-- <NuxtImg
          src="/games/PopupMainCard.png"
          alt="Modal Background"
          class="absolute inset-0 w-full h-full object-contain z-0"
          preload
        /> -->

        <!-- Content Wrapper -->
        <div
          class="relative z-10 flex flex-col h-full
                 px-4 sm:px-10
                 py-16 sm:py-28"
        >
          <!-- Tabs -->
          <div class="flex justify-center gap-3 sm:gap-4 mb-4 sm:mb-5">
            <button
              @click="activeTab = 'terms'"
              class="px-4 sm:px-6 py-2 rounded-full
                     text-xs sm:text-sm font-semibold transition"
              :class="activeTab === 'terms'
                ? 'bg-primary text-onPrimary'
                : 'border border-primary text-onPrimary hover:bg-primary/10'"
            >
              {{ t('termsOfService') }}
            </button>

            <button
              @click="activeTab = 'privacy'"
              class="px-4 sm:px-6 py-2 rounded-full
                     text-xs sm:text-sm font-semibold transition"
              :class="activeTab === 'privacy'
                ? 'bg-primary text-onPrimary'
                : 'border border-primary text-onPrimary hover:bg-primary/10'"
            >
              {{ t('privacyAndPolicy') }}
            </button>
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
              v-else
              class="terms_wrapper
                     text-xs sm:text-sm
                     leading-snug sm:leading-relaxed
                     text-mainText"
              v-html="activeTab === 'terms'
                ? termsContent
                : privacyContent"
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

const activeTab = ref('terms')
const config = useRuntimeConfig()

/* SSR-friendly + lazy */
const [{ data: termsData }, { data: privacyData }, pending] = await Promise.all([
  useFetch(`${config.public.apiBase}/terms`, {
    headers: { lang: locale.value },
    lazy: true,
  }),
  useFetch(`${config.public.apiBase}/privacy-policy`, {
    headers: { lang: locale.value },
    lazy: true,
  }),
])

const termsContent = computed(() => termsData.value?.data?.content || '')
const privacyContent = computed(() => privacyData.value?.data?.content || '')
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

/* Legal HTML spacing */
.terms_wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

/* Reduce vertical pressure on mobile */
@media (max-width: 640px) {
  .terms_wrapper {
    gap: 0.75rem;
  }

  .terms_wrapper p {
    line-height: 1.45;
  }
}

.terms_wrapper ul {
  padding-left: 1.25rem;
  list-style: disc;
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

