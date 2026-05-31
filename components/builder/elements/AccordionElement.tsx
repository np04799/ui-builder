'use client'

import { memo, useState } from 'react'

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

function AccordionElement({
  items = [],
  allowMultiple = false,
  variant = 'default',
  style,
}: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    items.forEach((item) => {
      if (item.defaultOpen) initial.add(item.id)
    })
    return initial
  })

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!allowMultiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  function itemContainerStyle(isLast: boolean): React.CSSProperties {
    if (variant === 'flush') {
      return {
        borderBottom: '1px solid #e5e7eb',
      }
    }
    if (variant === 'bordered') {
      return {
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: isLast ? 0 : 8,
      }
    }
    // default — card-style
    return {
      borderRadius: 8,
      boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
      border: '1px solid var(--color-border)',
      marginBottom: isLast ? 0 : 8,
      overflow: 'hidden',
      backgroundColor: 'var(--color-bg)',
    }
  }

  function headerStyle(isOpen: boolean): React.CSSProperties {
    return {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      minHeight: 48,
      border: 'none',
      background: isOpen && variant !== 'flush' ? 'var(--color-selected)' : 'transparent',
      cursor: 'pointer',
      fontSize: '0.9375rem',
      fontWeight: 600,
      color: 'var(--color-text-primary)',
      textAlign: 'left',
      transition: 'background-color 150ms',
      boxSizing: 'border-box',
    }
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  flexShrink: 0,
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms ease',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: '4px 16px 16px',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  borderTop: variant === 'flush' ? '1px solid var(--color-border)' : 'none',
                }}
              >
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
