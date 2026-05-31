'use client'

import { memo, useRef, Fragment } from 'react'
import { useRow, useResponsiveMode } from '@/hooks/useBuilderSelectors'
import { useSelectable } from '@/hooks/useSelectable'
import { useBuilderStore } from '@/store/builder.store'
import ColumnRenderer from './ColumnRenderer'
import ColumnResizeHandle from './ColumnResizeHandle'
import ResizeHandle from '@/components/builder/dnd/ResizeHandle'

interface Props {
  id: string
}

const RowRenderer = memo(function RowRenderer({ id }: Props) {
  const row = useRow(id)
  const { isSelected, selectionStyle, selectionHandlers } = useSelectable(id)
  const addColumn = useBuilderStore((s) => s.addColumn)
  const updateRow = useBuilderStore((s) => s.updateRow)
  const responsiveMode = useResponsiveMode()
  const rowRef = useRef<HTMLDivElement>(null)

  if (!row) return null

  const isEmpty = row.columnIds.length === 0
  const breakpointStyles = (row.responsive?.[responsiveMode] ?? {}) as React.CSSProperties

  // Default responsive stacking — overridden by explicit row responsive styles
  const responsiveRowDefaults: React.CSSProperties =
    responsiveMode === 'mobile'
      ? { flexDirection: 'column', flexWrap: 'nowrap', gap: '16px' }
      : responsiveMode === 'tablet'
        ? { flexWrap: 'wrap', gap: '16px' }
        : {}

  return (
    <div
      ref={rowRef}
      data-row-id={id}
      data-selectable-id={id}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        gap: row.columnIds.length <= 1 ? '16px' : '0',
        ...responsiveRowDefaults,
        ...(row.styles as React.CSSProperties),
        ...breakpointStyles,
        ...selectionStyle,
      }}
      {...selectionHandlers}
    >
      {isEmpty ? (
        <div
          style={{
            flex: 1,
            minHeight: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed var(--color-border)',
            borderRadius: 6,
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              addColumn(id)
            }}
            style={{
              height: 28,
              padding: '0 12px',
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
            Add Column
          </button>
        </div>
      ) : (
        <>
          {row.columnIds.map((columnId, index) => (
            <Fragment key={columnId}>
              <ColumnRenderer id={columnId} />
              {index < row.columnIds.length - 1 && responsiveMode === 'desktop' && (
                <ColumnResizeHandle
                  leftColumnId={columnId}
                  rightColumnId={row.columnIds[index + 1]}
                  rowRef={rowRef}
                />
              )}
            </Fragment>
          ))}
          {/* Add another column — hidden for locked (template) rows */}
          {!row.locked && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                addColumn(id)
              }}
              title="Add column"
              style={{
                width: 28,
                alignSelf: 'stretch',
                minHeight: 60,
                flexShrink: 0,
                border: '2px dashed var(--color-border)',
                borderRadius: 6,
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M5 1v8M1 5h8" />
              </svg>
            </button>
          )}
        </>
      )}

      {isSelected && (
        <ResizeHandle
          direction="bottom"
          nodeId={id}
          targetRef={rowRef}
          onResize={({ height }) => {
            if (height !== undefined) updateRow(id, { styles: { minHeight: `${height}px` } })
          }}
        />
      )}
    </div>
  )
})

export default RowRenderer
