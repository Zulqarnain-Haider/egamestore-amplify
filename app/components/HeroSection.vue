<template>
  <section class="relative w-full overflow-hidden">
    <!-- Background Image (Covers full width of screen) -->
    <NuxtImg 
      src="/games/Hero.bg.png" 
      alt="Hero Background" 
      format="webp" 
      quality="75"
      densities="x1 x2"
      loading="eager"
      fetchpriority="high"
      class="absolute inset-0 w-full h-full object-cover" 
    />

    <!-- Content (Must be within max 1280px width and centered) -->
    <div
      class="relative z-10 flex flex-col max-w-7xl mx-auto lg:flex-row items-center justify-between gap-10 px-4 sm:px-6 lg:px-0 pb-6 md:pt-6 md:pb-20">
      
      <!-- LEFT SECTION (Visible on all screen sizes) -->
      <div class="w-full lg:w-1/2 md:text-center lg:text-left order-2 lg:order-1 px-2 md:px-3 lg:px-0">
        <h1
          class="text-3xl sm:text-4xl lg:text-4xl font-bold font-poppins leading-tight mb-4 whitespace-nowrap text-primary">
          {{ t('heroTitleOne') }} <br />
          <span class="text-mainText">{{ t('heroTitleTwo') }}</span>
        </h1>

        <p class="text-mainText font-poppins text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-6">
          {{ t('heroSubtitle') }}
        </p>

        <div class="flex flex-wrap justify-center lg:justify-start gap-3">
          <AppButton 
            to="/games?type=deals" 
            variant="primary" 
            :width="0" 
            :height="48"
            extraClass="px-6 md:px-7 py-3 text-xs font-poppins rounded-2xl shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300">
            {{ t('browseDeals') }}
          </AppButton>
          <AppButton 
            to="/games?type=latest" 
            variant="outline" 
            :width="0" 
            :height="48"
            extraClass="px-6 md:px-7 py-3 text-xs font-poppins border-[2.5px] sm:border-[3px] rounded-2xl">
            {{ t('viewGames') }}
          </AppButton>
        </div>
      </div>

      <!-- RIGHT SECTION (Hidden on mobile screen) -->
      <div class="w-full lg:w-1/2 flex flex-col items-center lg:items-start order-1 lg:order-2 ipad:order-1">
        <!-- Heading -->
        <h2
          class="hidden sm:block sm:text-2xl lg:text-xl whitespace-nowrap font-poppins font-semibold mb-3 text-center lg:text-left lg:pr-10">
          {{ t('theMost') }}<span class="text-primary">{{ t('popular') }}</span> {{ t('games') }}
        </h2>

        <!-- Grid -->
        <div class="hidden sm:grid grid-cols-4 gap-3 w-full max-w-2xl lg:pr-10 relative">

          <!-- Large Thumbnail -->
          <div
            class="relative h-[240px] lg:h-[245px] rounded-lg overflow-hidden border border-outline col-span-1 self-start">
            <NuxtImg 
              src="/games/Witcher.First.Thumbnail1.jpg" 
              alt="The Witcher 3" 
              height="240"
              quality="75"
              format="webp"
              loading="eager"
              class="w-full h-full object-cover"
            />

            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left">
              <p class="text-sm font-semibold font-poppins whitespace-nowrap">The Witcher 3</p>
            </div>
          </div>

          <!-- Smaller Thumbnails -->
          <div 
            v-for="(g, i) in thumbnails" 
            :key="i"
            class="relative h-[200px] lg:h-[220px] rounded-lg overflow-hidden self-end">
            <NuxtImg 
              :src="g.image" 
              :alt="g.title || `Game thumbnail ${i + 1}`"
              height="200"
              quality="75"
              format="webp"
              loading="lazy"
              class="w-full h-full object-cover"
            />

            <!-- Title Gradient -->
            <div v-if="i < 2 && g.title" class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p class="text-xs sm:text-sm font-semibold">{{ g.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n()

const thumbnails = [
  { title: '', image: '/games/Hero.Thumbnail.2.png' },
  { title: '', image: '/games/Hero.Thumbnail.3.png' },
  { title: '', image: '/games/Hero.Thumbnail.4.png' },
]
</script>

<style scoped>
/* Mobile: hide right section completely */
@media (max-width: 640px) {
  .sm\:block,
  .sm\:grid {
    display: none !important;
  }
}

/* iPad Mini: right section top, left bottom */
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

/* iPad Pro: adjust text & spacing */
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