import React, { useState, useEffect } from 'react'
import { getDashboardStats } from '../api/auth'
import { getTodaysAppointments, updateAppointment, getAppointmentCalendar } from '../api/appointments'
import { getDoctors } from '../api/doctors'
import '../styles/Dashboard.css'

const Dashboard = ({ onAddAppointment, refresh }) => {
  const [stats, setStats] = useState({
    todays_appointments: 0,
    upcoming_appointments: 0,
    monthly_revenue: 0,
    total_patients: 0
  })
  const [todaysAppointments, setTodaysAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [calendar, setCalendar] = useState([])
  const [calendarData, setCalendarData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [refresh])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const today = new Date()
      const [statsData, appointmentsData, doctorsData, calendarRes] = await Promise.all([
        getDashboardStats(),
        getTodaysAppointments(),
        getDoctors(),
        getAppointmentCalendar(today.getFullYear(), today.getMonth() + 1)
      ])
      setStats(statsData)
      setTodaysAppointments(appointmentsData.results || appointmentsData)
      setDoctors(doctorsData.results || doctorsData)
      setCalendarData(calendarRes.data || [])
      generateCalendar(calendarRes.data || [])
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateCalendar = (appointmentCounts) => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({ day: '', isToday: false, hasAppointment: false })
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const isToday = day === today.getDate()
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const hasAppointment = appointmentCounts.some(a => a.date === dateStr && a.count > 0)
      days.push({ day, isToday, hasAppointment })
    }

    setCalendar(days)
  }

  const handleConfirm = async (id) => {
    try {
      await updateAppointment(id, { status: 'confirmed' })
      fetchAll()
    } catch (err) {
      alert('Failed to confirm appointment.')
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    try {
      await updateAppointment(id, { status: 'cancelled' })
      fetchAll()
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

  const today = new Date()
  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' })

  const confirmedCount = todaysAppointments.filter(a => a.status === 'confirmed').length
  const pendingCount   = todaysAppointments.filter(a => a.status === 'pending').length
  const cancelledCount = todaysAppointments.filter(a => a.status === 'cancelled').length

  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-today">📅</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.todays_appointments}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-upcoming">⏰</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.upcoming_appointments}</h3>
            <p>Upcoming Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-revenue">💰</div>
          <div className="stat-info">
            <h3>{loading ? '...' : `$${stats.monthly_revenue}`}</h3>
            <p>Monthly Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-patients">👤</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.total_patients}</h3>
            <p>Total Patients</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Today's Appointments */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Today's Appointments</h3>
            <div className="card-actions">
              <button className="btn btn-outline btn-sm" onClick={fetchAll}>Refresh</button>
              <button className="btn btn-primary btn-sm" onClick={onAddAppointment}>Add New</button>
            </div>
          </div>
          <div className="table-container">
            {loading ? (
              <p style={{ padding: '20px', color: '#666' }}>Loading...</p>
            ) : todaysAppointments.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysAppointments.map(appointment => (
                    <tr key={appointment.id}>
                      <td>{appointment.patient?.full_name}</td>
                      <td>{appointment.doctor?.full_name}</td>
                      <td>{appointment.time?.slice(0, 5)}</td>
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
              <p style={{ padding: '20px', color: '#666' }}>No appointments today.</p>
            )}
          </div>
        </div>

        {/* Quick Stats & Calendar */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Stats</h3>
          </div>

          <div className="quick-stats">
            <div className="stat-row">
              <span>Confirmed:</span>
              <span className="stat-value">{confirmedCount}</span>
            </div>
            <div className="stat-row">
              <span>Pending:</span>
              <span className="stat-value">{pendingCount}</span>
            </div>
            <div className="stat-row">
              <span>Cancelled:</span>
              <span className="stat-value">{cancelledCount}</span>
            </div>
          </div>

          <h4 className="section-subtitle">Doctor Availability</h4>
          <div className="doctor-availability">
            {doctors.slice(0, 3).map(doctor => (
              <div key={doctor.id} className="stat-row">
                <span>{doctor.full_name}:</span>
                <span className={`stat-value ${doctor.status === 'active' ? 'text-success' : 'text-warning'}`}>
                  {doctor.status}
                </span>
              </div>
            ))}
          </div>

          {/* Mini Calendar */}
          <h4 className="section-subtitle">{monthName}</h4>
          <div className="calendar">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-header">{day}</div>
            ))}
            {calendar.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${day.isToday ? 'today' : ''} ${day.hasAppointment ? 'appointment' : ''}`}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard