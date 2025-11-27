// stores/userStore.js
import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#app'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: process.client ? JSON.parse(localStorage.getItem('currentUser') || 'null') : null,
  }),

  actions: {
    setUser(user) {
      this.currentUser = user
      if (process.client) localStorage.setItem('currentUser', JSON.stringify(user))
    },

    logout() {
      this.currentUser = null
      if (process.client) localStorage.removeItem('currentUser')
    },

    // Signup API
    async signup(newUser) {
      const config = useRuntimeConfig()
      try {
        const formData = new FormData()
        formData.append('email', newUser.email)
        formData.append('phone', newUser.phone)
        formData.append('password', newUser.password)
        formData.append('dob', newUser.dob)
        formData.append('smsConsent', newUser.smsConsent)

        const res = await $fetch(`${config.NUXT_PUBLIC_API_BASE}/users/register`, {
          method: 'POST',
          body: formData,
          headers: { lang: 'ar' },
        })

        if (!res.status) return { success: false, message: res.message || 'Signup failed' }

        this.setUser({
          email: newUser.email,
          phone: newUser.phone,
          token: res.data.token,
          avatar: '/games/ProfileAvatar.png', // default avatar
        })

        return { success: true, message: res.message || 'Signup successful!' }
      } catch (err) {
        return { success: false, message: err.message || 'Signup failed' }
      }
    },

    // Login API
    async login(identifier, password) {
      const config = useRuntimeConfig()
      try {
        // Check user existence (optional)
        const checkForm = new FormData()
        checkForm.append('email_or_phone', identifier)
        await $fetch(`${config.NUXT_PUBLIC_API_BASE}/users/check-user-existence`, {
          method: 'POST',
          body: checkForm,
          headers: { lang: 'ar' },
        })

        // Login
        const loginForm = new FormData()
        loginForm.append('email', identifier)
        loginForm.append('password', password)

        const res = await $fetch(`${config.NUXT_PUBLIC_API_BASE}/users/login`, {
          method: 'POST',
          body: loginForm,
        })

        if (!res.status) return { success: false, message: res.message || 'Login failed' }

        this.setUser({
          id: res.data.id,
          email: res.data.email,
          phone: res.data.phone,
          dob: res.data.dob,
          token: res.data.token,
          activation_str: res.data.activation_str,
          avatar: res.data.avatar || '/games/ProfileAvatar.png',
        })

        return { success: true, message: res.message || 'Login successful!' }
      } catch (err) {
        return { success: false, message: err.message || 'Login failed' }
      }
    },

    // Update Password API
    async updatePassword(newPassword) {
      if (!this.currentUser) return { success: false, message: 'User not logged in' }
      const config = useRuntimeConfig()
      try {
        const formData = new FormData()
        formData.append('email_or_phone', this.currentUser.email || this.currentUser.phone)
        formData.append('new_password', newPassword)

        const res = await $fetch(`${config.NUXT_PUBLIC_API_BASE}/users/reset-password`, {
          method: 'POST',
          body: formData,
        })

        if (!res.status) return { success: false, message: res.message || 'Password update failed' }

        // Update local user password (if you store it)
        this.currentUser.password = newPassword
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))

        return { success: true, message: res.message || 'Password updated successfully' }
      } catch (err) {
        return { success: false, message: err.message || 'Password update failed' }
      }
    },

    // Update Profile Image API
    async updateProfileImage(file) {
      if (!this.currentUser) return { success: false, message: 'User not logged in' }
      const config = useRuntimeConfig()
      try {
        const formData = new FormData()
        formData.append('avatar', file)

        const res = await $fetch(`${config.NUXT_PUBLIC_API_BASE}/users/update-avatar`, {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${this.currentUser.token}` },
        })

        if (!res.status) return { success: false, message: res.message || 'Update avatar failed' }

        // Update local avatar
        this.currentUser.avatar = res.data.avatar || this.currentUser.avatar
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))

        return { success: true, message: res.message || 'Profile image updated' }
      } catch (err) {
        return { success: false, message: err.message || 'Update avatar failed' }
      }
    },
  },
})
