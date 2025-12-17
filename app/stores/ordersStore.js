import { defineStore } from 'pinia'
import { useUserStore } from '~/stores/userStore.js' // Add this

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
    pagination: { current_page: 1, last_page: 1, per_page: 15, total: 0 }
  }),

  actions: {
    // Fetch orders list with pagination/filters
    async fetchOrders(status = 'all', page = 1, perPage = 15) {
      this.loading = true
      this.error = null
      
      try {
        const userStore = useUserStore()
        if (!userStore.token) throw new Error('User not authenticated')
        
        const response = await $fetch('https://api.egamestore.com/api/users/orders/pagination', {
          params: { status, per_page: perPage, page },
          headers: { 
            'Authorization': `Bearer ${userStore.token}`,
            'Accept-language': 'en'
          }
        })
        
        if (response.status && response.data) {
          this.orders = response.data.orders.map(order => this.mapOrder(order))
          this.pagination = response.data
        } else {
          this.error = 'No orders found'
          this.orders = []
        }
      } catch (err) {
        console.error('Fetch Orders Error:', err)
        this.error = err.message || 'Failed to load orders'
        this.orders = []
      } finally {
        this.loading = false
      }
    },

    // Fetch order details
    async fetchOrderDetails(orderId) {
      this.loading = true
      this.error = null
      
      try {
        const userStore = useUserStore()
        if (!userStore.token) throw new Error('User not authenticated')
        
        const response = await $fetch(`https://api.egamestore.com/api/users/orders/${orderId}`, {
          headers: { 
            'Authorization': `Bearer ${userStore.token}`,
            'Accept-language': 'en'
          }
        })
        
        if (response.status && response.data) {
          this.selectedOrder = this.mapOrderDetails(response.data)
        } else {
          this.error = 'Order not found'
          this.selectedOrder = null
        }
      } catch (err) {
        console.error('Fetch Order Details Error:', err)
        this.error = err.message || 'Failed to load order details'
        this.selectedOrder = null
      } finally {
        this.loading = false
      }
    },

    // Fetch codes for an order item
    async fetchOrderCodes(itemId) {
      try {
        const userStore = useUserStore()
        if (!userStore.token) throw new Error('User not authenticated')
        
        const response = await $fetch(`https://api.egamestore.com/api/users/orders/items/${itemId}/codes`, {
          headers: { 
            'Authorization': `Bearer ${userStore.token}`,
            'Accept-language': 'en'
          }
        })
        
        if (response.status && response.data) {
          return response.data // [{ hash_code, actual_code }]
        }
        return []
      } catch (err) {
        console.error('Fetch Codes Error:', err)
        return []
      }
    },

    // Create order
    async createOrder(orderData) {
      try {
        const userStore = useUserStore()
        if (!userStore.token) throw new Error('User not authenticated')
        
        const response = await $fetch('https://api.egamestore.com/api/users/orders', {
          method: 'POST',
          body: orderData, // FormData
          headers: { 
            'Authorization': `Bearer ${userStore.token}`
          }
        })
        
        if (response.status && response.data) {
          // Add to orders list
          this.orders.unshift(this.mapOrder(response.data))
          return response.data
        }
        throw new Error('Failed to create order')
      } catch (err) {
        console.error('Create Order Error:', err)
        throw err
      }
    },

    // Map API order to UI format (same as before)
    mapOrder(apiOrder) {
      return {
        id: apiOrder.id,
        title: apiOrder.name,
        code: apiOrder.name.replace('#', ''),
        status: this.mapStatus(apiOrder.status),
        date: new Date(apiOrder.created_at).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }),
        price: apiOrder.total_price,
        platform: 'N/A',
        region: apiOrder.details?.country || 'N/A',
        delivery: 'Instant',
        image: apiOrder.images?.[0] || '/games/default.png',
        primaryBtn: apiOrder.status === 'completed' ? 'View Key' : 'Processing',
        secondaryBtn: 'Order again',
        detailsText: 'View Details',
        location: `${apiOrder.details?.city || ''}, ${apiOrder.details?.country || ''}`,
        paymentMethod: apiOrder.payment_method,
        key: '',
        serial: ''
      }
    },

    mapOrderDetails(apiOrder) {
      return {
        ...this.mapOrder(apiOrder),
        items: apiOrder.cards?.map(item => ({
          id: item.id,
          name: item.name,
          img: item.img,
          qty: item.qty,
          price: item.total_price,
          codes: item.codes
        })) || []
      }
    },

    mapStatus(apiStatus) {
      const map = {
        'ملغى': 'Cancelled',
        'completed': 'Completed',
        'processing': 'Processing',
        'on-hold': 'On Hold',
        'shipped': 'Shipped',
        'refunded': 'Refunded'
      }
      return map[apiStatus] || apiStatus
    },

    setSelectedOrder(order) {
      this.selectedOrder = order
    },

    clearSelectedOrder() {
      this.selectedOrder = null
    },

    getOrderById(id) {
      return this.orders.find(o => o.id === Number(id))
    }
  }
})