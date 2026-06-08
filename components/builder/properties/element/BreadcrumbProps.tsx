'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'

interface Props { element: ElementNode }

export default function BreadcrumbProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'breadcrumb') return null
  const { content } = element

  function patch(p: Partial<typeof content>) { updateElement(element.id, { content: { ...content, ...p } }) }

  function updateItem(id: string, patchItem: Partial<typeof content.items[number]>) {
    patch({ items: content.items.map((it) => it.id === id ? { ...it, ...patchItem } : it) })
  }
  function addItem() {
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `bc-${Date.now()}`
    // Make new item the active one and previous items non-active
    const next = content.items.map((it) => ({ ...it, active: false }))
    next.push({ id, label: 'New Page', href: '#', active: true })
    patch({ items: next })
  }
  function removeItem(id: string) {
    patch({ items: content.items.filter((it) => it.id !== id) })
  }
  function setActive(id: string) {
    patch({ items: content.items.map((it) => ({ ...it, active: it.id === id })) })
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
      <PropGroup label="Settings">
        <PropRow label="Separator">
          <SelectInput value={content.separator ?? '/'} options={[
            { label: '/ (slash)', value: '/' },
            { label: '› (chevron)', value: '›' },
            { label: '→ (arrow)', value: '→' },
            { label: '• (dot)', value: '•' },
            { label: '| (pipe)', value: '|' },
          ]} onChange={(v) => patch({ separator: v })} />
        </PropRow>
      </PropGroup>

      <PropGroup label={`Items (${content.items.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {content.items.map((item, idx) => (
            <div key={item.id} style={{ border: '1px solid var(--color-border)', borderRadius: 6, padding: 8, display: 'flex', flexDirection: 'column', gap: 6, backgroundColor: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Item {idx + 1}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => setActive(item.id)} title="Mark as active (current page)"
                    style={{ width: 22, height: 22, borderRadius: 4, border: '1px solid var(--color-border)', cursor: 'pointer', fontSize: '0.6rem', fontWeight: 700,
                      background: item.active ? 'var(--color-primary)' : 'var(--color-bg)', color: item.active ? '#fff' : 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>●</button>
                  <button onClick={() => moveItem(item.id, -1)} disabled={idx === 0} style={iconBtnStyle(idx === 0)} title="Move up">↑</button>
                  <button onClick={() => moveItem(item.id, 1)} disabled={idx === content.items.length - 1} style={iconBtnStyle(idx === content.items.length - 1)} title="Move down">↓</button>
                  <button onClick={() => removeItem(item.id)} style={{ ...iconBtnStyle(false), color: '#ef4444' }} title="Remove">✕</button>
                </div>
              </div>
              <TextInput value={item.label} onChange={(v) => updateItem(item.id, { label: v })} placeholder="Label (e.g. Home)" />
              <TextInput value={item.href} onChange={(v) => updateItem(item.id, { href: v })} placeholder="Link (e.g. /home or #)" />
            </div>
          ))}
          <button onClick={addItem} style={addBtnStyle}>+ Add item</button>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', margin: '6px 0 0', lineHeight: 1.5 }}>
          ● marks the active (current) item. Active items appear without a link.
        </p>
      </PropGroup>
    </>
  )
}

const iconBtnStyle = (disabled: boolean): React.CSSProperties => ({
  width: 22, height: 22, border: '1px solid var(--color-border)', borderRadius: 4, background: 'var(--color-bg)',
  cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
  opacity: disabled ? 0.4 : 1, color: 'var(--color-text-primary)', padding: 0, flexShrink: 0,
})

const addBtnStyle: React.CSSProperties = {
  padding: '8px 12px', border: '1.5px dashed var(--color-border)', borderRadius: 6, background: 'transparent',
  color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
}
