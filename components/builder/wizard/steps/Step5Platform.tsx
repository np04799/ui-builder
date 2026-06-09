'use client'

import { useEffect, useState } from 'react'
import type { OutputPlatform } from '@/types/store.types'
import type { WizardFormState } from '../wizard.types'
import { resolveFrameworkVersion, frameworkVersionLabel } from '@/lib/versionRegistry'

interface Props {
  form: WizardFormState
  onChange: (patch: Partial<WizardFormState>) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

const PLATFORMS: { platform: OutputPlatform; label: string; desc: string; icon: string }[] = [
  { platform: 'react',   label: 'React',   desc: 'Component-based JSX, hooks-ready',             icon: '⚛' },
  { platform: 'angular', label: 'Angular', desc: 'TypeScript-first, NgModule architecture',       icon: 'Ng' },
  { platform: 'vue',     label: 'Vue',     desc: 'Single-file components, Composition API',      icon: 'V' },
  { platform: 'html',    label: 'HTML',    desc: 'Plain HTML/CSS/JS, no framework',              icon: '</>' },
]

export default function Step5Platform({ form, onChange, onNext, onBack, onSkip }: Props) {
  const [versionLabel, setVersionLabel] = useState<string | null>(null)

  useEffect(() => {
    if (!form.mode || form.mode === 'custom') { setVersionLabel(null); return }
    resolveFrameworkVersion(form.mode).then((ver) => {
      setVersionLabel(frameworkVersionLabel(form.mode, ver))
    })
  }, [form.mode])

  const isCustom = form.mode === 'custom'

  return (
    <div style={{ padding: '8px 24px 24px' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
        Target Platform
      </h2>
      <p style={{ margin: '0 0 12px', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        Choose the output format for your exported code.
      </p>

      {/* Version badge */}
      {versionLabel && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
          borderRadius: 20, backgroundColor: '#f0fdf4', border: '1px solid #86efac',
          fontSize: '0.75rem', fontWeight: 600, color: '#15803d', marginBottom: 14,
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round">
            <path d="M1.5 5l2.5 2.5 4.5-4" />
          </svg>
          {versionLabel} (latest stable)
        </div>
      )}

      {/* Custom mode note */}
      {isCustom && (
        <div style={{
          display: 'flex', gap: 10, padding: '10px 14px', borderRadius: 8, marginBottom: 14,
          backgroundColor: '#fefce8', border: '1px solid #fde047',
        }}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚠️</span>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#713f12', lineHeight: 1.5 }}>
            <strong>Custom mode:</strong> Component generation (React, Vue, Angular) is not
            available. Only HTML/CSS export will be offered at export time.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {PLATFORMS.map(({ platform, label, desc, icon }) => {
          const selected = form.platform === platform
          const unavailable = isCustom && platform !== 'html'
          return (
            <button
              key={platform}
              onClick={() => onChange({ platform })}
              style={{
                padding: '16px 14px',
                borderRadius: 10,
                border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: selected
                  ? 'color-mix(in srgb, var(--color-primary) 6%, transparent)'
                  : 'var(--color-bg)',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'all 150ms',
                opacity: unavailable ? 0.5 : 1,
              }}
              onMouseEnter={(e) => { if (!selected && !unavailable) e.currentTarget.style.borderColor = 'var(--color-primary)' }}
              onMouseLeave={(e) => { if (!selected && !unavailable) e.currentTarget.style.borderColor = 'var(--color-border)' }}
            >
              {selected && (
                <div style={{
                  position: 'absolute', top: 8, right: 8, width: 18, height: 18,
                  borderRadius: '50%', backgroundColor: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1.5 5l3 3 4-4" />
                  </svg>
                </div>
              )}
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                backgroundColor: selected ? 'var(--color-primary)' : 'var(--color-border)',
                color: selected ? '#fff' : 'var(--color-text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.875rem', fontWeight: 700, marginBottom: 10, transition: 'all 150ms',
              }}>
                {icon}
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                {unavailable ? 'Unavailable in Custom mode' : desc}
              </div>
            </button>
          )
        })}
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
