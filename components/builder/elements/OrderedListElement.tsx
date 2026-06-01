'use client'

import { memo, useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import { useFramework } from '@/hooks/useFramework'

interface ListItem { id: string; text: string }
interface Props { elementId?: string; items: ListItem[]; markerColor?: string; style?: React.CSSProperties }

const OrderedListElement = memo(function OrderedListElement({ elementId, items, markerColor = 'var(--color-primary)', style }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const framework = useFramework()
  const [editingId, setEditingId] = useState<string | null>(null)

  function patchItems(next: ListItem[]) { if (!elementId) return; updateElement(elementId, { content: { type: 'ordered-list', items: next, markerColor } }) }
  function handleTextChange(id: string, value: string) { patchItems(items.map((it) => it.id === id ? { ...it, text: value } : it)) }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === 'Enter') { e.preventDefault(); const n = { id: crypto.randomUUID(), text: '' }; const next = [...items]; next.splice(index + 1, 0, n); patchItems(next); setTimeout(() => setEditingId(n.id), 0) }
    else if (e.key === 'Backspace' && items[index].text === '' && items.length > 1) { e.preventDefault(); const next = items.filter((_, i) => i !== index); patchItems(next); setEditingId(next[Math.max(0, index - 1)].id) }
  }

  const displayItems = items.length === 0 ? [{ id: '__ph__', text: '' }] : items

  function renderText(item: ListItem, index: number) {
    return editingId === item.id && elementId
      ? <input autoFocus value={item.text} onChange={(e) => handleTextChange(item.id, e.target.value)} onKeyDown={(e) => handleKeyDown(e, index)} onBlur={() => setEditingId(null)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit', lineHeight: 1.6, padding: 0 }} />
      : <span onDoubleClick={() => elementId && setEditingId(item.id)} style={{ flex: 1, fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', cursor: elementId ? 'text' : 'default', minHeight: '1.4em' }}>{item.text || (elementId ? <em style={{ opacity: 0.4 }}>Double-click to edit</em> : 'List item')}</span>
  }

  if (framework === 'bootstrap') {
    return (
      <ol className="list-group list-group-flush" style={{ counterReset: 'list-counter', ...style }}>
        {displayItems.map((item, idx) => (
          <li key={item.id} className="list-group-item d-flex align-items-center gap-2 px-0" style={{ backgroundColor: 'transparent' }}>
            <span className="fw-semibold flex-shrink-0" style={{ color: markerColor, minWidth: 20 }}>{idx + 1}.</span>
            {renderText(item, idx)}
          </li>
        ))}
      </ol>
    )
  }

  if (framework === 'tailwind') {
    return (
      <ol className="space-y-2 m-0 p-0 list-none" style={style}>
        {displayItems.map((item, idx) => (
          <li key={item.id} className="flex items-center gap-3">
            <span className="font-semibold flex-shrink-0 text-sm" style={{ color: markerColor, minWidth: 20 }}>{idx + 1}.</span>
            {renderText(item, idx)}
          </li>
        ))}
      </ol>
    )
  }

  return (
    <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {displayItems.map((item, idx) => (
        <li key={item.id} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontWeight: 700, color: markerColor, flexShrink: 0, minWidth: 22, fontSize: '0.875rem' }}>{idx + 1}.</span>
          {renderText(item, idx)}
        </li>
      ))}
    </ol>
  )
})

export default OrderedListElement
