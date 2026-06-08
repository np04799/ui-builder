'use client'

import { useState, useEffect } from 'react'
import type { StyleMap } from '@/types/builder.types'

/** CSS camelCase prop → string value from raw CSS text */
function parseCSSText(raw: string): Record<string, string> {
  const result: Record<string, string> = {}
  raw.split(';').forEach((decl) => {
    const colon = decl.indexOf(':')
    if (colon === -1) return
    const prop = decl.slice(0, colon).trim()
    const val = decl.slice(colon + 1).trim()
    if (!prop || !val) return
    // Convert kebab-case to camelCase
    const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    result[camel] = val
  })
  return result
}

/** Build a raw CSS text string from a styles map (only the custom keys) */
function stylesToCSS(parsed: Record<string, string>): string {
  return Object.entries(parsed)
    .map(([k, v]) => {
      const kebab = k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
      return `${kebab}: ${v}`
    })
    .join(';\n')
}

interface Props {
  /** Full element styles map — used to read/write custom CSS keys */
  styles: StyleMap
  /** Known style keys managed by the rest of the panel — excluded from custom CSS */
  knownKeys: string[]
  onChange: (newStyles: StyleMap) => void
}

export default function CustomCSSField({ styles, knownKeys, onChange }: Props) {
  const [open, setOpen] = useState(false)

  // Derive the "extra" styles not managed by the panel controls
  const extraStyles = Object.fromEntries(
    Object.entries(styles).filter(([k]) => !knownKeys.includes(k) && k !== '__customCSS')
  )

  const [draft, setDraft] = useState(() => stylesToCSS(extraStyles))

  // Sync draft when external changes come in (e.g. undo/redo)
  useEffect(() => {
    setDraft(stylesToCSS(extraStyles))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(extraStyles)])

  function apply() {
    const parsed = parseCSSText(draft)
    // Keep known keys, remove old extra keys, add new parsed ones
    const next: StyleMap = {}
    for (const k of knownKeys) {
      if (styles[k] !== undefined) next[k] = styles[k]
    }
    Object.assign(next, parsed)
    onChange(next)
  }

  return (
    <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 4, paddingTop: 2 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 16px',
          color: 'var(--color-text-secondary)',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        <span>Custom CSS</span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
        >
          <path d="M2 4L6 8L10 4" />
        </svg>
      </button>

      {open && (
        <div style={{ padding: '0 16px 12px' }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', margin: '0 0 6px', lineHeight: 1.4 }}>
            CSS properties not covered above. Use <code style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>kebab-case</code>.
          </p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={apply}
            placeholder={'opacity: 0.8;\nbox-shadow: 0 4px 20px rgba(0,0,0,0.1);'}
            rows={5}
            spellCheck={false}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              lineHeight: 1.6,
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              backgroundColor: 'var(--color-bg-secondary, #f8f9fa)',
              color: 'var(--color-text-primary)',
              resize: 'vertical',
              outline: 'none',
            }}
          />
          <button
            onClick={apply}
            style={{
              marginTop: 6,
              height: 26,
              padding: '0 12px',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}
