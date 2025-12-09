// stores/userStore.js
import { defineStore } from 'pinia'
import { useRuntimeConfig, useCookie } from '#app'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    token: null,
  }),

  actions: {
    // -----------------------------
    // LOCAL STATE MANAGEMENT
    // -----------------------------
    setUser(user, token = null) {
      this.currentUser = user
      this.token = token
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(user || null))
        if (token) localStorage.setItem('token', token)
      }
      try {
        const tokenCookie = useCookie('user_token')
        if (token) tokenCookie.value = token
      } catch (e) {}
    },

    loadUserFromStorage() {
      if (!process.client) return
      const u = localStorage.getItem('user')
      const t = localStorage.getItem('token')
      if (u) this.currentUser = JSON.parse(u)
      if (t) this.token = t
    },

    // -----------------------------
    // LOGIN
    // -----------------------------
    async login(identifier, password) {
      const config = useRuntimeConfig()
      try {
        const formData = new FormData()
        formData.append('email', identifier)
        formData.append('password', password)

        const res = await axios.post(`${config.public.apiBase}/users/login`, formData, {
          headers: { 'Accept-language': 'en', 
            "Accept": '*/*' },
        })

        if (!res.data?.status) return { success: false, message: res.data?.message }

        const token = res.data.data?.token
        this.token = token

      
    // Save basic user info
    this.currentUser = { ...res.data.data }
    localStorage.setItem('user', JSON.stringify(this.currentUser))
    localStorage.setItem('token', token)

    // Check activation status
    if (res.data.data.activation_str === 'waiting_Active') {
      return { success: true, message: 'Account needs activation', otpRequired: true }
    }

        // Fetch profile
        await this.fetchUserProfile()

        return { success: true, message: 'Login successful' }
      } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message }
      }
    },

    // -----------------------------
    // SIGNUP
    // -----------------------------
    async signup(newUser) {
      const config = useRuntimeConfig()
      try {
        const formData = new FormData()
        formData.append('email', newUser.email)
        formData.append('phone', newUser.phone)
        formData.append('password', newUser.password)
        formData.append('dob', newUser.dob)
        formData.append('agree_sms', newUser.agree_sms)

        const res = await axios.post(`${config.public.apiBase}/users/register`, formData, {
          headers: { 'Accept-language': 'en',
             'Accept': '*/*',
              'Content-Type': 'multipart/form-data' },
        })

        if (!res.data?.status) return { success: false, message: res.data?.message }

        const token = res.data.data?.token
        this.token = token
        localStorage.setItem('token', token)

        const userObj = {
          id: res.data.data?.id || null,
          email: newUser.email,
          phone: newUser.phone,
          dob: newUser.dob,
          avatar: '/games/ProfileAvatar.png',
        }

        this.setUser(userObj, token)
        return { success: true, message: 'Signup successful' }
      } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message }
      }
    },

    // -----------------------------
    // SOCIAL LOGIN
    // -----------------------------
    async socialLogin(provider, oauthToken) {
      const config = useRuntimeConfig()
      try {
        const formData = new FormData()
        formData.append('provider', provider)
        formData.append('token', oauthToken)

        const res = await axios.post(`${config.public.apiBase}/users/social-login`, formData, {
          headers: { 'Accept-language': 'en',
             'Accept': '*/*',
              'Content-Type': 'multipart/form-data' },
        })

        if (!res.data?.status) return { success: false, message: res.data?.message }

        const token = res.data.data?.token
        this.token = token
        localStorage.setItem('token', token)

        const userObj = {
          id: res.data.data?.id || null,
          email: res.data.data?.email || null,
          phone: res.data.data?.phone || null,
          dob: res.data.data?.dob || null,
          avatar: res.data.data?.avatar || '/games/ProfileAvatar.png',
        }

        this.setUser(userObj, token)

        return { success: true, message: 'Social login successful' }
      } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message }
      }
    },

    // -----------------------------
    // FETCH PROFILE
    // -----------------------------
    async fetchUserProfile() {
      if (!this.token) return
      const config = useRuntimeConfig()
      try {
        const res = await axios.get(`${config.public.apiBase}/users/getProfile`, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        if (res.data?.status) {
          const avatar = this.currentUser?.avatar || '/games/ProfileAvatar.png'
          this.currentUser = { ...res.data.data, avatar }
          localStorage.setItem('user', JSON.stringify(this.currentUser))
        }
      } catch (err) {
        console.error('Fetch profile error:', err)
      }
    },

    // -----------------------------
    // UPDATE PROFILE
    // -----------------------------
    async updateUser(updatedUser) {
      if (!this.currentUser) return { success: false, message: 'User not logged in' }
      const config = useRuntimeConfig()
      try {
        const formData = new FormData()
        formData.append('email', updatedUser.email || '')
        formData.append('phone', updatedUser.phone || '')
        formData.append('dob', updatedUser.dob || '')

        const res = await axios.post(`${config.public.apiBase}/users/updateProfile`, formData, {
          headers: { Authorization: `Bearer ${this.token}` },
        })

        if (!res.data?.status) return { success: false, message: res.data?.message }

        this.currentUser = { ...this.currentUser, ...updatedUser }
        localStorage.setItem('user', JSON.stringify(this.currentUser))
        return { success: true, message: res.data?.message }
      } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message }
      }
    },

    // -----------------------------
    // UPDATE AVATAR
    // -----------------------------
    async updateProfileImage(file) {
      if (!this.currentUser) return { success: false, message: 'User not logged in' }
      try {
        let avatarUrl
        if (file instanceof File) {
          const reader = new FileReader()
          await new Promise((resolve) => {
            reader.onload = (e) => {
              avatarUrl = e.target.result
              resolve(true)
            }
            reader.readAsDataURL(file)
          })
        } else {
          avatarUrl = file
        }

        this.currentUser.avatar = avatarUrl
        localStorage.setItem('user', JSON.stringify(this.currentUser))
        return { success: true, message: 'Avatar updated locally' }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },

    // -----------------------------
    // LOGOUT
    // -----------------------------
    async logout() {
      if (!this.token) return
      const config = useRuntimeConfig()
      try {
        await axios.post(`${config.public.apiBase}/users/web/logout`, null, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
      } catch (err) {
        console.warn('Logout API error:', err)
      }

      this.currentUser = null
      this.token = null
      if (process.client) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
      try {
        const tokenCookie = useCookie('user_token')
        tokenCookie.value = null
      } catch (e) {}
    },


    
    // -----------------------------
    // Activation & Reset helpers
    // -----------------------------
    async activateAccount(code) {
      // Not used by OTP.vue in this version (OTP.vue uses axios directly to preserve your pattern),
      // but provided for completeness.
      if (!this.token) return { success: false, message: 'Missing token' }
      const config = useRuntimeConfig()
      try {
        const formData = new FormData()
        formData.append('code', code)
        const res = await axios.post(`${config.public.apiBase}/users/activeAccount`, formData, {
          headers: { Authorization: `Bearer ${this.token}`, 
          'Accept-language': 'en' },
        })
        if (!res.data?.status) return { success: false, message: res.data?.message }

         // Mark user as active
    this.currentUser.activation_str = 'active'
    
    // if server returned new token
    if (res.data.data?.token) {
      this.token = res.data.data.token
    }

    this.setUser(this.currentUser, this.token) // update localStorage & cookie

        return { success: true, data: res.data.data }
      } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message }
      }
    },

    async requestPasswordReset(email) {
      const config = useRuntimeConfig()
      try {
        const formData = new FormData()
        formData.append('email', email)
        const res = await axios.post(`${config.public.apiBase}/users/requestPasswordReset`, formData, {
          headers: { 'Accept-language': 'en' },
        })
        if (!res.data?.status) {
         return { success: false, message: res.data?.message || 'Failed to request reset' }
        }
      } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message }
      }
    },

    async resendCode(email) {
      // resend activation code for currently signed user (requires token)
      if (!this.token) return { success: false, message: 'No token available' }
      const config = useRuntimeConfig()
      try {
        const res = await axios.post(`${config.public.apiBase}/users/resendCode`, null, {
          headers: { Authorization: `Bearer ${this.token}`, 'Accept-language': 'en' },
        })
        if (!res.data?.status) return { success: false, message: res.data?.message }
        return { success: true, message: res.data?.message }
      } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message }
      }
    },

    async updatePassword({ old_password, new_password }) {
  if (!this.token) return { success: false, message: 'User not logged in' }
  const config = useRuntimeConfig()
  try {
    const formData = new FormData()
    formData.append('old_password', old_password)
    formData.append('new_password', new_password)

    const res = await axios.post(`${config.public.apiBase}/users/updatePassword`, formData, {
      headers: { Authorization: `Bearer ${this.token}` }
    })

    if (!res.data?.status) return { success: false, message: res.data?.message }

    return { success: true, message: res.data.message }
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message }
  }
}

  },
})
