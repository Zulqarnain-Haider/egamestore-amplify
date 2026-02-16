// composables/useUser.ts
import { useRuntimeConfig } from '#app'
import { useUserStore } from '~/stores/userStore'
import axios from 'axios'

export const useUser = () => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()
  
  const updateProfile = async (payload: any, lang: string = 'en') => {
    try {
      const formData = new FormData()
      formData.append('email', payload.email)
      formData.append('phone', payload.phone)
      formData.append('dob', payload.dob)
      
      const res = await axios.post(
        `${config.public.apiBase}/users/updateProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
            lang,
          },
        }
      )
      
      if (!res.data?.status) {
         let errorMessage = res.data?.message || 'Update failed'

           if (res.data?.errors) {
        // Convert errors object to readable string
        errorMessage = Object.values(res.data.errors)
          .flat()
          .join('\n')
      }
        return { success: false, message: errorMessage }
      }
      
      userStore.currentUser = {
        ...userStore.currentUser,
        ...res.data.data,
      }
      
      return { success: true }
    } catch (err: any) {
       let errorMessage = err.response?.data?.message || 'Update failed'

    if (err.response?.data?.errors) {
      errorMessage = Object.values(err.response.data.errors)
        .flat()
        .join('\n')
    }
      return {
        success: false,
        message: errorMessage
      }
    }
  }
  
  const updatePassword = async (oldPassword: string, newPassword: string, lang: string = 'en') => {
    try {
      const formData = new FormData()
      formData.append('old_password', oldPassword)
      formData.append('new_password', newPassword)
      
      const res = await axios.post(
        `${config.public.apiBase}/users/updatePassword`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
            lang,
          },
        }
      )
      
      if (!res.data?.status) {
        return { success: false, message: res.data?.message }
      }
      
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Password update failed',
      }
    }
  }
  
  const activateAccount = async (code: string, lang: string = 'en') => {
    try {
      const formData = new FormData()
      formData.append('code', code)
      
      const res = await axios.post(
        `${config.public.apiBase}/users/activeAccount`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
            lang,
          },
        }
      )
      
      if (!res.data?.status) {
        return { success: false, message: res.data?.message }
      }
      
      userStore.token = res.data.data.token
      userStore.isActivated = true
      
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid OTP',
      }
    }
  }
  
  return {
    updateProfile,
    updatePassword,
    activateAccount,
    user: computed(() => userStore.currentUser),
    isActivated: computed(() => userStore.isActivated),
  }
}