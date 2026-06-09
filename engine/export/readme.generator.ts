/**
 * README Generator — BuilderPro
 *
 * Generates a README.md included in every export ZIP.
 * Content adapts to the target platform, builder mode, and language choice.
 */

import type { BuilderMode } from '@/types/builder.types'
import type { OutputPlatform } from '@/types/store.types'
import { resolveDesignTokens } from './tokens.generator'
import type { ProjectBranding } from '@/types/store.types'

const MODE_LABELS: Record<BuilderMode, string> = {
  bootstrap: 'Bootstrap',
  mui:       'MUI (Material UI)',
  tailwind:  'Tailwind CSS',
  custom:    'Custom CSS',
}

const PLATFORM_LABELS: Record<OutputPlatform, string> = {
  react:   'React',
  vue:     'Vue 3',
  angular: 'Angular',
  html:    'HTML / CSS',
}

// ─── Dev commands per platform ───────────────────────────────────────────────

function devCommands(platform: OutputPlatform): {
  install: string
  dev: string
  build: string
  nodeNote: string
} {
  if (platform === 'angular') {
    return {
      install:  'npm install',
      dev:      'ng serve',
      build:    'ng build',
      nodeNote: 'Node.js 18+ and npm 9+ required. Install Angular CLI: npm install -g @angular/cli',
    }
  }
  return {
    install:  'npm install',
    dev:      'npm run dev',
    build:    'npm run build',
    nodeNote: 'Node.js 18+ and npm 9+ required.',
  }
}

// ─── Folder structure diagram per platform ───────────────────────────────────

function folderStructure(
  platform: OutputPlatform,
  lang: 'typescript' | 'javascript',
  componentNames: string[],
): string {
  const ext = lang === 'typescript'
    ? (platform === 'react' ? 'tsx' : platform === 'vue' ? 'vue' : 'ts')
    : (platform === 'react' ? 'jsx' : platform === 'vue' ? 'vue' : 'ts')

  if (platform === 'react' || platform === 'vue') {
    const comps = componentNames
      .map((n) => `  │   ├── ${n}.${ext}`)
      .join('\n')
    return `src/
  ├── components/
${comps}
  ├── App.${ext}
  ├── main.${lang === 'typescript' ? 'ts' : 'js'}
  └── tokens.${lang === 'typescript' ? 'ts' : 'js'}`
  }

  if (platform === 'angular') {
    const comps = componentNames
      .map((n) => {
        const kebab = n.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`).replace(/^-/, '')
        return `  │   ├── ${kebab}/\n  │   │   ├── ${kebab}.component.ts\n  │   │   ├── ${kebab}.component.html\n  │   │   └── ${kebab}.component.scss`
      })
      .join('\n')
    return `src/
  ├── app/
  │   ├── components/
${comps}
  │   ├── app.component.ts
  │   └── app.module.ts
  ├── tokens.scss
  └── styles.scss`
  }

  // HTML
  return `index.html
styles.css
tokens.css
assets/
  └── images/`
}

// ─── Component list ───────────────────────────────────────────────────────────

function componentList(componentNames: string[], platform: OutputPlatform): string {
  if (componentNames.length === 0) return '_No components — single file output._'
  const lines = componentNames.map((n, i) => `- \`${n}\` — Section ${i + 1}`)
  if (componentNames.length > 10) {
    return lines.slice(0, 10).join('\n') + `\n- … and ${componentNames.length - 10} more`
  }
  return lines.join('\n')
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function generateReadme(params: {
  projectName: string
  mode: BuilderMode
  platform: OutputPlatform
  frameworkVersion: string
  lang: 'typescript' | 'javascript'
  componentNames: string[]
  branding: ProjectBranding | undefined
  exportDate: string
}): string {
  const {
    projectName, mode, platform, frameworkVersion,
    lang, componentNames, branding, exportDate,
  } = params

  const cmds = devCommands(platform)
  const structure = folderStructure(platform, lang, componentNames)
  const compList = componentList(componentNames, platform)
  const tokens = resolveDesignTokens(branding)
  const modeLabel = MODE_LABELS[mode]
  const platformLabel = PLATFORM_LABELS[platform]
  const versionStr = frameworkVersion ? ` ${frameworkVersion}` : ''

  const angularNote = platform === 'angular'
    ? `\n> **Note:** This project uses Angular 17+ standalone components. Run \`ng serve\` to start the dev server.\n`
    : ''

  const stackblitzNote = (platform === 'react' || platform === 'vue')
    ? `\n## ⚡ Open in StackBlitz\n\nYou can open this project directly in the browser — no local install needed:\n[Open in StackBlitz](https://stackblitz.com)\n_(Drag and drop this ZIP into StackBlitz or use the SDK button in BuilderPro)_\n`
    : ''

  return `# ${projectName}

> Built with [BuilderPro](https://ui-builder-orpin.vercel.app) — Export date: ${exportDate}

## Stack

| | |
|---|---|
| **Builder Mode** | ${modeLabel}${versionStr} |
| **Output** | ${platformLabel} |
| **Language** | ${lang === 'typescript' ? 'TypeScript' : 'JavaScript'} |
${angularNote}
## Prerequisites

${cmds.nodeNote}

## Getting Started

\`\`\`bash
# 1. Install dependencies
${cmds.install}

# 2. Start the development server
${cmds.dev}

# 3. Build for production
${cmds.build}
\`\`\`
${stackblitzNote}
## Project Structure

\`\`\`
${structure}
\`\`\`

## Components

${compList}

## Design Tokens

Your project's design tokens are available in \`tokens.${platform === 'angular' ? 'scss' : platform === 'html' ? 'css' : lang === 'typescript' ? 'ts' : 'js'}\`.

| Token | Value |
|---|---|
| Primary Color | \`${tokens.colorPrimary}\` |
| Secondary Color | \`${tokens.colorSecondary}\` |
| Font | \`${tokens.fontPrimary}\` |
| Base Spacing | \`${tokens.spacing4}\` |
| Border Radius | \`${tokens.radiusMd}\` |

## Notes

- Exported from **BuilderPro** on ${exportDate}
- Framework version locked at export time: **${modeLabel}${versionStr}**
- Dependency versions in \`package.json\` are exact (no \`^\` or \`~\`) for reproducible installs

---

Built with **[BuilderPro](https://ui-builder-orpin.vercel.app)** — Visual website builder for developers and designers.
`
}
