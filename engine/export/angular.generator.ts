/**
 * Angular Generator — BuilderPro
 *
 * Generates a full scaffolded Angular 17+ standalone project FileMap.
 * Supports Bootstrap (ng-bootstrap), MUI (Angular Material), and Tailwind modes.
 * All components use standalone: true (Angular 17+ default).
 * Custom mode is NOT supported — callers must guard before calling.
 */

import type {
  BuilderProject,
  BuilderSection,
  BuilderRow,
  BuilderColumn,
  BuilderElement,
  BuilderMode,
  ElementContent,
} from '@/types/builder.types'
import type { ProjectBranding } from '@/types/store.types'
import { generateTokensFile } from './tokens.generator'
import { generateReadme } from './readme.generator'
import { getExportDependencies, getExportDevDependencies } from '@/lib/versionRegistry'
import type { FileMap } from './react.generator'

// ─── Helpers ────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** camelCase → kebab-case */
function toKebab(name: string): string {
  return name
    .replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
    .replace(/^-/, '')
}

// ─── Element → Angular template HTML ─────────────────────────────────────────

function elementToAngular(el: BuilderElement, mode: BuilderMode, indent = '      '): string {
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
        return `${indent}<a href="${esc(c.href)}"${id} mat-raised-button color="primary"${cls}>${esc(c.text)}</a>`
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
${indent}    [src]="sanitize('${esc(c.src)}')"
${indent}    class="absolute inset-0 w-full h-full"
${indent}    frameborder="0"
${indent}    allowfullscreen
${indent}    loading="lazy"
${indent}  ></iframe>
${indent}</div>`

    case 'divider':
      return `${indent}<hr${id}${cls} />`

    case 'spacer':
      return `${indent}<div${id}${cls} [style.height]="'${c.height}'" aria-hidden="true"></div>`

    case 'icon':
      return `${indent}<i${id} class="bi bi-${c.name}${el.classNames ? ` ${el.classNames}` : ''}" [style.fontSize]="'${c.size}'" [style.color]="'${c.color}'"></i>`

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
${indent}  <img *ngIf="${JSON.stringify(!!c.image.src)}" src="${esc(c.image.src)}" alt="${esc(c.image.alt)}" class="w-full h-48 object-cover" loading="lazy" />
${indent}  <div class="p-6">
${indent}    <h3 class="text-lg font-semibold mb-2">${esc(c.title)}</h3>
${indent}    <p class="text-gray-600 mb-4">${esc(c.description)}</p>
${indent}    <a *ngIf="${JSON.stringify(!!c.button)}" href="${esc(c.button?.href ?? '#')}" class="text-indigo-600 font-medium hover:underline">${esc(c.button?.text ?? 'Learn more')}</a>
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
      return `${indent}<form${id}${cls} (ngSubmit)="onSubmit()" class="max-w-lg mx-auto">
${fields}
${indent}  <button type="submit" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">${esc(c.submitLabel)}</button>
${indent}</form>`
    }

    default:
      return `${indent}<div${id}${cls} data-element-type="${(c as ElementContent).type}"></div>`
  }
}

// ─── Column → template ───────────────────────────────────────────────────────

function columnToAngular(col: BuilderColumn, mode: BuilderMode): string {
  const elements = col.elements.map((el) => elementToAngular(el, mode)).join('\n')
  const span = col.span?.desktop

  if (mode === 'bootstrap') {
    const cls = span ? `col-lg-${span}` : 'col'
    return `        <div class="${cls}${col.classNames ? ` ${col.classNames}` : ''}">\n${elements}\n        </div>`
  }
  if (mode === 'mui') {
    return `        <div${col.classNames ? ` class="${col.classNames}"` : ''} fxFlex="${span ? Math.round((span / 12) * 100) : 50}">\n${elements}\n        </div>`
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

function rowToAngular(row: BuilderRow, mode: BuilderMode): string {
  const cols = row.columns.filter((c) => !c.managedBy).map((c) => columnToAngular(c, mode)).join('\n')
  if (mode === 'bootstrap') {
    return `      <div class="row${row.classNames ? ` ${row.classNames}` : ''}">\n${cols}\n      </div>`
  }
  if (mode === 'mui') {
    return `      <div fxLayout="row wrap" fxLayoutGap="16px"${row.classNames ? ` class="${row.classNames}"` : ''}>\n${cols}\n      </div>`
  }
  return `      <div class="flex flex-wrap -mx-4${row.classNames ? ` ${row.classNames}` : ''}">\n${cols}\n      </div>`
}

// ─── Section → Angular standalone component ───────────────────────────────────

interface AngularComponentFiles {
  ts: string
  html: string
  scss: string
}

function sectionToAngularComponent(
  section: BuilderSection,
  componentName: string,
  mode: BuilderMode,
): AngularComponentFiles {
  const kebab = toKebab(componentName)
  const rows = section.rows.map((r) => rowToAngular(r, mode)).join('\n')

  // Build imports list for the component
  const ngImports: string[] = ['CommonModule']
  if (mode === 'bootstrap') {
    ngImports.push('NgbModule')
  }
  if (mode === 'mui') {
    ngImports.push('MatButtonModule', 'MatCardModule', 'FlexLayoutModule')
  }

  const importsLine = ngImports.join(', ')

  // TypeScript file
  const ts = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
${mode === 'bootstrap' ? "import { NgbModule } from '@ng-bootstrap/ng-bootstrap';" : ''}${mode === 'mui' ? `import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';` : ''}

@Component({
  selector: 'app-${kebab}',
  standalone: true,
  imports: [${importsLine}],
  templateUrl: './${kebab}.component.html',
  styleUrls: ['./${kebab}.component.scss'],
})
export class ${componentName}Component {
  onSubmit(): void {
    // Handle form submission
  }
}
`

  // HTML template
  const containerOpen = mode === 'bootstrap'
    ? `    <div class="container">\n`
    : mode === 'mui'
    ? `    <div class="mat-container">\n`
    : `    <div class="container mx-auto px-4">\n`

  const html = `<section>
${containerOpen}${rows}
    </div>
</section>
`

  // SCSS
  const scss = `// ${componentName} — generated by BuilderPro
:host {
  display: block;
}
`

  return { ts, html, scss }
}

// ─── app.component.ts ─────────────────────────────────────────────────────────

function generateAppComponent(componentNames: string[], mode: BuilderMode): {
  ts: string
  html: string
  scss: string
} {
  const kebabs = componentNames.map(toKebab)

  const importLines = componentNames.map((name) => {
    const kebab = toKebab(name)
    return `import { ${name}Component } from './components/${kebab}/${kebab}.component';`
  }).join('\n')

  const componentImports = componentNames.map((n) => `${n}Component`).join(', ')

  let extraImports = ''
  let extraModules = ''

  if (mode === 'bootstrap') {
    extraImports = `import { NgbModule } from '@ng-bootstrap/ng-bootstrap';`
    extraModules = ', NgbModule'
  } else if (mode === 'mui') {
    extraImports = `import { MatToolbarModule } from '@angular/material/toolbar';`
    extraModules = ', MatToolbarModule'
  }

  const ts = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
${importLines}
${extraImports}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ${componentImports}${extraModules}],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'builderpro-export';
}
`

  const sections = kebabs.map((k) => `  <app-${k}></app-${k}>`).join('\n')
  const html = `<main>\n${sections}\n</main>\n`
  const scss = `:host { display: block; }\nmain { width: 100%; }\n`

  return { ts, html, scss }
}

// ─── main.ts ─────────────────────────────────────────────────────────────────

function generateMainTs(): string {
  return `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [],
}).catch((err) => console.error(err));
`
}

// ─── index.html ──────────────────────────────────────────────────────────────

function generateIndexHtml(projectName: string, mode: BuilderMode): string {
  const materialLink = mode === 'mui'
    ? '\n    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />'
    : ''
  const biLink = `\n    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />`

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${projectName}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />${materialLink}${biLink}
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
`
}

// ─── tsconfig.json ────────────────────────────────────────────────────────────

const TSCONFIG_APP = JSON.stringify({
  extends: './tsconfig.json',
  compilerOptions: {
    outDir: './out-tsc/app',
    types: [],
  },
  files: ['src/main.ts'],
  include: ['src/**/*.d.ts'],
}, null, 2)

const TSCONFIG_BASE = JSON.stringify({
  compileOnSave: false,
  compilerOptions: {
    baseUrl: './',
    outDir: './dist/out-tsc',
    forceConsistentCasingInFileNames: true,
    strict: true,
    noImplicitOverride: true,
    noPropertyAccessFromIndexSignature: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    sourceMap: true,
    declaration: false,
    downlevelIteration: true,
    experimentalDecorators: true,
    moduleResolution: 'node',
    importHelpers: true,
    target: 'ES2022',
    module: 'ES2022',
    useDefineForClassFields: false,
    lib: ['ES2022', 'dom'],
  },
  angularCompilerOptions: {
    enableI18nLegacyMessageIdFormat: false,
    strictInjectionParameters: true,
    strictInputAccessModifiers: true,
    strictTemplates: true,
  },
}, null, 2)

// ─── angular.json ─────────────────────────────────────────────────────────────

function generateAngularJson(projectName: string): string {
  const name = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'builderpro-export'
  return JSON.stringify({
    $schema: './node_modules/@angular/cli/lib/config/schema.json',
    version: 1,
    newProjectRoot: 'projects',
    projects: {
      [name]: {
        projectType: 'application',
        schematics: {
          '@schematics/angular:component': {
            style: 'scss',
            standalone: true,
          },
        },
        root: '',
        sourceRoot: 'src',
        prefix: 'app',
        architect: {
          build: {
            builder: '@angular-devkit/build-angular:application',
            options: {
              outputPath: 'dist/' + name,
              index: 'src/index.html',
              browser: 'src/main.ts',
              polyfills: ['zone.js'],
              tsConfig: 'tsconfig.app.json',
              assets: ['src/favicon.ico', 'src/assets'],
              styles: ['src/styles.scss'],
              scripts: [],
            },
            configurations: {
              production: {
                budgets: [
                  { type: 'initial', maximumWarning: '500kb', maximumError: '1mb' },
                  { type: 'anyComponentStyle', maximumWarning: '2kb', maximumError: '4kb' },
                ],
                outputHashing: 'all',
              },
              development: { optimization: false, extractLicenses: false, sourceMap: true },
            },
            defaultConfiguration: 'production',
          },
          serve: {
            builder: '@angular-devkit/build-angular:dev-server',
            configurations: {
              production: { buildTarget: name + ':build:production' },
              development: { buildTarget: name + ':build:development' },
            },
            defaultConfiguration: 'development',
          },
        },
      },
    },
  }, null, 2)
}

// ─── styles.scss ─────────────────────────────────────────────────────────────

function generateStylesScss(mode: BuilderMode): string {
  if (mode === 'bootstrap') {
    return `@use 'tokens' as *;\n\n@import 'bootstrap/scss/bootstrap';\n\n*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 0; font-family: $font-primary; }\nimg { max-width: 100%; display: block; }\n`
  }
  if (mode === 'mui') {
    return `@use 'tokens' as *;\n@import '~@angular/material/prebuilt-themes/indigo-pink.css';\n\n*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 0; font-family: $font-primary; }\n`
  }
  // Tailwind
  return `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`
}

// ─── tailwind.config.js ───────────────────────────────────────────────────────

const TAILWIND_CONFIG_ANGULAR = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: { extend: {} },
  plugins: [],
}
`

const POSTCSS_CONFIG_ANGULAR = `module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
`

// ─── package.json ────────────────────────────────────────────────────────────

function generatePackageJson(
  projectName: string,
  mode: BuilderMode,
  frameworkVersion: string,
): string {
  const name = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'builderpro-export'
  const deps = getExportDependencies(mode, 'angular', frameworkVersion)
  const devDeps = getExportDevDependencies(mode, 'angular', 'typescript')
  return JSON.stringify({
    name,
    version: '0.1.0',
    private: true,
    scripts: {
      'ng': 'ng',
      'start': 'ng serve',
      'build': 'ng build',
      'test': 'ng test',
    },
    dependencies: deps,
    devDependencies: devDeps,
  }, null, 2)
}

const GITIGNORE = `node_modules\ndist\n.angular\n.env\n.env.local\n`

// ─── Public API ──────────────────────────────────────────────────────────────

export interface AngularGeneratorParams {
  project: BuilderProject
  componentNames: string[]
  frameworkVersion: string
  branding: ProjectBranding | undefined
}

export function generateAngularProject(params: AngularGeneratorParams): FileMap {
  const { project, componentNames, frameworkVersion, branding } = params
  const { mode, name: projectName, sections } = project

  const files: FileMap = {}

  // ── Standalone components ──
  sections.forEach((section, i) => {
    const name = componentNames[i] ?? `Section${i + 1}`
    const kebab = toKebab(name)
    const { ts, html, scss } = sectionToAngularComponent(section, name, mode)
    files[`src/app/components/${kebab}/${kebab}.component.ts`]   = ts
    files[`src/app/components/${kebab}/${kebab}.component.html`] = html
    files[`src/app/components/${kebab}/${kebab}.component.scss`] = scss
  })

  // ── App component ──
  const appComp = generateAppComponent(componentNames, mode)
  files['src/app/app.component.ts']   = appComp.ts
  files['src/app/app.component.html'] = appComp.html
  files['src/app/app.component.scss'] = appComp.scss

  // ── main.ts ──
  files['src/main.ts'] = generateMainTs()

  // ── index.html ──
  files['src/index.html'] = generateIndexHtml(projectName, mode)

  // ── Styles ──
  files['src/styles.scss'] = generateStylesScss(mode)

  // ── Tokens ──
  const tokensFile = generateTokensFile({ branding, platform: 'angular', lang: 'typescript' })
  files[tokensFile.filename] = tokensFile.content

  // ── Tailwind ──
  if (mode === 'tailwind') {
    files['tailwind.config.js'] = TAILWIND_CONFIG_ANGULAR
    files['postcss.config.js']  = POSTCSS_CONFIG_ANGULAR
  }

  // ── tsconfig ──
  files['tsconfig.json']     = TSCONFIG_BASE
  files['tsconfig.app.json'] = TSCONFIG_APP

  // ── angular.json ──
  files['angular.json'] = generateAngularJson(projectName)

  // ── package.json ──
  files['package.json'] = generatePackageJson(projectName, mode, frameworkVersion)
  files['.gitignore']   = GITIGNORE

  // ── README ──
  files['README.md'] = generateReadme({
    projectName, mode, platform: 'angular', frameworkVersion, lang: 'typescript',
    componentNames, branding,
    exportDate: new Date().toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    }),
  })

  return files
}
