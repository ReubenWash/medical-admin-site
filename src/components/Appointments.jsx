import React, { useState, useEffect } from 'react'
import { getAppointments, updateAppointment } from '../api/appointments'
import '../styles/Appointments.css'

const Appointments = ({ onAddAppointment, refresh }) => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [refresh, filterStatus, filterDate])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filterStatus) params.status = filterStatus
      if (filterDate)   params.date   = filterDate
      if (searchQuery)  params.search = searchQuery
      const data = await getAppointments(params)
      setAppointments(data.results || data)
    } catch (err) {
      console.error('Failed to load appointments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id) => {
    try {
      await updateAppointment(id, { status: 'completed' })
      fetchAppointments()
    } catch (err) {
      alert('Failed to complete appointment.')
    }
  }

  const handleConfirm = async (id) => {
    try {
      await updateAppointment(id, { status: 'confirmed' })
      fetchAppointments()
    } catch (err) {
      alert('Failed to confirm appointment.')
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    try {
      await updateAppointment(id, { status: 'cancelled' })
      fetchAppointments()
    } catch (err) {
      alert('Failed to cancel appointment.')
    }
  }

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'confirmed': return 'status-confirmed'
      case 'pending':   return 'status-pending'
      case 'cancelled': return 'status-cancelled'
      case 'completed': return 'status-completed'
      default: return ''
    }
  }

  return (
    <div className="appointments">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Appointments</h3>
          <div className="card-actions">
            <button className="btn btn-primary" onClick={onAddAppointment}>+ Add Appointment</button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <input
            type="date"
            className="filter-select"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          <input
            type="text"
            className="filter-select search-input"
            placeholder="Search patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchAppointments()}
          />

          <button className="btn btn-outline btn-sm" onClick={fetchAppointments}>
            Search
          </button>
        </div>

        <div className="table-container">
          {loading ? (
            <p style={{ padding: '20px', color: '#666' }}>Loading...</p>
          ) : appointments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>#{appointment.id}</td>
                    <td>{appointment.patient?.full_name}</td>
                    <td>{appointment.doctor?.full_name}</td>
                    <td>{appointment.date} {appointment.time?.slice(0, 5)}</td>
                    <td>{appointment.type_display}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="action-buttons">
                      {appointment.status === 'pending' && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleConfirm(appointment.id)}
                        >✓</button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleComplete(appointment.id)}
                        >✅</button>
                      )}
                      {['pending', 'confirmed'].includes(appointment.status) && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(appointment.id)}
                        >✕</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ padding: '20px', color: '#666' }}>No appointments found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Appointments