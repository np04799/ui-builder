'use client'

import { useEffect, useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import type { Layouts } from 'react-grid-layout'
import type { DashboardStoreState } from '@/types/dashboard.types'
import DashboardWidgetRenderer from '@/components/dashboard/DashboardWidgetRenderer'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGrid = WidthProvider(Responsive)

export const DASHBOARD_PREVIEW_KEY = 'bp-dashboard-store'

export default function DashboardPreviewPage() {
  const [state, setState] = useState<DashboardStoreState | null>(null)

  useEffect(() => {
    try {
      // Zustand persist wraps state under { state: {...}, version: N }
      const raw = localStorage.getItem(DASHBOARD_PREVIEW_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setState((parsed.state ?? parsed) as DashboardStoreState)
      }
    } catch {
      // ignore
    }
  }, [])

  if (!state || state.widgets.length === 0) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', fontFamily: 'sans-serif', color: '#888', flexDirection: 'column', gap: 12,
      }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round">
          <rect x="4" y="4" width="18" height="18" rx="3" />
          <rect x="26" y="4" width="18" height="18" rx="3" />
          <rect x="4" y="26" width="18" height="18" rx="3" />
          <rect x="26" y="26" width="18" height="18" rx="3" />
        </svg>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>No dashboard widgets to preview.</p>
        <p style={{ margin: 0, fontSize: '0.8rem' }}>Add widgets in BuilderPro and click Preview again.</p>
      </div>
    )
  }

  const { widgets, gridLayouts } = state

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '16px 20px 80px',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round">
            <rect x="1" y="1" width="8" height="8" rx="1.5" />
            <rect x="11" y="1" width="8" height="8" rx="1.5" />
            <rect x="1" y="11" width="8" height="8" rx="1.5" />
            <rect x="11" y="11" width="8" height="8" rx="1.5" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>Dashboard Preview</span>
        </div>
        <span style={{
          fontSize: '0.75rem', color: '#94a3b8', background: '#f1f5f9',
          padding: '3px 10px', borderRadius: 20, border: '1px solid #e2e8f0',
        }}>
          Read-only · {widgets.length} widget{widgets.length !== 1 ? 's' : ''}
        </span>
      </div>

      <ResponsiveGrid
        className="dashboard-grid"
        layouts={gridLayouts as Layouts}
        breakpoints={{ lg: 1200, md: 768, sm: 0 }}
        cols={{ lg: 12, md: 6, sm: 1 }}
        rowHeight={80}
        margin={[12, 12]}
        containerPadding={[0, 0]}
        isDraggable={false}
        isResizable={false}
        useCSSTransforms
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            style={{
              background: '#fff',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Widget title */}
            {widget.style?.showTitle !== false && (
              <div style={{
                padding: '8px 12px 6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: widget.style?.titleColor ?? '#374151',
                borderBottom: '1px solid #f1f5f9',
                flexShrink: 0,
              }}>
                {widget.title}
              </div>
            )}
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <DashboardWidgetRenderer widget={widget} />
            </div>
          </div>
        ))}
      </ResponsiveGrid>
    </div>
  )
}
