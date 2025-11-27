// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ["~/assets/css/tailwind.css",
    "~/assets/css/toast.css"
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
// @ts-ignore
  position: 'top-right',   // always top-right
  duration: 3000,
  keepOnHover: true,
  theme: 'dark',           // dark background
},


  plugins: ["~/plugins/aos.client.ts"],


   // -------------------------------
  // Runtime Config
  // -------------------------------
  runtimeConfig: {
    public: {
      apiBase: ''
    }
  },
  
  googleFonts: {
    families: {
      Poppins: [400, 600],
      Vazirmatn: [400, 700],
      Roboto: [400, 500, 700],
      Inter: [400]
    },
    display: 'swap',      // Prevents invisible text flash
    download: true,       // Self-host fonts (already done!)
    inject: true,         // Auto-inject CSS
    preload: true,        // Preload for faster loading
  },

  app: {
    head: {
      title: "E-GAMESTORE",
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.png",
        },
        // Font Awesome (already there)
        {
          rel: "preconnect",
          href: "https://cdnjs.cloudflare.com",
        },
         {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
        },
      ],
    },
  },

   //IMAGE OPTIMIZATION CONFIG
  image: {
    quality: 80, // Good balance between quality and size
    format: ['webp', 'avif'], // Modern formats
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    domains: [], // Add external image domains if you use any
    // Example: domains: ['cdn.example.com']
  },

  //PERFORMANCE OPTIMIZATIONS
  experimental: {
    payloadExtraction: false, // Can reduce initial bundle size
    renderJsonPayloads: true,
  },

  //BUILD OPTIMIZATIONS
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor chunks for better caching
            'vendor-vue': ['vue', 'vue-router'],
            'vendor-pinia': ['pinia'],
            'vendor-swiper': ['swiper'],
          }
        }
      }
    }
  },

  //NITRO (SERVER) OPTIMIZATIONS
  nitro: {
    compressPublicAssets: true, // Enable compression
    prerender: {
      crawlLinks: true,
      routes: ['/'] // Add important routes to prerender
    }
  },

  //ROUTER OPTIMIZATION
  router: {
    options: {
      strict: false
    }
  }
})