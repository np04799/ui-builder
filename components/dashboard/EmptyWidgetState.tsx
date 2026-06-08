'use client'

import { useDashboardStore } from '@/store/dashboard.store'
import type { DashboardWidgetType } from '@/types/dashboard.types'

const ICONS: Record<DashboardWidgetType, string> = {
  'chart-bar': 'bi-bar-chart-fill',
  'chart-line': 'bi-graph-up',
  'chart-area': 'bi-graph-up-arrow',
  'chart-pie': 'bi-pie-chart-fill',
  'chart-donut': 'bi-pie-chart',
  'chart-gauge': 'bi-speedometer2',
  'kpi-card': 'bi-lightning-charge-fill',
  'data-table': 'bi-table',
  'filter-bar': 'bi-funnel-fill',
  'text-heading': 'bi-type-h1',
  'dash-image': 'bi-image',
}

interface Props {
  widgetId: string
  type: DashboardWidgetType
}

export default function EmptyWidgetState({ widgetId, type }: Props) {
  const setSelected = useDashboardStore((s) => s.setSelectedWidget)
  const setTab = useDashboardStore((s) => s.setActiveRightTab)

  function handleConnect() {
    setSelected(widgetId)
    setTab('data')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 10,
        padding: 16,
        color: 'var(--color-text-secondary)',
        textAlign: 'center',
      }}
    >
      <i
        className={`bi ${ICONS[type] ?? 'bi-bar-chart'}`}
        style={{ fontSize: '2rem', opacity: 0.3 }}
      />
      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 500 }}>No data connected</p>
      <button
        onClick={handleConnect}
        style={{
          padding: '5px 14px',
          borderRadius: 6,
          border: '1px solid var(--color-primary)',
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          fontSize: '0.75rem',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Connect Data →
      </button>
    </div>
  )
}
