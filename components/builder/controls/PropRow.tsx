'use client'

interface Props {
  label: string
  children: React.ReactNode
  /** If true, label and control stack vertically instead of side-by-side */
  stack?: boolean
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--color-text-secondary)',
  flexShrink: 0,
  lineHeight: 1,
}

export default function PropRow({ label, children, stack = false }: Props) {
  if (stack) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={LABEL_STYLE}>{label}</span>
        {children}
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        minHeight: 28,
      }}
    >
      <span style={{ ...LABEL_STYLE, width: 80 }}>{label}</span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  )
}
