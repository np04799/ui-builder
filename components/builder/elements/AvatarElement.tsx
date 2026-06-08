'use client'

import { memo } from 'react'
import { useFramework } from '@/hooks/useFramework'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type AvatarShape = 'circle' | 'rounded' | 'square'
type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

interface GroupItem { id: string; src?: string; name: string; initials?: string }

interface Props {
  src?: string
  name?: string
  initials?: string
  size?: AvatarSize
  shape?: AvatarShape
  status?: AvatarStatus
  group?: boolean
  groupItems?: GroupItem[]
  groupMax?: number
  bg?: string
  textColor?: string
  style?: React.CSSProperties
}

const SIZES: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 56, xl: 72 }
const FONT: Record<AvatarSize, string> = { xs: '0.6rem', sm: '0.75rem', md: '0.875rem', lg: '1.125rem', xl: '1.5rem' }
const STATUS_COLORS: Record<AvatarStatus, string> = { online: '#22c55e', offline: '#9ca3af', busy: '#ef4444', away: '#f59e0b' }
const STATUS_DOT_SIZE: Record<AvatarSize, number> = { xs: 6, sm: 8, md: 10, lg: 12, xl: 14 }

function getInitials(name: string, custom?: string) {
  if (custom) return custom.slice(0, 2).toUpperCase()
  return name.split(' ').map((p) => p[0] ?? '').join('').slice(0, 2).toUpperCase() || '?'
}

function SingleAvatar({ src, name = 'User', initials, size = 'md', shape = 'circle', status, bg = 'linear-gradient(135deg,#4f46e5,#06b6d4)', textColor = '#fff', statusSize }: {
  src?: string; name?: string; initials?: string; size: AvatarSize; shape: AvatarShape; status?: AvatarStatus; bg?: string; textColor?: string; statusSize?: number
}) {
  const px = SIZES[size]
  const radius = shape === 'circle' ? '50%' : shape === 'rounded' ? px * 0.25 : 4
  const dotPx = statusSize ?? STATUS_DOT_SIZE[size]

  return (
    <div style={{ position: 'relative', width: px, height: px, flexShrink: 0 }}>
      <div style={{ width: px, height: px, borderRadius: radius, background: bg, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-bg)' }}>
        {src
          ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ color: textColor, fontSize: FONT[size], fontWeight: 700, userSelect: 'none' }}>{getInitials(name, initials)}</span>
        }
      </div>
      {status && (
        <span style={{ position: 'absolute', bottom: 0, right: 0, width: dotPx, height: dotPx, borderRadius: '50%', backgroundColor: STATUS_COLORS[status], border: '2px solid var(--color-bg)' }} title={status} />
      )}
    </div>
  )
}

const AvatarElement = memo(function AvatarElement({
  src, name = 'John Doe', initials, size = 'md', shape = 'circle', status,
  group = false, groupItems = [], groupMax = 4, bg, textColor, style,
}: Props) {
  const framework = useFramework()
  const px = SIZES[size]
  const radius = shape === 'circle' ? '50%' : shape === 'rounded' ? px * 0.25 : 4

  // ── Group mode ─────────────────────────────────────────────────────────────
  if (group && groupItems.length > 0) {
    const visible = groupItems.slice(0, groupMax)
    const overflow = groupItems.length - groupMax
    const offset = Math.round(px * 0.3)

    if (framework === 'bootstrap') {
      return (
        <div className="d-flex align-items-center" style={{ gap: -offset, ...style }}>
          {visible.map((item, idx) => (
            <div key={item.id} className="rounded-circle border border-2 border-white d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
              style={{ width: px, height: px, marginLeft: idx > 0 ? -offset : 0, background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', zIndex: visible.length - idx, position: 'relative' }}
              title={item.name}>
              {item.src
                ? <img src={item.src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#fff', fontSize: FONT[size], fontWeight: 700 }}>{getInitials(item.name, item.initials)}</span>
              }
            </div>
          ))}
          {overflow > 0 && (
            <div className="rounded-circle border border-2 border-white d-flex align-items-center justify-content-center bg-secondary text-white flex-shrink-0"
              style={{ width: px, height: px, marginLeft: -offset, fontSize: FONT[size], fontWeight: 700, zIndex: 0, position: 'relative' }}>
              +{overflow}
            </div>
          )}
        </div>
      )
    }

    // Custom group fallback
    return (
      <div style={{ display: 'flex', alignItems: 'center', ...style }}>
        {visible.map((item, idx) => (
          <div key={item.id} style={{ width: px, height: px, borderRadius: radius, background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', border: '2px solid var(--color-bg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: idx > 0 ? -offset : 0, zIndex: visible.length - idx, position: 'relative', flexShrink: 0 }} title={item.name}>
            {item.src
              ? <img src={item.src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: '#fff', fontSize: FONT[size], fontWeight: 700 }}>{getInitials(item.name, item.initials)}</span>
            }
          </div>
        ))}
        {overflow > 0 && (
          <div style={{ width: px, height: px, borderRadius: radius, backgroundColor: 'var(--color-border)', border: '2px solid var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -offset, fontSize: FONT[size], fontWeight: 700, color: 'var(--color-text-secondary)', position: 'relative', flexShrink: 0 }}>
            +{overflow}
          </div>
        )}
      </div>
    )
  }

  // ── Single avatar ──────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    const bsRadius = shape === 'circle' ? 'rounded-circle' : shape === 'rounded' ? 'rounded' : 'rounded-0'
    return (
      <div className="position-relative d-inline-flex" style={style}>
        <div className={`${bsRadius} overflow-hidden d-flex align-items-center justify-content-center border border-2 border-light`}
          style={{ width: px, height: px, background: bg ?? 'linear-gradient(135deg,#4f46e5,#06b6d4)' }}>
          {src
            ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ color: textColor ?? '#fff', fontSize: FONT[size], fontWeight: 700 }}>{getInitials(name, initials)}</span>
          }
        </div>
        {status && (
          <span className="position-absolute bottom-0 end-0 rounded-circle border border-2 border-white"
            style={{ width: STATUS_DOT_SIZE[size], height: STATUS_DOT_SIZE[size], backgroundColor: STATUS_COLORS[status] }} title={status} />
        )}
      </div>
    )
  }

  // Custom / Tailwind / MUI
  return (
    <div style={{ display: 'inline-flex', ...style }}>
      <SingleAvatar src={src} name={name} initials={initials} size={size} shape={shape} status={status} bg={bg ?? 'linear-gradient(135deg,#4f46e5,#06b6d4)'} textColor={textColor} />
    </div>
  )
})

export default AvatarElement
