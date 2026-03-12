import axiosInstance from './axios'

export const getPayments = async (params = {}) => {
  const response = await axiosInstance.get('/payments/', { params })
  return response.data
}

export const updatePayment = async (id, data) => {
  const response = await axiosInstance.patch(`/payments/${id}/manage/`, data)
  return response.data
}

export const getRevenueReport = async (startDate, endDate) => {
  const response = await axiosInstance.get('/payments/revenue/', {
    params: { start_date: startDate, end_date: endDate }
  })
  return response.data
}