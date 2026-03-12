import React, { useState, useEffect } from 'react'
import { getPayments, updatePayment } from '../api/payments'
import '../styles/Payments.css'

const Payments = ({ refresh }) => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [refresh, filterStatus])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filterStatus) params.status = filterStatus
      const data = await getPayments(params)
      setPayments(data.results || data)
    } catch (err) {
      console.error('Failed to load payments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async (id) => {
    const method = window.prompt('Enter payment method (cash, card, mobile_money, insurance, bank):')
    if (!method) return
    try {
      await updatePayment(id, { status: 'paid', method })
      fetchPayments()
    } catch (err) {
      alert('Failed to update payment.')
    }
  }

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'paid':     return 'status-confirmed'
      case 'pending':  return 'status-pending'
      case 'refunded': return 'status-cancelled'
      case 'failed':   return 'status-cancelled'
      default: return ''
    }
  }

  return (
    <div className="payments">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Payment Management</h3>
          <div className="card-actions">
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ marginRight: '10px' }}
            >
              <option value="">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <p style={{ padding: '20px', color: '#666' }}>Loading...</p>
          ) : payments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.invoice_number}</td>
                    <td>{payment.appointment?.patient?.full_name}</td>
                    <td>{payment.appointment?.doctor?.full_name}</td>
                    <td>${payment.amount}</td>
                    <td>{payment.method_display || '—'}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      {payment.paid_at
                        ? new Date(payment.paid_at).toLocaleDateString()
                        : new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="action-buttons">
                      {payment.status === 'pending' && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleMarkPaid(payment.id)}
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ padding: '20px', color: '#666' }}>No payments found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Payments