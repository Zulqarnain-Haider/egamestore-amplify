// stores/ordersStore.js
import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#imports'
import { useUserStore } from '~/stores/userStore'

export const useOrdersStore = defineStore('orders', {
  // =====================================
  // State
  // =====================================
  state: () => ({
    orders: [],
    selectedOrder: null,

    // Pagination
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },

    // Loading & Error
    loading: false,
    error: null
  }),

  // =====================================
  // Getters
  // =====================================
  getters: {
    hasOrders: (state) => state.orders.length > 0,

    getOrderById: (state) => (id) =>
      state.orders.find(o => o.id === Number(id))
  },

  // =====================================
  // Actions
  // =====================================
  actions: {
    // -------------------------------------
    // Helpers
    // -------------------------------------
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

    // -------------------------------------
    // Fetch Orders List (Pagination + Status Filter)
    // -------------------------------------
    async fetchOrders(status = 'all', page = 1, perPage = 15) {
      this.loading = true
      this.error = null

      try {
        const res = await $fetch(
          `${this._getApiBase()}/users/orders/pagination`,
          {
            params: {
              status, // allowed: on-hold | processing | shipped | cancelled | refunded | completed | all
              page,
              per_page: perPage
            },
            headers: this._getHeaders()
          }
        )

        if (res?.status && res.data) {
          this.orders = res.data.orders.map(o => this._mapOrder(o))
          this.pagination = {
            current_page: res.data.current_page,
            last_page: res.data.last_page,
            per_page: Number(res.data.per_page),
            total: res.data.total
          }
        } else {
          this.orders = []
          this.error = 'No orders found'
        }
      } catch (err) {
        console.error('Fetch Orders Error:', err)
        this.orders = []
        this.error = err?.message || 'Failed to load orders'
      } finally {
        this.loading = false
      }
    },

    // -------------------------------------
    // Fetch Single Order Details
    // Codes come EMBEDDED in cards (old Vue behavior)
    // -------------------------------------
    async fetchOrderDetails(orderId) {
      this.loading = true
      this.error = null

      try {
        const res = await $fetch(
          `${this._getApiBase()}/users/orders/${orderId}`,
          {
            headers: this._getHeaders()
          }
        )

        if (res?.status && res.data) {
          this.selectedOrder = this._mapOrderDetails(res.data)
        } else {
          this.selectedOrder = null
          this.error = 'Order not found'
        }
      } catch (err) {
        console.error('Fetch Order Details Error:', err)
        this.selectedOrder = null
        this.error = err?.message || 'Failed to load order details'
      } finally {
        this.loading = false
      }
    },

    // -------------------------------------
    // Order Mapping (Listing)
    // -------------------------------------
    _mapOrder(apiOrder) {
      return {
        id: apiOrder.id,
        title: apiOrder.name,
        code: apiOrder.name?.replace('#', '') || '',
        status: this._mapStatus(apiOrder.status),

        date: apiOrder.created_at
          ? new Date(apiOrder.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : 'N/A',

        price: apiOrder.total_price || 0,

        // Static UI placeholders (old Vue precedence)
        platform: 'N/A',
        delivery: 'Instant',

        region: apiOrder.details?.country || 'N/A',
        location: `${apiOrder.details?.city || ''}, ${apiOrder.details?.country || ''}`,

        image: apiOrder.images?.[0] || '/games/UpcomingGames4.png',

        // Button logic (matches old Vue)
        primaryBtn: apiOrder.status === 'completed' ? 'View Key' : 'Processing',
        secondaryBtn: 'Order again',

        detailsText: 'View Details',

        // Filled on details page only
        key: '',
        serial: ''
      }
    },

    // -------------------------------------
    // Order Mapping (Details Page)
    // Products + Cards merged like old Vue
    // Codes come from cards[].codes_list
    // -------------------------------------
    _mapOrderDetails(apiOrder) {
      const products = apiOrder.products?.map(p => ({
        id: p.id,
        name: p.name,
        img: p.img,
        qty: p.qty,
        price: p.total_price,
        product_type: 1,
        codes_list: []
      })) || []

      const cards = apiOrder.cards?.map(c => ({
        id: c.id,
        name: c.name,
        img: c.img,
        qty: c.qty,
        price: c.total_price,
        product_type: 2,
        codes_list: c.codes_list || [] // 🔑 IMPORTANT
      })) || []

      return {
        ...this._mapOrder(apiOrder),
        items: [...products, ...cards],
        payment_method: apiOrder.payment?.name || null,
        shipping_method: apiOrder.shipping_method,
        details: apiOrder.details,
        total_price: apiOrder.total_price,
        sub_total: apiOrder.sub_total,
        payment_fees: apiOrder.payment_fees,
        coupon_code: apiOrder.coupon_code,
        coupon_value: apiOrder.coupon_value,
        RefNumber: apiOrder.RefNumber
      }
    },

    // -------------------------------------
    // Status Mapping
    // -------------------------------------
    _mapStatus(apiStatus) {
      const map = {
        completed: 'Completed',
        processing: 'Processing',
        refunded: 'Refunded',
        cancelled: 'Cancelled',
        'on-hold': 'On Hold',
        shipped: 'Shipped'
      }

      return map[apiStatus] || apiStatus
    },

    // -------------------------------------
    // Local State Helpers
    // -------------------------------------
    setSelectedOrder(order) {
      this.selectedOrder = order
    },

    clearSelectedOrder() {
      this.selectedOrder = null
    },

    reset() {
      this.orders = []
      this.selectedOrder = null
      this.pagination = {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0
      }
      this.loading = false
      this.error = null
    }
  }
})
