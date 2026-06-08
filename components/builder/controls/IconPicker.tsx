'use client'

import { useState, useRef, useEffect } from 'react'
import { BOOTSTRAP_ICONS, BOOTSTRAP_ICON_CATEGORIES } from '@/lib/bootstrapIcons'

interface Props {
  value?: string
  onChange: (iconName: string) => void
  /** Show as an inline picker (default) or as a button + popover */
  inline?: boolean
}

export default function IconPicker({ value, onChange, inline = false }: Props) {
  const [open, setOpen] = useState(inline)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const popRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (inline) return
    function onDocClick(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open, inline])

  const query = search.trim().toLowerCase()
  const filtered = BOOTSTRAP_ICONS.filter((name) => {
    if (activeCategory !== 'All') {
      const inCat = BOOTSTRAP_ICON_CATEGORIES[activeCategory]?.includes(name)
      if (!inCat) return false
    }
    if (!query) return true
    return name.toLowerCase().includes(query)
  }).slice(0, 240) // cap for perf

  const grid = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 260 }}>
      {/* Search */}
      <input
        type="text"
        placeholder="Search icons…"
        autoFocus
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '6px 10px',
          fontSize: '0.8125rem',
          border: '1px solid var(--color-border)',
          borderRadius: 6,
          outline: 'none',
          background: 'var(--color-bg)',
          color: 'var(--color-text-primary)',
        }}
      />
      {/* Categories */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxHeight: 60, overflowY: 'auto' }}>
        {['All', ...Object.keys(BOOTSTRAP_ICON_CATEGORIES)].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '2px 8px',
              fontSize: '0.7rem',
              borderRadius: 999,
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              background: activeCategory === cat ? 'var(--color-primary)' : 'transparent',
              color: activeCategory === cat ? '#fff' : 'var(--color-text-secondary)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: 4,
          maxHeight: 260,
          overflowY: 'auto',
          padding: 4,
          border: '1px solid var(--color-border)',
          borderRadius: 6,
        }}
      >
        {filtered.map((iconName) => (
          <button
            key={iconName}
            title={iconName}
            onClick={() => { onChange(iconName); if (!inline) setOpen(false) }}
            style={{
              width: 28,
              height: 28,
              border: value === iconName ? '2px solid var(--color-primary)' : '1px solid transparent',
              background: value === iconName ? 'rgba(79,70,229,0.08)' : 'transparent',
              borderRadius: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              color: 'var(--color-text-primary)',
            }}
          >
            <i className={`bi bi-${iconName}`} style={{ fontSize: '0.95rem' }} />
          </button>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 16, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            No icons match "{search}"
          </div>
        )}
      </div>
      {/* Manual entry */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input
          type="text"
          placeholder="Or type icon name…"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: '5px 8px',
            fontSize: '0.7rem',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            outline: 'none',
            background: 'var(--color-bg)',
            color: 'var(--color-text-primary)',
          }}
        />
        {value && <i className={`bi bi-${value}`} style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }} />}
      </div>
    </div>
  )

  if (inline) return grid

  return (
    <div ref={popRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '5px 10px',
          fontSize: '0.75rem',
          border: '1px solid var(--color-border)',
          borderRadius: 5,
          background: 'var(--color-bg)',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textAlign: 'left',
        }}
      >
        {value
          ? <><i className={`bi bi-${value}`} style={{ fontSize: '1rem' }} /><span>{value}</span></>
          : <span style={{ color: 'var(--color-text-secondary)' }}>Pick an icon…</span>
        }
        <span style={{ marginLeft: 'auto', color: 'var(--color-text-secondary)' }}>▾</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            padding: 10,
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
            zIndex: 200,
          }}
        >
          {grid}
        </div>
      )}
    </div>
  )
}
