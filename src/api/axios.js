import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://medical-backend234567.onrender.com/api/v1'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Auto-refresh access token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refresh = localStorage.getItem('admin_refresh_token')
        if (!refresh) throw new Error('No refresh token')

        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh })
        const newAccess       = response.data.access
        const newRefresh      = response.data.refresh   // backend now rotates refresh tokens

        localStorage.setItem('admin_access_token', newAccess)
        if (newRefresh) localStorage.setItem('admin_refresh_token', newRefresh)

        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return axiosInstance(originalRequest)
      } catch (err) {
        // Refresh failed — clear session and redirect to login
        localStorage.removeItem('admin_access_token')
        localStorage.removeItem('admin_refresh_token')
        localStorage.removeItem('admin_user')
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
