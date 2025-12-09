export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore()

  // Not logged in
  if (!userStore.currentUser) {
    return navigateTo('/auth/login')
  }

  // Logged in but NOT active → redirect to OTP page with type=activation
  if (userStore.currentUser.activation_str !== 'active') {
    return navigateTo(`/auth/otp-verification?type=activation&email=${userStore.currentUser.email}`)
  }
})
