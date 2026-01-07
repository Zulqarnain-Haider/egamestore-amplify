export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth()
  await auth.initAuth()

  if (!auth.isAuthenticated.value) {
    return navigateTo('/auth/login')
  }
})