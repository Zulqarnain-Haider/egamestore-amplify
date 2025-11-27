<template>
  <NuxtLink :to="`/product/${product.id}`"
    class="bg-[#1F2227] border border-outline rounded-lg overflow-hidden shadow-md flex flex-col 
    transition-all duration-300 hover:scale-[1.04] hover:shadow-lg"
  >
    <!--Image Section ===== -->
    <div class="relative px-4 pb-4 pt-6">
      <NuxtImg
        :src="image"
        alt="Product Image"
        class="w-full h-44 sm:h-48 md:h-52 rounded-lg object-cover"
        densities="x1"
        quality="80"
        format="webp"
        loading="lazy"
      />

      <!--Heart -->
      <div
        class="absolute flex items-center justify-center top-7 left-7 w-10 h-10 bg-mainText transition-transform p-2 duration-300
        rounded-full cursor-pointer hover:scale-110"
        @click="onHeartClick"
      >
        <Icon
         :name="liked ? 'heroicons-solid:heart' : 'heroicons:heart'"
          class="w-6 h-6 text-primary transition-all duration-300"
        />
      </div>
    </div>

    <!-- ===== Details Section ===== -->
    <div class="px-4 pb-10 flex flex-col justify-between flex-1">
      <div class="relative">
        <h3 class="text-mainText font-semibold text-lg mb-1 truncate">
          {{ title }}
        </h3>

        <!--Rating (Font Awesome) -->
        <div class="flex items-center text-yellow-400 text-xs mb-3">
          <template v-for="i in 5" :key="i">
            <Icon
              class="mr-1"
              :name="i <= Math.round(rating / 20)
                  ? 'mdi:star'
                  : 'mdi:star-outline'
              "
            />
          </template>
          <span class="text-mainText text-[12px] ml-1">({{ rating }})</span>
        </div>
  
          <!--Eye -->
      <div
        class="absolute top-9 right-3 flex w-12 h-12 items-center justify-center text-center bg-primary/20 transition-transform duration-300 p-3
         rounded-md cursor-pointer hover:scale-110"
      >
        <Icon name="heroicons:eye"
          class="text-primary/70 w-5 h-5"
        />
      </div> 

        <!--Price -->
        <p class="text-mainText font-semibold text-xl">
          ${{ price }}
        </p>
      </div>

      <!--Add to Cart -->
      <AppButton
        variant="primary"
        full
        extraClass="mt-3 h-12 flex items-center rounded-full font-semibold text-md justify-center gap-2 py-2"
          @click.stop.prevent="handleAddToCart"
      >
        <Icon name="mdi:cart-outline" class="font-semibold w-5 h-5"
        />
        Add to Cart
      </AppButton>
    </div>
  </NuxtLink>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCart } from '~/composables/useCart.js'
import { useToast } from '#imports' 

const toast = useToast()  // Define toast

const { addToCart } = useCart()

const liked = ref(false)

const onHeartClick = (event) => {
   event.preventDefault()       // <-- prevent NuxtLink navigation
   event.stopPropagation() // Prevent NuxtLink trigger
  liked.value = !liked.value

  if (liked.value) {
    toast.success({
      title: 'Success!',
      message: 'Added to Favourites!',
      position: 'bottomRight',
      duration: 2000,
      pauseOnHover: true,
      class: 'bg-[#1E1F22] text-white border-l-4 border-green-500'
    })
  } else {
    toast.info({
      title: 'Info',
      message: 'Removed from Favourites',
      position: 'bottomRight',
      duration: 2000,
      pauseOnHover: true,
      class: 'bg-[#1E1F22] text-white border-l-4 border-yellow-500'
    })
  }
}

const props = defineProps({
  image: { type: String, default: '/games/RelatedItem.png' },
  title: { type: String, default: 'Minecraft Java Edition' },
  price: { type: [String, Number], default: '1,249.99' },
  rating: { type: [String, Number], default: 80 },
})

// product must be computed!
const product = computed(() => ({
  id: 'related-' + props.title.replace(/\s+/g, '-').toLowerCase(),
  image: props.image,
  title: props.title,
  price: Number(props.price),
  rating: Number(props.rating),
  platforms: ['PC', 'Xbox', 'PlayStation'], // static for now
  regions: ['Global'], 
}))


const handleAddToCart = () => {
  console.log('Adding product:', product.value) // test
  addToCart(product.value)
}

</script>

