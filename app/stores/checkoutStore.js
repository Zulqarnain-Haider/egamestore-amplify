// stores/checkoutStore.js
import { defineStore } from 'pinia'
import { useRuntimeConfig, useCookie } from '#imports'
import { useUserStore } from '~/stores/userStore'

export const useCheckoutStore = defineStore('checkoutStore', {
  state: () => ({
    // Address & User Info
    address: null,
    wallet: null,
    
    // Payment Methods
    paymentMethods: [],
    selectedPaymentId: null,
    
    // Cart Pricing
    cartPrice: null,
    
    // Coupon
    appliedCoupon: null,
    
    // Loading States
    loadingAddress: false,
    loadingWallet: false,
    loadingPayments: false,
    loadingPrice: false,
    loadingCoupon: false,
    
    // IP Address
    ipAddress: null
  }),

  getters: {
    selectedPayment: (state) => 
      state.paymentMethods.find(p => p.id === state.selectedPaymentId),
    
    hasValidAddress: (state) => 
      state.address?.full_name && state.address?.city && state.address?.street_address,
    
    canCheckout: (state) => 
      state.selectedPaymentId && state.hasValidAddress
  },

  actions: {
    // =====================================
    // Helpers
    // =====================================
    _getApiBase() {
      const config = useRuntimeConfig()
      return config.public.apiBase
    },

    _getHeaders() {
      const userStore = useUserStore()
      return {
        Authorization: `Bearer ${userStore.token}`,
        'Accept-language': 'en'
      }
    },

    // =====================================
    // Fetch IP Address
    // =====================================
    async fetchIPAddress() {
      try {
        const res = await $fetch('https://api.ipify.org?format=json')
        this.ipAddress = res.ip
        return res.ip
      } catch (err) {
        console.error('IP fetch failed:', err)
        this.ipAddress = '0.0.0.0'
        return '0.0.0.0'
      }
    },

    // =====================================
    // Fetch User Address
    // =====================================
    async fetchAddress() {
      this.loadingAddress = true
      try {
        const res = await $fetch(`${this._getApiBase()}/users/address`, {
          headers: this._getHeaders()
        })

        if (res?.status && res.data) {
          this.address = res.data
        }
      } catch (err) {
        console.error('Fetch address failed:', err)
        this.address = null
      } finally {
        this.loadingAddress = false
      }
    },

    // =====================================
    // Fetch Wallet
    // =====================================
    async fetchWallet() {
      this.loadingWallet = true
      try {
        const res = await $fetch(`${this._getApiBase()}/users/wallets`, {
          headers: this._getHeaders()
        })

        if (res?.status && res.data) {
          this.wallet = res.data
        }
      } catch (err) {
        console.error('Fetch wallet failed:', err)
        this.wallet = null
      } finally {
        this.loadingWallet = false
      }
    },

    // =====================================
    // Fetch Payment Methods
    // =====================================
    async fetchPaymentMethods(params = {}) {
      this.loadingPayments = true
      try {
        const res = await $fetch(`${this._getApiBase()}/payments`, {
          params: {
            platform: 'web',
            ...params
          },
          headers: this._getHeaders()
        })

        if (res?.status && res.data) {
          this.paymentMethods = res.data
          
          // Auto-select first payment if none selected
          if (!this.selectedPaymentId && this.paymentMethods.length > 0) {
            this.selectedPaymentId = this.paymentMethods[0].id
          }
        }
      } catch (err) {
        console.error('Fetch payments failed:', err)
        this.paymentMethods = []
      } finally {
        this.loadingPayments = false
      }
    },

    // =====================================
    // Fetch Cart Price (with coupon, payment, etc.)
    // =====================================
    async fetchCartPrice(params = {}) {
      this.loadingPrice = true
      try {
        const res = await $fetch(`${this._getApiBase()}/users/cart/price`, {
          params: {
            shipping_method: 1,
            ...params
          },
          headers: this._getHeaders()
        })

        if (res?.status && res.data) {
          this.cartPrice = res.data
        }
      } catch (err) {
        console.error('Fetch cart price failed:', err)
        this.cartPrice = null
      } finally {
        this.loadingPrice = false
      }
    },

    // =====================================
    // Check/Apply Coupon
    // =====================================
    async checkCoupon(code, params = {}) {
      this.loadingCoupon = true
      try {
        const body = new FormData()
        body.append('code', code)
        body.append('shipping_method', params.shipping_method || 1)
        if (params.payment_id) body.append('payment_id', params.payment_id)
        if (params.is_buy_now) body.append('is_buy_now', params.is_buy_now)
        if (params.card_id) body.append('card_id', params.card_id)
        if (params.qty) body.append('qty', params.qty)

        const res = await $fetch(`${this._getApiBase()}/users/cart/coupons/check`, {
          method: 'POST',
          body,
          headers: this._getHeaders()
        })

        if (res?.status) {
          this.appliedCoupon = {
            code,
            discount: res.data?.discount || 0,
            message: res.message
          }
          
          // Update cart price with coupon applied
          if (res.data) {
            this.cartPrice = res.data
          }
          
          return { success: true, message: res.message, data: res.data }
        }

        return { success: false, message: res?.message || 'Invalid coupon' }
      } catch (err) {
        console.error('Coupon check failed:', err)
        return { 
          success: false, 
          message: err.response?.data?.message || 'Coupon validation failed' 
        }
      } finally {
        this.loadingCoupon = false
      }
    },

    // =====================================
    // Remove Coupon
    // =====================================
    removeCoupon() {
      this.appliedCoupon = null
      // Re-fetch cart price without coupon
      this.fetchCartPrice({
        payment_id: this.selectedPaymentId
      })
    },

    // =====================================
    // Place Order
    // =====================================
    async placeOrder(orderData) {
      try {
        const formData = new FormData()
        
        // Add all order data to FormData
        Object.entries(orderData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value)
          }
        })

        console.log('Sending order with data:', Object.fromEntries(formData))

        const res = await $fetch(`${this._getApiBase()}/users/orders`, {
          method: 'POST',
          body: formData,
          headers: this._getHeaders()
        })

        console.log('Order API response:', res)

        if (res?.status && res.data) {
          return {
            success: true,
            orderId: res.data.order_id,
            paymentLink: res.data.payment_link,
            message: res.message
          }
        }

        return {
          success: false,
          message: res?.message || 'Order failed'
        }
      } catch (err) {
        console.error('Place order failed:', err)
        console.error('Error details:', err?.data || err?.response?.data)
        return {
          success: false,
          message: err?.data?.message || err.response?.data?.message || 'Order placement failed'
        }
      }
    },

    // =====================================
    // Select Payment Method
    // =====================================
    selectPayment(paymentId) {
      this.selectedPaymentId = paymentId
      
      // Re-fetch cart price with selected payment
      this.fetchCartPrice({
        payment_id: paymentId,
        coupon: this.appliedCoupon?.code
      })
    },

    // =====================================
    // Initialize Checkout Data
    // =====================================
    async initCheckout(buyNowParams = null) {
      await Promise.all([
        this.fetchIPAddress(),
        this.fetchAddress(),
        this.fetchWallet(),
        this.fetchPaymentMethods(buyNowParams)
      ])

      // Fetch initial cart price
      await this.fetchCartPrice({
        ...buyNowParams,
        payment_id: this.selectedPaymentId
      })
    },

    // =====================================
    // Reset Store
    // =====================================
    reset() {
      this.address = null
      this.wallet = null
      this.paymentMethods = []
      this.selectedPaymentId = null
      this.cartPrice = null
      this.appliedCoupon = null
      this.ipAddress = null
    }
  }
})