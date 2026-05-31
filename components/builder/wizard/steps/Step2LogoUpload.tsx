'use client'

import { useRef } from 'react'
import type { WizardFormState } from '../wizard.types'

interface Props {
  form: WizardFormState
  onChange: (patch: Partial<WizardFormState>) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

export default function Step2LogoUpload({ form, onChange, onNext, onBack, onSkip }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    if (typeof window === 'undefined') return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      // Compress to max 800x400 via canvas
      const img = new Image()
      img.onload = () => {
        const maxW = 800
        const maxH = 400
        let { width, height } = img
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d')?.drawImage(img, 0, 0, width, height)
        onChange({ logoDataUrl: canvas.toDataURL('image/png', 0.85) })
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ padding: '8px 24px 24px' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
        Upload your logo
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        Optional. Your logo will appear in the project summary and future exports.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {form.logoDataUrl ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            padding: 20,
            border: '1.5px solid var(--color-border)',
            borderRadius: 10,
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <img
            src={form.logoDataUrl}
            alt="Logo preview"
            style={{ maxWidth: 200, maxHeight: 80, objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => inputRef.current?.click()}
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Replace
            </button>
            <button
              onClick={() => onChange({ logoDataUrl: undefined })}
              style={{
                fontSize: '0.8125rem',
                color: '#ef4444',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            width: '100%',
            padding: '28px 16px',
            borderRadius: 10,
            border: '2px dashed var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="26" height="26" rx="4" />
            <circle cx="11" cy="11" r="2.5" />
            <path d="M3 22l7-7 5 5 4-4 10 10" />
          </svg>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
            Click to upload image
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
            PNG, JPG, SVG — auto-resized to max 800×400px
          </span>
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        <button onClick={onBack} style={backBtnStyle}>← Back</button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onSkip} style={skipBtnStyle}>Skip</button>
          <button onClick={onNext} style={nextBtnStyle}>Next →</button>
        </div>
      </div>
    </div>
  )
}

const backBtnStyle: React.CSSProperties = {
  height: 40, padding: '0 18px', borderRadius: 8,
  border: '1px solid var(--color-border)', backgroundColor: 'transparent',
  color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
}
const skipBtnStyle: React.CSSProperties = {
  height: 40, padding: '0 18px', borderRadius: 8,
  border: '1px solid var(--color-border)', backgroundColor: 'transparent',
  color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
}
const nextBtnStyle: React.CSSProperties = {
  height: 40, padding: '0 24px', borderRadius: 8,
  border: 'none', backgroundColor: 'var(--color-primary)',
  color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
}
