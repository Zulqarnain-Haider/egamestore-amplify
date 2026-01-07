<template>
  <section>
    <!-- Tabs Header -->
    <div class="flex flex-wrap gap-4 md:gap-6 border-b px-3 border-onMainText mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="pb-2 text-sm md:text-base font-medium transition-all duration-300"
        :class="[
          activeTab === tab.key
            ? 'text-primary font-semibold'
            : 'text-mainText hover:text-primary'
        ]"
      >
        {{ t(tab.label) }}
      </button>
    </div>

    <!-- System Requirements (API ONLY) -->
    <div
      v-if="activeTab === 'system'"
      class="text-mainText text-md md:text-base border rounded-lg
             border-onFooter bg-[#282C32] p-4 mx-2 leading-relaxed"
    >
      <div
        v-if="product?.system_requirement"
        v-html="product.system_requirement"
      />
      <p v-else class="text-onMainText italic">
        {{ t('productNoSystemRequirements') }}
      </p>
    </div>

    <!-- Description (API ONLY) -->
    <div
      v-else-if="activeTab === 'description'"
      class="text-mainText text-md md:text-base border rounded-lg
             border-onFooter bg-[#282C32] p-4 mx-2 leading-relaxed"
    >
      <div
        v-if="product?.desc"
        v-html="product.desc"
      />
      <p v-else class="text-onMainText italic">
        {{ t('productNoDescription') }}
      </p>
    </div>

    <!-- Reviews -->
    <div v-else-if="activeTab === 'reviews'" class="mx-2">
      <ProductReviews
        :product="product"
        :reviews="product?.reviews || []"
      />
    </div>

    <!-- Support (API ONLY – future ready) -->
    <div
      v-else-if="activeTab === 'support'"
      class="text-mainText text-sm md:text-base border rounded-lg
             border-onFooter bg-[#282C32] p-4 mx-2 leading-relaxed"
    >
      <div
        v-if="product?.support"
        v-html="product.support"
      />
      <p v-else class="text-onMainText italic">
        {{ t('productNoSupport') }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProductReviews from '~/components/ProductReviews.vue'

const { t } = useI18n()

defineProps({
  product: {
    type: Object,
    default: () => ({})
  },
  currentUser: Object
})

const tabs = [
  { key: 'system', label: 'productTabSystemRequirements' },
  { key: 'description', label: 'productTabDescription' },
  { key: 'reviews', label: 'productTabReviews' },
  { key: 'support', label: 'productTabSupport' }
]

const activeTab = ref('description')
</script>
