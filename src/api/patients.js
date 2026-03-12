import axiosInstance from './axios'

export const getPatients = async (params = {}) => {
  const response = await axiosInstance.get('/auth/users/', {
    params: { role: 'patient', ...params }
  })
  return response.data
}

export const getPatient = async (id) => {
  const response = await axiosInstance.get(`/auth/users/${id}/`)
  return response.data
}

export const updatePatient = async (id, data) => {
  const response = await axiosInstance.patch(`/auth/users/${id}/`, data)
  return response.data
}

export const deactivateUser = async (id) => {
  const response = await axiosInstance.delete(`/auth/users/${id}/`)
  return response.data
}
