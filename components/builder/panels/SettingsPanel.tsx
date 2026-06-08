'use client'

import React, { useRef, useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import type { BuilderMode } from '@/types/builder.types'
import type { OutputPlatform } from '@/types/store.types'

// ─── Canvas width presets ─────────────────────────────────────────────────────

const PRESET_WIDTHS = [
  { label: 'Full Width', value: '100%', desc: 'Fills the entire viewport' },
  { label: '1440px', value: '1440px', desc: 'Wide desktop' },
  { label: '1280px', value: '1280px', desc: 'Standard desktop' },
  { label: '1200px', value: '1200px', desc: 'Common content width' },
  { label: '1024px', value: '1024px', desc: 'Small desktop / tablet' },
  { label: '768px', value: '768px', desc: 'Tablet portrait' },
  { label: 'Custom', value: 'custom', desc: 'Enter a specific pixel width' },
]

// ─── Branding presets ────────────────────────────────────────────────────────

const COLOR_SWATCHES = [
  '#4f46e5', '#7c3aed', '#db2777', '#dc2626',
  '#ea580c', '#ca8a04', '#16a34a', '#0891b2',
  '#0284c7', '#374151',
]

const FONTS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
]

// ─── Framework / Platform options ────────────────────────────────────────────

const FRAMEWORKS: { mode: BuilderMode; label: string; icon: string }[] = [
  { mode: 'bootstrap', label: 'Bootstrap', icon: 'B' },
  { mode: 'mui', label: 'MUI', icon: 'M' },
  { mode: 'tailwind', label: 'Tailwind', icon: 'T' },
  { mode: 'custom', label: 'Custom', icon: '✦' },
]

const PLATFORMS: { platform: OutputPlatform; label: string; icon: string }[] = [
  { platform: 'react', label: 'React', icon: '⚛' },
  { platform: 'angular', label: 'Angular', icon: 'Ng' },
  { platform: 'vue', label: 'Vue', icon: 'V' },
  { platform: 'html', label: 'HTML', icon: '</>' },
]

// ─── Shared style constants ───────────────────────────────────────────────────

const SECTION_LABEL: React.CSSProperties = {
  fontSize: '0.6875rem',
  fontWeight: 700,
  color: 'var(--color-text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 10,
}

const FIELD_LABEL: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 500,
  color: 'var(--color-text-secondary)',
  marginBottom: 4,
  display: 'block',
}

const INPUT: React.CSSProperties = {
  width: '100%',
  height: 32,
  padding: '0 10px',
  borderRadius: 6,
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg)',
  fontSize: '0.8125rem',
  color: 'var(--color-text-primary)',
  outline: 'none',
  boxSizing: 'border-box',
}

// ─── Warning dialog ───────────────────────────────────────────────────────────

interface WarningDialogProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

function WarningDialog({ message, onConfirm, onCancel }: WarningDialogProps) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 8,
      border: '1px solid #f59e0b',
      backgroundColor: 'color-mix(in srgb, #f59e0b 8%, transparent)',
      marginTop: 8,
    }}>
      <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={onConfirm}
          style={{
            flex: 1, height: 28, borderRadius: 5, border: 'none',
            backgroundColor: '#f59e0b', color: '#fff',
            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          Change anyway
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1, height: 28, borderRadius: 5,
            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text-primary)',
            fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SettingsPanel() {
  const projectMeta = useBuilderStore((s) => s.projectMeta)
  const mode = useBuilderStore((s) => s.mode)
  const canvasWidth = useBuilderStore((s) => s.canvasWidth)
  const setProjectMetaName = useBuilderStore((s) => s.setProjectMetaName)
  const setBranding = useBuilderStore((s) => s.setBranding)
  const setLogo = useBuilderStore((s) => s.setLogo)
  const removeLogo = useBuilderStore((s) => s.removeLogo)
  const setMode = useBuilderStore((s) => s.setMode)
  const setPlatform = useBuilderStore((s) => s.setPlatform)
  const setCanvasWidth = useBuilderStore((s) => s.setCanvasWidth)
  const canvasLayout = useBuilderStore((s) => s.projectMeta?.canvasLayout ?? 'flex-flow')
  const setCanvasLayout = useBuilderStore((s) => s.setCanvasLayout)
  const resetCanvas = useBuilderStore((s) => s.resetCanvas)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const isNamedPreset = PRESET_WIDTHS.slice(0, -1).some((p) => p.value === canvasWidth)
  const [customValue, setCustomValue] = useState(!isNamedPreset ? canvasWidth.replace('px', '') : '')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [pendingMode, setPendingMode] = useState<BuilderMode | null>(null)
  const [pendingPlatform, setPendingPlatform] = useState<OutputPlatform | null>(null)

  function handleLogoFile(file: File) {
    if (typeof window === 'undefined') return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        const maxW = 800, maxH = 400
        let { width, height } = img
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d')?.drawImage(img, 0, 0, width, height)
        setLogo(canvas.toDataURL('image/png', 0.85))
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  function applyCustomWidth() {
    const num = parseInt(customValue, 10)
    if (!isNaN(num) && num >= 320 && num <= 3840) setCanvasWidth(`${num}px`)
  }

  const branding = projectMeta?.branding
  const primaryColor = branding?.primaryColor ?? '#4f46e5'
  const fontFamily = branding?.fontFamily ?? 'Inter, sans-serif'
  const currentPlatform = projectMeta?.platform ?? 'react'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

        {/* ── Project ────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <p style={SECTION_LABEL}>Project</p>

          <div style={{ marginBottom: 12 }}>
            <label style={FIELD_LABEL}>Project name</label>
            <input
              type="text"
              value={projectMeta?.name ?? ''}
              onChange={(e) => setProjectMetaName(e.target.value)}
              style={INPUT}
              placeholder="My Project"
            />
          </div>
        </div>

        {/* ── Logo ───────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <p style={SECTION_LABEL}>Logo</p>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleLogoFile(file)
              e.target.value = ''
            }}
          />
          {projectMeta?.logoDataUrl ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 8,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            }}>
              <img
                src={projectMeta.logoDataUrl}
                alt="Logo"
                style={{ maxHeight: 36, maxWidth: 80, objectFit: 'contain' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginLeft: 'auto' }}>
                <button
                  onClick={() => logoInputRef.current?.click()}
                  style={{ fontSize: '0.75rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, textAlign: 'right' }}
                >
                  Replace
                </button>
                <button
                  onClick={removeLogo}
                  style={{ fontSize: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, textAlign: 'right' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => logoInputRef.current?.click()}
              style={{
                width: '100%', padding: '14px 12px', borderRadius: 8,
                border: '1.5px dashed var(--color-border)', backgroundColor: 'var(--color-surface)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="14" height="14" rx="3" />
                <circle cx="6.5" cy="6.5" r="1.5" />
                <path d="M2 12l4-4 3 3 2.5-2.5L16 13" />
              </svg>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Upload logo
              </span>
            </button>
          )}
        </div>

        {/* ── Branding ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <p style={SECTION_LABEL}>Branding</p>

          <label style={FIELD_LABEL}>Primary color</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {COLOR_SWATCHES.map((hex) => (
              <button
                key={hex}
                onClick={() => setBranding({ primaryColor: hex, fontFamily })}
                title={hex}
                style={{
                  width: 26, height: 26, borderRadius: '50%',
                  backgroundColor: hex, border: 'none', cursor: 'pointer',
                  boxShadow: primaryColor === hex
                    ? `0 0 0 2px var(--color-bg), 0 0 0 4px ${hex}`
                    : 'none',
                  position: 'relative',
                  transition: 'box-shadow 120ms',
                }}
              >
                {primaryColor === hex && (
                  <svg style={{ position: 'absolute', inset: 0, margin: 'auto' }} width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <label style={FIELD_LABEL}>Font family</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {FONTS.map((font) => (
              <label
                key={font.value}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px', borderRadius: 6, cursor: 'pointer',
                  border: `1.5px solid ${fontFamily === font.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: fontFamily === font.value ? 'color-mix(in srgb, var(--color-primary) 6%, transparent)' : 'var(--color-bg)',
                  transition: 'all 120ms',
                }}
              >
                <input
                  type="radio"
                  name="settings-font"
                  checked={fontFamily === font.value}
                  onChange={() => setBranding({ primaryColor, fontFamily: font.value })}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span style={{ fontFamily: font.value, fontSize: '0.875rem', color: 'var(--color-text)' }}>
                  {font.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* ── UI Framework ───────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <p style={SECTION_LABEL}>UI Framework</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {FRAMEWORKS.map(({ mode: m, label, icon }) => {
              const selected = mode === m
              return (
                <button
                  key={m}
                  onClick={() => { if (!selected) setPendingMode(m) }}
                  style={{
                    padding: '10px 8px', borderRadius: 8, cursor: selected ? 'default' : 'pointer',
                    textAlign: 'center',
                    border: `1.5px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: selected ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'var(--color-bg)',
                    transition: 'all 120ms',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}
                  onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = 'var(--color-primary)' }}
                  onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = 'var(--color-border)' }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.875rem', fontWeight: 700,
                    backgroundColor: selected ? 'var(--color-primary)' : 'var(--color-border)',
                    color: selected ? '#fff' : 'var(--color-text-secondary)',
                  }}>{icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: selected ? 'var(--color-primary)' : 'var(--color-text)' }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {pendingMode && (
            <WarningDialog
              message="Changing the UI framework may affect how your layout renders and exports. Existing class names or style props may not transfer."
              onConfirm={() => { setMode(pendingMode); setPendingMode(null) }}
              onCancel={() => setPendingMode(null)}
            />
          )}
        </div>

        {/* ── Target Platform ────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <p style={SECTION_LABEL}>Target Platform</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {PLATFORMS.map(({ platform, label, icon }) => {
              const selected = currentPlatform === platform
              return (
                <button
                  key={platform}
                  onClick={() => { if (!selected) setPendingPlatform(platform) }}
                  style={{
                    padding: '10px 8px', borderRadius: 8, cursor: selected ? 'default' : 'pointer',
                    textAlign: 'center',
                    border: `1.5px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: selected ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'var(--color-bg)',
                    transition: 'all 120ms',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}
                  onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = 'var(--color-primary)' }}
                  onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = 'var(--color-border)' }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: platform === 'html' ? '0.625rem' : '0.875rem',
                    fontWeight: 700, fontFamily: 'monospace',
                    backgroundColor: selected ? 'var(--color-primary)' : 'var(--color-border)',
                    color: selected ? '#fff' : 'var(--color-text-secondary)',
                  }}>{icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: selected ? 'var(--color-primary)' : 'var(--color-text)' }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {pendingPlatform && (
            <WarningDialog
              message="Changing the target platform affects the export output format. The canvas layout itself won't change."
              onConfirm={() => { setPlatform(pendingPlatform); setPendingPlatform(null) }}
              onCancel={() => setPendingPlatform(null)}
            />
          )}
        </div>

        {/* ── Canvas ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <p style={SECTION_LABEL}>Canvas</p>

          {/* Layout mode */}
          <label style={FIELD_LABEL}>Layout Mode</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
            {([
              { value: 'flex-flow',  label: 'Flex / Flow',  desc: 'Elements stack & reflow', icon: '≡' },
              { value: 'fixed-grid', label: 'Fixed Grid',   desc: 'Snap-to-grid, free drag', icon: '⊞' },
            ] as const).map(({ value, label, desc, icon }) => {
              const active = canvasLayout === value
              return (
                <button
                  key={value}
                  onClick={() => setCanvasLayout(value)}
                  style={{
                    padding: '10px', borderRadius: 8, cursor: 'pointer',
                    textAlign: 'left', transition: 'all 120ms',
                    border: `1.5px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: active ? 'var(--color-selected)' : 'var(--color-bg)',
                  }}
                >
                  <div style={{ fontSize: '1.1rem', marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: '0.775rem', fontWeight: 600, color: active ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{label}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginTop: 2, lineHeight: 1.3 }}>{desc}</div>
                </button>
              )
            })}
          </div>

          <label style={FIELD_LABEL}>Width</label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
            {PRESET_WIDTHS.map((preset) => {
              const active = preset.value === 'custom' ? !isNamedPreset : canvasWidth === preset.value
              return (
                <button
                  key={preset.value}
                  onClick={() => { if (preset.value !== 'custom') setCanvasWidth(preset.value) }}
                  style={{
                    padding: '8px 10px', borderRadius: 7, cursor: 'pointer',
                    textAlign: 'left', transition: 'all 120ms',
                    border: `1.5px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: active ? 'var(--color-selected)' : 'var(--color-bg)',
                  }}
                >
                  <div style={{ fontSize: '0.775rem', fontWeight: 600, color: active ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                    {preset.label}
                  </div>
                  {preset.value !== 'custom' && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginTop: 1, lineHeight: 1.3 }}>
                      {preset.desc}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div>
            <label style={FIELD_LABEL}>Custom width (px)</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="number" min={320} max={3840}
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') applyCustomWidth() }}
                placeholder="e.g. 1360"
                style={{ ...INPUT, flex: 1 }}
              />
              <button
                onClick={applyCustomWidth}
                style={{
                  height: 32, padding: '0 12px', borderRadius: 6,
                  border: 'none', backgroundColor: 'var(--color-primary)', color: '#fff',
                  fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Apply
              </button>
            </div>
          </div>

          <div style={{
            marginTop: 10, padding: '7px 10px', borderRadius: 6,
            backgroundColor: 'var(--color-border)', fontSize: '0.75rem',
            color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="1" y="1" width="10" height="10" rx="2" />
              <path d="M1 4h10" />
            </svg>
            Canvas: <strong style={{ color: 'var(--color-text-primary)' }}>{canvasWidth}</strong>
            {canvasWidth !== '100%' && (
              <span style={{ marginLeft: 'auto', color: 'var(--color-primary)', fontSize: '0.7rem', fontWeight: 600 }}>
                CUSTOM FRAME
              </span>
            )}
          </div>
        </div>

        {/* ── Danger zone ────────────────────────────────────────────── */}
        <div>
          <p style={SECTION_LABEL}>Danger zone</p>
          {showResetConfirm ? (
            <div style={{
              padding: '10px 12px', borderRadius: 7,
              border: '1px solid var(--color-danger)',
              backgroundColor: '#fff5f5',
            }}>
              <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: 'var(--color-text-primary)' }}>
                This will delete all sections, rows, and elements. Are you sure?
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => { resetCanvas(); setShowResetConfirm(false) }}
                  style={{
                    flex: 1, height: 30, borderRadius: 5, border: 'none',
                    backgroundColor: 'var(--color-danger)', color: '#fff',
                    fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  style={{
                    flex: 1, height: 30, borderRadius: 5,
                    border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.775rem', fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              style={{
                width: '100%', height: 32, borderRadius: 6,
                border: '1px solid var(--color-danger)',
                backgroundColor: 'transparent', color: 'var(--color-danger)',
                fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
              }}
            >
              Reset canvas
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
