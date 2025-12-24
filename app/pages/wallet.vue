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
          <!-- show wallet.balance from api here -->
         <h3 class="text-onFooter">{{ balance }} balance in your wallet</h3>
        </div>
      </section>

      <!--Earning & Using Points (Keep it static) -->
      <div class="grid md:grid-cols-2 gap-8">
        <!-- LEFT: How to Earn Points -->
        <div class="bg-bgDark rounded-2xl p-5 border font-grotesk border-onFooter">
          <h3 class="text-xl mb-4 text-mainText">How to Earn Points</h3>

            <div class="flex flex-col gap-4">
          <div v-for="(item, index) in earnOptions" :key="index"
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
          <div v-for="(item, index) in useOptions" :key="index"
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


      <!--Transaction History ( Show api data here max 10 per page) -->
      <section class="bg-bgDark border border-bgLight rounded-2xl p-6 mt-6 font-grotesk">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <!-- LEFT -->
          <h3 class="text-lg text-mainText">
            Transaction History
          </h3>
        
          <!-- RIGHT -->
          <div class="flex items-center gap-4 md:justify-end self-end md:self-auto">
            <!-- Filter -->
            <div class="flex items-center gap-2 text-sm sm:text-base relative">
              <span class="text-mainText/80 whitespace-nowrap">Filter:</span>
        
              <div class="relative">
                <select
                  v-model="type"
                  class="bg-bgDark border appearance-none border-outline rounded-lg
                         px-4 py-2 pr-10 cursor-pointer text-mainText focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
        
                <Icon
                  name="heroicons-chevron-down-20-solid"
                  class="absolute right-2 top-1/2 -translate-y-1/2
                         pointer-events-none w-6 h-6 text-mainText"
                />
              </div>
            </div>
        
            <!-- Per Page -->
            <div class="flex items-center gap-2 text-sm sm:text-base relative">
              <span class="text-mainText/80 whitespace-nowrap">Show:</span>
        
              <div class="relative">
                <select
                  v-model="perPage"
                  class="bg-bgDark border appearance-none border-outline rounded-lg
                         px-4 py-2 pr-10 cursor-pointer text-mainText focus:outline-none"
                >
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="15">15</option>
                </select>
        
                <Icon
                  name="heroicons-chevron-down-20-solid"
                  class="absolute right-2 top-1/2 -translate-y-1/2
                         pointer-events-none w-6 h-6 text-mainText"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="hidden md:block overflow-x-auto">
        <div class="grid grid-cols-8 font-semibold border-b border-onFooter pb-2 text-sm">
          <span>ID</span>
          <span>Date</span>
          <span>Action</span>
          <span>Amount</span>
          <span>Reference</span>
          <span>Before</span>
          <span>After</span>
          <span>Notes</span>
        </div>
        <div
          v-for="txn in transactions"
          :key="txn.id"
          class="grid grid-cols-8 py-3 text-sm border-b border-bgLight last:border-none"
        >
          <span>{{ txn.id }}</span>
        
          <span class="text-mainText/80">
            {{ formatDate(txn.date) }}
          </span>
        
          <span>{{ txn.action }}</span>
        
          <span>{{ txn.amount }}</span>
        
          <span>{{ txn.reference }}</span>
        
          <span class="text-green-500">
            {{ txn.before }}
          </span>
        
          <span class="text-red-500">
            {{ txn.after }}
          </span>
        
          <span class="text-onFooter">
            {{ txn.notes }}
          </span>
        </div>
        <p v-if="!transactions.length" class="text-center text-onFooter py-10">
          No transactions yet.
        </p>
        </div>
        <!-- MOBILE TRANSACTIONS -->
      <div class="md:hidden space-y-4">
        <div
          v-for="txn in transactions"
          :key="txn.id"
          class="bg-bgLight/30 border border-bgLight rounded-xl p-4 text-sm"
        >
          <!-- Top row -->
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold">#{{ txn.id }}</span>
            <span class="text-mainText/70">
              {{ formatDate(txn.date) }}
            </span>
          </div>
      
          <!-- Action -->
          <div class="flex justify-between mb-1">
            <span class="text-onFooter">Action</span>
            <span>{{ txn.action }}</span>
          </div>
      
          <!-- Amount -->
          <div class="flex justify-between mb-1">
            <span class="text-onFooter">Amount</span>
            <span>{{ txn.amount }}</span>
          </div>
      
          <!-- Balance -->
          <div class="flex justify-between mb-1">
            <span class="text-onFooter">Before</span>
            <span class="text-green-500">{{ txn.before }}</span>
          </div>
      
          <div class="flex justify-between mb-1">
            <span class="text-onFooter">After</span>
            <span class="text-red-500">{{ txn.after }}</span>
          </div>
      
          <!-- Reference -->
          <div class="flex justify-between mb-1">
            <span class="text-onFooter">Ref</span>
            <span class="truncate max-w-[180px] text-right">
              {{ txn.reference }}
            </span>
          </div>
      
          <!-- Notes -->
          <div class="mt-2 text-onFooter text-xs">
            {{ txn.notes }}
          </div>
        </div>
      </div>

      </section>
      <Pagination
        v-if="lastPage > 1"
        v-model:page="page"
        :total="total"
        :per-page="perPage"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useUserStore } from '~/stores/userStore'

const config = useRuntimeConfig()
const userStore = useUserStore()
const { token, isReady } = storeToRefs(userStore)
const balance = ref(0)
const transactions = ref([])
const type = ref('') // '' = All, 'credit', 'debit'
const perPage = ref(10)
const page = ref(1) 
const total = ref(0)
const lastPage = ref(1)

const earnOptions = [
  { 
        id: 1,
        title: 'Complete Games',
        description: 'Earn 50–200 points per game',
        icon: '/wallet/EranPoint1.png'
      },
      { 
        id: 2,
        title: 'Daily Login',
        description: 'Get 25 points daily',
        icon: '/wallet/EranPoint2.svg'
      },
      { 
        id: 3,
        title: 'Refer Friends',
        description: 'Earn 500 points per referral',
        icon: '/wallet/EranPoint3.svg'
      },
]

const useOptions = [
  {
        id: 1,
        title: 'Discount Coupons',
        description: 'Starting from 500 points',
        action: 'Redeem',
        color: 'text-primary',
        icon: '/wallet/UsePoint1.svg'
      },
      {
        id: 2,
        title: 'Free Shipping',
        description: '200 points per order',
        action: 'Redeem',
        color: 'text-primary',
        icon: '/wallet/UsePoint2.svg'
      },
      {
        id: 3,
        title: 'Exclusive Products',
        description: 'Premium items available',
        action: 'Browse',
        color: 'text-orange-400',
        icon: '/wallet/UsePoint3.svg'
      },
]

watch(
  [() => isReady.value, () => type.value, () => perPage.value, () => page.value],
  async ([ready]) => {
    if (!ready || !token.value) return

    const { data, error } = await useFetch(
      `${config.public.apiBase}/users/wallets/transactions`,
      {
        query: {
          page: page.value,
          per_page: perPage.value,
          type: type.value || undefined,
        },
        headers: {
          Authorization: `Bearer ${token.value}`,
          lang: 'en',
        },
      }
    )

    if (error.value) {
      console.error('Wallet API error:', error.value)
      return
    }

    console.log('Wallet API response:', data.value)

    if (data.value?.data?.transactions) {
      const t = data.value.data.transactions
      balance.value = data.value.data.wallet.balance
      transactions.value = t.transactions.map(mapTransaction)
      total.value = t.total
      lastPage.value = t.last_page
    }
  },
  { immediate: true }
)

watch([type, perPage], () => {
  page.value = 1
})

function mapTransaction(txn) {
  return {
    id: txn.id,
    date: txn.created_at,
    action: txn.operation,
    amount: txn.amount,
    reference: txn.reference ?? '-',
    before: txn.balance?.before ?? '0.00',
    after: txn.balance?.after ?? '0.00',
    notes: txn.description ?? '-',
  }
}



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