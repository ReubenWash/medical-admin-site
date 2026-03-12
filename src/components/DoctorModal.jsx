import React, { useState } from 'react'
import { createDoctor } from '../api/doctors'
import '../styles/Modal.css'

const SPECIALTIES = [
  'Cardiologist','Pediatrician','Dermatologist','Orthopedist',
  'Neurologist','Dentist','General Practitioner','Gynecologist',
  'Ophthalmologist','Psychiatrist','Radiologist','Surgeon'
]

const DoctorModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', specialty: '', email: '',
    phone: '', consultation_fee: '', bio: '',
  })
  const [photo, setPhoto]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Photo must be under 5MB.'); return }
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Use FormData so we can send photo along with other fields
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => { if (v) fd.append(k, v) })
      if (photo) fd.append('photo', photo)

      await createDoctor(fd)
      setFormData({ first_name:'', last_name:'', specialty:'', email:'', phone:'', consultation_fee:'', bio:'' })
      setPhoto(null); setPreview(null)
      onSuccess()
      onClose()
    } catch (err) {
      const errors = err.response?.data
      if (errors) {
        const first = Object.values(errors)[0]
        setError(Array.isArray(first) ? first[0] : first)
      } else {
        setError('Failed to add doctor. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Doctor</h2>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Photo Upload */}
          <div className="form-group photo-upload-group">
            <label className="form-label">Profile Photo (optional)</label>
            <div className="photo-upload-area">
              {preview ? (
                <img src={preview} alt="Preview" className="photo-preview" />
              ) : (
                <div className="photo-upload-placeholder">👨‍⚕️</div>
              )}
              <label className="btn btn-outline btn-sm photo-upload-btn">
                {preview ? 'Change Photo' : 'Upload Photo'}
                <input type="file" accept="image/*" style={{display:'none'}} onChange={handlePhotoChange} />
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input className="form-input" name="first_name" placeholder="First name"
                value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input className="form-input" name="last_name" placeholder="Last name"
                value={formData.last_name} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Specialty *</label>
            <select className="form-select" name="specialty" value={formData.specialty} onChange={handleChange} required>
              <option value="">Select Specialty...</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" name="email" placeholder="doctor@clinic.com"
                value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input className="form-input" type="tel" name="phone" placeholder="+233201234567"
                value={formData.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Consultation Fee ($) *</label>
            <input className="form-input" type="number" name="consultation_fee" placeholder="e.g. 150"
              value={formData.consultation_fee} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-input" name="bio" placeholder="Short biography..." rows="3"
              value={formData.bio} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary modal-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Doctor'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default DoctorModal
