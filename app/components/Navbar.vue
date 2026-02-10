<template>
  <nav class="bg-bgNav text-mainText px-4 sm:px-6 md:px-8 lg:px-10 min-h-[64px] md:min-h-[72px] xl:min-h-[80px]
    sticky top-0 z-50 flex items-center justify-between">
    
    <!-- ========== LEFT SECTION ========== -->
    <div class="flex items-center gap-3 md:gap-4 xl:gap-6">
      <!-- Hamburger (mobile/iPad) -->
      <button class="block xl:hidden text-2xl" @click="isOpen = true">
        <NuxtImg densities="x1" quality="80" loading="lazy" format="webp" src="/games/HameburgerMenu.png" alt="menu" class="w-6 h-6" />
      </button>

      <!-- Logo -->
      <NuxtLink to="/">
        <NuxtImg src="/games/EGAMESTORE-logo.png" alt="E-Game Store" 
        class="max-h-[40px] md:max-h-[44px] xl:max-h-[48px] object-contain w-auto"
        densities="x1 x2"
        quality="80" height="32" width="120" preload />
      </NuxtLink>

      <!-- Nav links (desktop) -->
      <ul class="hidden xl:flex items-center gap-4 2xl:gap-6 font-medium text-[17px] 2xl:text-[19px]">
        <li v-for="(link, i) in links" :key="i" class="relative transition-all group">
          <NuxtLink 
            :to="link.path" 
            :class="isActive(link.path) ? 'text-primary' : 'hover:text-primary'"
            class="transition-colors"
          >
            {{ t(link.key) }}
          </NuxtLink>
          <span
            class="absolute left-1/3 -translate-x-1/2 bottom-[-3px] h-[2px] bg-primary rounded transition-all duration-300"
            :class="isActive(link.path) ? 'w-3/5' : 'w-0 group-hover:w-3/5'">
          </span>
        </li>
      </ul>

      <!-- Desktop search -->
      <Icon name="mdi:search" class="hidden xl:flex w-6 h-6 text-primary hover:text-primary/90 cursor-pointer"
        @click="showSearch = true" />
    </div>

    <!-- ========== RIGHT SECTION ========== -->
    <div class="flex items-center gap-2 sm:gap-3 md:gap-4">
      <!-- Mobile search -->
      <Icon name="mdi:search" class="xl:hidden w-6 h-6 text-primary hover:text-primary/90" @click="showSearch = true" />

      <!-- Desktop dropdowns -->
      <div class="hidden xl:flex items-center gap-4 2xl:gap-6">
        <!-- Map marker -->
        <button class="flex items-center text-[13px] font-roboto">
          <Icon name="mdi:map-marker" class="text-[18px] mr-1" />Spain
        </button>

        <!-- Language -->
        <div class="relative" ref="langRef">
          <button @click="toggleDropdown('lang')" class="flex items-center text-[12px] font-roboto">
            {{ locale.toUpperCase() }}
            <Icon :class="{'rotate-180': showLangDropdown}" name="mdi:menu-down" class="w-6 h-6 text-current transition-transform" />
          </button>
          <ul v-if="showLangDropdown" class="absolute right-0 mt-2 bg-bgNav border border-outline rounded shadow-lg text-sm z-50">
            <li @click="selectLang('en')" class="px-3 py-2 hover:bg-outline hover:text-white cursor-pointer">EN</li>
            <li @click="selectLang('ar')" class="px-3 py-2 hover:bg-outline hover:text-white cursor-pointer">AR</li>
          </ul>
        </div>

        <!-- Currency -->
        <div class="relative" ref="currencyRef">
          <button @click="toggleDropdown('currency')" class="flex items-center text-[12px] font-roboto">
            USD
            <Icon :class="{'rotate-180': showCurrencyDropdown}" name="mdi:menu-down" class="w-6 h-6 text-current transition-transform" />
          </button>
          <ul v-if="showCurrencyDropdown" class="absolute right-0 mt-2 bg-bgNav border border-outline rounded shadow-lg text-sm z-50">
            <li @click="selectCurrency('USD')" class="px-3 py-2 hover:bg-outline hover:text-white cursor-pointer">USD</li>
            <li @click="selectCurrency('EUR')" class="px-3 py-2 hover:bg-outline hover:text-white cursor-pointer">EUR</li>
            <li @click="selectCurrency('PKR')" class="px-3 py-2 hover:bg-outline hover:text-white cursor-pointer">PKR</li>
          </ul>
        </div>
      </div>

      <!-- Cart -->
      <NuxtLink to="/cart" class="relative flex items-center">
        <Icon name="mdi:cart-outline"
          class="w-5 h-5 text-mainText hover:text-primary/90 cursor-pointer" />
        <span
          v-if="cartCount > 0"
          class="absolute -top-2 -right-2 min-w-[16px] h-[16px]
                 px-1 text-[10px] font-bold rounded-full
                 bg-primary text-white flex items-center justify-center"
        >
          {{ cartCount }}
        </span>
      </NuxtLink>

      <!-- Login / Profile -->
      <NuxtLink v-if="!isLoggedIn" to="/auth/login" class="bg-primary text-mainText px-4 py-1.5 rounded-md 
          text-[15px] font-medium hover:opacity-90 transition font-roboto">
        {{ t('sign-in') }}
      </NuxtLink>

      <div v-else class="relative" ref="profileRef">
        <NuxtImg 
          :src="auth.user?.avatar && !auth.user?.avatar.includes('&')
             ? auth.user.avatar 
          :'/games/ProfileAvatar.png'"
          class="w-9 h-9 rounded-full object-cover cursor-pointer"
          @click="toggleDropdown('profile')"
        />
        <ul v-if="showProfileDropdown" class="absolute right-0 mt-2 bg-bgNav border border-outline rounded-md shadow-lg z-50">
          <li @click="selectProfileOption('/profile')" class="px-2 py-2 text-sm text-mainText flex items-center font-semibold gap-1 hover:text-primary cursor-pointer w-full text-left">
            <Icon name="mdi:account-circle" /> {{ t('profile') }}
          </li>
          <li @click="selectProfileOption('/orders')" class="px-2 py-2 text-sm text-mainText flex items-center font-semibold gap-1 hover:text-primary cursor-pointer w-full text-left">
            <Icon name="mdi:clipboard-list-outline" /> {{ t('orders') }}
          </li>
          <li @click="selectProfileOption('/wallet')" class="px-2 py-2 text-sm text-mainText flex items-center font-semibold gap-1 hover:text-primary cursor-pointer w-full text-left">
            <Icon name="mdi:wallet-outline" /> {{ t('wallet') }}
          </li>
          <li @click="logoutUser" class="px-2 py-2 text-sm text-mainText flex items-center font-semibold gap-1 hover:text-primary cursor-pointer w-full text-left">
            <Icon name="mdi:logout" /> {{ t('logout') }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <transition name="slide">
      <div v-if="isOpen" class="fixed inset-0 z-40 flex">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="isOpen = false"></div>
        <div class="relative z-50 h-full w-72 bg-bgNav shadow-lg flex flex-col">
          <!-- Sidebar Header -->
          <div class="flex items-center justify-between px-3 py-3 border-b border-outline">
            <NuxtImg src="/games/EGAMESTORE-logo.png" alt="EGAMESTORE Logo" class="h-6 w-auto" 
            format="webp" densities="x1 x2" quality="80" preload />
            
            <Icon name="mdi:close" class="h-7 w-7 text-primary cursor-pointer" @click="isOpen = false" />
          </div>

          <!-- Sidebar Links -->
          <ul class="flex flex-col gap-4 px-6 py-4 font-medium font-poppins text-lg">
            <li v-for="(link, i) in links" :key="i">
              <NuxtLink 
                :to="link.path" 
                @click="handleSidebarLinkClick" 
                :class="isActive(link.path) ? 'text-primary' : 'hover:text-primary'" 
                class="block py-2 transition-colors"
              >
                {{ t(link.key) }}
              </NuxtLink>
            </li>
          </ul>

          <!-- Sidebar Footer (Mobile dropdowns) -->
          <div class="mt-2 border-t border-outline px-6 py-4 flex items-center justify-between">
            <!-- Language -->
            <div class="relative" ref="mobileLangRef">
              <button @click="toggleDropdown('mobileLang')" class="flex items-center text-sm font-roboto">
                EN
                <Icon :class="{'rotate-180': showMobileLangDropdown}" name="mdi:menu-down" class="w-6 h-6 text-current transition-transform" />
              </button>
              <ul v-if="showMobileLangDropdown" class="absolute left-0 mt-2 bg-bgNav border border-outline rounded shadow-lg text-sm max-h-[50vh] overflow-y-auto z-50">
                <li @click="selectLang('en')" class="px-3 py-2 hover:bg-outline hover:text-white cursor-pointer">EN</li>
                <li @click="selectLang('ar')" class="px-3 py-2 hover:bg-outline hover:text-white cursor-pointer">AR</li>
              </ul>
            </div>

            <!-- Currency -->
            <div class="relative" ref="mobileCurrencyRef">
              <button @click="toggleDropdown('mobileCurrency')" class="flex items-center  text-sm font-roboto">
                USD
                <Icon :class="{'rotate-180': showMobileCurrencyDropdown}" name="mdi:menu-down" class="w-6 h-6 text-current transition-transform" />
              </button>
              <ul v-if="showMobileCurrencyDropdown" class="absolute left-0 mt-2 bg-bgNav border border-outline rounded shadow-lg text-sm max-h-[50vh] overflow-y-auto z-50">
                <li @click="selectCurrency('USD')" class="px-3 py-2 hover:bg-outline hover:text-white cursor-pointer">USD</li>
                <li @click="selectCurrency('EUR')" class="px-3 py-2 hover:bg-outline hover:text-white cursor-pointer">EUR</li>
                <li @click="selectCurrency('PKR')" class="px-3 py-2 hover:bg-outline hover:text-white cursor-pointer">PKR</li>
              </ul>
            </div>

            <!-- Map marker -->
            <button class="hover:text-primary text-[18px] flex items-center font-roboto">
              <Icon name="mdi:map-marker" class="text-[18px] mr-1" /> <span class="text-[15px]">Spain</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Search Overlay -->
    <SearchOverlay :show="showSearch" @close="showSearch = false" />
  </nav>
</template>

<script setup>
import { useLang } from '~/composables/useLang'
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useCartStore } from '~/stores/cartStore'
import { useAuth } from '~/composables/useAuth'

const { locale, setLocale, t } = useI18n()
const langCookie = useLang()

const router = useRouter()
const route = useRoute()
const auth = useAuth()
const cartStore = useCartStore()


// States
const isOpen = ref(false)
const showSearch = ref(false)
const showLangDropdown = ref(false)
const showCurrencyDropdown = ref(false)
const showProfileDropdown = ref(false)
const showMobileLangDropdown = ref(false)
const showMobileCurrencyDropdown = ref(false)

// Refs for outside click
const langRef = ref(null)
const currencyRef = ref(null)
const profileRef = ref(null)
const mobileLangRef = ref(null)
const mobileCurrencyRef = ref(null)

// Category ID mapping (from your existing code)
const categoryMap = {
  pc: 50,        // PC Games category_id
  xbox: 2,       // Xbox category_id
  playstation: 1, // PlayStation category_id
  nintendo: 5,   // Nintendo category_id
}

// Links with proper category IDs
const links = [
  { key: 'home', path: '/' },
  { key: 'pc-games', path: `/category/${categoryMap.pc}` },
  { key: 'xbox', path: `/category/${categoryMap.xbox}` },
  { key: 'playstation', path: `/category/${categoryMap.playstation}` },
  { key: 'nintendo', path: `/category/${categoryMap.nintendo}` },
  // { key: 'gift-cards', path: '/games?type=giftcards' },
  { key: 'deals', path: '/games?type=deals' },
  // { key: 'pre-orders', path: '/games?type=preorders' },
  { key: 'news-blog', path: '/news-blog' }
]

const isLoggedIn = computed(() => auth.isAuthenticated.value)

// Check if current route is active
const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path === path
}

const logoutUser = async () => {
  await auth.logout()
  router.push('/')
}

// cart badge count
onMounted(() => {
  cartStore.fetchCart()
})
const cartCount = computed(() => cartStore.cartCount)


// Sidebar overflow
watch(isOpen, (v) => {
  if (process.client) document.body.style.overflow = v ? "hidden" : "auto"
})

onMounted(() => { 
  if (process.client) document.body.style.overflow = "auto" 
})

onBeforeUnmount(() => { 
  if (process.client) document.body.style.overflow = "auto" 
})

const handleSidebarLinkClick = () => {
  setTimeout(() => { isOpen.value = false }, 100)
}

const toggleDropdown = (type) => {
  switch(type) {
    case 'lang': showLangDropdown.value = !showLangDropdown.value; break
    case 'currency': showCurrencyDropdown.value = !showCurrencyDropdown.value; break
    case 'profile': showProfileDropdown.value = !showProfileDropdown.value; break
    case 'mobileLang': showMobileLangDropdown.value = !showMobileLangDropdown.value; break
    case 'mobileCurrency': showMobileCurrencyDropdown.value = !showMobileCurrencyDropdown.value; break
  }
}

const handleClickOutside = (e) => {
  if (langRef.value && !langRef.value.contains(e.target)) showLangDropdown.value = false
  if (currencyRef.value && !currencyRef.value.contains(e.target)) showCurrencyDropdown.value = false
  if (profileRef.value && !profileRef.value.contains(e.target)) showProfileDropdown.value = false
  if (mobileLangRef.value && !mobileLangRef.value.contains(e.target)) showMobileLangDropdown.value = false
  if (mobileCurrencyRef.value && !mobileCurrencyRef.value.contains(e.target)) showMobileCurrencyDropdown.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))


const selectLang = async (code) => {
  const normalized = code.toLowerCase()
  
  if (!['en', 'ar'].includes(normalized)) return
  
  // Set the locale using Nuxt's i18n
  await setLocale(normalized)
  
  // Update cookie
  langCookie.value = normalized
  
  // Update HTML for RTL/LTR
  if (process.client) {
    document.documentElement.lang = normalized
  }
  
  showLangDropdown.value = false
  showMobileLangDropdown.value = false
}

const selectCurrency = (cur) => { 
  console.log('Currency:', cur)
  showCurrencyDropdown.value = false
  showMobileCurrencyDropdown.value = false
}

const selectProfileOption = (path) => { 
  showProfileDropdown.value = false
  router.push(path)
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>