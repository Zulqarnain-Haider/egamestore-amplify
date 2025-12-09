<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/userStore'

const userStore = useUserStore()

if (process.client) {
  userStore.loadUserFromStorage()
}
</script>

