import api from './api'

export default {
  // Get current user profile
  getCurrentUser() {
    return api.get('/users/me')
  },

  // Update user profile
  updateProfile(data) {
    return api.put('/users/me', data)
  },

  // Get user addresses
  getAddresses() {
    return api.get('/addresses')
  },

  // Create address
  createAddress(data) {
    return api.post('/addresses', data)
  },

  // Update address
  updateAddress(id, data) {
    return api.put(`/addresses/${id}`, data)
  },

  // Delete address
  deleteAddress(id) {
    return api.delete(`/addresses/${id}`)
  },
}
