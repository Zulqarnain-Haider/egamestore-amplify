// composables/useAuth.ts
import { useCookie, useRuntimeConfig } from '#app'
import { useUserStore } from '~/stores/userStore'
import axios from 'axios'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()
  const tokenCookie = useCookie('user_token')
  
  const initAuth = async (): Promise<void> => {
    const token = tokenCookie.value
    
    if (!token) {
      userStore.clearAuth()
      return
    }
    
    userStore.token = token
    await fetchProfile('en') // Default to 'en' for SSR
    userStore.isReady = true
  }
  
  const fetchProfile = async (lang: string = 'en'): Promise<void> => {
    if (!userStore.token) return
    
    try {
      const res = await axios.get(
        `${config.public.apiBase}/users/getProfile`,
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
            lang,
          },
        }
      )
      
      if (res.data?.status) {
        userStore.currentUser = res.data.data
        userStore.isActivated = true
      }
    } catch {
      clearAuth()
    }
  }
  
  const login = async (identifier: string, password: string, lang: string = 'en') => {
    try {
      const formData = new FormData()
      formData.append('email', identifier)
      formData.append('password', password)
      
      const res = await axios.post(
        `${config.public.apiBase}/users/login`,
        formData,
        { headers: { lang } }
      )
      
      if (!res.data?.status) {
        return { success: false, message: res.data?.message }
      }
      
      // Set token in store and cookie
      userStore.token = res.data.data.token
      tokenCookie.value = res.data.data.token
      
      userStore.isActivated = res.data.data.activation_str === 'Active'
      await fetchProfile(lang)
      
      return { 
        success: true, 
        otpRequired: !userStore.isActivated 
      }
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed',
      }
    }
  }
  
  const signup = async (payload: any, lang: string = 'en') => {
    try {
      const formData = new FormData()
      Object.entries(payload).forEach(([k, v]) => formData.append(k, v))
      
      const res = await axios.post(
        `${config.public.apiBase}/users/register`,
        formData,
        { headers: { lang } }
      )
      
      if (!res.data?.status) {
        return {
          success: false,
          message: res.data?.message,
          errors: res.data?.errors || [],
        }
      }
      
      userStore.token = res.data.data.token
      tokenCookie.value = res.data.data.token
      userStore.isActivated = false
      
      return { success: true, message: res.data.message }
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Signup failed',
        errors: err.response?.data?.errors || [],
      }
    }
  }
  
  const socialLogin = async (provider: string, oauthToken: string, lang: string = 'en') => {
    try {
      const formData = new FormData()
      formData.append('provider', provider)
      formData.append('token', oauthToken)
      
      const res = await axios.post(
        `${config.public.apiBase}/users/social-login`,
        formData,
        { headers: { lang } }
      )
      
      if (!res.data?.status) {
        return { success: false, message: res.data?.message }
      }
      
      userStore.token = res.data.data.token
      tokenCookie.value = res.data.data.token
      userStore.isActivated = res.data.data.activation_str === 'Active'
      
      await fetchProfile(lang)
      
      if (!userStore.isActivated) {
        return { success: true, otpRequired: true }
      }
      
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Social login failed',
      }
    }
  }
  
  const clearAuth = (): void => {
    userStore.token = null
    userStore.currentUser = null
    userStore.isActivated = false
    userStore.isReady = true
    tokenCookie.value = null
  }
  
  const logout = async (lang: string = 'en'): Promise<void> => {
    if (userStore.token) {
      try {
        await axios.post(
          `${config.public.apiBase}/users/web/logout`,
          null,
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
              lang,
            },
          }
        )
      } catch (error) {
        // ignore errors
      }
    }
    clearAuth()
  }
  
  const requestPasswordReset = async (email: string, lang: string = 'en') => {
    const formData = new FormData()
    formData.append('email', email)
    
    return axios.post(
      `${config.public.apiBase}/users/requestPasswordReset`,
      formData,
      { headers: { lang } }
    )
  }
  
  const resendCode = async (lang: string = 'en') => {
    return axios.post(
      `${config.public.apiBase}/users/resendCode`,
      null,
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
          lang,
        },
      }
    )
  }
  
  return {
    initAuth,
    login,
    signup,
    socialLogin,
    logout,
    clearAuth,
    fetchProfile,
    requestPasswordReset,
    resendCode,
    isAuthenticated: computed(() => !!userStore.token),
    isActivated: computed(() => userStore.isActivated),
    user: computed(() => userStore.currentUser),
    token: computed(() => userStore.token),
    isReady: computed(() => userStore.isReady),
  }
}