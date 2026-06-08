'use client'

import { useState, forwardRef } from 'react'
import { useDashboardStore } from '@/store/dashboard.store'
import type { DashboardWidget } from '@/types/dashboard.types'

interface Props {
  widget: DashboardWidget
  children: React.ReactNode
  /** Forwarded ref required by react-grid-layout for dragging */
  className?: string
  style?: React.CSSProperties
}

const WidgetWrapper = forwardRef<HTMLDivElement, Props>(function WidgetWrapper(
  { widget, children, className, style, ...rest },
  ref
) {
  const [hovered, setHovered] = useState(false)
  const selectedId = useDashboardStore((s) => s.selectedWidgetId)
  const setSelected = useDashboardStore((s) => s.setSelectedWidget)
  const setTab = useDashboardStore((s) => s.setActiveRightTab)
  const removeWidget = useDashboardStore((s) => s.removeWidget)
  const duplicateWidget = useDashboardStore((s) => s.duplicateWidget)
  const updateWidget = useDashboardStore((s) => s.updateWidget)

  const isSelected = selectedId === widget.id
  const { style: wStyle } = widget

  function handleSelect(e: React.MouseEvent) {
    e.stopPropagation()
    setSelected(widget.id)
    setTab('config')
  }

  function handleTitleDblClick(e: React.MouseEvent) {
    e.stopPropagation()
    const el = e.currentTarget as HTMLElement
    el.contentEditable = 'true'
    el.focus()
    const range = document.createRange()
    range.selectNodeContents(el)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)
  }

  function handleTitleBlur(e: React.FocusEvent) {
    const el = e.currentTarget as HTMLElement
    el.contentEditable = 'false'
    const newTitle = el.textContent?.trim()
    if (newTitle && newTitle !== widget.title) {
      updateWidget(widget.id, { title: newTitle })
    }
  }

  function handleTitleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      ;(e.currentTarget as HTMLElement).blur()
    }
  }

  const borderColor = isSelected
    ? 'var(--color-primary)'
    : hovered
    ? 'var(--color-border)'
    : wStyle.borderColor ?? 'var(--color-border)'

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        backgroundColor: wStyle.backgroundColor ?? 'var(--color-surface)',
        border: `2px solid ${borderColor}`,
        borderRadius: wStyle.borderRadius ?? 12,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'border-color 0.15s',
        cursor: 'default',
        boxSizing: 'border-box',
        boxShadow: isSelected
          ? '0 0 0 3px var(--color-primary-alpha)'
          : '0 1px 3px rgba(0,0,0,0.06)',
      }}
      onClick={handleSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {/* ── Header ── */}
      <div
        className="dashboard-widget-drag-handle"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: `6px ${wStyle.padding ?? 16}px`,
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          cursor: 'grab',
          minHeight: 36,
          flexShrink: 0,
        }}
      >
        {/* Drag handle dots */}
        <span style={{ color: 'var(--color-text-secondary)', opacity: 0.5, fontSize: '0.7rem', lineHeight: 1, letterSpacing: 1 }}>
          ⠿
        </span>

        {/* Title */}
        {wStyle.showTitle !== false && (
          <span
            style={{
              flex: 1,
              fontSize: wStyle.titleFontSize ? `${wStyle.titleFontSize}px` : '0.8125rem',
              fontWeight: 600,
              color: wStyle.titleColor ?? 'var(--color-text-primary)',
              textAlign: (wStyle.titleAlign as React.CSSProperties['textAlign']) ?? 'left',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              outline: 'none',
            }}
            onDoubleClick={handleTitleDblClick}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            suppressContentEditableWarning
          >
            {widget.title}
          </span>
        )}

        {/* Action buttons — visible on hover/select */}
        {(hovered || isSelected) && (
          <div
            style={{ display: 'flex', gap: 2, flexShrink: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ActionBtn
              icon="bi-funnel"
              title="Filters"
              onClick={() => { setSelected(widget.id); setTab('filters') }}
            />
            <ActionBtn
              icon="bi-arrows-fullscreen"
              title="Expand"
              onClick={() => {
                const ev = new CustomEvent('dashboard:expand-widget', { detail: { id: widget.id } })
                window.dispatchEvent(ev)
              }}
            />
            <ActionBtn
              icon="bi-gear"
              title="Configure"
              onClick={() => { setSelected(widget.id); setTab('config') }}
            />
            <ActionBtn
              icon="bi-database"
              title="Data"
              onClick={() => { setSelected(widget.id); setTab('data') }}
            />
            <ActionBtn
              icon="bi-copy"
              title="Duplicate"
              onClick={() => duplicateWidget(widget.id)}
            />
            <ActionBtn
              icon="bi-trash"
              title="Delete"
              danger
              onClick={() => removeWidget(widget.id)}
            />
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div
        style={{
          flex: 1,
          padding: wStyle.padding ?? 16,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  )
})

export default WidgetWrapper

function ActionBtn({
  icon,
  title,
  onClick,
  danger = false,
}: {
  icon: string
  title: string
  onClick: () => void
  danger?: boolean
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 24,
        height: 24,
        borderRadius: 4,
        border: 'none',
        backgroundColor: hov
          ? danger
            ? '#fef2f2'
            : 'var(--color-selected)'
          : 'transparent',
        color: hov
          ? danger
            ? '#ef4444'
            : 'var(--color-primary)'
          : 'var(--color-text-secondary)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background-color 0.12s, color 0.12s',
        flexShrink: 0,
      }}
    >
      <i className={`bi ${icon}`} style={{ fontSize: '0.8rem', lineHeight: 1 }} />
    </button>
  )
}
