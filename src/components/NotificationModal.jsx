import React from 'react'
import '../styles/Modal.css'

const NotificationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Notification sent successfully!')
    onClose()
  }

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Send Notification</h2>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Recipient Type</label>
            <select className="form-select">
              <option value="all">All Patients</option>
              <option value="upcoming">Upcoming Appointments</option>
              <option value="specific">Specific Patients</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Notification Type</label>
            <select className="form-select">
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea 
              className="form-textarea" 
              placeholder="Enter your notification message..." 
              rows="4"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary modal-btn">Send Notification</button>
        </form>
      </div>
    </div>
  )
}

export default NotificationModal