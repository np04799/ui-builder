# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev              # Start dev server (Next.js, port 3000)
npm run build            # Production build
npm run lint             # ESLint
npx tsc --noEmit         # TypeScript check (no compilation) — run after every change
npm run test:e2e         # Playwright tests (headless)
npm run test:e2e:headed  # Playwright tests (headed)
```

Pre-existing TypeScript errors exist in `tests/e2e/08-panel-drag.spec.ts` — these are acceptable. Any other new errors are not.

## Routes

- `/` — marketing landing page
- `/builder` — full builder app (`BuilderLayout`)
- `/preview` — isolated preview page (no builder chrome, no store access — uses `PreviewStateContext`)
- `/login` — authentication page (not enforced yet)
- `/api/upload` — image upload endpoint
- `/api/auth/login` — auth endpoint

## Architecture

**BuilderPro** is a visual drag-and-drop page builder built on Next.js 16 + React 19 + Zustand + Immer + Tailwind CSS v4.

### State — Zustand + Immer

**`store/builder.store.ts`** is the single source of truth. State is normalized:

```
sections{}  rows{}  columns{}  elements{}
     └─ rowIds[]  └─ columnIds[]  └─ elementIds[]  └─ content + styles
```

Every node has a parent reference (`sectionId` on rows, `rowId` on columns, `columnId` on elements) for O(1) traversal. This normalized shape (`SectionNode → RowNode → ColumnNode → ElementNode`) is defined in `types/store.types.ts`. The export-layer nested tree types (`BuilderSection`, `BuilderRow`, etc.) live in `types/builder.types.ts`.

Key store state:
- `mode: BuilderMode` — `'bootstrap' | 'mui' | 'tailwind' | 'custom'` — drives element rendering and export
- `projectMeta: BuilderProjectMeta | null` — null until wizard completes; holds name, logo, branding, platform
- `responsiveMode: Breakpoint` — `'desktop' | 'tablet' | 'mobile'`
- `selectedId`, `editingId`, `dragState` — transient UI state
- `canvasWidth` — `'100%'` (full) or a px value like `'1200px'`
- `canvasZoom` — canvas zoom transform (1 = 100%)
- `clipboard` — copy/paste payload (element, column, row, or section)
- `_history / _future` — undo/redo stacks (layout snapshots only, not meta)

**`store/theme.store.ts`** — separate store for light/dark theme toggle (toggled via `.dark` class on `<html>`).

**`store/builder.seed.ts`** — seed data for initial canvas state during development.

**`store/builder.selectors.ts`** — derived selectors used by hooks.

### Framework-Aware Rendering

Every element component calls `useFramework()` (`hooks/useFramework.ts`) which reads `store.mode` in the builder or `PreviewStateContext.mode` in the preview page. When mode changes, `FrameworkLoader` (`components/builder/layout/FrameworkLoader.tsx`) injects the appropriate CSS into `<head>`:
- **Bootstrap**: loads `bootstrap@5.3.3` from CDN
- **Tailwind**: loads Tailwind CDN script
- **MUI**: injects a minimal inline MUI-like CSS block (no npm package — canvas preview only)
- **Custom**: no external CSS loaded

Elements render different HTML/class structure per framework:
- **Bootstrap**: standard BS5 utility classes (`btn btn-primary`, `accordion`, `img-fluid`, `ratio ratio-16x9`)
- **MUI**: MUI class names (`MuiTypography-root`, `MuiButton-root`, `MuiAccordion-root`)
- **Tailwind**: Tailwind utility class strings
- **Custom**: React `CSSProperties` with CSS variables (`var(--color-primary)`, `var(--color-border)`, etc.)

**9 Banner elements** (`Banner3D`, `BannerMorph`, `BannerTicker`, `BannerSplit`, `BannerGlass`, `BannerNeon`, `BannerAurora`, `BannerRetro`, `BannerParticle`) are decorative specialty elements — they intentionally skip framework-aware rendering. `SpacerElement` and `HamburgerMenuElement` are also framework-agnostic by design.

### Element System

`components/builder/elements/registry.tsx` maps `ElementContent.type` strings to element components. **43 element types** are registered across two categories:

**Web elements (34):** heading, paragraph, button, image, video, divider, spacer, icon, form, hero, card, navbar, footer, list, ordered-list, checklist, icon-list, tabs, accordion, tooltip, modal, carousel, hamburger-menu, drawer, banner-3d, banner-morph, banner-ticker, banner-split, banner-glass, banner-neon, banner-aurora, banner-retro, banner-particle, (+ 1 for `blockquote`/`link`/`gallery`/`embed`/`map` aliases in the panel that resolve to existing types via `lib/elementDefaults.ts`)

**Chart elements (9):** chart-bar, chart-line, chart-area, chart-pie, chart-donut, chart-radar, chart-polar, chart-scatter, chart-gauge — all use Chart.js via `react-chartjs-2`, wrapped by `components/builder/elements/charts/ChartWrapper.tsx`.

To add a new element:
1. Add its `type` to the `ElementContent` discriminated union in `types/builder.types.ts`
2. Create the element component in `components/builder/elements/`
3. Register it in `registry.tsx`
4. Add default content in `lib/elementDefaults.ts`
5. Create a Props component in `components/builder/properties/element/`
6. Register it in `ElementProperties.tsx`

Element components receive their `content` fields as props plus a `style: React.CSSProperties` (merged base + breakpoint overrides from `ElementRenderer`). They do **not** read from the store directly.

### Elements Panel — Aliases vs True Types

Several panel entries in `ElementsPanel` are UI aliases that resolve to existing element types via `lib/elementDefaults.ts`:
- `link` → `button` (ghost variant)
- `blockquote` → `paragraph`
- `gallery` → `image`
- `embed` → `video`
- `map` → `image`
- `input`, `email`, `textarea`, `select`, `checkbox`, `radio` → `form` (with pre-configured field type)

These are not registered in the registry — they only exist in `elementDefaults.ts` as aliases.

### Rendering Pipeline

```
BuilderLayout
  ├─ BrandingApplicator   (applies projectMeta.branding to CSS vars on <html>)
  ├─ FrameworkLoader      (injects framework CSS/script into <head>)
  ├─ Toolbar
  ├─ LeftSidebar          (Elements | Layers | Templates | Settings tabs)
  ├─ Canvas → SectionRenderer → RowRenderer → ColumnRenderer → ElementRenderer
  ├─ PropertiesPanel      (right sidebar)
  ├─ Breadcrumb           (bottom bar, selected node path)
  ├─ FloatingToolbar      (context-sensitive floating actions)
  └─ ProjectSetupWizard   (full-screen overlay when projectMeta === null)
```

`ElementRenderer` merges `element.styles` with `element.responsive[currentBreakpoint]` then calls `renderElement(content, mergedStyle, id)` from the registry. It wraps the result in `SelectionWrapper` (`components/builder/selection/SelectionWrapper.tsx`) which draws the selection outline and provides resize handles for height/width.

### Properties Panel

`PropertiesPanel` reads `selectedId` from the store and renders:
- `SectionProperties` / `RowProperties` / `ColumnProperties` for layout nodes
- `ElementProperties` → delegates to per-element Props component (e.g. `HeadingProps`, `ButtonProps`)

Props components use the 3-tab pattern: **Presets | Content | Style**. Reusable controls live in `components/builder/controls/` (TextInput, SelectInput, ColorSwatch, SpacingControl, NumberInput, AlignButtonGroup, ResponsiveVisibility, ImageUpload, CustomCSSField, etc.).

### lib/ Utilities

- **`lib/builder.helpers.ts`** — factory functions (`createSection`, `createRow`, `createColumn`, `createElement`) and layout mutation helpers used by store actions
- **`lib/elementDefaults.ts`** — `defaultContentForType(type)` — returns default `ElementContent` for a given type string (including panel aliases)
- **`lib/templates.ts`** — pre-built page templates (full section trees with rows/columns/elements) used by `TemplatesPanel`
- **`lib/utils.ts`** — general utility functions

### BrandingApplicator

`components/builder/layout/BrandingApplicator.tsx` — headless component that watches `projectMeta.branding` and writes CSS custom properties directly onto `document.documentElement`:
- `--color-primary` ← `branding.primaryColor`
- `--color-selected` ← derived `rgba(r,g,b,0.08)` from primary
- `--font-sans` ← resolved font variable (e.g. `var(--font-inter), Inter, sans-serif`)

### Export Engine

`engine/export/builder.export.ts` — converts normalized store state back to the nested `BuilderProject` tree. Framework-specific code generation is a planned feature (currently skeleton).

### CSS Variables

All custom-mode inline styles use CSS variables defined in `app/globals.css`:
- `--color-primary`, `--color-border`, `--color-bg`, `--color-surface`, `--color-canvas-stage`
- `--color-text-primary`, `--color-text-secondary`, `--color-muted`, `--color-selected`

Light/dark variants toggle via `.dark` class on `<html>` (managed by `ThemeProvider` + `theme.store.ts`).

### Font Variables

Six Google Fonts loaded in `app/layout.tsx` as Next.js font variables: `--font-inter`, `--font-roboto`, `--font-playfair`, `--font-montserrat`, `--font-space-grotesk`. A sixth font (Geist) uses Next.js's built-in local font. `BrandingApplicator` maps wizard font selections to these variables via `FONT_VAR_MAP`.

### Project Setup Wizard

`components/builder/wizard/ProjectSetupWizard.tsx` — 6-step modal overlay that gates the canvas until `projectMeta` is set. Steps:

| Step | File | Store action on finish |
|---|---|---|
| 1 — Project Name | `Step1ProjectName.tsx` | `initProject(name, mode)` |
| 2 — Logo Upload | `Step2LogoUpload.tsx` | `setLogo(dataUrl)` |
| 3 — Branding | `Step3Branding.tsx` | `setBranding({ primaryColor, fontFamily })` |
| 4 — UI Framework | `Step4UIFramework.tsx` | included in `initProject` |
| 5 — Target Platform | `Step5Platform.tsx` | `setPlatform(platform)` |
| 6 — Summary | `Step6Summary.tsx` | triggers finish sequence |

`WizardProgress.tsx` renders the numbered step indicator strip. All wizard state is local (`WizardFormState`) until "Start Building" is clicked.

### Key Hooks

- `useFramework()` — returns active `BuilderMode` (store or `PreviewStateContext` in preview)
- `useBuilderSelectors.ts` — memoized store selectors (`useElement`, `useSection`, `useColumn`, `useRow`, `useResponsiveMode`, etc.)
- `useSelectable` — click handler wiring to `selectedId`
- `useInlineEdit` — double-click inline text editing (`editingId` state)
- `useUndoRedo` — Ctrl+Z / Ctrl+Y keyboard shortcut wiring
- `useSelectedNodeType` — determines whether selected node is section/row/column/element

### Stubbed / Planned Features

- **Export code generation** — engine skeleton exists, no output yet
- **Publish** — toolbar button is wired but calls a TODO stub
- **Components / Sections / Pages** panel tabs — show "Coming soon" placeholder
- **Authentication enforcement** — login route exists, not enforced on builder route
- **Persistence** — in-memory only; refresh resets to wizard (localStorage is a future task)
