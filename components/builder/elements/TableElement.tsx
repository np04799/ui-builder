'use client'

import { memo } from 'react'
import { useFramework } from '@/hooks/useFramework'

interface Header { id: string; label: string }
interface Row { id: string; cells: { id: string; value: string }[] }

type Variant = 'default' | 'striped' | 'bordered' | 'borderless' | 'hover' | 'striped-hover'
type Size = 'sm' | 'md' | 'lg'

interface Props {
  headers?: Header[]
  rows?: Row[]
  variant?: Variant
  size?: Size
  responsive?: boolean
  caption?: string
  headerStyle?: 'default' | 'dark' | 'light'
  style?: React.CSSProperties
}

const TableElement = memo(function TableElement({
  headers = [],
  rows = [],
  variant = 'striped',
  size = 'md',
  responsive = true,
  caption,
  headerStyle = 'default',
  style,
}: Props) {
  const framework = useFramework()

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    const cls = [
      'table',
      variant === 'striped' && 'table-striped',
      variant === 'bordered' && 'table-bordered',
      variant === 'borderless' && 'table-borderless',
      variant === 'hover' && 'table-hover',
      variant === 'striped-hover' && 'table-striped table-hover',
      size === 'sm' && 'table-sm',
    ].filter(Boolean).join(' ')
    const headCls = headerStyle === 'dark' ? 'table-dark' : headerStyle === 'light' ? 'table-light' : ''
    const tableEl = (
      <table className={cls} style={style}>
        {caption && <caption>{caption}</caption>}
        <thead className={headCls}>
          <tr>
            {headers.map((h) => <th key={h.id} scope="col">{h.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              {r.cells.map((c) => <td key={c.id}>{c.value}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    )
    return responsive ? <div className="table-responsive">{tableEl}</div> : tableEl
  }

  // ── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    const headBg = headerStyle === 'dark' ? 'bg-gray-900 text-white' : headerStyle === 'light' ? 'bg-gray-50' : 'bg-gray-100'
    const sizeCls = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
    const stripe = variant === 'striped' || variant === 'striped-hover'
    const hover = variant === 'hover' || variant === 'striped-hover'
    const border = variant === 'bordered' ? 'border border-gray-200' : ''
    const tableEl = (
      <table className={`w-full ${sizeCls} ${border}`} style={style}>
        {caption && <caption className="text-xs text-gray-500 mb-2">{caption}</caption>}
        <thead className={headBg}>
          <tr>
            {headers.map((h) => <th key={h.id} className="text-left font-semibold px-3 py-2 border-b border-gray-200">{h.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id} className={`${stripe && idx % 2 === 1 ? 'bg-gray-50' : ''} ${hover ? 'hover:bg-gray-100' : ''} ${variant === 'borderless' ? '' : 'border-b border-gray-100'}`}>
              {r.cells.map((c) => <td key={c.id} className="px-3 py-2">{c.value}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    )
    return responsive ? <div className="overflow-x-auto">{tableEl}</div> : tableEl
  }

  // ── Custom / MUI ───────────────────────────────────────────────────────────
  const cellPad = size === 'sm' ? '4px 8px' : size === 'lg' ? '12px 16px' : '8px 12px'
  const fontSize = size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem'
  const headBg = headerStyle === 'dark' ? '#111827' : headerStyle === 'light' ? 'var(--color-surface)' : 'var(--color-surface)'
  const headColor = headerStyle === 'dark' ? '#fff' : 'var(--color-text-primary)'
  const border = variant === 'bordered' ? '1px solid var(--color-border)' : 'none'
  const cellBorder = variant === 'borderless' ? 'none' : '1px solid var(--color-border)'

  const tableEl = (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize, color: 'var(--color-text-primary)', border, ...style }}>
      {caption && <caption style={{ captionSide: 'top', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textAlign: 'left', padding: '0 0 8px' }}>{caption}</caption>}
      <thead>
        <tr style={{ background: headBg, color: headColor }}>
          {headers.map((h) => (
            <th key={h.id} style={{ textAlign: 'left', fontWeight: 600, padding: cellPad, borderBottom: cellBorder, border: variant === 'bordered' ? '1px solid var(--color-border)' : undefined }}>
              {h.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => {
          const striped = (variant === 'striped' || variant === 'striped-hover') && idx % 2 === 1
          return (
            <tr key={r.id} style={{ background: striped ? 'rgba(0,0,0,0.025)' : 'transparent' }}>
              {r.cells.map((c) => (
                <td key={c.id} style={{ padding: cellPad, borderBottom: cellBorder, border: variant === 'bordered' ? '1px solid var(--color-border)' : undefined }}>
                  {c.value}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
  return responsive ? <div style={{ overflowX: 'auto', width: '100%' }}>{tableEl}</div> : tableEl
})

export default TableElement
