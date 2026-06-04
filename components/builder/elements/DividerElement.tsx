'use client'

import React from 'react'
import { useFramework } from '@/hooks/useFramework'

interface Props { style?: React.CSSProperties; color?: string; thickness?: string }

export default function DividerElement({ style, color = 'var(--color-border)', thickness = '1px' }: Props) {
  const framework = useFramework()

  // Style prop takes precedence — props panel writes borderTopColor/Width/Style into styles
  const mergedColor = (style as React.CSSProperties & Record<string,string>)?.borderTopColor ?? color
  const mergedThickness = (style as React.CSSProperties & Record<string,string>)?.borderTopWidth ?? thickness
  const mergedStyle = (style as React.CSSProperties & Record<string,string>)?.borderTopStyle ?? 'solid'

  const base: React.CSSProperties = {
    border: 'none',
    borderTop: `${mergedThickness} ${mergedStyle} ${mergedColor}`,
    margin: '8px 0',
    width: '100%',
    display: 'block',
  }

  if (framework === 'bootstrap') return <hr className="my-3" style={{ ...base, opacity: 1, ...style }} />
  if (framework === 'tailwind') return <hr className="my-3" style={{ ...base, ...style }} />
  if (framework === 'mui') return <hr className="MuiDivider-root" style={{ ...base, ...style }} />
  return <hr style={{ ...base, ...style }} />
}
