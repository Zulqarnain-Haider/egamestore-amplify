<template>
  <section>
    <!-- Tabs Header -->
    <div class="flex flex-wrap gap-4 md:gap-6 border-b px-3 border-onMainText mb-6">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        class="pb-2 text-sm md:text-base font-medium transition-all duration-300"
        :class="[
          activeTab === tab
            ? 'text-primary font-semibold'
            : 'text-mainText hover:text-primary'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- System Requirements (API ONLY) -->
    <div
      v-if="activeTab === 'System Requirements'"
      class="text-mainText text-md md:text-base border rounded-lg
             border-onFooter bg-[#282C32] p-4 mx-2 leading-relaxed"
    >
      <div
        v-if="product?.system_requirement"
        v-html="product.system_requirement"
      />
      <p v-else class="text-onMainText italic">
        No system requirements provided.
      </p>
    </div>

    <!-- Description (API ONLY) -->
    <div
      v-else-if="activeTab === 'Description'"
      class="text-mainText text-md md:text-base border rounded-lg
             border-onFooter bg-[#282C32] p-4 mx-2 leading-relaxed"
    >
      <div
        v-if="product?.desc"
        v-html="product.desc"
      />
      <p v-else class="text-onMainText italic">
        No description available.
      </p>
    </div>

    <!-- Reviews -->
    <div v-else-if="activeTab === 'Reviews'" class="mx-2">
      <ProductReviews
        :product="product"
        :reviews="product?.reviews || []"
      />
    </div>

    <!-- Support (API ONLY – future ready) -->
    <div
      v-else-if="activeTab === 'Support'"
      class="text-mainText text-sm md:text-base border rounded-lg
             border-onFooter bg-[#282C32] p-4 mx-2 leading-relaxed"
    >
      <div
        v-if="product?.support"
        v-html="product.support"
      />
      <p v-else class="text-onMainText italic">
        Support information not available.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ProductReviews from '~/components/ProductReviews.vue'

defineProps({
  product: {
    type: Object,
    default: () => ({})
  },
  currentUser: Object
})

const tabs = ['System Requirements', 'Description', 'Reviews', 'Support']
const activeTab = ref('Description')
</script>
