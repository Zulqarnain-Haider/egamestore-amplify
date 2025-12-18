<template>
  <section class="flex flex-col xl:flex-row gap-10 font-poppins text-mainText p-6 md:p-10 rounded-2xl">
    <!-- Skeleton for Product Image -->
    <div class="flex justify-center w-full md:w-[80%] xl:w-1/2 mx-auto transition-all duration-300">
      <div class="rounded-xl w-full max-w-[600px] h-[600px] bg-gray-200 skeleton-shimmer"></div> <!-- Image placeholder -->
    </div>

    <!-- Skeleton for Product Info -->
    <div class="flex flex-col gap-4 justify-start w-full md:w-[85%] xl:flex-1 mx-auto transition-all duration-300">
      <!-- Skeleton for Title + Rating -->
      <div>
        <div class="bg-gray-200 rounded h-8 w-3/4 mb-2 skeleton-shimmer"></div> <!-- Title placeholder -->
        <div class="flex items-center gap-2">
          <div class="flex gap-1">
            <!-- Stars placeholders (5 gray circles) -->
            <div v-for="n in 5" :key="n" class="bg-gray-200 rounded-full h-5 w-5 skeleton-shimmer"></div>
          </div>
          <div class="bg-gray-200 rounded h-4 w-20 skeleton-shimmer"></div> <!-- Reviews placeholder -->
        </div>
      </div>

      <!-- Skeleton for Price + Discount -->
      <div class="flex items-center gap-3">
        <div class="bg-gray-200 rounded h-6 w-24 skeleton-shimmer"></div> <!-- Price -->
        <div class="bg-gray-200 rounded h-5 w-20 skeleton-shimmer"></div> <!-- Old Price -->
      </div>

      <!-- Skeleton for Quantity -->
      <div class="flex items-center gap-4">
        <div class="bg-gray-200 rounded h-4 w-16 skeleton-shimmer"></div> <!-- Quantity label -->
        <div class="flex items-center border border-onMainText rounded-lg overflow-hidden">
          <div class="bg-gray-200 rounded h-10 w-12 skeleton-shimmer"></div> <!-- Decrease button -->
          <div class="bg-gray-200 rounded h-10 w-16 skeleton-shimmer"></div> <!-- Quantity number -->
          <div class="bg-gray-200 rounded h-10 w-12 skeleton-shimmer"></div> <!-- Increase button -->
        </div>
      </div>

      <!-- Skeleton for Dropdowns -->
      <div class="flex flex-col gap-2 mt-3">
        <div class="bg-gray-200 rounded h-6 w-20 skeleton-shimmer"></div> <!-- In Stock label -->
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Platform Dropdown -->
          <div class="bg-gray-200 rounded-lg h-12 w-full skeleton-shimmer"></div>
          <!-- Region Dropdown -->
          <div class="bg-gray-200 rounded-lg h-12 w-full skeleton-shimmer"></div>
        </div>
      </div>

      <!-- Skeleton for Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 mt-5">
        <div class="bg-gray-200 rounded-2xl h-12 flex-1 skeleton-shimmer"></div> <!-- Buy Now -->
        <div class="bg-gray-200 rounded-2xl h-12 flex-1 skeleton-shimmer"></div> <!-- Add to Cart -->
      </div>

      <!-- Skeleton for Info Badges -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 border-2 bg-bgLight/70 border-onMainText py-4 px-4 rounded-lg text-center">
        <div v-for="n in 3" :key="n" class="flex flex-col sm:flex-row items-center justify-center gap-3 py-4 rounded-lg px-3">
          <div class="bg-gray-200 rounded-full w-10 h-10 skeleton-shimmer"></div> <!-- Icon -->
          <div class="flex flex-col items-center sm:items-start">
            <div class="bg-gray-200 rounded h-5 w-16 skeleton-shimmer"></div> <!-- Label -->
            <div class="bg-gray-200 rounded h-4 w-12 skeleton-shimmer"></div> <!-- Value -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Yeh component koi props nahi leta, sirf static skeleton hai.
</script>

<style scoped>
/* Same shimmer animation as GameCardSkeleton */
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

/* Force iPad (Pro + Mini) to behave like mobile - same as original */
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