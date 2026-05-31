'use client'

interface Props {
  height?: string
  style?: React.CSSProperties
}

export default function SpacerElement({ height = '40px', style }: Props) {
  return (
    <div
      style={{
        height,
        width: '100%',
        display: 'block',
        ...style,
      }}
    />
  )
}
