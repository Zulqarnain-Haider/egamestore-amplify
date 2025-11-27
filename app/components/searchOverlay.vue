<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-center items-start pt-40"
      @click.self="close"
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
              @input="filterSuggestions"
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
          <ul
            v-if="filtered.length && query"
            class="bg-bgNav mt-3 border border-outline rounded-lg shadow-lg overflow-y-auto"
            style="max-height: 300px"
          >
            <li
              v-for="(game, index) in filtered"
              :key="game.id"
              class="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-outline transition"
              @click="goToResult(game.title)"
            >
              <NuxtImg
                :src="game.image"
                alt=""
                class="w-10 h-10 rounded-md object-cover"
                loading="lazy"
              />
              <span class="text-mainText font-poppins text-sm">{{ game.title }}</span>
            </li>
          </ul>

          <!-- No results message -->
          <div
            v-else-if="query && !loadingSuggestions && filtered.length === 0"
            class="bg-bgNav mt-3 border border-outline rounded-lg p-4 text-center text-onMainText text-sm"
          >
            No games found for “{{ query }}”
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import productsData from '../../data/products.json';

const props = defineProps({
  show: Boolean,
})
const emits = defineEmits(['close'])

const router = useRouter()
const query = ref('')
const filtered = ref([])
const loadingSuggestions = ref(false)
const searchInput = ref(null)

// Cache all products
const allProducts = ref([])

async function loadAllProducts() {
  if (allProducts.value.length) return
  allProducts.value = Array.isArray(productsData) ? productsData : []
}

// Filter suggestions
const filterSuggestions = async () => {
  const q = query.value.trim().toLowerCase()
  if (!q) {
    filtered.value = []
    return
  }

  loadingSuggestions.value = true
  await loadAllProducts()

  filtered.value = allProducts.value
    .filter((g) => g.title?.toLowerCase().includes(q))
    .slice(0, 8)

  loadingSuggestions.value = false
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

// Click on suggestion
const goToResult = async (title) => {
  emits('close')
  await router.push(`/search?q=${encodeURIComponent(title)}`)
  query.value = ''
  filtered.value = []
}

// Close overlay (X button or backdrop)
const close = () => {
  emits('close')
  query.value = ''
  filtered.value = []
}

// Focus input when opened
watch(
  () => props.show,
  async (val) => {
    if (val) {
      await nextTick()
      searchInput.value?.focus()
    }
  }
)
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
</style>
