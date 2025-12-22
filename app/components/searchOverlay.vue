<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-center items-start pt-40 overflow-y-auto"
      @click.self="close"
      @wheel.prevent
      @touchmove.prevent
      @scroll.prevent
    >
      <div class="relative w-full max-w-2xl">
        <!-- Wrapper with consistent horizontal padding -->
        <div class="px-4">
          <!-- Search Box -->
          <div
            class="bg-bgNav border border-outline rounded-xl flex items-center px-4 py-3 shadow-lg w-full"
          >
            <Icon name="mdi:magnify" class="text-primary w-6 h-6 mr-2" />
            <input
              v-model="query"
              @input="debouncedSearch"
              @keyup.enter="handleEnter"
              type="text"
              placeholder="Search games..."
              class="w-full bg-transparent text-mainText placeholder:text-onMainText outline-none font-poppins text-sm"
              autofocus
              ref="searchInput"
            />
            <Icon
              name="mdi:close"
              class="text-gray-400 hover:text-primary cursor-pointer w-6 h-6"
              @click="close"
            />
          </div>
        </div>

        <!-- Suggestions Dropdown -->
        <div class="px-4">
          <!-- Loading State -->
          <div
            v-if="loadingSuggestions && query"
            class="bg-bgNav mt-3 border border-outline rounded-lg p-4 text-center"
          >
            <Icon name="mdi:loading" class="w-6 h-6 text-primary animate-spin mx-auto" />
            <p class="text-onMainText text-sm mt-2">Searching...</p>
          </div>

          <!-- Suggestions List -->
          <ul
            v-else-if="filtered.length && query"
            class="bg-bgNav mt-3 border border-outline rounded-lg shadow-lg overflow-y-auto"
            style="max-height: 300px"
            @wheel.stop
            @touchmove.stop
          >
            <li
              v-for="game in filtered"
              :key="game.id"
              class="hover:bg-outline transition"
            >
              <NuxtLink
                :to="`/product/${game.id}`"
                class="px-4 py-2 flex items-center gap-3 cursor-pointer"
                @click="close"
              >
                <NuxtImg
                  :src="game.img"
                  alt=""
                  class="w-10 h-10 rounded-md object-cover"
                  loading="lazy"
                />
                <span class="text-mainText font-poppins text-sm">{{ game.name }}</span>
              </NuxtLink>
            </li>
          </ul>

          <!-- No results message -->
          <div
            v-else-if="query && !loadingSuggestions && filtered.length === 0"
            class="bg-bgNav mt-3 border border-outline rounded-lg p-4 text-center text-onMainText text-sm"
          >
            No games found for "{{ query }}"
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  show: Boolean,
})
const emits = defineEmits(['close'])

const config = useRuntimeConfig()
const router = useRouter()
const query = ref('')
const filtered = ref([])
const loadingSuggestions = ref(false)
const searchInput = ref(null)

let debounceTimer = null

// Lock/unlock body scroll
const lockScroll = () => {
  if (process.client) {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
  }
}

const unlockScroll = () => {
  if (process.client) {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}

// Debounced search function
const debouncedSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetchSuggestions()
  }, 400) // Wait 400ms after user stops typing
}

// Fetch suggestions from API
const fetchSuggestions = async () => {
  const searchTerm = query.value.trim()
  
  if (!searchTerm) {
    filtered.value = []
    return
  }

  loadingSuggestions.value = true

  try {
    const response = await $fetch(`${config.public.apiBase}/products/search`, {
      params: {
        search: searchTerm
      }
    })

    if (response.status && response.data) {
      // Combine products and cards from the API response
      const products = response.data.products?.products || []
      const cards = response.data.cards?.cards || []
      
      // Merge both arrays and limit to 8 results
      filtered.value = [...products, ...cards].slice(0, 8)
    } else {
      filtered.value = []
    }
  } catch (error) {
    console.error('Search error:', error)
    filtered.value = []
  } finally {
    loadingSuggestions.value = false
  }
}

// Go to search page on Enter
const handleEnter = async () => {
  const searchTerm = query.value.trim()
  if (!searchTerm) return

  emits('close')
  await router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
  query.value = ''
  filtered.value = []
}

// Close overlay (X button or backdrop)
const close = () => {
  emits('close')
  query.value = ''
  filtered.value = []
  clearTimeout(debounceTimer)
}

// Focus input when opened and handle scroll lock
watch(
  () => props.show,
  async (val) => {
    if (val) {
      lockScroll()
      await nextTick()
      searchInput.value?.focus()
    } else {
      unlockScroll()
      // Clear when closing
      query.value = ''
      filtered.value = []
      clearTimeout(debounceTimer)
    }
  }
)

// Cleanup on unmount
onBeforeUnmount(() => {
  unlockScroll()
  clearTimeout(debounceTimer)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

ul::-webkit-scrollbar {
  width: 6px;
}

ul::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
}

ul::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>