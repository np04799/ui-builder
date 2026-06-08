'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'

interface Props { element: ElementNode }

export default function TableProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'table') return null
  const { content } = element

  function patch(p: Partial<typeof content>) { updateElement(element.id, { content: { ...content, ...p } }) }
  function uid() { return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }

  function updateHeader(id: string, label: string) {
    patch({ headers: content.headers.map((h) => h.id === id ? { ...h, label } : h) })
  }
  function addColumn() {
    const newId = uid()
    patch({
      headers: [...content.headers, { id: newId, label: 'New Column' }],
      rows: content.rows.map((r) => ({ ...r, cells: [...r.cells, { id: uid(), value: '' }] })),
    })
  }
  function removeColumn(colIdx: number) {
    if (content.headers.length <= 1) return
    patch({
      headers: content.headers.filter((_, i) => i !== colIdx),
      rows: content.rows.map((r) => ({ ...r, cells: r.cells.filter((_, i) => i !== colIdx) })),
    })
  }
  function updateCell(rowId: string, cellIdx: number, value: string) {
    patch({
      rows: content.rows.map((r) => r.id === rowId
        ? { ...r, cells: r.cells.map((c, i) => i === cellIdx ? { ...c, value } : c) }
        : r),
    })
  }
  function addRow() {
    const newRow = { id: uid(), cells: content.headers.map(() => ({ id: uid(), value: '' })) }
    patch({ rows: [...content.rows, newRow] })
  }
  function removeRow(rowId: string) {
    patch({ rows: content.rows.filter((r) => r.id !== rowId) })
  }

  return (
    <>
      <PropGroup label="Style">
        <PropRow label="Variant">
          <SelectInput value={content.variant ?? 'striped'} options={[
            { label: 'Default', value: 'default' },
            { label: 'Striped', value: 'striped' },
            { label: 'Bordered', value: 'bordered' },
            { label: 'Borderless', value: 'borderless' },
            { label: 'Hover', value: 'hover' },
            { label: 'Striped + Hover', value: 'striped-hover' },
          ]} onChange={(v) => patch({ variant: v as typeof content.variant })} />
        </PropRow>
        <PropRow label="Size">
          <SelectInput value={content.size ?? 'md'} options={[
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ]} onChange={(v) => patch({ size: v as typeof content.size })} />
        </PropRow>
        <PropRow label="Header style">
          <SelectInput value={content.headerStyle ?? 'default'} options={[
            { label: 'Default', value: 'default' },
            { label: 'Dark', value: 'dark' },
            { label: 'Light', value: 'light' },
          ]} onChange={(v) => patch({ headerStyle: v as typeof content.headerStyle })} />
        </PropRow>
        <PropRow label="Responsive">
          <SelectInput value={content.responsive ? 'true' : 'false'} options={[
            { label: 'Yes (scroll on mobile)', value: 'true' },
            { label: 'No', value: 'false' },
          ]} onChange={(v) => patch({ responsive: v === 'true' })} />
        </PropRow>
        <PropRow label="Caption" stack><TextInput value={content.caption ?? ''} onChange={(v) => patch({ caption: v })} placeholder="Optional table caption" /></PropRow>
      </PropGroup>

      <PropGroup label={`Columns (${content.headers.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {content.headers.map((h, i) => (
            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ flex: 1 }}>
                <TextInput value={h.label} onChange={(v) => updateHeader(h.id, v)} placeholder={`Column ${i + 1}`} />
              </div>
              <button onClick={() => removeColumn(i)} disabled={content.headers.length <= 1} style={iconBtn(content.headers.length <= 1)} title="Remove column">✕</button>
            </div>
          ))}
          <button onClick={addColumn} style={addBtn}>+ Add column</button>
        </div>
      </PropGroup>

      <PropGroup label={`Rows (${content.rows.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {content.rows.map((r, ri) => (
            <div key={r.id} style={{ border: '1px solid var(--color-border)', borderRadius: 6, padding: 8, background: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Row {ri + 1}</span>
                <button onClick={() => removeRow(r.id)} style={{ ...iconBtn(false), color: '#ef4444' }} title="Remove row">✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {r.cells.map((c, ci) => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', width: 60, flexShrink: 0 }}>{content.headers[ci]?.label ?? `Col ${ci + 1}`}</span>
                    <div style={{ flex: 1 }}>
                      <TextInput value={c.value} onChange={(v) => updateCell(r.id, ci, v)} placeholder="Cell value" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button onClick={addRow} style={addBtn}>+ Add row</button>
        </div>
      </PropGroup>
    </>
  )
}

const iconBtn = (disabled: boolean): React.CSSProperties => ({
  width: 24, height: 24, border: '1px solid var(--color-border)', borderRadius: 4, background: 'var(--color-bg)',
  cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
  opacity: disabled ? 0.4 : 1, color: 'var(--color-text-primary)', padding: 0, flexShrink: 0,
})

const addBtn: React.CSSProperties = {
  padding: '8px 12px', border: '1.5px dashed var(--color-border)', borderRadius: 6, background: 'transparent',
  color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
}
