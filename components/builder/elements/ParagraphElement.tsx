import { memo } from 'react'

interface Props {
  text: string
  style?: React.CSSProperties
}

const ParagraphElement = memo(function ParagraphElement({ text, style }: Props) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: '1rem',
        lineHeight: 1.7,
        color: 'var(--color-text-secondary)',
        ...style,
      }}
    >
      {text || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
    </p>
  )
})

export default ParagraphElement
