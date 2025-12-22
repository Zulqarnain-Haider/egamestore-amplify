import { computed } from 'vue'
import { useRoute } from 'vue-router'

export const useCategoryContext = () => {
  const route = useRoute()

  return {
    categoryId: computed(() => route.params.categoryId),
    subcategoryId: computed(() => route.params.subcategoryId),
    countryId: computed(() => route.params.countryId),
  }
}
