'use client'

interface Props {
  visible: boolean
}

export default function DropIndicator({ visible }: Props) {
  if (!visible) return null

  return (
    <div
      aria-hidden
      style={{
        height: 2,
        borderRadius: 1,
        backgroundColor: 'var(--color-primary)',
        margin: '0 4px',
        pointerEvents: 'none',
        boxShadow: '0 0 0 2px color-mix(in srgb, var(--color-primary) 25%, transparent)',
      }}
    />
  )
}
