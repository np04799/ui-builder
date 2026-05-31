'use client'

import type { WizardFormState } from '../wizard.types'

interface Props {
  form: WizardFormState
  onConfirm: () => void
  onBack: () => void
}

const MODE_LABELS: Record<string, string> = {
  bootstrap: 'Bootstrap',
  mui: 'MUI',
  tailwind: 'Tailwind',
  custom: 'Custom',
}

const PLATFORM_LABELS: Record<string, string> = {
  react: 'React',
  angular: 'Angular',
  vue: 'Vue',
  html: 'HTML',
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
      <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '0.875rem', color: 'var(--color-text)', fontWeight: 600 }}>{children}</span>
    </div>
  )
}

export default function Step6Summary({ form, onConfirm, onBack }: Props) {
  return (
    <div style={{ padding: '8px 24px 24px' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
        Ready to build!
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        Review your project setup before starting.
      </p>

      <div
        style={{
          borderRadius: 10,
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          padding: '0 16px',
          marginBottom: 24,
        }}
      >
        <Row label="Project Name">{form.projectName}</Row>

        <Row label="Logo">
          {form.logoDataUrl ? (
            <img src={form.logoDataUrl} alt="Logo" style={{ maxHeight: 32, maxWidth: 80, objectFit: 'contain' }} />
          ) : (
            <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>No logo</span>
          )}
        </Row>

        <Row label="Primary Color">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: form.primaryColor, border: '1px solid var(--color-border)' }} />
            <span>{form.primaryColor}</span>
          </div>
        </Row>

        <Row label="Font">
          <span style={{ fontFamily: form.fontFamily }}>{form.fontFamily.split(',')[0].replace(/"/g, '')}</span>
        </Row>

        <Row label="UI Framework">
          <span
            style={{
              padding: '2px 10px',
              borderRadius: 20,
              backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
              color: 'var(--color-primary)',
              fontSize: '0.8125rem',
            }}
          >
            {MODE_LABELS[form.mode]}
          </span>
        </Row>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Target Platform</span>
          <span
            style={{
              padding: '2px 10px',
              borderRadius: 20,
              backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
              color: 'var(--color-primary)',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            {PLATFORM_LABELS[form.platform]}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={backBtnStyle}>← Back</button>
        <button
          onClick={onConfirm}
          style={{
            height: 42,
            padding: '0 28px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            fontSize: '0.9375rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 7h12M7 1l6 6-6 6" />
          </svg>
          Start Building
        </button>
      </div>
    </div>
  )
}

const backBtnStyle: React.CSSProperties = {
  height: 40, padding: '0 18px', borderRadius: 8,
  border: '1px solid var(--color-border)', backgroundColor: 'transparent',
  color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
}
