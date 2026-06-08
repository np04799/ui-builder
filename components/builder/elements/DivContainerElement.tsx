'use client'

import { memo, createElement } from 'react'
import { usePreviewState } from '@/components/builder/elements/PreviewStateContext'
import ColumnRenderer from '@/components/builder/renderers/ColumnRenderer'

type Tag = 'div' | 'span' | 'article' | 'aside' | 'nav' | 'header' | 'footer' | 'main'
type Display = 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid'

interface Props {
  tag?: Tag
  text?: string
  bg?: string
  textColor?: string
  padding?: number
  borderRadius?: number
  showBorder?: boolean
  borderColor?: string
  minHeight?: number
  display?: Display
  contentColumnId?: string
  style?: React.CSSProperties
}

const DivContainerElement = memo(function DivContainerElement({
  tag = 'div',
  text,
  bg = 'transparent',
  textColor = 'inherit',
  padding = 16,
  borderRadius = 0,
  showBorder = true,
  borderColor = '#e5e7eb',
  minHeight = 80,
  display = 'block',
  contentColumnId,
  style,
}: Props) {
  const isPreview = usePreviewState() !== null
  const resolvedDisplay = display ?? (tag === 'span' ? 'inline-block' : 'block')

  const wrapperStyle: React.CSSProperties = {
    display: resolvedDisplay,
    background: bg,
    color: textColor,
    padding,
    borderRadius,
    border: showBorder ? `1.5px dashed ${borderColor}` : 'none',
    minHeight,
    width: (resolvedDisplay === 'block' || resolvedDisplay === 'flex' || resolvedDisplay === 'grid') ? '100%' : undefined,
    boxSizing: 'border-box',
    position: 'relative',
    ...style,
  }

  // If we have a managed content column, render ColumnRenderer inside
  if (contentColumnId) {
    return createElement(
      tag,
      { style: wrapperStyle },
      <ColumnRenderer id={contentColumnId} skipIfManaged={false} />
    )
  }

  // Fallback: plain text content or empty hint
  const innerNode = text || (isPreview ? null : (
    <span style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.35)', fontStyle: 'italic', pointerEvents: 'none' }}>
      &lt;{tag}&gt; — drag elements here
    </span>
  ))

  return createElement(tag, { style: wrapperStyle }, innerNode)
})

export default DivContainerElement
