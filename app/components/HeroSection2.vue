<template>
  <section
    class="relative w-full max-w-7xl mx-auto overflow-hidden bg-cover bg-center bg-no-repeat text-white"
  >
    <!-- Dark overlay -->
    <!-- <div class="absolute inset-0 bg-black/40 z-0"></div> -->

    <!-- Content -->
    <div
      class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 px-3 pb-6 md:px-0 xl:pr-4 md:pt-6 md:pb-12 md lg:pl-12"
    >
      <!-- LEFT SECTION -->
      <div
        class="w-full lg:w-1/2 md:text-center lg:text-left order-2 lg:order-1 px-2 md:px-3 lg:px-"
      >
        <h1
          class="text-3xl sm:text-4xl lg:text-5xl font-bold font-poppins leading-tight mb-4 whitespace-nowrap text-primary"
        >
          Play Your Best Game  <br />
          <span class="text-mainText" >& Collect Epic Deals</span>
        </h1>

        <p
          class="text-mainText font-poppins text-base sm:text-lg max-w-lg mx-auto lg:mx-0 mb-6"
        >
       Discover limited-time discounts on top-selling games,
       gift cards, and bundles.
       New deals added every day — don't miss out! 
       </p>

        <div class="flex flex-wrap justify-center lg:justify-start gap-3">
          <AppButton
            to="/category/deals" 
            variant="primary"
            :width="0"
            :height="48"
            extraClass="px-6 md:px-7 py-3 text-xs font-poppins
            shadow-lg shadow-primary/40 hover:shadow-primary/60 rounded-2xl transition-all duration-300"
          >
            Browse Deals
          </AppButton>
          <AppButton
            to="/category/trending" 
            variant="outline"
            :width="0"
            :height="48"
            extraClass="px-6 md:px-7 py-3 text-xs font-poppins border-[2.5px] sm:border-[3px] 
            rounded-2xl "
          >
            View Games
          </AppButton>
        </div>
      </div>

      <!-- RIGHT SECTION -->
      <div
        class="hero-right w-full lg:w-1/2 flex justify-center items-center lg:items-end order-1 lg:order-2 ipad:order-1 lg:pr-8"
      >
         <NuxtImg
         densities="x1" quality="80" format="webp" preload
          src="/games/HeroSection2.Right.png"
          alt="Hero Section Right"
          class="w-[85%] sm:w-[75%] md:w-[70%] lg:w-[92%] xl:w-[100%] object-contain"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Mobile: hide right section completely */
@media (max-width: 640px) {
  .sm\:block,
  .sm\:grid {
    display: none !important;
  }
    .hero-right {
    display: none !important;
  }

}

/*iPad Mini: right section top, left bottom */
@media (min-width: 641px) and (max-width: 820px) {
  .ipad\:order-1 {
    order: 1 !important;
  }
  .order-2 {
    order: 2 !important;
  }
  h2 {
    text-align: center;
    margin-bottom: 10px;
  }
}

/*iPad Pro: adjust text & spacing */
@media (min-width: 1024px) and (max-width: 1180px) {
  h1 {
    font-size: 2.3rem !important;
  }
  h2 {
    font-size: 1rem !important;
  }
  p {
    font-size: 11px;
  }
  .gap-10 {
    gap: 1.5rem !important;
    padding-left: 50px;
  }
}
</style>
