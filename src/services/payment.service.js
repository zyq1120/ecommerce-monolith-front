import api from './api'

export default {
  // Create payment
  createPayment(data) {
    return api.post('/payments', data)
  },

  // Execute payment
  executePayment(paymentId, data) {
    return api.post(`/payments/${paymentId}/execute`, data)
  },

  // Cancel payment
  cancelPayment(paymentId) {
    return api.post(`/payments/${paymentId}/cancel`)
  },
}
