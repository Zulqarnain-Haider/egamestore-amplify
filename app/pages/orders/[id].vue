<template>
  <div class="min-h-screen font-poppins text-mainText py-10 px-6 md:px-12">
    <div class="max-w-6xl mx-auto space-y-8">

      <!-- Back Button -->
      <div
        class="flex items-center gap-2 font-se text-primary font-medium cursor-pointer hover:underline"
        @click="goBack"
      >
        <Icon name="heroicons-arrow-left" class="w-5 h-5 font-semibold" />
        {{ t('orderDetailsBack') }}
      </div>

      <!-- Selected Order Summary -->
      <div v-if="order" class="bg-[#282C32] rounded-xl p-6 space-y-5">
        <!-- Header -->
        <div class="flex justify-between items-center flex-wrap gap-3">
          <h2 class="text-lg text-primary">{{ t('orderSummaryTitle') }}</h2>

          <!-- ✅ Beautiful status badge for ALL states -->
          <button
            class="px-4 py-2 rounded-xl text-md font-medium"
            :class="{
              'bg-green-600 text-mainText': order.status === 'Completed',
              'bg-yellow-500 text-mainText': order.status === 'Processing',
              'bg-yellow-500 text-mainText': order.status === 'On Hold',
              'bg-yellow-500 text-mainText': order.status === 'Shipped'
            }"
          >
            {{ order.status === 'Completed'
              ? t('orderStatusDelivered')
              : order.status
            }}
          </button>
        </div>

        <!-- Info Row -->
        <div class="flex flex-col sm:flex-row md:space-x-10 lg:space-x-32 gap-4 mt-3 text-sm sm:text-base">
          <div>
            <p class="text-onMainText text-sm">{{ t('orderIdLabel') }}</p>
            <p class="text-md text-primary whitespace-nowrap">
              #{{ order.code || 'N/A' }}
            </p>
          </div>

          <div class="flex justify-start items-center gap-2">
            <div class="bg-mainText px-3 py-2 rounded-lg flex items-center justify-center">
              <Icon name="heroicons-map-pin-20-solid" class="text-neutral-700 w-6 h-6" />
            </div>
            <div>
              <p class="text-onMainText text-sm">{{ t('orderDeliveryLocation') }}</p>
              <p>{{ order.location || t('orderNotSpecified') }}</p>
            </div>
          </div>

          <div class="flex items-start gap-2">
            <div class="bg-mainText px-3 py-2 rounded-lg flex items-center justify-center">
              <Icon name="heroicons-wallet-20-solid" class="text-neutral-700 w-6 h-6" />
            </div>
            <div>
              <p class="text-onMainText text-sm whitespace-nowrap">{{ t('orderPaymentMethod') }}</p>
              <!-- ✅ API driven -->
              <p class="whitespace-nowrap">
                {{ order.payment_method || 'N/A' }}
              </p>
            </div>
          </div>
        </div>

        <div class="border-t border-onMainText/60 my-4"></div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div class="flex gap-3 flex-wrap justify-center sm:justify-start">

            <AppButton
              v-if="order.secondaryBtn === 'Order again'"
              variant="primary"
              extraClass="text-mainText flex items-center gap-2 text-sm rounded-lg px-4 py-2"
            >
              <Icon name="heroicons-arrow-path" class="w-4 h-4 text-white" />
              {{ t('orderAgain') }}
            </AppButton>

            <AppButton
              v-if="order.primaryBtn === 'View Key'"
              variant="outline"
              extraClass="bg-mainText flex items-center gap-2 text-sm text-primary rounded-lg px-4 py-2"
              @click="openKeyModal"
            >
              <Icon name="fa-solid:key" /> {{ t('orderViewKey') }}
            </AppButton>

            <button
              v-else
              class="flex items-center gap-2 text-sm rounded-md px-3 py-[6px] bg-onMainText/40 font-medium text-mainText"
            >
              <Icon name="mdi-hourglass" class="w-5 h-5" />
              {{ order.status }}
            </button>

            <AppButton
              variant="outline"
              extraClass="bg-mainText text-mainText flex items-center gap-2 text-sm text-primary rounded-lg px-4 py-2"
            >
              <Icon name="fa-solid:download" /> {{ t('orderDownloadInvoice') }}
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div v-if="order" class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

        <!-- ✅ ORDER ITEMS (correct source) -->
        <div v-if="order.items?.length" class="space-y-5">
          <h3 class="text-lg text-primary">{{ t('orderItemsTitle') }}</h3>

          <div
            v-for="item in order.items"
            :key="item.id"
            class="border border-bgLight bg-bgLight/20 rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div class="flex items-center gap-4">
              <NuxtImg
                :src="item.img"
                densities="x1"
                quality="80"
                format="webp"
                loading="lazy"
                class="w-20 h-20 rounded-lg object-cover"
              />

              <div>
                <h4 class="font-medium text-lg">{{ item.name }}</h4>
                <p class="text-onMainText text-sm">
                  {{ t('orderQuantity') }}: {{ item.qty }}
                </p>
              </div>
            </div>

            <p class="text-lg font-semibold">
              ${{ item.price }}
            </p>
          </div>
        </div>

        <!-- ✅ Order Progress ONLY if tracking exists -->
        <div class="hidden lg:block">
          <OrderProgress
            v-if="order.tracking_data && order.tracking_data.length > 0"
            :order="order"
          />
        </div>
      </div>
    </div>

    <!-- Key Modal (embedded codes only) -->
    <OrderKeyModal
      v-if="order"
      :visible="showModal"
      @close="showModal = false"
      :codes="resolvedCodes"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAsyncData, useRuntimeConfig } from '#app'
import { useUserStore } from '~/stores/userStore'
import { useOrdersStore } from '~/stores/ordersStore'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const config = useRuntimeConfig()
const userStore = useUserStore()
const ordersStore = useOrdersStore()

const showModal = ref(false)

const orderId = Number(route.params.id)

/* --------------------------------------------------
 * SSR-OWNED FETCH (NO PINIA DEPENDENCY)
 * -------------------------------------------------- */
const { data: order } = await useAsyncData(
  `order-${orderId}`,
  async () => {
    const res = await $fetch(
      `${config.public.apiBase}/users/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
          'Accept-language': 'en'
        }
      }
    )

    if (!res?.status) return null

    // Optional: keep Pinia in sync (NOT required for UI)
    ordersStore.setSelectedOrder(
      ordersStore._mapOrderDetails(res.data)
    )

    return ordersStore._mapOrderDetails(res.data)
  },
  {
    server: true
  }
)

/* --------------------------------------------------
 * Embedded codes (old Vue behavior)
 * -------------------------------------------------- */
const resolvedCodes = computed(() => {
  if (!order.value?.items) return []
  return order.value.items
    .filter(i => i.product_type === 2 && Array.isArray(i.codes_list))
    .flatMap(i =>
      i.codes_list.map(c => ({
        code: c.code,
        serial: c.serial_number || ''
      }))
    )
})

/* --------------------------------------------------
 * Actions
 * -------------------------------------------------- */
const goBack = () => {
  router.push('/orders')
}

const openKeyModal = () => {
  showModal.value = true
}
</script>

