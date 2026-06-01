'use client'

import { memo, useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import { useFramework } from '@/hooks/useFramework'

interface ListItem { id: string; text: string }

interface Props {
  elementId?: string
  items: ListItem[]
  markerColor?: string
  style?: React.CSSProperties
}

const BulletListElement = memo(function BulletListElement({ elementId, items, markerColor = 'currentColor', style }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const [editingId, setEditingId] = useState<string | null>(null)
  const framework = useFramework()

  function patchItems(next: ListItem[]) {
    if (!elementId) return
    updateElement(elementId, { content: { type: 'list', items: next, markerColor } })
  }

  function handleTextChange(id: string, value: string) {
    patchItems(items.map((it) => it.id === id ? { ...it, text: value } : it))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newItem = { id: crypto.randomUUID(), text: '' }
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

  const bsClass = framework === 'bootstrap' ? 'list-unstyled mb-0' : undefined
  const twClass = framework === 'tailwind' ? 'list-none m-0 p-0 flex flex-col gap-1.5' : undefined

  return (
    <ul
      className={bsClass ?? twClass}
      style={framework === 'bootstrap' || framework === 'tailwind' ? style : {
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        ...style,
      }}
    >
      {(items.length === 0 ? [{ id: '__placeholder__', text: '' }] : items).map((item, index) => (
        <li
          key={item.id}
          style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: markerColor,
              flexShrink: 0,
              marginTop: 2,
              alignSelf: 'center',
            }}
          />
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
              className={framework === 'tailwind' ? 'text-base text-gray-600 leading-relaxed flex-1' : undefined}
              style={{
                flex: 1,
                fontSize: '1rem',
                lineHeight: 1.6,
                color: framework === 'bootstrap' ? undefined : 'var(--color-text-secondary)',
                cursor: elementId ? 'text' : 'default',
                minHeight: '1.4em',
              }}
            >
              {item.text || (elementId ? <em style={{ opacity: 0.4 }}>Double-click to edit</em> : 'List item')}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
})

export default BulletListElement
