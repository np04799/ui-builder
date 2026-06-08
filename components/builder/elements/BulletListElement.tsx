'use client'

import { memo, useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import { useFramework } from '@/hooks/useFramework'

interface ListItem { id: string; text: string }
interface Props { elementId?: string; items: ListItem[]; markerColor?: string; style?: React.CSSProperties }

const BulletListElement = memo(function BulletListElement({ elementId, items, markerColor = 'currentColor', style }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const framework = useFramework()
  const [editingId, setEditingId] = useState<string | null>(null)

  function patchItems(next: ListItem[]) { if (!elementId) return; updateElement(elementId, { content: { type: 'list', items: next, markerColor } }) }
  function handleTextChange(id: string, value: string) { patchItems(items.map((it) => it.id === id ? { ...it, text: value } : it)) }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === 'Enter') { e.preventDefault(); const n = { id: crypto.randomUUID(), text: '' }; const next = [...items]; next.splice(index + 1, 0, n); patchItems(next); setTimeout(() => setEditingId(n.id), 0) }
    else if (e.key === 'Backspace' && items[index].text === '' && items.length > 1) { e.preventDefault(); const next = items.filter((_, i) => i !== index); patchItems(next); setEditingId(next[Math.max(0, index - 1)].id) }
  }

  const displayItems = items.length === 0 ? [{ id: '__ph__', text: '' }] : items

  function renderItem(item: ListItem, index: number) {
    const isEditing = editingId === item.id && !!elementId
    const textEl = isEditing
      ? <input autoFocus value={item.text} onChange={(e) => handleTextChange(item.id, e.target.value)} onKeyDown={(e) => handleKeyDown(e, index)} onBlur={() => setEditingId(null)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit', lineHeight: 1.6, padding: 0 }} />
      : <span onDoubleClick={() => elementId && setEditingId(item.id)} style={{ flex: 1, fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', cursor: elementId ? 'text' : 'default', minHeight: '1.4em' }}>{item.text || (elementId ? <em style={{ opacity: 0.4 }}>Double-click to edit</em> : 'List item')}</span>
    return textEl
  }

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    return (
      <ul className="list-group list-group-flush" style={style}>
        {displayItems.map((item, idx) => (
          <li key={item.id} className="list-group-item d-flex align-items-center gap-2 px-0" style={{ backgroundColor: 'transparent' }}>
            <span className="rounded-circle flex-shrink-0" style={{ width: 7, height: 7, backgroundColor: markerColor, display: 'inline-block' }} />
            {renderItem(item, idx)}
          </li>
        ))}
      </ul>
    )
  }

  // ── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    return (
      <ul className="space-y-2 m-0 p-0 list-none" style={style}>
        {displayItems.map((item, idx) => (
          <li key={item.id} className="flex items-center gap-3">
            <span className="rounded-full flex-shrink-0" style={{ width: 7, height: 7, backgroundColor: markerColor, display: 'inline-block' }} />
            {renderItem(item, idx)}
          </li>
        ))}
      </ul>
    )
  }

  // ── Custom / MUI ───────────────────────────────────────────────────────────
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {displayItems.map((item, idx) => (
        <li key={item.id} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: markerColor, flexShrink: 0, alignSelf: 'center' }} />
          {renderItem(item, idx)}
        </li>
      ))}
    </ul>
  )
})

export default BulletListElement
