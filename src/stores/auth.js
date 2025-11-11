import { defineStore } from 'pinia';
import { authService, userService } from '../api/services';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('accessToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
  }),
  
  actions: {
    async register(userData) {
      try {
        const response = await authService.register(userData);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    async verify(email, code) {
      try {
        const response = await authService.verify(email, code);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    async login(email, password) {
      try {
        const response = await authService.login(email, password);
        const { token, user } = response.data;
        
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
        
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    async fetchCurrentUser() {
      try {
        const response = await userService.getCurrentUser();
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
    
    async redeemPassword(email) {
      try {
        const response = await authService.redeemPassword(email);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    async resetPassword(token, password) {
      try {
        const response = await authService.resetPassword(token, password);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
  
  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },
});
