// composables/useCheckout.js
import { useCheckoutStore } from '~/stores/checkoutStore'
import { useCartStore } from '~/stores/cartStore'
import { useUserStore } from '~/stores/userStore'
import { useToast, navigateTo } from '#imports'

export function useCheckout() {
  const checkoutStore = useCheckoutStore()
  const cartStore = useCartStore()
  const userStore = useUserStore()
  const toast = useToast()

  // ============================
  // Initialize Checkout
  // ============================
  const initCheckout = async (isBuyNow = false, cardId = null, qty = 1) => {
    // Check authentication
    if (!userStore.token) {
      toast.error({
        title: 'Login Required',
        message: 'Please login to continue',
        position: 'topCenter',
        duration: 3000
      })
      navigateTo('/auth/login')
      return
    }

    // Check cart only if not buy now
    if (!isBuyNow && cartStore.items.length === 0) {
      toast.error({
        title: 'Cart Empty',
        message: 'Your cart is empty',
        position: 'topCenter',
        duration: 3000
      })
      navigateTo('/cart')
      return
    }

    // Prepare buy now params if applicable
    const buyNowParams = isBuyNow ? {
      is_buy_now: 1,
      card_id: cardId,
      qty
    } : null

    // Initialize all checkout data
    await checkoutStore.initCheckout(buyNowParams)
  }

  // ============================
  // Apply Coupon
  // ============================
  const applyCoupon = async (code, isBuyNow = false, cardId = null, qty = 1) => {
    if (!code || !code.trim()) {
      toast.error({
        title: 'Invalid Coupon',
        message: 'Please enter a coupon code',
        position: 'topCenter',
        duration: 2000
      })
      return false
    }

    const params = {
      shipping_method: 1,
      payment_id: checkoutStore.selectedPaymentId
    }

    if (isBuyNow) {
      params.is_buy_now = 1
      params.card_id = cardId
      params.qty = qty
    }

    const res = await checkoutStore.checkCoupon(code.trim(), params)

    if (res.success) {
      toast.success({
        title: 'Coupon Applied',
        message: res.message || `You will save ${res.data?.discount_money || 0} USD`,
        position: 'topCenter',
        duration: 3000
      })
      return true
    } else {
      toast.error({
        title: 'Invalid Coupon',
        message: res.message || 'This coupon is not valid',
        position: 'topCenter',
        duration: 3000
      })
      return false
    }
  }

  // ============================
  // Remove Coupon
  // ============================
  const removeCoupon = () => {
    checkoutStore.removeCoupon()
    toast.info({
      title: 'Coupon Removed',
      message: 'Coupon has been removed',
      position: 'topCenter',
      duration: 2000
    })
  }

  // ============================
  // Select Payment
  // ============================
  const selectPayment = (paymentId) => {
    checkoutStore.selectPayment(paymentId)
    
    const payment = checkoutStore.paymentMethods.find(p => p.id === paymentId)
    if (payment) {
      toast.success({
        title: 'Payment Selected',
        message: `${payment.name} selected`,
        position: 'topCenter',
        duration: 1500
      })
    }
  }

  // ============================
  // Place Order
  // ============================
  const placeOrder = async (formData, isBuyNow = false, cardId = null, qty = 1) => {
    // Show loading toast
    toast.info({
      title: 'Processing Order',
      message: 'Please wait...',
      position: 'topCenter',
      duration: 2000
    })

    try {
      // Prepare order data
      const orderData = {
        full_name: formData.fullName.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        street_address: formData.address.trim(),
        phone: formData.phone.trim(),
        ip_address: checkoutStore.ipAddress || '0.0.0.0',
        shipping_method: 1,
        payment_id: checkoutStore.selectedPaymentId
      }

      // Only add wallet_number if the selected payment method requires it
      const selectedPaymentMethod = checkoutStore.selectedPayment
      if (selectedPaymentMethod?.wallet_phone_required) {
        // Remove non-numeric characters from phone for wallet number
        const numericPhone = formData.phone.replace(/\D/g, '')
        orderData.wallet_number = numericPhone
      }

      // Add coupon if applied
      if (checkoutStore.appliedCoupon?.code) {
        orderData.coupon = checkoutStore.appliedCoupon.code
      }

      // Add buy now params if applicable
      if (isBuyNow && cardId) {
        orderData.is_buy_now = 1
        orderData.card_id = cardId
        orderData.qty = qty
      }

      console.log('Order data being sent:', orderData)

      // Place order
      const result = await checkoutStore.placeOrder(orderData)

      if (result.success) {
        toast.success({
          title: 'Order Placed',
          message: `Order #${result.orderId} created successfully!`,
          position: 'topCenter',
          duration: 3000
        })

        // Clear cart if not buy now
        if (!isBuyNow) {
          cartStore.clearCart()
        }

        // Redirect to payment link if available
        if (result.paymentLink) {
          setTimeout(() => {
            window.location.href = result.paymentLink
          }, 1000)
        } else {
          // Redirect to orders page
          setTimeout(() => navigateTo('/orders'), 1500)
        }

        return { success: true, orderId: result.orderId }
      } else {
        toast.error({
          title: 'Order Failed',
          message: result.message || 'Failed to place order',
          position: 'topCenter',
          duration: 4000
        })
        return { success: false, message: result.message }
      }
    } catch (err) {
      console.error('Place order error:', err)
      
      toast.error({
        title: 'Order Failed',
        message: err?.data?.message || 'An error occurred while placing your order',
        position: 'topCenter',
        duration: 4000
      })
      return { success: false }
    }
  }

  return {
    initCheckout,
    applyCoupon,
    removeCoupon,
    selectPayment,
    placeOrder
  }
}