import React, { useState } from "react";
import "../styles/Sidebar.css";

import logo from "../assets/logo.jpg"; // ✅ Import logo

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faUserDoctor,
  faHospitalUser,
  faSackDollar,
  faChartArea,
  faGear,
  faBars
} from "@fortawesome/free-solid-svg-icons";

import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";

const Sidebar = ({ currentSection, onSectionChange }) => {

  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: "dashboard", icon: faGaugeHigh, label: "Dashboard" },
    { id: "appointments", icon: faCalendarDays, label: "Appointments" },
    { id: "doctors", icon: faUserDoctor, label: "Doctors" },
    { id: "patients", icon: faHospitalUser, label: "Patients" },
    { id: "payments", icon: faSackDollar, label: "Payments" },
    { id: "reports", icon: faChartArea, label: "Reports" },
    { id: "settings", icon: faGear, label: "Settings" }
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      <div className="logo">

        {/* Logo Image */}
        <img src={logo} alt="MediCare Logo" className="sidebar-logo" />

        {!collapsed && <span className="logo-text">MediCare Admin</span>}

        <button
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <ul className="nav-menu">
        {navItems.map((item) => (
          <li key={item.id} className="nav-item">
            <a
              href="#"
              className={`nav-link ${
                currentSection === item.id ? "active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onSectionChange(item.id);
              }}
            >
              <span className="nav-icon">
                <FontAwesomeIcon icon={item.icon} />
              </span>

              {!collapsed && (
                <span className="nav-text">{item.label}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;