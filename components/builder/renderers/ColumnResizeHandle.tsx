'use client'

import { useRef, useCallback } from 'react'
import { useBuilderStore } from '@/store/builder.store'

interface Props {
  leftColumnId: string
  rightColumnId: string
  rowRef: React.RefObject<HTMLDivElement | null>
}

export default function ColumnResizeHandle({ leftColumnId, rightColumnId, rowRef }: Props) {
  const resizeColumns = useBuilderStore((s) => s.resizeColumns)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startLeftPct = useRef(0)
  const startRightPct = useRef(0)
  const handleRef = useRef<HTMLDivElement>(null)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const row = rowRef.current
    if (!row) return

    // Measure current column widths from DOM
    const leftEl = row.querySelector<HTMLElement>(`[data-column-id="${leftColumnId}"]`)
    const rightEl = row.querySelector<HTMLElement>(`[data-column-id="${rightColumnId}"]`)
    if (!leftEl || !rightEl) return

    const rowWidth = row.getBoundingClientRect().width
    if (rowWidth === 0) return

    startX.current = e.clientX
    startLeftPct.current = (leftEl.getBoundingClientRect().width / rowWidth) * 100
    startRightPct.current = (rightEl.getBoundingClientRect().width / rowWidth) * 100
    isDragging.current = true

    if (handleRef.current) handleRef.current.setAttribute('data-dragging', 'true')
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    let rafId = 0
    let latestPct = startLeftPct.current

    function onMouseMove(ev: MouseEvent) {
      if (!isDragging.current) return
      const rowWidth = rowRef.current?.getBoundingClientRect().width ?? 0
      if (rowWidth === 0) return
      const delta = ((ev.clientX - startX.current) / rowWidth) * 100
      latestPct = startLeftPct.current + delta

      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        // Live visual feedback — update DOM directly without store (avoids flood of history)
        const row = rowRef.current
        if (!row) return
        const leftEl = row.querySelector<HTMLElement>(`[data-column-id="${leftColumnId}"]`)
        const rightEl = row.querySelector<HTMLElement>(`[data-column-id="${rightColumnId}"]`)
        if (!leftEl || !rightEl) return

        const clamped = Math.min(Math.max(latestPct, 8.34), 91.66)
        leftEl.style.flexBasis = `${clamped}%`
        leftEl.style.flexGrow = '0'
        leftEl.style.flexShrink = '0'
        rightEl.style.flexBasis = `${100 - clamped}%`
        rightEl.style.flexGrow = '0'
        rightEl.style.flexShrink = '0'
      })
    }

    function onMouseUp() {
      cancelAnimationFrame(rafId)
      isDragging.current = false
      if (handleRef.current) handleRef.current.removeAttribute('data-dragging')
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)

      // Commit snapped value to store
      resizeColumns(leftColumnId, rightColumnId, latestPct)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [leftColumnId, rightColumnId, rowRef, resizeColumns])

  return (
    <div
      ref={handleRef}
      onMouseDown={onMouseDown}
      title="Drag to resize columns"
      style={{
        width: 12,
        alignSelf: 'stretch',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'col-resize',
        zIndex: 10,
        position: 'relative',
      }}
      css-drag-handle="true"
    >
      {/* Visual pip */}
      <div
        style={{
          width: 4,
          height: 32,
          borderRadius: 2,
          background: 'var(--color-border)',
          transition: 'background 120ms, height 120ms',
          pointerEvents: 'none',
        }}
        className="col-resize-pip"
      />

      <style>{`
        [css-drag-handle]:hover .col-resize-pip,
        [css-drag-handle][data-dragging] .col-resize-pip {
          background: var(--color-primary) !important;
          height: 48px !important;
        }
      `}</style>
    </div>
  )
}
