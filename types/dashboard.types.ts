// ─────────────────────────────────────────────────────────────────────────────
// KPI Dashboard — Type Definitions
// BuilderPro MVP-2
// ─────────────────────────────────────────────────────────────────────────────

import type { Layout, Layouts } from 'react-grid-layout'

// ─── Widget Types ─────────────────────────────────────────────────────────────

export type DashboardWidgetType =
  | 'chart-bar'
  | 'chart-line'
  | 'chart-area'
  | 'chart-pie'
  | 'chart-donut'
  | 'chart-gauge'
  | 'kpi-card'
  | 'data-table'
  | 'filter-bar'
  | 'text-heading'
  | 'dash-image'

// ─── Data Source ──────────────────────────────────────────────────────────────

export type DataSourceType = 'csv' | 'json' | 'api'

export interface ColumnMeta {
  name: string
  type: 'string' | 'number' | 'date'
}

export interface DashboardDataSource {
  id: string
  name: string
  type: DataSourceType
  /** Normalized rows — each row is a Record<columnName, value> */
  rows: Record<string, unknown>[]
  columns: ColumnMeta[]
  /** Original CSV string (for re-parse if needed) */
  csvRaw?: string
  /** Original JSON string */
  jsonRaw?: string
  /** API endpoint URL */
  apiUrl?: string
  /** HTTP headers for API requests */
  apiHeaders?: Record<string, string>
  /** Auto-refresh interval in ms (0 = off) */
  refreshInterval?: number
  /** Timestamp of last successful fetch */
  lastFetched?: number
}

// ─── Data Binding ─────────────────────────────────────────────────────────────

export interface DataBinding {
  /** Column name for X axis (categorical) */
  xAxis?: string
  /** Column name(s) for Y axis — array enables multi-series */
  yAxis?: string | string[]
  /** Column name to group series by */
  seriesBy?: string
  /** Column name for value (KPI card, pie/donut, gauge) */
  valueField?: string
  /** Column name for label (pie/donut slices, KPI card label) */
  labelField?: string
  /** Column name for trend value (KPI card) */
  trendField?: string
  /** Column name(s) to show in sparkline (KPI card) */
  sparklineField?: string
  /** Column names to display in data table */
  tableColumns?: string[]
}

// ─── Filter System ────────────────────────────────────────────────────────────

export type FilterOperator = 'eq' | 'neq' | 'contains' | 'gt' | 'lt' | 'between' | 'in'

export interface FilterState {
  id: string
  /** Column name this filter applies to */
  column: string
  operator: FilterOperator
  value: unknown
  /** Secondary value for 'between' operator */
  value2?: unknown
  /** Display label shown in filter bar */
  label?: string
  /** Filter control type */
  controlType: 'dropdown' | 'multiselect' | 'daterange' | 'numberrange' | 'search'
  /** Unique values for dropdown/multiselect (auto-populated from data) */
  options?: string[]
}

// ─── Chart Config ─────────────────────────────────────────────────────────────

export type ValueFormat = 'number' | 'currency' | 'percent'

export interface ChartConfig {
  /** Whether chart is horizontal (bar only) */
  orientation?: 'vertical' | 'horizontal'
  /** Stack series (bar/area) */
  stacked?: boolean
  /** Smooth curves (line/area) */
  smooth?: boolean
  /** Show chart legend */
  showLegend?: boolean
  /** Show gridlines */
  showGrid?: boolean
  /** Custom color palette (hex strings) */
  colors?: string[]
  /** Inner radius % for donut (0–80) */
  cutout?: number
  /** Gauge min value */
  gaugeMin?: number
  /** Gauge max value */
  gaugeMax?: number
}

export interface KPIConfig {
  valueFormat?: ValueFormat
  /** Currency symbol */
  currencySymbol?: string
  /** Bootstrap icon class (e.g. 'bi-graph-up') */
  icon?: string
  iconBg?: string
  iconColor?: string
  accentColor?: string
  /** Whether trend is computed from data or manually set */
  trendMode?: 'auto' | 'manual'
  /** Manual trend override */
  trendDirection?: 'up' | 'down' | 'neutral'
  /** Static label text (overrides labelField binding) */
  staticLabel?: string
}

export interface TableConfig {
  /** Default sort column */
  defaultSortCol?: string
  defaultSortDir?: 'asc' | 'desc'
  /** Rows per page */
  pageSize?: number
  /** Show zebra stripes */
  striped?: boolean
  /** Row height variant */
  density?: 'compact' | 'normal' | 'comfortable'
  /** Show column filter inputs */
  showColumnFilters?: boolean
  /** ID of widget to drill into on row click */
  drillDownTarget?: string
}

// ─── Widget Style ─────────────────────────────────────────────────────────────

export interface WidgetStyle {
  backgroundColor?: string
  borderColor?: string
  borderRadius?: number
  padding?: number
  titleFontSize?: number
  titleColor?: string
  titleAlign?: 'left' | 'center' | 'right'
  showTitle?: boolean
}

// ─── Dashboard Widget ─────────────────────────────────────────────────────────

export interface DashboardWidget {
  id: string
  type: DashboardWidgetType
  title: string
  /** ID of data source — null = use global source */
  dataSourceId: string | null
  dataBinding: DataBinding
  chartConfig: ChartConfig
  kpiConfig?: KPIConfig
  tableConfig?: TableConfig
  /** Per-widget filter conditions (stacked on top of global filters) */
  widgetFilters: FilterState[]
  style: WidgetStyle
  /** ID of chart widget this filter bar controls (filter-bar only) */
  targetWidgets?: string[]
  /** Built-in preview rows shown when no real data source is connected */
  _previewRows?: Record<string, unknown>[]
}

// ─── Dashboard Store State ────────────────────────────────────────────────────

export interface DashboardStoreState {
  widgets: DashboardWidget[]
  dataSources: DashboardDataSource[]
  /** Active global filter values — keyed by FilterState.id */
  globalFilters: FilterState[]
  /** react-grid-layout responsive layouts */
  gridLayouts: Layouts
  selectedWidgetId: string | null
  /** Which right-panel tab is active for selected widget */
  activeRightTab: 'config' | 'data' | 'filters' | 'style'
}

export interface DashboardStoreActions {
  addWidget: (type: DashboardWidgetType, position?: { x: number; y: number; w: number; h: number }) => void
  removeWidget: (id: string) => void
  updateWidget: (id: string, patch: Partial<DashboardWidget>) => void
  duplicateWidget: (id: string) => void
  setSelectedWidget: (id: string | null) => void
  setActiveRightTab: (tab: DashboardStoreState['activeRightTab']) => void
  addDataSource: (source: DashboardDataSource) => void
  updateDataSource: (id: string, patch: Partial<DashboardDataSource>) => void
  removeDataSource: (id: string) => void
  setGlobalFilter: (filter: FilterState) => void
  removeGlobalFilter: (id: string) => void
  clearGlobalFilters: () => void
  updateLayout: (layouts: Layouts) => void
  /** Returns filtered rows for a widget (global + widget filters applied) */
  getWidgetData: (widgetId: string) => Record<string, unknown>[]
  loadTemplate: (template: DashboardTemplate) => void
  reset: () => void
}

export type DashboardStore = DashboardStoreState & DashboardStoreActions

// ─── Dashboard Template ───────────────────────────────────────────────────────

export interface DashboardTemplate {
  id: string
  name: string
  description: string
  thumbnail?: string
  widgets: DashboardWidget[]
  layouts: Layouts
  sampleDataSource: DashboardDataSource
}

// ─── Grid helpers ──────────────────────────────────────────────────────�