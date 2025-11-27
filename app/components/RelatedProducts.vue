<template>
  <section class="p-2 md:p-0 text-white">
    <h2 class="text-xl md:text-2xl font-semibold mb-4">Related Items</h2>

    <!--Scrollable Wrapper -->
    <div
      ref="slider"
      class="flex gap-5 px-3 md:px-0  py-3 overflow-x-auto scroll-smooth scrollbar-hide"
    >
      <!-- Dummy cards for Ui -->
      <RelatedItemCard
        v-for="i in 12"
        :key="i"
        title="Minecraft Java Edition"
        price="1249.99"
        rating="85"
        class="min-w-[85%] sm:min-w-[48%] md:min-w-[45%] lg:min-w-[30%]"
      />
    </div>
  </section>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
