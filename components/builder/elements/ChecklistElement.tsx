'use client'

import { memo, useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import { useFramework } from '@/hooks/useFramework'

interface CheckItem { id: string; text: string; checked?: boolean }
interface Props { elementId?: string; items: CheckItem[]; checkedColor?: string; style?: React.CSSProperties }

const ChecklistElement = memo(function ChecklistElement({ elementId, items, checkedColor = '#10b981', style }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const framework = useFramework()
  const [editingId, setEditingId] = useState<string | null>(null)

  function patchItems(next: CheckItem[]) { if (!elementId) return; updateElement(elementId, { content: { type: 'checklist', items: next, checkedColor } }) }
  function toggleCheck(id: string) { patchItems(items.map((it) => it.id === id ? { ...it, checked: !it.checked } : it)) }
  function handleTextChange(id: string, value: string) { patchItems(items.map((it) => it.id === id ? { ...it, text: value } : it)) }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === 'Enter') { e.preventDefault(); const n = { id: crypto.randomUUID(), text: '', checked: false }; const next = [...items]; next.splice(index + 1, 0, n); patchItems(next); setTimeout(() => setEditingId(n.id), 0) }
    else if (e.key === 'Backspace' && items[index].text === '' && items.length > 1) { e.preventDefault(); const next = items.filter((_, i) => i !== index); patchItems(next); setEditingId(next[Math.max(0, index - 1)].id) }
  }

  const displayItems = items.length === 0 ? [{ id: '__ph__', text: '', checked: false }] : items

  function renderItem(item: CheckItem, idx: number) {
    const isEditing = editingId === item.id && !!elementId
    return (
      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div onClick={() => elementId && toggleCheck(item.id)} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${item.checked ? checkedColor : 'var(--color-border)'}`, backgroundColor: item.checked ? checkedColor : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: elementId ? 'pointer' : 'default', flexShrink: 0, transition: 'all 150ms' }}>
          {item.checked && <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5.5l2.5 2.5 4.5-4.5" /></svg>}
        </div>
        {isEditing
          ? <input autoFocus value={item.text} onChange={(e) => handleTextChange(item.id, e.target.value)} onKeyDown={(e) => handleKeyDown(e, idx)} onBlur={() => setEditingId(null)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit', lineHeight: 1.6, padding: 0 }} />
          : <span onDoubleClick={() => elementId && setEditingId(item.id)} style={{ flex: 1, fontSize: '1rem', lineHeight: 1.6, color: item.checked ? 'var(--color-text-secondary)' : 'var(--color-text-primary)', textDecoration: item.checked ? 'line-through' : 'none', opacity: item.checked ? 0.6 : 1, cursor: elementId ? 'text' : 'default' }}>{item.text || (elementId ? <em style={{ opacity: 0.4 }}>Double-click to edit</em> : 'Task item')}</span>
        }
      </div>
    )
  }

  if (framework === 'bootstrap') {
    return (
      <ul className="list-group list-group-flush" style={style}>
        {displayItems.map((item, idx) => (
          <li key={item.id} className="list-group-item d-flex align-items-center gap-2 px-0" style={{ backgroundColor: 'transparent' }}>
            <input type="checkbox" className="form-check-input flex-shrink-0 mt-0" checked={!!item.checked} onChange={() => elementId && toggleCheck(item.id)} style={{ accentColor: checkedColor }} readOnly={!elementId} />
            <span style={{ textDecoration: item.checked ? 'line-through' : 'none', opacity: item.checked ? 0.6 : 1 }}>{item.text || 'Task item'}</span>
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
            <input type="checkbox" checked={!!item.checked} onChange={() => elementId && toggleCheck(item.id)} className="rounded flex-shrink-0" style={{ accentColor: checkedColor }} readOnly={!elementId} />
            <span className={`text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.text || 'Task item'}</span>
          </li>
        ))}
      </ul>
    )
  }

  return <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>{displayItems.map((item, idx) => renderItem(item, idx))}</div>
})

export default ChecklistElement
