import axiosInstance from './axios'

export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login/', { email, password })
  const data = response.data
  const accessToken  = data.tokens?.access  || data.access
  const refreshToken = data.tokens?.refresh || data.refresh
  const user = data.user

  if (!accessToken) throw new Error('Invalid response from server.')
  if (user && user.role !== 'admin') throw new Error('Access denied. Admin accounts only.')

  localStorage.setItem('admin_access_token',  accessToken)
  localStorage.setItem('admin_refresh_token', refreshToken)
  localStorage.setItem('admin_user', JSON.stringify(user))
  return user
}

export const logout = async () => {
  try {
    const refresh = localStorage.getItem('admin_refresh_token')
    if (refresh) await axiosInstance.post('/auth/logout/', { refresh })
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    localStorage.removeItem('admin_access_token')
    localStorage.removeItem('admin_refresh_token')
    localStorage.removeItem('admin_user')
  }
}

export const getCurrentUser  = () => {
  const u = localStorage.getItem('admin_user')
  return u ? JSON.parse(u) : null
}

export const isAuthenticated = () => !!localStorage.getItem('admin_access_token')

export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/auth/admin/stats/')
  return response.data
}

export const getUsers = async (params = {}) => {
  const response = await axiosInstance.get('/auth/users/', { params })
  return response.data
}

export const getUserDetail = async (id) => {
  const response = await axiosInstance.get(`/auth/users/${id}/`)
  return response.data
}

export const updateUser = async (id, data) => {
  const response = await axiosInstance.patch(`/auth/users/${id}/`, data)
  return response.data
}

export const deactivateUser = async (id) => {
  const response = await axiosInstance.delete(`/auth/users/${id}/`)
  return response.data
}

// Admin-triggered password reset email
export const adminResetUserPassword = async (userId) => {
  const response = await axiosInstance.post(`/auth/users/${userId}/reset-password/`)
  return response.data
}
