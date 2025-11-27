<template>
  <section class="text-white font-poppins">
    <!-- 🔹 Header -->
    <div
      class="flex items-center justify-between cursor-pointer border rounded-md border-outline p-8 mb-3"
      @click="toggleMainFaq"
    >
      <h2 class="text-xl font-semibold">Product FAQS</h2>
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
          <h4 class="text-md font-medium">{{ faq.question }}</h4>
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
            {{ faq.answer }}
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// 🔹 FAQs Data
const faqs = ref([
  {
    question: 'How do I activate the game after purchase?',
    answer: 'You will receive a digital code on your email which can be redeemed on the respective platform.',
    open: false,
  },
  {
    question: 'Can I get a refund after purchase?',
    answer: 'Refunds are available only if the key has not been redeemed yet within 24 hours.',
    open: false,
  },
  {
    question: 'Does this game support multiplayer?',
    answer: 'Yes, the game fully supports online multiplayer across platforms.',
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