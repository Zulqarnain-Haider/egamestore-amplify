// stores/productStore.js
import { defineStore } from 'pinia'
import { useProductsStore } from '~/stores/productsStore'
import productData from '../../../data/products.json'  // JSON wapas add karo (static products ke liye)

export const useProductStore = defineStore('product', () => {
  const product = ref(null)
  const relatedProducts = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchProduct = async (id) => {
    loading.value = true
    error.value = null
    try {
      // 1. Pehle JSON (static products) mein check karo
      const jsonProducts = productData || []
      const jsonProduct = jsonProducts.find(p => p.id === Number(id))

      if (jsonProduct) {
        product.value = jsonProduct
        relatedProducts.value = jsonProducts.filter(p => p.category === jsonProduct.category && p.id !== jsonProduct.id)
        return  // Early return, kyunki mila
      }

      // 2. Phir productsStore (API se aaye products) mein check karo
      const productsStore = useProductsStore()
      const apiProducts = productsStore.products || []
      const apiProduct = apiProducts.find(p => p.id === Number(id))

      if (apiProduct) {
        // API se mila, map karo (same as detail API mapping, assume fields similar hain)
        product.value = {
          id: apiProduct.id,
          title: apiProduct.name,
          image: apiProduct.img,
          price: apiProduct.price_after_discount || apiProduct.price,
          oldPrice: apiProduct.price_after_discount ? apiProduct.price : null,
          rating: apiProduct.reviews_avg_rating * 20 || 0,
          platforms: [apiProduct.platform?.name] || [],
          regions: apiProduct.regions || [],
          category: apiProduct.sub_sub_category?.name || 'games',
          delivery: apiProduct.delivery_time || 'Online',
          reviews: apiProduct.reviews || [],
          systemRequirements: apiProduct.system_requirement || '',
          releaseDate: apiProduct.created_at,
          buttonText: apiProduct.type === 1 ? 'Buy Now' : 'Pre-Order',
        }
        relatedProducts.value = apiProducts.filter(p => p.category === product.value.category && p.id !== product.value.id)
        return  // Early return
      }

      // 3. Agar dono mein nahi mila, to detail API se fetch karo
      const response = await $fetch(`https://api.egamestore.com/api/cards/getCardDetails?card_id=${id}&page=15`, {
        headers: { lang: 'en' }
      })

      if (response.status && response.data) {
        const card = response.data.card
        product.value = {
          id: card.id,
          title: card.name,
          image: card.img,
          price: card.price_after_discount || card.price,
          oldPrice: card.price_after_discount ? card.price : null,
          rating: card.reviews_avg_rating * 20 || 0,
          platforms: [card.platform.name],
          regions: card.regions,
          category: card.sub_sub_category?.name || 'games',
          delivery: card.delivery_time || 'Online',
          reviews: card.reviews || [],
          systemRequirements: card.system_requirement,
          releaseDate: card.created_at,
          buttonText: card.type === 1 ? 'Buy Now' : 'Pre-Order',
        }
        relatedProducts.value = response.data.related_cards.cards.map(card => ({
          id: card.id,
          title: card.name,
          image: card.img,
          price: card.price_after_discount || card.price,
          oldPrice: card.price_after_discount ? card.price : null,
          rating: card.reviews_avg_rating * 20 || 0,
          platforms: [card.platform.name],
          regions: card.regions,
          category: card.sub_sub_category?.name || 'games',
        }))
      } else {
        throw new Error('API response invalid')
      }
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch product:', err)
    } finally {
      loading.value = false  // Yeh hamesha chale ga
    }
  }

  return { product, relatedProducts, loading, error, fetchProduct }
})