export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
  
  if (!auth.isReady.value) {
    await auth.initAuth()
  }
  
  if (to.query.type === 'reset') {
    return
  }
  
  if (!auth.isAuthenticated.value) {
    return navigateTo('/auth/login')
  }
  
  if (auth.isActivated.value) {
    return navigateTo('/')
  }
})