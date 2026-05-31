'use client'

import { useRef, useEffect, useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import { useShallow } from 'zustand/react/shallow'
import type { BuilderStoreState, SectionNode, RowNode, ColumnNode, ElementNode } from '@/types/store.types'
import type { ElementContent } from '@/types/builder.types'

// ─── Selectors ────────────────────────────────────────────────────────────────

function selectLayerData(s: BuilderStoreState) {
  return {
    sectionOrder: s.sectionOrder,
    sections: s.sections,
    rows: s.rows,
    columns: s.columns,
    elements: s.elements,
    selectedId: s.selectedId,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function elementLabel(content: ElementContent): string {
  switch (content.type) {
    case 'heading': return `H${content.level} — ${content.text.slice(0, 28) || 'Heading'}`
    case 'paragraph': return `Text — ${content.text.slice(0, 28) || 'Paragraph'}`
    case 'button': return `Button — ${content.text.slice(0, 28) || 'Button'}`
    case 'image': return `Image — ${content.alt.slice(0, 28) || 'Image'}`
    case 'video': return `Video`
    case 'divider': return `Divider`
    case 'spacer': return `Spacer (${content.height})`
    case 'icon': return `Icon — ${content.name}`
    case 'form': return `Form`
    case 'navbar': return `Navbar`
    case 'hero': return `Hero — ${content.heading.slice(0, 24) || 'Hero'}`
    case 'card': return `Card — ${content.title.slice(0, 24) || 'Card'}`
    case 'footer': return `Footer`
    case 'tabs': return `Tabs`
    case 'accordion': return `Accordion`
    default: {
      const t = (content as { type: string }).type
      return t.charAt(0).toUpperCase() + t.slice(1).replace(/-/g, ' ')
    }
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SectionIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="1" y="1" width="10" height="10" rx="1.5" />
      <path d="M1 4h10" />
    </svg>
  )
}

function RowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="1" y="3.5" width="10" height="5" rx="1" />
      <path d="M5 3.5v5" />
      <path d="M8 3.5v5" />
    </svg>
  )
}

function ColumnIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="1" y="1" width="4" height="10" rx="1" />
      <rect x="7" y="1" width="4" height="10" rx="1" />
    </svg>
  )
}

function ElementIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 3h8M2 6h6M2 9h4" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 140ms ease', flexShrink: 0 }}
    >
      <path d="M3.5 2l3 3-3 3" />
    </svg>
  )
}

// ─── Row ──────────────────────────────────────────────────────────────────────

interface RowProps {
  id: string
  label: string
  icon: React.ReactNode
  depth: number
  isSelected: boolean
  hasChildren: boolean
  isOpen?: boolean
  onToggle?: () => void
  onClick: () => void
  nodeRef?: React.RefObject<HTMLDivElement | null>
}

const DEPTH_COLORS: Record<number, string> = {
  0: 'var(--color-primary)',
  1: '#10b981',
  2: '#f59e0b',
  3: '#8b5cf6',
}

function LayerRow({ id: _id, label, icon, depth, isSelected, hasChildren, isOpen, onToggle, onClick, nodeRef }: RowProps) {
  const indent = depth * 14 + 8
  const color = DEPTH_COLORS[depth] ?? 'var(--color-text-secondary)'

  return (
    <div
      ref={nodeRef}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        height: 28,
        paddingLeft: indent,
        paddingRight: 8,
        cursor: 'pointer',
        borderRadius: 5,
        margin: '1px 4px',
        backgroundColor: isSelected
          ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)'
          : 'transparent',
        outline: isSelected ? '1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)' : 'none',
        userSelect: 'none',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!isSelected) (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-selected)'
      }}
      onMouseLeave={(e) => {
        if (!isSelected) (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'
      }}
    >
      {/* Chevron toggle — only for nodes with children */}
      <span
        onClick={(e) => { e.stopPropagation(); onToggle?.() }}
        style={{
          width: 14,
          height: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'var(--color-text-secondary)',
          opacity: hasChildren ? 1 : 0,
          pointerEvents: hasChildren ? 'auto' : 'none',
        }}
      >
        <ChevronIcon open={!!isOpen} />
      </span>

      {/* Icon */}
      <span style={{ color, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>

      {/* Label */}
      <span style={{
        fontSize: '0.75rem',
        color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)',
        fontWeight: isSelected ? 600 : 400,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
        lineHeight: 1,
      }}>
        {label}
      </span>
    </div>
  )
}

// ─── Sub-trees ────────────────────────────────────────────────────────────────

function ElementLayer({ el, selectedId, setSelected, nodeRefs }: {
  el: ElementNode
  selectedId: string | null
  setSelected: (id: string) => void
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>
}) {
  const isSelected = selectedId === el.id
  return (
    <LayerRow
      id={el.id}
      label={elementLabel(el.content)}
      icon={<ElementIcon />}
      depth={3}
      isSelected={isSelected}
      hasChildren={false}
      onClick={() => setSelected(el.id)}
      nodeRef={{ current: null } as React.RefObject<HTMLDivElement | null>}
    />
  )
}

function ColumnLayer({ col, selectedId, setSelected, nodeRefs }: {
  col: ColumnNode
  selectedId: string | null
  setSelected: (id: string) => void
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>
}) {
  const [open, setOpen] = useState(true)
  const isSelected = selectedId === col.id
  const hasChildren = col.elementIds.length > 0

  return (
    <>
      <LayerRow
        id={col.id}
        label={`Column`}
        icon={<ColumnIcon />}
        depth={2}
        isSelected={isSelected}
        hasChildren={hasChildren}
        isOpen={open}
        onToggle={() => setOpen((v) => !v)}
        onClick={() => setSelected(col.id)}
        nodeRef={{ current: null } as React.RefObject<HTMLDivElement | null>}
      />
      {open && col.elementIds.map((elId, i) => {
        // elements accessed via store directly — avoid re-subscribing here
        return <ElementLayerById key={elId} id={elId} selectedId={selectedId} setSelected={setSelected} nodeRefs={nodeRefs} />
      })}
    </>
  )
}

// Access element by id via getState to avoid extra subscriptions
function ElementLayerById({ id, selectedId, setSelected, nodeRefs }: {
  id: string
  selectedId: string | null
  setSelected: (id: string) => void
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>
}) {
  const el = useBuilderStore((s) => s.elements[id])
  if (!el) return null
  return <ElementLayer el={el} selectedId={selectedId} setSelected={setSelected} nodeRefs={nodeRefs} />
}

function RowLayer({ row, selectedId, setSelected, nodeRefs }: {
  row: RowNode
  selectedId: string | null
  setSelected: (id: string) => void
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>
}) {
  const [open, setOpen] = useState(true)
  const isSelected = selectedId === row.id
  const hasChildren = row.columnIds.length > 0

  return (
    <>
      <LayerRow
        id={row.id}
        label={`Row`}
        icon={<RowIcon />}
        depth={1}
        isSelected={isSelected}
        hasChildren={hasChildren}
        isOpen={open}
        onToggle={() => setOpen((v) => !v)}
        onClick={() => setSelected(row.id)}
        nodeRef={{ current: null } as React.RefObject<HTMLDivElement | null>}
      />
      {open && row.columnIds.map((colId, i) => (
        <ColumnLayerById key={colId} id={colId} colIndex={i} selectedId={selectedId} setSelected={setSelected} nodeRefs={nodeRefs} />
      ))}
    </>
  )
}

function ColumnLayerById({ id, colIndex, selectedId, setSelected, nodeRefs }: {
  id: string
  colIndex: number
  selectedId: string | null
  setSelected: (id: string) => void
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>
}) {
  const col = useBuilderStore((s) => s.columns[id])
  if (!col) return null
  return <ColumnLayer col={col} selectedId={selectedId} setSelected={setSelected} nodeRefs={nodeRefs} />
}

function SectionLayer({ section, index, selectedId, setSelected, nodeRefs }: {
  section: SectionNode
  index: number
  selectedId: string | null
  setSelected: (id: string) => void
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>
}) {
  const [open, setOpen] = useState(true)
  const isSelected = selectedId === section.id
  const hasChildren = section.rowIds.length > 0

  return (
    <>
      <LayerRow
        id={section.id}
        label={`Section ${index + 1}`}
        icon={<SectionIcon />}
        depth={0}
        isSelected={isSelected}
        hasChildren={hasChildren}
        isOpen={open}
        onToggle={() => setOpen((v) => !v)}
        onClick={() => setSelected(section.id)}
        nodeRef={{ current: null } as React.RefObject<HTMLDivElement | null>}
      />
      {open && section.rowIds.map((rowId) => (
        <RowLayerById key={rowId} id={rowId} selectedId={selectedId} setSelected={setSelected} nodeRefs={nodeRefs} />
      ))}
    </>
  )
}

function RowLayerById({ id, selectedId, setSelected, nodeRefs }: {
  id: string
  selectedId: string | null
  setSelected: (id: string) => void
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>
}) {
  const row = useBuilderStore((s) => s.rows[id])
  if (!row) return null
  return <RowLayer row={row} selectedId={selectedId} setSelected={setSelected} nodeRefs={nodeRefs} />
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function LayersPanel() {
  const { sectionOrder, sections, selectedId } = useBuilderStore(
    useShallow((s: BuilderStoreState) => ({
      sectionOrder: s.sectionOrder,
      sections: s.sections,
      selectedId: s.selectedId,
    }))
  )
  const setSelectedId = useBuilderStore((s) => s.setSelectedId)
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const scrollRef = useRef<HTMLDivElement>(null)

  const isEmpty = sectionOrder.length === 0

  if (isEmpty) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 24,
        color: 'var(--color-text-secondary)',
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
          <path d="M14 2L2 8l12 6 12-6L14 2z" />
          <path d="M2 14l12 6 12-6" />
          <path d="M2 20l12 6 12-6" />
        </svg>
        <p style={{ fontSize: '0.8125rem', fontWeight: 500, margin: 0, color: 'var(--color-text-primary)', opacity: 0.6 }}>No layers yet</p>
        <p style={{ fontSize: '0.75rem', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
          Add sections and elements to see the page structure here
        </p>
      </div>
    )
  }

  return (
    <div
      ref={scrollRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingTop: 4,
        paddingBottom: 12,
      }}
    >
      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: 10,
        padding: '4px 12px 8px',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: 4,
        flexWrap: 'wrap',
      }}>
        {([
          { label: 'Section', color: DEPTH_COLORS[0] },
          { label: 'Row', color: DEPTH_COLORS[1] },
          { label: 'Column', color: DEPTH_COLORS[2] },
          { label: 'Element', color: DEPTH_COLORS[3] },
        ] as const).map(({ label, color }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: color, display: 'inline-block', flexShrink: 0 }} />
            {label}
          </span>
        ))}
      </div>

      {sectionOrder.map((sectionId, i) => {
        const section = sections[sectionId]
        if (!section) return null
        return (
          <SectionLayer
            key={sectionId}
            section={section}
            index={i}
            selectedId={selectedId}
            setSelected={setSelectedId}
            nodeRefs={nodeRefs}
          />
        )
      })}
    </div>
  )
}
