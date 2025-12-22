<template>
  <div
    class="rounded-xl p-3 cursor-pointer group transition-all
           bg-bgLight border border-onOutline
           hover:border-primary hover:shadow-[0_0_12px_#FF6A16AA] hover:scale-[1.02]"
    @click="handleClick"
  >
    <!-- Flag Wrapper -->
    <div
      class="w-full h-32 sm:h-36 md:h-40 
             flex items-center justify-center 
             overflow-hidden"
    >
      <NuxtImg
        densities="x1"
        format="webp"
        loading="lazy"
        :src="country.flag"
        :alt="country.name"
        class="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
      />
    </div>

    <!-- Country Name -->
    <div
      class="font-semibold text-center mt-3 text-onPrimary 
             bg-primary py-2 rounded-md tracking-wide"
    >
      <h3
        class="uppercase 
               text-[10px] sm:text-xs md:text-sm lg:text-base 
               leading-tight px-1 break-words"
      >
        {{ country.name }}
      </h3>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  country: { type: Object, required: true }
})

const emit = defineEmits(['select'])

const handleClick = () => {
  emit('select', props.country.id)
}
</script>
