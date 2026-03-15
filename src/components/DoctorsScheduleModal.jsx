import React, { useState, useEffect } from 'react'
import {
  getDoctorSchedule,
  createDoctorSchedule,
  updateDoctorSchedule,
  deleteDoctorSchedule
} from '../api/doctors'
import '../styles/Modal.css'

const DAYS = [
  { value: 0, label: 'Monday' },
  { value: 1, label: 'Tuesday' },
  { value: 2, label: 'Wednesday' },
  { value: 3, label: 'Thursday' },
  { value: 4, label: 'Friday' },
  { value: 5, label: 'Saturday' },
  { value: 6, label: 'Sunday' },
]

const DURATIONS = [15, 20, 30, 45, 60]

const DEFAULT_SLOT = {
  day_of_week: 0,
  start_time: '08:00',
  end_time: '17:00',
  slot_duration_minutes: 30,
  is_available: true,
}

const DoctorScheduleModal = ({ isOpen, onClose, doctor }) => {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(null)
  const [deleting, setDeleting]   = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSlot, setNewSlot]     = useState({ ...DEFAULT_SLOT })
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')

  useEffect(() => {
    if (isOpen && doctor) fetchSchedule()
  }, [isOpen, doctor])

  const fetchSchedule = async () => {
    setLoading(true)
    try {
      const data = await getDoctorSchedule(doctor.id)
      setSchedules(data.results || data)
    } catch {
      setError('Failed to load schedule.')
    } finally {
      setLoading(false)
    }
  }

  const showMsg = (msg, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3000) }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }
  }

  const handleToggleAvailable = async (schedule) => {
    setSaving(schedule.id)
    try {
      await updateDoctorSchedule(doctor.id, schedule.id, {
        is_available: !schedule.is_available
      })
      setSchedules(prev => prev.map(s =>
        s.id === schedule.id ? { ...s, is_available: !s.is_available } : s
      ))
      showMsg(`${DAYS.find(d => d.value === schedule.day_of_week)?.label} updated.`)
    } catch {
      showMsg('Failed to update.', true)
    } finally {
      setSaving(null)
    }
  }

  const handleUpdateTime = (schedule, field, value) => {
    setSchedules(prev => prev.map(s =>
      s.id === schedule.id ? { ...s, [field]: value } : s
    ))
  }

  const handleSaveTime = async (schedule) => {
    setSaving(schedule.id)
    try {
      await updateDoctorSchedule(doctor.id, schedule.id, {
        start_time:            schedule.start_time,
        end_time:              schedule.end_time,
        slot_duration_minutes: schedule.slot_duration_minutes,
      })
      showMsg('Schedule saved!')
    } catch {
      showMsg('Failed to save.', true)
    } finally {
      setSaving(null)
    }
  }

  const handleDelete = async (schedule) => {
    if (!window.confirm(`Remove ${DAYS.find(d => d.value === schedule.day_of_week)?.label} schedule?`)) return
    setDeleting(schedule.id)
    try {
      await deleteDoctorSchedule(doctor.id, schedule.id)
      setSchedules(prev => prev.filter(s => s.id !== schedule.id))
      showMsg('Schedule removed.')
    } catch {
      showMsg('Failed to remove.', true)
    } finally {
      setDeleting(null)
    }
  }

  const handleAddSchedule = async (e) => {
    e.preventDefault()
    setError('')
    if (schedules.some(s => s.day_of_week === parseInt(newSlot.day_of_week))) {
      showMsg(`${DAYS.find(d => d.value === parseInt(newSlot.day_of_week))?.label} already has a schedule.`, true)
      return
    }
    setSaving('new')
    try {
      const created = await createDoctorSchedule(doctor.id, {
        ...newSlot,
        day_of_week: parseInt(newSlot.day_of_week),
        slot_duration_minutes: parseInt(newSlot.slot_duration_minutes),
      })
      setSchedules(prev => [...prev, created].sort((a, b) => a.day_of_week - b.day_of_week))
      setNewSlot({ ...DEFAULT_SLOT })
      setShowAddForm(false)
      showMsg('Schedule added!')
    } catch (err) {
      const msg = err.response?.data
      showMsg(msg ? JSON.stringify(msg) : 'Failed to add schedule.', true)
    } finally {
      setSaving(null)
    }
  }

  if (!isOpen || !doctor) return null

  const scheduledDays = schedules.map(s => s.day_of_week)
  const availableDays = DAYS.filter(d => !scheduledDays.includes(d.value))

  return (
    <div className="modal active" onClick={(e) => { if (e.target.classList.contains('modal')) onClose() }}>
      <div className="modal-content schedule-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Schedule — {doctor.full_name}</h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{doctor.specialty}</p>
          </div>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>

        {error   && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        {loading ? (
          <p style={{ color: '#666', padding: '20px 0' }}>Loading schedule...</p>
        ) : schedules.length > 0 ? (
          <div className="schedule-list">
            {schedules
              .sort((a, b) => a.day_of_week - b.day_of_week)
              .map(schedule => (
                <div key={schedule.id} className={`schedule-row ${!schedule.is_available ? 'unavailable' : ''}`}>
                  <div className="schedule-day">
                    <label className="toggle-wrap">
                      <input
                        type="checkbox"
                        checked={schedule.is_available}
                        onChange={() => handleToggleAvailable(schedule)}
                        disabled={saving === schedule.id}
                      />
                      <span className="day-label">
                        {DAYS.find(d => d.value === schedule.day_of_week)?.label}
                      </span>
                    </label>
                  </div>

                  <div className="schedule-times">
                    <div className="time-field">
                      <label>Start</label>
                      <input
                        type="time"
                        value={schedule.start_time?.slice(0, 5)}
                        onChange={e => handleUpdateTime(schedule, 'start_time', e.target.value)}
                        disabled={!schedule.is_available}
                      />
                    </div>
                    <div className="time-field">
                      <label>End</label>
                      <input
                        type="time"
                        value={schedule.end_time?.slice(0, 5)}
                        onChange={e => handleUpdateTime(schedule, 'end_time', e.target.value)}
                        disabled={!schedule.is_available}
                      />
                    </div>
                    <div className="time-field">
                      <label>Slot (min)</label>
                      <select
                        value={schedule.slot_duration_minutes}
                        onChange={e => handleUpdateTime(schedule, 'slot_duration_minutes', parseInt(e.target.value))}
                        disabled={!schedule.is_available}
                      >
                        {DURATIONS.map(d => <option key={d} value={d}>{d} min</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="schedule-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSaveTime(schedule)}
                      disabled={saving === schedule.id || !schedule.is_available}
                    >
                      {saving === schedule.id ? '...' : 'Save'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(schedule)}
                      disabled={deleting === schedule.id}
                    >
                      {deleting === schedule.id ? '...' : '✕'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p style={{ color: '#94a3b8', padding: '16px 0', fontSize: '14px' }}>
            No schedule set yet. Add working days below.
          </p>
        )}

        {availableDays.length > 0 && (
          <>
            {!showAddForm ? (
              <button
                className="btn btn-outline btn-sm"
                style={{ marginTop: '16px' }}
                onClick={() => setShowAddForm(true)}
              >
                + Add Working Day
              </button>
            ) : (
              <form className="add-schedule-form" onSubmit={handleAddSchedule}>
                <h4 style={{ marginBottom: '12px', color: '#1e293b' }}>Add Working Day</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Day</label>
                    <select
                      className="form-select"
                      value={newSlot.day_of_week}
                      onChange={e => setNewSlot(s => ({ ...s, day_of_week: parseInt(e.target.value) }))}
                    >
                      {availableDays.map(d => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Slot Duration</label>
                    <select
                      className="form-select"
                      value={newSlot.slot_duration_minutes}
                      onChange={e => setNewSlot(s => ({ ...s, slot_duration_minutes: parseInt(e.target.value) }))}
                    >
                      {DURATIONS.map(d => <option key={d} value={d}>{d} minutes</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={newSlot.start_time}
                      onChange={e => setNewSlot(s => ({ ...s, start_time: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={newSlot.end_time}
                      onChange={e => setNewSlot(s => ({ ...s, end_time: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={saving === 'new'}>
                    {saving === 'new' ? 'Adding...' : 'Add Day'}
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {schedules.length > 0 && availableDays.length === 0 && (
          <p style={{ fontSize: '13px', color: '#22c55e', marginTop: '12px' }}>
            ✅ All 7 days scheduled
          </p>
        )}
      </div>
    </div>
  )
}

export default DoctorScheduleModal