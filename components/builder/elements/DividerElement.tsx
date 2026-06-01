'use client'

import { useFramework } from '@/hooks/useFramework'

interface Props { style?: React.CSSProperties; color?: string; thickness?: string }

export default function DividerElement({ style, color = 'var(--color-border)', thickness = '1px' }: Props) {
  const framework = useFramework()

  if (framework === 'bootstrap') return <hr className="my-3" style={{ borderColor: color, borderTopWidth: thickness, opacity: 1, ...style }} />
  if (framework === 'tailwind') return <hr className="my-3 border-gray-200" style={{ borderTopWidth: thickness, borderColor: color, ...style }} />
  return <hr style={{ border: 'none', borderTop: `${thickness} solid ${color}`, margin: '8px 0', width: '100%', ...style }} />
}
