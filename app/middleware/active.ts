export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()
  await userStore.initAuth()

  if (!userStore.token) {
    return navigateTo('/auth/login')
  }

  if (!userStore.isActivated) {
    return navigateTo('/auth/otp-verification?type=activation')
  }
})
