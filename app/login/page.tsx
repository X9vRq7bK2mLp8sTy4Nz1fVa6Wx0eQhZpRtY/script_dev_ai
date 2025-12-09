'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // First, try to initialize the database (idempotent - won't fail if already initialized)
      try {
        await fetch('/api/init')
      } catch (initError) {
        console.log('DB init attempted')
      }

      // Then attempt login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // Success - redirect to main app
      window.location.href = '/'
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo">🎮</span>
          <h1>Roblox Script Dev AI</h1>
          <p>AI-Powered Script Development Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary login-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-hint">
            💡 Default: <code>admin</code> / <code>admin1234</code>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
          background: linear-gradient(135deg, 
            var(--color-bg-primary) 0%, 
            var(--color-bg-secondary) 50%, 
            var(--color-bg-primary) 100%
          );
        }

        .login-card {
          width: 100%;
          max-width: 450px;
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          padding: var(--spacing-2xl);
          box-shadow: var(--shadow-xl);
          animation: slideUp 0.5s ease;
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .login-logo {
          font-size: 4rem;
          display: block;
          margin-bottom: var(--spacing-md);
          filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.5));
        }

        .login-header h1 {
          margin: 0 0 var(--spacing-sm) 0;
        }

        .login-header p {
          color: var(--color-text-secondary);
          margin: 0;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .form-group label {
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .login-btn {
          width: 100%;
          margin-top: var(--spacing-md);
          padding: var(--spacing-lg);
          font-size: 1.125rem;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          color: var(--color-accent-error);
          animation: slideUp 0.3s ease;
        }

        .login-footer {
          margin-top: var(--spacing-xl);
          text-align: center;
        }

        .login-hint {
          color: var(--color-text-tertiary);
          font-size: 0.875rem;
        }

        .login-hint code {
          background: var(--color-bg-elevated);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          color: var(--color-accent-primary);
          font-family: 'Monaco', monospace;
        }
      `}</style>
    </div>
  )
}
