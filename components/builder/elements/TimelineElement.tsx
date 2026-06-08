'use client'

import { memo } from 'react'
import { useFramework } from '@/hooks/useFramework'

interface TimelineItem {
  id: string
  title: string
  description: string
  date?: string
  icon?: string
  color?: string
}

type TimelineVariant = 'default' | 'compact' | 'alternating'

interface Props {
  items?: TimelineItem[]
  variant?: TimelineVariant
  style?: React.CSSProperties
}

const DEFAULT_ITEMS: TimelineItem[] = [
  { id: '1', title: 'Project Started', description: 'Initial planning and setup completed.', date: 'Jan 2024', color: '#4f46e5' },
  { id: '2', title: 'Design Phase', description: 'Wireframes and prototypes approved by stakeholders.', date: 'Feb 2024', color: '#06b6d4' },
  { id: '3', title: 'Development', description: 'Core features implemented and tested.', date: 'Mar 2024', color: '#22c55e' },
  { id: '4', title: 'Launch', description: 'Product successfully launched to production.', date: 'Apr 2024', color: '#f59e0b' },
]

const TimelineElement = memo(function TimelineElement({ items = DEFAULT_ITEMS, variant = 'default', style }: Props) {
  const framework = useFramework()
  const display = items.length === 0 ? DEFAULT_ITEMS : items

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    return (
      <div style={style}>
        {display.map((item, idx) => (
          <div key={item.id} className="d-flex gap-3 mb-4">
            {/* Dot + line */}
            <div className="d-flex flex-column align-items-center flex-shrink-0" style={{ width: 32 }}>
              <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style={{ width: 32, height: 32, backgroundColor: item.color || '#4f46e5', fontSize: '0.8rem', flexShrink: 0 }}>
                {item.icon || (idx + 1)}
              </div>
              {idx < display.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 24, backgroundColor: '#e5e7eb', marginTop: 4 }} />}
            </div>
            {/* Content */}
            <div className="pb-3 flex-grow-1">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-1 mb-1">
                <h6 className="mb-0 fw-semibold">{item.title}</h6>
                {item.date && <span className="badge text-bg-light text-muted fw-normal small">{item.date}</span>}
              </div>
              <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    return (
      <div className="space-y-0" style={style}>
        {display.map((item, idx) => (
          <div key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0 w-8">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ backgroundColor: item.color || '#4f46e5' }}>
                {item.icon || (idx + 1)}
              </div>
              {idx < display.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" style={{ minHeight: 24 }} />}
            </div>
            <div className="pb-5 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                <h4 className="text-sm font-semibold text-gray-900 m-0">{item.title}</h4>
                {item.date && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap">{item.date}</span>}
              </div>
              <p className="text-sm text-gray-500 m-0 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── Custom / MUI ───────────────────────────────────────────────────────────
  return (
    <div style={style}>
      {display.map((item, idx) => (
        <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: idx < display.length - 1 ? 0 : 0 }}>
          {/* Timeline spine */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: item.color || '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
              {item.icon || (idx + 1)}
            </div>
            {idx < display.length - 1 && (
              <div style={{ width: 2, flex: 1, minHeight: 24, backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
            )}
          </div>
          {/* Content */}
          <div style={{ flex: 1, paddingBottom: idx < display.length - 1 ? 20 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.title}</h4>
              {item.date && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-surface)', padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>{item.date}</span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
})

export default TimelineElement
