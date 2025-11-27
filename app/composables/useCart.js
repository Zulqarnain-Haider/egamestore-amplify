// composables/useCart.js
import { useOrdersStore } from '~/stores/ordersStore.js'

export function useCart() {
  const store = useOrdersStore()
  
  const getToast = () => {
    // only call useToast on client, and only if it exists
    if (import.meta.client && typeof useToast === 'function') {
      return useToast()
    }
    return null
  }

  const addToCart = (product) => {
    if (!product || !product.id) {
      console.warn('⚠️ Invalid product passed to addToCart:', product)
      return
    }

    store.addToCart(product)

    const toast = getToast()
    if (toast) {
      toast.success({
        title: product.title || 'Product',
        message: 'Added to cart!',
        position: 'topRight',
        duration: 3000,
        pauseOnHover: true,     // Pause on hover


      })
    }
  }

  const removeFromCart = (id) => {
    store.removeFromCart(id)

    const toast = getToast()
    if (toast) {
      toast.info({
        title: 'Removed',
        message: 'Item removed from cart',
        position: 'topRight',
        duration: 1500,
        pauseOnHover: true,     // Pause on hover

      })
    }
  }

  return { addToCart, removeFromCart }
}
