'use client'

import { useState } from 'react'
import { useDashboardStore } from '@/store/dashboard.store'
import type { DashboardWidgetType } from '@/types/dashboard.types'

interface WidgetDef {
  type: DashboardWidgetType
  label: string
  desc: string
  icon: string
}

const CHART_WIDGETS: WidgetDef[] = [
  { type: 'chart-bar',   label: 'Bar Chart',   desc: 'Compare values across categories', icon: 'bi-bar-chart-fill' },
  { type: 'chart-line',  label: 'Line Chart',  desc: 'Show trends over time',            icon: 'bi-graph-up' },
  { type: 'chart-area',  label: 'Area Chart',  desc: 'Line with filled area',            icon: 'bi-graph-up-arrow' },
  { type: 'chart-pie',   label: 'Pie Chart',   desc: 'Show proportions of a whole',      icon: 'bi-pie-chart-fill' },
  { type: 'chart-donut', label: 'Donut Chart', desc: 'Pie chart with center label',      icon: 'bi-pie-chart' },
  { type: 'chart-gauge', label: 'Gauge',       desc: 'Show a single KPI as a gauge',     icon: 'bi-speedometer2' },
]

const DISPLAY_WIDGETS: WidgetDef[] = [
  { type: 'kpi-card',   label: 'KPI Card',    desc: 'Big number with trend & sparkline', icon: 'bi-lightning-charge-fill' },
  { type: 'data-table', label: 'Data Table',  desc: 'Sortable table with column filters', icon: 'bi-table' },
]

const FILTER_WIDGETS: WidgetDef[] = [
  { type: 'filter-bar', label: 'Filter Bar', desc: 'Global filters applied to all widgets', icon: 'bi-funnel-fill' },
]

type Tab = 'charts' | 'display' | 'filters'

interface Props {
  onClose: () => void
}

export default function WidgetPickerModal({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>('charts')
  const addWidget = useDashboardStore((s) => s.addWidget)

  function handleAdd(type: DashboardWidgetType) {
    addWidget(type)
    onClose()
  }

  const current =
    tab === 'charts' ? CHART_WIDGETS :
    tab === 'display' ? DISPLAY_WIDGETS :
    FILTER_WIDGETS

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560, maxHeight: '80vh', borderRadius: 14,
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Add Widget
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Click a widget to add it to your dashboard
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '1.2rem', padding: 4 }}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, padding: '12px 20px 0', borderBottom: '1px solid var(--color-border)' }}>
          {(['charts', 'display', 'filters'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '6px 14px',
                border: 'none',
                borderBottom: tab === t ? '2px solid var(--color-primary)' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: tab === t ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: tab === t ? 700 : 400,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
                marginBottom: -1,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Widget grid */}
        <div style={{ padding: 20, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {current.map((w) => (
            <WidgetCard key={w.type} def={w} onClick={() => handleAdd(w.type)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function WidgetCard({ def, onClick }: { def: WidgetDef; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '14px 12px',
        borderRadius: 10,
        border: `2px solid ${hov ? 'var(--color-primary)' : 'var(--color-border)'}`,
        backgroundColor: hov ? 'var(--color-selected)' : 'var(--color-bg)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}
    >
      <i
        className={`bi ${def.icon}`}
        style={{
          fontSize: '1.4rem',
          color: hov ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        }}
      />
      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
        {def.label}
      </span>
      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
        {def.desc}
      </span>
    </button>
  )
}
