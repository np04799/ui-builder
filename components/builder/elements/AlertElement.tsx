'use client'

import { memo, useState } from 'react'
import { useFramework } from '@/hooks/useFramework'

type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

interface Props {
  variant?: AlertVariant
  title?: string
  message?: string
  dismissible?: boolean
  showIcon?: boolean
  style?: React.CSSProperties
}

const ICONS: Record<AlertVariant, string> = {
  info: 'M12 2a10 10 0 100 20A10 10 0 0012 2zm0 9v5m0-8v.5',
  success: 'M9 12l2 2 4-4m6 2a10 10 0 11-20 0 10 10 0 0120 0z',
  warning: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  danger: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
}

const BS_VARIANT: Record<AlertVariant, string> = { info: 'info', success: 'success', warning: 'warning', danger: 'danger' }

const CUSTOM_COLORS: Record<AlertVariant, { bg: string; border: string; text: string; icon: string }> = {
  info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: '#3b82f6' },
  success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', icon: '#22c55e' },
  warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', icon: '#f59e0b' },
  danger: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: '#ef4444' },
}

function AlertIcon({ variant, size = 20 }: { variant: AlertVariant; size?: number }) {
  const colors = CUSTOM_COLORS[variant]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colors.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d={ICONS[variant]} />
    </svg>
  )
}

const AlertElement = memo(function AlertElement({ variant = 'info', title, message = 'This is an alert message.', dismissible = true, showIcon = true, style }: Props) {
  const framework = useFramework()
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    return (
      <div className={`alert alert-${BS_VARIANT[variant]}${dismissible ? ' alert-dismissible fade show' : ''} d-flex align-items-start gap-2`} role="alert" style={style}>
        {showIcon && <AlertIcon variant={variant} size={18} />}
        <div className="flex-grow-1">
          {title && <strong className="d-block mb-1">{title}</strong>}
          <span>{message}</span>
        </div>
        {dismissible && <button type="button" className="btn-close ms-auto" aria-label="Close" onClick={() => setDismissed(true)} />}
      </div>
    )
  }

  // ── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    const tw: Record<AlertVariant, string> = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      danger: 'bg-red-50 border-red-200 text-red-800',
    }
    return (
      <div className={`flex items-start gap-3 p-4 rounded-lg border ${tw[variant]}`} role="alert" style={style}>
        {showIcon && <AlertIcon variant={variant} size={18} />}
        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold mb-1 text-sm">{title}</p>}
          <p className="text-sm m-0">{message}</p>
        </div>
        {dismissible && <button onClick={() => setDismissed(true)} className="ml-auto text-current opacity-50 hover:opacity-100 flex-shrink-0 leading-none bg-transparent border-0 cursor-pointer text-lg">✕</button>}
      </div>
    )
  }

  // ── Custom / MUI ───────────────────────────────────────────────────────────
  const c = CUSTOM_COLORS[variant]
  return (
    <div role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', backgroundColor: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, color: c.text, ...style }}>
      {showIcon && <AlertIcon variant={variant} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <p style={{ fontWeight: 700, margin: '0 0 4px', fontSize: '0.9rem' }}>{title}</p>}
        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>{message}</p>
      </div>
      {dismissible && <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.text, opacity: 0.6, fontSize: '1rem', lineHeight: 1, padding: 2, flexShrink: 0 }} aria-label="Dismiss">✕</button>}
    </div>
  )
})

export default AlertElement
