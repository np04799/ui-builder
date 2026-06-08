# KPI Dashboard — Feature Specification
# BuilderPro MVP-2

> Enhancement to the existing BuilderPro SaaS app.
> All widgets integrate into the existing left panel (SaaS category), right panel (Properties),
> theme system, keyboard shortcuts, and export pipeline.

---

## 1. Chart Library

**Apache ECharts** via `echarts-for-react` — Apache 2.0, free for commercial use.

```bash
npm install echarts echarts-for-react react-grid-layout papaparse
npm install --save-dev @types/react-grid-layout @types/papaparse
```

---

## 2. Widget Catalogue

### Chart Widgets (ECharts)
| Widget | ECharts type | Key config |
|---|---|---|
| Bar Chart | `bar` | Vertical/Horizontal, Stacked, Colors |
| Line Chart | `line` | Smooth, Multi-series, Markers |
| Area Chart | `line` + areaStyle | Fill opacity, Gradient |
| Pie Chart | `pie` | Label position, Click drill-down |
| Donut Chart | `pie` inner radius | Center label, Inner % |
| Gauge Chart | `gauge` | Min/Max, Threshold colors |
| Scatter | `scatter` | Bubble size, Color by series |
| Heatmap | `heatmap` | Color scale |

### Display Widgets
| Widget | Description |
|---|---|
| KPI Metric Card | Big number + label + trend arrow (▲▼) + sparkline |
| Data Table | Sortable columns, per-column filter, pagination |

### Filter Widgets
| Control | Description |
|---|---|
| Filter Bar | Container widget; holds filter controls |
| Dropdown | Single-select from column unique values |
| Multi-select | Multiple values |
| Date Range | From/To date picker |
| Number Slider | Min/Max range |
| Search | Free-text search |

---

## 3. Data Sources

| Type | Mechanism |
|---|---|
| CSV Upload | File input → PapaParse → rows[] |
| JSON Upload/Paste | File input or textarea → JSON.parse → rows[] |
| API URL | GET fetch + optional headers → rows[] |

Scope: **Global** (shared by all widgets) or **Per-widget** (independent).

Auto-detect column types from first 10 rows: `string | number | date`.

---

## 4. Data Binding

After source loads, user maps columns to:
- X Axis, Y Axis (single or multi-series array), Series, Value, Label

Only relevant fields shown per chart type.
Binding change → chart re-renders live.

---

## 5. Filter System

### Global Filters
Filter Bar widget → controls bound to column names → emit `FilterState[]` → all widgets sharing
global source re-render via `filterEngine`.

### Per-Widget Filters
Right panel "Filters" tab → conditions (column / operator / value) → AND logic.

### Filter Logic
```typescript
type FilterState = { column: string; operator: 'eq'|'contains'|'gt'|'lt'|'between'|'in'; value: unknown }
applyFilters(rows, filters): rows  // pure function in filterEngine.ts
```

### Drill-Down
Click chart element → emits `{ column, value }` as a filter → updates linked Data Table widget.

---

## 6. Dashboard Layout

- **Library:** `react-grid-layout`
- **Grid:** 12 cols, 80px row units
- **Drag:** widget header
- **Resize:** bottom-right handle
- **Min size:** 2 cols × 2 rows
- **Add Widget:** floating "+" → WidgetPickerModal (Charts / Display / Filters tabs)

### Responsive Breakpoints
| Viewport | Cols | Behavior |
|---|---|---|
| Desktop ≥1200px | 12 | Full layout |
| Tablet 768–1199px | 6 | Auto-reflow |
| Mobile <768px | 1 | Stacked |

---

## 7. UX Rules

- Left panel: Elements → SaaS → **Dashboard Widgets** (new subsection)
- Right panel tabs when widget selected: **Config | Data | Filters | Style**
- Widget hover: drag handle + action bar (Configure / Data / Duplicate / Delete)
- Widget selected: blue outline (matches existing builder selection style)
- Title: double-click to edit inline
- Theme: ECharts `'dark'` theme applied automatically when builder dark mode active
- Chart colors: 8-color palette from design tokens (overrideable per widget)
- Empty state: icon + "Connect a data source" CTA per widget

---

## 8. Dashboard Templates

| Template | Widgets |
|---|---|
| Sales Dashboard | 4× KPI Card, Bar Chart, Line Chart, Data Table |
| Marketing Dashboard | 4× KPI Card, Area Chart, Pie Chart, Data Table |
| Finance Dashboard | 4× KPI Card, Area Chart, Bar Chart, Data Table |

Available from existing "Browse Templates" in dashboard canvas empty state.

---

## 9. Export

- **Widget PNG:** right-click → "Export as PNG" (ECharts `getDataURL`)
- **Dashboard HTML:** top bar → "Export Dashboard" → self-contained HTML with ECharts CDN + embedded data
- **Auto-refresh (API):** configurable interval — Off / 30s / 1min / 5min

---

## 10. TypeScript Interfaces

```typescript
// types/dashboard.types.ts

export type WidgetType =
  | 'bar-chart' | 'line-chart' | 'area-chart'
  | 'pie-chart' | 'donut-chart' | 'gauge-chart'
  | 'scatter-chart' | 'heatmap-chart'
  | 'kpi-card' | 'data-table' | 'filter-bar'

export interface DashboardWidget {
  id: string
  type: WidgetType
  title: string
  dataSourceId: string | null
  dataBinding: DataBinding
  chartConfig: ChartConfig
  widgetFilters: FilterState[]
  style: WidgetStyle
}

export interface DataSource {
  id: string
  name: string
  type: 'csv' | 'json' | 'api'
  rawData: Record<string, unknown>[]
  columns: ColumnMeta[]
  apiUrl?: string
  apiHeaders?: Record<string, string>
  refreshInterval?: number
  lastFetched?: number
}

export interface ColumnMeta {
  name: string
  type: 'string' | 'number' | 'date'
}

export interface DataBinding {
  xAxis?: string
  yAxis?: string | string[]
  series?: string
  value?: string
  label?: string
}

export interface FilterState {
  column: string
  operator: 'eq' | 'contains' | 'gt' | 'lt' | 'between' | 'in'
  value: unknown
}

export interface ChartConfig {
  chartType: WidgetType
  orientation?: 'vertical' | 'horizontal'
  stacked?: boolean
  smooth?: boolean
  showLegend?: boolean
  showGrid?: boolean
  colors?: string[]
}

export interface WidgetStyle {
  backgroundColor?: string
  borderRadius?: number
  padding?: number
  titleSize?: number
  titleColor?: string
}
```

---

## 11. Zustand Store

```typescript
// store/dashboardStore.ts
interface DashboardStore {
  widgets: DashboardWidget[]
  dataSources: DataSource[]
  globalFilters: FilterState[]
  gridLayouts: ReactGridLayout.Layouts
  selectedWidgetId: string | null

  addWidget: (type: WidgetType) => void
  removeWidget: (id: string) => void
  updateWidget: (id: string, patch: Partial<DashboardWidget>) => void
  setDataSource: (source: DataSource) => void
  applyGlobalFilter: (filter: FilterState) => void
  clearGlobalFilters: () => void
  updateLayout: (layouts: ReactGridLayout.Layouts) => void
  getWidgetData: (widgetId: string) => Record<string, unknown>[]
}
```

---

*Spec v1.0 — BuilderPro KPI Dashboard*

---

## 11. Post-Sprint Updates (2026-06-08)

### New Widget Types

| Type | Label | Description | Data needed? |
|------|-------|-------------|--------------|
| `text-heading` | Heading | Bold title/label text block | No |
| `dash-image` | Image | URL-backed image or logo | No (`imageUrl` in widget.style) |

Both appear in a **Content** section in `DashboardElementsPanel`.

### Widget Action Buttons

Every widget header now shows (on hover/select): **Filter**, **Expand**, Configure, Data, Duplicate, Delete.

- **Filter** (`bi-funnel`) — opens "filters" tab in right panel
- **Expand** (`bi-arrows-fullscreen`) — opens widget in a fullscreen overlay modal for closer inspection

### Dashboard Preview

- Toolbar **Preview** button routes to `/dashboard-preview` in dashboard mode
- Reads from `localStorage` (`bp-dashboard-store` Zustand persist key)
- Renders read-only grid with widget count in header bar

### Canvas Layout Setting

- `BuilderProjectMeta.canvasLayout: 'flex-flow' | 'fixed-grid'`
- Selectable in Settings panel and onboarding wizard
- Auto-syncs with page type (dashboard → fixed-grid, web → flex-flow)
