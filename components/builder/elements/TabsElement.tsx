'use client'

import { memo, useState } from 'react'
import { useFramework } from '@/hooks/useFramework'

interface Tab {
  id: string
  label: string
  content: string
}

interface Props {
  tabs?: Tab[]
  activeTab?: number
  variant?: 'line' | 'pill' | 'boxed'
  style?: React.CSSProperties
}

function EmptyState({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ padding: '20px', border: '1px dashed var(--color-border)', borderRadius: 8, color: 'var(--color-text-secondary)', fontSize: '0.875rem', textAlign: 'center', ...style }}>
      No tabs yet — add tabs in the properties panel.
    </div>
  )
}

// ─── Bootstrap tabs ───────────────────────────────────────────────────────────

function BootstrapTabs({ tabs, style }: { tabs: Tab[]; style?: React.CSSProperties }) {
  const [active, setActive] = useState(0)
  const safeActive = Math.min(active, tabs.length - 1)
  return (
    <div style={style}>
      <ul className="nav nav-tabs mb-0" role="tablist">
        {tabs.map((tab, idx) => (
          <li key={tab.id} className="nav-item">
            <button
              className={`nav-link${idx === safeActive ? ' active' : ''}`}
              onClick={() => setActive(idx)}
              type="button"
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content border border-top-0 rounded-bottom p-3">
        <p className="mb-0 text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
          {tabs[safeActive]?.content}
        </p>
      </div>
    </div>
  )
}

// ─── MUI tabs ─────────────────────────────────────────────────────────────────

function MuiTabs({ tabs, style }: { tabs: Tab[]; style?: React.CSSProperties }) {
  const [active, setActive] = useState(0)
  const safeActive = Math.min(active, tabs.length - 1)
  return (
    <div style={style}>
      <div className="MuiTabs-root" style={{ borderBottom: '1px solid rgba(0,0,0,0.12)', display: 'flex' }}>
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => setActive(idx)}
            className={`MuiTab-root${idx === safeActive ? ' Mui-selected' : ''}`}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: idx === safeActive ? 600 : 400,
              color: idx === safeActive ? '#1976d2' : 'rgba(0,0,0,0.6)',
              borderBottom: idx === safeActive ? '2px solid #1976d2' : '2px solid transparent',
              marginBottom: -1,
              transition: 'color 150ms',
              textTransform: 'uppercase',
              letterSpacing: '0.02857em',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ paddingTop: 16, minHeight: 80 }}>
        <p className="MuiTypography-root MuiTypography-body1" style={{ margin: 0 }}>
          {tabs[safeActive]?.content}
        </p>
      </div>
    </div>
  )
}

// ─── Tailwind tabs ────────────────────────────────────────────────────────────

function TailwindTabs({ tabs, variant, style }: { tabs: Tab[]; variant: 'line' | 'pill' | 'boxed'; style?: React.CSSProperties }) {
  const [active, setActive] = useState(0)
  const safeActive = Math.min(active, tabs.length - 1)

  const isPill = variant === 'pill'
  const isBoxed = variant === 'boxed'

  return (
    <div style={style}>
      <div className={`flex overflow-x-auto ${isBoxed ? 'border border-gray-200 rounded-t-lg overflow-hidden' : isPill ? 'gap-1.5 py-1.5' : 'border-b-2 border-gray-200'}`}>
        {tabs.map((tab, idx) => {
          const isActive = idx === safeActive
          let cls = ''
          if (isPill) {
            cls = isActive
              ? 'px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-600 text-white whitespace-nowrap'
              : 'px-4 py-1.5 rounded-full text-sm text-gray-500 hover:bg-gray-100 whitespace-nowrap'
          } else if (isBoxed) {
            cls = isActive
              ? 'px-4 py-2.5 text-sm font-semibold text-gray-900 bg-white border-r border-gray-200 whitespace-nowrap'
              : 'px-4 py-2.5 text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 border-r border-gray-200 whitespace-nowrap'
          } else {
            cls = isActive
              ? 'px-4 py-2.5 text-sm font-semibold text-indigo-600 border-b-2 border-indigo-600 -mb-0.5 whitespace-nowrap'
              : 'px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 border-b-2 border-transparent -mb-0.5 whitespace-nowrap'
          }
          return (
            <button key={tab.id} onClick={() => setActive(idx)} className={`border-none bg-transparent cursor-pointer ${cls}`}>
              {tab.label}
            </button>
          )
        })}
      </div>
      <div className={`pt-4 min-h-20 ${isBoxed ? 'border border-t-0 border-gray-200 rounded-b-lg p-4' : ''}`}>
        <p className="text-sm text-gray-600 leading-relaxed m-0">{tabs[safeActive]?.content}</p>
      </div>
    </div>
  )
}

// ─── Custom tabs (original logic) ─────────────────────────────────────────────

function CustomTabs({ tabs, variant, style }: { tabs: Tab[]; variant: 'line' | 'pill' | 'boxed'; style?: React.CSSProperties }) {
  const [active, setActive] = useState(0)
  const safeActive = Math.min(active, tabs.length - 1)
  const activeContent = tabs[safeActive]?.content ?? ''

  const barStyle: React.CSSProperties =
    variant === 'line'
      ? { display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', borderBottom: '2px solid var(--color-border)', gap: 0 }
      : variant === 'pill'
      ? { display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', gap: 6, padding: '6px 0', flexWrap: 'nowrap' }
      : { display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', border: '1px solid #e5e7eb', borderRadius: '8px 8px 0 0', overflow: 'hidden', gap: 0 }

  function tabButtonStyle(isActive: boolean): React.CSSProperties {
    if (variant === 'line') {
      return { padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)', borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent', marginBottom: -2, transition: 'color 150ms, border-color 150ms', whiteSpace: 'nowrap', flexShrink: 0 }
    }
    if (variant === 'pill') {
      return { padding: '7px 16px', border: 'none', borderRadius: 999, cursor: 'pointer', fontSize: '0.875rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#fff' : 'var(--color-text-secondary)', backgroundColor: isActive ? 'var(--color-primary)' : 'transparent', transition: 'background-color 150ms, color 150ms', whiteSpace: 'nowrap', flexShrink: 0 }
    }
    return { padding: '10px 18px', border: 'none', background: isActive ? 'var(--color-bg)' : 'var(--color-surface)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', borderRight: '1px solid var(--color-border)', transition: 'background-color 150ms', whiteSpace: 'nowrap', flexShrink: 0 }
  }

  const panelStyle: React.CSSProperties = variant === 'boxed'
    ? { border: '1px solid var(--color-border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '20px', backgroundColor: 'var(--color-bg)', minHeight: 80 }
    : { paddingTop: 16, minHeight: 80 }

  return (
    <div style={{ fontFamily: 'inherit', ...style }}>
      <div style={barStyle}>
        {tabs.map((tab, idx) => (
          <button key={tab.id} onClick={() => setActive(idx)} style={tabButtonStyle(idx === safeActive)}>{tab.label}</button>
        ))}
      </div>
      <div style={panelStyle}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>{activeContent}</p>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function TabsElement({ tabs = [], activeTab: _initialActive = 0, variant = 'line', style }: Props) {
  const framework = useFramework()

  if (tabs.length === 0) return <EmptyState style={style} />

  if (framework === 'bootstrap') return <BootstrapTabs tabs={tabs} style={style} />
  if (framework === 'mui') return <MuiTabs tabs={tabs} style={style} />
  if (framework === 'tailwind') return <TailwindTabs tabs={tabs} variant={variant} style={style} />
  return <CustomTabs tabs={tabs} variant={variant} style={style} />
}

export default memo(TabsElement)
