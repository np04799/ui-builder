# 🎁 Export Enhancement Features — Implementation Plan

---

# 📌 OVERVIEW

This document is the developer implementation guide for all 8 extra export features in BuilderPro MVP.
Each feature has: scope, UI spec, data flow, file locations, edge cases, and dependencies.

Related docs: `EXPORT_RULES.md`, `EXPORT_PLAN.md`, `PRD.md`

---

# FEATURE 1 — Live Code Preview

## What It Does
Shows syntax-highlighted generated code inside the export modal before the user downloads.

## UI Spec
```
┌─────────────────────────────────────────────────────────┐
│  Code Preview                              [ Copy All ] │
├──────────┬─────────────┬─────────────────────────────── │
│ App.tsx  │ HeroSection │ package.json                   │
├──────────┴─────────────┴─────────────────────────────── │
│                                                         │
│  import { Container } from 'react-bootstrap';           │
│  ...                                                    │
│  (scrollable, 300px tall)                               │
└─────────────────────────────────────────────────────────┘
```

## Implementation

### Library
Use `highlight.js` (lighter than `react-syntax-highlighter`, no extra React dependency needed)
CDN: `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js`

### Files to Create/Edit
- `components/ExportModal/CodePreview.tsx` — new component
- `components/ExportModal/ExportModal.tsx` — render `<CodePreview>` in Step 4
- `engine/generators/*.ts` — generators must return `{ filename, content }[]` (file map), not raw string

### Data Flow
```
User reaches Step 4
      ↓
exportEngine.generate(state, { target, mode, lang, componentNames })
      ↓
Returns FileMap: { [filename]: string }
      ↓
CodePreview receives FileMap
      ↓
Renders tabs (first 3 files) + highlighted content
      ↓
"Copy" click → navigator.clipboard.writeText(activeFileContent)
```

### Live Updates
- Re-generate preview when: component name changes (Step 3), language toggle changes
- Debounce re-generation by 300ms to avoid lag during typing

### Edge Cases
- HTML/CSS export: show `index.html` and `styles.css` tabs (available to all users)
- If generation fails: show "Preview unavailable" with error message, Download still works
- Very long files: cap preview at 500 lines, show "Showing first 500 lines" notice

---

# FEATURE 2 — Auto-generated README

## What It Does
Every ZIP export includes a `README.md` with full project setup instructions.

## README Template (variable-substituted at generation time)

```markdown
# {ProjectName}

> Built with [BuilderPro](https://ui-builder-orpin.vercel.app)

## Stack
- Framework: {FrameworkMode} ({FrameworkVersion})
- Output: {OutputTarget}
- Language: {Language}

## Prerequisites
- Node.js 18 or higher
- npm 9 or higher

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## Project Structure

\`\`\`
src/
  components/
{ComponentList}
  App.{ext}     — Root component, imports all sections
  main.{ext}    — Application entry point
  tokens.{ext}  — Design tokens (colors, spacing, typography)
\`\`\`

## Components

{ComponentDescriptions}

## Design Tokens

| Token | Value |
|---|---|
| Primary Color | {colorPrimary} |
| Secondary Color | {colorSecondary} |
| Font | {fontPrimary} |
| Base Spacing | {spacingBase} |

## Notes

- This project was exported from BuilderPro on {ExportDate}
- Framework version locked at export time: {FrameworkVersion}
- To update dependencies, change exact versions in package.json and run \`npm install\`

---
Built with **BuilderPro** — https://ui-builder-orpin.vercel.app
```

## Implementation

### File to Create
`engine/generators/readmeGenerator.ts`

### Function Signature
```typescript
export function generateReadme(params: {
  projectName: string;
  frameworkMode: 'bootstrap' | 'mui' | 'tailwind' | 'custom';
  frameworkVersion: string;
  outputTarget: 'html' | 'react' | 'vue' | 'angular';
  language: 'typescript' | 'javascript';
  componentNames: string[];      // ordered list of section component names
  tokens: DesignTokens;
  exportDate: string;            // ISO date string
}): string
```

### Included In
- All export types: HTML/CSS, React, Vue, Angular
- Always the last file added to the ZIP

### Edge Cases
- If project has no name: default to "BuilderPro Export"
- If framework version unknown: write "latest" with a note
- Component list: if > 10 components, list first 10 then "+ N more"

---

# FEATURE 3 — Component Naming

## What It Does
Users rename Section components before export. Names become filenames and function names.

## UI Spec (Step 3 of export modal)

```
┌───────────────────────────────────────────────────────┐
│  Name your components                                 │
│                                                       │
│  Section 1   [ HeroSection          ] ✓              │
│  Section 2   [ FeaturesSection      ] ✓              │
│  Section 3   [ testimonials-section ] ✗ Invalid      │
│  Section 4   [ Footer               ] ✓              │
│                                                       │
│  Names must be PascalCase (React/Vue)                 │
│  Angular: auto-converted to kebab-case in filenames   │
└───────────────────────────────────────────────────────┘
```

## Validation Rules

| Output | Name Format | Filename | Example |
|---|---|---|---|
| React | PascalCase | `{Name}.tsx` | `HeroSection.tsx` |
| Vue | PascalCase | `{Name}.vue` | `HeroSection.vue` |
| Angular | PascalCase input, auto-kebab | `hero-section.component.ts` | `HeroSection` → `hero-section` |

### Sanitization Function
```typescript
function sanitizeComponentName(raw: string, target: OutputTarget): string {
  // Strip non-alphanumeric except spaces
  let clean = raw.replace(/[^a-zA-Z0-9 ]/g, '').trim();
  // PascalCase
  clean = clean.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join('');
  // Ensure starts with letter
  if (!/^[A-Z]/.test(clean)) clean = 'Section' + clean;
  return clean || 'Section';
}

function toAngularFilename(pascalName: string): string {
  return pascalName
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
  // HeroSection → hero-section
}
```

## Implementation

### Files to Edit
- `components/ExportModal/ComponentNamesStep.tsx` — new step component
- `store/exportStore.ts` (or local state in modal) — hold `componentNames: string[]`
- All generators — accept `componentNames` param and use for filenames + function names

### Data Flow
```
Step 3 renders ComponentNamesStep
  → user edits name → local state updates → validation runs → preview regenerates (debounced)
Step 4 → generators receive validated componentNames[]
```

### Default Names
- Derive from Layers panel Section names if user has renamed them
- Fallback: "SectionOne", "SectionTwo", "SectionThree" ...

---

# FEATURE 4 — TypeScript / JavaScript Toggle

## What It Does
User chooses TypeScript or JavaScript output for React and Vue exports.

## UI Spec (Step 3)

```
Output Language
  ( ● TypeScript )   ( ○ JavaScript )
```

Angular: no toggle shown — always TypeScript (platform requirement)

## What Changes Per Selection

| Target | TypeScript | JavaScript |
|---|---|---|
| React | `.tsx`, `tsconfig.json`, typed props | `.jsx`, no tsconfig, no types |
| Vue | `<script setup lang="ts">`, `.ts` imports | `<script setup>`, `.js` imports |
| Angular | Always `.ts` — no toggle | — |

## Implementation

### Files to Edit
- `components/ExportModal/ExportModal.tsx` — add toggle to Step 3
- `engine/generators/reactGenerator.ts` — conditional on `lang` param
- `engine/generators/vueGenerator.ts` — conditional on `lang` param
- `store/projectStore.ts` or localStorage — persist `preferredLang` per project

### Persistence
```typescript
// Save on toggle change
localStorage.setItem(`builderpro_lang_${projectId}`, lang);

// Load on export modal open
const savedLang = localStorage.getItem(`builderpro_lang_${projectId}`) ?? 'typescript';
```

### Type Stripping for JavaScript Output
- React: remove `: string`, `: React.FC`, `interface Props {}`, generic params
- Vue: change `<script setup lang="ts">` → `<script setup>`, remove type annotations
- No `tsconfig.json` in JS output
- `vite.config.js` instead of `vite.config.ts`

---

# FEATURE 5 — Design Tokens File

## What It Does
Every export ZIP includes a file of named design constants derived from the project.

## Output Per Target

| Target | File | Format |
|---|---|---|
| React / Vue (TS) | `tokens.ts` | `export const tokens = { ... } as const` |
| React / Vue (JS) | `tokens.js` | `export const tokens = { ... }` |
| Angular | `tokens.scss` | `$token-name: value;` |
| HTML/CSS | `tokens.css` | `--token-name: value;` |

## Token Contents

```typescript
// tokens.ts
export const tokens = {
  // Colors
  colorPrimary:    '#4F46E5',
  colorSecondary:  '#06B6D4',
  colorAccent:     '#22C55E',
  colorDanger:     '#EF4444',
  colorBackground: '#FFFFFF',
  colorSurface:    '#F8FAFC',
  colorBorder:     '#E2E8F0',
  colorTextPrimary: '#0F172A',
  colorTextSecondary: '#475569',

  // Typography
  fontPrimary:   'Inter, sans-serif',
  fontSizeXs:    '12px',
  fontSizeSm:    '14px',
  fontSizeBase:  '16px',
  fontSizeLg:    '18px',
  fontSizeXl:    '24px',
  fontSize2xl:   '32px',
  fontSize3xl:   '48px',

  // Spacing
  spacing1: '4px',
  spacing2: '8px',
  spacing3: '12px',
  spacing4: '16px',
  spacing6: '24px',
  spacing8: '32px',
  spacing12: '48px',
  spacing16: '64px',

  // Border Radius
  radiusSm:  '4px',
  radiusMd:  '8px',
  radiusLg:  '12px',
  radiusXl:  '16px',
  radius2xl: '24px',

  // Breakpoints
  breakpointMobile: '390px',
  breakpointTablet: '768px',
  breakpointDesktop: '1440px',
} as const;
```

## Implementation

### File to Create
`engine/tokens/tokensGenerator.ts`

```typescript
export function generateTokens(
  projectTokens: Partial<DesignTokens>,   // user-customized values
  target: OutputTarget,
  lang: Language
): { filename: string; content: string }
```

### Merge Strategy
- Merge user-customized token values over BuilderPro defaults
- If user never changed a token, use the default from `DESIGN_TOKENS.md`

### Usage in Generated Components
- React/Vue: import tokens at top of `App.tsx` / `App.vue` as reference (comment shows how to use)
- Angular: `tokens.scss` imported in `styles.scss` automatically
- HTML/CSS: `tokens.css` linked in `index.html` `<head>`

---

# FEATURE 6 — Open in StackBlitz

## What It Does
One-click opens the generated project in a live browser IDE with zero local setup.

## UI Spec (Step 4)

```
┌───────────────────────────────────────────────────────┐
│  [ ⬇ Download ZIP ]       [ ⚡ Open in StackBlitz ]   │
└───────────────────────────────────────────────────────┘
```
Both buttons always visible simultaneously. Independent actions.

## Implementation

### Library
`@stackblitz/sdk` — `sdk.openProject(project, options)`

Install: `npm install @stackblitz/sdk`

### Data Flow
```
Generate FileMap (same as Download)
      ↓
Build StackBlitz Project object from FileMap
      ↓
sdk.openProject(project, { newWindow: true, openFile: 'src/App.tsx' })
      ↓
StackBlitz opens in new tab with live preview
```

### StackBlitz Project Object
```typescript
import sdk from '@stackblitz/sdk';

function openInStackBlitz(fileMap: Record<string, string>, target: OutputTarget) {
  sdk.openProject(
    {
      title: projectName,
      description: 'Built with BuilderPro',
      template: target === 'react' ? 'node' : 'node',
      files: fileMap,         // { 'src/App.tsx': '...', 'package.json': '...' }
    },
    {
      newWindow: true,
      openFile: target === 'react' ? 'src/App.tsx'
               : target === 'vue'  ? 'src/App.vue'
               : 'src/app/app.component.html',
    }
  );
}
```

### Angular Handling
- Angular CLI projects don't run cleanly in StackBlitz without extra config
- Show a different button: "Open Angular Starter"
- Links to: `https://stackblitz.com/fork/angular`
- Show tooltip: "Copy your component files into the src/app folder"

### Failure Handling
- Wrap `sdk.openProject()` in try/catch
- On error: silently hide the button (do not show an error toast — user still has Download)
- No retry logic needed

---

# FEATURE 7 — Section-Level Export

## What It Does
Export a single Section as a standalone component instead of the full page.

## Entry Point
Section context menu (right-click or ⋮ button on hover) → "Export this section"

## UI Flow
```
User right-clicks Section on canvas
      ↓
Context menu shows:
  Duplicate | Delete | Export this section ←
      ↓
Same Export Modal opens (Step 1)
  BUT: scoped to one Section — modal header shows "Exporting: {SectionName}"
      ↓
Steps 2–4 same as full export
      ↓
ZIP contains: one component + minimal App wrapper + README
```

## ZIP Structure (Section Export)

```
/export
  /src
    /components
      HeroSection.tsx       ← the one exported section
    App.tsx                 ← minimal: imports + renders HeroSection only
    main.tsx
    tokens.ts
  package.json
  README.md
```

## Implementation

### Files to Edit
- `components/Canvas/SectionContextMenu.tsx` — add "Export this section" menu item
- `components/ExportModal/ExportModal.tsx` — accept optional `sectionId?: string` prop
- `engine/exportEngine.ts` — filter sections by `sectionId` if provided

### State Passed to Export Modal
```typescript
// When triggered from section context menu:
openExportModal({ sectionId: section.id, sectionName: section.name });

// Export engine receives:
const sectionsToExport = sectionId
  ? state.sections.filter(s => s.id === sectionId)
  : state.sections;
```

### README Adjustment
- Add note: "This is a single section export. To use it, import `{ComponentName}` into your existing App."

### Edge Cases
- Section with no elements: still export (empty component with TODO comment)
- Section name has special characters: sanitize with same function as Component Naming

---

# FEATURE 8 — Export History

## What It Does
Project dashboard shows the last 3 exports per project with a re-download button.

## UI Spec (Project Dashboard Card)

```
┌──────────────────────────────────────────────────────┐
│  My Landing Page                                     │
│  Bootstrap · Last edited 2h ago                      │
│  ─────────────────────────────────────────────────── │
│  Export History                                      │
│  React · TS · 08 Jun 2026 14:32     [ Re-download ] │
│  HTML  · —  · 08 Jun 2026 11:10     [ Re-download ] │
│  React · JS · 07 Jun 2026 09:45     [ Re-download ] │
└──────────────────────────────────────────────────────┘
```

## Data Schema

```typescript
interface ExportHistoryEntry {
  id: string;                        // uuid
  projectId: string;
  projectName: string;
  outputTarget: 'html' | 'react' | 'vue' | 'angular';
  frameworkMode: 'bootstrap' | 'mui' | 'tailwind' | 'custom';
  language: 'typescript' | 'javascript' | null;  // null for HTML
  exportedAt: string;                // ISO timestamp
  // No file content stored — re-download regenerates from current project state
}
```

## localStorage Strategy

```typescript
const HISTORY_KEY = (projectId: string) => `builderpro_export_history_${projectId}`;
const MAX_ENTRIES = 3;

function addExportHistory(entry: ExportHistoryEntry): void {
  const raw = localStorage.getItem(HISTORY_KEY(entry.projectId));
  const history: ExportHistoryEntry[] = raw ? JSON.parse(raw) : [];
  const updated = [entry, ...history].slice(0, MAX_ENTRIES); // newest first, max 3
  localStorage.setItem(HISTORY_KEY(entry.projectId), JSON.stringify(updated));
}

function getExportHistory(projectId: string): ExportHistoryEntry[] {
  const raw = localStorage.getItem(HISTORY_KEY(projectId));
  return raw ? JSON.parse(raw) : [];
}
```

## Re-download Flow

```
User clicks "Re-download" on a history entry
      ↓
Read entry: { outputTarget, frameworkMode, language }
      ↓
Run exportEngine.generate(currentProjectState, { target, mode, lang })
  (uses current project state — not a snapshot of when it was originally exported)
      ↓
Download ZIP
      ↓
Add new entry to history (this re-download counts as a new export)
```

Note: Re-download always uses the **current** project state, not a historical snapshot. This is intentional and should be communicated to the user via a tooltip: "Re-downloads reflect your current project state."

## Implementation

### Files to Create/Edit
- `lib/exportHistory.ts` — `addExportHistory`, `getExportHistory` functions
- `components/ProjectCard/ExportHistory.tsx` — display component
- `app/dashboard/page.tsx` (or wherever ProjectCard renders) — inject `<ExportHistory>`
- `engine/exportEngine.ts` — call `addExportHistory()` after every successful export

### Logged For
- Free users: HTML exports tracked
- Premium users: all export types tracked
- Both stored in same localStorage structure

---

# 🗓 BUILD PRIORITY ORDER

Build in this sequence — each feature unblocks the next:

| Priority | Feature | Reason |
|---|---|---|
| 1 | Design Tokens File (F5) | Pure generator output, no UI. Unblocks README (F2) and Preview (F1). |
| 2 | Auto-generated README (F2) | Pure generator output. Needed in every ZIP. |
| 3 | TypeScript / JavaScript Toggle (F4) | Modal UI change + generator switch. Small scope. |
| 4 | Component Naming (F3) | Depends on toggle (Step 3). Needs sanitization logic. |
| 5 | Live Code Preview (F1) | Depends on generators returning FileMap. Needs highlight.js. |
| 6 | Export History (F8) | Standalone. Add after export pipeline is stable. |
| 7 | Section-Level Export (F7) | Depends on export modal accepting `sectionId`. |
| 8 | Open in StackBlitz (F6) | Depends on FileMap generation. Last because it's additive. |

---

# 📦 NEW DEPENDENCIES

| Package | Version | Used By |
|---|---|---|
| `highlight.js` | latest stable | Code Preview (F1) |
| `@stackblitz/sdk` | latest stable | Open in StackBlitz (F6) |
| `uuid` | latest stable | Export History IDs (F8) |

---

# 🔗 RELATED DOCS

- `EXPORT_RULES.md` — output rules, ZIP structures, framework matrix
- `EXPORT_PLAN.md` — component generation architecture and code examples
- `CONSTRAINTS.md` — premium gating and library constraints
- `PRD.md` — Feature 1–8 formal MVP scope definitions
