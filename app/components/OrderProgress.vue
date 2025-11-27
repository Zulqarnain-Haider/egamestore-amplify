<template>
  <div class="font-inter">
    <div class="text-primary text-lg mb-3">Order Progress</div>

    <div
      v-if="order.status !== 'Delivered'"
      class="bg-bgLight/20 rounded-xl p-6 w-full md:w-[280px] h-fit border border-bgLight"
    >
      <h3 class="text-md text-mainText mb-6">Order Timeline</h3>

      <div class="flex flex-col space-y-10 relative">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="relative flex flex-col"
        >
          <!-- Connector Line -->
          <div
            v-if="index !== steps.length - 1"
            class="absolute left-[11px] top-6 w-[2px] h-full"
            :class="lineClass(index)"
          ></div>

          <!-- Step Icon -->
          <div
            class="absolute -left-[1px] w-6 h-6 flex items-center justify-center"
            :class="circleEffect(index)"
          >
            <NuxtImg 
            densities="x1"
            quality="80" loading="lazy"
              v-if="index + 1 < currentStep"
              src="/games/ProgressCompleted.svg"
              alt="Completed"
              class="w-7 h-7"
            />
            <NuxtImg
            densities="x1"
            quality="80" loading="lazy"
              v-else-if="index + 1 === currentStep"
              src="/games/ProgressCurrent.svg"
              alt="Current"
              class="w-8 h-8 animate-pulse-icon"
            />
            <NuxtImg
            densities="x1"
            quality="80" loading="lazy"
              v-else
              src="/games/ProgressPending.svg"
              alt="Pending"
              class="w-7 h-7 opacity-80"
            />
          </div>

          <!-- Step Info -->
          <div class="ml-10">
            <p class="font-semibold text-mainText flex items-center gap-2">
              {{ step.label }}
              <AppButton
                v-if="index + 1 === currentStep"
                variant="primary"
                class="text-mainText px-3 py-[2px] ml-3 text-xs font-medium"
              >
                Current
              </AppButton>
            </p>
            <p class="text-xs text-onMainText/70 mt-1">
              {{ step.time }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  order: { type: Object, required: true },
})

// 🔹 Timeline steps (fixed order)
const steps = [
  { id: 1, label: 'Order Placed', time: '10:30 AM - Dec 20, 2025' },
  { id: 2, label: 'Payment Confirmed', time: '10:32 AM - Dec 20, 2025' },
  { id: 3, label: 'Preparation Started', time: '11:00 AM - Dec 20, 2025' },
  { id: 4, label: 'Ready for Delivery', time: '12:30 PM - Dec 20, 2025' },
  { id: 5, label: 'Out for Delivery', time: 'TBD - Dec 20, 2025' },
  { id: 6, label: 'Delivered', time: 'TBD - Dec 20, 2025' },
]

// 🔸 Map order.status → step index
const currentStep = computed(() => {
  const statusMap = {
    'Order Placed': 1,
    'Payment Confirmed': 2,
    'Preparation Started': 3,
    'Ready for Delivery': 4,
    'Out for Delivery': 5,
    'Delivered': 6,
  }
  return statusMap[props.order.status] || 1
})

// ✅ Step colors for lines
const lineClass = (index) => {
  const stepNum = index + 1
  if (stepNum < currentStep.value) return 'bg-green-500'
  if (stepNum === currentStep.value) return 'bg-primary'
  return 'bg-onMainText/30'
}

// ✅ Animated circle glow for current
const circleEffect = (index) => {
  const stepNum = index + 1
  if (stepNum === currentStep.value) return 'relative animate-glow'
  return ''
}
</script>

<style scoped>
/* 🌟 Custom soft pulse animation for current step */
@keyframes glowPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 145, 0, 0.45);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 145, 0, 0);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 145, 0, 0);
    transform: scale(1);
  }
}

.animate-glow {
  animation: glowPulse 1.8s ease-in-out infinite;
}

/* Optional small pulse to icon only */
@keyframes pulseIcon {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.95; }
}
.animate-pulse-icon {
  animation: pulseIcon 1.8s ease-in-out infinite;
}
</style>
