'use client'

interface Option {
  label: string
  value: string
}

interface Props {
  value: string
  options: Option[]
  onChange: (value: string) => void
  disabled?: boolean
}

export default function SelectInput({ value, options, onChange, disabled }: Props) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        height: 28,
        padding: '0 24px 0 8px',
        border: '1px solid var(--color-border)',
        borderRadius: 4,
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text-primary)',
        fontSize: '0.75rem',
        outline: 'none',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
        cursor: 'pointer',
        boxSizing: 'border-box',
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
