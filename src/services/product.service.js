import api from './api'

export default {
  // Get all products with optional filters
  getProducts(params = {}) {
    return api.get('/products', { params })
  },

  // Get product by ID
  getProductById(id) {
    return api.get(`/products/${id}`)
  },

  // Search products
  searchProducts(params) {
    return api.get('/products/search', { params })
  },

  // Create product (admin only)
  createProduct(data) {
    return api.post('/products', data)
  },

  // Update product (admin only)
  updateProduct(id, data) {
    return api.put(`/products/${id}`, data)
  },

  // Delete product (admin only)
  deleteProduct(id) {
    return api.delete(`/products/${id}`)
  },
}
