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
  ],

  /* =========================
     SITEMAP CONFIG (SEO)
  ========================= */
  sitemap: {
    // @ts-ignore
    siteUrl: 'https://www.store.egamestore.com',
    gzip: true,
    autoI18n: false,

    // ❌ Pages that should NOT be indexed
    exclude: [
      '/auth/**',
      '/contact-us/chat'
    ],

    urls: async () => {
      const urls: any[] = []

      /* --------------------
         Static SEO Pages
      -------------------- */
      urls.push(
        { loc: '/', priority: 1.0 },
        { loc: '/contact-us', priority: 0.6 },
        { loc: '/news-blog', priority: 0.8 }
      )

      /* --------------------
         PRODUCTS (product/[id].vue)
      -------------------- */
      try {
        let page = 1
        let hasMore = true

        while (hasMore) {
          const res: any = await $fetch(
            `${process.env.NUXT_PUBLIC_API_BASE}/cards/category`,
            {
              params: {
                category_id: 1,  
                country_id: 1,   
                page,
                per_page: 100,
                sort_type: 'asc_price'
              },
              headers: {
                'Accept-language': 'en'
              }
            }
          )

          const cards = res?.data?.cards || []

          cards.forEach((p: any) => {
            urls.push({
              loc: `/product/${p.id}`,
              lastmod: p.updated_at,
              priority: 0.9
            })
          })

          hasMore = res?.data?.has_more
          page++
        }
      } catch (e) {
        console.warn('Products sitemap failed')
      }

      /* --------------------
         BLOGS (news-blog/[slug].vue)
      -------------------- */
      try {
        const blogs: any[] = await $fetch(
          `${process.env.NUXT_PUBLIC_API_BASE}/blogs`
        )

        blogs.forEach((b: any) => {
          urls.push({
            loc: `/news-blog/${b.slug}`,
            lastmod: b.updated_at,
            priority: 0.7
          })
        })
      } catch (e) {
        console.warn('Blogs sitemap skipped')
      }

      return urls
    },

    robots: [
      {
        UserAgent: '*',
        Allow: '/'
      }
    ]
  },

  /* =========================
     REST CONFIG (UNCHANGED)
  ========================= */
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
      { code: "en", iso: "en-US", dir: "ltr", file: "en.json" },
      { code: "ar", iso: "ar-SA", dir: "rtl", file: "ar.json" },
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
})