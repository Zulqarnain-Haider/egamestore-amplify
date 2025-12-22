<template>
  <NuxtLink
    :to="`/product/${card.id}`"
    class="bg-[#1F2227] border border-outline rounded-lg overflow-hidden shadow-md
           flex flex-col transition-all duration-300 hover:scale-[1.04] hover:shadow-lg"
  >
    <!-- Image -->
    <div class="relative px-4 pb-4 pt-6">
      <NuxtImg
        :src="card.img"
        alt="Product Image"
        class="w-full h-44 sm:h-48 md:h-52 rounded-lg object-cover"
        densities="x1"
        quality="80"
        format="webp"
        loading="lazy"
      />

      <!-- Wishlist (static) -->
      <div
        class="absolute flex items-center justify-center top-7 left-7 w-10 h-10
               bg-mainText transition-transform p-2 duration-300
               rounded-full cursor-pointer hover:scale-110"
        @click="onHeartClick"
      >
        <Icon
          :name="liked ? 'heroicons-solid:heart' : 'heroicons:heart'"
          class="w-6 h-6 text-primary transition-all duration-300"
        />
      </div>
    </div>

    <!-- Details -->
    <div class="px-4 pb-10 flex flex-col justify-between flex-1">
      <div class="relative">
        <h3 class="text-mainText font-semibold text-lg mb-1 truncate">
          {{ card.name }}
        </h3>

        <!-- Rating -->
        <div class="flex items-center text-yellow-400 text-xs mb-3">
          <template v-for="i in 5" :key="i">
            <Icon
              class="mr-1"
              :name="i <= starCount
                ? 'mdi:star'
                : 'mdi:star-outline'"
            />
          </template>
          <span class="text-mainText text-[12px] ml-1">
            ({{ card.reviews_count || 0 }})
          </span>
        </div>

        <!-- Seen (static) -->
        <div
          class="absolute top-9 right-3 flex w-12 h-12 items-center justify-center
                 bg-primary/20 transition-transform duration-300 p-3
                 rounded-md cursor-pointer hover:scale-110"
        >
          <Icon
            name="heroicons:eye"
            class="text-primary/70 w-5 h-5"
          />
        </div>

        <!-- Price -->
        <p class="text-mainText font-semibold text-xl">
          ${{ finalPrice }}
        </p>
      </div>

      <!-- Add to Cart -->
      <AppButton
        variant="primary"
        full
        extraClass="mt-3 h-12 flex items-center rounded-full font-semibold
                    text-md justify-center gap-2 py-2"
        :disabled="!isInStock(card)"
        @click.stop.prevent="handleAddToCart"
      >
        <Icon name="mdi:cart-outline" class="w-5 h-5" />
        {{ isInStock(card) ? 'Add to Cart' : 'Out of Stock' }}
      </AppButton>
    </div>
  </NuxtLink>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCart } from '~/composables/useCart'
import { useToast } from '#imports'
import { useStock } from '~/composables/useStock'

const toast = useToast()
const { addToCart } = useCart()
const { isInStock } = useStock()

const liked = ref(false)

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

const finalPrice = computed(() =>
  props.card.price_after_discount > 0
    ? props.card.price_after_discount
    : props.card.price
)

const starCount = computed(() =>
  Math.round(props.card.reviews_avg_rating || 0)
)

const onHeartClick = (e) => {
  e.preventDefault()
  e.stopPropagation()
  liked.value = !liked.value

  toast[liked.value ? 'success' : 'info']({
    title: liked.value ? 'Added' : 'Removed',
    message: liked.value
      ? 'Added to favourites'
      : 'Removed from favourites',
    position: 'bottomRight',
    duration: 2000
  })
}

const handleAddToCart = () => {
  if (!isInStock(props.card)) return
  addToCart(props.card)
}
</script>
