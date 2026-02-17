<template>
  <section
    class="flex flex-col xl:flex-row gap-10 font-poppins text-mainText p-6 md:p-10 rounded-2xl"
  >
    <!-- Product Image -->
    <div
      class="flex justify-center w-full md:w-[80%] xl:w-1/2 mx-auto transition-all duration-300"
    >
      <NuxtImg
        densities="x1"
        quality="80"
        loading="lazy"
        format="webp"
        :src="product.img"
        :alt="product.name"
        class="rounded-xl w-full max-w-[600px] object-cover shadow-lg"
      />
    </div>

    <!-- Product Info -->
    <div
      class="flex flex-col gap-4 justify-start w-full md:w-[85%] xl:flex-1 mx-auto transition-all duration-300"
    >
      <!-- Title + Rating -->
      <div>
        <h1 class="text-2xl mb-2">{{ product.name }}</h1>

        <div class="flex items-center gap-2 text-yellow-400">
          <template v-for="i in 5" :key="i">
            <Icon
              :name="i <= starCount ? 'mdi:star' : 'mdi:star-outline'"
            />
          </template>

          <span class="text-mainText flex text-lg ml-1 items-baseline">
            {{ product.reviews_count || 0 }}
            <p class="text-mainText text-md ml-1">{{ t('productReviewsLabel') }}</p>
          </span>
        </div>
      </div>

      <!-- Price + Discount -->
      <div class="flex items-center gap-3">
        <span class="text-2xl">
          {{ currencySymbol }}{{ product.final_price }}
        </span>

        <span
          v-if="product.old_price"
          class="line-through text-onMainText text-lg"
        >
          {{ currencySymbol }}{{ product.old_price }}
        </span>
      </div>

      <!-- Quantity -->
      <div class="flex items-center gap-4">
        <span class="text-md font-medium">{{ t('productQuantity') }}</span>

        <div class="flex items-center border border-onMainText rounded-lg overflow-hidden">
          <button
            @click="decreaseQty"
            class="px-5 py-2 hover:bg-outline"
          >
            -
          </button>

          <span
            class="px-8 py-2 bg-primary text-mainText border-r border-l border-onMainText"
          >
            {{ quantity }}
          </span>

          <button
            @click="increaseQty"
            class="px-5 py-2 hover:bg-outline"
          >
            +
          </button>
        </div>
      </div>

      <!-- Dropdowns (Regions + Languages from API) -->
      <div class="flex flex-col gap-2 mt-3">
        <h2
          class="text-xl"
          :class="isInStock(product) ? 'text-primary' : 'text-error'"
        >
          {{ stockLabel(product) }}
        </h2>

        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Language -->
          <div class="relative w-full">
            <select
              v-model="selected.language"
              class="appearance-none bg-[#282C32] border border-onOutline rounded-lg px-3 pr-10 py-3
                     text-md w-full cursor-pointer focus:outline-none text-mainText"
            >
              <option
                v-for="(lang, i) in product.languages"
                :key="i"
                :value="lang"
              >
                {{ lang }}
              </option>
            </select>

            <i
              class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2
                     text-mainText text-md pointer-events-none"
            ></i>
          </div>

          <!-- Region -->
          <div class="relative w-full">
            <select
              v-model="selected.region"
              class="appearance-none bg-[#282C32] border border-onOutline rounded-lg px-3 pr-10 py-3
                     text-md w-full cursor-pointer focus:outline-none text-mainText"
            >
              <option
                v-for="(r, i) in product.regions"
                :key="i"
                :value="r"
              >
                {{ r }}
              </option>
            </select>

            <i
              class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2
                     text-mainText text-md pointer-events-none"
            ></i>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 mt-5">
        <AppButton
          variant="primary"
          :height="45"
          full
          extraClass="text-md py-3 rounded-2xl flex-1"
          :disabled="!isInStock(product)"
          @click.stop.prevent="handleBuyNow"
        >
         {{ t('buyNow') }}
        </AppButton>

        <AppButton
          variant="outline"
          :height="45"
          full
          extraClass="text-md py-3 rounded-2xl flex-1"
          :disabled="!isInStock(product)"  
          @click.stop.prevent="handleAddToCart"
        >
          {{ isInStock(product) ? t('addToCart') : t('productOutOfStock') }}
        </AppButton>
      </div>

      <!-- Info Badges -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6
               border-2 bg-bgLight/70 border-onMainText py-4 px-4 rounded-lg text-center"
      >
        <div
          v-for="(info, i) in infoBadges"
          :key="i"
          class="flex flex-col sm:flex-row items-center justify-center gap-3 py-4
                 hover:bg-bgDark/60 transition-all duration-300 rounded-lg px-3 cursor-pointer"
        >
          <NuxtImg
            densities="x1"
            quality="80"
            loading="lazy"
            format="webp"
            :src="info.icon"
            :alt="info.label"
            class="w-10 h-10 object-contain flex-shrink-0"
          />

          <span class="flex flex-col items-center sm:items-start text-sm">
            <p class="text-lg font-medium text-mainText">
              {{ t(info.label) }}
            </p>
            <p class="text-sm font-medium text-onMainText">
              {{ info.value }}
            </p>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useCart } from '~/composables/useCart'
import { useStock } from '~/composables/useStock'
import { useToast } from '#imports'
import { useCurrencyStore } from '~/stores/currencyStore'

const currencyStore = useCurrencyStore()

const { addToCart, buyNow } = useCart()
const { isInStock, stockLabel } = useStock()
const { t } = useI18n()

const toast = useToast()


const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const quantity = ref(1)

const selected = ref({
  region: '',
  language: ''
})

const currencySymbol = computed(() =>
  currencyStore.selectedCurrency?.symbol || '$'
)

watchEffect(() => {
  if (props.product) {
    selected.value.region = props.product.regions?.[0] || ''
    selected.value.language = props.product.languages?.[0] || ''
  }
})

const MAX_QTY = 5

const increaseQty = () => {
   if (quantity.value >= MAX_QTY) {
    toast.error({
      title: 'Limit exceeded',
      message: 'The quantity may not be greater than 5.',
      position: 'topCenter',
      duration: 3000
    })
    return
  }
  quantity.value++
}


const handleBuyNow = () => {
  if (!isInStock(props.product)) {
    toast.error({
      title: 'Out of stock',
      message: 'This product is currently out of stock.',
      position: 'topCenter',
      duration: 3000
    })
    return
  }

  buyNow(props.product, quantity.value)
}

const handleAddToCart = () => {
  if (!isInStock(props.product)) {
    toast.error({
      title: 'Out of stock',
      message: 'This product is currently out of stock.',
      position: 'topCenter',
      duration: 3000
    })
    return
  }

  if (quantity.value > 5) {
    toast.error({
      title: 'Limit exceeded',
      message: 'The quantity may not be greater than 5.',
      position: 'topCenter',
      duration: 3000
    })
    return
  }

  addToCart(props.product, quantity.value)
}

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--
}

const starCount = computed(() =>
  Math.round((props.product.reviews_avg_rating || 0))
)

const infoBadges = computed(() => [
  {
    label: 'productPlatform',
    value: props.product.platform?.name || 'N/A',
    icon: '/games/OverviewPlatform.png'
  },
  {
    label: 'productRegion',
    value: selected.value.region || 'Global',
    icon: '/games/OverviewGlobal.png'
  },
  {
    label: 'productDelivery',
    value: props.product.delivery_time || 'Online',
    icon: '/games/OverviewOnline.png'
  }
])
</script>

<style scoped>
@media (max-width: 1200px) {
  section {
    flex-direction: column !important;
  }

  section > div:first-child {
    width: 90% !important;
  }

  section > div:nth-child(2) {
    width: 90% !important;
  }
}
</style>
