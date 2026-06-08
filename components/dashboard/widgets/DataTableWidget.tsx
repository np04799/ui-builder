'use client'

import { useState, useMemo } from 'react'
import type { DashboardWidget } from '@/types/dashboard.types'

interface Props {
  widget: DashboardWidget
  rows: Record<string, unknown>[]
  isPreview?: boolean
}

type SortDir = 'asc' | 'desc' | null

export default function DataTableWidget({ widget, rows, isPreview }: Props) {
  const { dataBinding: binding, tableConfig: cfg = {} } = widget

  const allColNames = rows.length > 0 ? Object.keys(rows[0]) : []
  const visibleCols = binding.tableColumns?.length ? binding.tableColumns : allColNames

  const pageSize = cfg.pageSize ?? 10
  const [page, setPage] = useState(0)
  const [sortCol, setSortCol] = useState<string | null>(cfg.defaultSortCol ?? null)
  const [sortDir, setSortDir] = useState<SortDir>(cfg.defaultSortDir ?? null)
  const [colFilters, setColFilters] = useState<Record<string, string>>({})
  const [showFilters, setShowFilters] = useState(cfg.showColumnFilters ?? true)

  // Filter rows by column filter inputs
  const filtered = useMemo(() => {
    return rows.filter((row) =>
      Object.entries(colFilters).every(([col, val]) => {
        if (!val.trim()) return true
        return String(row[col] ?? '').toLowerCase().includes(val.toLowerCase())
      })
    )
  }, [rows, colFilters])

  // Sort
  const sorted = useMemo(() => {
    if (!sortCol || !sortDir) return filtered
    return [...filtered].sort((a, b) => {
      const va = a[sortCol]; const vb = b[sortCol]
      const na = Number(va); const nb = Number(vb)
      const numComp = !isNaN(na) && !isNaN(nb) ? na - nb : String(va).localeCompare(String(vb))
      return sortDir === 'asc' ? numComp : -numComp
    })
  }, [filtered, sortCol, sortDir])

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize)

  function handleSort(col: string) {
    if (sortCol === col) {
      setSortDir((d) => d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc')
      if (sortDir === 'desc') setSortCol(null)
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
    setPage(0)
  }

  function handleColFilter(col: string, val: string) {
    setColFilters((f) => ({ ...f, [col]: val }))
    setPage(0)
  }

  const density = cfg.density ?? 'normal'
  const cellPad = density === 'compact' ? '4px 8px' : density === 'comfortable' ? '10px 12px' : '6px 10px'
  const fontSize = density === 'compact' ? '0.72rem' : '0.8rem'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
          {filtered.length} rows{filtered.length !== rows.length ? ` (filtered from ${rows.length})` : ''}
        </span>
        <button
          onClick={() => setShowFilters((v) => !v)}
          title="Toggle column filters"
          style={{
            padding: '3px 8px', borderRadius: 5, border: '1px solid var(--color-border)',
            backgroundColor: showFilters ? 'var(--color-selected)' : 'transparent',
            color: showFilters ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <i className="bi bi-funnel" /> Filter
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize }}>
          <thead>
            <tr>
              {visibleCols.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  style={{
                    padding: cellPad, textAlign: 'left', fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    backgroundColor: 'var(--color-selected)',
                    borderBottom: '2px solid var(--color-border)',
                    whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none',
                    position: 'sticky', top: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {col}
                    {sortCol === col
                      ? (sortDir === 'asc' ? ' ▲' : ' ▼')
                      : <span style={{ opacity: 0.3 }}> ↕</span>}
                  </div>
                  {showFilters && (
                    <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 4 }}>
                      <input
                        value={colFilters[col] ?? ''}
                        onChange={(e) => handleColFilter(col, e.target.value)}
                        placeholder="Filter…"
                        style={{
                          width: '100%', padding: '2px 6px', borderRadius: 4,
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)',
                          fontSize: '0.7rem', outline: 'none', boxSizing: 'border-box',
                          fontWeight: 400,
                        }}
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length} style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                  No rows match the current filters.
                </td>
              </tr>
            ) : (
              paginated.map((row, ri) => (
                <tr
                  key={ri}
                  style={{
                    backgroundColor: cfg.striped && ri % 2 === 1
                      ? 'var(--color-selected)'
                      : 'transparent',
                  }}
                  onMouseEnter={(e) => { if (!cfg.striped || ri % 2 === 0) e.currentTarget.style.backgroundColor = 'var(--color-selected)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = cfg.striped && ri % 2 === 1 ? 'var(--color-selected)' : 'transparent' }}
                >
                  {visibleCols.map((col) => (
                    <td
                      key={col}
                      style={{
                        padding: cellPad,
                        borderBottom: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        whiteSpace: 'nowrap',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {String(row[col] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexShrink: 0, borderTop: '1px solid var(--color-border)', paddingTop: 6 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
            Page {page + 1} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <PageBtn disabled={page === 0} onClick={() => setPage(0)}>«</PageBtn>
            <PageBtn disabled={page === 0} onClick={() => setPage((p) => p - 1)}>‹</PageBtn>
            <PageBtn disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>›</PageBtn>
            <PageBtn disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>»</PageBtn>
          </div>
          <select
            value={pageSize}
            onChange={(e) => { widget.tableConfig = { ...widget.tableConfig, pageSize: Number(e.target.value) }; setPage(0) }}
            style={{ fontSize: '0.7rem', padding: '2px 4px', borderRadius: 4, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
          >
            {[10, 25, 50].map((n) => <option key={n} value={n}>{n} / page</option>)}
          </select>
        </div>
      )}
    </div>
  )
}

function PageBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: 24, height: 24, borderRadius: 4, border: '1px solid var(--color-border)',
      backgroundColor: 'transparent', cursor: disabled ? 'default' : 'pointer',
      color: disabled ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
      fontSize: '0.75rem', opacity: disabled ? 0.4 : 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {children}
    </button>
  )
}
