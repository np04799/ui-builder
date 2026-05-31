'use client'

import { useState } from 'react'
import type { WizardFormState } from '../wizard.types'

interface Props {
  form: WizardFormState
  onChange: (patch: Partial<WizardFormState>) => void
  onNext: () => void
}

export default function Step1ProjectName({ form, onChange, onNext }: Props) {
  const [touched, setTouched] = useState(false)
  const hasError = touched && form.projectName.trim() === ''

  function handleNext() {
    if (form.projectName.trim() === '') {
      setTouched(true)
      return
    }
    onNext()
  }

  return (
    <div style={{ padding: '8px 24px 24px' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
        Name your project
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        Give your project a name so you can identify it later.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>
          Project name <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          autoFocus
          type="text"
          value={form.projectName}
          placeholder="e.g. My Portfolio, Acme Corp Website"
          onChange={(e) => {
            setTouched(true)
            onChange({ projectName: e.target.value })
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          style={{
            height: 42,
            padding: '0 14px',
            borderRadius: 8,
            border: `1.5px solid ${hasError ? '#ef4444' : 'var(--color-border)'}`,
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontSize: '0.9375rem',
            outline: 'none',
            transition: 'border-color 150ms',
          }}
          onFocus={(e) => { if (!hasError) e.currentTarget.style.borderColor = 'var(--color-primary)' }}
          onBlur={(e) => { if (!hasError) e.currentTarget.style.borderColor = 'var(--color-border)' }}
        />
        {hasError && (
          <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>Project name is required.</span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
        <button
          onClick={handleNext}
          disabled={form.projectName.trim() === ''}
          style={{
            height: 40,
            padding: '0 24px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: form.projectName.trim() ? 'var(--color-primary)' : 'var(--color-border)',
            color: form.projectName.trim() ? '#fff' : 'var(--color-text-secondary)',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: form.projectName.trim() ? 'pointer' : 'not-allowed',
            transition: 'background-color 150ms',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
