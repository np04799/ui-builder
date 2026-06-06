'use client'

import { defaultContentForType } from '@/lib/elementDefaults'
import { useBuilderStore } from '@/store/builder.store'

/**
 * Helper: create a new section with one row, using the existing column
 * (addSection creates section + row + column automatically).
 * Returns { secId, rowId, col1Id }
 */
function newSection() {
  const store = useBuilderStore.getState()
  const secId = store.addSection()
  const s = useBuilderStore.getState()
  const rowId = s.sections[secId].rowIds[0]
  const col1Id = s.rows[rowId].columnIds[0]
  return { store, secId, rowId, col1Id }
}

const PREBUILT_SECTIONS = [
  {
    id: 'navbar-default',
    label: 'Navbar',
    description: 'Responsive navbar with logo and links',
    icon: '☰',
    build: () => {
      const c = defaultContentForType('navbar')
      if (c) useBuilderStore.getState().quickAddElement(c)
    },
  },
  {
    id: 'hero-centered',
    label: 'Hero — Centered',
    description: 'Full-width hero with heading, subtitle and CTA',
    icon: '🦸',
    build: () => {
      const c = defaultContentForType('hero')
      if (c) useBuilderStore.getState().quickAddElement(c)
    },
  },
  {
    id: 'two-col-text',
    label: 'Two-Column Text',
    description: 'Heading + paragraph in two columns',
    icon: '⊞',
    build: () => {
      const { store, rowId, col1Id } = newSection()
      const col2Id = store.addColumn(rowId)
      const h = defaultContentForType('heading')
      const p = defaultContentForType('paragraph')
      if (h) store.addElement(col1Id, h)
      if (p) store.addElement(col2Id, p)
    },
  },
  {
    id: 'three-cards',
    label: 'Three Cards',
    description: 'Three-column card layout',
    icon: '🃏',
    build: () => {
      const { store, rowId, col1Id } = newSection()
      const col2Id = store.addColumn(rowId)
      const col3Id = store.addColumn(rowId)
      const colIds = [col1Id, col2Id, col3Id]
      colIds.forEach(colId => {
        const c = defaultContentForType('card')
        if (c) store.addElement(colId, c)
      })
    },
  },
  {
    id: 'image-text',
    label: 'Image + Text',
    description: 'Image left, heading + paragraph right',
    icon: '🖼',
    build: () => {
      const { store, rowId, col1Id } = newSection()
      const col2Id = store.addColumn(rowId)
      const img = defaultContentForType('image')
      const h = defaultContentForType('heading')
      const p = defaultContentForType('paragraph')
      const b = defaultContentForType('button')
      if (img) store.addElement(col1Id, img)
      if (h) store.addElement(col2Id, h)
      if (p) store.addElement(col2Id, p)
      if (b) store.addElement(col2Id, b)
    },
  },
  {
    id: 'contact-form',
    label: 'Contact Form',
    description: 'Heading + contact form section',
    icon: '📋',
    build: () => {
      const { store, col1Id } = newSection()
      const h = defaultContentForType('heading')
      const f = defaultContentForType('form')
      if (h) store.addElement(col1Id, h)
      if (f) store.addElement(col1Id, f)
    },
  },
  {
    id: 'pricing',
    label: 'Pricing',
    description: 'Three pricing card columns',
    icon: '💳',
    build: () => {
      const { store, rowId, col1Id } = newSection()
      const col2Id = store.addColumn(rowId)
      const col3Id = store.addColumn(rowId)
      const colIds = [col1Id, col2Id, col3Id]
      colIds.forEach(colId => {
        const c = defaultContentForType('pricing-card')
        if (c) store.addElement(colId, c)
      })
    },
  },
  {
    id: 'footer-default',
    label: 'Footer',
    description: 'Links + copyright footer',
    icon: '📄',
    build: () => {
      const c = defaultContentForType('footer')
      if (c) useBuilderStore.getState().quickAddElement(c)
    },
  },
]

export default function SectionsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid var(--color-border)', fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>
        Click to add a pre-built section to your canvas
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {PREBUILT_SECTIONS.map(sec => (
          <button
            key={sec.id}
            onClick={sec.build}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 6, border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)', cursor: 'pointer', textAlign: 'left', marginBottom: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--color-selected)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.backgroundColor = 'var(--color-bg)' }}
          >
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{sec.icon}</span>
            <span style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{sec.label}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>{sec.description}</div>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
