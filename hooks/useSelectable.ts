'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'

// ─────────────────────────────────────────────────────────────────────────────
// useSelectable
//
// Core selection primitive for all renderer nodes (section, row, column, element).
//
// Design decisions:
//   - Reads `s.selectedId === id` directly (boolean selector) so only the
//     previously-deselected and newly-selected nodes re-render on each click,
//     not every renderer in the tree.
//   - Hover is local useState — no store involvement, no global rerender.
//   - onMouseOver/onMouseOut with stopPropagation gives exclusive hover:
//     only the most specific hovered node shows its ring.
//   - onClick with stopPropagation prevents parent selection on child click.
//   - selectionStyle uses inset box-shadow so it never affects layout or gets
//     clipped by parent overflow.
//
// Editing system integration:
//   - isSelected is the gate for showing any editing controls.
//   - The editing system reads selectedId from the store (already exists) and
//     renders its UI in PropertiesPanel. No changes to this hook needed.
//
// Drag-drop integration:
//   - dnd-kit attaches its own listeners via useDraggable/useDroppable.
//   - Pass selectionHandlers and dnd listeners as separate spreads; they
//     compose without conflict since dnd uses pointerdown, not onClick.
// ─────────────────────────────────────────────────────────────────────────────

export type SelectableType = 'section' | 'row' | 'column' | 'element'

interface SelectableResult {
  isSelected: boolean
  isHovered: boolean
  selectionStyle: React.CSSProperties
  selectionHandlers: {
    onMouseOver: (e: React.MouseEvent) => void
    onMouseOut: (e: React.MouseEvent) => void
    onClick: (e: React.MouseEvent) => void
  }
}

export function useSelectable(id: string): SelectableResult {
  const isSelected = useBuilderStore((s) => s.selectedId === id)
  const setSelectedId = useBuilderStore((s) => s.setSelectedId)
  const [hovered, setHovered] = useState(false)

  const isHovered = hovered && !isSelected

  const selectionStyle: React.CSSProperties = isSelected
    ? { boxShadow: 'inset 0 0 0 2px var(--color-primary)', cursor: 'default' }
    : isHovered
    ? {
        boxShadow:
          'inset 0 0 0 1px color-mix(in srgb, var(--color-primary) 45%, transparent)',
        cursor: 'default',
      }
    : {}

  const selectionHandlers = {
    onMouseOver(e: React.MouseEvent) {
      e.stopPropagation()
      setHovered(true)
    },
    onMouseOut(e: React.MouseEvent) {
      e.stopPropagation()
      setHovered(false)
    },
    onClick(e: React.MouseEvent) {
      e.stopPropagation()
      setSelectedId(id)
    },
  }

  return { isSelected, isHovered, selectionStyle, selectionHandlers }
}
