// stores/ordersStore.js
import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    //Initialize safely (server has no localStorage)
    orders: process.client ? JSON.parse(localStorage.getItem('orders') || '[]') : [],
    selectedOrder: process.client ? JSON.parse(localStorage.getItem('selectedOrder') || 'null') : null,
    cart: process.client ? JSON.parse(localStorage.getItem('cart') || '[]') : [],

    //Moved inside state so Pinia tracks it reactively
    checkoutData: process.client
      ? JSON.parse(localStorage.getItem('checkoutData') || '{"billing": {}, "paymentMethod": null}')
      : { billing: {}, paymentMethod: null }
  }),

  getters: {
    cartCount: (state) =>
      state.cart?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0,
    cartTotal: (state) =>
      state.cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0
  },

  actions: {
    //Checkout data
    setCheckoutData(data) {
      this.checkoutData = data
      if (process.client) {
        localStorage.setItem('checkoutData', JSON.stringify(data))
      }
    },

    //Set all orders (for API or static)
    setOrders(data) {
      this.orders = data
      if (process.client) {
        localStorage.setItem('orders', JSON.stringify(this.orders))
      }
    },

    applyDiscount(amount) {
  this.discount = amount
},


    //Add new order
    addOrder(order) {
      this.orders.push(order)
      if (process.client) {
        localStorage.setItem('orders', JSON.stringify(this.orders))
      }
    },

    //Get single order by ID
    getOrderById(id) {
      return this.orders.find((o) => o.id === Number(id))
    },

    //Set selected order
    setSelectedOrder(order) {
      this.selectedOrder = order
      if (process.client) {
        localStorage.setItem('selectedOrder', JSON.stringify(order))
      }
    },

    //Clear selected order
    clearSelectedOrder() {
      this.selectedOrder = null
      if (process.client) {
        localStorage.removeItem('selectedOrder')
      }
    },

    //Sync data from localStorage (on refresh)
    loadOrdersFromStorage() {
      if (process.client) {
        try {
          const stored = JSON.parse(localStorage.getItem('orders') || '[]')
          const selected = JSON.parse(localStorage.getItem('selectedOrder') || 'null')
          const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
          const checkout = JSON.parse(localStorage.getItem('checkoutData') || '{"billing": {}, "paymentMethod": null}')

          this.orders = stored
          this.selectedOrder = selected
          this.cart = cartData
          this.checkoutData = checkout
        } catch (e) {
          console.error('Failed to load from localStorage:', e)
        }
      }
    },

    //Add item to cart
    addToCart(product) {
      const existing = this.cart.find((p) => p.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        this.cart.push({
          ...product,
          quantity: 1,
          addedAt: new Date().toISOString()
        })
      }

      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.cart))
      }
    },

    //Remove from cart
    removeFromCart(id) {
      this.cart = this.cart.filter((p) => p.id !== id)
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.cart))
      }
    },

    //Update quantity
    updateQuantity(id, qty) {
      const item = this.cart.find((p) => p.id === id)
      if (item) {
        item.quantity = Math.max(1, qty)
        if (process.client) {
          localStorage.setItem('cart', JSON.stringify(this.cart))
        }
      }
    },

    //Clear entire cart
    clearCart() {
      this.cart = []
      if (process.client) {
        localStorage.removeItem('cart')
      }
    }
  }
})
