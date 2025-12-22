// middleware/otp.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()

  // Ensure auth is ready (SSR + refresh safe)
  if (!userStore.isReady) {
    await userStore.initAuth()
  }

  /* ------------------------------
   * RESET PASSWORD FLOW
   * ------------------------------ */
  // Forgot-password OTP does NOT need login
  if (to.query.type === 'reset') {
    return
  }

  /* ------------------------------
   * ACTIVATION FLOW
   * ------------------------------ */
  // Must be logged in
  if (!userStore.token) {
    return navigateTo('/auth/login')
  }

  // Activated users should not see OTP
  if (userStore.isActivated) {
    return navigateTo('/')
  }
})
