'use client'

import { memo } from 'react'

interface Props {
  name?: string
  size?: string
  color?: string
  style?: React.CSSProperties
}

// Backward-compat: map old free-text icon names to Bootstrap Icons slugs.
const LEGACY_ICON_MAP: Record<string, string> = {
  arrow: 'arrow-right',
  mail: 'envelope-fill',
  // star, heart, check, phone — already exist as Bootstrap Icons slugs
}

/**
 * IconElement uses Bootstrap Icons (loaded by FrameworkLoader).
 * `name` is the bare icon slug (e.g. "star-fill", "house"), without the "bi-" prefix.
 */
const IconElement = memo(function IconElement({ name = 'star-fill', size = '24px', color = 'currentColor', style }: Props) {
  const resolvedName = LEGACY_ICON_MAP[name] ?? name
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
      <i className={`bi bi-${resolvedName}`} style={{ fontSize: size, lineHeight: 1 }} />
    </span>
  )
})

export default IconElement
