<template>
  <div class="bg-bgDark rounded-xl overflow-hidden shadow-md animate-pulse">
    <!-- Image Placeholder -->
    <div class="w-full h-52 relative skeleton-shimmer"></div>

    <!-- Content Placeholder -->
    <div class="p-5 flex flex-col gap-3">
      <div class="w-3/4 h-6 rounded skeleton-shimmer"></div>
      <div class="w-full h-4 rounded skeleton-shimmer"></div>
      <div class="w-5/6 h-4 rounded skeleton-shimmer"></div>

      <!-- Author Placeholder -->
      <div class="flex items-center gap-3 mt-4">
        <div class="w-8 h-8 rounded-full skeleton-shimmer"></div>
        <div class="flex flex-col gap-1">
          <div class="w-16 h-3 rounded skeleton-shimmer"></div>
          <div class="w-12 h-2 rounded skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  </div>
</template>