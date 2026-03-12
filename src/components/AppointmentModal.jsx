import React, { useState, useEffect } from 'react'
import { createAppointment } from '../api/appointments'
import { getPatients } from '../api/patients'
import { getDoctors, getAvailableSlots } from '../api/doctors'
import '../styles/Modal.css'

const APPOINTMENT_TYPES = [
  { value: 'general',    label: 'General Consultation' },
  { value: 'follow_up',  label: 'Follow-Up' },
  { value: 'specialist', label: 'Specialist' },
  { value: 'emergency',  label: 'Emergency' },
  { value: 'checkup',    label: 'Routine Check-up' },
]

const AppointmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [patients, setPatients]   = useState([])
  const [doctors, setDoctors]     = useState([])
  const [slots, setSlots]         = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const [form, setForm] = useState({
    patient:          '',
    doctor:           '',
    date:             '',
    time:             '',
    appointment_type: 'general',
    reason:           '',
  })

  useEffect(() => {
    if (isOpen) {
      fetchPatients()
      fetchDoctors()
      setForm({ patient:'', doctor:'', date:'', time:'', appointment_type:'general', reason:'' })
      setSlots([])
      setError('')
    }
  }, [isOpen])

  // Fetch available slots whenever doctor + date both selected
  useEffect(() => {
    if (form.doctor && form.date) fetchSlots()
    else setSlots([])
  }, [form.doctor, form.date])

  const fetchPatients = async () => {
    try {
      const data = await getPatients({ role: 'patient' })
      setPatients(data.results || data)
    } catch { console.error('Could not load patients') }
  }

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors({ status: 'active' })
      setDoctors(data.results || data)
    } catch { console.error('Could not load doctors') }
  }

  const fetchSlots = async () => {
    setLoadingSlots(true)
    setSlots([])
    setForm(f => ({ ...f, time: '' }))
    try {
      const data = await getAvailableSlots(form.doctor, form.date)
      setSlots(data.available_slots || [])
      if ((data.available_slots || []).length === 0) {
        setError(data.message || 'No available slots for this doctor on the selected date.')
      } else {
        setError('')
      }
    } catch {
      setError('Could not load available slots.')
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.time) { setError('Please select an available time slot.'); return }
    setError('')
    setLoading(true)
    try {
      await createAppointment({
        patient:          form.patient,
        doctor:           form.doctor,
        date:             form.date,
        time:             form.time,
        appointment_type: form.appointment_type,
        reason:           form.reason,
      })
      onSuccess()
      onClose()
    } catch (err) {
      const errors = err.response?.data
      if (typeof errors === 'object') {
        const first = Object.values(errors)[0]
        setError(Array.isArray(first) ? first[0] : String(first))
      } else {
        setError('Failed to create appointment. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const minDate = new Date().toISOString().split('T')[0]

  if (!isOpen) return null

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Appointment</h2>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Patient *</label>
            <select className="form-select" name="patient" value={form.patient} onChange={handleChange} required>
              <option value="">Select Patient...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.full_name} — {p.email}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Doctor *</label>
            <select className="form-select" name="doctor" value={form.doctor} onChange={handleChange} required>
              <option value="">Select Doctor...</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.full_name} — {d.specialty}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input className="form-input" type="date" name="date" value={form.date}
                min={minDate} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">
                Time Slot * {loadingSlots && <span style={{fontSize:'12px',color:'#999'}}> loading...</span>}
              </label>
              <select className="form-select" name="time" value={form.time} onChange={handleChange}
                required disabled={!form.doctor || !form.date || loadingSlots}>
                <option value="">{
                  !form.doctor || !form.date ? 'Select doctor & date first'
                  : loadingSlots ? 'Loading slots...'
                  : slots.length === 0 ? 'No slots available'
                  : 'Select a time slot...'
                }</option>
                {slots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Appointment Type</label>
            <select className="form-select" name="appointment_type" value={form.appointment_type} onChange={handleChange}>
              {APPOINTMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Visit</label>
            <textarea className="form-input" name="reason" placeholder="Enter reason..." rows="3"
              value={form.reason} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary modal-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Appointment'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AppointmentModal
