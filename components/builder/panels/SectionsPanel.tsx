'use client'

import { defaultContentForType } from '@/lib/elementDefaults'
import { useBuilderStore } from '@/store/builder.store'

const PREBUILT_SECTIONS = [
  {
    id: 'hero-centered',
    label: 'Hero — Centered',
    description: 'Full-width hero with heading, subtitle and CTA',
    icon: '🦸',
    build: () => {
      const store = useBuilderStore.getState()
      const _c = defaultContentForType('hero')
      if (_c) store.quickAddElement(_c)
    },
  },
  {
    id: 'navbar-default',
    label: 'Navbar',
    description: 'Responsive navbar with logo and links',
    icon: '☰',
    build: () => {
      const store = useBuilderStore.getState()
      const _c = defaultContentForType('navbar')
      if (_c) store.quickAddElement(_c)
    },
  },
  {
    id: 'two-col-text',
    label: 'Two-Column Text',
    description: 'Heading + paragraph in two columns',
    icon: '⊞',
    build: () => {
      const store = useBuilderStore.getState()
      const secId = store.addSection()
      // Use existing row created by addSection
      const existingState = useBuilderStore.getState()
      const rowId = existingState.sections[secId]?.rowIds[0] ?? store.addRow(secId)
      // Use existing column, then add more
      const existingCols = useBuilderStore.getState().rows[rowId]?.columnIds ?? []
      const col1 = existingCols[0] ?? store.addColumn(rowId)
      const col2 = store.addColumn(rowId)
      { const _c = defaultContentForType('heading'); if (_c) store.addElement(col1, _c) }
      { const _c = defaultContentForType('paragraph'); if (_c) store.addElement(col2, _c) }
    },
  },
  {
    id: 'three-cards',
    label: 'Three Cards',
    description: 'Three-column card layout',
    icon: '🃏',
    build: () => {
      const store = useBuilderStore.getState()
      const secId = store.addSection()
      // Use existing row created by addSection
      const existingState = useBuilderStore.getState()
      const rowId = existingState.sections[secId]?.rowIds[0] ?? store.addRow(secId)
      for (let i = 0; i < 3; i++) {
        // Use existing column
      const existingCols2 = useBuilderStore.getState().rows[rowId]?.columnIds ?? []
      const colId = existingCols2[0] ?? store.addColumn(rowId)
        { const _c = defaultContentForType('card'); if (_c) store.addElement(colId, _c) }
      }
    },
  },
  {
    id: 'contact-form',
    label: 'Contact Form',
    description: 'Heading + contact form section',
    icon: '📋',
    build: () => {
      const store = useBuilderStore.getState()
      const _c = defaultContentForType('heading')
      if (_c) store.quickAddElement(_c)
      // Add form to the same column
      const _colId = Object.values(useBuilderStore.getState().columns).slice(-1)[0]?.id
      const _f = defaultContentForType('form')
      if (_f && _colId) store.addElement(_colId, _f)
    },
  },
  {
    id: 'footer-default',
    label: 'Footer',
    description: 'Links + copyright footer',
    icon: '📄',
    build: () => {
      const store = useBuilderStore.getState()
      const _c = defaultContentForType('footer')
      if (_c) store.quickAddElement(_c)
    },
  },
  {
    id: 'image-text',
    label: 'Image + Text',
    description: 'Image left, heading + paragraph right',
    icon: '🖼',
    build: () => {
      const store = useBuilderStore.getState()
      const secId = store.addSection()
      // Use existing row created by addSection
      const existingState = useBuilderStore.getState()
      const rowId = existingState.sections[secId]?.rowIds[0] ?? store.addRow(secId)
      // Use existing column, then add more
      const existingCols = useBuilderStore.getState().rows[rowId]?.columnIds ?? []
      const col1 = existingCols[0] ?? store.addColumn(rowId)
      const col2 = store.addColumn(rowId)
      { const _c = defaultContentForType('image'); if (_c) store.addElement(col1, _c) }
      { const _c = defaultContentForType('heading'); if (_c) store.addElement(col2, _c) }
      { const _c = defaultContentForType('paragraph'); if (_c) store.addElement(col2, _c) }
      { const _c = defaultContentForType('button'); if (_c) store.addElement(col2, _c) }
    },
  },
  {
    id: 'pricing',
    label: 'Pricing',
    description: 'Three pricing card columns',
    icon: '💳',
    build: () => {
      const store = useBuilderStore.getState()
      const secId = store.addSection()
      // Use existing row created by addSection
      const existingState = useBuilderStore.getState()
      const rowId = existingState.sections[secId]?.rowIds[0] ?? store.addRow(secId)
      for (let i = 0; i < 3; i++) {
        // Use existing column
      const existingCols2 = useBuilderStore.getState().rows[rowId]?.columnIds ?? []
      const colId = existingCols2[0] ?? store.addColumn(rowId)
        { const _c = defaultContentForType('pricing-card'); if (_c) store.addElement(colId, _c) }
      }
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
