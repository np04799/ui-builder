'use client'

import { useRef } from 'react'
import { useSelectable } from '@/hooks/useSelectable'
import { useBuilderStore } from '@/store/builder.store'
import { useElement } from '@/hooks/useBuilderSelectors'
import ResizeHandle from '@/components/builder/dnd/ResizeHandle'

interface Props {
  id: string
  children: React.ReactNode
  style?: React.CSSProperties
}

// Text-like types: height resize → scale fontSize proportionally.
// Block types: height/width resize → set explicit dimensions.
const TEXT_TYPES = new Set(['heading', 'paragraph', 'button'])
const BLOCK_TYPES = new Set(['image', 'video', 'icon', 'divider', 'spacer', 'form', 'card', 'hero', 'navbar', 'footer'])

export default function SelectionWrapper({ id, children, style }: Props) {
  const { isSelected, isHovered, selectionHandlers } = useSelectable(id)
  const updateElement = useBuilderStore((s) => s.updateElement)
  const element = useElement(id)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const borderStyle: React.CSSProperties = isSelected
    ? { outline: '2px solid var(--color-primary)', outlineOffset: '2px', borderRadius: 3 }
    : isHovered
    ? { outline: '1px solid color-mix(in srgb, var(--color-primary) 50%, transparent)', outlineOffset: '2px', borderRadius: 3 }
    : {}

  const elementType = element?.content.type ?? ''
  const isText = TEXT_TYPES.has(elementType)
  const isBlock = BLOCK_TYPES.has(elementType)

  function handleResize({ width, height }: { width?: number; height?: number }) {
    const patch: Record<string, string> = {}

    if (width !== undefined) {
      patch.width = `${width}px`
    }

    if (height !== undefined) {
      if (isText) {
        // Scale fontSize proportionally: current measured height → new height ratio
        const el = wrapperRef.current
        if (el) {
          const currentH = el.offsetHeight || height
          const currentFontSizeStr = element?.styles?.fontSize ?? window.getComputedStyle(el).fontSize
          const currentFs = parseFloat(currentFontSizeStr) || 16
          const ratio = height / Math.max(currentH, 1)
          const newFs = Math.max(8, Math.min(200, Math.round(currentFs * ratio)))
          patch.fontSize = `${newFs}px`
          // Also scale line-height for headings/paragraphs
          if (elementType !== 'button') {
            const currentLhStr = element?.styles?.lineHeight ?? ''
            const currentLh = parseFloat(currentLhStr) || 0
            if (currentLh > 0) {
              patch.lineHeight = `${Math.max(1, Math.round(currentLh * ratio * 100) / 100)}`
            }
          }
        }
      } else {
        patch.height = `${height}px`
        patch.minHeight = `${height}px`
      }
    }

    if (Object.keys(patch).length) updateElement(id, { styles: patch })
  }

  // Which handles to show:
  // - Text: bottom only (scales font size), no width (let column control that)
  // - Block/image/video: corner (width + height together)
  // - Everything else: bottom only (min-height)
  const showCorner = isBlock && !TEXT_TYPES.has(elementType)
  const showBottom = !showCorner
  const showRight = false // width is controlled via column resize handle

  return (
    <div
      ref={wrapperRef}
      data-selectable-id={id}
      style={{ position: 'relative', ...style, ...borderStyle }}
      {...selectionHandlers}
    >
      {children}
      {isSelected && showBottom && (
        <ResizeHandle
          direction="bottom"
          nodeId={id}
          targetRef={wrapperRef}
          onResize={handleResize}
        />
      )}
      {isSelected && showCorner && (
        <ResizeHandle
          direction="corner"
          nodeId={id}
          targetRef={wrapperRef}
          onResize={handleResize}
        />
      )}
    </div>
  )
}
