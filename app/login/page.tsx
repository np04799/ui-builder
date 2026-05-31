'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError('Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0f0f13', fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: '#1a1a24', borderRadius: 12, padding: '40px 48px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)', width: '100%', maxWidth: 360,
      }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 6 }}>BuilderPro</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Private preview — enter password to continue</div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoFocus
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 8,
              border: error ? '1.5px solid #f87171' : '1.5px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)', color: '#fff',
              fontSize: 15, outline: 'none', boxSizing: 'border-box', marginBottom: 8,
            }}
          />
          {error && (
            <div style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: 8, border: 'none',
              background: '#4f46e5', color: '#fff', fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              marginTop: 4,
            }}
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
