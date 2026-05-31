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

# Framework-Aware System

## Key Files

- `hooks/useFramework.ts` — reads `mode` from `PreviewStateContext` (preview page) or Zustand store (builder). Always calls both hooks for Rules of Hooks compliance.
- `components/builder/layout/FrameworkLoader.tsx` — zero-render component; injects Bootstrap CDN link, Tailwind Play CDN script, or inline MUI CSS into `<head>` based on `mode`. Exports `applyFrameworkCSS(mode)`.
- `components/builder/elements/PreviewStateContext.tsx` — React context holding full serialized `BuilderStoreState` in preview mode only.

## Preview Architecture

`/preview` page reads state from `sessionStorage` (set by Toolbar preview button via `JSON.stringify(useBuilderStore.getState())`). No Zustand store available. Framework CSS and branding CSS vars are applied via `useEffect` from the serialized `state.mode` and `state.projectMeta.branding`.