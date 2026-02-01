// composables/useCart.js
import { useCartStore } from '~/stores/cartStore'
import { useUserStore } from '~/stores/userStore'
import { useToast, navigateTo } from '#imports'

export function useCart() {
  const cartStore = useCartStore()
  const userStore = useUserStore()
  const toast = useToast()

  // ============================
  // ADD TO CART
  // ============================
  const addToCart = async (product, qty = 1) => {
    const res = await cartStore.addOrUpdateCard(
      product.id,
      qty,
      'add',
      product
    )

    if (res?.success) {
      toast.success({
        title: 'Added to cart',
        message: `${product.title} was added successfully`,
        position: 'topCenter',
        duration: 2500
      })
    } else {
      toast.error({
        title: 'Cart error',
        message: res?.message || 'Failed to add item',
        position: 'topCenter',
        duration: 3000
      })
    }
  }

  // ============================
  // UPDATE QTY (+ / -)
  // ============================
  const updateQty = async (item, qty) => {
      if (qty > 5) {
    toast.error({
      title: 'Limit exceeded',
      message: 'Maximum 5 items per product allowed',
      position: 'topCenter',
      duration: 3000
    })
    return
  }
    const res = await cartStore.addOrUpdateCard(
      item.id,
      qty,
      'update',
      item
    )

    if (res?.success) {
      toast.success({
        title: 'Quantity updated',
        message: `${item.title} quantity updated`,
        position: 'topCenter',
        duration: 1800
      })
    } else {
      toast.error({
        title: 'Update failed',
        message: res?.message || 'Unable to update quantity',
        position: 'topCenter'
      })
    }
  }

  // ============================
  // REMOVE ITEM
  // ============================
  const removeCard = async (id) => {
    const res = await cartStore.removeCard(id)

    if (res?.success) {
      toast.info({
        title: 'Removed',
        message: 'Item removed from cart',
        position: 'topCenter',
        duration: 2000
      })
    } else {
      toast.error({
        title: 'Remove failed',
        message: 'Could not remove item',
        position: 'topCenter'
      })
    }
  }

  // ============================
  // BUY NOW (Bypass Cart)
  // ============================
  const buyNow = async (product, qty = 1) => {
    if (!userStore.token) {
      toast.info({
        title: 'Login required',
        message: 'Please login to continue',
        position: 'topCenter'
      })
      return navigateTo('/auth/login')
    }

    // Directly navigate to checkout with product details
    // No need to add to cart - the checkout page will fetch the item directly
    navigateTo({
      path: '/checkout',
      query: {
        is_buy_now: '1',
        card_id: product.id.toString(),
        qty: qty.toString()
      }
    })

    toast.info({
      title: 'Proceeding to checkout',
      message: 'Taking you to checkout...',
      position: 'topCenter',
      duration: 2000
    })
  }

  return {
    addToCart,
    updateQty,
    removeCard,
    buyNow
  }
}