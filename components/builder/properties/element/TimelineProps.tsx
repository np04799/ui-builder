'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'

interface Props { element: ElementNode }

export default function TimelineProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'timeline') return null
  const { content } = element

  function patch(p: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...p } })
  }

  function updateItem(id: string, patchItem: Partial<typeof content.items[number]>) {
    const next = content.items.map((it) => it.id === id ? { ...it, ...patchItem } : it)
    patch({ items: next })
  }

  function addItem() {
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `item-${Date.now()}`
    patch({ items: [...content.items, { id, title: 'New Event', description: 'Add description', date: 'Date', color: '#4f46e5' }] })
  }

  function removeItem(id: string) {
    patch({ items: content.items.filter((it) => it.id !== id) })
  }

  function moveItem(id: string, dir: -1 | 1) {
    const idx = content.items.findIndex((it) => it.id === id)
    if (idx < 0) return
    const next = [...content.items]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    patch({ items: next })
  }

  return (
    <>
      <PropGroup label="Layout">
        <PropRow label="Variant">
          <SelectInput
            value={content.variant ?? 'default'}
            options={[
              { label: 'Default', value: 'default' },
              { label: 'Compact', value: 'compact' },
              { label: 'Alternating', value: 'alternating' },
            ]}
            onChange={(v) => patch({ variant: v as typeof content.variant })}
          />
        </PropRow>
      </PropGroup>

      <PropGroup label={`Items (${content.items.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {content.items.map((item, idx) => (
            <div key={item.id} style={{ border: '1px solid var(--color-border)', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 6, backgroundColor: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Item {idx + 1}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => moveItem(item.id, -1)} disabled={idx === 0} style={iconBtnStyle(idx === 0)} title="Move up">↑</button>
                  <button onClick={() => moveItem(item.id, 1)} disabled={idx === content.items.length - 1} style={iconBtnStyle(idx === content.items.length - 1)} title="Move down">↓</button>
                  <button onClick={() => removeItem(item.id)} style={{ ...iconBtnStyle(false), color: '#ef4444' }} title="Remove">✕</button>
                </div>
              </div>
              <TextInput value={item.title} onChange={(v) => updateItem(item.id, { title: v })} placeholder="Title" />
              <TextInput value={item.description} onChange={(v) => updateItem(item.id, { description: v })} placeholder="Description" />
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <TextInput value={item.date ?? ''} onChange={(v) => updateItem(item.id, { date: v })} placeholder="Date (optional)" />
                </div>
                <ColorSwatch value={item.color ?? '#4f46e5'} onChange={(v) => updateItem(item.id, { color: v })} />
              </div>
            </div>
          ))}
          <button onClick={addItem} style={addBtnStyle}>+ Add item</button>
        </div>
      </PropGroup>
    </>
  )
}

const iconBtnStyle = (disabled: boolean): React.CSSProperties => ({
  width: 22, height: 22, border: '1px solid var(--color-border)', borderRadius: 4, background: 'var(--color-bg)',
  cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
  opacity: disabled ? 0.4 : 1, color: 'var(--color-text-primary)', padding: 0,
})

const addBtnStyle: React.CSSProperties = {
  padding: '8px 12px', border: '1.5px dashed var(--color-border)', borderRadius: 6, background: 'transparent',
  color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
}
