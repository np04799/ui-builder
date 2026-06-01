'use client'

import { useFramework } from '@/hooks/useFramework'

interface Props {
  style?: React.CSSProperties
  color?: string
  thickness?: string
}

export default function DividerElement({ style, color = 'var(--color-border)', thickness = '1px' }: Props) {
  const framework = useFramework()

  if (framework === 'bootstrap') {
    return <hr className="border-secondary my-2" style={{ borderTopWidth: thickness, borderTopColor: color, ...style }} />
  }

  if (framework === 'mui') {
    return <hr className="MuiDivider-root" style={{ border: 'none', borderTop: `${thickness} solid ${color}`, margin: '8px 0', ...style }} />
  }

  if (framework === 'tailwind') {
    return <hr className="border-t border-gray-200 my-2 w-full" style={{ borderTopWidth: thickness, borderTopColor: color, ...style }} />
  }

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
