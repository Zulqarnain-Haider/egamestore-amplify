export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()

  // Ensure auth is initialized (important for SSR + refresh)
  if (!userStore.isReady) {
    await userStore.initAuth()
  }

  // If user is logged in AND activated → block guest pages
  if (userStore.token && userStore.isActivated) {
    return navigateTo('/')
  }
})
