import { defineStore } from 'pinia'
import preorders from '../../data/preorders.json'
import giftcards from '../../data/giftcards.json'

export const useGameListingStore = defineStore('gameListing', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchByType(type) {
      this.loading = true
      this.error = null

      try {
        /* =============================
           STATIC TYPES
        ============================= */
        if (type === 'preorders') {
          this.items = preorders
          return
        }

        if (type === 'giftcards') {
          this.items = giftcards
          return
        }

        /* =============================
           API TYPES
        ============================= */
        const config = useRuntimeConfig()

        let endpoint = ''

        switch (type) {
          case 'latest':
            endpoint = '/products/latest'
            break
          case 'bestsellers':
            endpoint = '/products/best-selling?limit=15&days=100'
            break
          case 'deals':
            endpoint = '/products/deals'
            break
          default:
            throw new Error('Invalid game type')
        }

        const res = await $fetch(
          `${config.public.apiBase}${endpoint}`,
          { headers: { 'Accept-language': 'en' } }
        )

        const cards =
          res?.data?.cards ||
          res?.data?.products ||
          []

        this.items = cards.map(p => {
          const hasDiscount =
            p.price_after_discount &&
            p.price_after_discount < p.price

          return {
            id: p.id,
            title: p.name,
            image:
              p.main_image ||
              p.img ||
              (p.images?.[0]?.image ?? ''),
            price: hasDiscount ? p.price_after_discount : p.price,
            oldPrice: hasDiscount ? p.price : null,
            discount: hasDiscount
              ? Math.round(((p.price - p.price_after_discount) / p.price) * 100)
              : 0,
            rating: p.reviews_avg_rating || 0,
            stock: p.stock,
            __type: type
          }
        })
      } catch (err) {
        console.error('Game listing error:', err)
        this.items = []
        this.error = err.message || 'Failed to load games'
      } finally {
        this.loading = false
      }
    }
  }
})
