'use client'

import { useState, useCallback } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import type { Layouts } from 'react-grid-layout'
import { useDashboardStore } from '@/store/dashboard.store'
import WidgetWrapper from './WidgetWrapper'
import WidgetPickerModal from './WidgetPickerModal'
import DashboardWidgetRenderer from './DashboardWidgetRenderer'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGrid = WidthProvider(Responsive)

export default function DashboardCanvas() {
  const [showPicker, setShowPicker] = useState(false)
  const widgets = useDashboardStore((s) => s.widgets)
  const layouts = useDashboardStore((s) => s.gridLayouts)
  const updateLayout = useDashboardStore((s) => s.updateLayout)
  const setSelected = useDashboardStore((s) => s.setSelectedWidget)
  const selectedId = useDashboardStore((s) => s.selectedWidgetId)

  const handleLayoutChange = useCallback(
    (_: unknown, allLayouts: Layouts) => {
      updateLayout(allLayouts)
    },
    [updateLayout]
  )

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100%',
        backgroundColor: 'var(--color-canvas)',
        padding: '12px 16px 80px',
      }}
      onClick={() => { if (selectedId) setSelected(null) }}
    >
      {widgets.length === 0 ? (
        <DashboardEmptyState onAdd={() => setShowPicker(true)} />
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
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function DashboardEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
        gap: 16,
        textAlign: 'center',
        padding: 32,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          backgroundColor: 'var(--color-selected)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i className="bi bi-grid-1x2-fill" style={{ fontSize: '2rem', color: 'var(--color-primary)' }} />
      </div>
      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          Start building your dashboard
        </h3>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: 340 }}>
          Add charts, KPI cards, data tables and filter controls. Connect your CSV, JSON or API data.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onAdd}
          style={{
            padding: '10px 22px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          <i className="bi bi-plus-lg" />
          Add Widget
        </button>
      </div>
    </div>
  )
}
