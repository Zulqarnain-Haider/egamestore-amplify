export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()

  // Wait for auth bootstrap
  if (!userStore.isReady) {
    await userStore.initAuth()
  }

  // Must be logged in to see OTP
  if (!userStore.token) {
    return navigateTo('/auth/login')
  }

  // Already activated users should NOT see OTP
  if (userStore.isActivated) {
    return navigateTo('/')
  }
})
