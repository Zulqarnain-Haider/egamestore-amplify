export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()
  await userStore.initAuth()

  if (!userStore.currentUser) {
    return navigateTo('/auth/login')
  }

  if (userStore.currentUser.activation_str !== 'active') {
    return navigateTo('/auth/otp-verification')
  }
})
