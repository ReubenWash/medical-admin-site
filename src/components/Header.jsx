import React from 'react'
import '../styles/Header.css'

const Header = ({ currentSection, user, onSendNotification, onLogout }) => {
  const titles = {
    dashboard:    { title: 'Admin Dashboard',       subtitle: "Welcome back. Here's what's happening today." },
    appointments: { title: 'Appointment Management', subtitle: 'Manage and track all appointments' },
    doctors:      { title: 'Doctor Management',      subtitle: 'Add, edit, and manage doctor profiles' },
    patients:     { title: 'Patient Management',     subtitle: 'View and manage patient information' },
    payments:     { title: 'Payment Management',     subtitle: 'Track payments and generate invoices' },
    reports:      { title: 'Reports & Analytics',    subtitle: 'Analytics and detailed reports' },
    settings:     { title: 'System Settings',        subtitle: 'Configure system settings and preferences' }
  }

  const current = titles[currentSection] || titles.dashboard

  return (
    <header className="top-header">
      <div className="header-title">
        <h1>{current.title}</h1>
        <p>{current.subtitle}</p>
      </div>
      <div className="header-actions">
        <button className="btn btn-primary" onClick={onSendNotification}>
          🔔 Send Notification
        </button>
        <div className="admin-profile">
          <div className="profile-img">
            {user?.full_name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{user?.full_name || 'Admin'}</div>
            <div style={{ fontSize: '12px', color: 'var(--gray)' }}>Super Admin</div>
          </div>
          <button
            onClick={onLogout}
            style={{
              marginLeft: '10px', padding: '6px 12px',
              background: '#ef4444', color: 'white',
              border: 'none', borderRadius: '6px',
              cursor: 'pointer', fontSize: '13px'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
  
export default Header