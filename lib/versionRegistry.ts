/**
 * Version Registry — BuilderPro
 *
 * Resolves the latest stable npm version for each UI framework at project-creation time.
 * Versions are cached in localStorage (24h TTL) to avoid hammering npm registry.
 * Falls back to hardcoded minimums if the registry is unreachable.
 *
 * Usage (client-side only):
 *   const version = await resolveFrameworkVersion('bootstrap')
 *   // → "5.3.3"
 */

import type { BuilderMode } from '@/types/builder.types'

// ─── Fallback versions (updated periodically — used when npm is unreachable) ──

const FALLBACK_VERSIONS: Record<BuilderMode, string> = {
  bootstrap: '5.3.3',
  mui:       '6.4.0',
  tailwind:  '3.4.17',
  custom:    '',        // Custom mode has no framework package
}

/** The primary npm package name to version-check per builder mode */
const MODE_PACKAGE: Record<BuilderMode, string | null> = {
  bootstrap: 'bootstrap',
  mui:       '@mui/material',
  tailwind:  'tailwindcss',
  custom:    null,
}

const CACHE_KEY = (pkg: string) => `builderpro_version_${pkg}`
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24h

interface CacheEntry {
  version: string
  resolvedAt: number
}

function readCache(pkg: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CACHE_KEY(pkg))
    if (!raw) return null
    const entry: CacheEntry = JSON.parse(raw)
    if (Date.now() - entry.resolvedAt > CACHE_TTL_MS) return null
    return entry.version
  } catch {
    return null
  }
}

function writeCache(pkg: string, version: string) {
  if (typeof window === 'undefined') return
  try {
    const entry: CacheEntry = { version, resolvedAt: Date.now() }
    localStorage.setItem(CACHE_KEY(pkg), JSON.stringify(entry))
  } catch {
    // localStorage quota — ignore
  }
}

/**
 * Fetch the latest stable version of an npm package.
 * Uses the public npm registry API — no auth required.
 */
async function fetchLatestVersion(pkg: string): Promise<string> {
  const cached = readCache(pkg)
  if (cached) return cached

  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg)}/latest`, {
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) throw new Error(`npm registry ${res.status}`)
    const data = await res.json()
    const version: string = data.version
    writeCache(pkg, version)
    return version
  } catch {
    // Network offline or registry error — return null to trigger fallback
    return ''
  }
}

/**
 * Resolve the locked stable framework version for a builder mode.
 * Returns empty string for Custom mode (no framework package).
 */
export async function resolveFrameworkVersion(mode: BuilderMode): Promise<string> {
  if (mode === 'custom') return ''
  const pkg = MODE_PACKAGE[mode]
  if (!pkg) return ''

  const fetched = await fetchLatestVersion(pkg)
  return fetched || FALLBACK_VERSIONS[mode]
}

/**
 * Human-readable label for display in the wizard and export modal.
 * e.g. "Bootstrap 5.3.3"
 */
export function frameworkVersionLabel(mode: BuilderMode, version: string): string {
  const labels: Record<BuilderMode, string> = {
    bootstrap: 'Bootstrap',
    mui:       'MUI',
    tailwind:  'Tailwind CSS',
    custom:    'Custom',
  }
  if (!version) return labels[mode]
  return `${labels[mode]} ${version}`
}

/**
 * Dependency map written into package.json at export time.
 * Returns exact-version entries (no ^ or ~) for the chosen mode + output target.
 */
export function getExportDependencies(
  mode: BuilderMode,
  target: 'react' | 'vue' | 'angular' | 'html',
  frameworkVersion: string,
): Record<string, string> {
  const deps: Record<string, string> = {}

  // ── React runtime ──
  if (target === 'react') {
    deps['react']     = '19.2.4'
    deps['react-dom'] = '19.2.4'
  }

  // ── Vue runtime ──
  if (target === 'vue') {
    deps['vue'] = '3.5.13'
  }

  // ── Angular runtime ──
  if (target === 'angular') {
    deps['@angular/core']          = '19.2.0'
    deps['@angular/common']        = '19.2.0'
    deps['@angular/compiler']      = '19.2.0'
    deps['@angular/platform-browser'] = '19.2.0'
    deps['@angular/platform-browser-dynamic'] = '19.2.0'
    deps['rxjs']                   = '7.8.2'
    deps['zone.js']                = '0.15.0'
  }

  // ── Framework-specific deps ──
  const ver = frameworkVersion || FALLBACK_VERSIONS[mode]

  if (mode === 'bootstrap') {
    if (target === 'react')   { deps['react-bootstrap'] = '2.10.9'; deps['bootstrap'] = ver }
    if (target === 'vue')     { deps['bootstrap-vue-next'] = '0.25.1'; deps['bootstrap'] = ver }
    if (target === 'angular') { deps['@ng-bootstrap/ng-bootstrap'] = '17.0.1'; deps['bootstrap'] = ver }
    if (target === 'html')    { /* CDN only */ }
  }

  if (mode === 'mui') {
    if (target === 'react') {
      deps['@mui/material'] = ver
      deps['@emotion/react'] = '11.14.0'
      deps['@emotion/styled'] = '11.14.0'
    }
    if (target === 'vue') {
      deps['vuetify'] = '3.7.6'
      deps['@mdi/font'] = '7.4.47'
    }
    if (target === 'angular') {
      deps['@angular/material'] = '19.2.0'
      deps['@angular/cdk']      = '19.2.0'
    }
  }

  if (mode === 'tailwind') {
    if (target === 'react' || target === 'vue') {
      // devDeps handled separately — nothing in runtime deps
    }
    if (target === 'angular') {
      // tailwind is a devDep
    }
  }

  return deps
}

/**
 * devDependencies written into package.json at export time.
 */
export function getExportDevDependencies(
  mode: BuilderMode,
  target: 'react' | 'vue' | 'angular' | 'html',
  lang: 'typescript' | 'javascript',
): Record<string, string> {
  const devDeps: Record<string, string> = {}

  if (target === 'react') {
    devDeps['vite']              = '6.2.6'
    devDeps['@vitejs/plugin-react'] = '4.3.4'
    if (lang === 'typescript') {
      devDeps['typescript']      = '5.8.3'
      devDeps['@types/react']    = '19.1.2'
      devDeps['@types/react-dom'] = '19.1.2'
    }
  }

  if (target === 'vue') {
    devDeps['vite']                = '6.2.6'
    devDeps['@vitejs/plugin-vue']  = '5.2.3'
    if (lang === 'typescript') {
      devDeps['typescript']        = '5.8.3'
      devDeps['vue-tsc']           = '2.2.8'
    }
  }

  if (target === 'angular') {
    devDeps['@angular/cli']           = '19.2.0'
    devDeps['@angular-devkit/build-angular'] = '19.2.0'
    devDeps['typescript']             = '5.7.3'
  }

  if (mode === 'tailwind' && target !== 'html') {
    devDeps['tailwindcss'] = '3.4.17'
    devDeps['autoprefixer'] = '10.4.21'
    devDeps['postcss']      = '8.5.3'
  }

  return devDeps
}
