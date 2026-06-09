'use client'

/**
 * ExportModal — BuilderPro
 *
 * Multi-step export flow:
 *   Step 1: Confirm export format (HTML/CSS free | Component premium)
 *   Step 2: Language (TS/JS) + component names (component export only)
 *   Step 3: Download
 *
 * Platform is read-only from projectMeta.platform.
 * Custom mode blocks component export with a warning.
 * Premium gate: isPremium = false // TODO: wire to auth
 */

import { useState, useRef, useEffect } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import type { BuilderMode } from '@/types/builder.types'

// TODO: wire to auth
const isPremium = false

type Lang = 'typescript' | 'javascript'
type ComponentTarget = 'react' | 'vue' | 'angular'
type ExportFormat = 'html' | 'zip' | 'component-zip'

const PLATFORM_LABELS: Record<string, string> = {
  react: 'React',
  vue: 'Vue 3',
  angular: 'Angular',
  html: 'HTML / CSS',
}

const MODE_LABELS: Record<BuilderMode, string> = {
  bootstrap: 'Bootstrap',
  mui: 'MUI',
  tailwind: 'Tailwind CSS',
  custom: 'Custom',
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function toComponentName(index: number): string {
  return `Section${index + 1}`
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 9000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
    border: '1px solid var(--color-border)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
    width: 480,
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    padding: '20px 24px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  body: {
    padding: '16px 24px 24px',
    flex: 1,
  },
  footer: {
    padding: '0 24px 20px',
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
  },
  label: {
    fontSize: '0.6875rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    color: 'var(--color-text-secondary)',
    marginBottom: 6,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    backgroundColor: 'var(--color-bg)',
    borderRadius: 8,
    border: '1px solid var(--color-border)',
    marginBottom: 12,
  },
  primaryBtn: {
    height: 38,
    padding: '0 20px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
  } as React.CSSProperties,
  secondaryBtn: {
    height: 38,
    padding: '0 16px',
    borderRadius: 8,
    border: '1px solid var(--color-border)',
    backgroundColor: 'transparent',
    color: 'var(--color-text-primary)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  } as React.CSSProperties,
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    padding: 4,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 16 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 18 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: i === current
              ? 'var(--color-primary)'
              : i < current
              ? 'var(--color-primary)'
              : 'var(--color-border)',
            opacity: i < current ? 0.4 : 1,
            transition: 'all 200ms',
          }}
        />
      ))}
    </div>
  )
}

// ─── Step 1: Format ───────────────────────────────────────────────────────────

interface Step1Props {
  platform: string
  mode: BuilderMode
  frameworkVersion: string
  selectedFormat: ExportFormat
  onFormatChange: (f: ExportFormat) => void
  onNext: () => void
  onClose: () => void
  sectionCount: number
}

function Step1({ platform, mode, frameworkVersion, selectedFormat, onFormatChange, onNext, onClose, sectionCount }: Step1Props) {
  const isCustom = mode === 'custom'
  const isHtmlPlatform = platform === 'html'
  const showComponentOption = !isHtmlPlatform

  const versionLabel = frameworkVersion ? ` ${frameworkVersion}` : ''
  const modeStr = `${MODE_LABELS[mode]}${versionLabel}`

  return (
    <>
      <div style={S.header}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)' }}>Export Project</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Choose what to export
          </p>
        </div>
        <button style={S.closeBtn} onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      </div>

      <div style={S.body}>
        <StepDots current={0} total={showComponentOption ? 3 : 2} />

        {/* Project info */}
        <div style={{ marginBottom: 16 }}>
          <div style={S.label}>Project Details</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ ...S.infoRow, flex: 1, marginBottom: 0 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Framework</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginLeft: 'auto' }}>{modeStr}</div>
            </div>
            <div style={{ ...S.infoRow, flex: 1, marginBottom: 0 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Platform</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginLeft: 'auto' }}>{PLATFORM_LABELS[platform] ?? platform}</div>
            </div>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            To change platform, go to{' '}
            <a href="/settings" target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Project Settings</a>.
          </p>
        </div>

        {/* Custom mode warning */}
        {isCustom && showComponentOption && (
          <div style={{ display: 'flex', gap: 10, padding: '10px 14px', borderRadius: 8, marginBottom: 16, backgroundColor: '#fefce8', border: '1px solid #fde047' }}>
            <span>⚠️</span>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#713f12', lineHeight: 1.5 }}>
              <strong>Custom mode:</strong> Component generation is not available. Only HTML/CSS export is offered.
              To export components, create a new project with Bootstrap, MUI, or Tailwind.
            </p>
          </div>
        )}

        {/* Format options */}
        <div style={S.label}>Export Format</div>

        {/* HTML / ZIP */}
        {[
          { format: 'html' as const, label: 'HTML File', desc: 'Single index.html — great for quick sharing', badge: 'Free', icon: '</>' },
          { format: 'zip' as const, label: 'HTML + CSS ZIP', desc: 'index.html + styles.css + assets folder', badge: 'Free', icon: '📦' },
        ].map(({ format, label, desc, badge, icon }) => {
          const selected = selectedFormat === format
          return (
            <button
              key={format}
              onClick={() => onFormatChange(format)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 10, marginBottom: 8,
                border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: selected ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)' : 'transparent',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
              <span style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>{desc}</div>
              </span>
              <span style={{ padding: '2px 8px', borderRadius: 4, backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.6875rem', fontWeight: 700, flexShrink: 0 }}>{badge}</span>
            </button>
          )
        })}

        {/* Component export — only for non-html + non-custom */}
        {showComponentOption && !isCustom && (
          <button
            onClick={() => {
              if (!isPremium) return // gate in modal, don't toggle
              onFormatChange('component-zip')
            }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 10, marginBottom: 0,
              border: `2px solid ${selectedFormat === 'component-zip' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              backgroundColor: selectedFormat === 'component-zip'
                ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)'
                : isPremium ? 'transparent' : 'var(--color-bg)',
              cursor: isPremium ? 'pointer' : 'default',
              textAlign: 'left', position: 'relative', overflow: 'hidden',
              opacity: isPremium ? 1 : 0.8,
            }}
          >
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚛️</span>
            <span style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                {PLATFORM_LABELS[platform]} Component Project
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                Full scaffolded project — components, package.json, README
              </div>
            </span>
            <span style={{ padding: '2px 8px', borderRadius: 4, backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.6875rem', fontWeight: 700, flexShrink: 0 }}>
              {isPremium ? 'Premium' : '🔒 Premium'}
            </span>
          </button>
        )}

        {/* Sections info */}
        <div style={{ marginTop: 14, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
          {sectionCount} section{sectionCount !== 1 ? 's' : ''} will be exported
          {selectedFormat === 'component-zip' && ` as ${sectionCount} component${sectionCount !== 1 ? 's' : ''}`}.
        </div>
      </div>

      <div style={S.footer}>
        <button style={S.secondaryBtn} onClick={onClose}>Cancel</button>
        <button
          style={S.primaryBtn}
          onClick={onNext}
        >
          {selectedFormat === 'component-zip' ? 'Next →' : 'Export'}
        </button>
      </div>
    </>
  )
}

// ─── Step 2: Options (component export only) ──────────────────────────────────

interface Step2Props {
  lang: Lang
  onLangChange: (l: Lang) => void
  componentNames: string[]
  onNamesChange: (names: string[]) => void
  onNext: () => void
  onBack: () => void
  onClose: () => void
}

function Step2({ lang, onLangChange, componentNames, onNamesChange, onNext, onBack, onClose }: Step2Props) {
  function handleNameChange(i: number, val: string) {
    const next = [...componentNames]
    // Sanitize: PascalCase, no spaces/specials
    const sanitized = val.replace(/[^a-zA-Z0-9]/g, '').replace(/^[^A-Z]/, (c) => c.toUpperCase())
    next[i] = sanitized || `Section${i + 1}`
    onNamesChange(next)
  }

  return (
    <>
      <div style={S.header}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)' }}>Component Options</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Customize your export
          </p>
        </div>
        <button style={S.closeBtn} onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      </div>

      <div style={S.body}>
        <StepDots current={1} total={3} />

        {/* Language toggle */}
        <div style={{ marginBottom: 20 }}>
          <div style={S.label}>Language</div>
          <div style={{ display: 'flex', gap: 0, border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
            {(['typescript', 'javascript'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => onLangChange(l)}
                style={{
                  flex: 1, height: 36, border: 'none', cursor: 'pointer',
                  backgroundColor: lang === l ? 'var(--color-primary)' : 'transparent',
                  color: lang === l ? '#fff' : 'var(--color-text-secondary)',
                  fontSize: '0.8125rem', fontWeight: lang === l ? 600 : 400,
                  transition: 'all 150ms',
                }}
              >
                {l === 'typescript' ? 'TypeScript' : 'JavaScript'}
              </button>
            ))}
          </div>
        </div>

        {/* Component names */}
        <div>
          <div style={S.label}>Component Names</div>
          <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            PascalCase. Each section becomes one component file.
          </p>
          <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {componentNames.map((name, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', width: 60, flexShrink: 0 }}>Section {i + 1}</span>
                <input
                  value={name}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  style={{
                    flex: 1, height: 32, padding: '0 10px', borderRadius: 6,
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)', fontSize: '0.8125rem',
                    fontFamily: 'monospace',
                  }}
                  placeholder={`Section${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={S.footer}>
        <button style={S.secondaryBtn} onClick={onBack}>← Back</button>
        <button style={S.primaryBtn} onClick={onNext}>Preview →</button>
      </div>
    </>
  )
}

// ─── Step 3: Preview + Download ───────────────────────────────────────────────

interface Step3Props {
  platform: string
  mode: BuilderMode
  lang: Lang
  componentNames: string[]
  format: ExportFormat
  frameworkVersion: string
  onBack: () => void
  onClose: () => void
}

function Step3({ platform, mode, lang, componentNames, format, frameworkVersion, onBack, onClose }: Step3Props) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ext = lang === 'typescript'
    ? (platform === 'react' ? 'tsx' : 'vue' in {'vue':1} ? 'vue' : 'ts')
    : (platform === 'react' ? 'jsx' : 'vue' in {'vue':1} ? 'vue' : 'js')

  // Build preview of files that will be generated
  const previewFiles = format === 'component-zip'
    ? [
        'package.json',
        'README.md',
        `vite.config.${lang === 'typescript' ? 'ts' : 'js'}`,
        lang === 'typescript' ? 'tsconfig.json' : null,
        `src/tokens.${lang === 'typescript' ? 'ts' : 'js'}`,
        `src/App.${platform === 'vue' ? 'vue' : lang === 'typescript' ? (platform === 'react' ? 'tsx' : 'ts') : (platform === 'react' ? 'jsx' : 'js')}`,
        ...componentNames.map((n) => {
          const slug = n.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`).replace(/^-/, '')
          return platform === 'vue'
            ? `src/components/${n}.vue`
            : platform === 'angular'
            ? `src/app/components/${slug}/${slug}.component.ts`
            : `src/components/${n}.${lang === 'typescript' ? 'tsx' : 'jsx'}`
        }),
      ].filter(Boolean) as string[]
    : format === 'zip'
    ? ['index.html', 'styles.css', 'assets/']
    : ['index.html']

  async function handleDownload() {
    setLoading(true)
    setError(null)
    try {
      const state = useBuilderStore.getState()
      const body = format === 'component-zip'
        ? { state, format, target: platform as ComponentTarget, componentNames, lang, frameworkVersion }
        : { state, format }

      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: 'Export failed' }))
        throw new Error(msg.error ?? 'Export failed')
      }
      const blob = await res.blob()
      const name = (state.projectMeta?.name ?? 'export').replace(/[^a-z0-9]/gi, '-').toLowerCase()
      const filename = format === 'component-zip'
        ? `${name}-${platform}.zip`
        : format === 'zip'
        ? `${name}.zip`
        : `${name}.html`
      downloadBlob(blob, filename)
      setDone(true)

      // Save to export history
      try {
        const history = JSON.parse(localStorage.getItem('bp_export_history') ?? '[]')
        history.unshift({
          id: crypto.randomUUID(),
          projectName: state.projectMeta?.name ?? 'Untitled',
          format,
          platform: format === 'component-zip' ? platform : 'html',
          lang: format === 'component-zip' ? lang : 'n/a',
          filename,
          exportedAt: new Date().toISOString(),
        })
        localStorage.setItem('bp_export_history', JSON.stringify(history.slice(0, 20)))
      } catch {
        // localStorage quota — ignore
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div style={S.header}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)' }}>Ready to Export</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Review and download
          </p>
        </div>
        <button style={S.closeBtn} onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      </div>

      <div style={S.body}>
        <StepDots current={format === 'component-zip' ? 2 : 1} total={format === 'component-zip' ? 3 : 2} />

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Format', value: format === 'component-zip' ? 'Component Project' : format === 'zip' ? 'ZIP (HTML+CSS)' : 'HTML File' },
            { label: 'Platform', value: PLATFORM_LABELS[platform] ?? platform },
            ...(format === 'component-zip' ? [{ label: 'Language', value: lang === 'typescript' ? 'TypeScript' : 'JavaScript' }] : []),
            ...(format === 'component-zip' ? [{ label: 'Components', value: `${componentNames.length}` }] : []),
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '8px 12px', backgroundColor: 'var(--color-bg)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 2 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* File list preview */}
        <div>
          <div style={S.label}>Files Included</div>
          <div style={{
            maxHeight: 180, overflowY: 'auto', backgroundColor: 'var(--color-bg)',
            borderRadius: 8, border: '1px solid var(--color-border)', padding: '8px 12px',
          }}>
            {previewFiles.map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-text)' }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 5.5h6M6 3l2.5 2.5L6 8" />
                </svg>
                {f}
              </div>
            ))}
            {format === 'component-zip' && componentNames.length > 3 && (
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', paddingTop: 4 }}>
                … and more
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: '8px 12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, fontSize: '0.8125rem', color: '#991b1b' }}>
            {error}
          </div>
        )}

        {done && (
          <div style={{ marginTop: 12, padding: '8px 12px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, fontSize: '0.8125rem', color: '#166534', display: 'flex', gap: 8, alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round">
              <path d="M2 7l4 4 6-6" />
            </svg>
            Download started!
          </div>
        )}
      </div>

      <div style={S.footer}>
        {format === 'component-zip' && <button style={S.secondaryBtn} onClick={onBack} disabled={loading}>← Back</button>}
        <button style={S.secondaryBtn} onClick={onClose} disabled={loading}>Close</button>
        <button
          style={{
            ...S.primaryBtn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                <path d="M6.5 1.5A5 5 0 1 1 1.5 6.5" />
              </svg>
              Exporting…
            </>
          ) : done ? '↓ Download Again' : '↓ Download'}
        </button>
      </div>
    </>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface ExportModalProps {
  onClose: () => void
}

export function ExportModal({ onClose }: ExportModalProps) {
  const projectMeta = useBuilderStore((s) => s.projectMeta)
  const mode = useBuilderStore((s) => s.mode)
  const sectionOrder = useBuilderStore((s) => s.sectionOrder)

  const platform = projectMeta?.platform ?? 'html'
  const frameworkVersion = projectMeta?.frameworkVersion ?? ''
  const sectionCount = sectionOrder.length

  const [step, setStep] = useState(0)
  const [format, setFormat] = useState<ExportFormat>('zip')
  const [lang, setLang] = useState<Lang>('typescript')
  const [componentNames, setComponentNames] = useState<string[]>(
    sectionOrder.map((_, i) => toComponentName(i))
  )

  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on overlay click
  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose()
  }

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  function handleNext() {
    if (format === 'component-zip') {
      setStep(1) // go to options step
    } else {
      setStep(2) // go directly to download step
    }
  }

  function handleStep1Next() {
    handleNext()
  }

  function handleStep2Next() {
    setStep(2) // preview + download
  }

  const showComponentOption = platform !== 'html' && mode !== 'custom'

  return (
    <div style={S.overlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div style={S.modal} onClick={(e) => e.stopPropagation()}>
        {step === 0 && (
          <Step1
            platform={platform}
            mode={mode}
            frameworkVersion={frameworkVersion}
            selectedFormat={format}
            onFormatChange={setFormat}
            onNext={handleStep1Next}
            onClose={onClose}
            sectionCount={sectionCount}
          />
        )}
        {step === 1 && format === 'component-zip' && (
          <Step2
            lang={lang}
            onLangChange={setLang}
            componentNames={componentNames}
            onNamesChange={setComponentNames}
            onNext={handleStep2Next}
            onBack={() => setStep(0)}
            onClose={onClose}
          />
        )}
        {step === 2 && (
          <Step3
            platform={platform}
            mode={mode}
            lang={lang}
            componentNames={componentNames}
            format={format}
            frameworkVersion={frameworkVersion}
            onBack={() => setStep(format === 'component-zip' ? 1 : 0)}
            onClose={onClose}
          />
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default ExportModal
