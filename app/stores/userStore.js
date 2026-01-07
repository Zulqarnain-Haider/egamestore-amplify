// stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    currentUser: null,
    isActivated: false,
    isReady: false,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  
  actions: {
    // Only simple state updates, no API calls
    setToken(token) {
      this.token = token
    },
    
    setUser(user) {
      this.currentUser = user
    },
    
    setActivated(activated) {
      this.isActivated = activated
    },
    
    setReady(ready) {
      this.isReady = ready
    },
    
    clearAuth() {
      this.token = null
      this.currentUser = null
      this.isActivated = false
      this.isReady = true
    }
  }
})