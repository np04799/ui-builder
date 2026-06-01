import { memo } from 'react'
import { useFramework } from '@/hooks/useFramework'

interface Props {
  text: string
  style?: React.CSSProperties
}

const ParagraphElement = memo(function ParagraphElement({ text, style }: Props) {
  const framework = useFramework()
  const placeholder = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

  if (framework === 'bootstrap') {
    return <p className="lead mb-0" style={style}>{text || placeholder}</p>
  }

  if (framework === 'mui') {
    return <p className="MuiTypography-root MuiTypography-body1" style={style}>{text || placeholder}</p>
  }

  if (framework === 'tailwind') {
    return <p className="text-base text-gray-600 leading-relaxed" style={style}>{text || placeholder}</p>
  }

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
      {text || placeholder}
    </p>
  )
})

export default ParagraphElement
