export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth()
  
  if (!auth.isReady.value) {
    await auth.initAuth()
  }
  
  if (auth.isAuthenticated.value && auth.isActivated.value) {
    return navigateTo('/')
  }
})