'use client'

import { useBuilderStore } from '@/store/builder.store'

const PREBUILT_SECTIONS = [
  {
    id: 'hero-centered',
    label: 'Hero — Centered',
    description: 'Full-width hero with heading, subtitle and CTA',
    icon: '🦸',
    build: () => {
      const store = useBuilderStore.getState()
      const secId = store.addSection()
      const rowId = store.addRow(secId)
      const colId = store.addColumn(rowId)
      const { defaultContentForType } = require('@/lib/elementDefaults')
      store.addElement(colId, defaultContentForType('hero'))
    },
  },
  {
    id: 'navbar-default',
    label: 'Navbar',
    description: 'Responsive navbar with logo and links',
    icon: '☰',
    build: () => {
      const store = useBuilderStore.getState()
      const secId = store.addSection()
      const rowId = store.addRow(secId)
      const colId = store.addColumn(rowId)
      const { defaultContentForType } = require('@/lib/elementDefaults')
      store.addElement(colId, defaultContentForType('navbar'))
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
      const rowId = store.addRow(secId)
      const col1 = store.addColumn(rowId)
      const col2 = store.addColumn(rowId)
      const { defaultContentForType } = require('@/lib/elementDefaults')
      store.addElement(col1, defaultContentForType('heading'))
      store.addElement(col2, defaultContentForType('paragraph'))
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
      const rowId = store.addRow(secId)
      const { defaultContentForType } = require('@/lib/elementDefaults')
      for (let i = 0; i < 3; i++) {
        const colId = store.addColumn(rowId)
        store.addElement(colId, defaultContentForType('card'))
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
      const secId = store.addSection()
      const rowId = store.addRow(secId)
      const colId = store.addColumn(rowId)
      const { defaultContentForType } = require('@/lib/elementDefaults')
      store.addElement(colId, defaultContentForType('heading'))
      store.addElement(colId, defaultContentForType('form'))
    },
  },
  {
    id: 'footer-default',
    label: 'Footer',
    description: 'Links + copyright footer',
    icon: '📄',
    build: () => {
      const store = useBuilderStore.getState()
      const secId = store.addSection()
      const rowId = store.addRow(secId)
      const colId = store.addColumn(rowId)
      const { defaultContentForType } = require('@/lib/elementDefaults')
      store.addElement(colId, defaultContentForType('footer'))
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
      const rowId = store.addRow(secId)
      const col1 = store.addColumn(rowId)
      const col2 = store.addColumn(rowId)
      const { defaultContentForType } = require('@/lib/elementDefaults')
      store.addElement(col1, defaultContentForType('image'))
      store.addElement(col2, defaultContentForType('heading'))
      store.addElement(col2, defaultContentForType('paragraph'))
      store.addElement(col2, defaultContentForType('button'))
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
      const rowId = store.addRow(secId)
      const { defaultContentForType } = require('@/lib/elementDefaults')
      for (let i = 0; i < 3; i++) {
        const colId = store.addColumn(rowId)
        store.addElement(colId, defaultContentForType('pricing-card'))
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
