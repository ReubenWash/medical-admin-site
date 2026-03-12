import React, { useState, useEffect, useRef } from 'react'
import { getDoctors, updateDoctor, deleteDoctor, uploadDoctorPhoto, deleteDoctorPhoto } from '../api/doctors'
import '../styles/Doctors.css'

const Doctors = ({ onAddDoctor, refresh }) => {
  const [doctors, setDoctors]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [uploading, setUploading] = useState(null) // doctor id currently uploading
  const [editDoctor, setEditDoctor] = useState(null)
  const fileInputRefs = useRef({})

  useEffect(() => { fetchDoctors() }, [refresh])

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      const data = await getDoctors(params)
      setDoctors(data.results || data)
    } catch (err) {
      console.error('Failed to load doctors:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (doctor) => {
    const newStatus = doctor.status === 'active' ? 'inactive' : 'active'
    try {
      await updateDoctor(doctor.id, { status: newStatus })
      fetchDoctors()
    } catch { alert('Failed to update doctor status.') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this doctor?')) return
    try {
      await deleteDoctor(id)
      fetchDoctors()
    } catch { alert('Failed to deactivate doctor.') }
  }

  const handlePhotoClick = (doctorId) => {
    fileInputRefs.current[doctorId]?.click()
  }

  const handlePhotoChange = async (e, doctorId) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return }
    if (file.size > 5 * 1024 * 1024) { alert('Photo must be under 5MB.'); return }

    setUploading(doctorId)
    try {
      await uploadDoctorPhoto(doctorId, file)
      fetchDoctors()
    } catch { alert('Failed to upload photo. Please try again.') }
    finally { setUploading(null); e.target.value = '' }
  }

  const handleRemovePhoto = async (doctorId) => {
    if (!window.confirm('Remove this doctor\'s photo?')) return
    try {
      await deleteDoctorPhoto(doctorId)
      fetchDoctors()
    } catch { alert('Failed to remove photo.') }
  }

  const handleSaveEdit = async () => {
    if (!editDoctor) return
    try {
      await updateDoctor(editDoctor.id, {
        first_name:       editDoctor.first_name,
        last_name:        editDoctor.last_name,
        specialty:        editDoctor.specialty,
        email:            editDoctor.email,
        phone:            editDoctor.phone,
        consultation_fee: editDoctor.consultation_fee,
        bio:              editDoctor.bio,
        status:           editDoctor.status,
      })
      setEditDoctor(null)
      fetchDoctors()
    } catch (err) {
      const msg = err.response?.data
      alert(msg ? JSON.stringify(msg) : 'Failed to save changes.')
    }
  }

  const specialties = [
    'Cardiologist','Pediatrician','Dermatologist','Orthopedist',
    'Neurologist','Dentist','General Practitioner','Gynecologist',
    'Ophthalmologist','Psychiatrist','Radiologist','Surgeon'
  ]

  return (
    <div className="doctors">

      {/* Edit Modal */}
      {editDoctor && (
        <div className="modal active" onClick={() => setEditDoctor(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Doctor</h2>
              <button className="close-modal" onClick={() => setEditDoctor(null)}>&times;</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" value={editDoctor.first_name}
                  onChange={e => setEditDoctor({...editDoctor, first_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" value={editDoctor.last_name}
                  onChange={e => setEditDoctor({...editDoctor, last_name: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Specialty</label>
              <select className="form-select" value={editDoctor.specialty}
                onChange={e => setEditDoctor({...editDoctor, specialty: e.target.value})}>
                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={editDoctor.email}
                  onChange={e => setEditDoctor({...editDoctor, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={editDoctor.phone}
                  onChange={e => setEditDoctor({...editDoctor, phone: e.target.value})} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fee ($)</label>
                <input className="form-input" type="number" value={editDoctor.consultation_fee}
                  onChange={e => setEditDoctor({...editDoctor, consultation_fee: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={editDoctor.status}
                  onChange={e => setEditDoctor({...editDoctor, status: e.target.value})}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-input" rows="3" value={editDoctor.bio}
                onChange={e => setEditDoctor({...editDoctor, bio: e.target.value})} />
            </div>
            <button className="btn btn-primary modal-btn" onClick={handleSaveEdit}>Save Changes</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Doctor Management</h3>
          <div className="card-actions">
            <input
              type="text"
              className="filter-select search-input"
              placeholder="Search doctors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchDoctors()}
            />
            <button className="btn btn-outline btn-sm" onClick={fetchDoctors}>Search</button>
            <button className="btn btn-primary" onClick={onAddDoctor}>+ Add Doctor</button>
          </div>
        </div>

        <div className="doctors-grid">
          {loading ? (
            <p className="empty-msg">Loading...</p>
          ) : doctors.length > 0 ? (
            doctors.map(doctor => (
              <div key={doctor.id} className="doctor-card">
                {/* Photo */}
                <div className="doctor-photo-wrap">
                  {doctor.photo_url ? (
                    <img src={doctor.photo_url} alt={doctor.full_name} className="doctor-photo" />
                  ) : (
                    <div className="doctor-photo-placeholder">
                      {doctor.first_name?.charAt(0)}{doctor.last_name?.charAt(0)}
                    </div>
                  )}
                  <div className="photo-actions">
                    <button
                      className="photo-btn upload-btn"
                      onClick={() => handlePhotoClick(doctor.id)}
                      disabled={uploading === doctor.id}
                      title="Upload photo"
                    >
                      {uploading === doctor.id ? '⏳' : '📷'}
                    </button>
                    {doctor.photo_url && (
                      <button
                        className="photo-btn remove-btn"
                        onClick={() => handleRemovePhoto(doctor.id)}
                        title="Remove photo"
                      >✕</button>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={el => fileInputRefs.current[doctor.id] = el}
                    onChange={e => handlePhotoChange(e, doctor.id)}
                  />
                </div>

                {/* Info */}
                <div className="doctor-info">
                  <h4 className="doctor-name">{doctor.full_name}</h4>
                  <span className="doctor-specialty">{doctor.specialty}</span>
                  <div className="doctor-meta">
                    <span>✉ {doctor.email}</span>
                    <span>📞 {doctor.phone}</span>
                    <span>💰 ${doctor.consultation_fee}</span>
                  </div>
                  {doctor.bio && <p className="doctor-bio">{doctor.bio}</p>}
                </div>

                {/* Footer */}
                <div className="doctor-card-footer">
                  <span className={`status-badge ${doctor.status === 'active' ? 'status-confirmed' : doctor.status === 'on_leave' ? 'status-pending' : 'status-cancelled'}`}>
                    {doctor.status === 'on_leave' ? 'On Leave' : doctor.status}
                  </span>
                  <div className="doctor-card-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => setEditDoctor({...doctor})}>
                      Edit
                    </button>
                    <button
                      className={`btn btn-sm ${doctor.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => toggleStatus(doctor)}
                    >
                      {doctor.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-msg">No doctors found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors
