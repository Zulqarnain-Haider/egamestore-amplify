<template>
  <div
    class="relative bg-surface border border-outline rounded-xl p-3 sm:p-4 md:p-5 shadow-md 
           hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full cursor-pointer"
    @click="handleClick"
  >
    <!-- Image -->
    <div class="relative mb-2 md:mb-1 xl:mb-3">
      <NuxtImg
        densities="x1"
        quality="80"
        format="webp"
        loading="lazy"
        :src="product.image"
        :alt="product.title"
        class="w-full h-[180px] sm:h-[180px] md:h-[180px] lg:h-[190px] xl:h-[230px]
               object-cover rounded-lg"
      />
    </div>

    <!-- Title -->
    <h3 class="font-semibold text-xs md:text-sm text-mainText truncate">
      {{ product.title }}
    </h3>

    <!-- Price -->
    <div class="flex items-center gap-2 mt-2">
      <span class="line-through text-onMainText text-xs">
        {{ product.oldPrice }}$
      </span>
      <span class="text-mainText text-sm">
        {{ product.price }}$
      </span>
    </div>

    <!-- CTA -->
    <div class="flex justify-between items-center mt-3 text-xs">
      <div class="flex items-center gap-2 text-onMainText">
        <Icon name="material-symbols:calendar-month" class="w-4 h-4" />
        {{ product.releaseDate }}
      </div>

      <button
        class="flex items-center gap-1 hover:scale-105 transition"
        @click.stop.prevent="handleClick"
      >
        <span>{{ t('preOrder') }}</span>
        <Icon name="heroicons:arrow-long-right" class="w-4 h-4 text-orange-500" />
      </button>
    </div>
  </div>
</template>

<script setup>
const toast = useToast()
const { t } = useI18n()

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const handleClick = () => {
  toast.info({
    title: t('comingSoonTitle'),
    message: t('comingSoonMessage'),
    position: 'topCenter',
    duration: 2500
  })
}
</script>
