'use client'

import { memo } from 'react'
import { useFramework } from '@/hooks/useFramework'

type StatPreset = 'minimal' | 'bordered' | 'filled' | 'gradient'
type Trend = 'up' | 'down' | 'neutral'

interface Props {
  preset?: StatPreset
  label?: string
  value?: string
  subtext?: string
  trend?: Trend
  trendValue?: string
  icon?: string
  iconBg?: string
  iconColor?: string
  accentColor?: string
  style?: React.CSSProperties
}

function TrendBadge({ trend, trendValue }: { trend: Trend; trendValue?: string }) {
  const cfg = {
    up:      { color: '#16a34a', bg: '#f0fdf4', arrow: '↑' },
    down:    { color: '#dc2626', bg: '#fef2f2', arrow: '↓' },
    neutral: { color: '#6b7280', bg: '#f3f4f6', arrow: '→' },
  }[trend]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', fontWeight: 700, color: cfg.color, backgroundColor: cfg.bg, padding: '2px 7px', borderRadius: 999 }}>
      {cfg.arrow} {trendValue}
    </span>
  )
}

function StatIcon({ icon, iconBg, iconColor }: { icon: string; iconBg: string; iconColor: string }) {
  return (
    <div style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: '1.25rem', color: iconColor }}>{icon}</span>
    </div>
  )
}

const StatCardElement = memo(function StatCardElement({
  preset = 'minimal',
  label = 'Total Users',
  value = '24,521',
  subtext = 'vs last month',
  trend = 'up',
  trendValue = '12.5%',
  icon = '👥',
  iconBg = '#ede9fe',
  iconColor = '#7c3aed',
  accentColor = '#4f46e5',
  style,
}: Props) {
  const framework = useFramework()

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    const cardStyle: React.CSSProperties = preset === 'filled'
      ? { backgroundColor: accentColor, color: '#fff', border: 'none' }
      : preset === 'gradient'
      ? { background: `linear-gradient(135deg, ${accentColor}, #06b6d4)`, color: '#fff', border: 'none' }
      : {}

    return (
      <div className="card h-100" style={{ ...cardStyle, ...style }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <p className={`card-subtitle mb-1 small ${preset === 'filled' || preset === 'gradient' ? 'text-white opacity-75' : 'text-muted'}`}>{label}</p>
              <h3 className="card-title mb-0 fw-bold fs-3">{value}</h3>
            </div>
            {icon && (
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, backgroundColor: preset === 'filled' || preset === 'gradient' ? 'rgba(255,255,255,0.2)' : iconBg }}>
                <span style={{ fontSize: '1.25rem' }}>{icon}</span>
              </div>
            )}
          </div>
          {(trend || subtext) && (
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {trend && trendValue && (
                <span className={`badge rounded-pill ${trend === 'up' ? 'text-bg-success' : trend === 'down' ? 'text-bg-danger' : 'text-bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
                </span>
              )}
              {subtext && <span className={`small ${preset === 'filled' || preset === 'gradient' ? 'text-white opacity-75' : 'text-muted'}`}>{subtext}</span>}
            </div>
          )}
        </div>
        {preset === 'bordered' && <div style={{ height: 3, backgroundColor: accentColor, borderRadius: '0 0 4px 4px' }} />}
      </div>
    )
  }

  // ── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    const isFilled = preset === 'filled' || preset === 'gradient'
    const bg = preset === 'gradient'
      ? `linear-gradient(135deg, ${accentColor}, #06b6d4)`
      : preset === 'filled' ? accentColor : undefined

    return (
      <div
        className={`rounded-xl p-5 h-full ${preset === 'minimal' ? 'bg-white border border-gray-200 shadow-sm' : preset === 'bordered' ? 'bg-white border-l-4 shadow-sm border-y border-r border-gray-200' : ''}`}
        style={{ background: bg, borderLeftColor: preset === 'bordered' ? accentColor : undefined, ...style }}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className={`text-sm font-medium mb-1 ${isFilled ? 'text-white/75' : 'text-gray-500'}`}>{label}</p>
            <h3 className={`text-3xl font-bold m-0 ${isFilled ? 'text-white' : 'text-gray-900'}`}>{value}</h3>
          </div>
          {icon && (
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isFilled ? 'rgba(255,255,255,0.2)' : iconBg }}>
              <span style={{ fontSize: '1.25rem' }}>{icon}</span>
            </div>
          )}
        </div>
        {(trend || subtext) && (
          <div className="flex items-center gap-2 flex-wrap">
            {trend && trendValue && (
              <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
              </span>
            )}
            {subtext && <span className={`text-sm ${isFilled ? 'text-white/75' : 'text-gray-500'}`}>{subtext}</span>}
          </div>
        )}
      </div>
    )
  }

  // ── Custom / MUI ───────────────────────────────────────────────────────────
  const isFilled = preset === 'filled' || preset === 'gradient'
  const cardBg = preset === 'gradient'
    ? `linear-gradient(135deg, ${accentColor}, #06b6d4)`
    : preset === 'filled' ? accentColor : 'var(--color-surface)'

  const borderStyle = preset === 'bordered'
    ? { borderLeft: `4px solid ${accentColor}`, border: '1px solid var(--color-border)', borderLeftWidth: 4 }
    : preset === 'minimal' ? { border: '1px solid var(--color-border)' }
    : {}

  return (
    <div style={{ padding: 20, borderRadius: 12, background: cardBg, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', ...borderStyle, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '0.8125rem', fontWeight: 500, color: isFilled ? 'rgba(255,255,255,0.75)' : 'var(--color-text-secondary)' }}>{label}</p>
          <h3 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.1, color: isFilled ? '#fff' : 'var(--color-text-primary)' }}>{value}</h3>
        </div>
        {icon && <StatIcon icon={icon} iconBg={isFilled ? 'rgba(255,255,255,0.2)' : iconBg} iconColor={isFilled ? '#fff' : iconColor} />}
      </div>
      {(trend || subtext) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {trend && trendValue && <TrendBadge trend={trend} trendValue={trendValue} />}
          {subtext && <span style={{ fontSize: '0.8125rem', color: isFilled ? 'rgba(255,255,255,0.7)' : 'var(--color-text-secondary)' }}>{subtext}</span>}
        </div>
      )}
    </div>
  )
})

export default StatCardElement
