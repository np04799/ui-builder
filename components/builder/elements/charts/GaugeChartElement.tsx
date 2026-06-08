'use client'

import { memo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import ChartWrapper from './ChartWrapper'
import type { GaugeThreshold } from '@/types/builder.types'

ChartJS.register(ArcElement, Tooltip)

const DEFAULT_THRESHOLDS: GaugeThreshold[] = [
  { value: 33, color: '#10b981' },
  { value: 66, color: '#f59e0b' },
  { value: 100, color: '#ef4444' },
]

interface Props {
  title?: string
  value?: number
  min?: number
  max?: number
  thresholds?: GaugeThreshold[]
  showLabel?: boolean
  style?: React.CSSProperties
}

function activeColor(value: number, thresholds: GaugeThreshold[]): string {
  const sorted = [...thresholds].sort((a, b) => a.value - b.value)
  for (const t of sorted) {
    if (value <= t.value) return t.color
  }
  return sorted[sorted.length - 1]?.color ?? '#6366f1'
}

function GaugeChartElement({
  title,
  value = 65,
  min = 0,
  max = 100,
  thresholds = DEFAULT_THRESHOLDS,
  showLabel = true,
  style,
}: Props) {
  const clamped = Math.min(Math.max(value, min), max)
  const pct = (clamped - min) / (max - min)
  const color = activeColor(((clamped - min) / (max - min)) * 100, thresholds)

  // Half-donut: filled arc + empty arc split at 50% rotation
  const filled = pct * 100
  const empty = 100 - filled

  const data = {
    datasets: [{
      data: [filled, empty],
      backgroundColor: [color, '#f3f4f6'],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  }

  return (
    <ChartWrapper title={title} height={160} style={style}>
      <Doughnut data={data} options={options} />
      {showLabel && (
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{value}</span>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: 2 }}>/ {max}</span>
        </div>
      )}
    </ChartWrapper>
  )
}

export default memo(GaugeChartElement)
