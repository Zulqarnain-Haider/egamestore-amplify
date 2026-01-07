<template>
  <section class="text-white font-poppins">
    <!-- 🔹 Header -->
    <div
      class="flex items-center justify-between cursor-pointer border rounded-md border-outline p-8 mb-3"
      @click="toggleMainFaq"
    >
      <h2 class="text-xl font-semibold">{{ t('productFaqTitle') }}</h2>
      <i
        class="fa-solid fa-chevron-down text-lg transition-transform duration-300"
        :class="{ 'rotate-180': mainFaqOpen }"
      ></i>
    </div>

    <!-- 🔹 FAQ List -->
    <div
      v-show="mainFaqOpen"
      class="space-y-4 transition-all duration-500 overflow-hidden"
    >
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="border border-outline rounded-md overflow-hidden"
      >
        <!-- Question Row -->
        <div
          class="flex justify-between items-center px-4 py-3 cursor-pointer bg-[#282C32] hover:bg-[#282C32]/70 transition"
          @click="toggleQuestion(index)"
        >
          <h4 class="text-md font-medium">{{ t(faq.question) }}</h4>
          <i
            class="fa-solid fa-chevron-down text-sm transition-transform duration-300"
            :class="{ 'rotate-180': faq.open }"
          ></i>
        </div>

        <!-- Answer Row -->
        <transition name="fade">
          <div
            v-if="faq.open"
            class="px-1 py-3  mx-3 border-t border-outline/50 text-onMainText"
          >
            {{ t(faq.answer) }}
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const { t } = useI18n()

// 🔹 FAQs Data
const faqs = ref([
  {
    question: 'productFaqQ1',
    answer: 'productFaqA1',
    open: false,
  },
  {
    question: 'productFaqQ2',
    answer: 'productFaqA2',
    open: false,
  },
  {
    question: 'productFaqQ3',
    answer: 'productFaqA3',
    open: false,
  },
])

// 🔹 Controls
const mainFaqOpen = ref(false)

const toggleMainFaq = () => {
  mainFaqOpen.value = !mainFaqOpen.value
}

const toggleQuestion = (index) => {
  faqs.value[index].open = !faqs.value[index].open
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 🔹 Smooth fade animation for answer */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>