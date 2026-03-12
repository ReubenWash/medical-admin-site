import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments';
import Doctors from './components/Doctors';
import Patients from './components/Patients';
import Payments from './components/Payments';
import Report from './components/Report';
import Settings from './components/Settings'; // ✅ Import Settings
import NotificationModal from './components/NotificationModal';
import AppointmentModal from './components/AppointmentModal';
import DoctorModal from './components/DoctorModal';
import Login from './components/Login';
import { getCurrentUser, isAuthenticated, logout } from './api/auth';
import './App.css';

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const triggerRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderSection = () => {
    switch(currentSection) {
      case 'dashboard':
        return <Dashboard onAddAppointment={() => setShowAppointmentModal(true)} refresh={refresh} />;
      case 'appointments':
        return <Appointments onAddAppointment={() => setShowAppointmentModal(true)} refresh={refresh} />;
      case 'doctors':
        return <Doctors onAddDoctor={() => setShowDoctorModal(true)} refresh={refresh} />;
      case 'patients':
        return <Patients refresh={refresh} />;
      case 'payments':
        return <Payments refresh={refresh} />;
      case 'reports':
        return <Report refresh={refresh} />; 
      case 'settings': // ✅ Added Settings case
        return <Settings />; 
      default:
        return <Dashboard refresh={refresh} />;
    }
  };

  return (
    <div className="app">
      <Sidebar currentSection={currentSection} onSectionChange={handleSectionChange} />
      <main className="main-content">
        <Header
          currentSection={currentSection}
          user={user}
          onSendNotification={() => setShowNotificationModal(true)}
          onLogout={handleLogout}
        />
        {renderSection()}
      </main>

      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onSuccess={triggerRefresh}
      />
      <DoctorModal
        isOpen={showDoctorModal}
        onClose={() => setShowDoctorModal(false)}
        onSuccess={triggerRefresh}
      />
    </div>
  );
}

export default App;