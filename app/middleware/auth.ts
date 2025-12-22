export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()
  await userStore.initAuth()

  if (!userStore.token) {
    return navigateTo('/auth/login')
  }
})
