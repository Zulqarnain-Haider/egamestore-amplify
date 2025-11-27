<template>
  <div class="flex flex-col font-inter text-mainText">

    <!-- ===== Header (Filters + Clear) ===== -->
    <div class="flex justify-between items-center mb-5">
      <h3 class="text-xl ">Filters</h3>

      <button
        @click="clearFilters"
        class="text-md px-5 py-2 rounded-full border border-onOutline text-mainText hover:bg-outline hover:text-white hover:border-primary"
      >
        Clear All
      </button>
    </div>

    <!-- ===== Sidebar Body ===== -->
    <aside
      class="w-68 bg-[#272B31] border border-outline rounded-lg p-6 overflow-y-auto shadow-md space-y-8 scrollbar-hide"
    >

      <!--Genre Section -->
      <div>
        <div class="flex justify-between items-center mb-3 cursor-pointer select-none"
         @click="toggleSection('genre')"
        >
          <h4 class="text-lg font-medium">Genre</h4>
          <Icon name="mdi:chevron-up"
           class="w-9 h-9 text-mainText transition-transform duration-300"
          :class="{ 'rotate-180': !openSections.genre }"
         />
        </div>

         <transition
          name="slide-fade"
          mode="out-in"
        >
        <div v-if="openSections.genre">
        <!--All Genres Option -->
        <div class="flex items-center justify-between mb-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              value="All Genres"
              v-model="selectedGenres"
              @change="handleAllGenres"
              class="accent-primary cursor-pointer appearance-none w-4 h-4 bg-mainText checked:bg-primary checked:before:content-['✓']
               checked:before:text-white checked:before:text-xs checked:before:flex checked:before:items-center checked:before:justify-center"
            />
            <span class="text-md">All Genres</span>
          </label>
          <span class="text-md text-mainText">({{ totalCount }})</span>
        </div>

        <!--Other Genre Options -->
        <div
          v-for="g in genresList"
          :key="g.name"
          class="flex items-center justify-between mb-2"
        >
          <label class="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              :value="g.name"
              v-model="selectedGenres"
              @change="handleGenreChange"
              class="accent-primary cursor-pointer appearance-none w-4 h-4 bg-mainText checked:bg-primary checked:before:content-['✓'] checked:before:text-white checked:before:text-xs checked:before:flex checked:before:items-center checked:before:justify-center"
            />
            <span class="text-md">{{ g.name }}</span>
          </label>
          <span class="text-md text-mainText">({{ g.count }})</span>
        </div>
      </div>
        </transition>
      </div>

      <hr class="text-mainText" />

      <!--Price Section -->
      <div>
        <div class="flex justify-between items-center mb-3 cursor-pointer select-none"
        @click="toggleSection('price')"
       >
          <h4 class="text-lg font-medium">Price</h4>
          <Icon name="mdi:chevron-up" 
          class="text-mainText w-9 h-9 transition-transform duration-300"
         :class="{ 'rotate-180': !openSections.price }"
           />
        </div>


           <!--Animated Price Section -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="openSections.price">
        <!--Range Slider -->
        <input
          type="range"
          :min="0"
          :max="500"
          step="5"
          v-model.number="maxPrice"
          class="w-full range-slider"
          @input="updateRangeBackground"
          ref="range"
        />

        <!--Price Display -->
        <div class="flex gap-3 items-center mt-5 mb-5">
          <div
            class="w-20 py-2 px-2 rounded-xl bg-bgDark text-mainText text-md border border-onMainText text-left"
          >
            {{ minPrice }}
          </div>
          <span class="text-sm text-onMainText">—</span>
          <div
            class="w-20 py-2 px-2 rounded-xl bg-bgDark text-mainText text-md border border-onMainText text-left"
          >
            ${{ maxPrice }}
          </div>
        </div>
        </div>
           </transition>

        <hr class="text-mainText" />
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'

/* -------------------- Props & Emits -------------------- */
const props = defineProps({
  genresList: {
    type: Array,
    default: () => [
      { name: 'Action', count: 18 },
      { name: 'Adventure', count: 12 },
      { name: 'Racing', count: 23 },
      { name: 'Puzzle', count: 67 },
      { name: 'Simulation', count: 34 }
    ]
  }
})

const emit = defineEmits(['update:modelValue', 'clear'])

/* -------------------- States -------------------- */
const selectedGenres = ref(['All Genres'])
const minPrice = ref(0)
const maxPrice = ref(500)
const range = ref(null)
const maxLimit = 500


/* Accordion open/close state */
const openSections = ref({ genre: true, price: true })

/* -------------------- Computed -------------------- */
const totalCount = computed(() =>
  props.genresList.reduce((sum, g) => sum + g.count, 0)
)

/* -------------------- Methods -------------------- */
function updateRangeBackground() {
  const percent = (maxPrice.value / maxLimit) * 100
  if (range.value) {
    range.value.style.background = `linear-gradient(to right, #FF6A16 ${percent}%, white ${percent}%)`
  }
}

onMounted(() => {
  const isMobile = window.innerWidth < 768; // md breakpoint

  openSections.value.genre = !isMobile; // mobile → closed, desktop → open
  openSections.value.price = !isMobile;

  updateRangeBackground();

  // Resize handle (optional)
  window.addEventListener("resize", () => {
    const isMobile = window.innerWidth < 768;
    openSections.value.genre = !isMobile;
    openSections.value.price = !isMobile;
  });
});


function emitFilters() {
  //If "All Genres" is selected → treat it as no genre filter
  const genresToSend = selectedGenres.value.includes('All Genres')
    ? []
    : selectedGenres.value

  emit('update:modelValue', {
    genres: genresToSend,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value
  })
}

function clearFilters() {
  selectedGenres.value = ['All Genres']
  minPrice.value = 0
  maxPrice.value = 500
  updateRangeBackground()
  emit('clear')
  emitFilters() // send "show all" again
}

function handleAllGenres() {
  if (selectedGenres.value.includes('All Genres')) {
    //Only keep "All Genres" selected
    selectedGenres.value = ['All Genres']
    emitFilters() // will now send empty genre array (show all)
  }
}

function handleGenreChange() {
  // If any genre selected, unselect "All Genres"
  if (selectedGenres.value.includes('All Genres') && selectedGenres.value.length > 1) {
    selectedGenres.value = selectedGenres.value.filter(g => g !== 'All Genres')
  }
  emitFilters()
}

/* Accordion toggle */
function toggleSection(section) {
  openSections.value[section] = !openSections.value[section]
}

/* -------------------- Watchers -------------------- */
watch(maxPrice, emitFilters)
onMounted(() => updateRangeBackground())
</script>


<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
.scrollbar-hide {
  scrollbar-width: none;
}

/* ===== Range Styling ===== */
.range-slider {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 4px;
  background: white;
  outline: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

/* ✅ Orange-bordered white thumb */
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  border: 3px solid #FF6A16;
  cursor: pointer;
}
.range-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  border: 3px solid #FF6A16;
  cursor: pointer;
}

/*  Smooth Accordion Animation */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-6px);
}
.slide-fade-enter-to, .slide-fade-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}
</style>
