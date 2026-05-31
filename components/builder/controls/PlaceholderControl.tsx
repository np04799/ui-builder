'use client'

interface Props {
  label: string
}

export default function PlaceholderControl({ label }: Props) {
  return (
    <div
      style={{
        height: 28,
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        border: '1px dashed var(--color-border)',
        borderRadius: 4,
        fontSize: '0.6875rem',
        color: 'var(--color-muted)',
        fontStyle: 'italic',
      }}
    >
      {label}
    </div>
  )
}
