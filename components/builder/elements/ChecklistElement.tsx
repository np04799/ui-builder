'use client'

import { memo, useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import { useFramework } from '@/hooks/useFramework'

interface CheckItem { id: string; text: string; checked?: boolean }

interface Props {
  elementId?: string
  items: CheckItem[]
  checkedColor?: string
  style?: React.CSSProperties
}

const ChecklistElement = memo(function ChecklistElement({ elementId, items, checkedColor = '#10b981', style }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const [editingId, setEditingId] = useState<string | null>(null)
  const framework = useFramework()

  function patchItems(next: CheckItem[]) {
    if (!elementId) return
    updateElement(elementId, { content: { type: 'checklist', items: next, checkedColor } })
  }

  function toggleChecked(id: string) {
    patchItems(items.map((it) => it.id === id ? { ...it, checked: !it.checked } : it))
  }

  function handleTextChange(id: string, value: string) {
    patchItems(items.map((it) => it.id === id ? { ...it, text: value } : it))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newItem = { id: crypto.randomUUID(), text: '', checked: false }
      const next = [...items]
      next.splice(index + 1, 0, newItem)
      patchItems(next)
      setTimeout(() => setEditingId(newItem.id), 0)
    } else if (e.key === 'Backspace' && items[index].text === '' && items.length > 1) {
      e.preventDefault()
      const next = items.filter((_, i) => i !== index)
      patchItems(next)
      setEditingId(next[Math.max(0, index - 1)].id)
    }
  }

  const displayItems = items.length === 0 ? [{ id: '__placeholder__', text: '', checked: false }] : items

  return (
    <ul
      className={framework === 'bootstrap' ? 'list-unstyled mb-0' : framework === 'tailwind' ? 'list-none m-0 p-0 flex flex-col gap-2' : undefined}
      style={framework === 'bootstrap' || framework === 'tailwind' ? style : {
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        ...style,
      }}
    >
      {displayItems.map((item, index) => (
        <li
          key={item.id}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          {/* Checkbox */}
          <button
            onClick={() => elementId && toggleChecked(item.id)}
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              border: `2px solid ${item.checked ? checkedColor : 'var(--color-border)'}`,
              backgroundColor: item.checked ? checkedColor : 'transparent',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: elementId ? 'pointer' : 'default',
              padding: 0,
              transition: 'all 150ms ease',
            }}
            tabIndex={-1}
          >
            {item.checked && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1.5 5l2.5 2.5 4.5-5" />
              </svg>
            )}
          </button>

          {editingId === item.id && elementId ? (
            <input
              autoFocus
              value={item.text}
              onChange={(e) => handleTextChange(item.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onBlur={() => setEditingId(null)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                color: 'inherit',
                lineHeight: 1.6,
                padding: 0,
              }}
            />
          ) : (
            <span
              onDoubleClick={() => elementId && setEditingId(item.id)}
              className={framework === 'tailwind' ? `text-base leading-relaxed flex-1 transition-all ${item.checked ? 'line-through text-gray-400' : 'text-gray-600'}` : undefined}
              style={{
                flex: 1,
                fontSize: '1rem',
                lineHeight: 1.6,
                color: framework === 'bootstrap' ? undefined : 'var(--color-text-secondary)',
                textDecoration: item.checked ? 'line-through' : 'none',
                opacity: item.checked ? 0.5 : 1,
                cursor: elementId ? 'text' : 'default',
                transition: 'opacity 150ms, text-decoration 150ms',
                minHeight: '1.4em',
              }}
            >
              {item.text || (elementId ? <em style={{ opacity: 0.4 }}>Double-click to edit</em> : 'Task item')}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
})

export default ChecklistElement
