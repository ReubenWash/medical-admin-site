import React, { useState } from "react";
import "../styles/Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("clinic");

  // Form state (you can extend or connect to backend)
  const [clinicInfo, setClinicInfo] = useState({
    name: "MediCare Clinic",
    address: "",
    phone: "",
    email: "",
    hours: "Mon-Fri 8am-5pm"
  });

  const [appointmentSettings, setAppointmentSettings] = useState({
    defaultDuration: 30,
    maxDaily: 20,
    onlineBooking: true
  });

  const [paymentSettings, setPaymentSettings] = useState({
    defaultFee: 50,
    paymentMethods: { cash: true, card: true, mobileMoney: true },
    tax: 0
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    reminderHours: 24
  });

  const [systemPrefs, setSystemPrefs] = useState({
    theme: "light",
    language: "en",
    defaultSection: "dashboard"
  });

  const handleSave = () => {
    // Here you can call your backend API to save settings
    alert("Settings saved (mock)");
  };

  return (
    <div className="settings">
      <h2 className="page-title">Settings</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "clinic" ? "active" : ""}
          onClick={() => setActiveTab("clinic")}
        >
          Clinic Info
        </button>
        <button
          className={activeTab === "appointments" ? "active" : ""}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
        </button>
        <button
          className={activeTab === "payments" ? "active" : ""}
          onClick={() => setActiveTab("payments")}
        >
          Payments
        </button>
        <button
          className={activeTab === "notifications" ? "active" : ""}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
        <button
          className={activeTab === "system" ? "active" : ""}
          onClick={() => setActiveTab("system")}
        >
          System
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "clinic" && (
          <div className="tab-panel">
            <label>
              Clinic Name:
              <input
                type="text"
                value={clinicInfo.name}
                onChange={(e) => setClinicInfo({...clinicInfo, name: e.target.value})}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                value={clinicInfo.address}
                onChange={(e) => setClinicInfo({...clinicInfo, address: e.target.value})}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                value={clinicInfo.phone}
                onChange={(e) => setClinicInfo({...clinicInfo, phone: e.target.value})}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={clinicInfo.email}
                onChange={(e) => setClinicInfo({...clinicInfo, email: e.target.value})}
              />
            </label>
            <label>
              Working Hours:
              <input
                type="text"
                value={clinicInfo.hours}
                onChange={(e) => setClinicInfo({...clinicInfo, hours: e.target.value})}
              />
            </label>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="tab-panel">
            <label>
              Default Appointment Duration (min):
              <input
                type="number"
                value={appointmentSettings.defaultDuration}
                onChange={(e) =>
                  setAppointmentSettings({...appointmentSettings, defaultDuration: e.target.value})
                }
              />
            </label>
            <label>
              Max Daily Appointments per Doctor:
              <input
                type="number"
                value={appointmentSettings.maxDaily}
                onChange={(e) =>
                  setAppointmentSettings({...appointmentSettings, maxDaily: e.target.value})
                }
              />
            </label>
            <label>
              Online Booking:
              <input
                type="checkbox"
                checked={appointmentSettings.onlineBooking}
                onChange={(e) =>
                  setAppointmentSettings({...appointmentSettings, onlineBooking: e.target.checked})
                }
              />
            </label>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="tab-panel">
            <label>
              Default Consultation Fee ($):
              <input
                type="number"
                value={paymentSettings.defaultFee}
                onChange={(e) =>
                  setPaymentSettings({...paymentSettings, defaultFee: e.target.value})
                }
              />
            </label>
            <label>
              Payment Methods:
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={paymentSettings.paymentMethods.cash}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        paymentMethods: {...paymentSettings.paymentMethods, cash: e.target.checked}
                      })
                    }
                  />
                  Cash
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={paymentSettings.paymentMethods.card}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        paymentMethods: {...paymentSettings.paymentMethods, card: e.target.checked}
                      })
                    }
                  />
                  Card
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={paymentSettings.paymentMethods.mobileMoney}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        paymentMethods: {...paymentSettings.paymentMethods, mobileMoney: e.target.checked}
                      })
                    }
                  />
                  Mobile Money
                </label>
              </div>
            </label>
            <label>
              Tax (%):
              <input
                type="number"
                value={paymentSettings.tax}
                onChange={(e) =>
                  setPaymentSettings({...paymentSettings, tax: e.target.value})
                }
              />
            </label>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="tab-panel">
            <label>
              Email Notifications:
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
              />
            </label>
            <label>
              SMS Notifications:
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
              />
            </label>
            <label>
              Reminder Time (hours before appointment):
              <input
                type="number"
                value={notifications.reminderHours}
                onChange={(e) => setNotifications({...notifications, reminderHours: e.target.value})}
              />
            </label>
          </div>
        )}

        {activeTab === "system" && (
          <div className="tab-panel">
            <label>
              Theme:
              <select
                value={systemPrefs.theme}
                onChange={(e) => setSystemPrefs({...systemPrefs, theme: e.target.value})}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label>
              Language:
              <select
                value={systemPrefs.language}
                onChange={(e) => setSystemPrefs({...systemPrefs, language: e.target.value})}
              >
                <option value="en">English</option>
                <option value="fr">French</option>
              </select>
            </label>
            <label>
              Default Dashboard Section:
              <select
                value={systemPrefs.defaultSection}
                onChange={(e) => setSystemPrefs({...systemPrefs, defaultSection: e.target.value})}
              >
                <option value="dashboard">Dashboard</option>
                <option value="appointments">Appointments</option>
                <option value="reports">Reports</option>
              </select>
            </label>
          </div>
        )}
      </div>

      <button className="btn btn-primary save-btn" onClick={handleSave}>
        Save Settings
      </button>
    </div>
  );
};

export default Settings;