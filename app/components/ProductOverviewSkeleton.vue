<template>
  <div class="w-[90%] max-w-7xl mx-auto flex flex-col gap-12 animate-fadeIn">

    <!-- =======================
         OVERVIEW SKELETON
         ======================= -->
    <section class="flex flex-col xl:flex-row gap-10 p-6 md:p-10">
      <!-- Image -->
      <div class="w-full xl:w-1/2 flex justify-center">
        <div class="skeleton rounded-xl w-full max-w-[600px] aspect-square" />
      </div>

      <!-- Info -->
      <div class="flex flex-col gap-5 w-full xl:flex-1">
        <div class="skeleton h-8 w-3/4 rounded"></div>

        <div class="flex gap-2">
          <div v-for="i in 5" :key="i" class="skeleton h-5 w-5 rounded-full" />
          <div class="skeleton h-4 w-24 rounded"></div>
        </div>

        <div class="flex gap-3">
          <div class="skeleton h-6 w-24 rounded"></div>
          <div class="skeleton h-5 w-20 rounded"></div>
        </div>

        <div class="flex gap-4 items-center">
          <div class="skeleton h-4 w-20 rounded"></div>
          <div class="flex gap-2">
            <div class="skeleton h-10 w-12 rounded"></div>
            <div class="skeleton h-10 w-16 rounded"></div>
            <div class="skeleton h-10 w-12 rounded"></div>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="skeleton h-12 flex-1 rounded-2xl"></div>
          <div class="skeleton h-12 flex-1 rounded-2xl"></div>
        </div>
      </div>
    </section>

    <!-- =======================
         HIGHLIGHTS SKELETON
         ======================= -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 3"
        :key="i"
        class="flex items-center gap-4 p-6 rounded-xl border border-onMainText/30"
      >
        <div class="skeleton h-14 w-14 rounded-full"></div>
        <div class="flex flex-col gap-2">
          <div class="skeleton h-5 w-28 rounded"></div>
          <div class="skeleton h-4 w-40 rounded"></div>
        </div>
      </div>
    </section>

    <!-- =======================
         TABS SKELETON
         ======================= -->
    <section>
      <div class="flex gap-6 border-b mb-6">
        <div v-for="i in 4" :key="i" class="skeleton h-6 w-24 rounded"></div>
      </div>

      <div class="skeleton h-32 w-full rounded-lg"></div>
    </section>

    <!-- =======================
         RELATED PRODUCTS
         ======================= -->
    <section>
      <div class="skeleton h-7 w-48 mb-4 rounded"></div>

      <div class="flex gap-5 overflow-x-hidden">
        <div
          v-for="i in 4"
          :key="i"
          class="min-w-[260px] p-4 rounded-lg border border-outline"
        >
          <div class="skeleton h-44 rounded-lg mb-4"></div>
          <div class="skeleton h-4 w-3/4 mb-2 rounded"></div>
          <div class="skeleton h-4 w-1/2 rounded"></div>
        </div>
      </div>
    </section>

    <!-- =======================
         REVIEWS
         ======================= -->
    <section>
      <div class="skeleton h-7 w-40 mb-6 rounded"></div>

      <div v-for="i in 3" :key="i" class="flex gap-4 mb-6">
        <div class="skeleton h-10 w-10 rounded-full"></div>
        <div class="flex-1">
          <div class="skeleton h-4 w-32 mb-2 rounded"></div>
          <div class="skeleton h-3 w-full mb-1 rounded"></div>
          <div class="skeleton h-3 w-5/6 rounded"></div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
// Full-page skeleton
// No props, no logic, SSR-safe
</script>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    #2a2e35 25%,
    #3a3f45 37%,
    #2a2e35 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
</style>
