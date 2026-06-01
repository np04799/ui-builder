'use client'

import { memo, useState, useId } from 'react'
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

function AccordionElement({ items = [], allowMultiple = false, variant = 'default', style }: Props) {
  const uid = useId().replace(/:/g, '')
  const framework = useFramework()
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

  if (items.length === 0) {
    return (
      <div style={{ padding: 20, border: '1px dashed var(--color-border)', borderRadius: 8, color: 'var(--color-text-secondary)', fontSize: '0.875rem', textAlign: 'center', ...style }}>
        No sections yet — add items in the properties panel.
      </div>
    )
  }

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    const bsVariant = variant === 'flush' ? 'accordion-flush' : ''
    return (
      <div className={`accordion ${bsVariant}`} id={`acc-${uid}`} style={style}>
        {items.map((item, idx) => {
          const isOpen = openIds.has(item.id)
          const collapseId = `${uid}-col-${idx}`
          return (
            <div key={item.id} className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button${isOpen ? '' : ' collapsed'}`}
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                >
                  {item.title}
                </button>
              </h2>
              <div className={`accordion-collapse collapse${isOpen ? ' show' : ''}`} id={collapseId}>
                <div className="accordion-body">{item.content}</div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    return (
      <div className="w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden" style={style}>
        {items.map((item) => {
          const isOpen = openIds.has(item.id)
          return (
            <div key={item.id} className="bg-white">
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span>{item.title}</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm text-gray-600">{item.content}</div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // ── Custom / MUI ───────────────────────────────────────────────────────────
  function itemContainerStyle(isLast: boolean): React.CSSProperties {
    if (variant === 'flush') return { borderBottom: '1px solid var(--color-border)' }
    if (variant === 'bordered') return { border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden', marginBottom: isLast ? 0 : 8 }
    return { borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid var(--color-border)', marginBottom: isLast ? 0 : 8, overflow: 'hidden', backgroundColor: 'var(--color-bg)' }
  }

  return (
    <div style={{ fontFamily: 'inherit', ...style }}>
      {items.map((item, idx) => {
        const isOpen = openIds.has(item.id)
        return (
          <div key={item.id} style={itemContainerStyle(idx === items.length - 1)}>
            <button
              onClick={() => toggle(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: 'none', background: isOpen && variant !== 'flush' ? 'rgba(79,70,229,0.05)' : 'transparent', cursor: 'pointer', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'left', transition: 'background 150ms', boxSizing: 'border-box' }}
            >
              <span>{item.title}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', color: 'var(--color-text-secondary)' }}><path d="M4 6l4 4 4-4" /></svg>
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

export default memo(AccordionElement)
