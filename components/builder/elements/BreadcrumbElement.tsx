'use client'

import { memo } from 'react'
import { useFramework } from '@/hooks/useFramework'

interface BreadcrumbItem { id: string; label: string; href: string; active?: boolean }

interface Props {
  items?: BreadcrumbItem[]
  separator?: string
  style?: React.CSSProperties
}

const DEFAULT_ITEMS: BreadcrumbItem[] = [
  { id: '1', label: 'Home', href: '#' },
  { id: '2', label: 'Projects', href: '#' },
  { id: '3', label: 'Current Page', href: '#', active: true },
]

const BreadcrumbElement = memo(function BreadcrumbElement({ items = DEFAULT_ITEMS, separator = '/', style }: Props) {
  const framework = useFramework()
  const display = items.length === 0 ? DEFAULT_ITEMS : items

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    return (
      <nav aria-label="breadcrumb" style={style}>
        <ol className="breadcrumb mb-0">
          {display.map((item) => (
            <li key={item.id} className={`breadcrumb-item${item.active ? ' active' : ''}`} aria-current={item.active ? 'page' : undefined}>
              {item.active ? item.label : <a href={item.href} className="text-decoration-none">{item.label}</a>}
            </li>
          ))}
        </ol>
      </nav>
    )
  }

  // ── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    return (
      <nav aria-label="breadcrumb" style={style}>
        <ol className="flex items-center gap-1 m-0 p-0 list-none flex-wrap">
          {display.map((item, idx) => (
            <li key={item.id} className="flex items-center gap-1">
              {idx > 0 && <span className="text-gray-400 text-sm select-none">{separator}</span>}
              {item.active
                ? <span className="text-sm font-medium text-gray-900">{item.label}</span>
                : <a href={item.href} className="text-sm text-indigo-600 hover:text-indigo-800 no-underline">{item.label}</a>
              }
            </li>
          ))}
        </ol>
      </nav>
    )
  }

  // ── Custom / MUI ───────────────────────────────────────────────────────────
  return (
    <nav aria-label="breadcrumb" style={style}>
      <ol style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0, padding: 0, listStyle: 'none', flexWrap: 'wrap' }}>
        {display.map((item, idx) => (
          <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {idx > 0 && <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', userSelect: 'none' }}>{separator}</span>}
            {item.active
              ? <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.label}</span>
              : <a href={item.href} style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', textDecoration: 'none' }}>{item.label}</a>
            }
          </li>
        ))}
      </ol>
    </nav>
  )
})

export default BreadcrumbElement
