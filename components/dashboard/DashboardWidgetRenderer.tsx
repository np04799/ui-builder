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
