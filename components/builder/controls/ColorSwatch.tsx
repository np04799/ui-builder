'use client'

interface Props {
  value: string
  onChange: (value: string) => void
  label?: string
}

export default function ColorSwatch({ value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <label
        style={{
          position: 'relative',
          width: 28,
          height: 28,
          borderRadius: 4,
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          cursor: 'pointer',
          flexShrink: 0,
          backgroundColor: value || 'transparent',
        }}
      >
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%',
            padding: 0,
            border: 'none',
          }}
        />
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        style={{
          flex: 1,
          height: 28,
          padding: '0 8px',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-primary)',
          fontSize: '0.75rem',
          outline: 'none',
          boxSizing: 'border-box',
          fontFamily: 'monospace',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)'
        }}
      />
    </div>
  )
}
