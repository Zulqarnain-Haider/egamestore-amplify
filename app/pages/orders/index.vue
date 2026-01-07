<template>
  <div class="min-h-screen font-poppins text-mainText py-10 px-7 md:px-16">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 class="text-2xl md:text-3xl font-semibold">{{ t('myOrdersTitle') }}</h1>
          <p class="text-onMainText text-sm mt-1">
            {{ t('myOrdersSubtitle') }}
          </p>
        </div>

        <!-- Search + Filter -->
        <div class="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto relative">
          <!-- Search -->
          <div class="flex items-center bg-bgLight/40 border border-onFooter/90 rounded-lg px-3 py-2 w-full md:w-64">
            <i class="fa-solid fa-magnifying-glass text-onMainText mr-2"></i>
            <input
              v-model="searchQuery"
              :placeholder="t('ordersSearchPlaceholder')"
              class="bg-transparent outline-none text-sm w-full text-mainText placeholder-onMainText"
            />
          </div>

          <!-- ✅ Styled Status Dropdown -->
          <div class="relative">
            <!-- Trigger -->
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="flex items-center gap-2 border border-outline text-sm px-3 py-2 rounded-lg whitespace-nowrap"
            >
              {{ selectedStatusLabel }}
              <i class="fa-solid fa-chevron-down text-xs"></i>
            </button>

            <!-- Menu -->
            <div
              v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-44 bg-bgLight border border-outline rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <button
                v-for="opt in statusOptions"
                :key="opt.value"
                @click="selectStatus(opt.value)"
                class="w-full text-left px-4 py-2 text-sm hover:bg-bgLight/70 transition"
                :class="{
                  'text-primary font-medium': statusFilter === opt.value
                }"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          v-for="(card, i) in statsCards"
          :key="i"
          class="bg-bgLight/40 border border-bgLight rounded-xl py-8 gap-3 px-2 lg:px-5 flex items-center"
        >
          <div
            class="px-2 py-3 rounded-md"
            :class="{
              'bg-blue-200/90': i === 0,
              'bg-green-200': i === 1,
              'bg-yellow-100': i === 2,
              'bg-purple-200/90': i === 3
            }"
          >
            <NuxtImg
              :src="card.icon"
              densities="x1"
              quality="80"
              format="webp"
              loading="lazy"
              class="w-8 h-8"
            />
          </div>

          <div class="flex flex-col items-start">
            <p class="text-xl font-semibold">{{ card.value }}</p>
            <p class="text-sm text-onMainText">{{ card.label }}</p>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="space-y-5">
        <div
          v-for="order in paginatedOrders"
          :key="order.id"
          class="border border-bgLight bg-bgLight/20 rounded-lg p-6 flex flex-col gap-3"
        >
          <div class="flex flex-col md:flex-row justify-between gap-6">
            <div class="flex items-center gap-4">
              <NuxtImg
                :src="order.image"
                densities="x1"
                quality="80"
                format="webp"
                loading="lazy"
                class="w-20 h-20 rounded-lg object-cover"
              />

              <div>
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

            <div class="flex flex-col items-end gap-2">
              <p class="text-lg font-semibold">${{ order.price }}</p>

              <div class="flex gap-2">
                <AppButton
                  v-if="order.primaryBtn === 'View Key'"
                  variant="primary"
                  :height="36"
                  extraClass="px-5 py-1 text-sm rounded-lg"
                  @click="openKeyModal(order)"
                >
                  <Icon name="fa-solid:key" class="mr-1" /> {{ t('orderViewKey') }}
                </AppButton>

                <button
                  v-else
                  class="flex items-center gap-2 text-sm rounded-md px-3 py-[6px] bg-onMainText/40"
                >
                  <Icon name="mdi-hourglass" class="w-5 h-5" />
                  {{ t('orderProcessing') }}
                </button>
              </div>
            </div>
          </div>

          <div class="border-t border-onMainText/60"></div>

          <div class="flex justify-between items-center text-sm">
            <div class="text-onMainText space-x-3">
              <span>{{ t('orderPlatform') }}: <span class="text-mainText">{{ order.platform }}</span></span>
              <span>{{ t('orderRegion')}}: <span class="text-mainText">{{ order.region }}</span></span>
              <span>{{ t('orderDelivery') }}: <span class="text-green-400">{{ order.delivery }}</span></span>
            </div>

            <p
              class="text-primary cursor-pointer hover:underline flex items-center"
              @click="goToDetails(order)"
            >
              {{ t('orderViewDetails') }}
              <Icon name="heroicons-chevron-right-20-solid" class="ml-1" />
            </p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center">
        <p class="text-onFooter text-md">{{ paginationText }}</p>

        <Pagination
          :total="ordersStore.pagination.total"
          :perPage="ordersStore.pagination.per_page"
          :page="page"
          @update:page="page = $event"
          :iconsOnly="true"
        />
      </div>
    </div>

    <OrderKeyModal
      :visible="showModal"
      :codes="selectedCodes"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOrdersStore } from '~/stores/ordersStore'

useHead({
  title: 'My Orders | eGameStore',
  meta: [{ name: 'description', content: 'View and manage your eGameStore orders' }]
})

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const ordersStore = useOrdersStore()

const searchQuery = ref('')
const page = ref(1)
const statusFilter = ref(route.query.status || 'all')

const dropdownOpen = ref(false)
const showModal = ref(false)
const selectedCodes = ref([])

const orders = computed(() => ordersStore.orders)
const paginatedOrders = computed(() => orders.value)

/* Status options */
const statusOptions = computed(() => [
  { label: t('ordersFilterAll'), value: 'all' },
  { label: t('ordersFilterCompleted'), value: 'completed' },
  { label: t('ordersFilterProcessing'), value: 'processing' },
  { label: t('ordersFilterOnHold'), value: 'on-hold' },
  { label: t('ordersFilterShipped'), value: 'shipped' },
  { label: t('ordersFilterCancelled'), value: 'cancelled' },
  { label: t('ordersFilterRefunded'), value: 'refunded' }
])


const selectedStatusLabel = computed(() => {
  return (
    statusOptions.value.find(o => o.value === statusFilter.value)?.label ||
    t('ordersFilterAll')
  )
})

const paginationText = computed(() => {
  const { current_page, per_page, total } = ordersStore.pagination
  if (!total) return t('ordersShowingNone')
  const start = (current_page - 1) * per_page + 1
  const end = Math.min(current_page * per_page, total)
  return t('ordersShowingRange', {
    start,
    end,
    total
  })
})

const statsCards = computed(() => [
  {
    icon: '/games/OrdersIcon1.png',
    value: ordersStore.pagination.total,
    label: t('ordersStatsTotal')
  },
  {
    icon: '/games/OrdersIcon2.png',
    value: orders.value.filter(o => o.status === 'Completed').length,
    label: t('ordersStatsCompleted')
  },
  {
    icon: '/games/OrdersIcon3.png',
    value: orders.value.filter(o => o.status === 'Processing').length,
    label: t('ordersStatsProcessing')
  },
  {
    icon: '/games/OrdersIcon4.png',
    value: orders.value.reduce((s, o) => s + (Number(o.price) || 0), 0).toFixed(2),
    label: t('ordersStatsTotalSpent')
  }
])

const selectStatus = (val) => {
  dropdownOpen.value = false
  statusFilter.value = val
}

const goToDetails = (order) => {
  ordersStore.setSelectedOrder(order)
  router.push(`/orders/${order.id}`)
}

const openKeyModal = async (order) => {
  selectedCodes.value = []
  await ordersStore.fetchOrderDetails(order.id)

  const items = ordersStore.selectedOrder?.items
  if (Array.isArray(items)) {
    selectedCodes.value = items
      .filter(i => i.product_type === 2 && Array.isArray(i.codes_list))
      .flatMap(c =>
        c.codes_list.map(code => ({
          code: code.code,
          serial: code.serial_number || ''
        }))
      )
  }

  showModal.value = true
}

/* Initial load */
onMounted(() => {
  ordersStore.fetchOrders(statusFilter.value, page.value)
})

/* Page change */
watch(page, () => {
  ordersStore.fetchOrders(statusFilter.value, page.value)
})

/* Status change */
watch(statusFilter, (val) => {
  page.value = 1
  router.replace({ query: { ...route.query, status: val } })
  ordersStore.fetchOrders(val, 1)
})
</script>
