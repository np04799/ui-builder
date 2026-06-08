'use client'

import { useLayoutEffect, useEffect, useRef, useState, memo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useBuilderStore } from '@/store/builder.store'
import { useSelectedNodeType } from '@/hooks/useSelectedNodeType'
import { TOOLBAR_ACTIONS, ACTION_GROUPS } from './toolbarActions'
import type { ToolbarAction } from './toolbarActions'
import type { NodeType } from '@/hooks/useSelectedNodeType'

const GAP = 8

const NODE_LABEL: Record<NodeType, string> = {
  section: 'Section',
  row: 'Row',
  column: 'Column',
  element: 'Element',
}

const SEPARATOR_STYLE: React.CSSProperties = {
  width: 1,
  height: 16,
  backgroundColor: 'var(--color-border)',
  flexShrink: 0,
  margin: '0 2px',
}

const BTN_BASE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  border: 'none',
  borderRadius: 4,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  flexShrink: 0,
  padding: 0,
}

// ── Alignment popover ─────────────────────────────────────────────────────────

interface AlignOption {
  value: string
  label: string
  icon: React.ReactNode
}

const TEXT_ALIGNS: AlignOption[] = [
  { value: 'left',    label: 'Align left',    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 3h12M1 7h8M1 11h10" /></svg> },
  { value: 'center',  label: 'Align center',  icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 3h12M3 7h8M2 11h10" /></svg> },
  { value: 'right',   label: 'Align right',   icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 3h12M5 7h8M3 11h10" /></svg> },
  { value: 'justify', label: 'Justify',       icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 3h12M1 7h12M1 11h12" /></svg> },
]

const JUSTIFY_CONTENT: AlignOption[] = [
  { value: 'flex-start', label: 'Justify start',  icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="3" width="4" height="8" rx="1" /><rect x="6" y="4" width="4" height="6" rx="1" /></svg> },
  { value: 'center',     label: 'Justify center', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="4" width="4" height="6" rx="1" /><rect x="5" y="3" width="4" height="8" rx="1" /></svg> },
  { value: 'flex-end',   label: 'Justify end',    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="5" y="4" width="4" height="6" rx="1" /><rect x="9" y="3" width="4" height="8" rx="1" /></svg> },
  { value: 'space-between', label: 'Space between', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="3" width="3" height="8" rx="1" /><rect x="10" y="3" width="3" height="8" rx="1" /></svg> },
]

const ALIGN_ITEMS: AlignOption[] = [
  { value: 'flex-start', label: 'Align top',    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 2h12" /><rect x="2" y="3" width="4" height="8" rx="1" /><rect x="8" y="3" width="4" height="5" rx="1" /></svg> },
  { value: 'center',     label: 'Align middle', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 7h12" /><rect x="2" y="2" width="4" height="10" rx="1" /><rect x="8" y="4" width="4" height="6" rx="1" /></svg> },
  { value: 'flex-end',   label: 'Align bottom', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 12h12" /><rect x="2" y="3" width="4" height="8" rx="1" /><rect x="8" y="6" width="4" height="5" rx="1" /></svg> },
  { value: 'stretch',    label: 'Stretch',      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="4" height="10" rx="1" /><rect x="8" y="2" width="4" height="10" rx="1" /></svg> },
]

function AlignPopover({
  selectedId,
  nodeType,
  anchorRect,
  onClose,
}: {
  selectedId: string
  nodeType: NodeType
  anchorRect: DOMRect
  onClose: () => void
}) {
  const store = useBuilderStore.getState()

  function currentStyles() {
    if (store.elements[selectedId]) return store.elements[selectedId].styles
    if (store.columns[selectedId]) return store.columns[selectedId].styles
    if (store.rows[selectedId]) return store.rows[selectedId].styles
    if (store.sections[selectedId]) return store.sections[selectedId].styles
    return {}
  }

  function applyStyle(key: string, value: string) {
    const s = useBuilderStore.getState()
    const patch = { styles: { ...currentStyles(), [key]: value } }
    if (s.elements[selectedId]) s.updateElement(selectedId, patch)
    else if (s.columns[selectedId]) s.updateColumn(selectedId, patch)
    else if (s.rows[selectedId]) s.updateRow(selectedId, patch)
    else if (s.sections[selectedId]) s.updateSection(selectedId, patch)
  }

  const styles = currentStyles()
  const isContainer = nodeType !== 'element'

  // position popover below the toolbar
  const top = anchorRect.bottom + 6
  const left = Math.max(8, anchorRect.left)

  const popoverRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [onClose])

  function AlignGroup({ label, options, styleKey }: { label: string; options: AlignOption[]; styleKey: string }) {
    const current = styles[styleKey] ?? ''
    return (
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-secondary)', marginBottom: 4 }}>{label}</div>
        <div style={{ display: 'flex', gap: 2 }}>
          {options.map((opt) => (
            <button
              key={opt.value}
              title={opt.label}
              onClick={() => applyStyle(styleKey, opt.value)}
              style={{
                ...BTN_BASE,
                width: 30,
                height: 30,
                color: current === opt.value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                backgroundColor: current === opt.value ? 'var(--color-selected)' : 'transparent',
                borderRadius: 4,
                border: current === opt.value ? '1px solid var(--color-primary)' : '1px solid transparent',
              }}
            >
              {opt.icon}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top,
        left,
        zIndex: 1001,
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
        padding: '10px 12px',
        minWidth: 160,
      }}
    >
      <AlignGroup label="Text align" options={TEXT_ALIGNS} styleKey="textAlign" />
      {isContainer && (
        <>
          <AlignGroup label="Justify content" options={JUSTIFY_CONTENT} styleKey="justifyContent" />
          <AlignGroup label="Align items" options={ALIGN_ITEMS} styleKey="alignItems" />
        </>
      )}
    </div>,
    document.body,
  )
}

// ── Main toolbar ──────────────────────────────────────────────────────────────

function ActionButton({
  action,
  selectedId,
  nodeType,
  onAlignClick,
}: {
  action: ToolbarAction
  selectedId: string
  nodeType: NodeType
  onAlignClick?: (rect: DOMRect) => void
}) {
  if (action.nodeTypes && !action.nodeTypes.includes(nodeType)) return null

  const Icon = action.icon
  const color = action.danger ? 'var(--color-danger)' : 'var(--color-text-secondary)'

  return (
    <button
      title={action.label}
      style={{ ...BTN_BASE, color }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = action.danger
          ? 'rgba(239,68,68,0.08)'
          : 'var(--color-hover)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (action.id === 'alignment' && onAlignClick) {
          onAlignClick(e.currentTarget.getBoundingClientRect())
        } else {
          action.handler(selectedId)
        }
      }}
    >
      <Icon />
    </button>
  )
}

export default memo(function FloatingToolbar() {
  const selectedId = useBuilderStore((s) => s.selectedId)
  const nodeType = useSelectedNodeType()
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: -9999, left: 0, visible: false })
  const [mounted, setMounted] = useState(false)
  const [alignAnchor, setAlignAnchor] = useState<DOMRect | null>(null)

  useEffect(() => { setMounted(true) }, [])

  // Close alignment popover when selection changes
  useEffect(() => { setAlignAnchor(null) }, [selectedId])

  const repositionRef = useRef<() => void>(() => {})
  repositionRef.current = () => {
    const id = selectedId
    const el = toolbarRef.current
    if (!id || !el) {
      setPos((p) => (p.visible ? { ...p, visible: false } : p))
      return
    }
    const target = document.querySelector(`[data-selectable-id="${id}"]`)
    if (!target) {
      setPos((p) => (p.visible ? { ...p, visible: false } : p))
      return
    }
    const targetRect = target.getBoundingClientRect()
    const { width: tw, height: th } = el.getBoundingClientRect()
    const safeW = tw || 220
    const safeH = th || 36
    const vw = window.innerWidth

    let top = targetRect.top - safeH - GAP
    if (top < 8) top = targetRect.bottom + GAP

    let left = targetRect.left + targetRect.width / 2 - safeW / 2
    left = Math.max(8, Math.min(vw - safeW - 8, left))

    setPos({ top, left, visible: true })
  }

  useLayoutEffect(() => { repositionRef.current() }, [selectedId, mounted])

  useEffect(() => {
    if (!selectedId) return
    const handler = () => repositionRef.current()
    const stage = document.querySelector('[data-canvas-stage]')
    stage?.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', handler, { passive: true })
    return () => {
      stage?.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
    }
  }, [selectedId])

  const isEditing = useBuilderStore((s) => s.editingId !== null)

  const handleAlignClick = useCallback((rect: DOMRect) => {
    setAlignAnchor((prev) => (prev ? null : rect))
  }, [])

  if (!mounted || !selectedId || !nodeType || isEditing) return null

  const toolbar = (
    <div
      ref={toolbarRef}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        padding: '4px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
        opacity: pos.visible ? 1 : 0,
        transition: 'opacity 120ms ease',
        pointerEvents: pos.visible ? 'auto' : 'none',
        userSelect: 'none',
      }}
    >
      {/* Node type label */}
      <span
        style={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: 'var(--color-primary)',
          padding: '0 6px',
          lineHeight: 1,
          flexShrink: 0,
          textTransform: 'uppercase',
        }}
      >
        {NODE_LABEL[nodeType]}
      </span>

      <div style={SEPARATOR_STYLE} />

      {ACTION_GROUPS.map((group, gIdx) => {
        const actions = TOOLBAR_ACTIONS.filter((a) => a.group === group)
        if (actions.length === 0) return null

        const visible = actions.filter(
          (a) => !a.nodeTypes || a.nodeTypes.includes(nodeType)
        )
        if (visible.length === 0) return null

        return (
          <div key={group} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {gIdx > 0 && <div style={SEPARATOR_STYLE} />}
            {actions.map((action) => (
              <ActionButton
                key={action.id}
                action={action}
                selectedId={selectedId}
                nodeType={nodeType}
                onAlignClick={action.id === 'alignment' ? handleAlignClick : undefined}
              />
            ))}
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      {createPortal(toolbar, document.body)}
      {alignAnchor && selectedId && nodeType && (
        <AlignPopover
          selectedId={selectedId}
          nodeType={nodeType}
          anchorRect={alignAnchor}
          onClose={() => setAlignAnchor(null)}
        />
      )}
    </>
  )
})
