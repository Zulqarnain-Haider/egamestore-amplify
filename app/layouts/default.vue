<template>
   <div class="min-h-screen flex flex-col">
    <Navbar />

    <!-- PAGE CONTENT -->
    <main class="flex-1 relative overflow-hidden">
      <Transition :name="transitionName" mode="out-in">
        <NuxtPage />
      </Transition>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const transitionName = ref('slide-left')

// Track navigation direction
let history = []
watch(
  () => route.fullPath,
  (to, from) => {
    const toIndex = history.indexOf(to)
    const fromIndex = history.indexOf(from)

    if (toIndex === -1) {
      // new page (forward)
      history.push(to)
      transitionName.value = 'slide-left'
    } else if (toIndex < fromIndex) {
      // backward navigation
      transitionName.value = 'slide-right'
    } else {
      transitionName.value = 'slide-left'
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(60px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-60px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-60px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(60px);
}
</style>
