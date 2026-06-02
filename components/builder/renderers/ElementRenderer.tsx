'use client'

import { memo, cloneElement, isValidElement } from 'react'
import { useElement, useResponsiveMode } from '@/hooks/useBuilderSelectors'
import { renderElement } from '@/components/builder/elements/registry'
import SelectionWrapper from '@/components/builder/selection/SelectionWrapper'
import InlineTextEditor from '@/components/builder/inline-editor/InlineTextEditor'
import {
  isEditable,
  getEditingStyle,
  getPlaceholder,
} from '@/components/builder/inline-editor/editingStyles'

interface Props {
  id: string
}

const UNREGISTERED_PLACEHOLDER: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px dashed var(--color-border)',
  borderRadius: '4px',
  fontSize: '0.75rem',
  color: 'var(--color-text-secondary)',
  backgroundColor: 'var(--color-surface)',
}

/**
 * Apply user-provided htmlId + classNames to the outer wrapper of a rendered element.
 * We clone the root element and merge id + className.
 */
function applyUserAttrs(node: React.ReactNode, htmlId?: string, classNames?: string): React.ReactNode {
  if (!isValidElement(node)) return node
  if (!htmlId && !classNames) return node

  type CloneableProps = { id?: string; className?: string }
  const existing = node.props as CloneableProps
  const nextProps: CloneableProps = {}

  if (htmlId) nextProps.id = htmlId
  if (classNames) {
    nextProps.className = existing.className
      ? `${existing.className} ${classNames}`
      : classNames
  }
  return cloneElement(node, nextProps as Partial<typeof node.props>)
}

const ElementRenderer = memo(function ElementRenderer({ id }: Props) {
  const element = useElement(id)
  const responsiveMode = useResponsiveMode()

  if (!element) return null

  const { content, styles, responsive } = element
  // Merge base styles with breakpoint-specific overrides
  const breakpointStyles = responsive?.[responsiveMode] ?? {}
  const merged = { ...styles, ...breakpointStyles }
  const style = merged as React.CSSProperties
  const rawRendered = renderElement(content, style, id)
  const rendered = applyUserAttrs(rawRendered, element.htmlId, element.classNames)

  // If hidden at this breakpoint, render an invisible placeholder in builder (so it stays selectable)
  if (breakpointStyles.display === 'none') {
    return (
      <SelectionWrapper id={id}>
        <div style={{
          padding: '6px 10px',
          border: '1.5px dashed var(--color-border)',
          borderRadius: 4,
          fontSize: '0.7rem',
          color: 'var(--color-text-secondary)',
          backgroundColor: 'var(--color-surface)',
          opacity: 0.5,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 1l10 10M5.5 2.5A5 2.5 0 0 1 11 6a5.3 5.3 0 0 1-.8 1.5M2 4.5A5 2.5 0 0 0 1 6a5 2.5 0 0 0 5 2.5 4.8 4.8 0 0 0 2.5-.7" />
          </svg>
          Hidden on {responsiveMode}
        </div>
      </SelectionWrapper>
    )
  }
  const fallback = <div style={UNREGISTERED_PLACEHOLDER}>{content.type}</div>

  if (isEditable(content)) {
    return (
      <SelectionWrapper id={id}>
        <InlineTextEditor
          id={id}
          text={content.text}
          placeholder={getPlaceholder(content)}
          editingStyle={getEditingStyle(content, styles)}
        >
          {rendered ?? fallback}
        </InlineTextEditor>
      </SelectionWrapper>
    )
  }

  return (
    <SelectionWrapper id={id}>
      {rendered ?? fallback}
    </SelectionWrapper>
  )
})

export default ElementRenderer
