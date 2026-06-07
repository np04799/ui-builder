'use client'

import { useEffect } from 'react'
import { useUndoRedo } from '@/hooks/useUndoRedo'
import { useBuilderStore } from '@/store/builder.store'
import { BUILDER_EDIT_KEY } from '@/components/marketing/InspirationSection'
import Toolbar from '@/components/builder/toolbar/Toolbar'
import LeftSidebar from '@/components/builder/panels/LeftSidebar'
import PropertiesPanel from '@/components/builder/panels/PropertiesPanel'
import ViewportWrapper from '@/components/builder/preview/ViewportWrapper'
import FloatingToolbar from '@/components/builder/floating/FloatingToolbar'
import Breadcrumb from '@/components/builder/layout/Breadcrumb'
import ProjectSetupWizard from '@/components/builder/wizard/ProjectSetupWizard'
import BrandingApplicator from '@/components/builder/layout/BrandingApplicator'
import FrameworkLoader from '@/components/builder/layout/FrameworkLoader'

export default function BuilderLayout() {
  useUndoRedo()
  const leftPanelVisible = useBuilderStore((s) => s.leftPanelVisible)
  const rightPanelVisible = useBuilderStore((s) => s.rightPanelVisible)
  const canvasZoom = useBuilderStore((s) => s.canvasZoom)
  const projectMeta = useBuilderStore((s) => s.projectMeta)

  // ── Load template from InspirationSection Edit button ────────────────────
  useEffect(() => {
    const raw = localStorage.getItem(BUILDER_EDIT_KEY)
    if (!raw) return
    try {
      const payload = JSON.parse(raw)
      useBuilderStore.setState({
        sections:    payload.sections    ?? {},
        rows:        payload.rows        ?? {},
        columns:     payload.columns     ?? {},
        elements:    payload.elements    ?? {},
        sectionOrder: payload.sectionOrder ?? [],
        projectMeta: payload.projectMeta ?? null,
        mode:        payload.mode        ?? 'custom',
        canvasWidth: payload.canvasWidth ?? '100%',
        projectName: payload.projectName ?? payload.projectMeta?.name ?? 'Template',
        selectedId:  null,
        editingId:   null,
        _history:    [],
        _future:     [],
      })
    } catch { /* ignore parse errors */ }
    finally { localStorage.removeItem(BUILDER_EDIT_KEY) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Global keyboard shortcuts ─────────────────────────────────────────────
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Ignore when typing in inputs / contenteditable
      const tag = (e.target as HTMLElement)?.tagName
      const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' ||
        (e.target as HTMLElement)?.isContentEditable
      if (isEditable) return

      const store = useBuilderStore.getState()
      const sel = store.selectedId

      const ctrl = e.ctrlKey || e.metaKey

      // Note: Ctrl+Z / Ctrl+Y handled by useUndoRedo hook
      if (ctrl && e.key === 'c') { e.preventDefault(); store.copySelected?.(); return }
      if (ctrl && e.key === 'v') { e.preventDefault(); store.pasteClipboard?.(); return }
      if (ctrl && e.key === 'd') { e.preventDefault(); if (sel && store.elements[sel]) store.duplicateElement?.(sel); return }

      // Delete / Backspace — remove selected element
      if ((e.key === 'Delete' || e.key === 'Backspace') && sel) {
        e.preventDefault()
        if (store.elements[sel]) store.deleteElement(sel)
        else if (store.columns[sel]) store.deleteColumn(sel)
        else if (store.rows[sel]) store.deleteRow(sel)
        else if (store.sections[sel]) store.deleteSection(sel)
        store.setSelectedId(null)
        return
      }

      // Escape — deselect
      if (e.key === 'Escape') { store.setSelectedId(null); store.setEditingId?.(null); return }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {!projectMeta && <ProjectSetupWizard />}
      <BrandingApplicator />
      <FrameworkLoader />
      <Toolbar />

      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {leftPanelVisible && <LeftSidebar />}

        {/* Canvas stage */}
        <main
          data-canvas-stage
          style={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'var(--color-canvas-stage)',
            minWidth: 0,
          }}
        >
          <div
            style={{
              minHeight: '100%',
              display: 'flex',
              justifyContent: 'center',
              padding: '32px 24px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                transform: `scale(${canvasZoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease',
              }}
            >
              <ViewportWrapper />
            </div>
          </div>
        </main>

        {rightPanelVisible && <PropertiesPanel />}
      </div>

      {/* Bottom breadcrumb */}
      <Breadcrumb />

      <FloatingToolbar />
    </div>
  )
}
