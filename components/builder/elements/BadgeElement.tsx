'use client'

import { memo } from 'react'
import { useFramework } from '@/hooks/useFramework'

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'

interface Props {
  text?: string
  variant?: BadgeVariant
  pill?: boolean
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

const CUSTOM_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  primary: { bg: '#4f46e5', text: '#fff' },
  secondary: { bg: '#6b7280', text: '#fff' },
  success: { bg: '#22c55e', text: '#fff' },
  danger: { bg: '#ef4444', text: '#fff' },
  warning: { bg: '#f59e0b', text: '#fff' },
  info: { bg: '#06b6d4', text: '#fff' },
  light: { bg: '#f3f4f6', text: '#374151' },
  dark: { bg: '#111827', text: '#fff' },
}

const SIZE_STYLE: Record<string, React.CSSProperties> = {
  sm: { fontSize: '0.65rem', padding: '2px 7px' },
  md: { fontSize: '0.75rem', padding: '4px 10px' },
  lg: { fontSize: '0.875rem', padding: '5px 13px' },
}

const BadgeElement = memo(function BadgeElement({ text = 'Badge', variant = 'primary', pill = false, size = 'md', style }: Props) {
  const framework = useFramework()
  const radius = pill ? '999px' : '4px'

  if (framework === 'bootstrap') {
    const cls = `badge bg-${variant}${pill ? ' rounded-pill' : ''}`
    const fontSize = size === 'sm' ? '0.7rem' : size === 'lg' ? '0.9rem' : undefined
    return <span className={cls} style={{ fontSize, ...style }}>{text}</span>
  }

  if (framework === 'tailwind') {
    const tw: Record<BadgeVariant, string> = {
      primary: 'bg-indigo-600 text-white',
      secondary: 'bg-gray-500 text-white',
      success: 'bg-green-500 text-white',
      danger: 'bg-red-500 text-white',
      warning: 'bg-amber-400 text-white',
      info: 'bg-cyan-500 text-white',
      light: 'bg-gray-100 text-gray-700',
      dark: 'bg-gray-900 text-white',
    }
    const sz = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-sm px-3 py-1' : 'text-xs px-2.5 py-0.5'
    return <span className={`inline-flex items-center font-medium ${sz} ${pill ? 'rounded-full' : 'rounded'} ${tw[variant]}`} style={style}>{text}</span>
  }

  const c = CUSTOM_COLORS[variant]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 600, borderRadius: radius, backgroundColor: c.bg, color: c.text, ...SIZE_STYLE[size], lineHeight: 1, ...style }}>
      {text}
    </span>
  )
})

export default BadgeElement
