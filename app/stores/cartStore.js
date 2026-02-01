// stores/cartStore.js
import { defineStore } from 'pinia'
import { useRuntimeConfig, useCookie } from '#imports'
import { useUserStore } from '~/stores/userStore'

export const useCartStore = defineStore('cartStore', {
  state: () => ({
    items: [],        // Raw cart items returned by backend
    totalPrice: 0,    // Total cart price from backend
    loading: false
  }),

  getters: {
    // Total quantity (used for header badge)
    cartCount: (state) =>
      state.items.reduce((sum, i) => sum + (i.qty || 1), 0)
  },

  actions: {
    // =====================================
    // Helpers
    // =====================================
    _getApiBase() {
      const config = useRuntimeConfig()
      return config.public.apiBase
    },

    _getGuestCart() {
      return useCookie('guest_cart', { default: () => [] })
    },

    _syncGuestTotals() {
      this.totalPrice = this.items.reduce(
        (sum, i) => sum + (Number(i.price) || 0) * (i.qty || 1),
        0
      )
    },

    // =====================================
    // Fetch cart
    // =====================================
    async fetchCart(params = {}) {
      const userStore = useUserStore()

      // Guest cart
      if (!userStore.token) {
        const guestCart = this._getGuestCart()
        this.items = guestCart.value || []
        this._syncGuestTotals()
        return
      }

      this.loading = true
      try {
        const res = await $fetch(`${this._getApiBase()}/users/cart`, {
          params,
          headers: {
            Authorization: `Bearer ${userStore.token}`,
            lang: 'en'
          }
        })

        if (res?.status) {
          this.items = res.data?.cards || []
          this.totalPrice = res.data?.total || 0
        }
      } catch (err) {
        console.error('Fetch cart failed:', err)
      } finally {
        this.loading = false
      }
    },

    // =====================================
    // Add or update cart item
    // =====================================
    async addOrUpdateCard(cardId, qty = 1, type = 'add', cardData = null) {
      const userStore = useUserStore()

      // ---------- Guest ----------
      if (!userStore.token) {
        if (!cardData) {
          return { success: false, message: 'Missing product data' }
        }

        const guestCart = this._getGuestCart()
        const index = guestCart.value.findIndex(i => i.id === cardId)

        if (index !== -1) {
          guestCart.value[index].qty =
            type === 'update'
              ? qty
              : (guestCart.value[index].qty || 1) + qty
        } else {
          guestCart.value.push({
            id: cardId,
            title: cardData.title,
            image: cardData.image,
            price: cardData.price,
            qty
          })
        }

        this.items = guestCart.value
        this._syncGuestTotals()
        return { success: true, guest: true }
      }

      // ---------- Auth ----------
      try {
        const form = new FormData()
        form.append('qty', qty)
        form.append('type', type)
        form.append('platform', 'mobile') // backend requirement

        const res = await $fetch(
          `${this._getApiBase()}/cards/${cardId}/add-cart`,
          {
            method: 'POST',
            body: form,
            headers: {
              Authorization: `Bearer ${userStore.token}`,
              lang: 'en'
            }
          }
        )

        if (res?.status) {
          await this.fetchCart()
          return { success: true, message: res.message }
        }
  let errorMessage = 'Cart update failed'
    if (res?.errors && res.errors.length > 0) {
      // Pehla error message lena
      errorMessage = res.errors[0]
    } else if (res?.message) {
      errorMessage = res.message
    }

    return { 
      success: false, 
      message: errorMessage,
      rawResponse: res // Optional: debug ke liye
    }
  } catch (err) {
    console.error('Add/update cart failed:', err)
    
    // Network error ya server error ke liye
    let errorMessage = 'Cart update failed'
    if (err?.response?.data?.errors?.length > 0) {
      errorMessage = err.response.data.errors[0]
    }
    
    return { 
      success: false, 
      message: errorMessage 
    }
  }
    },

    // =====================================
    // Remove item from cart
    // =====================================
    async removeCard(cardId) {
      const userStore = useUserStore()

      // Guest
      if (!userStore.token) {
        const guestCart = this._getGuestCart()
        guestCart.value = guestCart.value.filter(i => i.id !== cardId)
        this.items = guestCart.value
        this._syncGuestTotals()
        return { success: true }
      }

      try {
        const res = await $fetch(
          `${this._getApiBase()}/cards/${cardId}/delete-cart`,
          {
            method: 'DELETE',
            params: { platform: 'mobile' },
            headers: {
              Authorization: `Bearer ${userStore.token}`,
              lang: 'en'
            }
          }
        )

        if (res?.status) {
          await this.fetchCart()
          return { success: true, message: res.message }
        }

        return { success: false }
      } catch (err) {
        console.error('Remove cart error:', err)
        return { success: false }
      }
    },

    // =====================================
    // Clear cart
    // =====================================
    clearCart() {
      const guestCart = this._getGuestCart()
      guestCart.value = []
      this.items = []
      this.totalPrice = 0
    }
  }
})
