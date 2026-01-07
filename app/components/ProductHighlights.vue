<template>
  <section class="w-full animate-fadeIn">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[100%] mx-auto"
    >
      <!-- Single Card -->
      <div
        v-for="(item, i) in highlights"
        :key="i"
        class="relative rounded-2xl p-8 font-poppins flex items-center gap-4 shadow-md hover:scale-[1.02] transition-all duration-300"
      >
        <!--Gradient Border Effect -->
        <div class="absolute inset-0 rounded-2xl p-[1px]">
          <div
            class="absolute inset-0 rounded-2xl bg-gradient-to-tl from-[#a09a9a0d] via-[#6b67670d] to-[#fdab7e] opacity-60"
          ></div>
          <div class="absolute inset-[2px] bg-[#282C32] rounded-2xl"></div>
        </div>

        <!--Left Image -->
        <div class="relative z-10 flex-shrink-0">
          <NuxtImg 
          densities="x1" quality="80" loading="lazy"
            :src="item.icon"
            alt="icon"
            class="object-contain w-16 h-16"
          />
        </div>

        <!--Text -->
        <div class="relative z-10 flex flex-col justify-center">
          <h3 class="text-md font-semibold text-white">
            {{ t(item.title) }}
          </h3>
          <p class="text-sm text-onMainText">
            {{ t(item.description) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n();

defineProps({
  highlights: {
    type: Array,
    default: () => [     
      {
        title: 'highlightSupportTitle',
        description: 'highlightSupportDesc',
        icon: '/games/24Hours.png',
      },
       {
        title: 'highlightDeliveryTitle',
        description: 'highlightDeliveryDesc',
        icon: '/games/FastDelivery.png',
      }, 
     {
        title: 'highlightSecureTitle',
        description: 'highlightSecureDesc',
        icon: '/games/SecureShopping.png',
      },
    ],
  },
})
</script>

<style scoped>
/* Gradient Border Trick */

</style>
