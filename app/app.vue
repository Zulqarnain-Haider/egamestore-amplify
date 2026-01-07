<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCategoriesStore } from '~/stores/categoriesStore'
import { useLang } from '~/composables/useLang'
import { useAuth } from '~/composables/useAuth'

/* -------------------- STORES -------------------- */
const auth = useAuth()
const categoriesStore = useCategoriesStore()

/* -------------------- I18N -------------------- */
// Use Nuxt's auto-imported locale composable
const { locale, setLocale } = useI18n()
const langCookie = useLang()

// Sync cookie → i18n
watch(
  langCookie,
  (val) => {
    if (val && locale.value !== val) {
      setLocale(val)
    }
  },
  { immediate: true }
)

// Sync i18n → cookie (when locale changes elsewhere)
watch(
  locale,
  (val) => {
    if (val && langCookie.value !== val) {
      langCookie.value = val
    }
  }
)

/* -------------------- AUTH -------------------- */
// Bootstrap auth from cookie (SSR-safe)
await auth.initAuth()

/* -------------------- CATEGORIES -------------------- */
onMounted(() => {
  if (!categoriesStore.parentCategories.length) {
    categoriesStore.fetchParentCategories()
  }
})
</script>