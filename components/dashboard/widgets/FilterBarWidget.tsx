'use client'

import { useState } from 'react'
import { useDashboardStore, selectDataSource } from '@/store/dashboard.store'
import { getUniqueValues } from '@/utils/dataParser'
import type { DashboardWidget, ColumnMeta, FilterState } from '@/types/dashboard.types'

interface Props {
  widget: DashboardWidget
}

type ControlType = FilterState['controlType']

const CONTROL_TYPES: { value: ControlType; label: string; icon: string }[] = [
  { value: 'dropdown',    label: 'Dropdown',     icon: 'bi-chevron-down' },
  { value: 'multiselect', label: 'Multi-select',  icon: 'bi-check2-square' },
  { value: 'search',      label: 'Search',        icon: 'bi-search' },
  { value: 'daterange',   label: 'Date Range',    icon: 'bi-calendar-range' },
  { value: 'numberrange', label: 'Number Range',  icon: 'bi-sliders' },
]

export default function FilterBarWidget({ widget }: Props) {
  const globalFilters = useDashboardStore((s) => s.globalFilters)
  const setGlobalFilter = useDashboardStore((s) => s.setGlobalFilter)
  const removeGlobalFilter = useDashboardStore((s) => s.removeGlobalFilter)
  const source = useDashboardStore(selectDataSource(widget.dataSourceId))
  const [showAdd, setShowAdd] = useState(false)
  const [addCol, setAddCol] = useState('')
  const [addType, setAddType] = useState<ControlType>('dropdown')

  const columns = source?.columns ?? []

  function addFilter() {
    if (!addCol) return
    const uniqueVals = source ? getUniqueValues(source.rows, addCol) : []
    const filter: FilterState = {
      id: crypto.randomUUID(),
      column: addCol,
      operator: addType === 'search' ? 'contains' : addType === 'multiselect' ? 'in' : addType === 'numberrange' ? 'between' : 'eq',
      value: addType === 'multiselect' ? [] : '',
      label: addCol,
      controlType: addType,
      options: uniqueVals,
    }
    setGlobalFilter(filter)
    setShowAdd(false)
    setAddCol('')
  }

  if (!source) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary)', fontSize: '0.8rem', gap: 8 }}>
        <i className="bi bi-funnel" />
        Connect a data source to add filters
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, height: '100%', padding: '0 4px' }}>
      {globalFilters.map((f) => (
        <FilterControl key={f.id} filter={f} onChange={setGlobalFilter} onRemove={removeGlobalFilter} />
      ))}

      {/* Add Filter button */}
      {showAdd ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 8, border: '1px solid var(--color-primary)', backgroundColor: 'var(--color-selected)' }}>
          <select value={addCol} onChange={(e) => setAddCol(e.target.value)} style={miniSelect}>
            <option value="">Column…</option>
            {columns.map((c: ColumnMeta) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <select value={addType} onChange={(e) => setAddType(e.target.value as ControlType)} style={miniSelect}>
            {CONTROL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <button onClick={addFilter} disabled={!addCol} style={{ ...miniBtn, backgroundColor: 'var(--color-primary)', color: '#fff', opacity: addCol ? 1 : 0.5 }}>Add</button>
          <button onClick={() => setShowAdd(false)} style={miniBtn}>✕</button>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
          borderRadius: 8, border: '1px dashed var(--color-border)',
          backgroundColor: 'transparent', color: 'var(--color-text-secondary)',
          cursor: 'pointer', fontSize: '0.78rem',
        }}>
          <i className="bi bi-plus" />
          Add Filter
        </button>
      )}

      {globalFilters.length > 0 && (
        <button
          onClick={() => useDashboardStore.getState().clearGlobalFilters()}
          style={{ fontSize: '0.72rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
        >
          Clear all
        </button>
      )}
    </div>
  )
}

function FilterControl({
  filter, onChange, onRemove,
}: {
  filter: FilterState
  onChange: (f: FilterState) => void
  onRemove: (id: string) => void
}) {
  function update(value: unknown, value2?: unknown) {
    onChange({ ...filter, value, ...(value2 !== undefined ? { value2 } : {}) })
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px 4px 10px',
    borderRadius: 8, border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
  }
  const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }
  const removeBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.7rem', padding: 2 }

  if (filter.controlType === 'dropdown') {
    return (
      <div style={containerStyle}>
        <span style={labelStyle}>{filter.label}:</span>
        <select value={String(filter.value ?? '')} onChange={(e) => update(e.target.value)} style={{ ...miniSelect, minWidth: 80 }}>
          <option value="">All</option>
          {filter.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <button style={removeBtn} onClick={() => onRemove(filter.id)}>✕</button>
      </div>
    )
  }

  if (filter.controlType === 'multiselect') {
    const selected = Array.isArray(filter.value) ? filter.value as string[] : []
    const [open, setOpen] = useState(false)
    return (
      <div style={{ ...containerStyle, position: 'relative' }}>
        <span style={labelStyle}>{filter.label}:</span>
        <button onClick={() => setOpen((v) => !v)} style={{ ...miniSelect, minWidth: 80, cursor: 'pointer', textAlign: 'left' }}>
          {selected.length === 0 ? 'All' : `${selected.length} selected`}
        </button>
        {open && (
          <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', maxHeight: 180, overflowY: 'auto', minWidth: 140, padding: 6 }}>
            {filter.options?.map((o) => (
              <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 6px', fontSize: '0.78rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={selected.includes(o)} onChange={(e) => {
                  const next = e.target.checked ? [...selected, o] : selected.filter((s) => s !== o)
                  update(next)
                }} />
                {o}
              </label>
            ))}
          </div>
        )}
        <button style={removeBtn} onClick={() => onRemove(filter.id)}>✕</button>
      </div>
    )
  }

  if (filter.controlType === 'search') {
    return (
      <div style={containerStyle}>
        <i className="bi bi-search" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }} />
        <span style={labelStyle}>{filter.label}:</span>
        <input
          value={String(filter.value ?? '')}
          onChange={(e) => update(e.target.value)}
          placeholder="Search…"
          style={{ ...miniSelect, minWidth: 100 }}
        />
        <button style={removeBtn} onClick={() => onRemove(filter.id)}>✕</button>
      </div>
    )
  }

  if (filter.controlType === 'daterange') {
    const [from, to] = Array.isArray(filter.value) ? filter.value as string[] : ['', '']
    return (
      <div style={containerStyle}>
        <span style={labelStyle}>{filter.label}:</span>
        <input type="date" value={from} onChange={(e) => update([e.target.value, to])} style={miniSelect} />
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>–</span>
        <input type="date" value={to} onChange={(e) => update([from, e.target.value])} style={miniSelect} />
        <button style={removeBtn} onClick={() => onRemove(filter.id)}>✕</button>
      </div>
    )
  }

  if (filter.controlType === 'numberrange') {
    return (
      <div style={containerStyle}>
        <span style={labelStyle}>{filter.label}:</span>
        <input type="number" value={String(filter.value ?? '')} onChange={(e) => update(Number(e.target.value), filter.value2)} placeholder="Min" style={{ ...miniSelect, width: 60 }} />
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>–</span>
        <input type="number" value={String(filter.value2 ?? '')} onChange={(e) => update(filter.value, Number(e.target.value))} placeholder="Max" style={{ ...miniSelect, width: 60 }} />
        <button style={removeBtn} onClick={() => onRemove(filter.id)}>✕</button>
      </div>
    )
  }

  return null
}

const miniSelect: React.CSSProperties = {
  padding: '3px 6px', borderRadius: 5, border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)',
  fontSize: '0.78rem', outline: 'none',
}
const miniBtn: React.CSSProperties = {
  padding: '3px 8px', borderRadius: 5, border: '1px solid var(--color-border)',
  backgroundColor: 'transparent', color: 'var(--color-text-primary)',
  cursor: 'pointer', fontSize: '0.78rem',
}
