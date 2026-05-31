import { memo } from 'react'
import type { HeadingLevel } from '@/types/builder.types'
import { useFramework } from '@/hooks/useFramework'

interface Props {
  level: HeadingLevel
  text: string
  style?: React.CSSProperties
}

const SIZE: Record<HeadingLevel, string> = {
  h1: '2rem',
  h2: '1.5rem',
  h3: '1.25rem',
  h4: '1.125rem',
  h5: '1rem',
  h6: '0.875rem',
}

const WEIGHT: Record<HeadingLevel, number> = {
  h1: 700, h2: 700, h3: 600, h4: 600, h5: 600, h6: 600,
}

// Bootstrap display classes for h1/h2, regular headings for rest
const BS_CLASS: Record<HeadingLevel, string> = {
  h1: 'display-5 fw-bold',
  h2: 'display-6 fw-bold',
  h3: 'h3 fw-semibold',
  h4: 'h4 fw-semibold',
  h5: 'h5 fw-semibold',
  h6: 'h6 fw-semibold',
}

const MUI_CLASS: Record<HeadingLevel, string> = {
  h1: 'MuiTypography-root MuiTypography-h1',
  h2: 'MuiTypography-root MuiTypography-h2',
  h3: 'MuiTypography-root MuiTypography-h3',
  h4: 'MuiTypography-root MuiTypography-h4',
  h5: 'MuiTypography-root MuiTypography-h5',
  h6: 'MuiTypography-root MuiTypography-h6',
}

const TW_SIZE: Record<HeadingLevel, string> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-semibold',
  h6: 'text-base font-semibold',
}

const HeadingElement = memo(function HeadingElement({ level, text, style }: Props) {
  const framework = useFramework()
  const Tag = level

  if (framework === 'bootstrap') {
    return <Tag className={BS_CLASS[level]} style={style}>{text || 'Your Heading Here'}</Tag>
  }

  if (framework === 'mui') {
    return <Tag className={`mui-root ${MUI_CLASS[level]}`} style={style}>{text || 'Your Heading Here'}</Tag>
  }

  if (framework === 'tailwind') {
    return <Tag className={`${TW_SIZE[level]} text-gray-900 leading-tight`} style={style}>{text || 'Your Heading Here'}</Tag>
  }

  return (
    <Tag
      style={{
        margin: 0,
        lineHeight: 1.3,
        fontSize: SIZE[level],
        fontWeight: WEIGHT[level],
        color: 'var(--color-text-primary)',
        ...style,
      }}
    >
      {text || 'Your Heading Here'}
    </Tag>
  )
})

export default HeadingElement
