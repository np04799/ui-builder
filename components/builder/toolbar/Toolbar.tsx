'use client'

import { useState, useRef, useEffect } from 'react'
import { useResponsiveMode } from '@/hooks/useBuilderSelectors'
import { useBuilderStore } from '@/store/builder.store'
import { MonitorIcon, TabletIcon, MobileIcon, UndoIcon, RedoIcon } from '@/components/builder/icons'
import { PREVIEW_STORAGE_KEY } from '@/app/preview/page'

// ─── SVG icons ────────────────────────────────────────────────────────────────
function PanelLeftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="13" height="13" rx="2" />
      <line x1="5" y1="1" x2="5" y2="14" />
    </svg>
  )
}

function PanelRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="13" height="13" rx="2" />
      <line x1="10" y1="1" x2="10" y2="14" />
    </svg>
  )
}

function ZoomInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="6" cy="6" r="4.5" />
      <line x1="6" y1="4" x2="6" y2="8" />
      <line x1="4" y1="6" x2="8" y2="6" />
      <line x1="9.5" y1="9.5" x2="13" y2="13" />
    </svg>
  )
}

function ZoomOutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="6" cy="6" r="4.5" />
      <line x1="4" y1="6" x2="8" y2="6" />
      <line x1="9.5" y1="9.5" x2="13" y2="13" />
    </svg>
  )
}

// ─── Primitives ───────────────────────────────────────────────────────────────

const ICON_BTN: React.CSSProperties = {
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 6,
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: 'var(--color-text-secondary)',
  flexShrink: 0,
  padding: 0,
}

const ICON_BTN_ACTIVE: React.CSSProperties = {
  ...ICON_BTN,
  color: 'var(--color-primary)',
  backgroundColor: 'var(--color-selected)',
}

const ICON_BTN_DISABLED: React.CSSProperties = {
  ...ICON_BTN,
  opacity: 0.35,
  cursor: 'not-allowed',
}

const SEP: React.CSSProperties = {
  width: 1,
  height: 20,
  backgroundColor: 'var(--color-border)',
  flexShrink: 0,
  margin: '0 6px',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Sep() {
  return <div style={SEP} />
}

function PreviewToggle() {
  const responsiveMode = useResponsiveMode()
  const setResponsiveMode = useBuilderStore((s) => s.setResponsiveMode)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        padding: 2,
      }}
    >
      <button
        style={responsiveMode === 'desktop' ? ICON_BTN_ACTIVE : ICON_BTN}
        title="Desktop (1440px)"
        onClick={() => setResponsiveMode('desktop')}
      >
        <MonitorIcon />
      </button>
      <button
        style={responsiveMode === 'tablet' ? ICON_BTN_ACTIVE : ICON_BTN}
        title="Tablet (768px)"
        onClick={() => setResponsiveMode('tablet')}
      >
        <TabletIcon />
      </button>
      <button
        style={responsiveMode === 'mobile' ? ICON_BTN_ACTIVE : ICON_BTN}
        title="Mobile (390px)"
        onClick={() => setResponsiveMode('mobile')}
      >
        <MobileIcon />
      </button>
    </div>
  )
}

// ─── Panel toggles ────────────────────────────────────────────────────────────

function PanelToggles() {
  const leftPanelVisible = useBuilderStore((s) => s.leftPanelVisible)
  const rightPanelVisible = useBuilderStore((s) => s.rightPanelVisible)
  const toggleLeftPanel = useBuilderStore((s) => s.toggleLeftPanel)
  const toggleRightPanel = useBuilderStore((s) => s.toggleRightPanel)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <button
        style={leftPanelVisible ? ICON_BTN_ACTIVE : ICON_BTN}
        title="Toggle left panel"
        onClick={toggleLeftPanel}
      >
        <PanelLeftIcon />
      </button>
      <button
        style={rightPanelVisible ? ICON_BTN_ACTIVE : ICON_BTN}
        title="Toggle right panel"
        onClick={toggleRightPanel}
      >
        <PanelRightIcon />
      </button>
    </div>
  )
}

// ─── Zoom controls ────────────────────────────────────────────────────────────

const ZOOM_STEPS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]

function ZoomControls() {
  const canvasZoom = useBuilderStore((s) => s.canvasZoom)
  const setCanvasZoom = useBuilderStore((s) => s.setCanvasZoom)

  function stepZoom(dir: 1 | -1) {
    const idx = ZOOM_STEPS.findIndex((z) => z >= canvasZoom - 0.01)
    const next = dir === 1
      ? ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, idx + 1)]
      : ZOOM_STEPS[Math.max(0, idx - 1)]
    setCanvasZoom(next ?? canvasZoom)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <button style={ICON_BTN} title="Zoom out" onClick={() => stepZoom(-1)}>
        <ZoomOutIcon />
      </button>
      <button
        style={{
          height: 28,
          minWidth: 48,
          padding: '0 6px',
          border: '1px solid var(--color-border)',
          borderRadius: 5,
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-primary)',
          fontSize: '0.75rem',
          fontWeight: 500,
          cursor: 'pointer',
          textAlign: 'center',
        }}
        title="Reset zoom to 100%"
        onClick={() => setCanvasZoom(1)}
      >
        {Math.round(canvasZoom * 100)}%
      </button>
      <button style={ICON_BTN} title="Zoom in" onClick={() => stepZoom(1)}>
        <ZoomInIcon />
      </button>
    </div>
  )
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

function UndoRedoButtons() {
  const undo = useBuilderStore((s) => s.undo)
  const redo = useBuilderStore((s) => s.redo)
  const canUndo = useBuilderStore((s) => s._history.length > 0)
  const canRedo = useBuilderStore((s) => s._future.length > 0)

  return (
    <>
      <button
        style={canUndo ? ICON_BTN : ICON_BTN_DISABLED}
        title="Undo (Ctrl+Z)"
        disabled={!canUndo}
        onClick={undo}
      >
        <UndoIcon />
      </button>
      <button
        style={canRedo ? ICON_BTN : ICON_BTN_DISABLED}
        title="Redo (Ctrl+Y)"
        disabled={!canRedo}
        onClick={redo}
      >
        <RedoIcon />
      </button>
    </>
  )
}

export default function Toolbar() {
  const projectMeta = useBuilderStore((s) => s.projectMeta)
  const setProjectMetaName = useBuilderStore((s) => s.setProjectMetaName)
  const logoDataUrl = projectMeta?.logoDataUrl
  const primaryColor = projectMeta?.branding?.primaryColor
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  const renameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (renaming) renameInputRef.current?.select()
  }, [renaming])

  function startRename() {
    setRenameValue(projectMeta?.name ?? '')
    setRenaming(true)
  }

  function commitRename() {
    const trimmed = renameValue.trim()
    if (trimmed) setProjectMetaName(trimmed)
    setRenaming(false)
  }

  const projectTitle = projectMeta?.name ?? 'Untitled Project'

  return (
    <header
      style={{
        height: 48,
        flexShrink: 0,
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 12,
        gap: 0,
      }}
    >
      {/* Left: Logo + project name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
        {logoDataUrl ? (
          /* Project logo uploaded in wizard */
          <img
            src={logoDataUrl}
            alt="Project logo"
            style={{
              height: 28,
              maxWidth: 96,
              objectFit: 'contain',
              borderRadius: 4,
              flexShrink: 0,
            }}
          />
        ) : (
          /* Default BuilderPro mark */
          <>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                backgroundColor: primaryColor ?? 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity="0.9" />
                <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.9" />
              </svg>
            </div>

            <span
              style={{
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: primaryColor ?? 'var(--color-primary)',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              BuilderPro
            </span>
          </>
        )}

        <Sep />

        {/* Project title */}
        {renaming ? (
          <input
            ref={renameInputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') setRenaming(false)
            }}
            style={{
              height: 28,
              padding: '0 8px',
              borderRadius: 6,
              border: '1.5px solid var(--color-primary)',
              backgroundColor: 'var(--color-bg)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              outline: 'none',
              minWidth: 120,
              maxWidth: 220,
            }}
          />
        ) : (
          <button
            onClick={startRename}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 6,
              padding: '4px 6px',
            }}
            title="Rename project"
          >
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                whiteSpace: 'nowrap',
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {projectTitle}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 1.5a1.2 1.2 0 0 1 1.7 1.7L3.5 10 1 11l1-2.5L8.5 1.5z" />
            </svg>
          </button>
        )}
      </div>

      {/* Center: Responsive toggle */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PreviewToggle />
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: '0 0 auto' }}>
        {/* Panel toggles */}
        <PanelToggles />

        <Sep />

        {/* Zoom */}
        <ZoomControls />

        <Sep />

        {/* Undo / Redo */}
        <UndoRedoButtons />

        <Sep />

        {/* Preview button — outlined */}
        <button
          style={{
            height: 32,
            padding: '0 14px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            backgroundColor: 'transparent',
            color: 'var(--color-text-primary)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          onClick={() => {
            sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(useBuilderStore.getState()))
            window.open('/preview', '_blank')
          }}
        >
          {/* Eye icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 7s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" />
            <circle cx="7" cy="7" r="1.75" />
          </svg>
          Preview
        </button>

        {/* Publish button — primary purple with dropdown */}
        <div style={{ display: 'flex', flexShrink: 0 }}>
          <button
            style={{
              height: 32,
              padding: '0 14px',
              borderRadius: '6px 0 0 6px',
              border: 'none',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            onClick={() => {/* TODO: publish */}}
          >
            {/* Rocket icon */}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 1C9 1 11 3 11 5.5c0 3-4.5 7-4.5 7S2 8.5 2 5.5C2 3 4 1 6.5 1z" />
              <circle cx="6.5" cy="5.5" r="1.25" fill="currentColor" stroke="none" />
            </svg>
            Publish
          </button>
          <button
            style={{
              height: 32,
              width: 28,
              borderRadius: '0 6px 6px 0',
              border: 'none',
              borderLeft: '1px solid rgba(255,255,255,0.25)',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
            title="More publish options"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 4l3 3 3-3" />
            </svg>
          </button>
        </div>

        <Sep />

        {/* User avatar */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            cursor: 'pointer',
            border: '2px solid var(--color-border)',
          }}
          title="Account"
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#c7d2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
            }}
          >
            N
          </div>
        </div>
      </div>
    </header>
  )
}
