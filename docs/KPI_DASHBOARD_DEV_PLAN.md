# KPI Dashboard — 2-Day Development Plan
# BuilderPro MVP-2

> Target: ship a fully functional KPI Dashboard feature in 2 working days.
> Strategy: parallelise where possible, cut scope ruthlessly on polish, deliver core value first.
> Branch: `feature/kpi-dashboard` off `dev`

---

## Scope Decision for 2 Days

To ship in 2 days without cutting quality, we ship these chart types only in Day 1–2:
**Bar, Line, Area, Pie/Donut, KPI Card, Data Table, Filter Bar.**
Gauge, Scatter, Heatmap are deferred to a follow-up PR (low user demand for MVP).

Data sources: **CSV + JSON in Day 1, API URL in Day 2.**
Templates: **1 template (Sales Dashboard)** in Day 2. Marketing + Finance deferred.
Export: **Widget PNG only** in Day 2. Full dashboard HTML export deferred.

---

## Pre-Work (Before Day 1 — do this now)

```bash
git checkout dev && git pull
git checkout -b feature/kpi-dashboard

npm install echarts echarts-for-react react-grid-layout papaparse
npm install --save-dev @types/react-grid-layout @types/papaparse
```

Verify build still passes: `npm run build`

---

## DAY 1 — Foundation + Data + Charts

**Target:** Dashboard canvas working, CSV/JSON data loading, Bar/Line/Area/Pie/Donut charts rendering with bound data.

---

### Block 1: Types + Store + Utilities (Morning — ~2h)

#### Task 1.1 — `types/dashboard.types.ts`
Create all interfaces (copy from KPI_DASHBOARD_SPEC.md section 10).
Key types: `WidgetType`, `DashboardWidget`, `DataSource`, `ColumnMeta`, `DataBinding`, `FilterState`, `ChartConfig`, `WidgetStyle`.

#### Task 1.2 — `store/dashboardStore.ts`
Zustand store with all state and actions as per spec section 11.
Include `getWidgetData(widgetId)` selector that applies `globalFilters + widget.widgetFilters` to source data.
Persist to `localStorage` via Zustand `persist` middleware (key: `dashboard-store`).

#### Task 1.3 — `utils/dataParser.ts`
```typescript
parseCSV(file: File): Promise<DataSource>       // PapaParse
parseJSON(input: string | File): Promise<DataSource>
autoDetectColumnTypes(rows: Record<string,unknown>[]): ColumnMeta[]
```
Auto-detect: if all non-null values in a column are numeric → `number`; if parseable as ISO date → `date`; else `string`.

#### Task 1.4 — `utils/filterEngine.ts`
```typescript
applyFilters(rows, filters: FilterState[]): rows
```
Operators: `eq`, `contains`, `gt`, `lt`, `between`, `in`.

#### Task 1.5 — `utils/chartOptionsBuilder.ts`
```typescript
buildChartOption(config: ChartConfig, binding: DataBinding, data: rows[], theme: 'light'|'dark'): EChartsOption
```
Handle: `bar-chart`, `line-chart`, `area-chart`, `pie-chart`, `donut-chart`.
Returns empty option object if data or binding is incomplete (no throw).

---

### Block 2: Page Type Integration (Morning — ~1h)

#### Task 2.1 — Add `type: 'dashboard'` to page schema
In `types/builder.types.ts` (or wherever page type is defined):
```typescript
export type PageType = 'page' | 'dashboard'
```

#### Task 2.2 — Canvas routing
In the component that renders the canvas (likely `BuilderLayout.tsx` or `Canvas.tsx`):
```typescript
if (activePage.type === 'dashboard') return <DashboardCanvas />
```

#### Task 2.3 — "Add Page" modal
Add "Dashboard" option to the page type picker. Use a grid-layout icon. Sets `type: 'dashboard'` on new page.

---

### Block 3: Dashboard Canvas + Widget Shells (Midday — ~3h)

#### Task 3.1 — `components/dashboard/DashboardCanvas.tsx`
- Import `Responsive` from `react-grid-layout` + CSS
- Breakpoints: `{ lg: 1200, md: 768, sm: 0 }`, cols: `{ lg: 12, md: 6, sm: 1 }`
- Render each widget in `dashboardStore.widgets` as `<WidgetWrapper>`
- `onLayoutChange` → `updateLayout(layouts)`
- Floating "+" button (bottom-right, fixed) → opens `WidgetPickerModal`
- Empty state: "Add your first widget" when `widgets.length === 0`

#### Task 3.2 — `components/dashboard/WidgetWrapper.tsx`
Shell component:
- Header: drag handle icon + widget title (double-click to edit) + action icons (⚙ Configure / 🗄 Data / ⧉ Duplicate / 🗑 Delete)
- Body: renders the correct widget component based on `widget.type`
- Hover: show action bar
- Selected (click): blue outline `2px solid var(--bp-primary)` — matches builder style
- `react-grid-layout` resize handle on bottom-right corner

#### Task 3.3 — `components/dashboard/WidgetPickerModal.tsx`
Modal with tabs: **Charts** | **Display** | **Filters**
Grid of cards: icon + widget name. On click → `addWidget(type)` → modal closes.
Charts tab: Bar, Line, Area, Pie, Donut
Display tab: KPI Card, Data Table
Filters tab: Filter Bar

#### Task 3.4 — `components/dashboard/widgets/EmptyWidgetState.tsx`
Shown when `widget.dataSourceId === null` or data is empty.
Content: widget icon (large) + "No data connected" + "Connect Data →" button (opens Data panel).

---

### Block 4: Data Source Panel (Afternoon — ~2h)

#### Task 4.1 — `components/dashboard/panels/DataSourcePanel.tsx`
Tabs: **CSV** | **JSON** | **API** (API tab — stub only today, implement tomorrow)

**CSV tab:**
- Drag-drop zone: `onDrop` → `parseCSV(file)` → store + show preview
- File input fallback
- Preview: first 5 rows in a `<table>`
- "Use this data" button → `setDataSource(parsed)`

**JSON tab:**
- File input + `<textarea>` for paste
- Parse on change → show preview or error ("Expected an array of objects")
- "Use this data" button

#### Task 4.2 — `components/dashboard/panels/DataBindingPanel.tsx`
Props: `widget: DashboardWidget`, `source: DataSource`
- Left: column list with type badges (🔤 string / 🔢 number / 📅 date)
- Right: axis dropdowns (only fields relevant to widget type shown)
  - Bar/Line/Area: X Axis, Y Axis (multi-select), Series
  - Pie/Donut: Label, Value
  - KPI Card: Value, Label, Trend, Sparkline Series
  - Data Table: Columns to show (multi-checkbox)
- On change → `updateWidget(id, { dataBinding: newBinding })`

#### Task 4.3 — Wire panels into right panel
When a dashboard widget is selected, right panel renders tabs:
**Config | Data | Filters | Style**
- "Data" tab → `<DataSourcePanel>` + `<DataBindingPanel>`
- Other tabs → stubs for today (implement tomorrow)

---

### Block 5: Chart Widgets (Afternoon/Evening — ~3h)

#### Task 5.1 — `components/dashboard/widgets/ChartWidget.tsx`
Universal chart wrapper:
```typescript
// reads widget from store, calls buildChartOption, renders ReactECharts
// handles loading (skeleton), empty (EmptyWidgetState), error states
// auto dark/light theme via useDashboardTheme() hook
```

#### Task 5.2 — Bar Chart support in `chartOptionsBuilder`
Vertical + horizontal (config.orientation).
Stacked (config.stacked).
X axis from `binding.xAxis`, Y axis from `binding.yAxis`.
Colors from `config.colors || DEFAULT_PALETTE`.

#### Task 5.3 — Line + Area Chart support
Smooth line (config.smooth).
Multi-series: if `binding.yAxis` is array → one series per column.
Area: same as line + `areaStyle: { opacity: 0.3 }`.
Gradient fill for area.

#### Task 5.4 — Pie + Donut Chart support
Pie: `radius: '60%'`, label outside.
Donut: `radius: ['40%', '65%']`, center label shows total.
Click event → emit `{ column: binding.label, value: clickedName }` for drill-down.

---

### Day 1 End Checklist
- [ ] `npm run build` passes, 0 TS errors
- [ ] Can create a Dashboard page type
- [ ] Dashboard canvas renders, widgets draggable + resizable
- [ ] Widget Picker opens, can add widget shells
- [ ] Upload CSV → preview table shows
- [ ] Paste JSON → preview table shows
- [ ] Bind columns → Bar/Line/Area/Pie/Donut charts render with data
- [ ] Charts switch theme with builder dark mode toggle
- [ ] Empty widget state shows when no data bound

---

## DAY 2 — KPI Card + Table + Filters + Polish + Templates + Export

**Target:** KPI Card, Data Table, Filter system, API source, Sales template, widget PNG export, full responsive QA, 0 build errors, deploy-ready.

---

### Block 6: KPI Card + Data Table (Morning — ~3h)

#### Task 6.1 — `components/dashboard/widgets/KPICardWidget.tsx`
Layout (top-to-bottom):
```
[ Icon (Bootstrap Icon, optional) ]
[ Label  — binding.label column or static text ]
[ Big Number — binding.value column, auto-format K/M/B ]
[ Trend row — ▲ +12.4% (green) | ▼ -3.1% (red) | — 0% (gray) ]
[ Sparkline — mini ReactECharts line chart from binding.sparklineSeries ]
```
Format rules:
- ≥1,000,000 → "1.2M"
- ≥1,000 → "12.4K"
- Percentage format if `config.valueFormat === 'percent'`
- Currency prefix if `config.valueFormat === 'currency'`

Trend: computed from `binding.trend` column value — positive number → green ▲, negative → red ▼, zero → gray —.

Config options (right panel Config tab):
- Value column, Label text, Trend column, Sparkline series column
- Value format: number / currency / percentage
- Icon picker (Bootstrap Icons)
- Accent color (used for sparkline + icon)

#### Task 6.2 — `components/dashboard/widgets/DataTableWidget.tsx`
State: `sortCol`, `sortDir`, `columnFilters: Record<string,string>`, `page`, `pageSize`

Render:
```
[ Column filter inputs row (toggleable via 🔍 button) ]
[ <thead> — column names, click to sort (▲▼ indicators) ]
[ <tbody> — filtered + sorted + paginated rows ]
[ Pagination row — ← 1 2 3 → + rows per page selector ]
```

Filter: per-column text input → filters rows where column `.toString().toLowerCase().includes(filterValue)`.
Sort: click header → toggle asc/desc.
Pagination: 10/25/50/All.
Responsive: `overflow-x: auto` wrapper on mobile.
Dark mode: table `--bs-table-*` vars or custom CSS vars.

#### Task 6.3 — `components/dashboard/panels/ChartConfigPanel.tsx`
Right panel "Config" tab:
- Chart type switcher (icon buttons — only shown if type is a chart)
- Orientation toggle (bar only)
- Smooth toggle (line only)
- Stack toggle
- Show/hide legend checkbox
- Show/hide grid lines checkbox
- Color palette (8 swatches, each clickable → color picker)
- Widget title input

For KPI Card config — render KPI-specific fields (value format, icon picker, accent color).
For Data Table config — render: default sort column, rows per page, striped toggle, compact/normal/spacious.

---

### Block 7: Filter System (Midday — ~2.5h)

#### Task 7.1 — `components/dashboard/widgets/FilterBarWidget.tsx`
Container widget rendered on grid.
Header: "Filters" label + "+ Add Filter" button → dropdown: Dropdown | Multi-select | Date Range | Number Range | Search.
Each added filter control:
- Bound to a column name (dropdown of global source columns)
- Renders the appropriate control
- On value change → `applyGlobalFilter({ column, operator, value })`

**Dropdown filter:** `<select>` populated from unique column values.
**Multi-select filter:** checkboxes in a popover.
**Date Range:** two `<input type="date">` fields → `{ operator: 'between', value: [from, to] }`.
**Number Range:** two number inputs.
**Search:** text input → `{ operator: 'contains', value: text }`.

#### Task 7.2 — `components/dashboard/panels/FilterConfigPanel.tsx`
Right panel "Filters" tab (per-widget conditions):
- "+ Add Condition" button
- Each row: Column dropdown | Operator dropdown | Value input
- Delete row button
- "Clear All" button
- On change → `updateWidget(id, { widgetFilters: [...] })`

#### Task 7.3 — Wire `getWidgetData` in store
```typescript
getWidgetData(widgetId: string): Record<string, unknown>[] {
  const widget = widgets.find(w => w.id === widgetId)
  const source = widget.dataSourceId
    ? dataSources.find(d => d.id === widget.dataSourceId)
    : dataSources.find(d => d.id === 'global')
  if (!source) return []
  const afterGlobal = applyFilters(source.rawData, globalFilters)
  return applyFilters(afterGlobal, widget.widgetFilters)
}
```
All widgets call this selector. Zustand subscriptions trigger re-render on filter change.

#### Task 7.4 — Drill-Down
In `ChartWidget.tsx`: on ECharts `'click'` event:
```typescript
if (widget.chartConfig.drillDownTarget) {
  applyGlobalFilter({ column: binding.label, operator: 'eq', value: params.name })
}
```
In ChartConfigPanel: "Drill-down target" dropdown (select a Data Table widget on this dashboard).

---

### Block 8: API Source + Auto-Refresh (Midday — ~1h)

#### Task 8.1 — Complete API tab in `DataSourcePanel.tsx`
- URL input
- "+ Add Header" rows (key/value)
- "Fetch" button → loading spinner → preview on success → error message on failure
- Auto-refresh interval selector (Off / 30s / 1min / 5min) → stored in `source.refreshInterval`

#### Task 8.2 — Auto-refresh in `DashboardCanvas.tsx`
```typescript
useEffect(() => {
  const apiSources = dataSources.filter(s => s.type === 'api' && s.refreshInterval)
  const intervals = apiSources.map(s =>
    setInterval(() => fetchAPISource(s), s.refreshInterval)
  )
  return () => intervals.forEach(clearInterval)
}, [dataSources])
```
Show last-refreshed timestamp in widget header for API-sourced widgets.

---

### Block 9: Sales Dashboard Template (Afternoon — ~1h)

#### Task 9.1 — `components/dashboard/templates/SalesDashboard.ts`
Export a function `getSalesDashboardTemplate(): { widgets: DashboardWidget[], layouts: Layouts, dataSource: DataSource }`
Widgets:
- 4× KPI Cards (Revenue $124K, Orders 1,842, Conversion 3.2%, Avg Order $67)
- Bar Chart: Monthly Sales (12 months sample data)
- Line Chart: Revenue Trend (same data)
- Data Table: Top Products (name, revenue, units, growth)

All widgets include sample data embedded in the DataSource so template works without uploading anything.

#### Task 9.2 — Register in Templates panel
In existing `Templates` component — add "Dashboard Templates" tab.
On click "Sales Dashboard" → load template into `dashboardStore`.

---

### Block 10: Export + Responsive QA + Polish (Afternoon — ~2h)

#### Task 10.1 — Widget PNG Export
Right-click `WidgetWrapper` → context menu → "Export as PNG".
```typescript
const instance = echartsRef.current?.getEchartsInstance()
const url = instance.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' })
// trigger download via <a> element
```
For KPI Card and Data Table — use `html2canvas` (already check if in node_modules) or skip and show "Chart widgets only" tooltip.

#### Task 10.2 — Responsive preview in Dashboard mode
Ensure the existing responsive preview toggle (Desktop/Tablet/Mobile) in the top bar works for Dashboard pages:
- Reads active breakpoint → passes to `react-grid-layout` as `width` prop
- Mobile: widgets stack vertically

#### Task 10.3 — Style panel `WidgetStylePanel.tsx`
Right panel "Style" tab:
- Widget background color (color picker, default transparent)
- Border radius slider (0–16px)
- Padding slider (0–32px)
- Title font size
- Title color
- Title alignment

#### Task 10.4 — Dark mode QA pass
Toggle dark mode — check all widgets:
- ECharts charts: dark theme applied
- KPI Card: text colors correct
- Data Table: border and row colors correct
- Filter Bar: inputs styled correctly
Fix any color token mismatches.

#### Task 10.5 — Keyboard shortcuts
In existing `BuilderLayout.tsx` shortcut handler, add dashboard-mode branch:
- `Delete` → `removeWidget(selectedWidgetId)`
- `Ctrl+D` → duplicate selected widget (copy config + binding, new id, offset position by 1 row)
- `Escape` → `setSelectedWidgetId(null)`
- `Ctrl+Z` → undo last add/remove (simple stack in dashboardStore)

---

### Block 11: Final QA + Build (Evening — ~1h)

#### Task 11.1 — End-to-end test
1. Create new Dashboard page
2. Upload CSV with 50 rows
3. Add Bar Chart → bind columns → chart renders
4. Add Line Chart → bind columns → chart renders
5. Add KPI Card → bind value column → big number shows
6. Add Data Table → sort, filter, paginate — all work
7. Add Filter Bar → add dropdown filter → change value → charts update
8. Toggle dark mode → all widgets look correct
9. Switch responsive mode Desktop/Tablet/Mobile → grid reflows
10. Right-click chart → Export PNG → file downloads
11. Keyboard Delete on selected widget → widget removed
12. Ctrl+D on widget → duplicate appears

#### Task 11.2 — TypeScript + Build
```bash
npm run type-check    # must be 0 errors
npm run build         # must succeed
```
Fix all errors before declaring done.

#### Task 11.3 — Commit + PR
```bash
git add -A
git commit -m "feat: KPI Dashboard — charts, data sources, filters, KPI card, data table"
git push origin feature/kpi-dashboard
# Open PR → dev  (Nitesh reviews before merge)
```

---

## Day 2 End Checklist
- [ ] KPI Card renders: big number + trend arrow + sparkline
- [ ] Data Table: sort, per-column filter, pagination all work
- [ ] Filter Bar widget: dropdown, date range, search controls work
- [ ] Global filter updates all charts in real time
- [ ] Per-widget filter works independently
- [ ] API URL data source fetches and previews
- [ ] Auto-refresh fires on interval
- [ ] Sales Dashboard template loads with sample data
- [ ] Widget PNG export works on chart widgets
- [ ] Responsive: Desktop/Tablet/Mobile grid reflows correctly
- [ ] Dark mode: all widgets pass visual check
- [ ] Keyboard shortcuts: Delete, Ctrl+D, Escape work
- [ ] `npm run type-check` → 0 errors
- [ ] `npm run build` → success
- [ ] PR raised to `dev`

---

## File Creation Order (strict — follow this sequence)

```
Day 1:
1. types/dashboard.types.ts
2. utils/dataParser.ts
3. utils/filterEngine.ts
4. utils/chartOptionsBuilder.ts
5. store/dashboardStore.ts
6. Page type integration (builder.types.ts + Canvas/BuilderLayout routing)
7. components/dashboard/widgets/EmptyWidgetState.tsx
8. components/dashboard/WidgetWrapper.tsx
9. components/dashboard/WidgetPickerModal.tsx
10. components/dashboard/DashboardCanvas.tsx
11. components/dashboard/panels/DataSourcePanel.tsx  (CSV + JSON tabs)
12. components/dashboard/panels/DataBindingPanel.tsx
13. components/dashboard/widgets/ChartWidget.tsx
14. Wire right panel tabs (Config/Data/Filters/Style stubs)

Day 2:
15. components/dashboard/widgets/KPICardWidget.tsx
16. components/dashboard/widgets/DataTableWidget.tsx
17. components/dashboard/panels/ChartConfigPanel.tsx
18. components/dashboard/widgets/FilterBarWidget.tsx
19. components/dashboard/panels/FilterConfigPanel.tsx
20. API tab in DataSourcePanel.tsx
21. Auto-refresh in DashboardCanvas.tsx
22. components/dashboard/panels/WidgetStylePanel.tsx
23. components/dashboard/templates/SalesDashboard.ts
24. PNG export in WidgetWrapper.tsx
25. Keyboard shortcuts in BuilderLayout.tsx
26. Full QA + build fix
```

---

## Deferred to Follow-up PR (post 2-day sprint)

- Gauge Chart, Scatter Chart, Heatmap
- Marketing + Finance dashboard templates
- Full dashboard HTML export
- Drill-down drill-back (undo filter on second click)
- PDF export
- Column conditional formatting (row highlight rules in Data Table)

---

*Development Plan v2.0 — 2-Day Sprint — BuilderPro KPI Dashboard*
