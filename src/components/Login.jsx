import React, { useState } from 'react'
import { login } from '../api/auth'
import logo from '../assets/logo.jpg' // ✅ Use your JPEG logo

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      onLogin(user)
    } catch (err) {
      setError(err.message || err.response?.data?.detail || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', height: '100vh',
      background: '#f1f5f9'
    }}>
      <div style={{
        background: 'white', padding: '40px',
        borderRadius: '10px', width: '100%',
        maxWidth: '400px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          {/* Logo */}
          <img 
            src={logo} 
            alt="Clinic Logo" 
            style={{ width: '100px', height: 'auto', marginBottom: '15px', borderRadius: '8px' }} 
          />
          <h2 style={{ color: '#1e293b', marginTop: '10px' }}>Admin Login</h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Sign in to your admin account</p>
        </div>

        {error && (
          <p style={{
            color: 'red', fontSize: '14px',
            marginBottom: '15px', textAlign: 'center'
          }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              required
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid #e2e8f0', borderRadius: '6px',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid #e2e8f0', borderRadius: '6px',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px',
              background: '#2563eb', color: 'white',
              border: 'none', borderRadius: '6px',
              fontSize: '15px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login;