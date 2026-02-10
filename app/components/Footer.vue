<template>
  <footer class="bg-surface text-onFooter px-6 py-10" style="background-image: url('/games/Footer.background.newer.jpeg'); background-size: cover; background-repeat: no-repeat;">
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-7 
     lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-10">
      
      <!-- About -->
      <div class="space-y-3 sm:col-span-2 md:col-span-3 lg:col-span-1">
         <NuxtImg 
         densities="x1" quality="80" preload
          src="/games/EGAMESTORE-logo.png" alt="" class="h-[45px] w-auto mb-6 md:mb-4" />
        <p class="text-lg">
          {{ t('footerAboutText') }}
        </p>
        <ul class="space-x-12 md:space-x-14 md:pl-8 px-4 flex">
        <li v-if="settings.facebook_link">
          <a :href="settings.facebook_link" target="_blank"><Icon name="mdi:facebook" class="w-8 h-8 sm:w-12 sm:h-12 bg-blue-700"/></a></li>

        <li v-if="settings.instagram_link">
          <a :href="settings.instagram_link" target="_blank"><Icon name="mdi:instagram" class="w-8 h-8 sm:w-12 sm:h-12 bg-rose-700"/></a></li>

        <li v-if="settings.youtube_link">
          <a :href="settings.youtube_link" target="_blank"><Icon name="mdi:youtube" class="w-8 h-8 sm:w-12 sm:h-12 bg-red-700"/></a></li>
          
        <li v-if="settings.x_link">
          <a :href="settings.x_link" target="_blank" class=""><Icon name="simple-icons:x" class="w-8 h-8 sm:w-10 sm:h-10 bg-white"/></a></li>
        </ul>
      </div>

      <!-- Quick Links -->
      <div class="lg:ml-5">
        <h3 class="text-lg font-semibold text-outline mb-3">{{ t('footerQuickLinks') }}</h3>
        <ul class="space-y-3">
        <li><NuxtLink to="/" class="hover:text-primary">{{ t('footerHome') }}</NuxtLink></li>
        <li><NuxtLink to="/games?type=giftcards" class="hover:text-primary">{{ t('footerGiftCards') }}</NuxtLink></li>
        <li><NuxtLink to="/games?type=deals" class="hover:text-primary">{{ t('footerDeals') }}</NuxtLink></li>
        <li><NuxtLink to="/news-blog" class="hover:text-primary">{{ t('footerBlog') }}</NuxtLink></li>
        </ul>
      </div>

      <!-- Resources  -->
      <div>
        <h3 class="text-lg font-semibold text-outline mb-3">{{ t('footerResources') }}</h3>
        <ul class="space-y-3">
        <li><NuxtLink to="/games?type=latest" class="hover:text-primary">{{ t('footerTrendingGames') }}</NuxtLink></li>
        <li><NuxtLink to="/games?type=preorders" class="hover:text-primary">{{ t('footerUpcomingGames') }}</NuxtLink></li>
        <li><NuxtLink to="/contact-us" class="hover:text-primary">{{ t('footerContact') }}</NuxtLink></li>
        <li><NuxtLink to="/faq" class="hover:text-primary">{{ t('footerFaq') }}</NuxtLink></li>
        </ul>
      </div>

         <!-- Explore -->
      <div>
        <h3 class="text-lg font-semibold text-outline mb-3">{{ t('footerExplore') }}</h3>
        <ul class="space-y-3">
        <li><NuxtLink to="/category/50" class="hover:text-primary">{{ t('footerPcGames') }}</NuxtLink></li>
        <li><NuxtLink to="/category/2" class="hover:text-primary">{{ t('footerPlaystation') }}</NuxtLink></li>
        <li><NuxtLink to="/category/1" class="hover:text-primary">{{ t('footerNintendo') }}</NuxtLink></li>
        <li><NuxtLink to="/category/5" class="hover:text-primary">{{ t('footerXbox') }}</NuxtLink></li>
        </ul>
      </div>

      <!-- Contact Us -->
      <!-- <div class="space-y-3">
        <h3 class="text-lg font-semibold text-outline mb-3">{{ t('footerContactUs') }}</h3>
        <span v-if="settings.address" class="flex gap-1">
   <Icon name="heroicons-map-pin" class="w-8 h-10 text-white" />
          <p>{{ settings.address }}</p>
        </span>

        <span v-if="settings.phone" class="flex gap-1 ">
  <Icon name="heroicons-phone-20-solid" class="w-6 h-6 text-white rotate-12" />         <p>
            <a :href="`tel:${settings.phone}`" class="hover:text-primary">
              {{ settings.phone }}
            </a>
            </p> 
        </span>

        <span v-if="settings.email" class="flex gap-1">
        <Icon name="mdi-email" class="w-6 h-6 text-white" />
         <p>
            <a
              :href="`mailto:${settings.email}`"
              class="hover:text-primary"
            >
              {{ settings.email }}
            </a>
          </p>
        </span>
      </div> -->
    </div>

    <!-- Bottom -->
    <div class="text-center text-md text-onFooter mt-6 border-t border-outline pt-3">
      © {{ currentYear }} {{ t('footerCopyright') }}
    </div>
  </footer>
</template>
 


<script setup>
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const settings = ref({})
const { t } = useI18n()
 
// Year for copyright
const currentYear = new Date().getFullYear()

//Fetch Footer API Data
onMounted(async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/settings`, {
      headers: { lang: 'en' },
    })
    const result = await response.json()
    if (result.status && result.data) {
      settings.value = result.data
      console.log('Footer API Data:', result.data)
    } else {
      console.error('Footer API error:', result)
    }
  } catch (error) {
    console.error('Failed to load footer settings:', error)
  }
})
</script>