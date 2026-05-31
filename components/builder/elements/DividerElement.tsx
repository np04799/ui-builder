'use client'

interface Props {
  style?: React.CSSProperties
  color?: string
  thickness?: string
}

export default function DividerElement({ style, color = 'var(--color-border)', thickness = '1px' }: Props) {
  return (
    <hr
      style={{
        border: 'none',
        borderTop: `${thickness} solid ${color}`,
        margin: '8px 0',
        width: '100%',
        ...style,
      }}
    />
  )
}
