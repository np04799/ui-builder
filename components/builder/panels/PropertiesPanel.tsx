'use client'

import { useSelectedId } from '@/hooks/useBuilderSelectors'
import { useSelectedNodeType } from '@/hooks/useSelectedNodeType'
import SectionProperties from '@/components/builder/properties/SectionProperties'
import RowProperties from '@/components/builder/properties/RowProperties'
import ColumnProperties from '@/components/builder/properties/ColumnProperties'
import ElementProperties from '@/components/builder/properties/ElementProperties'

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      style={{
        padding: '32px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 8,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          backgroundColor: 'var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        {/* Cursor icon */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 2l12 7-7 2-2 7L4 2z" />
        </svg>
      </div>
      <p
        style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          margin: 0,
        }}
      >
        No Element Selected
      </p>
      <p
        style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary)',
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        Select an element on the canvas to edit its properties.
      </p>
    </div>
  )
}

// ─── PropertiesPanel ──────────────────────────────────────────────────────────

const NODE_LABEL: Record<string, string> = {
  section: 'Section',
  row: 'Row',
  column: 'Column',
  element: 'Element',
}

export default function PropertiesPanel() {
  const selectedId = useSelectedId()
  const nodeType = useSelectedNodeType()
  const hasSelection = selectedId !== null && nodeType !== null

  return (
    <aside
      style={{
        width: 288,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-surface)',
        borderLeft: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 40,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          {hasSelection ? NODE_LABEL[nodeType!] ?? 'Properties' : 'No Element Selected'}
        </span>

        {/* Icon — cursor or node badge */}
        {hasSelection ? (
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-selected)',
              padding: '2px 8px',
              borderRadius: 99,
            }}
          >
            {NODE_LABEL[nodeType!]}
          </span>
        ) : (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 1.5l8 5-5 1.5-1.5 5L3 1.5z" />
            </svg>
          </div>
        )}
      </div>

      {/* Body */}
      <div data-properties-body style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {!hasSelection ? (
          <EmptyState />
        ) : (
          <>
            {nodeType === 'section' && <SectionProperties id={selectedId} />}
            {nodeType === 'row' && <RowProperties id={selectedId} />}
            {nodeType === 'column' && <ColumnProperties id={selectedId} />}
            {nodeType === 'element' && <ElementProperties id={selectedId} />}
          </>
        )}
      </div>
    </aside>
  )
}
