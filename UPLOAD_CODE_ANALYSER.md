# 📋 PRD — Upload Your Code (UI Analyser)
**Feature:** Upload existing React / Angular / Vue code → automated UI issue detection → preview + download

---

## 🎯 Vision

Extend BuilderPro beyond visual page building. Developers upload their existing frontend codebase and the tool automatically detects **cosmetic issues**, **responsive layout problems**, and **accessibility violations** — then lets them preview the result and download the fixed or annotated code.

This targets developers who have existing UI code and want a fast quality audit without setting up local tooling.

---

## 🔍 Research Findings

### Analysis Approach: Two-Pass Pipeline

| Pass | What it does | Tool |
|---|---|---|
| **Static** | Parses source files, detects missing alt tags, hardcoded px, no media queries | AST + regex (no browser needed) |
| **Dynamic** | Renders HTML in headless browser, runs axe-core, captures screenshots at breakpoints | Puppeteer + axe-core |

### Tools Selected

| Tool | Purpose | License |
|---|---|---|
| `axe-core` | Accessibility violations (WCAG 2.1 AA) — contrast, labels, ARIA | MIT |
| `@axe-core/puppeteer` | Inject axe into headless Chromium, run on rendered HTML | MIT |
| `puppeteer-core` | Already installed — headless browser for screenshot + responsive checks | Apache-2.0 |
| `postcss` | Parse CSS/SCSS to detect missing breakpoints, hardcoded px | MIT |
| `@babel/parser` | Parse JSX/TSX/Vue SFC to detect missing alt, onClick without keyboard | MIT |
| `jszip` | Already installed — bundle fixed files for download | MIT |

### Framework Detection

| Signal | Framework |
|---|---|
| `.jsx`/`.tsx` + `React` import | React |
| `angular.json` / `@Component` decorator | Angular |
| `.vue` files / `createApp` | Vue |
| Plain `.html`/`.css` | Vanilla |

### Issue Categories (MVP)

#### Phase 1 — Cosmetic Issues
- Images missing `alt` attribute
- Text contrast ratio < 4.5:1 (WCAG AA)
- Missing `<title>` / `<meta description>`
- Hardcoded font sizes in `px` (should be `rem`)
- Empty `href="#"` links with no accessible label
- Buttons without visible label text

#### Phase 2 — Responsive Issues
- No `@media` queries in CSS/SCSS
- Fixed `width` in px on containers (≥ 320px threshold)
- Missing `viewport` meta tag
- Horizontal scroll at 375px / 768px viewports
- Images without `max-width: 100%`
- Font sizes < 14px on mobile viewport

#### Phase 3 (Future)
- Performance: large images, unused CSS
- Cross-browser: CSS properties without vendor prefixes
- SEO: heading hierarchy, canonical tags
- Security: inline event handlers, eval usage

---

## 🏗 Architecture

### Entry Point

**Current:** `Browse Templates` button on empty canvas  
**Change to:** `Upload Your Code` button — same location, new behaviour

The existing builder canvas, drag-drop, export, and all current features remain **100% untouched**.

### New Pages / Routes

```
/analyse                   ← Upload UI (new standalone route)
/analyse/[jobId]           ← Results page
```

Both are separate from `/builder` — no risk to existing functionality.

### New API Routes

```
POST /api/analyse/upload   ← Accept ZIP/files, queue job, return jobId
GET  /api/analyse/[jobId]  ← Poll job status + results
GET  /api/analyse/[jobId]/download  ← Download annotated code ZIP
```

### Job Pipeline (server-side, non-blocking)

```
Upload ZIP
    │
    ▼
1. Extract + detect framework (React / Angular / Vue / HTML)
    │
    ▼
2. Static analysis
   ├── Parse JSX/TSX/Vue SFC with @babel/parser
   ├── Parse CSS/SCSS with postcss
   └── Emit: StaticIssue[]
    │
    ▼
3. Build preview HTML
   └── For React/Vue: vite build --mode analyze (sandboxed)
   └── For HTML: use files directly
    │
    ▼
4. Dynamic analysis (Puppeteer + axe-core)
   ├── Desktop  1440px → axe-core scan → screenshot
   ├── Tablet    768px → axe-core scan → screenshot
   └── Mobile    375px → axe-core scan → screenshot
    │
    ▼
5. Merge results → severity: error | warning | info
    │
    ▼
6. Store results + screenshots in /tmp/jobs/{jobId}/
    │
    ▼
7. Package annotated code + report as ZIP
```

### Data Shape

```ts
interface AnalyseJob {
  id: string
  status: 'queued' | 'analysing' | 'done' | 'error'
  framework: 'react' | 'angular' | 'vue' | 'html'
  createdAt: string
  completedAt?: string
  issues: UIIssue[]
  screenshots: { viewport: string; url: string }[]
  downloadUrl?: string
}

interface UIIssue {
  id: string
  severity: 'error' | 'warning' | 'info'
  category: 'cosmetic' | 'responsive' | 'accessibility' | 'seo'
  rule: string          // e.g. 'img-alt', 'color-contrast'
  message: string       // human-readable
  file?: string         // source file path
  line?: number         // line number if static
  element?: string      // CSS selector (dynamic issues)
  wcag?: string         // e.g. 'WCAG 1.1.1'
  helpUrl?: string      // link to docs
  fix?: string          // suggested fix snippet
}
```

---

## 🖥 UI Specification

### 1. Entry — Empty Canvas Button Change

**File:** `components/builder/renderers/Canvas.tsx`

```
[Add Section]  [Upload Your Code]    ← change from "Browse Templates"
```

Clicking **Upload Your Code** → navigates to `/analyse` (new tab or same page).

> `Browse Templates` moves to the left sidebar Templates panel (already exists there).

---

### 2. Upload Page `/analyse`

```
┌─────────────────────────────────────────────────────┐
│  ⬆  Upload Your Code                                │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │                                              │   │
│  │   Drag & drop your project folder           │   │
│  │   or click to browse                        │   │
│  │                                              │   │
│  │   Accepts: .zip, or individual files        │   │
│  │   React · Angular · Vue · HTML              │   │
│  │   Max size: 50MB                            │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │  ☑ Cosmetic Issues    ☑ Responsive Issues  │   │
│  │  ☑ Accessibility      ☐ SEO (coming soon)  │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│               [ Analyse Code →  ]                   │
└─────────────────────────────────────────────────────┘
```

**Constraints:**
- Max 50MB ZIP or 50 files
- Supported: `.jsx`, `.tsx`, `.vue`, `.html`, `.css`, `.scss`, `.ts`, `.js`
- No `.env` files accepted (security)
- Files stored in `/tmp/jobs/{jobId}/` — auto-deleted after 24h

---

### 3. Analysis Progress `/analyse/[jobId]`

```
┌─────────────────────────────────────────────────────┐
│  Analysing your code...                              │
│                                                      │
│  ✓ Framework detected: React (TypeScript)           │
│  ✓ 23 files parsed                                  │
│  ⟳ Running accessibility audit...                  │
│  ○ Checking responsive breakpoints                  │
│  ○ Generating screenshots                           │
│                                                      │
│  ████████████░░░░░░░░  60%                         │
└─────────────────────────────────────────────────────┘
```

Polls `GET /api/analyse/[jobId]` every 2s with SSE or polling.

---

### 4. Results Page `/analyse/[jobId]` (done)

```
┌──────────────┬──────────────────────────────────────┐
│  ISSUES (24) │  Preview                             │
│              │                                      │
│  ● 8 Errors  │  [Desktop] [Tablet] [Mobile]        │
│  ⚠ 12 Warn  │                                      │
│  ℹ 4 Info   │  ┌──────────────────────────────┐   │
│              │  │  Screenshot at 1440px        │   │
│  Filter:     │  │                              │   │
│  [All ▼]    │  │  [annotated screenshot]      │   │
│              │  │                              │   │
│  ─────────  │  └──────────────────────────────┘   │
│  ● Missing   │                                      │
│  alt on img  │  Issue detail on hover/click        │
│  Line 42     │  ─────────────────────────────────  │
│  /Hero.tsx   │  Rule: img-alt (WCAG 1.1.1)        │
│              │  Fix: Add alt="" or descriptive text │
│  ⚠ No media │  [ Copy fix ]                       │
│  queries in  │                                      │
│  styles.css  │                                      │
│  ...         │                                      │
│              │                                      │
│  [ Download  │                                      │
│  Report ZIP ]│                                      │
└──────────────┴──────────────────────────────────────┘
```

**Download ZIP contains:**
```
/report
  index.html          ← visual HTML report
  issues.json         ← machine-readable full results
  screenshots/
    desktop.png
    tablet.png
    mobile.png
  /annotated-source   ← original files + inline TODO comments
    Hero.tsx          ← // TODO: [BuilderPro] img-alt line 42
    styles.css        ← /* TODO: [BuilderPro] add @media queries */
```

---

## ⚙️ Implementation Plan

### Phase 1 — Static Analysis (Week 1)
- [ ] `POST /api/analyse/upload` — accept ZIP, extract, detect framework
- [ ] Static AST scanner (`lib/analyse/static.ts`)
  - `@babel/parser` → find missing alt, button labels, empty hrefs
  - `postcss` → find missing media queries, px font sizes
- [ ] Job store (in-memory + filesystem fallback)
- [ ] `/analyse` upload page
- [ ] `/analyse/[jobId]` results page (issues list only)

### Phase 2 — Dynamic Analysis (Week 2)
- [ ] Puppeteer + axe-core scan (`lib/analyse/dynamic.ts`)
  - Screenshot at 1440 / 768 / 375px
  - Run axe-core at each breakpoint
  - Detect horizontal scroll at 375px
- [ ] Merge static + dynamic results
- [ ] Results page: screenshot preview + issue overlay

### Phase 3 — Download + Polish (Week 3)
- [ ] Annotated source ZIP generation
- [ ] HTML report generation
- [ ] Issue deduplication + severity ranking
- [ ] Job auto-cleanup after 24h

---

## 🚫 Constraints / Non-goals

- **No code execution** — React/Vue/Angular code is NOT compiled/bundled server-side (security risk). Dynamic analysis uses pre-built HTML only, or static HTML extraction.
- **No framework modification** — the tool annotates issues, never auto-fixes code.
- **No existing feature changes** — builder canvas, DnD, export, save/load, themes untouched.
- **No auth required** — results stored by jobId UUID, accessible without login.
- **No AI** — pure static + axe-core rule-based analysis only (MVP).

---

## 📁 Files to Create (no existing file touched)

```
app/analyse/
  page.tsx                    ← upload UI
  [jobId]/
    page.tsx                  ← results UI

app/api/analyse/
  upload/route.ts             ← POST: accept files
  [jobId]/route.ts            ← GET: poll status
  [jobId]/download/route.ts   ← GET: download ZIP

lib/analyse/
  static.ts                   ← AST + CSS static scanner
  dynamic.ts                  ← Puppeteer + axe-core runner
  framework-detect.ts         ← detect React/Angular/Vue/HTML
  job-store.ts                ← in-memory job state
  report-generator.ts         ← build HTML report + annotated ZIP

components/analyse/
  UploadZone.tsx
  ProgressTracker.tsx
  IssueList.tsx
  ScreenshotPreview.tsx
  IssueDetail.tsx
```

**One change to existing file:**
```
components/builder/renderers/Canvas.tsx
  Line ~182: "Browse Templates" → "Upload Your Code"
  (1-line text change only)
```

---

## 📦 New Dependencies

```json
{
  "@babel/parser": "^7.24",
  "@babel/traverse": "^7.24",
  "postcss": "^8.4",
  "axe-core": "^4.9",
  "@axe-core/puppeteer": "^4.9"
}
```

`puppeteer-core` and `jszip` already installed.

---

## ✅ Acceptance Criteria

| Scenario | Expected |
|---|---|
| Upload React ZIP | Framework detected as React |
| Missing `alt` on `<img>` | Error: img-alt, file + line shown |
| No `@media` queries in CSS | Warning: responsive-no-breakpoints |
| Color contrast < 4.5:1 | Error: color-contrast (axe-core) |
| Screenshot at 375px shows horizontal scroll | Error: responsive-overflow |
| Download ZIP | Contains report.html + issues.json + screenshots + annotated source |
| Builder `/builder` route | 100% unchanged, all features work |
| Job older than 24h | Files deleted from `/tmp/jobs/` |
