'use client'

import { useRef } from 'react'
import { useSelectable } from '@/hooks/useSelectable'
import { useBuilderStore } from '@/store/builder.store'
import ResizeHandle from '@/components/builder/dnd/ResizeHandle'

interface Props {
  id: string
  children: React.ReactNode
  /** Pass layout styles that must live on the outer element (e.g. flex, width) */
  style?: React.CSSProperties
}

// Used by ElementRenderer to wrap registry-rendered elements (h1, p, img…)
// that have no existing root element to attach selection to.
//
// For section / row / column renderers, useSelectable() is spread directly
// onto their existing root elements — no wrapper div needed.

export default function SelectionWrapper({ id, children, style }: Props) {
  const { isSelected, isHovered, selectionHandlers } = useSelectable(id)
  const updateElement = useBuilderStore((s) => s.updateElement)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const borderStyle: React.CSSProperties = isSelected
    ? {
        outline: '2px solid var(--color-primary)',
        outlineOffset: '2px',
        borderRadius: 3,
      }
    : isHovered
    ? {
        outline: '1px solid color-mix(in srgb, var(--color-primary) 50%, transparent)',
        outlineOffset: '2px',
        borderRadius: 3,
      }
    : {}

  function handleElementResize({ width, height }: { width?: number; height?: number }) {
    const patch: Record<string, string> = {}
    if (width  !== undefined) patch.width  = `${width}px`
    if (height !== undefined) patch.height = `${height}px`
    if (Object.keys(patch).length) updateElement(id, { styles: patch })
  }

  return (
    <div
      ref={wrapperRef}
      data-selectable-id={id}
      style={{
        position: 'relative',
        ...style,
        ...borderStyle,
      }}
      {...selectionHandlers}
    >
      {children}
      {isSelected && (
        <ResizeHandle
          direction="corner"
          nodeId={id}
          targetRef={wrapperRef}
          onResize={handleElementResize}
        />
      )}
    </div>
  )
}
