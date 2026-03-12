import React, { useEffect, useState } from "react";
import "../styles/Report.css";
import { getAppointments } from "../api/appointments";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import jsPDF from "jspdf";
import "jspdf-autotable";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Report = ({ refresh = 0 }) => {

  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    cancelled: 0,
    revenue: 0
  });

  // Fetch appointments when component mounts or refresh changes
  useEffect(() => {
    fetchReports();
  }, [refresh]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      const list = data.results || data;

      setAppointments(list);
      setFiltered(list);

      calculateStats(list);
    } catch (err) {
      console.error("Failed loading reports", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (list) => {
    const confirmed = list.filter(a => a.status === "confirmed").length;
    const cancelled = list.filter(a => a.status === "cancelled").length;
    const revenue = list
      .filter(a => a.status === "confirmed")
      .reduce((sum, a) => sum + (a.fee || 0), 0);

    setStats({
      total: list.length,
      confirmed,
      cancelled,
      revenue
    });
  };

  const handleFilter = () => {
    if (!filterDate) {
      setFiltered(appointments);
      calculateStats(appointments);
      return;
    }

    const list = appointments.filter(a => a.date === filterDate);
    setFiltered(list);
    calculateStats(list);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Clinic Appointment Report", 14, 15);

    const tableColumn = ["Patient", "Doctor", "Date", "Time", "Status"];
    const tableRows = [];

    filtered.forEach(a => {
      tableRows.push([
        a.patient?.full_name,
        a.doctor?.full_name,
        a.date,
        a.time?.slice(0,5),
        a.status
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save("clinic-report.pdf");
  };

  const chartData = {
    labels: ["Total", "Confirmed", "Cancelled"],
    datasets: [
      {
        label: "Appointments",
        data: [stats.total, stats.confirmed, stats.cancelled],
        backgroundColor: ["#3b82f6", "#10b981", "#ef4444"]
      }
    ]
  };

  return (
    <div className="reports">

      <h2 className="page-title">Reports</h2>

      {/* FILTER + EXPORT */}
      <div className="report-controls">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleFilter}>
          Filter
        </button>
        <button className="btn btn-success" onClick={exportPDF}>
          Export PDF
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="report-stats">
        <div className="report-card">
          <h3>{stats.total}</h3>
          <p>Total Appointments</p>
        </div>
        <div className="report-card">
          <h3>{stats.confirmed}</h3>
          <p>Confirmed</p>
        </div>
        <div className="report-card">
          <h3>{stats.cancelled}</h3>
          <p>Cancelled</p>
        </div>
        <div className="report-card">
          <h3>${stats.revenue}</h3>
          <p>Revenue</p>
        </div>
      </div>

      {/* CHART */}
      <div className="report-chart">
        <Bar data={chartData} />
      </div>

      {/* TABLE */}
      <div className="report-table">
        <h3>Appointments</h3>
        {loading ? (
          <p>Loading...</p>
        ) : filtered.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td>{a.patient?.full_name}</td>
                  <td>{a.doctor?.full_name}</td>
                  <td>{a.date}</td>
                  <td>{a.time?.slice(0,5)}</td>
                  <td>
                    <span className={`status ${a.status}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data found.</p>
        )}
      </div>
    </div>
  );
};

export default Report;