import axiosInstance from './axios'

export const getAppointments = async (params = {}) => {
  const response = await axiosInstance.get('/appointments/', { params })
  return response.data
}

export const getTodaysAppointments = async () => {
  const response = await axiosInstance.get('/appointments/today/')
  return response.data
}

export const getAppointmentCalendar = async (year, month) => {
  const response = await axiosInstance.get('/appointments/calendar/', {
    params: { year, month }
  })
  return response.data
}

export const updateAppointment = async (id, data) => {
  const response = await axiosInstance.patch(`/appointments/${id}/manage/`, data)
  return response.data
}

export const createAppointment = async (data) => {
  const response = await axiosInstance.post('/appointments/', data)
  return response.data
}

export const cancelAppointment = async (id, reason = '') => {
  const response = await axiosInstance.post(`/appointments/${id}/cancel/`, { reason })
  return response.data
}
