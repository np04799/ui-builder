'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@/components/builder/icons'

interface Props {
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export default function PropGroup({ label, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      style={{
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-secondary)',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        {label}
        <ChevronDownIcon
          style={{
            width: 14,
            height: 14,
            flexShrink: 0,
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 150ms ease',
          }}
        />
      </button>

      {open && (
        <div
          style={{
            padding: '4px 16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
