// ─────────────────────────────────────────────────────────────────────────────
// Filter Engine — applies FilterState[] to data rows
// Pure functions — no side effects
// ─────────────────────────────────────────────────────────────────────────────

import type { FilterState, FilterOperator } from '@/types/dashboard.types'

type Row = Record<string, unknown>

// ─── Single predicate ─────────────────────────────────────────────────────────

function testRow(row: Row, filter: FilterState): boolean {
  const rawVal = row[filter.column]
  const val = String(rawVal ?? '').toLowerCase()
  const filterVal = String(filter.value ?? '').toLowerCase()

  switch (filter.operator as FilterOperator) {
    case 'eq':
      return val === filterVal

    case 'neq':
      return val !== filterVal

    case 'contains':
      return val.includes(filterVal)

    case 'gt':
      return Number(rawVal) > Number(filter.value)

    case 'lt':
      return Number(rawVal) < Number(filter.value)

    case 'between': {
      const n = Number(rawVal)
      const min = Number(filter.value)
      const max = Number(filter.value2)
      return n >= min && n <= max
    }

    case 'in': {
      const list = Array.isArray(filter.value)
        ? (filter.value as unknown[]).map((v) => String(v).toLowerCase())
        : [filterVal]
      return list.includes(val)
    }

    default:
      return true
  }
}

// ─── Apply all filters (AND logic) ───────────────────────────────────────────

export function applyFilters(rows: Row[], filters: FilterState[]): Row[] {
  if (!filters || filters.length === 0) return rows
  // Skip filters with empty/null values
  const active = filters.filter((f) => {
    if (f.value === null || f.value === undefined || f.value === '') return false
    if (Array.isArray(f.value) && f.value.length === 0) return false
    return true
  })
  if (active.length === 0) return rows
  return rows.filter((row) => active.every((f) => testRow(row, f)))
}

// ─── Extract chart-ready data from bound rows ─────────────────────────────────

interface ChartData {
  labels: string[]
  datasets: { label: string; data: number[] }[]
}

export function extractChartData(
  rows: Row[],
  xAxis: string,
  yAxis: string | string[]
): ChartData {
  const yFields = Array.isArray(yAxis) ? yAxis : [yAxis]
  const labels = rows.map((r) => String(r[xAxis] ?? ''))
  const datasets = yFields.map((field) => ({
    label: field,
    data: rows.map((r) => Number(r[field] ?? 0)),
  }))
  return { labels, datasets }
}

// ─── Extract KPI value from rows ──────────────────────────────────────────────

export function extractKPIValue(
  rows: Row[],
  valueField: string,
  aggregation: 'sum' | 'avg' | 'count' | 'max' | 'min' = 'sum'
): number {
  if (rows.length === 0) return 0
  const nums = rows.map((r) => Number(r[valueField] ?? 0))
  switch (aggregation) {
    case 'sum': return nums.reduce((a, b) => a + b, 0)
    case 'avg': return nums.reduce((a, b) => a + b, 0) / nums.length
    case 'count': return rows.length
    case 'max': return Math.max(...nums)
    case 'min': return Math.min(...nums)
  }
}

// ─── Compute trend (compare first half vs second half of data) ───────────────

export function computeTrend(
  rows: Row[],
  valueField: string
): { direction: 'up' | 'down' | 'neutral'; pct: number } {
  if (rows.length < 2) return { direction: 'neutral', pct: 0 }
  const mid = Math.floor(rows.length / 2)
  const first = rows.slice(0, mid).map((r) => Number(r[valueField] ?? 0))
  const second = rows.slice(mid).map((r) => Number(r[valueField] ?? 0))
  const avg1 = first.reduce((a, b) => a + b, 0) / first.length
  const avg2 = second.reduce((a, b) => a + b, 0) / second.length
  if (avg1 === 0) return { direction: 'neutral', pct: 0 }
  const pct = ((avg2 - avg1) / avg1) * 100
  return {
    direction: pct > 0.5 ? 'up' : pct < -0.5 ? 'down' : 'neutral',
    pct: Math.abs(pct),
  }
}
