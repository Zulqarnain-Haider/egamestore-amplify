export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth()
  
  if (!auth.isReady.value) {
    await auth.initAuth()
  }
  
  if (!auth.isAuthenticated.value) {
    return navigateTo('/auth/login')
  }
  
  if (!auth.isActivated.value) {
    return navigateTo('/auth/otp-verification?type=activation')
  }
})