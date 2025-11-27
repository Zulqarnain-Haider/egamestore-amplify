<template>
  <section class="mt-16 text-white w-full">

    <!-- Desktop / Tablet Layout -->
    <div class="hidden sm:flex flex-col lg:flex-row gap-6">
      <!-- LEFT COLUMN -->
      <div class="flex-1 flex flex-col gap-4" data-aos="fade-right">
        <!-- Large top -->
        <div
          class="relative rounded-xl overflow-hidden h-[220px] sm:h-[230px] cursor-pointer hover:scale-105 hover:-anslate-y-2 transition-transform duration-300">
          <NuxtImg :src="cats[0].image" :alt="cats[0].title" format="webp" quality="75" densities="x1 x2" loading="lazy"
            class="absolute inset-0 w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black/40 z-0"></div>

          <div class="absolute inset-x-0 bottom-2 bg-gradient-to-t from-black/60 to-transparent p-3">
            <span class="text-lg font-semibold font-poppins">{{ cats[0].title }}</span>
          </div>
        </div>

        <!-- Two small below -->
        <div class="flex flex-col sm:flex-row gap-4">
          <div v-for="(c, i) in cats.slice(1, 3)" :key="i"
            class="relative flex-1 rounded-xl overflow-hidden h-[180px] sm:h-[230px] cursor-pointer hover:scale-105 hover:-anslate-y-2 transition-transform duration-300">
            <NuxtImg :src="c.image" :alt="c.title" class="absolute inset-0 w-full h-full object-cover" format="webp"
              densities="x1 x2" quality="75" loading="lazy" />
            <div class="absolute inset-0 bg-black/40 z-0"></div>

            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <span class="text-base font-semibold font-poppins">{{ c.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="flex-1 flex flex-col gap-4 cursor-pointer" data-aos="fade-left">
        <!-- Two small on top -->
        <div class="flex flex-col sm:flex-row gap-4">
          <div v-for="(c, i) in cats.slice(3, 5)" :key="i"
            class="relative flex-1 rounded-xl overflow-hidden h-[180px] sm:h-[230px] cursor-pointer hover:scale-105 hover:-translate-y-2 transition-transform duration-300">
            <NuxtImg :src="c.image" :alt="c.title" class="absolute inset-0 w-full h-full object-cover" format="webp"
              densities="x1 x2" quality="75" loading="lazy" />
            <div class="absolute inset-0 bg-black/40 z-0"></div>

            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <span class="text-base font-semibold font-poppins">{{ c.title }}</span>
            </div>
          </div>
        </div>

        <!-- Large bottom -->
        <div
          class="relative rounded-xl overflow-hidden h-[220px] sm:h-[230px] cursor-pointer hover:scale-105 hover:-translate-y-2 transition-transform duration-300">
          <NuxtImg :src="cats[5].image" :alt="cats[5].title" class="absolute inset-0 w-full h-full object-cover"
            format="webp" densities="x1 x2" quality="75" loading="lazy" />
          <div class="absolute inset-0 bg-black/40 z-0"></div>
          <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <span class="text-lg font-semibold font-poppins">{{ cats[5].title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Horizontal Scroll Layout -->
    <div class="sm:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory 
      scrollbar-hide px-2 py-2 scroll-smooth cursor-pointer" data-aos="fade-up">
      <div v-for="(c, i) in [...cats.slice(1), cats[0]]" :key="i" class="relative min-w-[63%] rounded-xl overflow-hidden h-[130px] 
        snap-start flex-shrink-0 shadow-md">
        <NuxtImg :src="c.image" :alt="c.title"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          format="webp" densities="x1 x2" quality="75" loading="lazy" />
        <div class="absolute inset-0 bg-black/40 z-0"></div>

        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <span class="text-base font-poppins">{{ c.title }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const cats = [
  { title: 'Sports & Racing', image: '/games/Categories6.png' },
  { title: 'Strategy', image: '/games/Categories3.jpg' },
  { title: 'Survival', image: '/games/Categories2.jpg' },
  { title: 'RPG', image: '/games/Categories5.png' },
  { title: 'Adventure', image: '/games/Categories4.png' },
  { title: 'Action', image: '/games/Categories1.jpg' },


]
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Mobile responsive fine-tuning */
@media (max-width: 640px) {
  section {
    width: 100%;
  }

  /* smooth scrolling effect */
  .scroll-smooth {
    scroll-behavior: smooth;
  }

  /* slightly reduce image height on small phones */
  .h-\[130px\] {
    height: 120px !important;
  }

  span {
    font-size: smaller;
  }
}
</style>
