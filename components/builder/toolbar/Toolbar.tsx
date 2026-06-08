'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useResponsiveMode } from '@/hooks/useBuilderSelectors'
import { useBuilderStore } from '@/store/builder.store'
import { MonitorIcon, TabletIcon, MobileIcon, UndoIcon, RedoIcon } from '@/components/builder/icons'
import { PREVIEW_STORAGE_KEY } from '@/app/preview/page'
import { useThemeStore } from '@/store/theme.store'
import { useAuthStore } from '@/store/auth.store'
import { signOut, isConfigured } from '@/lib/firebase'

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


function SaveButton() {
  const saveProject = useBuilderStore((s) => s.saveProject)
  const listSaved = useBuilderStore((s) => s.listSavedProjects)
  const loadProject = useBuilderStore((s) => s.loadProject)
  const deleteSaved = useBuilderStore((s) => s.deleteSavedProject)
  const projectMeta = useBuilderStore((s) => s.projectMeta)
  const [saved, setSaved] = useState(false)
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState<{ key: string; name: string; updatedAt: string; mode: string }[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    setProjects(listSaved())
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, listSaved])

  function handleSave() {
    const key = saveProject()
    if (key) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  function handleLoad(key: string) {
    loadProject(key)
    setOpen(false)
  }

  function handleDelete(e: React.MouseEvent, key: string) {
    e.stopPropagation()
    deleteSaved(key)
    setProjects(listSaved())
  }

  const BTN: React.CSSProperties = {
    height: 32,
    padding: '0 12px',
    borderRadius: '6px 0 0 6px',
    border: '1px solid var(--color-border)',
    borderRight: 'none',
    backgroundColor: saved ? 'var(--color-accent, #22c55e)' : 'transparent',
    color: saved ? '#fff' : 'var(--color-text-primary)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
    transition: 'background-color 200ms, color 200ms',
  }

  return (
    <div ref={ref} style={{ display: 'flex', flexShrink: 0, position: 'relative' }}>
      <button style={BTN} onClick={handleSave} title={projectMeta ? `Save "${projectMeta.name}"` : 'Save project'}>
        {saved ? (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 6.5l3.5 3.5 5.5-6" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.5 11.5h-8a1 1 0 0 1-1-1v-8l2-2h6l2 2v8a1 1 0 0 1-1 1z" />
            <path d="M4 1.5v3h5v-3M4 11.5v-4h5v4" />
          </svg>
        )}
        {saved ? 'Saved!' : 'Save'}
      </button>
      <button
        style={{
          height: 32,
          width: 26,
          borderRadius: '0 6px 6px 0',
          border: '1px solid var(--color-border)',
          backgroundColor: 'transparent',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          padding: 0,
        }}
        onClick={() => setOpen(v => !v)}
        title="Saved projects"
      >
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M2 3.5l2.5 2.5 2.5-2.5" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          zIndex: 1000,
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: 220,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '8px 12px 6px', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Saved Projects
          </div>
          {projects.length === 0 ? (
            <div style={{ padding: '8px 12px 12px', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>No saved projects yet.</div>
          ) : (
            <div style={{ maxHeight: 280, overflowY: 'auto' }}>
              {projects.map((p) => (
                <div
                  key={p.key}
                  onClick={() => handleLoad(p.key)}
                  style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', cursor: 'pointer', gap: 8 }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-selected, rgba(99,102,241,0.08))')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>{p.mode} · {new Date(p.updatedAt).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, p.key)}
                    title="Delete"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 4, borderRadius: 4, flexShrink: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M2 3h8M5 3V2h2v1M4.5 9.5V5M7.5 9.5V5M3 3l.5 7h5l.5-7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  if (loading) return <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: 'var(--color-border)', flexShrink: 0 }} />

  if (!user) {
    return (
      <button
        onClick={() => router.push('/login')}
        style={{
          height: 30, padding: '0 12px', borderRadius: 6,
          border: '1px solid var(--color-border)',
          backgroundColor: 'transparent', color: 'var(--color-text-primary)',
          fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', flexShrink: 0,
        }}
      >
        Sign in
      </button>
    )
  }

  const initials = (user.displayName ?? user.email ?? 'U').slice(0, 2).toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(v => !v)}
        title={user.displayName ?? user.email ?? 'Account'}
        style={{
          width: 30, height: 30, borderRadius: '50%', overflow: 'hidden',
          border: '2px solid var(--color-primary)', cursor: 'pointer', padding: 0,
          flexShrink: 0,
        }}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {initials}
          </div>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 1000,
          backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 180,
        }}>
          <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.displayName ?? 'User'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>
          <div style={{ padding: '4px 0' }}>
            <button
              onClick={async () => { await signOut(); setOpen(false) }}
              style={{
                width: '100%', textAlign: 'left', padding: '8px 14px', border: 'none',
                backgroundColor: 'transparent', color: 'var(--color-text-primary)',
                fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-selected, rgba(99,102,241,0.08))')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3M9 9.5l3-3-3-3M12 6.5H5" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const isDark = theme === 'dark'
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        border: '1px solid var(--color-border)',
        backgroundColor: 'transparent',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {isDark ? (
        // Sun icon
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="7" cy="7" r="2.5" />
          <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.93 2.93l1.06 1.06M9.99 9.99l1.06 1.06M2.93 11.07l1.06-1.06M9.99 4.01l1.06-1.06" />
        </svg>
      ) : (
        // Moon icon
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 9.5A5.5 5.5 0 014.5 2a5.5 5.5 0 100 10A5.5 5.5 0 0012 9.5z" />
        </svg>
      )}
    </button>
  )
}

function ExportButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  async function handleExport(format: 'html' | 'css' | 'zip') {
    const state = useBuilderStore.getState()
    // Guard: nothing to export
    if (!state.sectionOrder || state.sectionOrder.length === 0) {
      alert('Nothing to export — add some sections to the canvas first.')
      return
    }
    setLoading(format)
    setOpen(false)
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, format }),
      })
      if (!res.ok) {
        const msg = await res.text().catch(() => 'Unknown error')
        throw new Error(msg)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const project = state.projectMeta
      const name = (project?.name ?? 'export').replace(/[^a-z0-9]/gi, '-').toLowerCase()
      a.download = format === 'zip' ? `${name}.zip` : format === 'html' ? `${name}.html` : `${name}.css`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('[export]', err)
      alert(`Export failed: ${err instanceof Error ? err.message : 'Please try again.'}`)
    } finally {
      setLoading(null)
    }
  }

  const ICON_BTN_BASE: React.CSSProperties = {
    height: 32,
    padding: '0 12px',
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
    gap: 5,
    position: 'relative',
  }

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        style={ICON_BTN_BASE}
        onClick={() => setOpen(v => !v)}
        disabled={loading !== null}
        title="Export project"
      >
        {loading ? (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
            <path d="M6.5 1.5A5 5 0 1 1 1.5 6.5" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 1v7M4 6l2.5 2.5L9 6" />
            <path d="M1.5 9.5v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1" />
          </svg>
        )}
        Export
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M2 3.5l2.5 2.5 2.5-2.5" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          zIndex: 1000,
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: 170,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '6px 0' }}>
            {[
              { format: 'html' as const, label: 'HTML file', desc: 'index.html', icon: '</>' },
              { format: 'css' as const, label: 'CSS file', desc: 'styles.css', icon: '#' },
              { format: 'zip' as const, label: 'ZIP package', desc: 'html + css + assets', icon: '⬛' },
            ].map(({ format, label, desc, icon }) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 14px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--color-text-primary)',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-selected, rgba(99,102,241,0.08))')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>
                  {icon}
                </span>
                <span>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>{desc}</div>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
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

        <SaveButton />

        <Sep />

        {/* Undo / Redo */}
        <UndoRedoButtons />

        <Sep />

        <ThemeToggle />

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

        <ExportButton />

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
            onClick={async () => {
              const state = useBuilderStore.getState()
              if (!state.sectionOrder || state.sectionOrder.length === 0) {
                alert('Nothing to publish — add some sections to the canvas first.')
                return
              }
              try {
                const res = await fetch('/api/export', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ state, format: 'zip' }),
                })
                if (!res.ok) throw new Error(await res.text().catch(() => 'Export failed'))
                const blob = await res.blob()
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                const name = (state.projectMeta?.name ?? 'project').replace(/[^a-z0-9]/gi, '-').toLowerCase()
                a.download = `${name}.zip`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              } catch (e) {
                alert(`Publish failed: ${e instanceof Error ? e.message : 'Please try again.'}`)
              }
            }}
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
        <UserMenu />
      </div>
    </header>
  )
}
