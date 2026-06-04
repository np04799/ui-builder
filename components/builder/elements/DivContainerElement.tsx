'use client'

import { memo, createElement } from 'react'
import { usePreviewState } from '@/components/builder/elements/PreviewStateContext'

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
  style?: React.CSSProperties
}

const DivContainerElement = memo(function DivContainerElement({
  tag = 'div',
  text,
  bg = 'transparent',
  textColor = 'inherit',
  padding = 16,
  borderRadius = 0,
  showBorder = false,
  borderColor = '#e5e7eb',
  minHeight,
  display = 'block',
  style,
}: Props) {
  const isPreview = usePreviewState() !== null
  // For span elements, default to inline-block if user didn't override
  const resolvedDisplay = display ?? (tag === 'span' ? 'inline-block' : 'block')

  const wrapperStyle: React.CSSProperties = {
    display: resolvedDisplay,
    background: bg,
    color: textColor,
    padding,
    borderRadius,
    border: showBorder ? `1px dashed ${borderColor}` : 'none',
    minHeight,
    width: resolvedDisplay === 'block' || resolvedDisplay === 'flex' || resolvedDisplay === 'grid' ? '100%' : undefined,
    boxSizing: 'border-box',
    ...style,
  }

  // Empty hint when no text and no children — builder mode only
  const innerNode = text || (isPreview ? null : (
    <span style={{
      fontSize: '0.75rem',
      color: 'rgba(0,0,0,0.4)',
      opacity: 0.5,
      fontStyle: 'italic',
    }}>
      &lt;{tag}&gt; container — set text or add children
    </span>
  ))

  return createElement(tag, { style: wrapperStyle }, innerNode)
})

export default DivContainerElement
