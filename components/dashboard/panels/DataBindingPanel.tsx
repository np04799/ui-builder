'use client'

import { useDashboardStore, selectDataSource } from '@/store/dashboard.store'
import type { DashboardWidget, ColumnMeta, DataBinding } from '@/types/dashboard.types'

interface Props {
  widget: DashboardWidget
}

export default function DataBindingPanel({ widget }: Props) {
  const source = useDashboardStore(selectDataSource(widget.dataSourceId))
  const updateWidget = useDashboardStore((s) => s.updateWidget)

  if (!source || source.rows.length === 0) {
    return (
      <div style={{ padding: '12px 0', color: 'var(--color-text-secondary)', fontSize: '0.8rem', textAlign: 'center' }}>
        Connect a data source first to configure bindings.
      </div>
    )
  }

  const { columns } = source
  const { type, dataBinding: binding } = widget

  function patch(patch: Partial<DataBinding>) {
    updateWidget(widget.id, { dataBinding: { ...widget.dataBinding, ...patch } })
  }

  const numCols = columns.filter((c: ColumnMeta) => c.type === 'number')
  const allCols = columns

  const colOptions = (cols: ColumnMeta[]) => (
    <>
      <option value="">— none —</option>
      {cols.map((c: ColumnMeta) => (
        <option key={c.name} value={c.name}>
          {c.name} ({c.type})
        </option>
      ))}
    </>
  )

  const isChart = type.startsWith('chart-') && type !== 'chart-gauge'
  const isPie = type === 'chart-pie' || type === 'chart-donut'
  const isGauge = type === 'chart-gauge'
  const isKPI = type === 'kpi-card'
  const isTable = type === 'data-table'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Column legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {columns.map((c: ColumnMeta) => (
          <span key={c.name} style={{
            fontSize: '0.65rem', padding: '2px 7px', borderRadius: 999,
            backgroundColor: c.type === 'number' ? 'rgba(99,102,241,0.1)' : c.type === 'date' ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
            color: c.type === 'number' ? '#6366f1' : c.type === 'date' ? '#10b981' : '#6b7280',
            fontWeight: 600,
          }}>
            {c.name}
          </span>
        ))}
      </div>

      {/* Chart (non-pie) bindings */}
      {isChart && !isPie && (
        <>
          <BindRow label="X Axis (categories)">
            <select value={binding.xAxis ?? ''} onChange={(e) => patch({ xAxis: e.target.value })} style={selectStyle}>
              {colOptions(allCols)}
            </select>
          </BindRow>
          <BindRow label="Y Axis (values)">
            <select value={Array.isArray(binding.yAxis) ? binding.yAxis[0] ?? '' : binding.yAxis ?? ''} onChange={(e) => patch({ yAxis: e.target.value })} style={selectStyle}>
              {colOptions(numCols)}
            </select>
          </BindRow>
          <BindRow label="2nd Y Axis (optional)">
            <select value={Array.isArray(binding.yAxis) ? binding.yAxis[1] ?? '' : ''} onChange={(e) => {
              const first = Array.isArray(binding.yAxis) ? binding.yAxis[0] : binding.yAxis ?? ''
              patch({ yAxis: e.target.value ? [first, e.target.value] : first })
            }} style={selectStyle}>
              {colOptions(numCols)}
            </select>
          </BindRow>
        </>
      )}

      {/* Pie/Donut bindings */}
      {isPie && (
        <>
          <BindRow label="Label (slice names)">
            <select value={binding.labelField ?? ''} onChange={(e) => patch({ labelField: e.target.value, xAxis: e.target.value })} style={selectStyle}>
              {colOptions(allCols)}
            </select>
          </BindRow>
          <BindRow label="Value">
            <select value={binding.valueField ?? ''} onChange={(e) => patch({ valueField: e.target.value, yAxis: e.target.value })} style={selectStyle}>
              {colOptions(numCols)}
            </select>
          </BindRow>
        </>
      )}

      {/* Gauge bindings */}
      {isGauge && (
        <BindRow label="Value column">
          <select value={binding.valueField ?? ''} onChange={(e) => patch({ valueField: e.target.value, xAxis: e.target.value, yAxis: e.target.value })} style={selectStyle}>
            {colOptions(numCols)}
          </select>
        </BindRow>
      )}

      {/* KPI Card bindings */}
      {isKPI && (
        <>
          <BindRow label="Value column (aggregated)">
            <select value={binding.valueField ?? ''} onChange={(e) => patch({ valueField: e.target.value })} style={selectStyle}>
              {colOptions(numCols)}
            </select>
          </BindRow>
          <BindRow label="Label column (optional)">
            <select value={binding.labelField ?? ''} onChange={(e) => patch({ labelField: e.target.value })} style={selectStyle}>
              {colOptions(allCols)}
            </select>
          </BindRow>
          <BindRow label="Trend column (optional)">
            <select value={binding.trendField ?? ''} onChange={(e) => patch({ trendField: e.target.value })} style={selectStyle}>
              {colOptions(numCols)}
            </select>
          </BindRow>
          <BindRow label="Sparkline series (optional)">
            <select value={binding.sparklineField ?? ''} onChange={(e) => patch({ sparklineField: e.target.value })} style={selectStyle}>
              {colOptions(numCols)}
            </select>
          </BindRow>
        </>
      )}

      {/* Data Table bindings */}
      {isTable && (
        <div>
          <label style={labelStyle}>Columns to display</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 180, overflowY: 'auto' }}>
            {allCols.map((c: ColumnMeta) => {
              const shown = !binding.tableColumns || binding.tableColumns.includes(c.name)
              return (
                <label key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer', padding: '3px 0' }}>
                  <input
                    type="checkbox"
                    checked={shown}
                    onChange={(e) => {
                      const current = binding.tableColumns ?? allCols.map((c: ColumnMeta) => c.name)
                      const updated = e.target.checked
                        ? [...current, c.name]
                        : current.filter((n: string) => n !== c.name)
                      patch({ tableColumns: updated })
                    }}
                  />
                  <span style={{ color: 'var(--color-text-primary)' }}>{c.name}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginLeft: 'auto' }}>{c.type}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function BindRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '6px 8px', borderRadius: 6,
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)',
  fontSize: '0.8rem', outline: 'none', cursor: 'pointer',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.7rem', fontWeight: 600,
  color: 'var(--color-text-secondary)', marginBottom: 4,
  textTransform: 'uppercase', letterSpacing: '0.05em',
}
