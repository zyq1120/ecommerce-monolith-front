import api from './api'

export default {
  // Get all categories
  getCategories(params = {}) {
    return api.get('/categories', { params })
  },

  // Get category by ID
  getCategoryById(id) {
    return api.get(`/categories/${id}`)
  },

  // Create category (admin only)
  createCategory(data) {
    return api.post('/categories', data)
  },

  // Update category (admin only)
  updateCategory(id, data) {
    return api.put(`/categories/${id}`, data)
  },

  // Delete category (admin only)
  deleteCategory(id) {
    return api.delete(`/categories/${id}`)
  },
}
