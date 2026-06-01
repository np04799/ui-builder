'use client'

import { memo, useState } from 'react'
import { useFramework } from '@/hooks/useFramework'

interface AccordionItem {
  id: string
  title: string
  content: string
  defaultOpen?: boolean
}

interface Props {
  items?: AccordionItem[]
  allowMultiple?: boolean
  variant?: 'default' | 'flush' | 'bordered'
  style?: React.CSSProperties
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease', color: 'var(--color-text-secondary)' }}>
      <path d="M4 6l4 4 4-4" />
    </svg>
  )
}

function EmptyState({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ padding: '20px', border: '1px dashed var(--color-border)', borderRadius: 8, color: 'var(--color-text-secondary)', fontSize: '0.875rem', textAlign: 'center', ...style }}>
      No sections yet — add items in the properties panel.
    </div>
  )
}

// ─── Bootstrap accordion ──────────────────────────────────────────────────────

function BootstrapAccordion({ items, allowMultiple, style }: { items: AccordionItem[]; allowMultiple: boolean; style?: React.CSSProperties }) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const s = new Set<string>()
    items.forEach((it) => { if (it.defaultOpen) s.add(it.id) })
    return s
  })

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { if (!allowMultiple) next.clear(); next.add(id) }
      return next
    })
  }

  return (
    <div className="accordion" style={style}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id)
        return (
          <div key={item.id} className="accordion-item">
            <h2 className="accordion-header">
              <button
                className={`accordion-button${isOpen ? '' : ' collapsed'}`}
                type="button"
                onClick={() => toggle(item.id)}
              >
                {item.title}
              </button>
            </h2>
            {isOpen && (
              <div className="accordion-collapse">
                <div className="accordion-body text-muted" style={{ fontSize: '0.875rem' }}>
                  {item.content}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── MUI accordion ────────────────────────────────────────────────────────────

function MuiAccordion({ items, allowMultiple, style }: { items: AccordionItem[]; allowMultiple: boolean; style?: React.CSSProperties }) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const s = new Set<string>()
    items.forEach((it) => { if (it.defaultOpen) s.add(it.id) })
    return s
  })

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { if (!allowMultiple) next.clear(); next.add(id) }
      return next
    })
  }

  return (
    <div style={style}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id)
        return (
          <div key={item.id} className="MuiAccordion-root" style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, marginBottom: 4, overflow: 'hidden' }}>
            <button
              className="MuiAccordionSummary-root"
              onClick={() => toggle(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: 'none', background: isOpen ? 'rgba(0,0,0,0.03)' : 'transparent', cursor: 'pointer', fontSize: '0.9375rem', fontWeight: 500, color: 'rgba(0,0,0,0.87)', textAlign: 'left' }}
            >
              <span>{item.title}</span>
              <ChevronIcon open={isOpen} />
            </button>
            {isOpen && (
              <div className="MuiAccordionDetails-root" style={{ padding: '8px 16px 16px', borderTop: '1px solid rgba(0,0,0,0.08)', fontSize: '0.875rem', color: 'rgba(0,0,0,0.6)', lineHeight: 1.6 }}>
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Tailwind accordion ───────────────────────────────────────────────────────

function TailwindAccordion({ items, allowMultiple, variant, style }: { items: AccordionItem[]; allowMultiple: boolean; variant: 'default' | 'flush' | 'bordered'; style?: React.CSSProperties }) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const s = new Set<string>()
    items.forEach((it) => { if (it.defaultOpen) s.add(it.id) })
    return s
  })

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { if (!allowMultiple) next.clear(); next.add(id) }
      return next
    })
  }

  return (
    <div style={style}>
      {items.map((item, idx) => {
        const isOpen = openIds.has(item.id)
        const isLast = idx === items.length - 1
        const containerClass = variant === 'flush'
          ? `border-b border-gray-200${isLast ? '' : ''}`
          : variant === 'bordered'
          ? `border border-gray-200 rounded-lg overflow-hidden${isLast ? '' : ' mb-2'}`
          : `rounded-lg shadow-sm border border-gray-200 overflow-hidden${isLast ? '' : ' mb-2'}`

        return (
          <div key={item.id} className={containerClass}>
            <button
              onClick={() => toggle(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 border-none cursor-pointer text-left text-sm font-semibold transition-colors ${isOpen ? 'bg-gray-50 text-gray-900' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
            >
              <span>{item.title}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                className={`flex-shrink-0 transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}>
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>
            {isOpen && (
              <div className={`px-4 pb-4 pt-1 text-sm text-gray-600 leading-relaxed ${variant !== 'flush' ? 'border-t border-gray-100' : ''}`}>
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Custom accordion (original) ──────────────────────────────────────────────

function CustomAccordion({ items, allowMultiple, variant, style }: { items: AccordionItem[]; allowMultiple: boolean; variant: 'default' | 'flush' | 'bordered'; style?: React.CSSProperties }) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const s = new Set<string>()
    items.forEach((it) => { if (it.defaultOpen) s.add(it.id) })
    return s
  })

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { if (!allowMultiple) next.clear(); next.add(id) }
      return next
    })
  }

  function itemContainerStyle(isLast: boolean): React.CSSProperties {
    if (variant === 'flush') return { borderBottom: '1px solid #e5e7eb' }
    if (variant === 'bordered') return { border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', marginBottom: isLast ? 0 : 8 }
    return { borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid var(--color-border)', marginBottom: isLast ? 0 : 8, overflow: 'hidden', backgroundColor: 'var(--color-bg)' }
  }

  function headerStyle(isOpen: boolean): React.CSSProperties {
    return { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', minHeight: 48, border: 'none', background: isOpen && variant !== 'flush' ? 'var(--color-selected)' : 'transparent', cursor: 'pointer', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'left', transition: 'background-color 150ms', boxSizing: 'border-box' }
  }

  return (
    <div style={{ fontFamily: 'inherit', ...style }}>
      {items.map((item, idx) => {
        const isOpen = openIds.has(item.id)
        const isLast = idx === items.length - 1
        return (
          <div key={item.id} style={itemContainerStyle(isLast)}>
            <button onClick={() => toggle(item.id)} style={headerStyle(isOpen)}>
              <span>{item.title}</span>
              <ChevronIcon open={isOpen} />
            </button>
            {isOpen && (
              <div style={{ padding: '4px 16px 16px', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, borderTop: variant === 'flush' ? '1px solid var(--color-border)' : 'none' }}>
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function AccordionElement({ items = [], allowMultiple = false, variant = 'default', style }: Props) {
  const framework = useFramework()

  if (items.length === 0) return <EmptyState style={style} />

  if (framework === 'bootstrap') return <BootstrapAccordion items={items} allowMultiple={allowMultiple} style={style} />
  if (framework === 'mui') return <MuiAccordion items={items} allowMultiple={allowMultiple} style={style} />
  if (framework === 'tailwind') return <TailwindAccordion items={items} allowMultiple={allowMultiple} variant={variant} style={style} />
  return <CustomAccordion items={items} allowMultiple={allowMultiple} variant={variant} style={style} />
}

export default memo(AccordionElement)
