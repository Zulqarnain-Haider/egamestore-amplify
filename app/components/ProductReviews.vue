<template>
  <section class="font-poppins py-4 shadow-md">
    <h2 class="text-xl md:text-2xl font-semibold mb-6">
      {{ t('customerReviewsTitle') }}
    </h2>

    <!-- ADD REVIEW (logged in + purchased only) -->
    <div
      v-if="canReview"
      class="flex gap-4 mb-8"
    >
      <NuxtImg
        :src="userAvatar"
        alt="User"
        class="w-12 h-12 rounded-full object-cover"
        densities="x1"
        format="webp"
        loading="lazy"
      />

      <div class="flex flex-col flex-1">
        <textarea
          v-model="newReview.comment"
          :placeholder="t('writeReviewPlaceholder')"
          class="bg-transparent border border-outline rounded-lg
                 px-3 py-2 w-full resize-none text-sm text-mainText
                 focus:ring-2 focus:ring-outline"
          rows="3"
        />

        <div class="flex items-center justify-between mt-3">
          <!-- Rating -->
          <div class="flex items-center gap-1 text-yellow-400 text-sm">
            <template v-for="star in 5" :key="star">
              <i
                class="cursor-pointer"
                :class="newReview.rating >= star
                  ? 'fa-solid fa-star'
                  : 'fa-regular fa-star'"
                @click="newReview.rating = star"
              />
            </template>
          </div>

          <AppButton
            variant="primary"
            :height="36"
            extraClass="px-5 py-2 text-xs rounded-lg"
            :disabled="submitting"
            @click="submitReview"
          >
            {{ submitting ? t('postingReview') : t('postReview') }}
          </AppButton>
        </div>
      </div>
    </div>

    <!-- SKELETON LOADER -->
    <div
      v-if="loading"
      class="space-y-6 animate-pulse"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="flex gap-4"
      >
        <div class="w-10 h-10 rounded-full bg-[#2A2E35]"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 w-24 bg-[#2A2E35] rounded"></div>
          <div class="h-3 w-full bg-[#2A2E35] rounded"></div>
          <div class="h-3 w-5/6 bg-[#2A2E35] rounded"></div>
        </div>
      </div>
    </div>

    <!-- REVIEWS LIST -->
    <div
      v-else-if="reviews.length"
      class="space-y-8 max-h-[650px] overflow-y-auto scrollbar-hide pr-2"
    >
      <div
        v-for="r in reviews"
        :key="r.id"
        class="rounded-md border-b border-outline pb-4"
      >
        <!-- Rating -->
        <div class="flex text-yellow-400 text-sm mb-2">
          <template v-for="star in 5" :key="star">
            <i
              :class="r.rating >= star
                ? 'fa-solid fa-star'
                : 'fa-regular fa-star'"
            />
          </template>
        </div>

        <!-- Comment -->
        <p class="text-sm text-mainText leading-relaxed">
          {{ r.comment }}
        </p>

        <!-- Date -->
        <p class="text-sm text-onMainText mt-1">
          {{ formatDate(r.created_at) }}
        </p>

        <!-- User -->
        <div class="flex items-center gap-3 mt-3">
          <NuxtImg
            :src="reviewAvatar"
            class="w-10 h-10 rounded-full object-cover"
            densities="x1"
            format="webp"
            loading="lazy"
          />
          <h4 class="text-md">
            {{ r.user?.email || t('reviewAnonymousUser') }}
          </h4>
        </div>
      </div>
    </div>

    <p
      v-else
      class="text-onMainText text-sm italic"
    >
      {{ t('noReviewsYet') }}
    </p>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '~/stores/userStore'
import { useToast, useRuntimeConfig } from '#imports'

const { t, locale } = useI18n()
const toast = useToast()
const config = useRuntimeConfig()
const userStore = useUserStore()

/* ---------------- PROPS ---------------- */
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  reviews: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

/* ---------------- STATE ---------------- */
const submitting = ref(false)

const newReview = ref({
  rating: 0,
  comment: ''
})

/* ---------------- COMPUTED ---------------- */
const cardId = computed(() => props.product?.id)

const canReview = computed(() =>
  userStore.currentUser &&
  props.product?.user_has_purchased
)

/* AVATARS */
const userAvatar = computed(() =>
  userStore.currentUser?.avatar || '/games/Reviews.png'
)

const reviewAvatar = '/games/Reviews.png'

/* ---------------- METHODS ---------------- */
const submitReview = async () => {
  if (!cardId.value) {
    return toast.error({
      title: t('errorTitle'),
      message: t('invalidProductId')
    })
  }

  if (newReview.value.rating < 1 || newReview.value.rating > 5) {
    return toast.error({
      title: t('invalidRatingTitle'),
      message: t('invalidRatingMessage')
    })
  }

  if (newReview.value.comment.length < 2) {
    return toast.error({
      title: t('invalidCommentTitle'),
      message: t('invalidCommentMessage')
    })
  }

  submitting.value = true

  try {
    const form = new FormData()
    form.append('rating', newReview.value.rating)
    form.append('comment', newReview.value.comment)

    const res = await $fetch(
      `${config.public.apiBase}/cards/${cardId.value}/reviews`,
      {
        method: 'POST',
        body: form,
        headers: {
          Authorization: `Bearer ${userStore.token}`,
          lang: locale.value
        }
      }
    )

    if (!res?.status) {
      throw new Error(res?.message || t('reviewFailed'))
    }

    toast.success({
      title: t('reviewSubmittedTitle'),
      message: t('reviewSubmittedMessage')
    })

    newReview.value.rating = 0
    newReview.value.comment = ''
  } catch (err) {
    toast.error({
      title: t('reviewErrorTitle'),
      message: err.message || t('reviewErrorMessage')
    })
  } finally {
    submitting.value = false
  }
}

const formatDate = (date) => {
  const d = new Date(date)
  return (
    d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) +
    ' ' +
    d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  )
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
