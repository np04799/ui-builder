'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'

const STORAGE_KEY = 'bp_saved_components'

interface SavedComponent {
  id: string
  name: string
  sectionId: string
  snapshot: string // JSON
  savedAt: string
}

function loadComponents(): SavedComponent[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
}

function saveComponents(comps: SavedComponent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comps))
}

export default function ComponentsPanel() {
  const [components, setComponents] = useState<SavedComponent[]>(loadComponents)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const selectedId = useBuilderStore((s) => s.selectedId)
  const sections = useBuilderStore((s) => s.sections)
  const rows = useBuilderStore((s) => s.rows)
  const columns = useBuilderStore((s) => s.columns)
  const elements = useBuilderStore((s) => s.elements)

  // Can only save a selected section
  const selectedSection = selectedId && sections[selectedId] ? sections[selectedId] : null

  function handleSave() {
    if (!selectedSection || !name.trim()) return
    const comp: SavedComponent = {
      id: crypto.randomUUID(),
      name: name.trim(),
      sectionId: selectedId!,
      snapshot: JSON.stringify({
        section: selectedSection,
        rows: Object.fromEntries(
          selectedSection.rowIds.map(rid => [rid, rows[rid]])
        ),
        columns: Object.fromEntries(
          selectedSection.rowIds.flatMap(rid =>
            (rows[rid]?.columnIds ?? []).map(cid => [cid, columns[cid]])
          )
        ),
        elements: Object.fromEntries(
          selectedSection.rowIds.flatMap(rid =>
            (rows[rid]?.columnIds ?? []).flatMap(cid =>
              (columns[cid]?.elementIds ?? []).map(eid => [eid, elements[eid]])
            )
          )
        ),
      }),
      savedAt: new Date().toISOString(),
    }
    const updated = [...components, comp]
    setComponents(updated)
    saveComponents(updated)
    setName('')
    setSaving(false)
  }

  function handleInsert(comp: SavedComponent) {
    try {
      const snap = JSON.parse(comp.snapshot)
      useBuilderStore.getState().insertTemplate({
        section: snap.section,
        rows: Object.values(snap.rows),
        columns: Object.values(snap.columns),
        elements: Object.values(snap.elements),
      })
    } catch (e) {
      alert('Failed to insert component')
    }
  }

  function handleDelete(id: string) {
    const updated = components.filter(c => c.id !== id)
    setComponents(updated)
    saveComponents(updated)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Save current section */}
      <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid var(--color-border)' }}>
        {saving ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setSaving(false) }}
              placeholder="Component name…"
              style={{
                flex: 1, height: 28, padding: '0 8px', borderRadius: 4,
                border: '1px solid var(--color-primary)', backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text-primary)', fontSize: '0.75rem', outline: 'none',
              }}
            />
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              style={{ height: 28, padding: '0 10px', borderRadius: 4, border: 'none', backgroundColor: 'var(--color-primary)', color: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSaving(true)}
            disabled={!selectedSection}
            title={!selectedSection ? 'Select a section on the canvas first' : 'Save selected section as component'}
            style={{
              width: '100%', height: 30, borderRadius: 5, border: '1px dashed var(--color-border)',
              backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '0.75rem',
              cursor: selectedSection ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 5, opacity: selectedSection ? 1 : 0.5,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 1v8M1 5h8" /></svg>
            Save selected section
          </button>
        )}
      </div>

      {/* Component list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {components.length === 0 ? (
          <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
            No saved components yet.<br />Select a section and click "Save".
          </div>
        ) : (
          components.map(comp => (
            <div
              key={comp.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                borderRadius: 6, border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)', marginBottom: 6,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {comp.name}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>
                  {new Date(comp.savedAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => handleInsert(comp)}
                title="Insert into canvas"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', padding: 4, borderRadius: 4, fontSize: '0.6875rem', fontWeight: 600 }}
              >
                Insert
              </button>
              <button
                onClick={() => handleDelete(comp.id)}
                title="Delete"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 4, borderRadius: 4 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h8M5 3V2h2v1M4.5 9.5V5M7.5 9.5V5M3 3l.5 7h5l.5-7" /></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
