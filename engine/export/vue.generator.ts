/**
 * Vue Generator — BuilderPro
 *
 * Generates a full scaffolded Vue 3 project FileMap from BuilderProject.
 * Supports Bootstrap (bootstrap-vue-next), MUI (Vuetify 3), and Tailwind modes.
 * Custom mode is NOT supported — callers must guard before calling.
 */

import type { BuilderProject, BuilderSection, BuilderRow, BuilderColumn, BuilderElement, BuilderMode, ElementContent } from '@/types/builder.types'
import type { ProjectBranding } from '@/types/store.types'
import { generateTokensFile } from './tokens.generator'
import { generateReadme } from './readme.generator'
import { getExportDependencies, getExportDevDependencies } from '@/lib/versionRegistry'
import type { FileMap, Lang } from './react.generator'

// ─── Helpers ────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ─── Element → Vue template HTML ─────────────────────────────────────────────

function elementToVue(el: BuilderElement, mode: BuilderMode, indent = '      '): string {
  const c = el.content
  const cls = el.classNames ? ` class="${el.classNames}"` : ''
  const id = el.htmlId ? ` id="${el.htmlId}"` : ''

  switch (c.type) {
    case 'heading':
      return `${indent}<${c.level}${id}${cls}>${esc(c.text)}</${c.level}>`

    case 'paragraph':
      return `${indent}<p${id}${cls}>${esc(c.text)}</p>`

    case 'button': {
      if (mode === 'bootstrap') {
        return `${indent}<a href="${esc(c.href)}"${id} class="btn btn-primary${el.classNames ? ` ${el.classNames}` : ''}">${esc(c.text)}</a>`
      }
      if (mode === 'mui') {
        return `${indent}<v-btn color="primary" href="${esc(c.href)}"${id}${cls}>${esc(c.text)}</v-btn>`
      }
      return `${indent}<a href="${esc(c.href)}"${id} class="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors${el.classNames ? ` ${el.classNames}` : ''}">${esc(c.text)}</a>`
    }

    case 'image':
      if (!c.src) return `${indent}<div${id}${cls} class="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-400">No image</div>`
      return `${indent}<img src="${esc(c.src)}" alt="${esc(c.alt)}"${id}${cls} class="max-w-full h-auto${el.classNames ? ` ${el.classNames}` : ''}" loading="lazy" />`

    case 'video':
      if (!c.src) return `${indent}<div${id}${cls}>Video placeholder</div>`
      return `${indent}<div${id}${cls} class="relative w-full" style="padding-bottom: 56.25%">
${indent}  <iframe
${indent}    src="${esc(c.src)}"
${indent}    class="absolute inset-0 w-full h-full"
${indent}    frameborder="0"
${indent}    allowfullscreen
${indent}    loading="lazy"
${indent}  />
${indent}</div>`

    case 'divider':
      return `${indent}<hr${id}${cls} />`

    case 'spacer':
      return `${indent}<div${id}${cls} :style="{ height: '${c.height}' }" aria-hidden="true" />`

    case 'icon':
      return `${indent}<i${id} class="bi bi-${c.name}${el.classNames ? ` ${el.classNames}` : ''}" :style="{ fontSize: '${c.size}', color: '${c.color}' }" />`

    case 'navbar': {
      const items = c.items.map((item) =>
        `${indent}    <li><a href="${esc(item.href)}">${esc(item.label)}</a></li>`
      ).join('\n')
      return `${indent}<nav${id}${cls} class="flex items-center justify-between px-6 py-4 border-b">
${indent}  <a href="/" class="font-bold text-lg">${esc(c.logoText || 'Logo')}</a>
${indent}  <ul class="flex gap-6 list-none m-0 p-0">
${items}
${indent}  </ul>
${indent}</nav>`
    }

    case 'hero':
      return `${indent}<div${id}${cls} class="text-center py-20">
${indent}  <h1 class="text-5xl font-bold mb-4">${esc(c.heading)}</h1>
${indent}  <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">${esc(c.paragraph)}</p>
${indent}  <a href="${esc(c.cta.href)}" class="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">${esc(c.cta.text)}</a>
${indent}</div>`

    case 'card':
      return `${indent}<div${id}${cls} class="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
${indent}  <img v-if="${JSON.stringify(!!c.image.src)}" src="${esc(c.image.src)}" alt="${esc(c.image.alt)}" class="w-full h-48 object-cover" loading="lazy" />
${indent}  <div class="p-6">
${indent}    <h3 class="text-lg font-semibold mb-2">${esc(c.title)}</h3>
${indent}    <p class="text-gray-600 mb-4">${esc(c.description)}</p>
${indent}    <a v-if="${JSON.stringify(!!c.button)}" href="${esc(c.button?.href ?? '#')}" class="text-indigo-600 font-medium hover:underline">${esc(c.button?.text ?? 'Learn more')}</a>
${indent}  </div>
${indent}</div>`

    case 'footer': {
      const links = c.links.map((l) =>
        `${indent}  <a href="${esc(l.href)}" class="text-gray-500 hover:text-gray-700">${esc(l.label)}</a>`
      ).join('\n')
      return `${indent}<footer${id}${cls} class="py-12 border-t">
${indent}  <div class="flex flex-wrap gap-6 justify-center mb-6">
${links}
${indent}  </div>
${indent}  <p class="text-center text-gray-400 text-sm">${esc(c.copyright)}</p>
${indent}</footer>`
    }

    case 'form': {
      const fields = c.fields.map((f) => {
        if (f.type === 'textarea') {
          return `${indent}  <div class="mb-4">
${indent}    <label class="block text-sm font-medium mb-1">${esc(f.label)}</label>
${indent}    <textarea name="${f.id}" placeholder="${esc(f.placeholder ?? '')}"${f.required ? ' required' : ''} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none resize-y" rows="4"></textarea>
${indent}  </div>`
        }
        return `${indent}  <div class="mb-4">
${indent}    <label class="block text-sm font-medium mb-1">${esc(f.label)}</label>
${indent}    <input type="${f.type}" name="${f.id}" placeholder="${esc(f.placeholder ?? '')}"${f.required ? ' required' : ''} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none" />
${indent}  </div>`
      }).join('\n')
      return `${indent}<form${id}${cls} class="max-w-lg mx-auto">
${fields}
${indent}  <button type="submit" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">${esc(c.submitLabel)}</button>
${indent}</form>`
    }

    default:
      return `${indent}<div${id}${cls} data-element-type="${(c as ElementContent).type}"></div>`
  }
}

// ─── Column → template ───────────────────────────────────────────────────────

function columnToVue(col: BuilderColumn, mode: BuilderMode): string {
  const elements = col.elements.map((el) => elementToVue(el, mode)).join('\n')
  const span = col.span?.desktop

  if (mode === 'bootstrap') {
    const cls = span ? `col-lg-${span}` : 'col'
    return `        <BCol lg="${span ?? 'auto'}"${col.classNames ? ` class="${col.classNames}"` : ''}>\n${elements}\n        </BCol>`
  }
  if (mode === 'mui') {
    return `        <v-col cols="12" md="${span ?? 6}"${col.classNames ? ` class="${col.classNames}"` : ''}>\n${elements}\n        </v-col>`
  }
  // Tailwind
  const twCls = span ? `w-full md:w-${tailwindFraction(span)}` : 'flex-1'
  return `        <div class="${twCls} px-4${col.classNames ? ` ${col.classNames}` : ''}">\n${elements}\n        </div>`
}

function tailwindFraction(span: number): string {
  const map: Record<number, string> = {
    1: '1/12', 2: '1/6', 3: '1/4', 4: '1/3', 5: '5/12', 6: '1/2',
    7: '7/12', 8: '2/3', 9: '3/4', 10: '5/6', 11: '11/12', 12: 'full',
  }
  return map[span] ?? '1/2'
}

// ─── Row → template ──────────────────────────────────────────────────────────

function rowToVue(row: BuilderRow, mode: BuilderMode): string {
  const cols = row.columns.filter((c) => !c.managedBy).map((c) => columnToVue(c, mode)).join('\n')
  if (mode === 'bootstrap') {
    return `      <BRow${row.classNames ? ` class="${row.classNames}"` : ''}>\n${cols}\n      </BRow>`
  }
  if (mode === 'mui') {
    return `      <v-row${row.classNames ? ` class="${row.classNames}"` : ''}>\n${cols}\n      </v-row>`
  }
  return `      <div class="flex flex-wrap -mx-4${row.classNames ? ` ${row.classNames}` : ''}">\n${cols}\n      </div>`
}

// ─── Section → .vue SFC ──────────────────────────────────────────────────────

function sectionToVueSFC(
  section: BuilderSection,
  name: string,
  mode: BuilderMode,
  lang: Lang,
): string {
  const rows = section.rows.map((r) => rowToVue(r, mode)).join('\n')
  const scriptLang = lang === 'typescript' ? ' lang="ts"' : ''

  // Container per mode
  let containerOpen: string
  let containerClose: string
  if (mode === 'bootstrap') {
    containerOpen = `    <BContainer>\n`
    containerClose = `    </BContainer>`
  } else if (mode === 'mui') {
    containerOpen = `    <v-container>\n`
    containerClose = `    </v-container>`
  } else {
    containerOpen = `    <div class="container mx-auto px-4">\n`
    containerClose = `    </div>`
  }

  return `<template>
  <section>
${containerOpen}${rows}
${containerClose}
  </section>
</template>

<script setup${scriptLang}>
// ${name} — generated by BuilderPro
</script>

<style scoped>
/* Add component-specific styles here */
</style>
`
}

// ─── App.vue ─────────────────────────────────────────────────────────────────

function generateAppVue(componentNames: string[], mode: BuilderMode, lang: Lang): string {
  const scriptLang = lang === 'typescript' ? ' lang="ts"' : ''
  const imports = componentNames
    .map((n) => `import ${n} from './components/${n}.vue'`)
    .join('\n')
  const sections = componentNames.map((n) => `  <${n} />`).join('\n')

  if (mode === 'mui') {
    return `<template>
  <v-app>
${sections}
  </v-app>
</template>

<script setup${scriptLang}>
${imports}
</script>
`
  }

  return `<template>
  <div>
${sections}
  </div>
</template>

<script setup${scriptLang}>
${imports}
</script>
`
}

// ─── main.ts ─────────────────────────────────────────────────────────────────

function generateMainTs(mode: BuilderMode, lang: Lang): string {
  const ext = lang === 'typescript' ? 'ts' : 'js'
  if (mode === 'bootstrap') {
    return `import { createApp } from 'vue'
import BootstrapVueNext from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import App from './App.vue'

const app = createApp(App)
app.use(BootstrapVueNext)
app.mount('#app')
`
  }
  if (mode === 'mui') {
    return `import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import { tokens } from './tokens'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        colors: {
          primary:   tokens.colorPrimary,
          secondary: tokens.colorSecondary,
          success:   tokens.colorAccent,
          error:     tokens.colorDanger,
        },
      },
    },
  },
})

const app = createApp(App)
app.use(vuetify)
app.mount('#app')
`
  }
  // Tailwind
  return `import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

createApp(App).mount('#app')
`
}

// ─── vite.config ─────────────────────────────────────────────────────────────

function generateViteConfig(lang: Lang): string {
  return `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})
`
}

// ─── index.html ──────────────────────────────────────────────────────────────

function generateIndexHtml(projectName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`
}

// ─── tsconfig.json ────────────────────────────────────────────────────────────

const TSCONFIG = JSON.stringify({
  compilerOptions: {
    target: 'ES2020',
    useDefineForClassFields: true,
    module: 'ESNext',
    moduleResolution: 'bundler',
    strict: true,
    jsx: 'preserve',
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,
    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
  },
  include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.tsx', 'src/**/*.vue'],
}, null, 2)

const TAILWIND_CONFIG = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
}
`

const POSTCSS_CONFIG = `export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
`

const INDEX_CSS = `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Inter, system-ui, sans-serif; }
img { max-width: 100%; display: block; }
`

const GITIGNORE = `node_modules\ndist\n.env\n.env.local\n`

// ─── package.json ────────────────────────────────────────────────────────────

function generatePackageJson(
  projectName: string,
  mode: BuilderMode,
  frameworkVersion: string,
  lang: Lang,
): string {
  const name = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'builderpro-export'
  const deps = getExportDependencies(mode, 'vue', frameworkVersion)
  const devDeps = getExportDevDependencies(mode, 'vue', lang)
  const scripts: Record<string, string> = {
    dev: 'vite',
    build: lang === 'typescript' ? 'vue-tsc && vite build' : 'vite build',
    preview: 'vite preview',
  }
  return JSON.stringify({ name, version: '0.1.0', private: true, type: 'module', scripts, dependencies: deps, devDependencies: devDeps }, null, 2)
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface VueGeneratorParams {
  project: BuilderProject
  componentNames: string[]
  lang: Lang
  frameworkVersion: string
  branding: ProjectBranding | undefined
}

export function generateVueProject(params: VueGeneratorParams): FileMap {
  const { project, componentNames, lang, frameworkVersion, branding } = params
  const { mode, name: projectName, sections } = project

  const files: FileMap = {}

  // ── SFC components ──
  sections.forEach((section, i) => {
    const name = componentNames[i] ?? `Section${i + 1}`
    files[`src/components/${name}.vue`] = sectionToVueSFC(section, name, mode, lang)
  })

  // ── App.vue + main ──
  files['src/App.vue'] = generateAppVue(componentNames, mode, lang)
  files[`src/main.${lang === 'typescript' ? 'ts' : 'js'}`] = generateMainTs(mode, lang)
  if (mode === 'tailwind') files['src/index.css'] = INDEX_CSS

  // ── Tokens ──
  const tokensFile = generateTokensFile({ branding, platform: 'vue', lang })
  files[tokensFile.filename] = tokensFile.content

  // ── index.html ──
  files['index.html'] = generateIndexHtml(projectName)

  // ── Vite config ──
  files[`vite.config.${lang === 'typescript' ? 'ts' : 'js'}`] = generateViteConfig(lang)

  // ── TS config ──
  if (lang === 'typescript') files['tsconfig.json'] = TSCONFIG

  // ── Tailwind ──
  if (mode === 'tailwind') {
    files['tailwind.config.js'] = TAILWIND_CONFIG
    files['postcss.config.js'] = POSTCSS_CONFIG
  }

  // ── package.json ──
  files['package.json'] = generatePackageJson(projectName, mode, frameworkVersion, lang)
  files['.gitignore'] = GITIGNORE

  // ── README ──
  files['README.md'] = generateReadme({
    projectName, mode, platform: 'vue', frameworkVersion, lang,
    componentNames, branding,
    exportDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  })

  return files
}
