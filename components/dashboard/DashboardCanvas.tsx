'use client'

import { useState, useCallback, useEffect } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import type { Layouts } from 'react-grid-layout'
import { useDashboardStore } from '@/store/dashboard.store'
import type { DashboardWidgetType } from '@/types/dashboard.types'
import WidgetWrapper from './WidgetWrapper'
import WidgetPickerModal from './WidgetPickerModal'
import DashboardWidgetRenderer from './DashboardWidgetRenderer'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGrid = WidthProvider(Responsive)

export default function DashboardCanvas() {
  const [showPicker, setShowPicker] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [expandedWidgetId, setExpandedWidgetId] = useState<string | null>(null)
  const widgets = useDashboardStore((s) => s.widgets)
  const layouts = useDashboardStore((s) => s.gridLayouts)
  const updateLayout = useDashboardStore((s) => s.updateLayout)
  const addWidget = useDashboardStore((s) => s.addWidget)
  const setSelected = useDashboardStore((s) => s.setSelectedWidget)
  const selectedId = useDashboardStore((s) => s.selectedWidgetId)

  const handleLayoutChange = useCallback(
    (_: unknown, allLayouts: Layouts) => {
      updateLayout(allLayouts)
    },
    [updateLayout]
  )

  // Handle drops from the DashboardElementsPanel — works for any number of drops
  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const type =
        (e.dataTransfer.getData('dashWidgetType') as DashboardWidgetType | undefined) ||
        ((window as unknown as Record<string, unknown>).__dashDroppingType as DashboardWidgetType | undefined)
      if (!type) return
      ;(window as unknown as Record<string, unknown>).__dashDroppingType = null
      addWidget(type)
    },
    [addWidget]
  )

  // Listen for expand events from WidgetWrapper action button
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id
      if (id) setExpandedWidgetId(id)
    }
    window.addEventListener('dashboard:expand-widget', handler)
    return () => window.removeEventListener('dashboard:expand-widget', handler)
  }, [])

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    // Only activate if dragging a widget from the panel
    if ((window as unknown as Record<string, unknown>).__dashDroppingType) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      setIsDragOver(true)
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100%',
        backgroundColor: 'var(--color-canvas)',
        padding: '12px 16px 80px',
        outline: isDragOver ? '2px dashed var(--color-primary)' : 'none',
        outlineOffset: '-4px',
        transition: 'outline 0.1s',
      }}
      onClick={() => { if (selectedId) setSelected(null) }}
      onDragOver={handleCanvasDragOver}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false) }}
      onDrop={handleCanvasDrop}
    >
      {widgets.length === 0 ? (
        <DashboardDropZone onAdd={() => setShowPicker(true)} isDragOver={isDragOver} />
      ) : (
        <ResponsiveGrid
          className="dashboard-grid"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 768, sm: 0 }}
          cols={{ lg: 12, md: 6, sm: 1 }}
          rowHeight={80}
          margin={[12, 12]}
          containerPadding={[0, 0]}
          draggableHandle=".dashboard-widget-drag-handle"
          resizeHandles={['se']}
          onLayoutChange={handleLayoutChange}
          useCSSTransforms
        >
          {widgets.map((widget) => (
            <WidgetWrapper
              key={widget.id}
              widget={widget}
            >
              <DashboardWidgetRenderer widget={widget} />
            </WidgetWrapper>
          ))}
        </ResponsiveGrid>
      )}

      {/* Floating Add Widget button */}
      {widgets.length > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowPicker(true) }}
          title="Add Widget"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
            cursor: 'pointer',
            fontSize: '1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.4)'
          }}
        >
          <i className="bi bi-plus-lg" />
        </button>
      )}

      {showPicker && <WidgetPickerModal onClose={() => setShowPicker(false)} />}

      {/* Expand / Fullscreen modal */}
      {expandedWidgetId && (() => {
        const w = widgets.find((x) => x.id === expandedWidgetId)
        if (!w) return null
        return (
          <div
            onClick={() => setExpandedWidgetId(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '80vw', height: '75vh',
                background: 'var(--color-surface)',
                borderRadius: 12,
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{
                padding: '12px 16px', borderBottom: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                  {w.title}
                </span>
                <button
                  onClick={() => setExpandedWidgetId(null)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-text-secondary)', fontSize: '1.25rem', lineHeight: 1,
                  }}
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>
              <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
                <DashboardWidgetRenderer widget={w} />
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

// ─── Drop Zone (empty state + droppable) ──────────────────────────────────────

function DashboardDropZone({
  onAdd,
  isDragOver,
}: {
  onAdd: () => void
  isDragOver: boolean
}) {
  const over = isDragOver
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        minHeight: 420,
        borderRadius: 12,
        border: `2px dashed ${over ? 'var(--color-primary)' : 'var(--color-border)'}`,
        backgroundColor: over ? 'rgba(99,102,241,0.04)' : 'transparent',
        transition: 'border-color 0.15s, background-color 0.15s',
        padding: 32,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 56, height: 56, borderRadius: 14,
          background: over ? 'var(--color-primary)' : 'var(--color-selected)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}
      >
        <i className="bi bi-grid-1x2-fill" style={{ fontSize: '2rem', color: over ? '#fff' : 'var(--color-primary)' }} />
      </div>
      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {over ? 'Drop to add widget' : 'Start building your dashboard'}
        </h3>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: 340 }}>
          {over
            ? 'Release to place the widget on the canvas.'
            : 'Drag a widget from the left panel, or click Add Widget below.'}
        </p>
      </div>
      {!over && (
        <button
          onClick={onAdd}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--color-primary)',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
            transition: 'transform 0.1s, box-shadow 0.1s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.4)'
          }}
        >
          <i className="bi bi-plus-lg" />
          Add Widget
        </button>
      )}
    </div>
  )
}
