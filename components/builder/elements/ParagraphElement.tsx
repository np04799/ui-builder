import { memo } from 'react'
import { useFramework } from '@/hooks/useFramework'

interface Props { text: string; style?: React.CSSProperties }

const ParagraphElement = memo(function ParagraphElement({ text, style }: Props) {
  const framework = useFramework()
  const content = text || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

  if (framework === 'bootstrap') {
    return <p className="lead mb-0" style={style}>{content}</p>
  }
  if (framework === 'tailwind') {
    return <p className="text-base text-gray-600 leading-relaxed m-0" style={style}>{content}</p>
  }
  if (framework === 'mui') {
    return <p className="MuiTypography-root MuiTypography-body1" style={{ margin: 0, ...style }}>{content}</p>
  }
  return <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', ...style }}>{content}</p>
})

export default ParagraphElement
