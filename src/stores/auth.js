import { defineStore } from 'pinia'
import authService from '../services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
    currentUser: (state) => state.user,
  },

  actions: {
    async register(userData) {
      try {
        const response = await authService.register(userData)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async verify(verificationData) {
      try {
        const response = await authService.verify(verificationData)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async resendVerificationCode(email) {
      try {
        const response = await authService.resendVerificationCode({ email })
        return response.data
      } catch (error) {
        throw error
      }
    },

    async login(credentials) {
      try {
        const response = await authService.login(credentials)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        this.isAuthenticated = true
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        return response.data
      } catch (error) {
        throw error
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    async redeemPassword(email) {
      try {
        const response = await authService.redeemPassword(email)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async resetPassword(resetData) {
      try {
        const response = await authService.resetPassword(resetData)
        return response.data
      } catch (error) {
        throw error
      }
    },
  },
})
