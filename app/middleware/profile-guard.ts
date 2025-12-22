export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()

  // Bootstrap auth ONLY once
  if (!userStore.isReady) {
    await userStore.initAuth()
  }

  // Still not logged in
  if (!userStore.token) {
    return navigateTo('/auth/login')
  }

  // User logged in but not activated
  if (!userStore.isActivated) {
    return navigateTo('/auth/otp-verification?type=activation')
  }

  // Otherwise allow access
})
