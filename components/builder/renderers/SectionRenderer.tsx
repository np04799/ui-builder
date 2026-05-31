'use client'

import { memo, useRef, useState } from 'react'
import { useSection, useSectionRows, useResponsiveMode } from '@/hooks/useBuilderSelectors'
import { useBuilderStore } from '@/store/builder.store'
import { useSelectable } from '@/hooks/useSelectable'
import RowRenderer from './RowRenderer'
import ResizeHandle from '@/components/builder/dnd/ResizeHandle'
import { DND_TYPE, decodeDragPayload } from '@/components/builder/dnd/dragTypes'
import { defaultContentForType } from '@/lib/elementDefaults'
import { TEMPLATES, materializeTemplate } from '@/lib/templates'

function typesHas(types: DOMStringList | readonly string[], mime: string): boolean {
  return Array.from(types).indexOf(mime) !== -1
}

interface Props {
  id: string
}

const SectionRenderer = memo(function SectionRenderer({ id }: Props) {
  const section = useSection(id)
  const rows = useSectionRows(id)
  const { isSelected, selectionStyle, selectionHandlers } = useSelectable(id)
  const addRow = useBuilderStore((s) => s.addRow)
  const addColumn = useBuilderStore((s) => s.addColumn)
  const addElement = useBuilderStore((s) => s.addElement)
  const updateSection = useBuilderStore((s) => s.updateSection)
  const insertTemplate = useBuilderStore((s) => s.insertTemplate)
  const [isDragOver, setIsDragOver] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const responsiveMode = useResponsiveMode()

  if (!section) return null

  const isEmpty = rows.length === 0
  const breakpointStyles = (section.responsive?.[responsiveMode] ?? {}) as React.CSSProperties

  function handleDragOver(e: React.DragEvent) {
    if (!typesHas(e.dataTransfer.types, DND_TYPE)) return
    // Only handle at section level when empty — populated sections let columns handle it
    if (!isEmpty) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (sectionRef.current && !sectionRef.current.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    if (!isEmpty) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const raw = e.dataTransfer.getData(DND_TYPE)
    const payload = decodeDragPayload(raw)
    if (!payload) return
    if (payload.type === 'element') {
      // Move existing element into this empty section by creating structure around it
      const moveElement = useBuilderStore.getState().moveElement
      const rowId = addRow(id)
      const colId = addColumn(rowId)
      moveElement(payload.elementId, payload.sourceColumnId, colId, 0)
    } else if (payload.type === 'panel') {
      const rowId = addRow(id)
      const colId = addColumn(rowId)
      const content = defaultContentForType(payload.elementType)
      if (content) addElement(colId, content)
    } else if (payload.type === 'template') {
      const tpl = TEMPLATES.find((t) => t.id === payload.templateId)
      if (tpl) insertTemplate(materializeTemplate(tpl.section))
    }
  }

  function handleAddRow() {
    addRow(id)
  }

  // Split section styles: background/border styles stay on outer shell,
  // spacing + maxWidth go on the inner content wrapper (centred).
  const sectionStyles = section.styles as Record<string, string>
  const mergedStyles = { ...sectionStyles, ...breakpointStyles } as Record<string, string>

  // Map alignItems (stored) → margin on the inner content wrapper
  const align = mergedStyles.alignItems ?? 'center'
  const innerMargin =
    align === 'flex-end' ? '0 0 0 auto'
    : align === 'flex-start' ? '0 auto 0 0'
    : '0 auto' // center

  // When maxWidth is 'none' (e.g. drawer app-shell), bypass the inner centering
  // wrapper entirely so the element can fill 100% width and 100vh height.
  const isFullBleed = mergedStyles.maxWidth === 'none'

  const outerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    ...(mergedStyles.height ? { height: mergedStyles.height } : {}),
    ...(isFullBleed ? { display: 'flex', flexDirection: 'column', overflow: 'hidden' } : { borderBottom: '1px solid var(--color-border)' }),
    backgroundColor: mergedStyles.backgroundColor ?? 'transparent',
    backgroundImage: mergedStyles.backgroundImage,
    backgroundSize: mergedStyles.backgroundSize ?? 'cover',
    backgroundPosition: mergedStyles.backgroundPosition ?? 'center',
    backgroundRepeat: mergedStyles.backgroundRepeat ?? 'no-repeat',
    ...(isDragOver
      ? {
          backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, transparent)',
          outline: '2px dashed var(--color-primary)',
          outlineOffset: '-4px',
        }
      : {}),
    transition: 'background-color 120ms ease',
    ...selectionStyle,
  }

  const innerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: mergedStyles.maxWidth ?? '1200px',
    margin: innerMargin,
    paddingTop: mergedStyles.paddingTop ?? '20px',
    paddingBottom: mergedStyles.paddingBottom ?? '20px',
    paddingLeft: mergedStyles.paddingLeft ?? '20px',
    paddingRight: mergedStyles.paddingRight ?? '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    boxSizing: 'border-box',
  }

  const innerContent = isEmpty ? (
    <div
      style={{
        minHeight: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      {isDragOver ? (
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 500 }}>
          Drop element here
        </span>
      ) : (
        <>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
            Empty section — drag an element or add a row
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAddRow()
            }}
            style={{
              height: 28,
              padding: '0 12px',
              borderRadius: 6,
              border: '1px dashed var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-secondary)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M5 1v8M1 5h8" />
            </svg>
            Add Row
          </button>
        </>
      )}
    </div>
  ) : (
    rows.map((row) => <RowRenderer key={row.id} id={row.id} />)
  )

  return (
    <section
      ref={sectionRef}
      data-section-id={id}
      data-selectable-id={id}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={outerStyle}
      {...selectionHandlers}
    >
      {isFullBleed ? innerContent : <div style={innerStyle}>{innerContent}</div>}

      {isSelected && (
        <ResizeHandle
          direction="bottom"
          nodeId={id}
          targetRef={sectionRef}
          onResize={({ height }) => {
            if (height !== undefined) updateSection(id, { styles: { minHeight: `${height}px` } })
          }}
        />
      )}
    </section>
  )
})

export default SectionRenderer
