import api from './api'

export default {
  // Get all brands
  getBrands(params = {}) {
    return api.get('/brands', { params })
  },

  // Get brand by ID
  getBrandById(id) {
    return api.get(`/brands/${id}`)
  },

  // Create brand (admin only)
  createBrand(data) {
    return api.post('/brands', data)
  },

  // Update brand (admin only)
  updateBrand(id, data) {
    return api.put(`/brands/${id}`, data)
  },

  // Delete brand (admin only)
  deleteBrand(id) {
    return api.delete(`/brands/${id}`)
  },
}
