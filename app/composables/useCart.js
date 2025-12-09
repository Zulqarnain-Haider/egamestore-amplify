import { useCartStore } from '~/stores/cartStore'
import { useToast } from '#imports'

export function useCart() {
  const store = useCartStore()

  const getToast = () => {
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
        pauseOnHover: true,
      })
    }
  }

  const removeCard = (id) => {
    store.removeFromCart(id)

    const toast = getToast()
    if (toast) {
      toast.info({
        title: 'Removed',
        message: 'Item removed from cart',
        position: 'topRight',
        duration: 1500,
        pauseOnHover: true,
      })
    }
  }

  return { addToCart, removeCard }
}
