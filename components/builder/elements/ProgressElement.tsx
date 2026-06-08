'use client'

import { memo } from 'react'
import { useFramework } from '@/hooks/useFramework'

type ProgressVariant = 'primary' | 'success' | 'danger' | 'warning' | 'info'

interface Props {
  label?: string
  value?: number
  max?: number
  showLabel?: boolean
  variant?: ProgressVariant
  striped?: boolean
  animated?: boolean
  height?: number
  style?: React.CSSProperties
}

const COLORS: Record<ProgressVariant, string> = {
  primary: '#4f46e5',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
}

const ProgressElement = memo(function ProgressElement({
  label,
  value = 65,
  max = 100,
  showLabel = true,
  variant = 'primary',
  striped = false,
  animated = false,
  height = 10,
  style,
}: Props) {
  const framework = useFramework()
  const pct = Math.min(100, Math.max(0, ((value ?? 0) / (max || 100)) * 100))

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    const barClass = [
      'progress-bar',
      `bg-${variant}`,
      striped ? 'progress-bar-striped' : '',
      animated ? 'progress-bar-animated' : '',
    ].filter(Boolean).join(' ')

    return (
      <div style={style}>
        {(label || showLabel) && (
          <div className="d-flex justify-content-between align-items-center mb-1">
            {label && <span className="small text-body-secondary fw-medium">{label}</span>}
            {showLabel && <span className="small fw-semibold">{value}/{max}</span>}
          </div>
        )}
        <div className="progress" style={{ height }}>
          <div
            className={barClass}
            role="progressbar"
            style={{ width: `${pct}%` }}
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>
      </div>
    )
  }

  // ── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    const tw: Record<ProgressVariant, string> = {
      primary: 'bg-indigo-600',
      success: 'bg-green-500',
      danger: 'bg-red-500',
      warning: 'bg-amber-400',
      info: 'bg-cyan-500',
    }
    return (
      <div style={style}>
        {(label || showLabel) && (
          <div className="flex justify-between items-center mb-1">
            {label && <span className="text-sm text-gray-500 font-medium">{label}</span>}
            {showLabel && <span className="text-sm font-semibold text-gray-700">{value}/{max}</span>}
          </div>
        )}
        <div className="w-full bg-gray-200 rounded-full overflow-hidden" style={{ height }}>
          <div
            className={`h-full rounded-full transition-all ${tw[variant]}${striped ? ' bg-stripes' : ''}`}
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>
      </div>
    )
  }

  // ── Custom / MUI ───────────────────────────────────────────────────────────
  const color = COLORS[variant]
  return (
    <div style={style}>
      {(label || showLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          {label && <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{label}</span>}
          {showLabel && <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}/{max}</span>}
        </div>
      )}
      <div style={{ width: '100%', height, backgroundColor: framework === 'mui' ? 'rgba(0,0,0,0.1)' : 'var(--color-border)', borderRadius: height, overflow: 'hidden' }}
           className={framework === 'mui' ? 'MuiLinearProgress-root' : undefined}>
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={framework === 'mui' ? 'MuiLinearProgress-bar' : undefined}
          style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: color,
            borderRadius: height,
            transition: 'width 400ms ease',
            backgroundImage: striped
              ? `repeating-linear-gradient(45deg,rgba(255,255,255,.15) 0,rgba(255,255,255,.15) 4px,transparent 4px,transparent 8px)`
              : undefined,
          }}
        />
      </div>
    </div>
  )
})

export default ProgressElement
