'use client'

interface Props {
  value: string
  onChange: (value: string) => void
  unit?: string
  min?: number
  max?: number
  step?: number
  placeholder?: string
}

export default function NumberInput({ value, onChange, unit = 'px', min = 0, max = 9999, step = 1, placeholder = '0' }: Props) {
  // Parse the numeric portion from a value like "16px" or "1.5rem"
  const rawNum = parseFloat(value)
  const displayValue = isNaN(rawNum) ? '' : rawNum

  function handleChange(raw: string) {
    if (raw === '' || raw === null) {
      onChange('')
      return
    }
    const n = parseFloat(raw)
    if (!isNaN(n)) onChange(`${n}${unit}`)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: '100%' }}>
      <input
        type="number"
        value={displayValue}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        style={{
          flex: 1,
          height: 28,
          padding: '0 6px',
          border: '1px solid var(--color-border)',
          borderRight: unit ? 'none' : '1px solid var(--color-border)',
          borderRadius: unit ? '4px 0 0 4px' : 4,
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-primary)',
          fontSize: '0.75rem',
          outline: 'none',
          boxSizing: 'border-box',
          minWidth: 0,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)' }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)'
          if (e.currentTarget.value === '') onChange('')
        }}
      />
      {unit && (
        <span
          style={{
            height: 28,
            padding: '0 7px',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid var(--color-border)',
            borderLeft: 'none',
            borderRadius: '0 4px 4px 0',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-secondary)',
            fontSize: '0.7rem',
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          {unit}
        </span>
      )}
    </div>
  )
}
