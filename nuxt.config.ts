// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,

  devtools: { enabled: true },

  css: [
    "~/assets/css/tailwind.css",
    "~/assets/css/toast.css",
    "~/assets/css/global.css"
  ],

  modules: [
    '@nuxt/scripts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxt/content',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxtjs/tailwindcss',
    'nuxt-toast'
  ],

  toast: {
    position: 'top-right',
    duration: 3000,
    keepOnHover: true,
    theme: 'dark',
  },

  plugins: ["~/plugins/aos.client.ts"],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    }
  },

  googleFonts: {
    families: {
      Poppins: [400, 600],
      Vazirmatn: [400, 700],
      Roboto: [400, 500, 700],
      Inter: [400]
    },
    display: 'swap',
    download: true,
    preload: true,
  },

  app: {
    head: {
      title: "E-GAMESTORE",
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.png" }
      ]
    }
  },

  image: {
    quality: 80,
    format: ['webp', 'avif'],
  },

  experimental: {
    payloadExtraction: false
  },

  nitro: {
    compressPublicAssets: true
  }
})
