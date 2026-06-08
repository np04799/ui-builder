# BuilderPro Architecture

## Core Modules

1. Landing App
2. Builder Engine
3. Export Engine
4. Save System
5. Authentication

---

# Builder Engine

Main responsibilities:
- Render layouts
- Drag-drop
- Element editing
- Responsive preview

---

# Layout Structure

Section
 └── Row
      └── Column
            └── Element

---

# State Management

Use Zustand.

Store:
- Builder JSON
- Selection state
- Responsive mode
- Project metadata

---

# Canvas Components

- Canvas
- SectionRenderer
- RowRenderer
- ColumnRenderer
- ElementRenderer

---

# Elements

Basic:
- Text
- Heading
- Image
- Button
- Divider
- Spacer

Advanced:
- Navbar
- Hero
- Card
- Footer
- Form

---

# Responsive System

Modes:
- Desktop
- Tablet
- Mobile

---

# Export Engine

Convert:
JSON → HTML/CSS

Rules:
- Clean HTML
- Semantic structure
- Minimal wrappers

---

# Save System

Without login:
- localStorage

With login:
- Firestore

---

# Auth

Use Firebase:
- Google login
- Email/password

---

# Deployment

- Vercel

---

# Dashboard Engine (MVP-2)

## New Dependencies

| Package | License | Purpose |
|---|---|---|
| `echarts` + `echarts-for-react` | Apache 2.0 | All chart rendering |
| `react-grid-layout` | MIT | Dashboard drag-resize grid |
| `papaparse` | MIT | CSV parsing |

---

## Dashboard Page Type

A new `type: 'dashboard'` is added to the page schema.
When a page has this type, `BuilderLayout` renders `DashboardCanvas` instead of the
standard Section → Row → Column canvas.

---

## New Modules

```
src/
  components/dashboard/
    DashboardCanvas.tsx          ← react-grid-layout grid wrapper
    WidgetWrapper.tsx            ← drag/resize shell, hover/select states
    WidgetPickerModal.tsx        ← widget catalogue modal
    widgets/
      ChartWidget.tsx            ← universal ECharts wrapper
      KPICardWidget.tsx          ← metric card + sparkline
      DataTableWidget.tsx        ← sortable/filterable table
      FilterBarWidget.tsx        ← global filter container
      EmptyWidgetState.tsx       ← no-data placeholder
    panels/
      DataSourcePanel.tsx        ← CSV / JSON / API loader
      DataBindingPanel.tsx       ← column → axis mapping
      ChartConfigPanel.tsx       ← chart type, colors, legend
      FilterConfigPanel.tsx      ← per-widget filter conditions
      WidgetStylePanel.tsx       ← widget border, padding, title
    templates/
      SalesDashboard.ts
      MarketingDashboard.ts
      FinanceDashboard.ts
  store/
    dashboardStore.ts            ← Zustand: widgets, dataSources, filters, layouts
  types/
    dashboard.types.ts           ← DashboardWidget, DataSource, FilterState, etc.
  utils/
    dataParser.ts                ← CSV/JSON/API → normalized rows[]
    filterEngine.ts              ← apply FilterState[] to rows[]
    chartOptionsBuilder.ts       ← data + config → EChartsOption
```

---

## Dashboard State (Zustand)

```
dashboardStore:
  widgets[]         — all widgets on current dashboard
  dataSources[]     — loaded data sources
  globalFilters[]   — active global filter values
  gridLayouts       — react-grid-layout responsive positions
  selectedWidgetId
```

---

## Integration Points

| Area | How |
|---|---|
| Page type | `type: 'dashboard'` in page schema; canvas switches to DashboardCanvas |
| Left panel | New "Dashboard Widgets" subsection under SaaS category |
| Right panel | Widget selected → tabs: Config / Data / Filters / Style |
| Theme | `useDashboardTheme()` reads project theme → ECharts theme string |
| Export | Dashboard page exports as self-contained HTML with ECharts CDN + embedded data |
| Save | Dashboard state serializes into project JSON (localStorage / Firestore) |
| Shortcuts | Delete, Ctrl+C/D/V/Z wired via existing BuilderLayout shortcut handler |

---

# Framework-Aware System

## Key Files

- `hooks/useFramework.ts` — reads `mode` from `PreviewStateContext` (preview page) or Zustand store (builder). Always calls both hooks for Rules of Hooks compliance.
- `components/builder/layout/FrameworkLoader.tsx` — zero-render component; injects Bootstrap CDN link, Tailwind Play CDN script, or inline MUI CSS into `<head>` based on `mode`. Exports `applyFrameworkCSS(mode)`.
- `components/builder/elements/PreviewStateContext.tsx` — React context holding full serialized `BuilderStoreState` in preview mode only.

## Preview Architecture

`/preview` page reads state from `sessionStorage` (set by Toolbar preview button via `JSON.stringify(useBuilderStore.getState())`). No Zustand store available. Framework CSS and branding CSS vars are applied via `useEffect` from the serialized `state.mode` and `state.projectMeta.branding`.