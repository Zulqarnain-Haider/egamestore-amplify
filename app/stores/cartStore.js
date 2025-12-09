// stores/cartStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from '~/stores/userStore.js'

export const useCartStore = defineStore('cartStore', {
  state: () => ({
    items: [],
    totalPrice: 0,
    loading: false,
  }),

  getters: {
    cartCount: (state) => state.items.length,
  },

  actions: {
    // -------------------------
    // ADD / UPDATE CARD IN CART
    // -------------------------
   // GET CART
async fetchCart(params = {}) {
  const userStore = useUserStore()
  if (!userStore.token) return

  this.loading = true

  try {
    const res = await axios.get(
      `https://api.egamestore.com/api/users/cart`,
      {
        params,
        headers: {
          Authorization: `Bearer ${userStore.token}`,
          'Accept-language': 'en',
        }
      }
    )

    if (res.data?.status) {
      const data = res.data.data
      this.items = [
        ...(data.cards || []),
        ...(data.products || [])
      ]
      this.totalPrice = data.total_price ?? 0
    }

  } catch (error) {
    console.error("Cart fetch failed", error)
  }

  this.loading = false
},

// ADD / UPDATE
async addOrUpdateCard(id, qty = 1, type = 'add') {
  const userStore = useUserStore()

  try {
    const form = new FormData()
    form.append('qty', qty)
    form.append('type', type)
    form.append('platform', 'web')

    const res = await axios.post(
      `https://api.egamestore.com/api/cards/${id}/add-cart`,
      form,
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
          'Accept-language': 'en',
        }
      }
    )

    if (res.data.status) {
      await this.fetchCart({})
    }

    return res.data

  } catch (error) {
    console.error("ADD/UPDATE cart error:", error)
    return { status: false, message: "API Error" }
  }
},
    // -------------------------
    // DELETE CARD FROM CART
    // -------------------------
    async removeCard(id) {
      const userStore = useUserStore()

      const res = await axios.delete(
        `https://api.egamestore.com/api/cards/${id}/delete-cart`,
        {
          params: { platform: 'web' },
          headers: {
            Authorization: `Bearer ${userStore.token}`,
        'Accept-language': 'en',
          }
        }
      )

      if (res.data.status) {
        await this.fetchCart()
      }

      return res.data
    },

    // -------------------------
    // ADD MULTIPLE ITEMS
    // -------------------------
    async addMultiple(items) {
      const userStore = useUserStore()

      const payload = {
        items,
        platform: "web"
      }

      const res = await axios.post(
        `https://api.egamestore.com/api/cart/add-multiple-items`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
        'Accept-language': 'en',
          }
        }
      )

      if (res.data.status) {
        await this.fetchCart()
      }

      return res.data
    },

    // -------------------------
    // GET CART PRICE
    // -------------------------
    async fetchPrice(params) {
      const userStore = useUserStore()

      return await axios.get(
        `https://api.egamestore.com/api/users/cart/price`,
        {
          params,
          headers: {
            Authorization: `Bearer ${userStore.token}`,
        'Accept-language': 'en',
          }
        }
      )
    },

    // -------------------------
    // CHECK COUPON
    // -------------------------
    async checkCoupon(data) {
      const userStore = useUserStore()

      const form = new FormData()
      Object.entries(data).forEach(([k, v]) => form.append(k, v))

      return await axios.post(
        `https://api.egamestore.com/api/users/cart/coupons/check`,
        form,
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
        'Accept-language': 'en',
          }
        }
      )
    }
  }
})
