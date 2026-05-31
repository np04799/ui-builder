'use client'

import { memo, useState } from 'react'

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

function TabsElement({
  tabs = [],
  activeTab: initialActive = 0,
  variant = 'line',
  style,
}: Props) {
  const [active, setActive] = useState(initialActive)

  const safeActive = Math.min(active, tabs.length - 1)
  const activeContent = tabs[safeActive]?.content ?? ''

  // ── Tab bar styles by variant ──────────────────────────────────────────────
  const barStyle: React.CSSProperties =
    variant === 'line'
      ? {
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          borderBottom: '2px solid var(--color-border)',
          gap: 0,
        }
      : variant === 'pill'
      ? {
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          gap: 6,
          padding: '6px 0',
          flexWrap: 'nowrap',
        }
      : {
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          border: '1px solid #e5e7eb',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
          gap: 0,
        }

  function tabButtonStyle(isActive: boolean): React.CSSProperties {
    if (variant === 'line') {
      return {
        padding: '10px 18px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: isActive ? 600 : 400,
        color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
        marginBottom: -2,
        transition: 'color 150ms, border-color 150ms',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }
    }
    if (variant === 'pill') {
      return {
        padding: '7px 16px',
        border: 'none',
        borderRadius: 999,
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: isActive ? 600 : 400,
        color: isActive ? '#fff' : 'var(--color-text-secondary)',
        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
        transition: 'background-color 150ms, color 150ms',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }
    }
    // boxed
    return {
      padding: '10px 18px',
      border: 'none',
      background: isActive ? 'var(--color-bg)' : 'var(--color-surface)',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: isActive ? 600 : 400,
      color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
      borderRight: '1px solid var(--color-border)',
      transition: 'background-color 150ms',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }
  }

  const panelStyle: React.CSSProperties =
    variant === 'boxed'
      ? {
          border: '1px solid var(--color-border)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          padding: '20px',
          backgroundColor: 'var(--color-bg)',
          minHeight: 80,
        }
      : {
          paddingTop: 16,
          minHeight: 80,
        }

  return (
    <div style={{ fontFamily: 'inherit', ...style }}>
      <div style={barStyle}>
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => setActive(idx)}
            style={tabButtonStyle(idx === safeActive)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={panelStyle}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
          {activeContent}
        </p>
      </div>
    </div>
  )
}

export default memo(TabsElement)
