'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import { useDashboardStore } from '@/store/dashboard.store'

const PAGES_KEY = 'bp_pages'

interface Page {
  id: string
  name: string
  pageType: 'canvas' | 'dashboard'
  stateSnapshot: string
  createdAt: string
}

function loadPages(): Page[] {
  try { return JSON.parse(localStorage.getItem(PAGES_KEY) ?? '[]') } catch { return [] }
}

function savePages(pages: Page[]) {
  localStorage.setItem(PAGES_KEY, JSON.stringify(pages))
}

export default function PagesPanel() {
  const [pages, setPages] = useState<Page[]>(loadPages)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const projectMeta = useBuilderStore(s => s.projectMeta)
  const isDashboardMode = useBuilderStore(s => s.isDashboardMode)

  function handleSaveCurrent() {
    if (!newName.trim()) return
    const state = useBuilderStore.getState()
    const dashState = useDashboardStore.getState()
    const page: Page = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      pageType: state.isDashboardMode ? 'dashboard' : 'canvas',
      stateSnapshot: state.isDashboardMode
        ? JSON.stringify({ widgets: dashState.widgets, gridLayouts: dashState.gridLayouts, dataSources: dashState.dataSources })
        : JSON.stringify({
            sections: state.sections,
            rows: state.rows,
            columns: state.columns,
            elements: state.elements,
            sectionOrder: state.sectionOrder,
          }),
      createdAt: new Date().toISOString(),
    }
    const updated = [...pages, page]
    setPages(updated)
    savePages(updated)
    setNewName('')
    setAdding(false)
  }

  function handleSwitch(page: Page) {
    if (!confirm(`Switch to "${page.name}"? Unsaved changes to the current view will be lost.`)) return
    try {
      const snap = JSON.parse(page.stateSnapshot)
      if (page.pageType === 'dashboard') {
        useDashboardStore.setState({
          widgets: snap.widgets ?? [],
          gridLayouts: snap.gridLayouts ?? { lg: [], md: [], sm: [] },
          dataSources: snap.dataSources ?? [],
          selectedWidgetId: null,
        })
        useBuilderStore.setState(s => ({
          isDashboardMode: true,
          projectMeta: s.projectMeta ? { ...s.projectMeta, canvasLayout: 'fixed-grid' } : s.projectMeta,
        }))
      } else {
        useBuilderStore.setState({
          sections: snap.sections,
          rows: snap.rows,
          columns: snap.columns,
          elements: snap.elements,
          sectionOrder: snap.sectionOrder,
          selectedId: null,
          editingId: null,
          isDashboardMode: false,
        })
        useBuilderStore.setState(s => ({
          projectMeta: s.projectMeta ? { ...s.projectMeta, canvasLayout: 'flex-flow' } : s.projectMeta,
        }))
      }
    } catch { alert('Failed to load page') }
  }

  function handleNewDashboard() {
    if (!confirm('Switch to a blank Dashboard? Save current work as a page first if needed.')) return
    useDashboardStore.getState().reset()
    useBuilderStore.setState(s => ({
      isDashboardMode: true,
      projectMeta: s.projectMeta ? { ...s.projectMeta, canvasLayout: 'fixed-grid' } : s.projectMeta,
    }))
  }

  function handleDelete(id: string) {
    const updated = pages.filter(p => p.id !== id)
    setPages(updated)
    savePages(updated)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '8px', borderBottom: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {adding ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              autoFocus value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSaveCurrent(); if (e.key === 'Escape') setAdding(false) }}
              placeholder="Page name..."
              style={{ flex: 1, height: 28, padding: '0 8px', borderRadius: 4, border: '1px solid var(--color-primary)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)', fontSize: '0.75rem', outline: 'none' }}
            />
            <button onClick={handleSaveCurrent} disabled={!newName.trim()}
              style={{ height: 28, padding: '0 10px', borderRadius: 4, border: 'none', backgroundColor: 'var(--color-primary)', color: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>
              Save
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => setAdding(true)}
              style={{ width: '100%', height: 30, borderRadius: 5, border: '1px dashed var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 1v8M1 5h8" /></svg>
              Save {isDashboardMode ? 'dashboard' : 'canvas'} as page
            </button>
            <button onClick={handleNewDashboard}
              style={{ width: '100%', height: 30, borderRadius: 5, border: '1px dashed rgba(99,102,241,0.4)', backgroundColor: 'rgba(99,102,241,0.06)', color: 'var(--color-primary)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="0.5" y="0.5" width="4" height="4" rx="0.5"/><rect x="5.5" y="0.5" width="4" height="4" rx="0.5"/><rect x="0.5" y="5.5" width="4" height="4" rx="0.5"/><rect x="5.5" y="5.5" width="4" height="4" rx="0.5"/></svg>
              New blank dashboard
            </button>
          </>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {/* Current page indicator */}
        <div style={{ padding: '8px 10px', borderRadius: 6, border: '2px solid var(--color-primary)', backgroundColor: 'var(--color-selected)', marginBottom: 6 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            {isDashboardMode ? 'Dashboard Mode' : 'Current Canvas'}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>
            {isDashboardMode ? 'KPI Dashboard' : (projectMeta?.name ?? 'Untitled')}
          </div>
        </div>

        {pages.length === 0 ? (
          <div style={{ padding: '16px 12px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
            Save snapshots of your canvas or dashboard as pages to switch between them.
          </div>
        ) : (
          pages.map(page => (
            <div key={page.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', borderRadius: 6, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', marginBottom: 6 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page.name}</span>
                  {page.pageType === 'dashboard' && (
                    <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', borderRadius: 3, padding: '1px 4px', flexShrink: 0 }}>DASH</span>
                  )}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>{new Date(page.createdAt).toLocaleDateString()}</div>
              </div>
              <button onClick={() => handleSwitch(page)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', padding: 4, fontSize: '0.6875rem', fontWeight: 600 }}>Open</button>
              <button onClick={() => handleDelete(page.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 4, borderRadius: 4 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h8M5 3V2h2v1M4.5 9.5V5M7.5 9.5V5M3 3l.5 7h5l.5-7" /></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
