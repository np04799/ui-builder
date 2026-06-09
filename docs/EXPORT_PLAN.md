# 🚀 BuilderPro Export Engine — Implementation Plan

---

# 📌 OVERVIEW

This document is the developer implementation reference for the BuilderPro export engine.
It covers the export modal UX, code generation logic per framework, version management, premium gating, and extra features.

For rules and constraints, see `EXPORT_RULES.md` and `CONSTRAINTS.md`.

---

# 🗺 EXPORT MODAL — UX FLOW

```
User clicks "Export" button in builder toolbar
         ↓
Export Modal opens
         ↓
Step 1 — Choose Output Format
  ┌─────────────────────────────────────────────────────┐
  │  [ HTML / CSS ]  [ React ]  [ Vue ]  [ Angular ]   │
  │                                                     │
  │  Framework detected: Bootstrap 5.3.3  (badge)       │
  └─────────────────────────────────────────────────────┘
  → HTML/CSS: skip to Step 4
  → React / Vue / Angular:
         ↓
Step 2 — Component Generation
  "Generate reusable components?"
  [ Yes — one component per Section ]  [ No — single file ]
         ↓
Step 3 — Language + Component Names (if Yes selected)
  [ TypeScript ]  [ JavaScript ]
  ─────────────────────────────
  Section names (editable):
    Section 1 → [ HeroSection     ]
    Section 2 → [ FeaturesSection ]
    Section 3 → [ Footer          ]
  ─────────────────────────────
         ↓
Step 4 — Preview + Download
  ┌───────────────────────────────────────────────────┐
  │  Code Preview (syntax-highlighted, tabbed)        │
  │  Tabs: App.tsx | HeroSection.tsx | package.json   │
  │  [ Copy ]                                         │
  ├───────────────────────────────────────────────────┤
  │  [ ⬇ Download ZIP ]   [ ⚡ Open in StackBlitz ]   │
  └───────────────────────────────────────────────────┘
```

---

# 🏗 CODE GENERATION ARCHITECTURE

## Engine Location
`engine/exportEngine.ts` (existing) — extend with new targets

## New Files to Create
```
engine/
  exportEngine.ts          ← existing, extend
  generators/
    htmlGenerator.ts        ← existing
    reactGenerator.ts       ← new
    vueGenerator.ts         ← new
    angularGenerator.ts     ← new
  templates/
    react/
      packageJson.ts        ← generates package.json content
      viteConfig.ts
      tsConfig.ts
      readme.ts
    vue/
      packageJson.ts
      viteConfig.ts
      tsConfig.ts
      readme.ts
    angular/
      angularJson.ts
      packageJson.ts
      tsConfig.ts
      readme.ts
  tokens/
    tokensGenerator.ts      ← generates tokens.ts / tokens.scss / tokens.css
  versionRegistry.ts        ← npm version lookup + caching
```

---

# ⚙️ PER-FRAMEWORK GENERATION LOGIC

---

## React Generator (`reactGenerator.ts`)

Input: `BuilderStoreState` (sections, rows, columns, elements, mode, projectMeta)

### Bootstrap mode
```tsx
// SectionOne.tsx
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SectionOne() {
  return (
    <section style={{ padding: '64px 0' }}>
      <Container>
        <Row>
          <Col md={6}>
            <h1>Your Heading Here</h1>
            <p>Lorem ipsum...</p>
            <button className="btn btn-primary">Click Here</button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
```

### MUI mode
```tsx
// SectionOne.tsx
import { Container, Grid, Typography, Button, Box } from '@mui/material';

export default function SectionOne() {
  return (
    <Box component="section" sx={{ py: 8 }}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h1">Your Heading Here</Typography>
            <Typography variant="body1">Lorem ipsum...</Typography>
            <Button variant="contained">Click Here</Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
```

### Tailwind mode
```tsx
// SectionOne.tsx
export default function SectionOne() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4">
            <h1 className="text-4xl font-bold text-gray-900">Your Heading Here</h1>
            <p className="mt-4 text-gray-600">Lorem ipsum...</p>
            <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg">
              Click Here
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### App.tsx (all modes)
```tsx
import SectionOne from './components/SectionOne';
import SectionTwo from './components/SectionTwo';
// ... ThemeProvider for MUI mode

export default function App() {
  return (
    <>
      <SectionOne />
      <SectionTwo />
    </>
  );
}
```

---

## Vue Generator (`vueGenerator.ts`)

### Bootstrap mode
```vue
<!-- SectionOne.vue -->
<template>
  <section style="padding: 64px 0">
    <BContainer>
      <BRow>
        <BCol md="6">
          <h1>Your Heading Here</h1>
          <p>Lorem ipsum...</p>
          <BButton variant="primary">Click Here</BButton>
        </BCol>
      </BRow>
    </BContainer>
  </section>
</template>

<script setup lang="ts">
import { BContainer, BRow, BCol, BButton } from 'bootstrap-vue-next';
</script>

<style scoped>
/* component-specific overrides */
</style>
```

### MUI mode (Vuetify 3)
```vue
<!-- SectionOne.vue -->
<template>
  <section class="py-16">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <h1 class="text-h3 font-weight-bold">Your Heading Here</h1>
          <p class="mt-4">Lorem ipsum...</p>
          <v-btn color="primary" class="mt-6">Click Here</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
// Vuetify components are auto-imported via vuetify plugin
</script>
```

### Tailwind mode
```vue
<!-- SectionOne.vue -->
<template>
  <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap -mx-4">
        <div class="w-full md:w-1/2 px-4">
          <h1 class="text-4xl font-bold text-gray-900">Your Heading Here</h1>
          <p class="mt-4 text-gray-600">Lorem ipsum...</p>
          <button class="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg">
            Click Here
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No imports needed for Tailwind
</script>
```

---

## Angular Generator (`angularGenerator.ts`)

### Component file set (per section)
```
section-one.component.ts
section-one.component.html
section-one.component.scss
```

### Bootstrap mode
```typescript
// section-one.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-one',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-one.component.html',
  styleUrls: ['./section-one.component.scss']
})
export class SectionOneComponent {}
```

```html
<!-- section-one.component.html -->
<section class="py-5">
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1>Your Heading Here</h1>
        <p>Lorem ipsum...</p>
        <button class="btn btn-primary">Click Here</button>
      </div>
    </div>
  </div>
</section>
```

### MUI mode (Angular Material)
```typescript
// section-one.component.ts
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
```

```html
<!-- section-one.component.html -->
<section class="section-wrapper">
  <div class="container">
    <mat-grid-list cols="12" rowHeight="fit">
      <mat-grid-tile colspan="6">
        <h1>Your Heading Here</h1>
        <p>Lorem ipsum...</p>
        <button mat-raised-button color="primary">Click Here</button>
      </mat-grid-tile>
    </mat-grid-list>
  </div>
</section>
```

### Tailwind mode
```html
<!-- section-one.component.html -->
<section class="py-16">
  <div class="container mx-auto px-4">
    <div class="flex flex-wrap -mx-4">
      <div class="w-full md:w-1/2 px-4">
        <h1 class="text-4xl font-bold text-gray-900">Your Heading Here</h1>
        <p class="mt-4 text-gray-600">Lorem ipsum...</p>
        <button class="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg">
          Click Here
        </button>
      </div>
    </div>
  </div>
</section>
```

---

# 🔖 VERSION MANAGEMENT IMPLEMENTATION

## `versionRegistry.ts`

```typescript
// Fetch latest stable version from npm registry
async function getLatestStable(packageName: string): Promise<string> {
  const res = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
  const data = await res.json();
  return data.version; // exact, e.g. "5.3.3"
}

// Cache results — only re-fetch on project open, not on every keystroke
const VERSION_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
```

## Packages to version-check per mode

| Builder Mode | Packages |
|---|---|
| Bootstrap | `bootstrap` |
| MUI | `@mui/material`, `@emotion/react`, `@emotion/styled` |
| Tailwind | `tailwindcss`, `autoprefixer`, `postcss` |
| React output | `react`, `react-dom`, `vite` |
| Vue output | `vue`, `vite` |
| Angular output | `@angular/core`, `@angular/cli`, `@angular/material` (if MUI mode) |

## Project Metadata Schema (addition)
```typescript
projectMeta: {
  // ... existing fields ...
  frameworkVersion: string;       // e.g. "5.3.3" for Bootstrap
  frameworkVersionCheckedAt: number; // timestamp
}
```

## Onboarding Wizard — Version Display
- Step 3 (framework selection): show detected version below framework card
  - "Bootstrap 5.3.3 (latest stable) ✓"
- If detection fails (offline): show "Version: latest" with a warning icon

---

# 🎁 EXTRA FEATURES — IMPLEMENTATION NOTES

## Code Preview
- Use `react-syntax-highlighter` or `highlight.js` in the export modal
- Tabs: primary component file, App file, package.json
- 300px tall scrollable code area
- "Copy all" button uses `navigator.clipboard.writeText()`

## Open in StackBlitz
- Use StackBlitz SDK: `@stackblitz/sdk`
- `sdk.openProject(project, { newWindow: true })`
- Build `StackBlitzProject` object from generated file map before zipping
- React and Vue: full support
- Angular: link to `https://stackblitz.com/fork/angular` with a note to copy files

## Design Tokens File
Generate from `BuilderStoreState` design tokens:
```typescript
// tokens.ts (React/Vue)
export const tokens = {
  colorPrimary: '#4F46E5',
  colorSecondary: '#06B6D4',
  colorAccent: '#22C55E',
  colorDanger: '#EF4444',
  fontPrimary: 'Inter, sans-serif',
  spacingBase: '8px',
  radiusSmall: '4px',
  radiusMedium: '8px',
  breakpointTablet: '768px',
  breakpointMobile: '390px',
} as const;
```

## Export History
- Store in `localStorage` (key: `builderpro_export_history_[projectId]`)
- Max 3 entries, FIFO
- Schema: `{ type, mode, lang, date, projectName }`
- Render in project dashboard card

## Section-Level Export
- Add "Export this section" to Section context menu (right-click or ⋮ menu)
- Reuses same generator with `sections = [selectedSection]`
- ZIP is identical structure but contains only one component

---

# 📋 README.md TEMPLATE

```markdown
# {ProjectName}

Built with [BuilderPro](https://ui-builder-orpin.vercel.app)

## Framework
{FrameworkMode} | {OutputTarget} | {Language}
Version: {FrameworkVersion}

## Prerequisites
- Node.js 18+
- npm 9+

## Getting Started

### Install dependencies
npm install

### Start development server
npm run dev

### Build for production
npm run build

## Project Structure
src/
  components/
    {ComponentName}.{ext}   — {SectionDescription}
  App.{ext}                 — Root component
  main.{ext}                — Entry point
  tokens.{ext}              — Design tokens

## Design Tokens
Primary color: {primaryColor}
Secondary color: {secondaryColor}
Font: {fontFamily}

## Components
{ComponentList}

---
Built with BuilderPro — https://ui-builder-orpin.vercel.app
```

---

# 💳 PREMIUM GATING — IMPLEMENTATION

## Approach
- Show all 4 output format buttons in the export modal to all users
- HTML/CSS always clickable
- React / Vue / Angular buttons: show a "Pro" badge
- On click by free user → show upgrade modal (do not start generation)
- On click by paid user → proceed normally

## UI
```
[ HTML/CSS ]   [ React 🔒 Pro ]   [ Vue 🔒 Pro ]   [ Angular 🔒 Pro ]
```
Free users see the options and understand the value before seeing the wall.

## Auth Check
```typescript
const isPremium = user?.plan === 'pro' || user?.plan === 'team';
if (!isPremium && outputTarget !== 'html') {
  openUpgradeModal();
  return;
}
```

---

# 🔗 RELATED DOCS

- `EXPORT_RULES.md` — output rules, ZIP structures, framework matrix
- `CONSTRAINTS.md` — builder mode constraints + export target constraints
- `PRD.md` — product requirements, export section, premium model
- `ARCHITECTURE.md` — export engine location and module overview
