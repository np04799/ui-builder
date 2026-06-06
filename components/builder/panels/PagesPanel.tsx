'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'

const PAGES_KEY = 'bp_pages'

interface Page {
  id: string
  name: string
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

  function handleSaveCurrent() {
    if (!newName.trim()) return
    const state = useBuilderStore.getState()
    const page: Page = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      stateSnapshot: JSON.stringify({
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
    if (!confirm(`Switch to "${page.name}"? Unsaved changes to the current canvas will be lost.`)) return
    try {
      const snap = JSON.parse(page.stateSnapshot)
      useBuilderStore.setState({
        sections: snap.sections,
        rows: snap.rows,
        columns: snap.columns,
        elements: snap.elements,
        sectionOrder: snap.sectionOrder,
        selectedId: null,
        editingId: null,
      })
    } catch { alert('Failed to load page') }
  }

  function handleDelete(id: string) {
    const updated = pages.filter(p => p.id !== id)
    setPages(updated)
    savePages(updated)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '8px', borderBottom: '1px solid var(--color-border)' }}>
        {adding ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              autoFocus value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSaveCurrent(); if (e.key === 'Escape') setAdding(false) }}
              placeholder="Page name…"
              style={{ flex: 1, height: 28, padding: '0 8px', borderRadius: 4, border: '1px solid var(--color-primary)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)', fontSize: '0.75rem', outline: 'none' }}
            />
            <button onClick={handleSaveCurrent} disabled={!newName.trim()}
              style={{ height: 28, padding: '0 10px', borderRadius: 4, border: 'none', backgroundColor: 'var(--color-primary)', color: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>
              Save
            </button>
          </div>
        ) : (
          <button onClick={() => setAdding(true)}
            style={{ width: '100%', height: 30, borderRadius: 5, border: '1px dashed var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 1v8M1 5h8" /></svg>
            Save canvas as page
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {/* Current page indicator */}
        <div style={{ padding: '8px 10px', borderRadius: 6, border: '2px solid var(--color-primary)', backgroundColor: 'var(--color-selected)', marginBottom: 6 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>● Current Canvas</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>{projectMeta?.name ?? 'Untitled'}</div>
        </div>

        {pages.length === 0 ? (
          <div style={{ padding: '16px 12px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
            Save snapshots of your canvas as pages to switch between them.
          </div>
        ) : (
          pages.map(page => (
            <div key={page.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', borderRadius: 6, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', marginBottom: 6 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page.name}</div>
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
