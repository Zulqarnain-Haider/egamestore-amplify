import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#imports'

export const useProductStore = defineStore('product', () => {
  /**
   * STATE
   * ----------------------------------
   * loading MUST start as true
   * so SSR + first render always shows skeleton
   */
  const product = ref(null)
  const relatedProducts = ref([])
  const loading = ref(true) // critical for SSR
  const error = ref(null)

  /**
   * FETCH PRODUCT
   */
  const fetchProduct = async (cardId) => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()

      const res = await $fetch(
        `${config.public.apiBase}/cards/getCardDetails`,
        {
          params: {
            card_id: cardId,
            page: 15
          },
          headers: {
            lang: 'en'
          }
        }
      )

      if (!res?.status || !res?.data?.card) {
        throw new Error('Product not found')
      }

      const card = res.data.card

      /**
       * MAIN PRODUCT
       * ----------------------------------
       * Keep API shape intact
       * Add helpers only
       */
      product.value = {
        ...card,
        final_price:
          card.price_after_discount > 0
            ? card.price_after_discount
            : card.price,
        old_price:
          card.price_after_discount > 0
            ? card.price
            : null
      }

      /**
       * RELATED PRODUCTS
       */
      relatedProducts.value =
        (res.data.related_cards?.cards || []).map(c => ({
          ...c,
          final_price:
            c.price_after_discount > 0
              ? c.price_after_discount
              : c.price
        }))
    } catch (err) {
      console.error('Product fetch failed:', err)
      error.value = err.message || 'Failed to load product'
      product.value = null
    } finally {
      /**
       * loading must be false ONLY after fetch completes
       */
      loading.value = false
    }
  }

  return {
    product,
    relatedProducts,
    loading,
    error,
    fetchProduct
  }
})
