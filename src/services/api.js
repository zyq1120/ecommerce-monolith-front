import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If token expired, try to renew
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const expiredToken = localStorage.getItem('token')
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/renew-token`,
          { expiredToken }
        )
        
        const { token } = response.data
        localStorage.setItem('token', token)
        
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (renewError) {
        // If token renewal fails, logout user
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(renewError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
