// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: true,

  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  css: [
    "~/assets/css/tailwind.css",
    "~/assets/css/toast.css",
    "~/assets/css/global.css",
  ],

  modules: [
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/content",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxtjs/tailwindcss",
    "nuxt-toast",
    "@nuxtjs/i18n",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
  ],

  site: {
    url: 'www.store.egamestore.com'
  },

  sitemap: {
    hostname: 'https://www.store.egamestore.com',
    gzip: true,
    // Define your data sources
    sources: [
      '/api/__sitemap__/blogs', // Your new dynamic endpoint
      '/api/__sitemap__/categories_and_products'
    ],
    // Static routes first
    routes: [
      '/',
      '/auth',
      '/contact-us',
      '/games',
      '/news-blog',
      '/orders',
      '/profile',
      '/search',
      '/cart',
      '/checkout',
      '/faq',
      '/wallet'
    ],
    // Default options
    defaults: {
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString()
    }
  },

  toast: {
    position: "top-right",
    duration: 3000,
    keepOnHover: true,
    theme: "dark",
  },

  plugins: [
    "~/plugins/aos.client.ts",
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    },
  },

  googleFonts: {
    families: {
      Poppins: [400, 600],
      Vazirmatn: [400, 700],
      Roboto: [400, 500, 700],
      Inter: [400],
    },
    display: "swap",
    download: true,
    preload: true,
  },

  app: {
    head: {
      title: "E-GAMESTORE",
      htmlAttrs: { lang: "en" },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
    },
  },

  image: {
    quality: 80,
    format: ["webp", "avif"],
  },

  experimental: {
    payloadExtraction: false,
  },

  nitro: {
    compressPublicAssets: true,
  },

  i18n: {
    locales: [
      {
        code: "en",
        iso: "en-US",
        dir: "ltr",
        file: "en.json"
      },
      {
        code: "ar",
        iso: "ar-SA",
        dir: "rtl",
        file: "ar.json"
      },
    ],
    defaultLocale: "en",
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      redirectOn: 'root'
    },
    vueI18n: "./i18n.config.ts",
    lazy: true,
    langDir: "locales",
  },
});