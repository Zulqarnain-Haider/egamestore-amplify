<template>
  <section class="py-">
    <!--Tabs Header -->
    <div class="flex flex-wrap gap-4 md:gap-6 border-b px-3 border-onMainText mb-6">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        class="pb-2 text-sm md:text-base font-medium transition-all duration-300"
        :class="[activeTab === tab ? 'text-primary font-semibold' : 'text-mainText hover:text-primary']"
      >
        {{ tab }}
      </button>
    </div>

    <!--System Requirements -->
    <div
      v-if="activeTab === 'System Requirements'"
      class="text-mainText text-md md:text-base border rounded-lg border-onFooter bg-[#282C32] p-4 mx-2 leading-relaxed"
    >
      <p>
        {{ product?.systemRequirements || 
        'Get ready for the most exciting football game of 2025! FC25 brings updated squads, realistic gameplay, and stunning graphics. Play in multiple modes – Quick Match, Career, Tournament, or Online Multiplayer – and build your dream team in Ultimate Team mode. With smarter AI, VAR technology, and new stadiums, every match feels just like the real game. Available on PlayStation, Xbox, PC, and Mobile.' }}
      </p>
    </div>

    <!--Description: Image + Video -->
<div
  v-else-if="activeTab === 'Description'"
  class="relative flex items-center gap-8 rounded-lg mx-2 overflow-x-auto scrollbar-hide p-4 scroll-smooth"
>
  <!-- Wrapper (horizontal track) -->
  <div class="flex gap-8 min-w-max">

    <!--Pair 1 -->
    <div class="flex flex-row gap-6 flex-shrink-0 w-[100%]">
      <!-- Left Image (60–65% visible on screen) -->
      <div class="flex-[0.35]">
        <NuxtImg
          :src="previewImage"
          alt="Product Preview"
          class="rounded-xl object-cover w-full h-[350px] md:h-[400px] shadow-md"
          loading="lazy"
          format="webp"
        />
      </div>

      <!-- Right Video (slightly peeking out of screen) -->
      <div class="flex-[0.30]">
        <video
          class="rounded-xl shadow-md w-full h-[350px] md:h-[400px]"
          controls
          :poster="videoPoster"
        >
          <source :src="videoSource" type="video/mp4" />
          Your browser does not support video playback.
        </video>
      </div>
    </div>

    <!--Pair 2 -->
    <div class="flex flex-row gap-6 flex-shrink-0 w-[100%]">
      <div class="flex-[0.35]">
        <NuxtImg
          src="/games/DescriptionImage.png"
          alt="Extra Preview"
          class="rounded-xl object-cover w-full h-[350px] md:h-[400px] shadow-md"
          loading="lazy"
          format="webp"
        />
      </div>

      <div class="flex-[0.30]">
        <video
          class="rounded-xl shadow-md w-full h-[350px] md:h-[400px]"
          controls
          poster="/games/DescriptionVideo.png"
        >
          <source src="" type="video/mp4" />
          Your browser does not support video playback.
        </video>
      </div>
    </div>

  </div>
</div>



    <!--Reviews -->
    <div v-else-if="activeTab === 'Reviews'" class="mx-2">
      <ProductReviews
        :reviews="product?.reviews || []"
        :currentUser="currentUser"
        @update:reviews="$emit('update:reviews', $event)"
      />
    </div>

    <!--Support -->
    <div
      v-else-if="activeTab === 'Support'"
      class="text-mainText text-sm md:text-base border rounded-lg border-onFooter bg-[#282C32] p-4 mx-2 leading-relaxed"
    >
      <h3 class="text-lg font-semibold mb-2 text-primary">Need Help?</h3>
      <p class="text-onMainText mb-2">
        For any issues related to your purchase, key activation, or downloads — our 24/7 support team is here to help.
      </p>
      <ul class="list-disc ml-5 space-y-1 text-onMainText">
        <li>Email us: <span class="text-primary">support@gamestore.com</span></li>
        <li>Live Chat available on all product pages</li>
        <li>Average response time: under 10 minutes</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  product: { type: Object, default: () => ({}) },
  currentUser: Object
})

const tabs = ['System Requirements', 'Description', 'Reviews', 'Support']
const activeTab = ref('Description')


//Temporary static placeholders for Figma demo
const previewImage = computed(() => '/games/DescriptionImage.png')  // your figma image path
const videoPoster = computed(() => '/games/DescriptionVideo.png')    // video placeholder image
const videoSource = computed(() => '/games/DescriptionVideo')   // optional sample video

</script>

<style>
/* Hide scrollbar cross-browser */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
    scroll-behavior: smooth;
}
</style>