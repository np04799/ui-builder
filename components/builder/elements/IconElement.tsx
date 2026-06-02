'use client'

import { memo } from 'react'

interface Props {
  name?: string
  size?: string
  color?: string
  style?: React.CSSProperties
}

/**
 * IconElement uses Bootstrap Icons (loaded by FrameworkLoader).
 * `name` is the bare icon slug (e.g. "star-fill", "house"), without the "bi-" prefix.
 */
const IconElement = memo(function IconElement({ name = 'star-fill', size = '24px', color = 'currentColor', style }: Props) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        color,
        ...style,
      }}
    >
      <i className={`bi bi-${name}`} style={{ fontSize: size, lineHeight: 1 }} />
    </span>
  )
})

export default IconElement
