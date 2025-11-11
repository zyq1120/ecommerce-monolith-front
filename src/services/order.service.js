import api from './api'

export default {
  // Create order
  createOrder(data) {
    return api.post('/orders', data)
  },

  // Get user's orders
  getUserOrders(params = {}) {
    return api.get('/orders', { params })
  },

  // Get order by ID
  getOrderById(id) {
    return api.get(`/orders/${id}`)
  },

  // Get order by tracking number
  getOrderByTrackingNumber(trackingNumber) {
    return api.get(`/orders/tracking/${trackingNumber}`)
  },

  // Update order status (admin only)
  updateOrderStatus(id, status) {
    return api.patch(`/orders/${id}/status`, { status })
  },
}
