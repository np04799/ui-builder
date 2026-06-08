'use client'

import { memo } from 'react'
import {
  Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { DashboardWidget } from '@/types/dashboard.types'
import { extractKPIValue, computeTrend } from '@/utils/filterEngine'
import { formatKPIValue } from '@/utils/dataParser'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler)

interface Props {
  widget: DashboardWidget
  rows: Record<string, unknown>[]
  isPreview?: boolean
}

const KPICardWidget = memo(function KPICardWidget({ widget, rows, isPreview }: Props) {
  const { dataBinding: binding, kpiConfig: cfg = {}, chartConfig } = widget

  const valueField = binding.valueField
  const sparklineField = binding.sparklineField ?? binding.yAxis as string | undefined
  const trendField = binding.trendField

  // Compute main value
  const value = valueField ? extractKPIValue(rows, valueField) : 0
  const formatted = formatKPIValue(value, cfg.valueFormat ?? 'number', cfg.currencySymbol ?? '$')

  // Compute trend
  let trendDir: 'up' | 'down' | 'neutral' = 'neutral'
  let trendPct = 0
  if (cfg.trendMode === 'manual') {
    trendDir = cfg.trendDirection ?? 'neutral'
  } else if (trendField) {
    const { direction, pct } = computeTrend(rows, trendField)
    trendDir = direction
    trendPct = pct
  } else if (valueField) {
    const { direction, pct } = computeTrend(rows, valueField)
    trendDir = direction
    trendPct = pct
  }

  const trendCfg = {
    up:      { color: '#16a34a', bg: '#f0fdf4', arrow: '▲' },
    down:    { color: '#dc2626', bg: '#fef2f2', arrow: '▼' },
    neutral: { color: '#6b7280', bg: '#f3f4f6', arrow: '→' },
  }[trendDir]

  // Sparkline data
  const sparkData = sparklineField
    ? rows.slice(-20).map((r) => Number(r[sparklineField] ?? 0))
    : valueField
    ? rows.slice(-20).map((r) => Number(r[valueField] ?? 0))
    : []

  const accentColor = cfg.accentColor ?? chartConfig.colors?.[0] ?? '#6366f1'
  const label = cfg.staticLabel ?? (binding.labelField ? String(rows[0]?.[binding.labelField] ?? '') : widget.title)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: 6 }}>
      {/* Top row: icon + label */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {label}
          </p>
        </div>
        {cfg.icon && (
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            backgroundColor: cfg.iconBg ?? '#ede9fe',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className={`bi ${cfg.icon}`} style={{ fontSize: '1.1rem', color: cfg.iconColor ?? accentColor }} />
          </div>
        )}
      </div>

      {/* Big number */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <span style={{
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          {formatted}
        </span>
      </div>

      {/* Trend badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          fontSize: '0.72rem', fontWeight: 700,
          color: trendCfg.color, backgroundColor: trendCfg.bg,
          padding: '2px 8px', borderRadius: 999,
        }}>
          {trendCfg.arrow} {trendPct > 0 ? `${trendPct.toFixed(1)}%` : trendDir}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>vs prev period</span>
      </div>

      {/* Sparkline */}
      {sparkData.length > 1 && (
        <div style={{ height: 40, marginTop: 4 }}>
          <Line
            data={{
              labels: sparkData.map((_, i) => String(i)),
              datasets: [{
                data: sparkData,
                borderColor: accentColor,
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                backgroundColor: `${accentColor}18`,
                tension: 0.4,
              }],
            }}
            options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { enabled: false } },
              scales: { x: { display: false }, y: { display: false } },
              elements: { line: { borderCapStyle: 'round' } },
            }}
          />
        </div>
      )}
    </div>
  )
})

export default KPICardWidget
