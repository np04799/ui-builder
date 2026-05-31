'use client'

interface AlignOption {
  value: string
  title: string
  icon: React.ReactNode
}

interface Props {
  value: string
  options: AlignOption[]
  onChange: (value: string) => void
}

export default function AlignButtonGroup({ value, options, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            title={opt.title}
            onClick={() => onChange(opt.value)}
            style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 4,
              backgroundColor: active ? 'var(--color-selected)' : 'var(--color-bg)',
              color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
            }}
          >
            {opt.icon}
          </button>
        )
      })}
    </div>
  )
}
