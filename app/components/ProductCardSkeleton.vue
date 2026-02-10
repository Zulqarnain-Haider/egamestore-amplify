<template>
  <div class="relative border border-onOutline rounded-xl p-3 sm:p-4 md:p-5 shadow-md 
    hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full skeleton-shimmer">
    
    <!-- Skeleton for Game Image -->
    <div class="relative mb-2 md:mb-1 xl:mb-3">
      <div class="w-full h-[180px] sm:h-[180px] md:h-[180px] lg:h-[190px] xl:h-[230px] bg-gray-300 rounded-lg"></div>
      <!-- Skeleton for Discount Badge -->
      <div class="absolute top-0 left-0 bg-gray-300 text-xs md:text-sm px-2 py-1 rounded-lg w-12 h-6"></div>
    </div>

    <!-- Skeleton for Title + Stars -->
    <div class="flex items-center justify-between">
      <div class="bg-gray-300 rounded h-4 w-3/4"></div> <!-- Title placeholder -->
      <div class="flex gap-1">
        <!-- Stars placeholders (5 small gray circles) -->
        <div v-for="n in 5" :key="n" class="bg-gray-300 rounded-full h-3 w-3 md:w-4 md:h-4"></div>
      </div>
    </div>

    <!-- Skeleton for Price + Rating -->
    <div class="flex items-center justify-between mt-2 md:mt-1 xl:mt-2">
      <div class="flex items-end gap-1 md:gap-1 xl:gap-2">
        <div class="bg-gray-300 rounded w-2 h-8 sm:h-3 sm:w-7"></div> <!-- Old Price -->
        <div class="bg-gray-300 rounded w-3 h-10 sm:h-4 sm:w-7"></div> <!-- New Price -->
      </div>
      <div class="flex items-center gap-1">
        <div class="bg-gray-300 rounded-full w-3 h-3 sm:w-5 sm:h-5"></div> <!-- Rating Icon -->
        <div class="bg-gray-300 rounded  w-6 h-3 sm:h-4 sm:w-7"></div> <!-- Rating Text -->
        <div class="bg-gray-300 rounded h-2 w-4 sm:h-3 sm:w-5"></div> <!-- /100 -->
      </div>
    </div>

    <!-- Skeleton for Buttons -->
    <div class="flex gap-2 mt-3 md:mt-1 xl:mt-3">
      <div class="flex-1 bg-gray-300 rounded-xl h-9"></div> <!-- Add to Cart Button -->
      <div class="flex-1 bg-gray-300 rounded-xl h-9"></div> <!-- Buy Now Button -->
    </div>
  </div>
</template>

<script setup>
// Yeh component koi props nahi leta, sirf static skeleton hai.
// Agar responsive heights change karne ho, to props add kar sakte ho, lekin abhi simple rakha hai.
</script>


<style scoped>
/* Instagram-style Shimmer Animation: Light-weight, moving gradient */
/* .skeleton-shimmer {
  background: linear-gradient(90deg, #bbbaba 25%, #bbbaba 50%, #aca9a9 50%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
} */
</style>