<template>
  <div class="min-h-screen font-poppins text-mainText py-10 px-6 md:px-12">
    <div class="max-w-6xl mx-auto space-y-8">

      <!-- Back Button -->
      <div
        class="flex items-center gap-2 font-se text-primary font-medium cursor-pointer hover:underline"
        @click="goBack"
      >
    <Icon name="heroicons-arrow-left" class="w-5 h-5 font-semibold" />
        Back to my orders
      </div>

      <!-- Selected Order Summary -->
      <div v-if="order" class="bg-[#282C32] rounded-xl p-6 space-y-5">
        <!-- Header -->
        <div class="flex justify-between items-center flex-wrap gap-3">
          <h2 class="text-lg text-primary">Order Summary</h2>
          <button
            class="px-4 py-2 rounded-xl text-md font-medium"
            :class="{
              'bg-green-600 text-mainText': order.status === 'Delivered' || order.status === 'Completed',
              'bg-yellow-500 text-mainText': order.status === 'Processing'
            }"
          >
            {{ order.status === 'Completed' ? 'Delivered' : order.status }}
          </button>
        </div>

        <!-- Info Row -->
        <div class="flex flex-col sm:flex-row md:space-x-10 lg:space-x-32 gap-4 mt-3 text-sm sm:text-base">
          <div>
            <p class="text-onMainText text-sm">Order ID</p>
            <p class="text-md text-primary whitespace-nowrap">#{{ order.code || 'N/A' }}</p>
          </div>

          <div class="flex justify-start items-center gap-2">
            <div class="bg-mainText px-3 py-2 rounded-lg flex items-center justify-center">
              <Icon name="heroicons-map-pin-20-solid" class="text-neutral-700 w-6 h-6" />
            </div>
            <div>
              <p class="text-onMainText text-sm">Delivery Location</p>
              <p>{{ order.location || 'Not specified' }}</p>
            </div>
          </div>

          <div class="flex items-start gap-2">
            <div class="bg-mainText px-3 py-2 rounded-lg flex items-center justify-center">
              <!-- <i class="fa-solid fa-wallet text-neutral-700"></i> -->
              <Icon name="heroicons-wallet-20-solid" class=" text-neutral-700 w-6 h-6" />

            </div>
            <div>
              <p class="text-onMainText text-sm whitespace-nowrap">Payment Method</p>
              <p class="whitespace-nowrap">{{ order.paymentMethod || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-onMainText/60 my-4"></div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div class="flex gap-3 flex-wrap justify-center sm:justify-start">
            <AppButton
              v-if="order.secondaryBtn === 'Order again'"
              variant="primary"
              extraClass="text-mainText flex items-center gap-2 text-sm rounded-lg px-4 py-2"
            >
             <Icon name="heroicons-arrow-path" class="w-4 h-4 text-white" /> Order Again
            </AppButton>

            <AppButton
              v-if="order.primaryBtn === 'View Key'"
              variant="outline"
              extraClass="bg-mainText flex items-center gap-2 text-sm text-primary rounded-lg px-4 py-2"
              @click="openKeyModal"
            >
              <Icon name="fa-solid:key" /> View Key
            </AppButton>

            <button
              v-else-if="order.primaryBtn === 'Processing'"
              class="flex items-center gap-2 text-sm rounded-md px-3 py-[6px] bg-onMainText/40 font-medium text-mainText"
            >
              <!-- <NuxtImg src="/games/HourGlassIcon.svg" class="w-4 h-4"
              densities="x1" quality="80" loading="lazy" 
              /> -->
              <Icon name="mdi-hourglass" class="w-5 h-5" /> 
               {{ order.primaryBtn }}
            </button>

            <button
              v-if="order.secondaryBtn === 'Email'"
              class="flex items-center gap-2 text-mainText bg-onMainText/30 rounded-md px-3 py-[6px] text-sm font-medium"
            >
             <Icon name="mdi-email" class="w-5 h-5" /> {{ order.secondaryBtn }}
            </button>

            <AppButton
              variant="outline"
              extraClass="bg-mainText text-mainText flex items-center gap-2 text-sm text-primary rounded-lg px-4 py-2"
            >
              <Icon name="fa-solid:download" /> Download Invoice
            </AppButton>
          </div>
        </div>
      </div>

      <!--Show message if order not found -->
      <div v-else class="text-center text-onMainText mt-12">
        <p>No order found for this ID.</p>
        <AppButton
          variant="primary"
          extraClass="mt-4 text-mainText px-4 py-2 rounded-md"
          @click="goBack"
        >
          Back to Orders
        </AppButton>
      </div>

      <!-- Main Grid (Summary + Progress) -->
      <div v-if="order" class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <!-- Other Orders List -->
        <div v-if="otherOrders.length" class="space-y-5">
          <h3 class="text-lg text-primary">Other items</h3>

          <div
            v-for="item in otherOrders"
            :key="item.id"
            class="border border-bgLight bg-bgLight/20 rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div class="flex items-center gap-4 relative">
              <div class="relative">
                <NuxtImg
                  :src="item.image"
                  alt="cover"
                  densities="x1"
                  quality="80"
                  format="webp"
                  loading="lazy"
                  class="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div
                  class="absolute bottom-0 right-0"
                  :class="{
                    'text-green-400': item.status === 'Completed',
                    'text-yellow-400': item.status === 'Processing'
                  }"
                >
                  <NuxtImg
                    :src="item.status === 'Completed'
                      ? '/games/OrdersStatusIcon1.png'
                      : '/games/OrdersStatusIcon2.png'"
                    alt="status icon"
                    densities="x1"
                    quality="80"
                    format="webp"
                    loading="lazy"
                  />
                </div>
              </div>

              <div>
                <h4 class="font-medium text-lg">{{ item.title }}</h4>
                <p class="text-onMainText text-sm">
                  Order #{{ item.code }} •
                  <span
                    :class="{
                      'text-green-400': item.status === 'Completed',
                      'text-yellow-400': item.status === 'Processing'
                    }"
                  >
                    {{ item.status }}
                  </span>
                </p>
                <p class="text-xs text-onMainText mt-1">{{ item.date }}</p>
              </div>
            </div>

            <p class="text-lg font-semibold">${{ item.price }}</p>
          </div>
        </div>

        <!--Right Column: Order Progress -->
        <div class="hidden lg:block">
          <OrderProgress v-if="order" :order="order" />
        </div>
      </div>
    </div>

    <!--Key Modal -->
    <OrderKeyModal
      v-if="order"
      :visible="showModal"
      @close="showModal = false"
      :orderKey="order.key || ''"
      :serial="order.serial || ''"
      :itemId="order.items?.[0]?.id || null"
      @codesFetched="handleCodesFetched"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from '~/stores/ordersStore.js'

const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()

const showModal = ref(false)
const order = computed(() => ordersStore.selectedOrder)
const loading = computed(() => ordersStore.loading)
const error = computed(() => ordersStore.error)

const otherOrders = computed(() => {
  return ordersStore.orders.filter(o => o.id !== order.value?.id)
})

const goBack = () => {
  ordersStore.clearSelectedOrder()
  router.push('/orders')
}

const openKeyModal = async () => {
  if (order.value?.items?.length) {
    // Fetch codes for first item (or loop through items)
    const codes = await ordersStore.fetchOrderCodes(order.value.items[0].id)
    if (codes.length) {
      order.value.key = codes[0].actual_code
      order.value.serial = codes[0].hash_code
    }
  }
  showModal.value = true
}

const handleCodesFetched = (codeData) => {
  if (order.value) {
    order.value.key = codeData.actual_code
    order.value.serial = codeData.hash_code
  }
}

onMounted(() => {
  const orderId = route.params.id
  if (!order.value || order.value.id !== Number(orderId)) {
    ordersStore.fetchOrderDetails(orderId)
  }
})
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
