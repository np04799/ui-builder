'use client'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function TextInput({ value, onChange, placeholder, disabled }: Props) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        height: 28,
        padding: '0 8px',
        border: '1px solid var(--color-border)',
        borderRadius: 4,
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text-primary)',
        fontSize: '0.75rem',
        outline: 'none',
        boxSizing: 'border-box',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-primary)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)'
      }}
    />
  )
}
