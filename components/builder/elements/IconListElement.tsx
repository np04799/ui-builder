'use client'

import { memo, useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import { useFramework } from '@/hooks/useFramework'

interface ListItem { id: string; text: string }
interface Props { elementId?: string; items: ListItem[]; iconColor?: string; style?: React.CSSProperties }

function Arrow({ color }: { color: string }) {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h10M8 3l4 4-4 4" /></svg>
}

const IconListElement = memo(function IconListElement({ elementId, items, iconColor = 'var(--color-primary)', style }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const framework = useFramework()
  const [editingId, setEditingId] = useState<string | null>(null)

  function patchItems(next: ListItem[]) { if (!elementId) return; updateElement(elementId, { content: { type: 'icon-list', items: next, iconColor } }) }
  function handleTextChange(id: string, value: string) { patchItems(items.map((it) => it.id === id ? { ...it, text: value } : it)) }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === 'Enter') { e.preventDefault(); const n = { id: crypto.randomUUID(), text: '' }; const next = [...items]; next.splice(index + 1, 0, n); patchItems(next); setTimeout(() => setEditingId(n.id), 0) }
    else if (e.key === 'Backspace' && items[index].text === '' && items.length > 1) { e.preventDefault(); const next = items.filter((_, i) => i !== index); patchItems(next); setEditingId(next[Math.max(0, index - 1)].id) }
  }

  const displayItems = items.length === 0 ? [{ id: '__ph__', text: '' }] : items

  function renderText(item: ListItem, index: number) {
    return editingId === item.id && elementId
      ? <input autoFocus value={item.text} onChange={(e) => handleTextChange(item.id, e.target.value)} onKeyDown={(e) => handleKeyDown(e, index)} onBlur={() => setEditingId(null)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit', lineHeight: 1.6, padding: 0 }} />
      : <span onDoubleClick={() => elementId && setEditingId(item.id)} style={{ flex: 1, fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', cursor: elementId ? 'text' : 'default' }}>{item.text || (elementId ? <em style={{ opacity: 0.4 }}>Double-click to edit</em> : 'Feature item')}</span>
  }

  if (framework === 'bootstrap') {
    return (
      <ul className="list-group list-group-flush" style={style}>
        {displayItems.map((item, idx) => (
          <li key={item.id} className="list-group-item d-flex align-items-center gap-2 px-0" style={{ backgroundColor: 'transparent' }}>
            <Arrow color={iconColor} />
            {renderText(item, idx)}
          </li>
        ))}
      </ul>
    )
  }

  if (framework === 'tailwind') {
    return (
      <ul className="space-y-2 m-0 p-0 list-none" style={style}>
        {displayItems.map((item, idx) => (
          <li key={item.id} className="flex items-center gap-3">
            <Arrow color={iconColor} />
            {renderText(item, idx)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {displayItems.map((item, idx) => (
        <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Arrow color={iconColor} />
          {renderText(item, idx)}
        </li>
      ))}
    </ul>
  )
})

export default IconListElement
