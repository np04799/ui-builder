/**
 * React Generator — BuilderPro
 *
 * Generates a full scaffolded React project FileMap from BuilderStoreState.
 * Supports Bootstrap, MUI, and Tailwind builder modes.
 * Custom mode is NOT supported — callers must guard before calling.
 *
 * Output: Record<filename, content> — passed to JSZip or StackBlitz SDK.
 */

import type { BuilderProject, BuilderSection, BuilderRow, BuilderColumn, BuilderElement, BuilderMode, ElementContent } from '@/types/builder.types'
import type { OutputPlatform, ProjectBranding } from '@/types/store.types'
import { generateTokensFile } from './tokens.generator'
import { generateReadme } from './readme.generator'
import { getExportDependencies, getExportDevDependencies } from '@/lib/versionRegistry'

export type FileMap = Record<string, string>
export type Lang = 'typescript' | 'javascript'

// ─── Helpers ────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

function toPascal(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('')
    || 'Section'
}

// ─── Element → JSX ──────────────────────────────────────────────────────────

function elementToJSX(el: BuilderElement, mode: BuilderMode, indent = '    '): string {
  const c = el.content
  const cls = el.classNames ? ` className="${el.classNames}"` : ''
  const id = el.htmlId ? ` id="${el.htmlId}"` : ''

  switch (c.type) {
    case 'heading':
      return `${indent}<${c.level}${id}${cls}>${esc(c.text)}</${c.level}>`

    case 'paragraph':
      return `${indent}<p${id}${cls}>${esc(c.text)}</p>`

    case 'button': {
      if (mode === 'bootstrap') {
        return `${indent}<a href="${esc(c.href)}"${id} className="btn btn-primary${el.classNames ? ` ${el.classNames}` : ''}">${esc(c.text)}</a>`
      }
      if (mode === 'mui') {
        return `${indent}<Button variant="contained" href="${esc(c.href)}"${id}${cls}>${esc(c.text)}</Button>`
      }
      // Tailwind
      return `${indent}<a href="${esc(c.href)}"${id} className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors${el.classNames ? ` ${el.classNames}` : ''}">${esc(c.text)}</a>`
    }

    case 'image':
      if (!c.src) return `${indent}<div${id}${cls} className="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-400">No image</div>`
      return `${indent}<img src="${esc(c.src)}" alt="${esc(c.alt)}"${id}${cls} className="max-w-full h-auto${el.classNames ? ` ${el.classNames}` : ''}" loading="lazy" />`

    case 'video':
      if (!c.src) return `${indent}<div${id}${cls}>Video placeholder</div>`
      return `${indent}<div${id}${cls} className="relative w-full" style={{ paddingBottom: '56.25%' }}>
${indent}  <iframe
${indent}    src="${esc(c.src)}"
${indent}    className="absolute inset-0 w-full h-full"
${indent}    frameBorder="0"
${indent}    allowFullScreen
${indent}    loading="lazy"
${indent}  />
${indent}</div>`

    case 'divider':
      return `${indent}<hr${id}${cls} />`

    case 'spacer':
      return `${indent}<div${id}${cls} style={{ height: '${esc(c.height)}' }} aria-hidden="true" />`

    case 'icon':
      return `${indent}<i${id} className="bi bi-${esc(c.name)}${el.classNames ? ` ${el.classNames}` : ''}" style={{ fontSize: '${esc(c.size)}', color: '${esc(c.color)}' }} />`

    case 'navbar': {
      const items = c.items.map((item) =>
        `${indent}    <li><a href="${esc(item.href)}" className="text-gray-700 hover:text-indigo-600">${esc(item.label)}</a></li>`
      ).join('\n')
      return `${indent}<nav${id}${cls} className="flex items-center justify-between px-6 py-4 border-b${el.classNames ? ` ${el.classNames}` : ''}">
${indent}  <a href="/" className="font-bold text-lg">${esc(c.logoText || 'Logo')}</a>
${indent}  <ul className="flex gap-6 list-none m-0 p-0">
${items}
${indent}  </ul>
${indent}</nav>`
    }

    case 'hero':
      return `${indent}<div${id}${cls} className="text-center py-20${el.classNames ? ` ${el.classNames}` : ''}">
${indent}  <h1 className="text-5xl font-bold mb-4">${esc(c.heading)}</h1>
${indent}  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">${esc(c.paragraph)}</p>
${indent}  <a href="${esc(c.cta.href)}" className="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">${esc(c.cta.text)}</a>
${indent}</div>`

    case 'card':
      return `${indent}<div${id}${cls} className="rounded-xl border border-gray-200 overflow-hidden shadow-sm${el.classNames ? ` ${el.classNames}` : ''}">
${indent}  {${JSON.stringify(c.image.src)} && <img src="${esc(c.image.src)}" alt="${esc(c.image.alt)}" className="w-full h-48 object-cover" loading="lazy" />}
${indent}  <div className="p-6">
${indent}    <h3 className="text-lg font-semibold mb-2">${esc(c.title)}</h3>
${indent}    <p className="text-gray-600 mb-4">${esc(c.description)}</p>
${indent}    {${JSON.stringify(!!c.button)} && <a href="${esc(c.button?.href ?? '#')}" className="text-indigo-600 font-medium hover:underline">${esc(c.button?.text ?? 'Learn more')}</a>}
${indent}  </div>
${indent}</div>`

    case 'footer': {
      const links = c.links.map((l) =>
        `${indent}  <a href="${esc(l.href)}" className="text-gray-500 hover:text-gray-700">${esc(l.label)}</a>`
      ).join('\n')
      return `${indent}<footer${id}${cls} className="py-12 border-t${el.classNames ? ` ${el.classNames}` : ''}">
${indent}  <div className="flex flex-wrap gap-6 justify-center mb-6">
${links}
${indent}  </div>
${indent}  <p className="text-center text-gray-400 text-sm">${esc(c.copyright)}</p>
${indent}</footer>`
    }

    case 'form': {
      const fields = c.fields.map((f) => {
        if (f.type === 'textarea') {
          return `${indent}  <div className="mb-4">
${indent}    <label className="block text-sm font-medium mb-1">${esc(f.label)}</label>
${indent}    <textarea name="${esc(f.id)}" placeholder="${esc(f.placeholder ?? '')}"${f.required ? ' required' : ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y" rows={4} />
${indent}  </div>`
        }
        return `${indent}  <div className="mb-4">
${indent}    <label className="block text-sm font-medium mb-1">${esc(f.label)}</label>
${indent}    <input type="${f.type}" name="${esc(f.id)}" placeholder="${esc(f.placeholder ?? '')}"${f.required ? ' required' : ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
${indent}  </div>`
      }).join('\n')
      return `${indent}<form${id}${cls} className="max-w-lg mx-auto${el.classNames ? ` ${el.classNames}` : ''}">
${fields}
${indent}  <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">${esc(c.submitLabel)}</button>
${indent}</form>`
    }

    default:
      return `${indent}<div${id}${cls} data-element-type="${(c as ElementContent).type}" />`
  }
}

// ─── Column → JSX ───────────────────────────────────────────────────────────

function columnToJSX(col: BuilderColumn, mode: BuilderMode): string {
  const elements = col.elements.map((el) => elementToJSX(el, mode)).join('\n')
  const span = col.span?.desktop

  if (mode === 'bootstrap') {
    const cls = span ? `col-lg-${span}` : 'col'
    return `      <div className="${cls}${col.classNames ? ` ${col.classNames}` : ''}">\n${elements}\n      </div>`
  }
  if (mode === 'mui') {
    const xs = span ? Math.round((span / 12) * 12) : 12
    const md = span ?? 6
    return `      <Grid item xs={${xs}} md={${md}}${col.classNames ? ` className="${col.classNames}"` : ''}>\n${elements}\n      </Grid>`
  }
  // Tailwind
  const twCls = span ? `w-full md:w-${fraction(span)}` : 'flex-1'
  return `      <div className="${twCls} px-4${col.classNames ? ` ${col.classNames}` : ''}">\n${elements}\n      </div>`
}

function fraction(span: number): string {
  const map: Record<number, string> = {
    1: '1/12', 2: '1/6', 3: '1/4', 4: '1/3', 5: '5/12', 6: '1/2',
    7: '7/12', 8: '2/3', 9: '3/4', 10: '5/6', 11: '11/12', 12: 'full',
  }
  return map[span] ?? '1/2'
}

// ─── Row → JSX ──────────────────────────────────────────────────────────────

function rowToJSX(row: BuilderRow, mode: BuilderMode): string {
  const cols = row.columns.filter((c) => !c.managedBy).map((c) => columnToJSX(c, mode)).join('\n')
  if (mode === 'bootstrap') {
    return `    <div className="row${row.classNames ? ` ${row.classNames}` : ''}">\n${cols}\n    </div>`
  }
  if (mode === 'mui') {
    return `    <Grid container spacing={3}${row.classNames ? ` className="${row.classNames}"` : ''}>\n${cols}\n    </Grid>`
  }
  return `    <div className="flex flex-wrap -mx-4${row.classNames ? ` ${row.classNames}` : ''}">\n${cols}\n    </div>`
}

// ─── Section → Component ─────────────────────────────────────────────────────

function sectionToComponent(
  section: BuilderSection,
  name: string,
  mode: BuilderMode,
  lang: Lang,
): string {
  const ext = lang === 'typescript' ? 'tsx' : 'jsx'
  const rows = section.rows.map((r) => rowToJSX(r, mode)).join('\n')

  // Imports per mode
  let imports = ''
  if (mode === 'bootstrap') {
    imports = `import { Container, Row, Col } from 'react-bootstrap'\n`
  } else if (mode === 'mui') {
    imports = `import { Container, Grid, Box } from '@mui/material'\n`
  }

  // Check if any element uses MUI-specific components
  const hasMuiButton = mode === 'mui' && JSON.stringify(section).includes('"button"')
  if (hasMuiButton && mode === 'mui') {
    imports += `import { Button, Typography } from '@mui/material'\n`
  }

  const containerOpen = mode === 'bootstrap'
    ? `  <Container>\n`
    : mode === 'mui'
    ? `  <Container maxWidth="lg">\n`
    : `  <div className="container mx-auto px-4">\n`
  const containerClose = mode === 'bootstrap' || mode === 'mui'
    ? `  </Container>`
    : `  </div>`

  const typeAnnotation = lang === 'typescript' ? ': React.FC' : ''

  return `${imports}
export default function ${name}()${typeAnnotation} {
  return (
    <section>
${containerOpen}${rows}
${containerClose}
    </section>
  )
}
`
}

// ─── App.tsx ─────────────────────────────────────────────────────────────────

function generateApp(componentNames: string[], mode: BuilderMode, lang: Lang): string {
  const ext = lang === 'typescript' ? 'tsx' : 'jsx'
  const imports = componentNames
    .map((n) => `import ${n} from './components/${n}'`)
    .join('\n')

  const muiTheme = mode === 'mui' ? `
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { tokens } from './tokens'

const theme = createTheme({
  palette: {
    primary: { main: tokens.colorPrimary },
    secondary: { main: tokens.colorSecondary },
  },
  typography: {
    fontFamily: tokens.fontPrimary,
  },
})
` : ''

  const sections = componentNames.map((n) => `      <${n} />`).join('\n')

  if (mode === 'mui') {
    return `import React from 'react'
${imports}
${muiTheme}
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
${sections}
    </ThemeProvider>
  )
}
`
  }

  const bootstrapImport = mode === 'bootstrap' ? `import 'bootstrap/dist/css/bootstrap.min.css'\n` : ''

  return `import React from 'react'
${bootstrapImport}${imports}

export default function App() {
  return (
    <>
${sections}
    </>
  )
}
`
}

// ─── main.tsx ────────────────────────────────────────────────────────────────

function generateMain(lang: Lang): string {
  const ext = lang === 'typescript' ? 'tsx' : 'jsx'
  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')${lang === 'typescript' ? '!' : ''}).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
`
}

// ─── index.html ──────────────────────────────────────────────────────────────

function generateIndexHtml(projectName: string, lang: Lang): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${lang === 'typescript' ? 'tsx' : 'jsx'}"></script>
  </body>
</html>
`
}

// ─── vite.config ─────────────────────────────────────────────────────────────

function generateViteConfig(lang: Lang): string {
  const ext = lang === 'typescript' ? 'ts' : 'js'
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
`
}

// ─── tsconfig.json ────────────────────────────────────────────────────────────

const TSCONFIG = JSON.stringify({
  compilerOptions: {
    target: 'ES2020',
    useDefineForClassFields: true,
    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
    module: 'ESNext',
    skipLibCheck: true,
    moduleResolution: 'bundler',
    allowImportingTsExtensions: true,
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,
    jsx: 'react-jsx',
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
  },
  include: ['src'],
  references: [{ path: './tsconfig.node.json' }],
}, null, 2)

const TSCONFIG_NODE = JSON.stringify({
  compilerOptions: {
    composite: true,
    skipLibCheck: true,
    module: 'ESNext',
    moduleResolution: 'bundler',
    allowSyntheticDefaultImports: true,
  },
  include: ['vite.config.ts'],
}, null, 2)

// ─── index.css ───────────────────────────────────────────────────────────────

const INDEX_CSS = `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Inter, system-ui, sans-serif; }
img { max-width: 100%; display: block; }
`

// ─── tailwind.config.js ───────────────────────────────────────────────────────

const TAILWIND_CONFIG = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`

const POSTCSS_CONFIG = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`

// ─── .gitignore ───────────────────────────────────────────────────────────────

const GITIGNORE = `node_modules
dist
.env
.env.local
`

// ─── package.json ────────────────────────────────────────────────────────────

function generatePackageJson(
  projectName: string,
  mode: BuilderMode,
  frameworkVersion: string,
  lang: Lang,
): string {
  const name = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'builderpro-export'
  const deps = getExportDependencies(mode, 'react', frameworkVersion)
  const devDeps = getExportDevDependencies(mode, 'react', lang)

  const scripts: Record<string, string> = {
    dev: 'vite',
    build: lang === 'typescript' ? 'tsc && vite build' : 'vite build',
    preview: 'vite preview',
    lint: 'eslint . --ext .js,.jsx,.ts,.tsx',
  }

  return JSON.stringify({
    name,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts,
    dependencies: deps,
    devDependencies: devDeps,
  }, null, 2)
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface ReactGeneratorParams {
  project: BuilderProject
  componentNames: string[]       // parallel to project.sections — user-chosen names
  lang: Lang
  frameworkVersion: string
  branding: ProjectBranding | undefined
}

export function generateReactProject(params: ReactGeneratorParams): FileMap {
  const { project, componentNames, lang, frameworkVersion, branding } = params
  const { mode, name: projectName, sections } = project
  const ext = lang === 'typescript' ? 'tsx' : 'jsx'

  const files: FileMap = {}

  // ── Component files ──
  sections.forEach((section, i) => {
    const compName = componentNames[i] ?? `Section${i + 1}`
    files[`src/components/${compName}.${ext}`] = sectionToComponent(section, compName, mode, lang)
  })

  // ── App + main ──
  files[`src/App.${ext}`] = generateApp(componentNames, mode, lang)
  files[`src/main.${ext}`] = generateMain(lang)
  files['src/index.css'] = INDEX_CSS

  // ── Tokens ──
  const tokensFile = generateTokensFile({ branding, platform: 'react', lang })
  files[tokensFile.filename] = tokensFile.content

  // ── index.html ──
  files['index.html'] = generateIndexHtml(projectName, lang)

  // ── Vite config ──
  files[`vite.config.${lang === 'typescript' ? 'ts' : 'js'}`] = generateViteConfig(lang)

  // ── TypeScript config ──
  if (lang === 'typescript') {
    files['tsconfig.json'] = TSCONFIG
    files['tsconfig.node.json'] = TSCONFIG_NODE
  }

  // ── Tailwind config ──
  if (mode === 'tailwind') {
    files['tailwind.config.js'] = TAILWIND_CONFIG
    files['postcss.config.js'] = POSTCSS_CONFIG
  }

  // ── package.json ──
  files['package.json'] = generatePackageJson(projectName, mode, frameworkVersion, lang)

  // ── .gitignore ──
  files['.gitignore'] = GITIGNORE

  // ── README ──
  files['README.md'] = generateReadme({
    projectName,
    mode,
    platform: 'react',
    frameworkVersion,
    lang,
    componentNames,
    branding,
    exportDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  })

  return files
}
