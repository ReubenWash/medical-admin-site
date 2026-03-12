export const appointmentsData = [
  { id: 1, patient: "John Doe", doctor: "Dr. Smith", time: "11:00 AM", status: "confirmed", type: "Consultation", date: "2024-12-10", amount: "$150" },
  { id: 2, patient: "Michael Brown", doctor: "Dr. Clark", time: "10:30 AM", status: "confirmed", type: "Follow-up", date: "2024-12-10", amount: "$100" },
  { id: 3, patient: "Jane Smith", doctor: "Dr. Sariem", time: "2:00 PM", status: "pending", type: "Consultation", date: "2024-12-10", amount: "$200" },
  { id: 4, patient: "Robert Johnson", doctor: "Dr. Smith", time: "3:30 PM", status: "confirmed", type: "Checkup", date: "2024-12-10", amount: "$120" },
  { id: 5, patient: "Sarah Wilson", doctor: "Dr. Clark", time: "4:15 PM", status: "cancelled", type: "Consultation", date: "2024-12-10", amount: "$150" }
];

export const doctorsData = [
  { id: 1, name: "Dr. Mark Smith", specialty: "Pediatrician", contact: "smith@clinic.com", schedule: "Mon-Fri, 9AM-5PM", status: "active" },
  { id: 2, name: "Dr. Emma Clark", specialty: "Dermatologist", contact: "clark@clinic.com", schedule: "Mon-Wed-Fri, 10AM-6PM", status: "active" },
  { id: 3, name: "Dr. Sarah Sariem", specialty: "Cardiologist", contact: "sariem@clinic.com", schedule: "Tue-Thu, 8AM-4PM", status: "active" },
  { id: 4, name: "Dr. James Wilson", specialty: "Orthopedist", contact: "wilson@clinic.com", schedule: "Mon-Thu, 9AM-5PM", status: "inactive" }
];

export const patientsData = [
  { id: 1, name: "John Doe", email: "john@email.com", phone: "(123) 456-7890", age: 35, gender: "Male", lastVisit: "2024-11-15" },
  { id: 2, name: "Jane Smith", email: "jane@email.com", phone: "(234) 567-8901", age: 28, gender: "Female", lastVisit: "2024-12-01" },
  { id: 3, name: "Michael Brown", email: "michael@email.com", phone: "(345) 678-9012", age: 42, gender: "Male", lastVisit: "2024-11-28" },
  { id: 4, name: "Sarah Johnson", email: "sarah@email.com", phone: "(456) 789-0123", age: 31, gender: "Female", lastVisit: "2024-12-05" }
];

export const paymentsData = [
  { invoice: "INV-001", patient: "John Doe", appointment: "Checkup", date: "2024-12-10", amount: "$150", method: "Credit Card", status: "Paid" },
  { invoice: "INV-002", patient: "Jane Smith", appointment: "Consultation", date: "2024-12-09", amount: "$200", method: "Insurance", status: "Pending" },
  { invoice: "INV-003", patient: "Michael Brown", appointment: "Follow-up", date: "2024-12-08", amount: "$100", method: "Cash", status: "Paid" },
  { invoice: "INV-004", patient: "Sarah Johnson", appointment: "Emergency", date: "2024-12-07", amount: "$350", method: "Credit Card", status: "Paid" }
];