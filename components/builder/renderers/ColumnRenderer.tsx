'use client'

import { memo, useRef, useState, useCallback } from 'react'
import { useColumn, useResponsiveMode } from '@/hooks/useBuilderSelectors'
import { useBuilderStore } from '@/store/builder.store'
import { useSelectable } from '@/hooks/useSelectable'
import ElementRenderer from './ElementRenderer'
import DraggableElement from '@/components/builder/dnd/DraggableElement'
import DropIndicator from '@/components/builder/dnd/DropIndicator'
import ResizeHandle from '@/components/builder/dnd/ResizeHandle'
import { DND_TYPE, decodeDragPayload } from '@/components/builder/dnd/dragTypes'
import { defaultContentForType } from '@/lib/elementDefaults'
import ElementPickerPopover from '@/components/builder/panels/ElementPickerPopover'

// dataTransfer.types is DOMStringList in Firefox, Array in Chrome.
function typesHas(types: DOMStringList | readonly string[], mime: string): boolean {
  return Array.from(types).indexOf(mime) !== -1
}

interface Props {
  id: string
  /** When true (default), columns with managedBy set are not rendered at row level */
  skipIfManaged?: boolean
}

const ColumnRenderer = memo(function ColumnRenderer({ id, skipIfManaged = true }: Props) {
  const column = useColumn(id)
  const moveElement = useBuilderStore((s) => s.moveElement)
  const addElement = useBuilderStore((s) => s.addElement)
  const addRowAfterColumn = useBuilderStore((s) => s.addRowAfterColumn)
  const addColumnToSameRow = useBuilderStore((s) => s.addColumnToSameRow)
  const updateColumn = useBuilderStore((s) => s.updateColumn)
  const activeDrag = useBuilderStore((s) => s.dragState)
  const { isSelected, selectionStyle, selectionHandlers } = useSelectable(id)
  const responsiveMode = useResponsiveMode()
  const columnRef = useRef<HTMLDivElement>(null)

  const [dropSlot, setDropSlot] = useState<number | null>(null)
  const dropSlotRef = useRef<number | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showPicker, setShowPicker] = useState(false)

  const isDragActive = activeDrag !== null

  // ── Drop slot calculation ──────────────────────────────────────────────────

  const getDropSlot = useCallback((clientY: number): number => {
    if (!columnRef.current) return 0
    const items = Array.from(
      columnRef.current.querySelectorAll<HTMLElement>('[data-draggable-element]')
    )
    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect()
      if (clientY < rect.top + rect.height / 2) return i
    }
    return items.length
  }, [])

  function updateDropSlot(slot: number | null) {
    dropSlotRef.current = slot
    setDropSlot(slot)
  }

  // ── Drag event handlers ────────────────────────────────────────────────────

  function handleDragOver(e: React.DragEvent) {
    if (!typesHas(e.dataTransfer.types, DND_TYPE)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
    const slot = getDropSlot(e.clientY)
    updateDropSlot(slot)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (columnRef.current && !columnRef.current.contains(e.relatedTarget as Node)) {
      updateDropSlot(null)
      setIsDragOver(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    const raw = e.dataTransfer.getData(DND_TYPE)
    const payload = decodeDragPayload(raw)
    const slot = dropSlotRef.current ?? 0
    updateDropSlot(null)
    setIsDragOver(false)

    if (!payload) return

    if (payload.type === 'element') {
      // Reorder or cross-column move
      const isSameColumn = payload.sourceColumnId === id
      const toIndex = isSameColumn && slot > payload.sourceIndex ? slot - 1 : slot
      moveElement(payload.elementId, payload.sourceColumnId, id, toIndex)
    } else if (payload.type === 'panel') {
      if (payload.elementType === 'row-layout') {
        addRowAfterColumn(id)
      } else if (payload.elementType === 'column-layout') {
        addColumnToSameRow(id)
      } else {
        const content = defaultContentForType(payload.elementType)
        if (content) addElement(id, content)
      }
    }
  }

  function handleDragEnd() {
    updateDropSlot(null)
    setIsDragOver(false)
  }

  function handleColumnResize({ height }: { width?: number; height?: number }) {
    if (height !== undefined) updateColumn(id, { styles: { minHeight: `${height}px` } })
  }

  function handlePickerSelect(elementType: string) {
    if (elementType === 'row-layout') {
      addRowAfterColumn(id)
    } else if (elementType === 'column-layout') {
      addColumnToSameRow(id)
    } else {
      const content = defaultContentForType(elementType)
      if (content) addElement(id, content)
    }
    setShowPicker(false)
  }

  if (!column) return null
  if (skipIfManaged && column.managedBy) return null

  const { elementIds } = column
  const isEmpty = elementIds.length === 0
  const breakpointStyles = (column.responsive?.[responsiveMode] ?? {}) as React.CSSProperties

  // Default responsive column sizing — only applied when no explicit flexBasis is stored
  const hasStoredBasis = !!(column.styles.flexBasis || breakpointStyles.flexBasis)
  const responsiveColDefaults: React.CSSProperties =
    !hasStoredBasis && responsiveMode === 'mobile'
      ? { flexBasis: '100%', flexGrow: 0, flexShrink: 0 }
      : !hasStoredBasis && responsiveMode === 'tablet'
        ? { flexBasis: '50%', flexGrow: 0, flexShrink: 0, minWidth: '50%' }
        : {}

  return (
    <div
      ref={columnRef}
      data-column-id={id}
      data-selectable-id={id}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: isEmpty ? '0' : '8px',
        border: isDragOver
          ? '2px dashed var(--color-primary)'
          : isEmpty
            ? '2px dashed var(--color-border)'
            : '1px dashed var(--color-border)',
        borderRadius: '6px',
        ...responsiveColDefaults,
        ...(column.styles as React.CSSProperties),
        ...breakpointStyles,
        ...selectionStyle,
        backgroundColor: isDragOver
          ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)'
          : (column.styles.backgroundColor ?? 'transparent'),
        transition: 'background-color 120ms ease, border-color 120ms ease',
        position: 'relative',
      }}
      {...selectionHandlers}
    >
      {isEmpty ? (
        /* Empty column drop zone */
        <div
          style={{
            flex: 1,
            minHeight: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: 16,
          }}
        >
          {isDragOver ? (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 500 }}>
              Drop here
            </span>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPicker((v) => !v)
                }}
                style={{
                  height: 30,
                  padding: '0 14px',
                  borderRadius: 6,
                  border: '1px dashed var(--color-border)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M5 1v8M1 5h8" />
                </svg>
                Add Element
              </button>

              {showPicker && (
                <ElementPickerPopover
                  onSelect={handlePickerSelect}
                  onClose={() => setShowPicker(false)}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Slot 0: before first element */}
          <DropIndicator visible={dropSlot === 0} />

          {elementIds.map((elementId, index) => (
            <div key={elementId}>
              <div style={{ marginBottom: 12 }}>
                <DraggableElement elementId={elementId} columnId={id} index={index}>
                  <ElementRenderer id={elementId} />
                </DraggableElement>
              </div>
              <DropIndicator visible={dropSlot === index + 1} />
            </div>
          ))}

          {/* Add element to populated column */}
          <div style={{ position: 'relative', marginTop: 4 }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowPicker((v) => !v)
              }}
              style={{
                width: '100%',
                height: 26,
                borderRadius: 5,
                border: '1px dashed var(--color-border)',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4.5 1v7M1 4.5h7" />
              </svg>
              Add Element
            </button>

            {showPicker && (
              <ElementPickerPopover
                onSelect={(elementType) => {
                  handlePickerSelect(elementType)
                }}
                onClose={() => setShowPicker(false)}
              />
            )}
          </div>
        </>
      )}

      {isSelected && (
        <ResizeHandle
          direction="bottom"
          nodeId={id}
          targetRef={columnRef}
          onResize={handleColumnResize}
        />
      )}
    </div>
  )
})

export default ColumnRenderer
