<template>
  <footer class="bg-surface text-onFooter px-6 py-10" style="background-image: url('/games/Footer.background.newer.jpeg'); background-size: cover; background-repeat: no-repeat;">
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-7  lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-8 md:gap-10">
      
      <!-- About -->
      <div class="space-y-3 sm:col-span-2 md:col-span-3 lg:col-span-1">
         <img src="/games/Navbar-logo.svg.svg" alt="" class="h-[45px] w-auto mb-6 md:mb-4">
        <p class="text-lg">
          Step into the future of gaming with eGame Store. 
          Explore top-tier reviews, news, and in-depth analysis on the latest and 
          greatest games. Join the gaming community now to get exclusive content and features.
        </p>
        <ul class="space-x-12 md:space-x-14 md:pl-8 px-4 flex">
        <li v-if="settings.facebook_link">
          <a :href="settings.facebook_link" target="_blank"><Icon name="mdi:facebook" class="w-12 h-12 bg-blue-700 text-white"/></a></li>

        <li v-if="settings.instagram_link">
          <a :href="settings.instagram_link" target="_blank"><Icon name="mdi:instagram" class="w-12 h-12 bg-rose-700"/></a></li>

        <li v-if="settings.x_link">
          <a :href="settings.x_link" target="_blank"><Icon name="mdi:youtube" class="w-12 h-12 bg-red-700"/></a></li>
          
        <li v-if="settings.youtube_link">
          <a :href="settings.youtube_link" target="_blank" class=""><Icon name="simple-icons:x" class="w-9 h-9 bg-white"/></a></li>
        </ul>
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="text-lg font-semibold text-outline mb-3">Quick Links</h3>
        <ul class="space-y-3">
        <li><NuxtLink to="/" class="hover:text-primary">Home</NuxtLink></li>
        <li><NuxtLink to="/category/gifts" class="hover:text-primary">Gift Cards</NuxtLink></li>
        <li><NuxtLink to="/category/deals" class="hover:text-primary">Deals</NuxtLink></li>
        <li><NuxtLink to="/blogs" class="hover:text-primary">Blog</NuxtLink></li>
        </ul>
      </div>

      <!-- Resources  -->
      <div>
        <h3 class="text-lg font-semibold text-outline mb-3">Resources</h3>
        <ul class="space-y-3">
        <li><NuxtLink to="/category/trending" class="hover:text-primary">Trending Games</NuxtLink></li>
        <li><NuxtLink to="/category/upcoming" class="hover:text-primary">Upcoming Games</NuxtLink></li>
        <li><NuxtLink to="" class="hover:text-primary">Reviews</NuxtLink></li>
        <li><NuxtLink to="/faq" class="hover:text-primary">FAQ</NuxtLink></li>
        </ul>
      </div>

         <!-- Explore -->
      <div>
        <h3 class="text-lg font-semibold text-outline mb-3">Explore</h3>
        <ul class="space-y-3">
        <li><NuxtLink to="/category/pc" class="hover:text-primary">PC Games</NuxtLink></li>
        <li><NuxtLink to="/category/playstation" class="hover:text-primary">PlayStations</NuxtLink></li>
        <li><NuxtLink to="/category/nintendo" class="hover:text-primary">Nintendo</NuxtLink></li>
        <li><NuxtLink to="/category/xbox" class="hover:text-primary">Xbox</NuxtLink></li>
        </ul>
      </div>

      <!-- Contact Us -->
      <div class="space-y-3">
        <h3 class="text-lg font-semibold text-outline mb-3">Contact Us</h3>
        <span v-if="settings.address" class="flex gap-1">
        <img src="/games/Footer.Map.icon.svg" alt="">
          <p>{{ settings.address }}</p>
        </span>

        <span v-if="settings.phone" class="flex gap-1 ">
        <img src="/games/Footer.Call.icon.svg" alt="">
         <p>
            <a :href="`tel:${settings.phone}`" class="hover:text-primary">
              {{ settings.phone }}
            </a>
            </p>
        </span>

        <span v-if="settings.email" class="flex gap-1">
        <img src="/games/Footer.Email.icon.svg" alt="">
         <p>
            <a
              :href="`mailto:${settings.email}`"
              class="hover:text-primary"
            >
              {{ settings.email }}
            </a>
          </p>
        </span>
      </div>
    </div>

    <!-- Bottom -->
    <div class="text-center text-md text-onFooter mt-6 border-t border-outline pt-3">
      © 2025 EGameStore.com — All Rights Reserved.
    </div>
  </footer>
</template>
 


<script setup>
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const settings = ref({})

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