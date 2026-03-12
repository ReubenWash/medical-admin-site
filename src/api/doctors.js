import axiosInstance from './axios'

export const getDoctors = async (params = {}) => {
  const response = await axiosInstance.get('/doctors/', { params })
  return response.data
}

export const getDoctor = async (id) => {
  const response = await axiosInstance.get(`/doctors/${id}/`)
  return response.data
}

export const createDoctor = async (data) => {
  // data may be FormData (with photo) or plain object
  const isFormData = data instanceof FormData
  const response = await axiosInstance.post('/doctors/', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  })
  return response.data
}

export const updateDoctor = async (id, data) => {
  const isFormData = data instanceof FormData
  const response = await axiosInstance.patch(`/doctors/${id}/`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  })
  return response.data
}

export const uploadDoctorPhoto = async (id, file) => {
  const formData = new FormData()
  formData.append('photo', file)
  const response = await axiosInstance.patch(`/doctors/${id}/photo/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const deleteDoctorPhoto = async (id) => {
  const response = await axiosInstance.delete(`/doctors/${id}/photo/`)
  return response.data
}

export const deleteDoctor = async (id) => {
  const response = await axiosInstance.delete(`/doctors/${id}/`)
  return response.data
}

export const getDoctorSchedule = async (id) => {
  const response = await axiosInstance.get(`/doctors/${id}/schedule/`)
  return response.data
}

export const getAvailableSlots = async (doctorId, date) => {
  const response = await axiosInstance.get(`/doctors/${doctorId}/available-slots/`, {
    params: { date }
  })
  return response.data
}
