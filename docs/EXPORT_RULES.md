# 📤 Export Rules – BuilderPro

---

# 🎯 PURPOSE

Define export engine behavior for all output formats and framework modes.

Exports must remain:
- Clean
- Responsive
- Framework-compatible
- Production-ready

---

# 📦 EXPORT TYPES

## Free (all users)
- HTML + CSS ZIP

## Premium (paid users only)
- React component export
- Vue component export
- Angular component export

Custom mode ONLY gets HTML/CSS. No component generation offered in Custom mode.

---

# 📁 ZIP STRUCTURE — HTML/CSS (all modes)

```
/export
  index.html
  styles.css
  tokens.css          ← design tokens (colors, spacing, radii)
  /assets
    /images
  README.md
```

---

# 📁 ZIP STRUCTURE — React

```
/export
  /src
    /components
      SectionOne.tsx        ← one file per Section
      SectionTwo.tsx
      ...
    App.tsx
    main.tsx
    tokens.ts               ← design tokens as TS constants
  index.html
  package.json              ← exact locked versions
  tsconfig.json             ← (if TypeScript selected)
  vite.config.ts
  .gitignore
  README.md
```

---

# 📁 ZIP STRUCTURE — Vue

```
/export
  /src
    /components
      SectionOne.vue        ← one .vue SFC per Section
      SectionTwo.vue
      ...
    App.vue
    main.ts
    tokens.ts
  index.html
  package.json
  tsconfig.json             ← (if TypeScript selected)
  vite.config.ts
  .gitignore
  README.md
```

---

# 📁 ZIP STRUCTURE — Angular

```
/export
  /src
    /app
      /components
        section-one/
          section-one.component.ts
          section-one.component.html
          section-one.component.scss
        section-two/...
      app.component.ts
      app.component.html
      app.module.ts         ← or standalone bootstrapping (Angular 17+)
    tokens.scss             ← design tokens as SCSS variables
    styles.scss
    main.ts
  angular.json
  tsconfig.json
  package.json
  .gitignore
  README.md
```

---

# 🧩 FRAMEWORK MODE × OUTPUT TARGET MATRIX

| Builder Mode | HTML/CSS | React | Vue | Angular |
|---|---|---|---|---|
| Bootstrap | ✅ | ✅ react-bootstrap | ✅ bootstrap-vue-next | ✅ ng-bootstrap |
| MUI | ✅ | ✅ @mui/material | ✅ Vuetify 3 | ✅ Angular Material |
| Tailwind | ✅ | ✅ plain className | ✅ plain class | ✅ plain class |
| Custom | ✅ | ❌ not offered | ❌ not offered | ❌ not offered |

---

# 🧩 BOOTSTRAP MODE EXPORT RULES

## HTML/CSS
- Use Bootstrap CDN link in `<head>`
- Use `container` / `row` / `col-*` structure
- Use Bootstrap utility classes
- Custom overrides in `styles.css`

## React
- Import from `react-bootstrap`
- Use `Container`, `Row`, `Col`, `Button`, `Card`, `Navbar`, `Form` components
- Bootstrap CSS imported in `main.tsx` via `import 'bootstrap/dist/css/bootstrap.min.css'`
- Custom overrides in `styles.css`

## Vue
- Import from `bootstrap-vue-next`
- Use `BContainer`, `BRow`, `BCol`, `BButton`, `BCard`, `BNavbar`, `BForm` components
- Bootstrap CSS imported in `main.ts`
- Custom overrides in `styles.css`

## Angular
- Use `ng-bootstrap` (`NgbModule`)
- Bootstrap CSS in `angular.json` styles array
- Components use Bootstrap class attributes in HTML templates
- Custom overrides in `styles.scss`

---

# 🧩 MUI MODE EXPORT RULES

## HTML/CSS
- Use MUI CDN (Roboto font + MUI CSS) in `<head>`
- Structural classes only; no MUI JS required for static HTML
- Custom layout via CSS variables matching MUI spacing

## React
- Import from `@mui/material`
- Use `Grid`, `Box`, `Stack`, `Container`, `Typography`, `Button`, `Card`, `AppBar`, `TextField`
- `ThemeProvider` wraps `App.tsx` with BuilderPro design tokens mapped to MUI theme palette:
  - primary: `#4F46E5`
  - secondary: `#06B6D4`
  - success: `#22C55E`
  - error: `#EF4444`

## Vue
- Use **Vuetify 3** (Material Design framework for Vue — MUI equivalent)
- Use `v-container`, `v-row`, `v-col`, `v-btn`, `v-card`, `v-app-bar`, `v-text-field`
- Vuetify theme configured with BuilderPro design tokens

## Angular
- Use **Angular Material** (`@angular/material`)
- Map elements: `mat-toolbar`, `mat-card`, `mat-button`, `mat-form-field`, `mat-grid-list`
- Theme generated via Angular Material theming system with BuilderPro tokens as SCSS variables

---

# 🧩 TAILWIND MODE EXPORT RULES

## HTML/CSS
- Tailwind CDN `<script>` in `<head>` (play CDN for static)
- All styling via Tailwind utility classes
- No custom CSS unless truly unavoidable

## React
- All styling via `className` with Tailwind utilities
- `tailwind.config.js` generated with correct `content` paths
- `package.json` includes `tailwindcss`, `autoprefixer`, `postcss`
- `postcss.config.js` included

## Vue
- All styling via `class` with Tailwind utilities in `<template>`
- `tailwind.config.js` with Vue file content paths
- Same PostCSS setup as React

## Angular
- Tailwind utilities in `.html` templates
- `tailwind.config.js` with Angular `content` paths (`./src/**/*.{html,ts}`)
- PostCSS config included
- `styles.scss` imports Tailwind base/components/utilities

---

# 🧩 CUSTOM MODE EXPORT RULES

- HTML/CSS ZIP only
- ALL CSS is custom — no framework classes
- Responsive via custom media queries
- No component generation offered
- No package.json required

---

# 🔖 VERSION MANAGEMENT

## At Project Creation
- Builder auto-detects latest stable version of the selected UI framework
- Version stored in project metadata (`projectMeta.frameworkVersion`)
- Version displayed in:
  - Project settings panel
  - Export modal header (e.g. "Exporting with Bootstrap 5.3.3")

## At Export Time
- Locked version written into `package.json` dependencies (exact version, no `^` or `~`)
- README states exact version in "Prerequisites" section

## Version Update Detection
- Builder checks for newer stable version on project open
- If newer version exists: show non-blocking badge "Bootstrap 5.3.4 available"
- User can choose to update or keep locked version

## Stable Version Registry (resolve at implementation time from npm)
- Bootstrap: npm `bootstrap` — latest stable
- React: npm `react` + `react-dom` — latest stable
- Vue: npm `vue` — latest stable (v3.x)
- Angular: npm `@angular/core` — latest stable LTS
- MUI: npm `@mui/material` — latest stable
- Vuetify: npm `vuetify` — latest stable (v3.x)
- Angular Material: npm `@angular/material` — must match Angular version exactly

---

# 📋 README.md CONTENTS (required in every export ZIP)

1. Project name (from BuilderPro project title)
2. Framework and exact version used
3. Prerequisites (Node.js version, package manager)
4. Install command (`npm install`)
5. Dev server command (`npm run dev`)
6. Build command (`npm run build`)
7. Folder structure explanation
8. Component list (one line per component)
9. Design tokens section (key colors, fonts used)
10. "Built with BuilderPro" attribution + link

---

# 🎁 EXTRA EXPORT FEATURES

## Code Preview
- Syntax-highlighted preview before download
- Tabs to switch between key files (App, first component, package.json)
- "Copy" button per file tab

## Open in StackBlitz
- One-click button in export modal
- Posts project ZIP to StackBlitz API → opens in browser, no local setup
- Available for React and Vue (native StackBlitz support)
- Angular: link to StackBlitz Angular starter + note to copy files

## Design Tokens File
- `tokens.ts` (React/Vue) or `tokens.scss` (Angular) or `tokens.css` (HTML)
- Contains all BuilderPro design tokens: colors, font sizes, spacing scale, radii, breakpoints
- Named constants matching BuilderPro token names

## Component Naming
- Export modal shows list of Sections with editable name fields
- Defaults: "SectionOne", "SectionTwo", etc.
- User renames before generating; filename = component name

## Export History
- Project dashboard shows last 3 exports per project
- Each entry: output type, framework mode, TS/JS, date
- "Re-download" button regenerates same export

## Section-Level Export
- Right-click any Section on canvas → "Export this section"
- ZIP contains that single component + minimal App wrapper + README
- For developers dropping one component into an existing project

---

# 🧩 STRUCTURE MAPPING (all frameworks)

Section → top-level component
Row → layout row (Bootstrap Row / MUI Grid container / Tailwind flex / Angular flex-row)
Column → layout column (Bootstrap Col / MUI Grid item / Tailwind flex child / Angular flex-col)
Element → semantic HTML element (h1, p, button, img, form, etc.)

---

# 📱 RESPONSIVE EXPORT

All exports must support:
- Desktop (≥1440px)
- Tablet (768px)
- Mobile (390px)

Responsive strategy per framework:
- Bootstrap: `col-md-*` / `col-sm-*` classes
- MUI: `xs` / `sm` / `md` Grid props
- Tailwind: `sm:` / `md:` / `lg:` utility prefixes
- Angular Material: `fxLayout` or breakpoint observer; ng-bootstrap: Bootstrap responsive classes

---

# 🚨 INVALID EXPORTS

DO NOT:
- Export broken nesting
- Export hidden builder controls or editor overlays
- Export unused styles
- Export inline styles where class-based styling is possible
- Use `^` or `~` version ranges in package.json (always exact)
- Offer component generation for Custom mode
- Mix framework classes (Bootstrap classes in MUI export, etc.)
- Export Angular with a Vuetify import, or Vue with Angular Material, etc.
