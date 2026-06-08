'use client'

import { useDashboardStore } from '@/store/dashboard.store'
import type { DashboardWidget } from '@/types/dashboard.types'
import { extractChartData } from '@/utils/filterEngine'
import EmptyWidgetState from './EmptyWidgetState'
import KPICardWidget from './widgets/KPICardWidget'
import DataTableWidget from './widgets/DataTableWidget'
import FilterBarWidget from './widgets/FilterBarWidget'
import DashboardChartWidget from './widgets/DashboardChartWidget'

interface Props {
  widget: DashboardWidget
}

export default function DashboardWidgetRenderer({ widget }: Props) {
  const getWidgetData = useDashboardStore((s) => s.getWidgetData)
  // Subscribe to globalFilters so this component re-renders when filters change.
  // getWidgetData calls get() internally so it always returns filtered rows,
  // but without this subscription the component never re-renders after a filter update.
  useDashboardStore((s) => s.globalFilters)
  const liveRows = getWidgetData(widget.id)

  // Use live data if available, fall back to built-in preview rows
  const isPreview = liveRows.length === 0
  const rows = isPreview ? (widget._previewRows ?? []) : liveRows
  const hasRows = rows.length > 0

  const { dataBinding } = widget

  // Filter bar never needs data
  if (widget.type === 'filter-bar') {
    return <FilterBarWidget widget={widget} />
  }

  // Heading widget — static text block, no data needed
  if (widget.type === 'text-heading') {
    return (
      <div style={{ padding: '8px 12px', height: '100%', display: 'flex', alignItems: 'center' }}>
        <span style={{
          fontSize: (widget.style as Record<string, unknown>)?.fontSize as string ?? '1.5rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
        }}>
          {widget.title}
        </span>
      </div>
    )
  }

  // Image widget — URL-backed image or placeholder
  if (widget.type === 'dash-image') {
    const src = (widget.style as Record<string, unknown>)?.imageUrl as string | undefined
    if (!src) {
      return (
        <div style={{
          height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 8,
          color: 'var(--color-text-secondary)',
        }}>
          <i className="bi bi-image" style={{ fontSize: '2.5rem' }} />
          <span style={{ fontSize: '0.8rem' }}>Configure image URL in settings</span>
        </div>
      )
    }
    return (
      <img
        src={src}
        alt={widget.title}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
    )
  }

  // No data at all (preview rows also absent) — show connect prompt
  if (!hasRows) {
    return <EmptyWidgetState widgetId={widget.id} type={widget.type} />
  }

  // KPI Card
  if (widget.type === 'kpi-card') {
    return <KPICardWidget widget={widget} rows={rows} isPreview={isPreview} />
  }

  // Data Table
  if (widget.type === 'data-table') {
    return <DataTableWidget widget={widget} rows={rows} isPreview={isPreview} />
  }

  // Gauge — single numeric value, no xAxis needed
  if (widget.type === 'chart-gauge') {
    const valueField = dataBinding.valueField ?? (dataBinding.yAxis as string) ?? 'value'
    const val = Number((rows[0] as Record<string, unknown>)?.[valueField] ?? 0)
    return (
      <DashboardChartWidget
        widget={widget}
        labels={[]}
        datasets={[{
          label: widget.title,
          data: [val],
          backgroundColor: widget.chartConfig?.colors?.[0] ?? '#6366f1',
        }]}
        isPreview={isPreview}
      />
    )
  }

  // All other chart types — need xAxis + yAxis
  const xAxis = dataBinding.xAxis
  const yAxis = dataBinding.yAxis
  if (!xAxis || !yAxis) {
    return <EmptyWidgetState widgetId={widget.id} type={widget.type} />
  }

  const { labels, datasets } = extractChartData(rows, xAxis, yAxis)

  return (
    <DashboardChartWidget
      widget={widget}
      labels={labels}
      datasets={datasets}
      isPreview={isPreview}
    />
  )
}
