'use client'

import { memo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  ArcElement, RadialLinearScale, Filler, Title, Tooltip, Legend,
} from 'chart.js'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'
import type { DashboardWidget } from '@/types/dashboard.types'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  ArcElement, RadialLinearScale, Filler, Title, Tooltip, Legend
)

const DEFAULT_PALETTE = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6',
  '#8b5cf6', '#f97316', '#06b6d4', '#84cc16', '#ec4899',
]

interface Props {
  widget: DashboardWidget
  labels: string[]
  datasets: { label: string; data: number[]; backgroundColor?: string | string[] }[]
  isPreview?: boolean
}


// Preview badge shown when widget is using built-in sample data
function PreviewBadge() {
  return (
    <div style={{
      position: 'absolute', top: 6, right: 6, zIndex: 10,
      fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px',
      borderRadius: 4, backgroundColor: 'rgba(99,102,241,0.12)',
      color: 'var(--color-primary)', border: '1px solid rgba(99,102,241,0.2)',
      pointerEvents: 'none', letterSpacing: '0.04em',
    }}>PREVIEW DATA</div>
  )
}

const DashboardChartWidget = memo(function DashboardChartWidget({ widget, labels, datasets, isPreview }: Props) {
  function wrap(el: React.ReactNode) {
    return (
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        {isPreview && <PreviewBadge />}
        {el}
      </div>
    )
  }
  const { type, chartConfig: cfg } = widget
  const colors = cfg.colors ?? DEFAULT_PALETTE

  const baseDatasets = datasets.map((ds, i) => ({
    label: ds.label,
    data: ds.data,
    backgroundColor: `${colors[i % colors.length]}cc`,
    borderColor: colors[i % colors.length],
    borderWidth: 1.5,
    borderRadius: type === 'chart-bar' ? 4 : undefined,
    tension: cfg.smooth ? 0.4 : 0,
    fill: type === 'chart-area',
    pointRadius: type === 'chart-line' ? 3 : 0,
  }))

  const chartData = { labels, datasets: baseDatasets }

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: cfg.showLegend ?? true, position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales:
      type === 'chart-pie' || type === 'chart-donut'
        ? {}
        : {
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            y: { grid: { display: cfg.showGrid ?? true, color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 } } },
            ...(cfg.stacked ? { x: { stacked: true }, y: { stacked: true } } : {}),
          },
  }

  if (type === 'chart-bar') {
    return wrap(
      <Bar
        data={chartData}
        options={{
          ...baseOptions,
          indexAxis: cfg.orientation === 'horizontal' ? 'y' : 'x',
        }}
      />
    )
  }

  if (type === 'chart-line' || type === 'chart-area') {
    return wrap(<Line data={chartData} options={baseOptions} />)
  }

  if (type === 'chart-pie') {
    const pieData = {
      labels,
      datasets: [{
        data: datasets[0]?.data ?? [],
        backgroundColor: labels.map((_, i) => `${colors[i % colors.length]}cc`),
        borderColor: labels.map((_, i) => colors[i % colors.length]),
        borderWidth: 1.5,
      }],
    }
    return wrap(<Pie data={pieData} options={baseOptions} />)
  }

  if (type === 'chart-donut') {
    const donutData = {
      labels,
      datasets: [{
        data: datasets[0]?.data ?? [],
        backgroundColor: labels.map((_, i) => `${colors[i % colors.length]}cc`),
        borderColor: labels.map((_, i) => colors[i % colors.length]),
        borderWidth: 1.5,
      }],
    }
    return wrap(<Doughnut data={donutData} options={{ ...baseOptions, cutout: `${cfg.cutout ?? 60}%` }} />)
  }

  if (type === 'chart-gauge') {
    return wrap(<GaugeWidget widget={widget} value={datasets[0]?.data[0] ?? 0} />)
  }

  return null
})

export default DashboardChartWidget

// ─── Simple Gauge using Doughnut ─────────────────────────────────────────────

function GaugeWidget({ widget, value }: { widget: DashboardWidget; value: number }) {
  const { chartConfig: cfg } = widget
  const min = cfg.gaugeMin ?? 0
  const max = cfg.gaugeMax ?? 100
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)))
  const color = pct < 0.4 ? '#10b981' : pct < 0.7 ? '#f59e0b' : '#ef4444'

  const data = {
    datasets: [{
      data: [pct * 180, (1 - pct) * 180, 180],
      backgroundColor: [color, '#e5e7eb', 'transparent'],
      borderWidth: 0,
      circumference: 180,
      rotation: -90,
    }],
  }

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ width: '100%', maxWidth: 180 }}>
        <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, cutout: '70%' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '15%', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{value}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>{min} – {max}</div>
      </div>
    </div>
  )
}
