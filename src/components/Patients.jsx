import React, { useState, useEffect } from 'react'
import { getPatients, deactivateUser } from '../api/patients'
import { adminResetUserPassword } from '../api/auth'
import '../styles/Patients.css'

const Patients = ({ refresh }) => {
  const [patients, setPatients]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [searchTerm, setSearchTerm]   = useState('')
  const [resetting, setResetting]     = useState(null)
  const [toast, setToast]             = useState('')

  useEffect(() => { fetchPatients() }, [refresh])

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const params = { role: 'patient' }
      if (searchTerm) params.search = searchTerm
      const data = await getPatients(params)
      setPatients(data.results || data)
    } catch (err) {
      console.error('Failed to load patients:', err)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  const handleResetPassword = async (patient) => {
    if (!window.confirm(`Send a password reset email to ${patient.email}?`)) return
    setResetting(patient.id)
    try {
      await adminResetUserPassword(patient.id)
      showToast(`✅ Password reset email sent to ${patient.email}`)
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to send reset email.'
      showToast(`❌ ${msg}`)
    } finally {
      setResetting(null)
    }
  }

  const handleDeactivate = async (patient) => {
    if (!window.confirm(`Deactivate ${patient.full_name}?`)) return
    try {
      await deactivateUser(patient.id)
      showToast(`${patient.full_name} deactivated.`)
      fetchPatients()
    } catch {
      showToast('Failed to deactivate patient.')
    }
  }

  return (
    <div className="patients">
      {toast && <div className="toast-notification">{toast}</div>}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Patient Management</h3>
          <div className="card-actions">
            <input
              type="text"
              className="filter-select search-input"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPatients()}
            />
            <button className="btn btn-outline btn-sm" onClick={fetchPatients}>Search</button>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <p className="empty-msg">Loading...</p>
          ) : patients.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Email Verified</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient.id}>
                    <td>#{patient.id}</td>
                    <td>{patient.full_name}</td>
                    <td>{patient.email}</td>
                    <td>{patient.phone || '—'}</td>
                    <td style={{ textTransform: 'capitalize' }}>{patient.gender || patient.patient_profile?.gender || '—'}</td>
                    <td>
                      <span className={`status-badge ${patient.is_email_verified ? 'status-confirmed' : 'status-pending'}`}>
                        {patient.is_email_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${patient.is_active ? 'status-confirmed' : 'status-cancelled'}`}>
                        {patient.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(patient.date_joined).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <button
                        className="btn btn-outline btn-sm"
                        title="Send password reset email"
                        onClick={() => handleResetPassword(patient)}
                        disabled={resetting === patient.id}
                      >
                        {resetting === patient.id ? '⏳' : '🔑 Reset'}
                      </button>
                      {patient.is_active && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeactivate(patient)}>
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-msg">No patients found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Patients
