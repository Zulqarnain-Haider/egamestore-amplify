// stores/userStore.js
import { defineStore } from 'pinia'
import { useRuntimeConfig, useCookie } from '#app'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,              // auth token (cookie-backed)
    currentUser: null,        // profile data
    isActivated: false,       // ACTIVATION STATE (single source of truth)
    isReady: false,           // auth bootstrap completed
  }),

  actions: {
    /* ------------------------------------
     * Internal helpers
     * ------------------------------------ */
    setToken(token) {
      this.token = token
      useCookie('user_token').value = token
    },

    clearAuth() {
      this.token = null
      this.currentUser = null
      this.isActivated = false
      this.isReady = true
      useCookie('user_token').value = null
    },

    /* ------------------------------------
     * Bootstrap from cookie
     * ------------------------------------ */
    async initAuth() {
      const token = useCookie('user_token').value

      if (!token) {
        this.clearAuth()
        return
      }

      this.token = token
      await this.fetchProfile()
      this.isReady = true
    },

    /* ------------------------------------
     * LOGIN
     * ------------------------------------ */
    async login(identifier, password) {
      const config = useRuntimeConfig()

      try {
        const formData = new FormData()
        formData.append('email', identifier)
        formData.append('password', password)

        const res = await axios.post(
          `${config.public.apiBase}/users/login`,
          formData,
          { headers: { lang: 'en' } }
        )

        if (!res.data?.status) {
          return { success: false, message: res.data?.message }
        }

        this.setToken(res.data.data.token)

        // activation state ONLY from login
        this.isActivated = res.data.data.activation_str === 'Active'

        await this.fetchProfile()

        if (!this.isActivated) {
          return { success: true, otpRequired: true }
        }

        return { success: true }
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || 'Login failed',
        }
      }
    },

    /* ------------------------------------
     * SIGNUP
     * ------------------------------------ */
    async signup(payload) {
      const config = useRuntimeConfig()

      try {
        const formData = new FormData()
        Object.entries(payload).forEach(([k, v]) =>
          formData.append(k, v)
        )

        const res = await axios.post(
          `${config.public.apiBase}/users/register`,
          formData,
          { headers: { lang: 'en' } }
        )

        if (!res.data?.status) {
          return {
            success: false,
            message: res.data?.message,
            errors: res.data?.errors || [],
          }
        }

        this.setToken(res.data.data.token)
        this.isActivated = false

        return { success: true, message: res.data.message }
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || 'Signup failed',
          errors: err.response?.data?.errors || [],
        }
      }
    },

    /* ------------------------------------
     * SOCIAL LOGIN
     * ------------------------------------ */
    async socialLogin(provider, oauthToken) {
      const config = useRuntimeConfig()

      try {
        const formData = new FormData()
        formData.append('provider', provider)
        formData.append('token', oauthToken)

        const res = await axios.post(
          `${config.public.apiBase}/users/social-login`,
          formData,
          { headers: { lang: 'en' } }
        )

        if (!res.data?.status) {
          return { success: false, message: res.data?.message }
        }

        this.setToken(res.data.data.token)
        this.isActivated = res.data.data.activation_str === 'Active'

        await this.fetchProfile()

        if (!this.isActivated) {
          return { success: true, otpRequired: true }
        }

        return { success: true }
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || 'Social login failed',
        }
      }
    },

    /* ------------------------------------
     * PROFILE (display data only)
     * ------------------------------------ */
    async fetchProfile() {
      if (!this.token) return

      const config = useRuntimeConfig()

      try {
        const res = await axios.get(
          `${config.public.apiBase}/users/getProfile`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              lang: 'en',
            },
          }
        )

        if (res.data?.status) {
          this.currentUser = res.data.data

          // 🔑 IMPORTANT FIX:
          // If profile loads successfully → user is activated
          this.isActivated = true
        }
      } catch {
        this.clearAuth()
      }
    },

    /* ------------------------------------
     * UPDATE PROFILE (API fields only)
     * ------------------------------------ */
    async updateProfile(payload) {
      const config = useRuntimeConfig()

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
              Authorization: `Bearer ${this.token}`,
              lang: 'en',
            },
          }
        )

        if (!res.data?.status) {
          return { success: false, message: res.data?.message }
        }

        this.currentUser = {
          ...this.currentUser,
          ...res.data.data,
        }

        return { success: true }
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || 'Update failed',
        }
      }
    },

    /* ------------------------------------
     * CHANGE PASSWORD
     * ------------------------------------ */
    async updatePassword(oldPassword, newPassword) {
      const config = useRuntimeConfig()

      try {
        const formData = new FormData()
        formData.append('old_password', oldPassword)
        formData.append('new_password', newPassword)

        const res = await axios.post(
          `${config.public.apiBase}/users/updatePassword`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              lang: 'en',
            },
          }
        )

        if (!res.data?.status) {
          return { success: false, message: res.data?.message }
        }

        return { success: true }
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || 'Password update failed',
        }
      }
    },

    /* ------------------------------------
     * OTP / ACTIVATION
     * ------------------------------------ */
    async activateAccount(code) {
      const config = useRuntimeConfig()

      try {
        const formData = new FormData()
        formData.append('code', code)

        const res = await axios.post(
          `${config.public.apiBase}/users/activeAccount`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              lang: 'en',
            },
          }
        )

        if (!res.data?.status) {
          return { success: false, message: res.data?.message }
        }

        this.setToken(res.data.data.token)
        this.isActivated = true
        await this.fetchProfile()

        return { success: true }
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || 'Invalid OTP',
        }
      }
    },

    /* ------------------------------------
     * PASSWORD RESET
     * ------------------------------------ */
    async requestPasswordReset(email) {
      const config = useRuntimeConfig()

      const formData = new FormData()
      formData.append('email', email)

      return axios.post(
        `${config.public.apiBase}/users/requestPasswordReset`,
        formData,
        { headers: { lang: 'en' } }
      )
    },

    async resendCode() {
      const config = useRuntimeConfig()
      return axios.post(
        `${config.public.apiBase}/users/resendCode`,
        null,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            lang: 'en',
          },
        }
      )
    },

    /* ------------------------------------
     * LOGOUT
     * ------------------------------------ */
    async logout() {
      const config = useRuntimeConfig()

      try {
        await axios.post(
          `${config.public.apiBase}/users/web/logout`,
          null,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              lang: 'en',
            },
          }
        )
      } catch (error) {
        // ignore errors
      }

      this.clearAuth()
    },
  },
})
