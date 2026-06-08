'use client'

import { useRef, useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import {
  DND_TYPE,
  encodeDragPayload,
  type ElementDragPayload,
} from './dragTypes'

interface Props {
  elementId: string
  columnId: string
  index: number
  children: React.ReactNode
}

export default function DraggableElement({
  elementId,
  columnId,
  index,
  children,
}: Props) {
  const setDragState = useBuilderStore((s) => s.setDragState)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const payload: ElementDragPayload = {
    type: 'element',
    elementId,
    sourceColumnId: columnId,
    sourceIndex: index,
  }

  function handleDragStart(e: React.DragEvent) {
    e.stopPropagation()
    e.dataTransfer.effectAllowed = 'copyMove'
    e.dataTransfer.setData(DND_TYPE, encodeDragPayload(payload))

    if (wrapperRef.current) {
      e.dataTransfer.setDragImage(wrapperRef.current, 16, 16)
    }

    requestAnimationFrame(() => {
      setIsDragging(true)
      setDragState({ elementId, sourceColumnId: columnId })
    })
  }

  function handleDragEnd(e: React.DragEvent) {
    e.stopPropagation()
    setIsDragging(false)
    setDragState(null)
  }

  return (
    <div
      ref={wrapperRef}
      data-draggable-element={elementId}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={(e) => {
        // Don't hide grip when moving to the grip handle itself
        const related = e.relatedTarget as HTMLElement | null
        if (related?.closest('[data-drag-grip]')) return
        setIsHovered(false)
      }}
      style={{
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        opacity: isDragging ? 0.35 : 1,
        transition: 'opacity 120ms ease',
      }}
    >
      {/* Grip handle — overlays top-left corner of element so it stays within container bounds */}
      <div
        data-drag-grip
        draggable
        title="Drag to move"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          width: 20,
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          color: '#fff',
          backgroundColor: 'var(--color-primary)',
          borderRadius: 4,
          zIndex: 20,
          userSelect: 'none',
          opacity: isHovered && !isDragging ? 1 : 0,
          pointerEvents: isHovered && !isDragging ? 'auto' : 'none',
          transition: 'opacity 100ms ease',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        }}
      >
        <GripIcon />
      </div>

      {children}
    </div>
  )
}

function GripIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden>
      <circle cx="3" cy="3" r="1.2" />
      <circle cx="7" cy="3" r="1.2" />
      <circle cx="3" cy="8" r="1.2" />
      <circle cx="7" cy="8" r="1.2" />
      <circle cx="3" cy="13" r="1.2" />
      <circle cx="7" cy="13" r="1.2" />
    </svg>
  )
}
