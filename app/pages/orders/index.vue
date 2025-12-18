<template>
  <div class="min-h-screen font-poppins text-mainText py-10 px-7 md:px-16">
    <div class="max-w-7xl mx-auto space-y-8">
      <!--Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 class="text-2xl md:text-3xl font-semibold">My Orders</h1>
          <p class="text-onMainText text-sm mt-1">
            View and manage your digital game purchases
          </p>
        </div>

        <!--Search + Filter -->
        <div class="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
          <div
            class="flex items-center bg-bgLight/40 border border-onFooter/90 rounded-lg px-3 py-2 w-full md:w-64"
          >
            <i class="fa-solid fa-magnifying-glass text-onMainText mr-2"></i>
            <input
              v-model="searchQuery"
              placeholder="Search orders..."
              class="bg-transparent outline-none text-sm w-full text-mainText placeholder-onMainText"
            />
          </div>

          <button
            class="flex items-center gap-2 border border-outline text-sm px-3 py-2 rounded-lg transition whitespace-nowrap"
          >
            All Orders
            <i class="fa-solid fa-chevron-down text-xs"></i>
          </button>
        </div>
      </div>

      <!--Stats Row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          v-for="(card, i) in statsCards"
          :key="i"
          class="bg-bgLight/40 border border-bgLight rounded-xl py-8 gap-3 px-2 lg:px-5 flex items-center text-center"
        >
          <div class="px-2 py-3 rounded-md z-10"
            :class="{
        'bg-blue-200/90': i === 0,     // Total Orders
        'bg-green-200': i === 1,    // Completed
        'bg-yellow-100': i === 2,   // Processing
        'bg-purple-200/90': i === 3    // Total Spent
      }" 
      >
        <NuxtImg :src="card.icon" alt="icon" densities="x1" quality="80" 
        format="webp" loading="lazy" class="z-[9999] w-8 h-8" />
          </div>
          <div class="flex flex-col items-start">
            <p class="text-xl font-semibold">{{ card.value }}</p>
            <p class="text-sm text-onMainText">{{ card.label }}</p>
          </div>
        </div>
      </div>

      <!--Orders List -->
<div class="space-y-5">
  <div
    v-for="order in paginatedOrders"
    :key="order.id"
    class="border border-bgLight bg-bgLight/20 rounded-lg p-6 flex flex-col gap-3 relative overflow-hidden"
  >
    <!-- Top Row: Image + Info (Left) | Price + Buttons (Right) -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

      <!--LEFT SECTION -->
      <div class="flex items-center gap-4 w-full md:w-auto">
        <!--Product Image -->
        <div class="relative w-20 h-20 flex-shrink-0">
          <NuxtImg
          densities="x1" quality="80" loading="lazy" format="webp"
            :src="order.image"
            alt="cover"
            class="w-20 h-20 rounded-lg object-cover"
          />

          <!--Status Icon -->
          <div
            v-if="order.status === 'Completed'"
            class="absolute bottom-0 right-0"
          >
            <NuxtImg 
            densities="x1" quality="80" loading="lazy" format="webp"
            src="/games/OrdersStatusIcon1.png" alt="Completed Icon" class="" />
          </div>
          <div
            v-else
            class="absolute bottom-0 right-0"
          >
            <NuxtImg 
            densities="x1" quality="80" loading="lazy" format="webp"
             src="/games/OrdersStatusIcon2.png" alt="Processing Icon" class="" />
          </div>
        </div>

        <!--Order Info -->
        <div class="flex flex-col justify-center">
          <h3 class="font-medium text-lg">{{ order.title }}</h3>
          <p class="text-onMainText text-sm">
            Order #{{ order.code }} •
            <span
              :class="{
                'text-green-400': order.status === 'Completed',
                'text-yellow-400': order.status === 'Processing'
              }"
            >
              {{ order.status }}
            </span>
          </p>
          <p class="text-xs text-onMainText mt-1">{{ order.date }}</p>
        </div>
      </div>

      <!--RIGHT SECTION -->
      <div class="flex flex-col items-end gap-2 w-full md:w-auto">
        <p class="text-lg font-semibold">${{ order.price }}</p>

        <!-- Buttons Row -->
        <div class="flex gap-2 flex-wrap justify-end">
          <!--View Key -->
          <AppButton
            v-if="order.primaryBtn === 'View Key'"
            variant="primary"
            :height="36"
            extraClass="px-5 py-1 text-sm rounded-lg whitespace-nowrap"
            @click="openKeyModal(order)"
          >
            <Icon name="fa-solid:key" class="mr-1" /> {{ order.primaryBtn }}
          </AppButton>

          <!--Processing -->
          <button
            v-else-if="order.primaryBtn === 'Processing'"
            class="flex items-center gap-2 text-sm rounded-md px-3 py-[6px] bg-onMainText/40 font-medium text-mainText"
          >
            <!-- <NuxtImg src="/games/HourGlassIcon.svg" densities="x1" quality="80" loading="lazy" 
             alt="hourglass" class="w-4 h-4" /> -->
             <Icon name="mdi-hourglass" class="w-5 h-5" /> 
            {{ order.primaryBtn }}
          </button>

          <!-- Email -->
          <button
            v-if="order.secondaryBtn === 'Email'"
            class="flex items-center gap-2 text-mainText bg-onMainText/30 rounded-md px-3 py-[6px] text-sm font-medium"
          >
            <Icon name="mdi-email" class="w-5 h-5 text-mainText" />
            {{ order.secondaryBtn }}
          </button>

          <!--Other (Play Now / Order Again) -->
          <button
            v-else-if="order.secondaryBtn === 'Order again' || order.secondaryBtn === 'Play Now'"
            class="flex items-center gap-2 text-mainText bg-onMainText/30 rounded-md px-3 py-[6px] text-sm font-medium"
          >
           <NuxtImg
           densities="x1" quality="80" loading="lazy"
          v-if="order.secondaryBtn === 'Order again'"
          src="/games/OrdersIcon8.svg"
          alt="Order Again"
         class="w-4 h-4"
          />
           <NuxtImg 
           densities="x1" quality="80" loading="lazy"
             v-else-if="order.secondaryBtn === 'Play Now'"
             src="/games/OrdersIcon9.svg"
             alt="Play Now"
             class="w-4 h-4"
           />
            {{ order.secondaryBtn }}
          </button>
        </div>
      </div>
    </div>

          <!-- Divider -->
          <div class="border-t border-onMainText/60"></div>
          <!--Bottom Info Row -->
          <div class="flex justify-between items-center text-sm flex-wrap">
            <div class="text-onMainText space-x-3">
              <span>Platform: <span class="text-mainText">{{ order.platform }}</span></span>
              <span>Region: <span class="text-mainText">{{ order.region }}</span></span>
              <span>
                Delivery:
                <span
                  :class="{
                    'text-green-400': order.delivery === 'Instant',
                    'text-yellow-500': order.delivery.includes('Within')
                  }"
                >
                  {{ order.delivery }}
                </span>
              </span>
            </div>

            <p
              class="text-primary text-sm font-medium items-center cursor-pointer hover:underline mt-2 sm:mt-0 flex"
                @click="goToDetails(order)"
                >
              {{ order.detailsText }}
              <Icon name="heroicons-chevron-right-20-solid" class="text-primary text-xl" />
            </p>
          </div>
        </div>
      </div>

                 
             <OrderKeyModal
       :visible="showModal"
       @close="showModal = false"
       :orderKey="selectedOrder.key"
       :serial="selectedOrder.serial"
     />

      <!--Pagination (Right Aligned) -->
      <div class="flex justify-between items-center flex-wrap gap-3">
        <p class="text-onFooter text-md">Showing 1–5 of 24 orders</p>
        <Pagination
          :total="orders.length"
          :perPage="5"
          :page="page"
          @update:page="page = $event"
          :iconsOnly="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useOrdersStore } from '~/stores/ordersStore.js'

const ordersStore = useOrdersStore()

const searchQuery = ref('')
const page = ref(1)
const statusFilter = ref('all') // For API filter

const orders = computed(() => ordersStore.orders)
const loading = computed(() => ordersStore.loading)
const error = computed(() => ordersStore.error)
const pagination = computed(() => ordersStore.pagination)

const perPage = computed(() => pagination.value.per_page || 15)
const total = computed(() => pagination.value.total || 0)

const paginatedOrders = computed(() => {
  // API already paginated, so return all
  return orders.value
})

// Stats (API se calculate karo or static rakho)
const statsCards = ref([
  { icon: '/games/OrdersIcon1.png', value: total.value, label: 'Total Orders' },
  { icon: '/games/OrdersIcon2.png', value: orders.value.filter(o => o.status === 'Completed').length, label: 'Completed' },
  { icon: '/games/OrdersIcon3.png', value: orders.value.filter(o => o.status === 'Processing').length, label: 'Processing' },
  { icon: '/games/OrdersIcon4.png', value: orders.value.reduce((sum, o) => sum + o.price, 0).toFixed(2), label: 'Total Spent' }
])

const goToDetails = (order) => {
  ordersStore.setSelectedOrder(order)
  router.push(`/orders/${order.id}`)
}

onMounted(() => {
  ordersStore.fetchOrders(statusFilter.value, page.value, perPage.value)
})

// Watch for page/status changes
watch([page, statusFilter], () => {
  ordersStore.fetchOrders(statusFilter.value, page.value, perPage.value)
})
</script>

<style scoped>
input::placeholder {
  color: #9ca3af;
}
</style>
