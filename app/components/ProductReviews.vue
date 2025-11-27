<template>
  <section class="font-poppins py-4 md:py-4 shadow-md">
    <h2 class="text-xl md:text-2xl font-semibold mb-6">Customer Reviews</h2>

    <!-- Add Review Box
    <div
      v-if="currentUser"
      class="flex gap-4 mb-8 "
    >
      <img
        :src="currentUser.avatar || '/users/default-avatar.png'"
        alt="User Avatar"
        class="w-12 h-12 rounded-full object-cover"
      />
      <div class="flex flex-col flex-1">
        <textarea
          v-model="newReview.text"
          placeholder="Write your review..."
          class="bg-transparent border border-outline rounded-lg px-3 py-2 w-full resize-none text-sm text-mainText focus:ring-2 focus:ring-outline"
          rows="3"
        />
        <div class="flex items-center justify-between mt-3">
          <div class="flex items-center gap-1 text-yellow-400 text-sm">
            <template v-for="star in 5" :key="star">
              <i
                class="cursor-pointer"
                :class="[
                  newReview.rating >= star
                    ? 'fa-solid fa-star'
                    : 'fa-regular fa-star'
                ]"
                @click="newReview.rating = star"
              ></i>
            </template>
          </div>

          <UiButton
            variant="primary"
            :height="36"
            extraClass="px-5 py-2 text-xs rounded-lg"
            @click="addReview"
          >
            Post Review
          </UiButton>
        </div>
      </div>
    </div> -->

    <!-- No user logged in -->
    <!-- <div v-else class="text-lg text-onMainText mb-8 justify-center items-center">
      Please <NuxtLink to="/auth/login" class="text-primary underline">sign in</NuxtLink> to add a review.
    </div> -->

    <!-- 🔹 Reviews List -->
    <div v-if="reviews.length" class="space-y-8 max-h-[650px] overflow-y-auto scrollbar-hide pr-2">
      <div
        v-for="r in reviews"
        :key="r.id"
        class="rounded-md border-b border-outline pb-4"
      >
        <div class="flex items-center gap-4 mb-3">
          <div class="space-y-5">
                    <!--⭐Rating -->
            <div class="flex text-yellow-400 text-sm mt-1">
              <template v-for="star in 5" :key="star">
                <i
                  :class="[
                    r.rating >= star ? 'fa-solid fa-star' : 'fa-regular fa-star'
                  ]"
                ></i>
              </template>
            </div>
                    <!-- Review Text -->
            <p class="text-sm text-mainText leading-relaxed">
          {{ r.text }}
        </p>
                <!-- Date + Time -->
          <p class="text-md text-onMainText">{{ formatDate(r.date) }}</p>
                  <!-- User Info -->
          <div class="flex items-center gap-3">
           <NuxtImg 
           densities="x1" quality="80" loading="lazy" format="webp"
            :src="r.avatar || '/users/default-avatar.png'"
            alt="User"
            class="w-10 h-10 rounded-full object-cover"
          />
           <h4 class="text-md">{{ r.name }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-onMainText text-sm italic">No reviews yet.</div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  reviews: Array,
  currentUser: Object
})

const emit = defineEmits(['update:reviews'])

const newReview = ref({
  text: '',
  rating: 0
})

// ⭐ Add new review logic
function addReview() {
  if (!newReview.value.text || newReview.value.rating === 0) {
    alert('Please add rating and comment.')
    return
  }

  const review = {
    id: Date.now(),
    name: props.currentUser?.name || 'Anonymous',
    avatar: props.currentUser?.avatar || '/users/default-avatar.png',
    rating: newReview.value.rating,
    text: newReview.value.text,
    date: new Date().toISOString()
  }

  const updated = [...props.reviews, review]
  emit('update:reviews', updated)

  // Reset form
  newReview.value.text = ''
  newReview.value.rating = 0
}

// 📅 Format date (2025-10-24 → Oct 24, 2025)
function formatDate(dateStr) {
  const d = new Date(dateStr)
  const date =  d.toLocaleDateString('en-US', 
  { month: 'short', day: 'numeric',year: 'numeric' })

   const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // 24-hour format like 03:29, 14:45 etc.
  })
  return `${date} ${time}`
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>