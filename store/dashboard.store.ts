'use client'
// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Store — Zustand
// KPI Dashboard state: widgets, data sources, filters, grid layouts
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type {
  DashboardStore,
  DashboardStoreState,
  DashboardWidget,
  DashboardWidgetType,
  DashboardDataSource,
  FilterState,
  DashboardTemplate,
} from '@/types/dashboard.types'
import { applyFilters } from '@/utils/filterEngine'

// ─── Built-in preview data shown before user connects a real source ──────────

const PREVIEW_MONTHLY = [
  { month: 'Jan', value: 4200, category: 'A', count: 31 },
  { month: 'Feb', value: 5100, category: 'B', count: 28 },
  { month: 'Mar', value: 4700, category: 'A', count: 35 },
  { month: 'Apr', value: 6300, category: 'C', count: 42 },
  { month: 'May', value: 7100, category: 'B', count: 51 },
  { month: 'Jun', value: 6800, category: 'A', count: 47 },
]

const PREVIEW_PIE = [
  { segment: 'Direct', value: 3800 },
  { segment: 'Organic', value: 2900 },
  { segment: 'Referral', value: 1800 },
  { segment: 'Social', value: 1200 },
]

// ─── Default widget configs per type ─────────────────────────────────────────

function defaultWidget(type: DashboardWidgetType): DashboardWidget {
  const id = crypto.randomUUID()
  const base: DashboardWidget = {
    id,
    type,
    title: labelFor(type),
    dataSourceId: null,
    dataBinding: {},
    chartConfig: { showLegend: true, showGrid: true, colors: ['#6366f1','#f59e0b','#10b981','#3b82f6','#ef4444','#8b5cf6'] },
    widgetFilters: [],
    style: { borderRadius: 12, padding: 16, showTitle: true },
  }

  // Pre-configure bindings + preview rows per chart type
  switch (type) {
    case 'chart-bar':
      base.dataBinding = { xAxis: 'month', yAxis: 'value' }
      base.chartConfig = { ...base.chartConfig, orientation: 'vertical', stacked: false, showLegend: false }
      base._previewRows = PREVIEW_MONTHLY
      break
    case 'chart-line':
      base.dataBinding = { xAxis: 'month', yAxis: 'value' }
      base.chartConfig = { ...base.chartConfig, smooth: true }
      base._previewRows = PREVIEW_MONTHLY
      break
    case 'chart-area':
      base.dataBinding = { xAxis: 'month', yAxis: 'value' }
      base.chartConfig = { ...base.chartConfig, smooth: true, stacked: false }
      base._previewRows = PREVIEW_MONTHLY
      break
    case 'chart-pie':
      base.dataBinding = { xAxis: 'segment', yAxis: 'value' }
      base.chartConfig = { ...base.chartConfig, showLegend: true }
      base._previewRows = PREVIEW_PIE
      break
    case 'chart-donut':
      base.dataBinding = { xAxis: 'segment', yAxis: 'value' }
      base.chartConfig = { ...base.chartConfig, showLegend: true }
      base._previewRows = PREVIEW_PIE
      break
    case 'chart-gauge':
      base.dataBinding = { valueField: 'value' }
      base.chartConfig = { ...base.chartConfig, gaugeMin: 0, gaugeMax: 10000, showLegend: false, showGrid: false }
      base._previewRows = [{ value: 6800 }]
      break
    case 'kpi-card':
      base.dataBinding = { valueField: 'value', sparklineField: 'value' }
      base.kpiConfig = {
        valueFormat: 'number',
        icon: 'bi-graph-up-arrow',
        iconBg: '#ede9fe',
        iconColor: '#7c3aed',
        accentColor: '#6366f1',
        trendMode: 'auto',
      }
      base._previewRows = PREVIEW_MONTHLY
      break
    case 'data-table':
      base.dataBinding = { tableColumns: ['month', 'value', 'category', 'count'] }
      base.tableConfig = { pageSize: 10, striped: true, density: 'normal', showColumnFilters: true }
      base._previewRows = PREVIEW_MONTHLY
      break
  }

  return base
}

function labelFor(type: DashboardWidgetType): string {
  const map: Record<DashboardWidgetType, string> = {
    'chart-bar': 'Bar Chart',
    'chart-line': 'Line Chart',
    'chart-area': 'Area Chart',
    'chart-pie': 'Pie Chart',
    'chart-donut': 'Donut Chart',
    'chart-gauge': 'Gauge',
    'kpi-card': 'KPI Card',
    'data-table': 'Data Table',
    'filter-bar': 'Filters',
  }
  return map[type] ?? type
}

// ─── Default layout position for new widget ──────────────────────────────────

function defaultLayout(
  id: string,
  type: DashboardWidgetType,
  existingCount: number
): import('react-grid-layout').Layout {
  const col = (existingCount % 3) * 4
  const row = Math.floor(existingCount / 3) * 4

  const sizes: Partial<Record<DashboardWidgetType, { w: number; h: number }>> = {
    'kpi-card': { w: 3, h: 3 },
    'filter-bar': { w: 12, h: 2 },
    'data-table': { w: 8, h: 5 },
    'chart-gauge': { w: 3, h: 4 },
  }
  const { w = 4, h = 4 } = sizes[type] ?? {}

  return { i: id, x: col % 12, y: row, w, h, minW: 2, minH: 2 }
}

// ─── Empty state ──────────────────────────────────────────────────────────────

const EMPTY_STATE: DashboardStoreState = {
  widgets: [],
  dataSources: [],
  globalFilters: [],
  gridLayouts: { lg: [], md: [], sm: [] },
  selectedWidgetId: null,
  activeRightTab: 'config',
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardStore>()(
  persist(
    immer((set, get) => ({
      ...EMPTY_STATE,

      // ── Widget actions ──────────────────────────────────────────────────────

      addWidget(type) {
        set((s) => {
          const widget = defaultWidget(type)
          const layout = defaultLayout(widget.id, type, s.widgets.length)
          s.widgets.push(widget)
          // Add layout to all breakpoints
          ;(['lg', 'md', 'sm'] as const).forEach((bp) => {
            if (!s.gridLayouts[bp]) s.gridLayouts[bp] = []
            const bpLayout = { ...layout }
            if (bp === 'md') { bpLayout.w = Math.min(layout.w, 6); bpLayout.x = (s.widgets.length - 1) % 2 * 3 }
            if (bp === 'sm') { bpLayout.w = 1; bpLayout.x = 0 }
            ;(s.gridLayouts[bp] as import('react-grid-layout').Layout[]).push(bpLayout)
          })
          s.selectedWidgetId = widget.id
          s.activeRightTab = 'data'
        })
      },

      removeWidget(id) {
        set((s) => {
          s.widgets = s.widgets.filter((w) => w.id !== id)
          ;(['lg', 'md', 'sm'] as const).forEach((bp) => {
            s.gridLayouts[bp] = (s.gridLayouts[bp] as import('react-grid-layout').Layout[]).filter((l) => l.i !== id)
          })
          if (s.selectedWidgetId === id) s.selectedWidgetId = null
        })
      },

      updateWidget(id, patch) {
        set((s) => {
          const idx = s.widgets.findIndex((w) => w.id === id)
          if (idx !== -1) Object.assign(s.widgets[idx], patch)
        })
      },

      duplicateWidget(id) {
        set((s) => {
          const src = s.widgets.find((w) => w.id === id)
          if (!src) return
          const newId = crypto.randomUUID()
          const clone: DashboardWidget = { ...JSON.parse(JSON.stringify(src)), id: newId }
          clone.title = `${clone.title} (copy)`
          s.widgets.push(clone)
          // Place copy below original
          ;(['lg', 'md', 'sm'] as const).forEach((bp) => {
            const orig = (s.gridLayouts[bp] as import('react-grid-layout').Layout[]).find((l) => l.i === id)
            if (orig) {
              ;(s.gridLayouts[bp] as import('react-grid-layout').Layout[]).push({ ...orig, i: newId, y: orig.y + orig.h })
            }
          })
        })
      },

      setSelectedWidget(id) {
        set((s) => { s.selectedWidgetId = id })
      },

      setActiveRightTab(tab) {
        set((s) => { s.activeRightTab = tab })
      },

      // ── Data source actions ─────────────────────────────────────────────────

      addDataSource(source) {
        set((s) => {
          const idx = s.dataSources.findIndex((d) => d.id === source.id)
          if (idx !== -1) s.dataSources[idx] = source
          else s.dataSources.push(source)
        })
      },

      updateDataSource(id, patch) {
        set((s) => {
          const idx = s.dataSources.findIndex((d) => d.id === id)
          if (idx !== -1) Object.assign(s.dataSources[idx], patch)
        })
      },

      removeDataSource(id) {
        set((s) => {
          s.dataSources = s.dataSources.filter((d) => d.id !== id)
          // Unlink widgets that used this source
          s.widgets.forEach((w) => { if (w.dataSourceId === id) w.dataSourceId = null })
        })
      },

      // ── Filter actions ──────────────────────────────────────────────────────

      setGlobalFilter(filter) {
        set((s) => {
          const idx = s.globalFilters.findIndex((f) => f.id === filter.id)
          if (idx !== -1) s.globalFilters[idx] = filter
          else s.globalFilters.push(filter)
        })
      },

      removeGlobalFilter(id) {
        set((s) => { s.globalFilters = s.globalFilters.filter((f) => f.id !== id) })
      },

      clearGlobalFilters() {
        set((s) => { s.globalFilters = [] })
      },

      // ── Layout ──────────────────────────────────────────────────────────────

      updateLayout(layouts) {
        set((s) => { s.gridLayouts = layouts })
      },

      // ── Data resolver ───────────────────────────────────────────────────────

      getWidgetData(widgetId) {
        const { widgets, dataSources, globalFilters } = get()
        const widget = widgets.find((w) => w.id === widgetId)
        if (!widget) return []
        const sourceId = widget.dataSourceId ?? dataSources[0]?.id
        const source = dataSources.find((d) => d.id === sourceId)
        if (!source) return []
        const afterGlobal = applyFilters(source.rows, globalFilters)
        return applyFilters(afterGlobal, widget.widgetFilters)
      },

      // ── Template loader ─────────────────────────────────────────────────────

      loadTemplate(template: DashboardTemplate) {
        set((s) => {
          s.widgets = template.widgets
          s.gridLayouts = template.layouts
          s.dataSources = [template.sampleDataSource]
          // Link all widgets to the sample data source
          s.widgets.forEach((w) => { w.dataSourceId = template.sampleDataSource.id })
          s.globalFilters = []
          s.selectedWidgetId = null
        })
      },

      // ── Reset ───────────────────────────────────────────────────────────────

      reset() {
        set(() => ({ ...EMPTY_STATE }))
      },
    })),
    {
      name: 'bp-dashboard-store',
      partialize: (s) => ({
        widgets: s.widgets,
        dataSources: s.dataSources,
        globalFilters: s.globalFilters,
        gridLayouts: s.gridLayouts,
      }),
    }
  )
)

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectWidget = (id: string) => (s: DashboardStore) =>
  s.widgets.find((w) => w.id === id)

export const selectDataSource = (id: string | null) => (s: DashboardStore) =>
  id ? s.dataSources.find((ds) => ds.id === id) ?? null : null
