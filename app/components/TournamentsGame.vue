<template>
  <section class="relative w-full text-white overflow-hidden">
    <div class="max-w-7xl mx-auto  relative  sm:px-6 lg:px-8">
      <!-- Background Image -->
      <!-- Background Image – Desktop -->
<NuxtImg
  src="/games/Tournaments.New.bg.png"
  densities="x1"
  quality="80"
  format="webp"
  preload
  alt="tournament-bg-desktop"
  class="absolute inset-0 w-full h-[90%] object-cover opacity-[10%] hidden md:block"
/>

<!-- Background Image – Mobile -->
<NuxtImg
  src="/games/tournamentsBgMobile.jpg"
  densities="x1"
  quality="80"
  format="webp"
  preload
  alt="tournament-bg-mobile"
  class="absolute inset-0 w-full h-[90%] object-cover opacity-[10%] flex sm:hidden"
/>
      <!-- Heading -->
      <div class="relative z-10 flex flex-col items-center py-16 sm:py-20 text-center">
        <h2 class="text-2xl md:text-4xl font-extrabold mb-10 font-poppins uppercase tracking-wide">
          <span class="text-primary">{{ t('join') }}</span> {{ t('theBigTournament') }}
        </h2>
      </div>

      <!-- Carousel -->
      <div class="relative w-full pl-20 md:pl-0 md:pr-0 sm:pr-20">
        <Swiper :modules="[Autoplay, Navigation]" :loop="true" :autoplay="{ delay: 3500, disableOnInteraction: false }"
          :navigation="{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom'
          }" :breakpoints="{
        320: { slidesPerView: 2, spaceBetween: 8 },   // Mobile → 2 cards
        640: { slidesPerView: 3, spaceBetween: 12 },
        768: { slidesPerView: 4, spaceBetween: 14 },
        1024: { slidesPerView: 5, spaceBetween: 20 },
        1280: { slidesPerView: 6, spaceBetween: 18 }
      }" class="tournament-swiper relative">
          <SwiperSlide v-for="(game, i) in games" :key="i">
            <div class="flex justify-center">
              <GameFilter :title="game.title" :image="game.image" :buttonText="game.button"
                class="w-[160px] sm:w-[160px] md:w-[180px] lg:w-[200px]" />
            </div>
          </SwiperSlide>
        </Swiper>

        <!-- Left Arrow -->
        <button class="swiper-button-prev-custom absolute top-1/3 left-4 lg:left-2 xl:-left-14 bg-black/40 hover:bg-primary/70 p-1 z-30 hidden sm:flex">
     <Icon name="heroicons:chevron-left" class="w-12 h-12" />
        </button>

        <!-- Right Arrow (hidden on mobile) -->
        <button class="swiper-button-next-custom absolute top-1/3 right-0 md:-right-2 lg:-right-5
             bg-black/20 hover:bg-primary/70 p-1 z-30 hidden sm:flex">
     <Icon name="heroicons:chevron-right" class="w-12 h-12" />
        </button>
      </div>


      <!--Final Responsive Battle Section -->
      <div class="relative w-full mt-16 md:mt-20 flex justify- items-center text-center 
         py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <!-- Default Background Vector -->
        <NuxtImg 
        densities="x1" quality="80" format="webp" preload 
        src="/games/BigTournamentVector.png" alt="vector"
          class="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none select-none hidden sm:block" />

        <!--Mobile Background Vector -->
        <NuxtImg 
         densities="x1" quality="80" format="webp" preload
        src="/games/BigTournamentVectorMobile.png" alt="vector mobile"
          class="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none select-none block sm:hidden" />

        <!-- Center Content -->
        <div class="relative z-20 flex flex-col mt-9 sm:mt-7 -ml-16 sm:ml-[20%] md:ml-[20%] lg:ml-[28%] xl:ml-[30%] 2xl:ml-[32%] items-center justify-start text-center 
           transition-all duration-500 scale-50 sm:scale-50 md:scale-50 lg:scale-75 xl:scale-90">
          <h3 class="font-poppins font-extrabold mb-3 sm:mb-4 md:mb-5 text-white 
             text-[1.2rem] sm:text-[1.6rem] md:text-[2rem] lg:text-[2.4rem] leading-tight">
            {{ t('readyFor') }}<span class="text-primary">{{ t('battles') }}</span>?
          </h3>
          <!-- Pyramid Style Text -->
          <div class="flex flex-col items-center  text-white font-poppins leading-relaxed space-y-1">
            <p class="text-[0.95rem] sm:text-[1rem] md:text-[1.1rem] max-w-sm sm:max-w-sm md:max-w-md mx-auto">
              {{ t('tournamentDescLine1') }}
            </p>
            <p class="text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] max-w-sm sm:max-w-sm mx-auto opacity-90">
              {{ t('tournamentDescLine2') }}
            </p>
            <p class="text-[0.85rem] sm:text-[0.9rem] md:text-[0.95rem] max-w-[70%] mx-auto opacity-80">
              {{ t('tournamentDescLine3') }}
            </p>
          </div>


          <AppButton variant="primary" :width="0" :height="42" extraClass="px-5 sm:px-7 md:px-8 py-2 mt-2 text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1.1rem]
                 font-poppins rounded-3xl shadow-lg shadow-primary/40 hover:shadow-primary/60 
                 transition-all duration-300">
            {{ t('joinNow') }}
          </AppButton>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, Navigation } from "swiper/modules"

const { t } = useI18n()

const games = [
  { title: "League of Legends", image: "/games/TournamentCard.1.png", button: "Buy Now" },
  { title: "Apex Legends", image: "/games/TournamentCard.2.png", button: "Buy Now" },
  { title: "Counter Strike", image: "/games/TournamentCard.3.png", button: "Buy Now" },
  { title: "World of Warcraft", image: "/games/TournamentCard.4.png", button: "Buy Now" },
  { title: "Dota 2", image: "/games/TournamentCard.5.png", button: "Buy Now" },
  { title: "Fortnite", image: "/games/TournamentCard.6.png", button: "Buy Now" },
  { title: "League of Legends", image: "/games/TournamentCard.1.png", button: "Buy Now" },
  { title: "Apex Legends", image: "/games/TournamentCard.2.png", button: "Buy Now" },
  { title: "Counter Strike", image: "/games/TournamentCard.3.png", button: "Buy Now" },
  { title: "World of Warcraft", image: "/games/TournamentCard.4.png", button: "Buy Now" },
  { title: "Dota 2", image: "/games/TournamentCard.5.png", button: "Buy Now" },
  { title: "Fortnite", image: "/games/TournamentCard.6.png", button: "Buy Now" },
]
</script>

<style scoped>
section::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  /* background: linear-gradient(to top, #000, transparent); */
}

/* Arrows hover effect */
.swiper-button-prev-custom:hover,
.swiper-button-next-custom:hover {
  transform: scale(1.1);
  transition: 0.3s ease;
}

/* Mobile fix: Only left arrow visible */
@media (max-width: 640px) {
  .swiper-button-prev-custom {
    display: flex !important;
  }

  .swiper-button-next-custom {
    display: none !important;
  }

  /* Mobile par layout center me perfectly ho */
  .battle-section-content {
    margin-left: 0 !important;
    transform: scale(0.9);
  }

}


/* Swiper cursor */
.tournament-swiper {
  cursor: grab;
}

.tournament-swiper:active {
  cursor: grabbing;
}

/* Responsive text adjustments */
@media (min-width: 768px) and (max-width: 1024px) {
  h2 {
    font-size: 1.8rem !important;
  }

  h3 {
    font-size: 2rem !important;
  }

  p {
    font-size: 0.95rem !important;
  }
}
</style>
