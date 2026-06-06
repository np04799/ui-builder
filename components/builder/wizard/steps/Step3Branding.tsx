'use client'

import type { WizardFormState } from '../wizard.types'

interface Props {
  form: WizardFormState
  onChange: (patch: Partial<WizardFormState>) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

const COLOR_SWATCHES = [
  '#4f46e5', '#7c3aed', '#db2777', '#dc2626',
  '#ea580c', '#ca8a04', '#16a34a', '#0891b2',
  '#0284c7', '#374151',
]

const FONTS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
]

export default function Step3Branding({ form, onChange, onNext, onBack, onSkip }: Props) {
  return (
    <div style={{ padding: '8px 24px 24px' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
        Branding
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        Choose a primary color and font that matches your brand.
      </p>

      {/* Color swatches */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 10 }}>
          Primary Color
        </label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {COLOR_SWATCHES.map((hex) => (
            <button
              key={hex}
              onClick={() => onChange({ primaryColor: hex })}
              title={hex}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: hex,
                border: form.primaryColor === hex ? '3px solid var(--color-text)' : '3px solid transparent',
                cursor: 'pointer',
                boxShadow: form.primaryColor === hex ? `0 0 0 2px #fff, 0 0 0 4px ${hex}` : 'none',
                transition: 'box-shadow 150ms',
                position: 'relative',
              }}
            >
              {form.primaryColor === hex && (
                <svg style={{ position: 'absolute', inset: 0, margin: 'auto' }} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 7l4 4 6-6" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Font selection */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 10 }}>
          Font Family
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {FONTS.map((font) => (
            <label
              key={font.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '6px 10px',
                borderRadius: 6,
                border: `1.5px solid ${form.fontFamily === font.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: form.fontFamily === font.value ? 'color-mix(in srgb, var(--color-primary) 6%, transparent)' : 'var(--color-bg)',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
            >
              <input
                type="radio"
                name="fontFamily"
                value={font.value}
                checked={form.fontFamily === font.value}
                onChange={() => onChange({ fontFamily: font.value })}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <span style={{ fontFamily: font.value, fontSize: '0.9375rem', color: 'var(--color-text)' }}>
                {font.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Live preview - compact */}
      <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', flexShrink: 0 }}>PREVIEW</span>
        <div style={{ fontFamily: form.fontFamily, display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: form.primaryColor, lineHeight: 1 }}>Aa</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>The quick brown fox</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
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
