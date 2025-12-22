<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '~/stores/userStore'
import { useCategoriesStore } from '~/stores/categoriesStore'

const userStore = useUserStore()
const categoriesStore = useCategoriesStore()

// Bootstrap auth from cookie (SSR-safe)
await userStore.initAuth()

onMounted(() => {
  if (!categoriesStore.parentCategories.length) {
    categoriesStore.fetchParentCategories()
  }
})
</script>


