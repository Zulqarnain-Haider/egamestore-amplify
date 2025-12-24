<template>
  <div :class="['w-full flex items-start gap-3', isUser ? 'justify-end' : 'justify-start']">
    <!-- left avatar for support, right avatar for user -->
    <NuxtImg
    densities="x1"
     quality="80" format="webp" loading="lazy"
     v-if="!isUser" :src="message.avatar || '/wallet/AkexChatImg.png' "
      alt="avatar" class="w-9 h-9 rounded-full object-cover" 
      />
    <div class="max-w-[78%] font-inter">
      <div class="flex items-center gap-2 text-xs mb-1"
        :class="isUser ? 'flex-row-reverse text-right' : 'justify-start'"
        >
        <p class="text-sm font-semibold font-inter" :class="isUser ? 'text-mainText text-right' : 'text-mainText'">
          {{ isUser ? (name || 'You') : (supportName || 'Support') }}
        </p>
        <span class="text-onFooter text-[11px]">{{ formatTime(message.time) }}</span>
      </div>

      <!-- bubble -->
      <div v-if="message.text != ''"
        :class="[
          'px-4 py-3 text-sm break-words font-inter max-w-96',
          isUser ? 'text-white' : 'text-mainText/70',
          isUser ? 'bg-chat-gradient' : 'bg-[#2E364A]'
        ]"
        :style="bubbleStyle"
      >
        {{ message.text }}
      </div>
      <div v-if="message.images?.length" class="mt-2 flex flex-wrap gap-2"
      :class="[
          'px-4 py-3 text-sm break-words font-inter max-w-96',
          isUser ? 'text-white' : 'text-mainText/70',
          isUser ? 'bg-chat-gradient' : 'bg-[#2E364A]'
        ]"
        :style="bubbleStyle">
        <img
          v-for="img in message.images"
          :key="img.id || img.image"
          :src="img.img || img.image"
          class="w-32 h-32 object-cover rounded-lg border border-onFooter/20 cursor-pointer"
          @click="openPreview(img.img || img.image)"
        />
      </div>
    </div>
    <NuxtImg 
    densities="x1"
    quality="80"
    format="webp" loading="lazy" 
    v-if="isUser" :src="message.avatar || '/wallet/UserChatImg.png'"
     alt="avatar" class="w-9 h-9 rounded-full object-cover" />
  </div>
</template>

<script setup>
const props = defineProps({
  message: { type: Object, required: true },
  name: { type: String, default: 'Customer' },
  supportName: { type: String, default: 'Support' }
})

const isUser = computed(() => props.message.sender === 'user')

function formatTime(t) {
  try {
    const d = new Date(t)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

// corner style: one plain corner near avatar (Figma style)
// We'll approximate with border-radius and custom style
const bubbleStyle = computed(() => {
  if (isUser.value) {
    // user (right): square top-right corner
    return {
      borderRadius: '10px 0px 10px 10px' // top-left, top-right, bottom-right, bottom-left
    }
  } else {
    // support (left): square top-left corner
    return {
      borderRadius: '0px 10px 10px 10px'
    }
  }
})

function openPreview(src) {
  window.open(src, '_blank')
}
</script>

<style scoped>
/* tiny adjustments for mobile */
@media (max-width: 640px) {
  .max-w-\[78\%\] {
    max-width: 90% !important;
  }
}
</style>
