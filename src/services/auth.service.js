import api from './api'

export default {
  // Register a new user
  register(data) {
    return api.post('/auth/register', data)
  },

  // Verify user account
  verify(data) {
    return api.post('/auth/verify', data)
  },

  // Resend verification code
  resendVerificationCode(data) {
    return api.post('/auth/resend-verification-code', data)
  },

  // Login
  login(data) {
    return api.post('/auth/login', data)
  },

  // Renew token
  renewToken(expiredToken) {
    return api.post('/auth/renew-token', { expiredToken })
  },

  // Request password reset
  redeemPassword(email) {
    return api.post('/auth/redeem-password', { email })
  },

  // Reset password
  resetPassword(data) {
    return api.post('/auth/reset-password', data)
  },
}
