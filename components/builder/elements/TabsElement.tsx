'use client'

import { memo, useState, useId } from 'react'
import { useFramework } from '@/hooks/useFramework'

interface Tab { id: string; label: string; content: string }

interface Props {
  tabs?: Tab[]
  activeTab?: number
  variant?: 'line' | 'pill' | 'boxed'
  style?: React.CSSProperties
}

function TabsElement({ tabs = [], activeTab: initialActive = 0, variant = 'line', style }: Props) {
  const uid = useId().replace(/:/g, '')
  const framework = useFramework()
  const [active, setActive] = useState(initialActive)
  const safeActive = Math.min(active, Math.max(0, tabs.length - 1))

  if (tabs.length === 0) {
    return (
      <div style={{ padding: 20, border: '1px dashed var(--color-border)', borderRadius: 8, color: 'var(--color-text-secondary)', fontSize: '0.875rem', textAlign: 'center', ...style }}>
        No tabs yet — add tabs in the properties panel.
      </div>
    )
  }

  const content = tabs[safeActive]?.content ?? ''

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    const navClass = variant === 'pill' ? 'nav nav-pills' : variant === 'boxed' ? 'nav nav-tabs nav-fill' : 'nav nav-tabs'
    return (
      <div style={style}>
        <ul className={navClass} role="tablist">
          {tabs.map((tab, idx) => (
            <li key={tab.id} className="nav-item" role="presentation">
              <button
                className={`nav-link${idx === safeActive ? ' active' : ''}`}
                type="button"
                role="tab"
                aria-selected={idx === safeActive}
                onClick={() => setActive(idx)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="tab-content mt-3">
          <div className="tab-pane fade show active" role="tabpanel">
            <p className="text-body-secondary mb-0" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{content}</p>
          </div>
        </div>
      </div>
    )
  }

  // ── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    return (
      <div style={style}>
        <div className="flex border-b border-gray-200 gap-1 overflow-x-auto">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActive(idx)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${idx === safeActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="pt-4 text-sm text-gray-600 leading-relaxed">{content}</div>
      </div>
    )
  }

  // ── Custom / MUI ───────────────────────────────────────────────────────────
  const barStyle: React.CSSProperties = variant === 'pill'
    ? { display: 'flex', gap: 6, padding: '6px 0', flexWrap: 'nowrap', overflowX: 'auto' }
    : variant === 'boxed'
    ? { display: 'flex', border: '1px solid var(--color-border)', borderRadius: '8px 8px 0 0', overflow: 'hidden' }
    : { display: 'flex', borderBottom: '2px solid var(--color-border)', overflowX: 'auto' }

  function tabBtn(isActive: boolean): React.CSSProperties {
    if (variant === 'pill') return { padding: '7px 16px', border: 'none', borderRadius: 999, cursor: 'pointer', fontSize: '0.875rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#fff' : 'var(--color-text-secondary)', backgroundColor: isActive ? 'var(--color-primary)' : 'transparent', whiteSpace: 'nowrap' }
    if (variant === 'boxed') return { padding: '10px 18px', border: 'none', background: isActive ? 'var(--color-bg)' : 'var(--color-surface)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', borderRight: '1px solid var(--color-border)', whiteSpace: 'nowrap' }
    return { padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)', borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent', marginBottom: -2, whiteSpace: 'nowrap' }
  }

  // ── MUI ───────────────────────────────────────────────────────────────────
  if (framework === 'mui') {
    return (
      <div style={{ fontFamily: 'Roboto, sans-serif', ...style }}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.12)', marginBottom: 16 }}>
          {tabs.map((tab, idx) => (
            <button key={tab.id} onClick={() => setActive(idx)}
              style={{ padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: idx === safeActive ? 600 : 400, color: idx === safeActive ? '#1976d2' : 'rgba(0,0,0,0.6)', borderBottom: idx === safeActive ? '2px solid #1976d2' : '2px solid transparent', marginBottom: -1, textTransform: 'uppercase', letterSpacing: '0.02857em', fontFamily: 'inherit' }}>
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ minHeight: 80, padding: '0 4px' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(0,0,0,0.87)', lineHeight: 1.6 }}>{tabs[safeActive]?.content ?? ''}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'inherit', ...style }}>
      <div style={barStyle}>{tabs.map((tab, idx) => <button key={tab.id} onClick={() => setActive(idx)} style={tabBtn(idx === safeActive)}>{tab.label}</button>)}</div>
      <div style={{ paddingTop: 16, minHeight: 80 }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>{content}</p>
      </div>
    </div>
  )
}

export default memo(TabsElement)
