# BuilderPro PRD

---

# 🚀 Product Vision

BuilderPro is a modern visual website builder SaaS platform that allows users to create responsive websites visually using drag-and-drop functionality.

The platform focuses on:
- Speed
- Simplicity
- Clean UX
- Responsive editing
- Framework flexibility
- Clean export architecture
- Beginner-friendly workflow
- Developer-friendly output

BuilderPro is NOT intended to clone Elementor or similar builders.

The product must feel:
- Modern
- Lightweight
- Fast
- Professional
- Minimal

---

# 🎯 MVP-1 Goal

Ship a fully functional website builder

The MVP must allow users to:
- Build responsive UIs visually
- Drag & drop elements
- Edit layouts
- Customize styles
- Preview in multiple responsive modes
- Export downloadable code
- Save and reuse projects
- Switch between themes
- Use multiple framework modes

---

# 👥 Target Users

- Freelancers
- Agencies
- Startup founders
- Developers
- Designers
- Students

---

# 🧱 Core Layout Architecture

The builder must follow strict hierarchy:

Section
 └── Row
      └── Column
            └── Element

Rules:
- Elements ONLY inside columns
- Columns ONLY inside rows
- Rows ONLY inside sections
- Invalid nesting must be prevented

---

# 🧩 Builder Modes

BuilderPro must support 4 builder modes:

1. Bootstrap
2. MUI
3. Tailwind
4. Custom

Users must select mode before starting project creation.

---

# 1. Bootstrap Mode

Must follow official Bootstrap standards.

Requirements:
- Use container / row / col structure
- Use Bootstrap responsive breakpoints
- Follow 12-column grid
- Use Bootstrap utility standards

Export:
- Bootstrap-compatible code

---

# 2. MUI Mode

Must follow official Material UI standards.

Requirements:
- Use Grid
- Use Box
- Use Stack
- Use Container
- Use MUI responsive system

Export:
- MUI-compliant structure

---

# 3. Tailwind Mode

Must follow official Tailwind CSS standards.

Requirements:
- Utility-first styling
- Responsive utility classes
- Tailwind spacing system
- Tailwind breakpoint system

Export:
- Tailwind-compatible code

---

# 4. Custom Mode

If user selects Custom mode:

Requirements:
- ALL CSS must be custom
- ALL components must be custom
- No Bootstrap dependency
- No MUI dependency
- No Tailwind utilities

Custom mode acts as:
- BuilderPro native engine

Export:
- Fully custom HTML/CSS

---

# 🎨 UX Philosophy

BuilderPro must NOT clone Elementor UI.

Avoid:
- Large left sidebars
- Overcrowded controls
- Complex editor layouts
- Similar interaction patterns

Use:
- Canvas-first experience
- Floating panels
- Context-based controls
- Modern SaaS UX
- Minimal interface
- Responsive interactions

---

# 🖱 Core MVP-1 Features

---

# 1. Visual UI Builder

Users must be able to:
- Drag & drop elements
- Build layouts visually
- Rearrange elements
- Edit content inline
- Resize sections/columns
- Preview responsive layouts

---

# 2. Responsive Preview Modes

Users must be able to switch instantly between:

- Desktop view
- Tablet/iPad view
- Mobile view

Responsive system must:
- Auto-stack columns
- Prevent overflow
- Maintain spacing consistency

---

# 3. Theme System

Builder must support:
- Light theme
- Dark theme

Requirements:
- Theme toggle
- Proper contrast
- Consistent UI appearance
- Responsive compatibility

Avoid:
- Pure black UI
- Low contrast text

---

# 4. Export & Download

Users must be able to:
- Export HTML
- Export CSS
- Download ZIP package

Export requirements:
- Clean code
- Responsive structure
- Semantic HTML
- Organized CSS

---

# 🧩 Required MVP-1 Elements

The MVP MUST support all basic website building elements.

Each element must:
- Be draggable
- Be editable
- Include placeholder/sample content
- Be responsive
- Support styling controls

---

# 📦 BASIC ELEMENTS

---

## Paragraph / Text

Requirements:
- Inline editing
- Typography controls
- Color controls
- Font family controls
- Responsive behavior

Default content:
Lorem ipsum placeholder paragraph.

Supported styling:
- Font family
- Font size
- Font weight
- Color
- Line height
- Letter spacing
- Alignment
- Margin
- Padding

---

## Heading

Requirements:
- H1–H6 support
- Editable content
- Typography controls

Default content:
"Your Heading Here"

Supported styling:
- Font family
- Font size
- Font weight
- Color
- Alignment
- Letter spacing
- Line height

---

## Button

Requirements:
- Editable text
- Link support
- Border radius
- Hover styling
- Responsive sizing

Default content:
"Click Here"

Supported styling:
- Background color
- Text color
- Padding
- Border radius
- Typography controls

---

## Image

Requirements:
- Drag & drop support
- Replace image functionality
- Responsive sizing
- Object fit controls

Default state:
No-image placeholder illustration

---

## Video

Requirements:
- YouTube/Vimeo support
- Responsive embed
- Placeholder state

Default state:
Video placeholder

---

## Divider

Requirements:
- Adjustable width
- Adjustable thickness
- Adjustable color

---

## Spacer

Requirements:
- Adjustable height
- Responsive spacing

---

## Icon

Requirements:
- Icon picker
- Adjustable size
- Adjustable color

Default:
Placeholder icon

---

# 🧱 LAYOUT ELEMENTS

---

## Section

Requirements:
- Add/remove section
- Background controls
- Padding controls
- Margin controls

---

## Row

Requirements:
- Multiple columns
- Responsive stacking
- Gap controls

---

## Column

Requirements:
- Drag-drop support
- Width controls
- Responsive behavior
- Nested elements

---

# 🧩 ADVANCED ELEMENTS

---

## Navbar

Requirements:
- Logo placeholder
- Navigation items
- Mobile responsive menu

Default menu:
Home / About / Contact

---

## Hero Section

Requirements:
- Heading
- Paragraph
- CTA button
- Background support

Default placeholder content included.

---

## Card

Requirements:
- Image
- Title
- Description
- Button

Default placeholder content included.

---

## Footer

Requirements:
- Links
- Copyright text
- Responsive layout

Default placeholder content included.

---

## Form

Requirements:
- Input fields
- Textarea
- Submit button
- Validation-ready structure

Default sample form included.

---

# 🎨 Styling System

Users must be able to edit:

- Colors
- Typography
- Font family
- Font size
- Font weight
- Alignment
- Margin
- Padding
- Borders
- Border radius
- Width
- Height
- Backgrounds
- Spacing
- Shadows

The system should provide flexibility similar to modern website builders while maintaining clean UX.

---

# 💾 Save System

Without login:
- localStorage save

With login:
- Firestore save

---

# 🔐 Authentication

Supported:
- Google login
- Email/password login

Future support:
- GitHub login
- Facebook login

---

# ⚡ Performance Requirements

- Fast rendering
- Minimal rerenders
- Optimized drag-drop
- Responsive interactions
- Lightweight architecture

---

# 🧠 MVP-2 — KPI Dashboard (IN DEVELOPMENT)

KPI Dashboard is now an active feature being built as a BuilderPro enhancement.
Full specification: `docs/KPI_DASHBOARD_SPEC.md`
Branch: `feature/kpi-dashboard`

---

## 🎯 KPI Dashboard Goal

Extend BuilderPro with a dedicated KPI Dashboard builder that allows users to:
- Design interactive dashboards visually using drag-and-drop
- Load data from CSV, JSON, or API URL
- Visualize data using charts, KPI cards, and data tables
- Apply global and per-widget filters
- Preview dashboards in responsive modes (Desktop / Tablet / Mobile)
- Export dashboard as part of the project

---

## 📦 Chart Library

**Apache ECharts** via `echarts-for-react` (Apache 2.0 — free for commercial use)
**Grid:** `react-grid-layout` (MIT)
**CSV Parser:** `papaparse` (MIT)

---

## 📦 Widget Catalogue

### Chart Widgets
- Bar Chart (vertical + horizontal, stacked)
- Line Chart (smooth, multi-series)
- Area Chart (gradient fill)
- Pie Chart + Donut Chart
- Gauge Chart
- Scatter Chart
- Heatmap

### Display Widgets
- KPI Metric Card (big number + trend arrow + sparkline)
- Data Table (sort, filter, pagination)

### Filter Widgets
- Filter Bar (Dropdown, Multi-select, Date Range, Number Slider, Search)

---

## 🗃 Data Sources

- CSV file upload
- JSON file upload / paste
- API URL (GET + optional headers + auto-refresh)
- Global source (shared across widgets) or per-widget source

---

## 📐 Layout Engine

- 12-column responsive grid (react-grid-layout)
- Drag to move, drag corner to resize
- Breakpoints: Desktop (12 col) / Tablet (6 col) / Mobile (1 col)
- Widget Picker modal (Charts / Display / Filters tabs)

---

## 🎨 Theme & UX

- Inherits active project theme (light/dark) — ECharts theme auto-switches
- Widget quick actions: Configure / Data / Duplicate / Delete
- Keyboard shortcuts consistent with builder (Delete, Ctrl+C/D/V/Z)
- Empty/loading/error states per widget

---

## ➕ Additional Features

- 3 Dashboard Templates (Sales / Marketing / Finance)
- Auto-refresh for API sources (30s / 1min / 5min)
- Chart export as PNG (ECharts native)
- Full dashboard HTML export
- Drill-down: click chart element → filter linked Data Table

---

## 🚫 Still Deferred (DO NOT IMPLEMENT)

- AI generation
- Image-to-layout
- React / Next.js / Vue export
- Collaboration
- Marketplace
- Version history
- Team editing

---

# 🎯 Final MVP Goal

Deliver a stable builder that allows users to:
- Build responsive websites visually
- Customize UI completely
- Preview across devices
- Download clean code
- Use framework-specific modes
- Create modern responsive layouts quickly
---

# 🎨 Inspiration Section (Main / Landing Page)

## Purpose

A public gallery on the marketing landing page (`/`) that showcases BuilderPro's built-in section templates. Visitors can browse, preview, and download any template as clean code in their chosen framework — with zero sign-in required.

## Location

Below the hero on `app/page.tsx`, anchored at `#inspiration` and linked from the marketing header under "Templates".

## Layout

- Section heading: **"Explore Templates"** with a sub-caption explaining framework flexibility
- Category filter pill row: **All / Header / Banner / CTA / Form**
- Responsive grid: **3 columns** desktop → **2 columns** tablet → **1 column** mobile
- Each card contains:
  - SVG thumbnail (full card width, 140 px tall)
  - Animated badge on animated templates
  - Category badge (colored, pill)
  - Template name (bold)
  - Short description (muted, single line)
  - **Download** button (primary color, right-aligned)

## Framework Picker Modal

Triggered by the Download button on any card.

- Centered overlay with backdrop blur
- Header: "Choose a Framework" + template name sub-label
- 4 selectable option tiles: **Bootstrap · MUI · Tailwind · Custom**
  - Each tile shows framework icon + name + brief description
  - Selected tile highlighted with primary border + background
- **Download ZIP** button (disabled until framework chosen)
- **Cancel** button / clicking backdrop closes modal
- On confirm: POST `/api/export` with mock `BuilderStoreState` containing the template section and the chosen mode, format `zip` → trigger browser download

## Download Mechanics

1. Call `materializeTemplate(tpl.section)` to get normalized `{ section, rows, columns, elements }`.
2. Assemble a minimal `BuilderStoreState` with those nodes + `mode = chosenFramework` + minimal `projectMeta`.
3. POST to `/api/export` → receive ZIP blob → trigger `<a download>` click.
4. ZIP contains `index.html` + `styles.css` + `/assets` folder per `EXPORT_RULES.md`.

## Constraints

- No login required — fully public, no Firestore dependency
- Reuses existing `TEMPLATES` array and `materializeTemplate()` from `lib/templates.ts`
- Reuses existing `/api/export` route unchanged
- All 24 templates shown (same set as builder TemplatesPanel)
- Dark/light theme compatible via CSS variables
- Fully responsive at 1440 / 768 / 390 px breakpoints

