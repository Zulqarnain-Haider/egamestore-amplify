<template>
  <div class="relative group rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a1a1a]/60 to-[#000]/80 backdrop-blur-md 
  border border-white/10 shadow-lg hover:shadow-white/10 transition-all duration-300 cursor-pointer">
    <img :src="image" :alt="title" class="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out" />
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100"></div>
    <div class="absolute bottom-1 left-3 right-4 z-10 text-white">
      <h1 class="text-md font-semibold font-vazirmatn truncate">{{ title }}</h1>
      <span class="group flex items-center transition-transform duration-300 hover:scale-105">
      <h1 class="font-vazirmatn mr-2">
        {{ buttonText }}
    </h1>
        <img src="/games/TournamentCard.arrow.svg" alt="" class="transition-transform duration-300 group-hover:translate-x-1.5">
    </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  image: String,
  buttonText: { type: String, default: "Buy Now" },
});
</script>
