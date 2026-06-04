/**
 * HTML/CSS Export Engine
 *
 * Converts a BuilderProject (normalized flat store → tree via buildProject())
 * into clean, semantic, responsive HTML + CSS.
 *
 * Rules from EXPORT_RULES.md:
 * - Semantic HTML, no editor overlays or builder controls
 * - Responsive via media queries (desktop/tablet/mobile breakpoints)
 * - Framework-aware: Bootstrap / Tailwind / MUI / Custom
 * - Clean reusable CSS classes, no inline style chaos
 */

import type {
  BuilderProject,
  BuilderSection,
  BuilderRow,
  BuilderColumn,
  BuilderElement,
  BuilderMode,
  ElementContent,
  StyleMap,
} from '@/types/builder.types'

// ─── Breakpoints (from RESPONSIVE_RULES.md) ───────────────────────────────────

const BP = {
  tablet: 768,
  mobile: 390,
} as const

// ─── CSS utilities ────────────────────────────────────────────────────────────

/** Convert camelCase CSS property names to kebab-case */
function toKebab(prop: string): string {
  return prop.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
}

/** Render a StyleMap as CSS declarations string */
function styleMapToCSS(styles: StyleMap, indent = '  '): string {
  return Object.entries(styles)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${indent}${toKebab(k)}: ${v};`)
    .join('\n')
}

/** Slugify an id for use as CSS class name */
function slug(id: string): string {
  return `bp-${id.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
}

// ─── Framework helpers ────────────────────────────────────────────────────────

function frameworkMeta(mode: BuilderMode): {
  head: string
  bodyClass: string
  containerClass: string
  rowClass: string
  colClass: (span?: number) => string
} {
  switch (mode) {
    case 'bootstrap':
      return {
        head: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">\n  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer><\/script>`,
        bodyClass: '',
        containerClass: 'container',
        rowClass: 'row',
        colClass: (span) => (span ? `col-lg-${span}` : 'col'),
      }
    case 'tailwind':
      return {
        head: `<script src="https://cdn.tailwindcss.com"><\/script>`,
        bodyClass: '',
        containerClass: 'container mx-auto px-4',
        rowClass: 'flex flex-wrap gap-4',
        colClass: (span) => (span ? `w-${span}/12` : 'flex-1'),
      }
    case 'mui':
      return {
        head: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap">`,
        bodyClass: 'mui-root',
        containerClass: 'mui-container',
        rowClass: 'mui-row',
        colClass: (span) => (span ? `mui-col-${span}` : 'mui-col'),
      }
    default: // custom
      return {
        head: '',
        bodyClass: '',
        containerClass: 'bp-container',
        rowClass: 'bp-row',
        colClass: (span) => (span ? `bp-col-${span}` : 'bp-col'),
      }
  }
}

// ─── Element HTML generators ──────────────────────────────────────────────────

function renderElement(el: BuilderElement): string {
  const c = el.content
  const id = el.htmlId ? ` id="${el.htmlId}"` : ''
  const cls = el.classNames ? ` class="${el.classNames}"` : ''
  const customCls = ` class="${[el.classNames, slug(el.id)].filter(Boolean).join(' ')}"`

  switch (c.type) {
    case 'heading': {
      const tag = c.level
      return `<${tag}${id}${customCls}>${escHtml(c.text)}</${tag}>`
    }
    case 'paragraph':
      return `<p${id}${customCls}>${escHtml(c.text)}</p>`

    case 'button': {
      const target = c.target ? ` target="${c.target}"` : ''
      return `<a href="${escAttr(c.href)}"${target}${id}${customCls}>${escHtml(c.text)}</a>`
    }

    case 'image':
      if (!c.src) return `<div${id}${customCls} role="img" aria-label="${escAttr(c.alt || 'image')}"></div>`
      return `<img src="${escAttr(c.src)}" alt="${escAttr(c.alt)}"${id}${customCls} loading="lazy">`

    case 'video': {
      if (!c.src) return `<div${id}${customCls}></div>`
      const embedSrc = c.provider === 'youtube'
        ? `https://www.youtube.com/embed/${extractYoutubeId(c.src)}`
        : `https://player.vimeo.com/video/${extractVimeoId(c.src)}`
      return `<div${id}${customCls}>\n  <iframe src="${escAttr(embedSrc)}" frameborder="0" allowfullscreen loading="lazy" style="width:100%;aspect-ratio:16/9;"></iframe>\n</div>`
    }

    case 'divider':
      return `<hr${id}${customCls}>`

    case 'spacer':
      return `<div${id}${customCls} aria-hidden="true"></div>`

    case 'icon':
      return `<i${id} class="${['bi', `bi-${c.name}`, el.classNames].filter(Boolean).join(' ')}" style="font-size:${c.size};color:${c.color};"></i>`

    case 'navbar': {
      const logo = c.logoType === 'image' && c.logoSrc
        ? `<img src="${escAttr(c.logoSrc)}" alt="Logo" class="navbar-logo">`
        : `<span class="navbar-brand-text">${escHtml(c.logoText)}</span>`
      const links = c.items.map(item =>
        `<li><a href="${escAttr(item.href)}">${escHtml(item.label)}</a></li>`
      ).join('\n        ')
      const cta = c.cta
        ? `<a href="${escAttr(c.cta.href)}" class="navbar-cta">${escHtml(c.cta.text)}</a>`
        : ''
      return `<nav${id}${customCls}>
  <a href="/" class="navbar-brand">${logo}</a>
  <button class="navbar-toggle" aria-label="Toggle navigation">&#9776;</button>
  <ul class="navbar-menu">
    ${links}
    ${cta ? `<li>${cta}</li>` : ''}
  </ul>
</nav>`
    }

    case 'hero':
      return `<div${id}${customCls}>
  <h1>${escHtml(c.heading)}</h1>
  <p>${escHtml(c.paragraph)}</p>
  <a href="${escAttr(c.cta.href)}" class="hero-cta">${escHtml(c.cta.text)}</a>
</div>`

    case 'card':
      return `<div${id}${customCls}>
  ${c.image.src ? `<img src="${escAttr(c.image.src)}" alt="${escAttr(c.image.alt)}" loading="lazy">` : ''}
  <div class="card-body">
    <h3>${escHtml(c.title)}</h3>
    <p>${escHtml(c.description)}</p>
    ${c.button ? `<a href="${escAttr(c.button.href)}">${escHtml(c.button.text)}</a>` : ''}
  </div>
</div>`

    case 'footer': {
      const links = c.links.map(l =>
        `<a href="${escAttr(l.href)}">${escHtml(l.label)}</a>`
      ).join('\n  ')
      return `<footer${id}${customCls}>
  <div class="footer-links">
    ${links}
  </div>
  <p class="footer-copy">${escHtml(c.copyright)}</p>
</footer>`
    }

    case 'form': {
      const fields = c.fields.map(f => {
        if (f.type === 'textarea') {
          return `<div class="form-field">
      <label>${escHtml(f.label)}${f.required ? ' <span aria-hidden="true">*</span>' : ''}</label>
      <textarea name="${escAttr(f.id)}" placeholder="${escAttr(f.placeholder ?? '')}"${f.required ? ' required' : ''}></textarea>
    </div>`
        }
        if (f.type === 'select' && f.options) {
          const opts = f.options.map(o => `<option value="${escAttr(o)}">${escHtml(o)}</option>`).join('')
          return `<div class="form-field">
      <label>${escHtml(f.label)}</label>
      <select name="${escAttr(f.id)}"${f.required ? ' required' : ''}>${opts}</select>
    </div>`
        }
        return `<div class="form-field">
      <label>${escHtml(f.label)}${f.required ? ' <span aria-hidden="true">*</span>' : ''}</label>
      <input type="${f.type}" name="${escAttr(f.id)}" placeholder="${escAttr(f.placeholder ?? '')}"${f.required ? ' required' : ''}>
    </div>`
      }).join('\n    ')
      return `<form${id}${customCls}>
    ${fields}
    <button type="submit">${escHtml(c.submitLabel)}</button>
  </form>`
    }

    case 'list':
      return `<ul${id}${customCls}>\n${c.items.map(i => `  <li>${escHtml(i.text)}</li>`).join('\n')}\n</ul>`

    case 'ordered-list':
      return `<ol${id}${customCls}>\n${c.items.map(i => `  <li>${escHtml(i.text)}</li>`).join('\n')}\n</ol>`

    case 'tabs': {
      const tabs = c.tabs.map((t, i) =>
        `<button class="tab-btn${i === (c.activeTab ?? 0) ? ' active' : ''}" data-tab="${i}">${escHtml(t.label)}</button>`
      ).join('\n  ')
      const panels = c.tabs.map((t, i) =>
        `<div class="tab-panel${i === (c.activeTab ?? 0) ? ' active' : ''}" data-panel="${i}">${escHtml(t.content)}</div>`
      ).join('\n  ')
      return `<div${id}${customCls}>
  <div class="tab-list" role="tablist">${tabs}</div>
  <div class="tab-panels">${panels}</div>
</div>`
    }

    case 'accordion': {
      const items = c.items.map((item, i) =>
        `<div class="accordion-item${item.defaultOpen ? ' open' : ''}">
    <button class="accordion-trigger">${escHtml(item.title)}</button>
    <div class="accordion-content">${escHtml(item.content)}</div>
  </div>`
      ).join('\n  ')
      return `<div${id}${customCls}>\n  ${items}\n</div>`
    }

    default:
      // Graceful fallback for unsupported types
      return `<!-- element type "${(c as ElementContent).type}" not exported -->`
  }
}

// ─── Layout HTML generators ───────────────────────────────────────────────────

function renderColumn(col: BuilderColumn, fw: ReturnType<typeof frameworkMeta>): string {
  const span = col.span?.desktop
  const fwClass = fw.colClass(span)
  const customClass = slug(col.id)
  const classes = [fwClass, col.classNames, customClass].filter(Boolean).join(' ')
  const id = col.htmlId ? ` id="${col.htmlId}"` : ''
  const elements = col.elements.map(el => `    ${renderElement(el)}`).join('\n')
  return `  <div class="${classes}"${id}>\n${elements}\n  </div>`
}

function renderRow(row: BuilderRow, fw: ReturnType<typeof frameworkMeta>): string {
  const customClass = slug(row.id)
  const classes = [fw.rowClass, row.classNames, customClass].filter(Boolean).join(' ')
  const id = row.htmlId ? ` id="${row.htmlId}"` : ''
  const cols = row.columns
    .filter(c => !c.managedBy)
    .map(c => renderColumn(c, fw))
    .join('\n')
  return `<div class="${classes}"${id}>\n${cols}\n</div>`
}

function renderSection(section: BuilderSection, fw: ReturnType<typeof frameworkMeta>): string {
  const customClass = slug(section.id)
  const classes = [fw.containerClass, section.classNames, customClass].filter(Boolean).join(' ')
  const id = section.htmlId ? ` id="${section.htmlId}"` : ''
  const rows = section.rows.map(r => renderRow(r, fw)).join('\n')
  return `<section class="${classes}"${id}>\n${rows}\n</section>`
}

// ─── CSS generator ────────────────────────────────────────────────────────────

interface CSSRule {
  selector: string
  declarations: string
  breakpoint?: 'tablet' | 'mobile'
}

function collectCSSRules(project: BuilderProject): CSSRule[] {
  const rules: CSSRule[] = []

  for (const section of project.sections) {
    if (Object.keys(section.styles).length) {
      rules.push({ selector: `.${slug(section.id)}`, declarations: styleMapToCSS(section.styles) })
    }
    for (const bp of ['tablet', 'mobile'] as const) {
      const overrides = section.responsive?.[bp]
      if (overrides && Object.keys(overrides).length) {
        rules.push({ selector: `.${slug(section.id)}`, declarations: styleMapToCSS(overrides), breakpoint: bp })
      }
    }

    for (const row of section.rows) {
      if (Object.keys(row.styles).length) {
        rules.push({ selector: `.${slug(row.id)}`, declarations: styleMapToCSS(row.styles) })
      }

      for (const col of row.columns) {
        if (Object.keys(col.styles).length) {
          rules.push({ selector: `.${slug(col.id)}`, declarations: styleMapToCSS(col.styles) })
        }
        for (const bp of ['tablet', 'mobile'] as const) {
          const overrides = col.responsive?.[bp]
          if (overrides && Object.keys(overrides).length) {
            rules.push({ selector: `.${slug(col.id)}`, declarations: styleMapToCSS(overrides), breakpoint: bp })
          }
        }

        for (const el of col.elements) {
          if (Object.keys(el.styles).length) {
            rules.push({ selector: `.${slug(el.id)}`, declarations: styleMapToCSS(el.styles) })
          }
          for (const bp of ['tablet', 'mobile'] as const) {
            const overrides = el.responsive?.[bp]
            if (overrides && Object.keys(overrides).length) {
              rules.push({ selector: `.${slug(el.id)}`, declarations: styleMapToCSS(overrides), breakpoint: bp })
            }
          }
        }
      }
    }
  }

  return rules.filter(r => r.declarations.trim())
}

function buildCSS(mode: BuilderMode, rules: CSSRule[]): string {
  const baseReset = `/* BuilderPro Export — ${mode} mode */
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Inter, system-ui, sans-serif; }
img, video, iframe { max-width: 100%; display: block; }
`

  const frameworkBase = buildFrameworkBaseCSS(mode)

  const base = rules
    .filter(r => !r.breakpoint)
    .map(r => `.${r.selector.replace(/^\./, '')} {\n${r.declarations}\n}`)
    .join('\n\n')

  const tablet = rules
    .filter(r => r.breakpoint === 'tablet')
    .map(r => `.${r.selector.replace(/^\./, '')} {\n${r.declarations}\n}`)
    .join('\n\n')

  const mobile = rules
    .filter(r => r.breakpoint === 'mobile')
    .map(r => `.${r.selector.replace(/^\./, '')} {\n${r.declarations}\n}`)
    .join('\n\n')

  let css = baseReset + '\n' + frameworkBase

  if (base) css += '\n/* Custom styles */\n' + base
  if (tablet) css += `\n\n@media (max-width: ${BP.tablet}px) {\n${tablet}\n}`
  if (mobile) css += `\n\n@media (max-width: ${BP.mobile}px) {\n${mobile}\n}`

  return css
}

function buildFrameworkBaseCSS(mode: BuilderMode): string {
  switch (mode) {
    case 'bootstrap':
      return '' // Bootstrap handles its own CSS via CDN

    case 'tailwind':
      return '' // Tailwind handles via CDN script

    case 'mui':
      return `/* MUI-compatible base */
.mui-root { font-family: Roboto, sans-serif; }
.mui-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.mui-row { display: flex; flex-wrap: wrap; gap: 16px; }
${Array.from({ length: 12 }, (_, i) => `.mui-col-${i + 1} { flex: 0 0 ${((i + 1) / 12) * 100}%; max-width: ${((i + 1) / 12) * 100}%; }`).join('\n')}
@media (max-width: ${BP.tablet}px) {
  .mui-row { flex-direction: column; }
  [class*="mui-col-"] { flex: 1 1 100%; max-width: 100%; }
}
`

    default: // custom
      return `/* BuilderPro Custom mode */
.bp-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.bp-row { display: flex; flex-wrap: wrap; gap: 16px; }
${Array.from({ length: 12 }, (_, i) => `.bp-col-${i + 1} { flex: 0 0 ${((i + 1) / 12) * 100}%; max-width: ${((i + 1) / 12) * 100}%; }`).join('\n')}
.bp-col { flex: 1; min-width: 0; }
@media (max-width: ${BP.tablet}px) {
  .bp-row { flex-direction: column; }
  [class*="bp-col-"], .bp-col { flex: 1 1 100%; max-width: 100%; }
}
@media (max-width: ${BP.mobile}px) {
  .bp-container { padding: 0 16px; }
}

/* Navbar */
nav { display: flex; align-items: center; gap: 16px; padding: 16px 24px; }
.navbar-menu { display: flex; list-style: none; gap: 20px; margin: 0; padding: 0; }
.navbar-menu a { text-decoration: none; color: inherit; }
.navbar-toggle { display: none; background: none; border: none; cursor: pointer; font-size: 1.5rem; }
@media (max-width: ${BP.tablet}px) {
  .navbar-menu { display: none; }
  .navbar-toggle { display: block; }
}

/* Hero */
.hero, [class*="bp-hero"] { text-align: center; padding: 80px 24px; }
.hero h1, [class*="bp-hero"] h1 { margin-bottom: 16px; }

/* Card */
.card-body { padding: 16px; }

/* Form */
.form-field { margin-bottom: 16px; }
.form-field label { display: block; margin-bottom: 6px; font-weight: 500; }
.form-field input, .form-field textarea, .form-field select {
  width: 100%; padding: 10px 12px; border: 1px solid #d1d5db;
  border-radius: 6px; font-size: 1rem;
}

/* Tabs */
.tab-list { display: flex; gap: 4px; border-bottom: 1px solid #e5e7eb; margin-bottom: 16px; }
.tab-btn { background: none; border: none; padding: 8px 16px; cursor: pointer; }
.tab-btn.active { border-bottom: 2px solid currentColor; font-weight: 600; }
.tab-panel { display: none; }
.tab-panel.active { display: block; }

/* Accordion */
.accordion-trigger { width: 100%; text-align: left; background: none; border: none; padding: 12px; cursor: pointer; font-weight: 500; }
.accordion-content { display: none; padding: 0 12px 12px; }
.accordion-item.open .accordion-content { display: block; }
`
  }
}

// ─── Interactive JS ────────────────────────────────────────────────────────────

const INTERACTIVE_JS = `<script>
// Tab switcher
document.querySelectorAll('.tab-list').forEach(list => {
  list.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn')
    if (!btn) return
    const container = list.closest('[class]')
    const idx = btn.dataset.tab
    container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
    container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
    btn.classList.add('active')
    container.querySelector(\`.tab-panel[data-panel="\${idx}"]\`)?.classList.add('active')
  })
})

// Accordion
document.querySelectorAll('.accordion-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion-item')
    item.classList.toggle('open')
  })
})

// Mobile navbar
document.querySelectorAll('.navbar-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const menu = btn.closest('nav').querySelector('.navbar-menu')
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex'
    menu.style.flexDirection = 'column'
  })
})
<\/script>`

// ─── Main HTML assembler ───────────────────────────────────────────────────────

export function generateHTML(project: BuilderProject): string {
  const fw = frameworkMeta(project.mode)
  const cssRules = collectCSSRules(project)
  const css = buildCSS(project.mode, cssRules)

  const body = project.sections.map(s => renderSection(s, fw)).join('\n\n')

  const iconsCDN = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(project.name)}</title>
  ${iconsCDN}
  ${fw.head}
  <link rel="stylesheet" href="styles.css">
</head>
<body${fw.bodyClass ? ` class="${fw.bodyClass}"` : ''}>

${body}

${INTERACTIVE_JS}
</body>
</html>`
}

export function generateCSS(project: BuilderProject): string {
  const cssRules = collectCSSRules(project)
  return buildCSS(project.mode, cssRules)
}

// ─── Escape helpers ───────────────────────────────────────────────────────────

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escAttr(str: string): string {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function extractYoutubeId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m?.[1] ?? url
}

function extractVimeoId(url: string): string {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m?.[1] ?? url
}
