<template>
  <div class="min-h-screen text-mainText py-10 px-6 md:px-12">
    <div class="max-w-7xl mx-auto flex flex-col gap-10">

      <!--Wallet Header -->
      <section
        class="bg-bgDark border border-bgLight rounded-2xl p-5 flex flex-col lg:flex-row justify-between 
        items-start lg:items-center relative z-10 space-y-4 overflow-hidden"
      >

       <!--Top-Left Vector -->
  <NuxtImg
    src="/wallet/vectorCircleLeft.png"
    alt="decorative circle"
    preload
    densities="x1"
    format="webp"
    quality="80"
    width="70"
    height="70"
    class="absolute bottom-0 left-0 opacity-70"
  />
    
  <!--Top-Right Vector -->
  <NuxtImg
    src="/wallet/vectorCircleRight.png"
    alt="decorative circle"
    preload
    densities="x1"
    format="webp"
    quality="80"
    width="70"
    height="70"
    class="absolute -top-4 right-0 opacity-70"
  />


        <div class="font-grotesk">
          <h2 class="text-2xl font-semibold mb-5">My Points Wallet</h2>
         <h3 class="text-onFooter">+{{ walletStore.totalPoints }} points this week</h3>
        </div>
      </section>

      <!--Earning & Using Points -->
      <div class="grid md:grid-cols-2 gap-8">
        <!-- LEFT: How to Earn Points -->
        <div class="bg-bgDark rounded-2xl p-5 border font-grotesk border-onFooter">
          <h3 class="text-xl mb-4 text-mainText">How to Earn Points</h3>

            <div class="flex flex-col gap-4">
          <div v-for="(item, index) in walletStore.earnOptions" :key="index"
               class="flex items-start gap-4 bg-bgLight/40 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
               <div class="flex justify-center bg- rounded-lg items-center p-3"
                :class="{
        'bg-teal-200': index === 0,
        'bg-violet-300': index === 1,
        'bg-rose-300': index === 2
      }"
      >
            <NuxtImg 
            densities="x1" quality="80" loading="lazy" :src="item.icon" alt="icon" class="object-contain" />
          </div>
            <div>
              <h4 class="">{{ item.title }}</h4>
              <p class="text-sm text-onFooter">{{ item.description }}</p>
            </div>
        </div>
        </div>
        </div>


        <!-- RIGHT: How to Use Points -->
        <div class="bg-bgDark rounded-2xl p-5 border font-poppins border-onFooter">
          <h3 class="text-xl mb-4 text-mainText">How to Use Points</h3>

            <div class="flex flex-col gap-4">
          <div v-for="(item, index) in walletStore.useOptions" :key="index"
               class="flex items-center justify-between bg-bgLight/40 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
               <div class="flex items-center gap-4 justify-">
               <div class="flex justify-center rounded-lg items-center p-3"
                :class="{
        'bg-pink-200': index === 0,
        'bg-blue-200': index === 1,
        'bg-green-200': index === 2
      }"
      >
            <NuxtImg 
            densities="x1" quality="80" loading="lazy" :src="item.icon" alt="icon" class="object-contain" />
            </div>  
            <div>
              <h4 class="text-mainText">{{ item.title }}</h4>
              <p class="text-sm text-mainText">{{ item.description }}</p>
            </div>
            </div>
            <h2 class="text-primary text-lg">{{ item.action }}</h2>

          </div>
        </div>
      </div>
      </div>


      <!--Transaction History -->
      <section class="bg-bgDark border border-bgLight rounded-2xl p-6 mt-6 font-grotesk">
        <h3 class="text-lg mb-4 text-mainText">Transaction History</h3>

        <div class="grid grid-cols-4 font-semibold border-b border-onFooter pb-2 text-sm sm:text-base">
          <span>Date</span>
          <span>Action</span>
          <span class="px-6 sm:px-3 lg:px-0">Points</span>
          <span>Notes</span>
        </div>

        <div v-for="(txn, i) in walletStore.transactions" :key="i"
             class="grid grid-cols-4 py-3 text-sm sm:text-base border-b border-bgLight last:border-none">
          <span class="text-mainText/80">{{ formatDate(txn.date) }}</span>
          <span class="text-mainText">{{ txn.action }}</span>
          <span :class="txn.points.startsWith('+')  ? 'text-green-500' : 'text-red-500'" class="px-6 sm:px-3 lg:px-0">
            {{ txn.points }}</span>
          <span class="text-onFooter">{{ txn.notes }}</span>
        </div>

        <p v-if="!walletStore.transactions.length" class="text-center text-onFooter py-10">
          No transactions yet.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useWalletStore } from '~/stores/walletStore'
import { onMounted } from 'vue'

const walletStore = useWalletStore()

onMounted(() => {
  walletStore.loadWalletFromStorage()
})

// Format date helper
function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
h2, h3, h4 {
  letter-spacing: 0.5px;
}
</style>
