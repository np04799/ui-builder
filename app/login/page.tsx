'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  isConfigured,
} from '@/lib/firebase'

type Mode = 'signin' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password)
      } else {
        await signInWithEmail(email, password)
      }
      router.push('/builder')
    } catch (err) {
      setError(err instanceof Error ? friendlyError(err.message) : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      router.push('/builder')
    } catch (err) {
      setError(err instanceof Error ? friendlyError(err.message) : 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isConfigured) {
    return (
      <div style={PAGE}>
        <div style={CARD}>
          <Logo />
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', marginTop: 16 }}>
            Firebase is not configured. Set{' '}
            <code style={{ color: '#a5b4fc' }}>NEXT_PUBLIC_FIREBASE_*</code> env vars to enable auth.
          </p>
          <button
            style={{ ...BTN_PRIMARY, marginTop: 24 }}
            onClick={() => router.push('/builder')}
          >
            Continue without account
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={PAGE}>
      <div style={CARD}>
        <Logo />
        <h1 style={{ margin: '20px 0 4px', fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', textAlign: 'center' }}>
          {mode === 'signup' ? 'Create account' : 'Welcome back'}
        </h1>
        <p style={{ margin: '0 0 24px', fontSize: '0.8125rem', color: '#64748b', textAlign: 'center' }}>
          {mode === 'signup' ? 'Start building for free' : 'Sign in to access your projects'}
        </p>

        {/* Google */}
        <button style={BTN_GOOGLE} onClick={handleGoogle} disabled={loading}>
          <GoogleIcon />
          Continue with Google
        </button>

        <div style={DIVIDER_WRAP}>
          <div style={DIVIDER_LINE} />
          <span style={DIVIDER_TEXT}>or</span>
          <div style={DIVIDER_LINE} />
        </div>

        {/* Email/password */}
        <form onSubmit={handleEmail} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={INPUT}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={INPUT}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />

          {error && (
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#ef4444', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button type="submit" style={BTN_PRIMARY} disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p style={{ margin: '20px 0 0', fontSize: '0.8125rem', color: '#64748b', textAlign: 'center' }}>
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
            onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError('') }}
          >
            {mode === 'signup' ? 'Sign in' : 'Sign up'}
          </button>
        </p>

        <p style={{ margin: '12px 0 0', fontSize: '0.75rem', color: '#475569', textAlign: 'center' }}>
          <button
            style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
            onClick={() => router.push('/builder')}
          >
            Continue without account
          </button>
        </p>
      </div>
    </div>
  )
}

function friendlyError(msg: string): string {
  if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) return 'Incorrect email or password.'
  if (msg.includes('email-already-in-use')) return 'An account with this email already exists.'
  if (msg.includes('weak-password')) return 'Password must be at least 6 characters.'
  if (msg.includes('invalid-email')) return 'Please enter a valid email address.'
  if (msg.includes('popup-closed')) return 'Sign-in popup was closed.'
  if (msg.includes('network-request-failed')) return 'Network error. Check your connection.'
  return 'Authentication failed. Please try again.'
}

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="1" width="14" height="14" rx="3" />
          <path d="M5 5h6M5 8h4M5 11h5" />
        </svg>
      </div>
      <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>BuilderPro</span>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const PAGE: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0f172a',
  fontFamily: 'Inter, system-ui, sans-serif',
  padding: '24px 16px',
}

const CARD: React.CSSProperties = {
  background: '#111827',
  borderRadius: 14,
  padding: '36px 40px',
  boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
  width: '100%',
  maxWidth: 380,
  border: '1px solid #1e293b',
}

const INPUT: React.CSSProperties = {
  width: '100%',
  height: 42,
  padding: '0 14px',
  borderRadius: 8,
  border: '1px solid #1e293b',
  backgroundColor: '#0f172a',
  color: '#f1f5f9',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
}

const BTN_PRIMARY: React.CSSProperties = {
  width: '100%',
  height: 42,
  borderRadius: 8,
  border: 'none',
  backgroundColor: '#4f46e5',
  color: '#fff',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const BTN_GOOGLE: React.CSSProperties = {
  width: '100%',
  height: 42,
  borderRadius: 8,
  border: '1px solid #1e293b',
  backgroundColor: '#1e293b',
  color: '#f1f5f9',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
}

const DIVIDER_WRAP: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  margin: '16px 0',
}

const DIVIDER_LINE: React.CSSProperties = {
  flex: 1,
  height: 1,
  backgroundColor: '#1e293b',
}

const DIVIDER_TEXT: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#475569',
  flexShrink: 0,
}
