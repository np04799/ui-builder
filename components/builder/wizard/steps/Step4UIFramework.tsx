'use client'

import type { BuilderMode } from '@/types/builder.types'
import type { WizardFormState } from '../wizard.types'

interface Props {
  form: WizardFormState
  onChange: (patch: Partial<WizardFormState>) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

const FRAMEWORKS: { mode: BuilderMode; label: string; desc: string; icon: string }[] = [
  { mode: 'bootstrap', label: 'Bootstrap', desc: 'Grid-based, responsive, CDN-ready', icon: 'B' },
  { mode: 'mui', label: 'MUI', desc: 'Material Design components, React-first', icon: 'M' },
  { mode: 'tailwind', label: 'Tailwind', desc: 'Utility-first CSS, fully customizable', icon: 'T' },
  { mode: 'custom', label: 'Custom', desc: 'No framework — pure CSS & style props', icon: '✦' },
]

const LAYOUT_OPTIONS: { value: 'flex-flow' | 'fixed-grid'; label: string; desc: string; icon: string }[] = [
  { value: 'flex-flow',   label: 'Flex / Flow',  desc: 'Elements stack & reflow naturally like a document', icon: '≡' },
  { value: 'fixed-grid',  label: 'Fixed Grid',   desc: 'Snap-to-grid, drag & resize anywhere on canvas',   icon: '⊞' },
]

export default function Step4UIFramework({ form, onChange, onNext, onBack, onSkip }: Props) {
  // Warn when Custom mode is selected but user already picked a non-HTML platform in Step 5
  const showCustomPlatformWarning =
    form.mode === 'custom' && !!form.platform && form.platform !== 'html'

  return (
    <div style={{ padding: '8px 24px 24px' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
        UI Framework
      </h2>
      <p style={{ margin: '0 0 16px', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        Choose the CSS framework for your project output.
      </p>


      {/* Custom + non-HTML platform warning */}
      {showCustomPlatformWarning && (
        <div style={{
          display: 'flex', gap: 10, padding: '10px 14px', borderRadius: 8, marginBottom: 16,
          backgroundColor: '#fefce8', border: '1px solid #fde047',
        }}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>warning</span>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#713f12', lineHeight: 1.5 }}>
            <strong>Custom mode + {form.platform} platform detected.</strong> Component generation
            (React, Vue, Angular) is not available for Custom mode. Only HTML/CSS export will be
            offered. To export components, choose Bootstrap, MUI, or Tailwind instead.
          </p>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {FRAMEWORKS.map(({ mode, label, desc, icon }) => {
          const selected = form.mode === mode
          return (
            <button
              key={mode}
              onClick={() => onChange({ mode })}
              style={{
                padding: '16px 14px',
                borderRadius: 10,
                border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: selected ? 'color-mix(in srgb, var(--color-primary) 6%, transparent)' : 'var(--color-bg)',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = 'var(--color-primary)' }}
              onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = 'var(--color-border)' }}
            >
              {selected && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1.5 5l3 3 4-4" />
                  </svg>
                </div>
              )}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: selected ? 'var(--color-primary)' : 'var(--color-border)',
                  color: selected ? '#fff' : 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 700,
                  marginBottom: 10,
                  transition: 'all 150ms',
                }}
              >
                {icon}
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                {desc}
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Canvas Layout ── */}
      <div style={{ marginTop: 24 }}>
        <p style={{ margin: '0 0 10px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
          Canvas Layout
        </p>
        <p style={{ margin: '0 0 12px', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          How elements are arranged on the canvas.
        </p>
  
      {/* Custom + non-HTML platform warning */}
      {showCustomPlatformWarning && (
        <div style={{
          display: 'flex', gap: 10, padding: '10px 14px', borderRadius: 8, marginBottom: 16,
          backgroundColor: '#fefce8', border: '1px solid #fde047',
        }}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>warning</span>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#713f12', lineHeight: 1.5 }}>
            <strong>Custom mode + {form.platform} platform detected.</strong> Component generation
            (React, Vue, Angular) is not available for Custom mode. Only HTML/CSS export will be
            offered. To export components, choose Bootstrap, MUI, or Tailwind instead.
          </p>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {LAYOUT_OPTIONS.map(({ value, label, desc, icon }) => {
            const selected = form.canvasLayout === value
            return (
              <button
                key={value}
                onClick={() => onChange({ canvasLayout: value })}
                style={{
                  padding: '14px 12px',
                  borderRadius: 10,
                  border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: selected ? 'color-mix(in srgb, var(--color-primary) 6%, transparent)' : 'var(--color-bg)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                  transition: 'all 150ms',
                }}
                onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = 'var(--color-primary)' }}
                onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = 'var(--color-border)' }}
              >
                {selected && (
                  <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 5l3 3 4-4" /></svg>
                  </div>
                )}
                <div style={{ fontSize: '1.25rem', marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{desc}</div>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
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
