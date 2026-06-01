'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'

interface Props { element: ElementNode }

export default function BreadcrumbProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'breadcrumb') return null
  const { content } = element
  function patch(p: Partial<typeof content>) { updateElement(element.id, { content: { ...content, ...p } }) }

  return (
    <>
      <PropGroup label="Settings">
        <PropRow label="Separator" stack>
          <TextInput value={content.separator ?? '/'} onChange={(v) => patch({ separator: v })} placeholder="/" />
        </PropRow>
      </PropGroup>
      <PropGroup label="Items">
        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          {content.items?.length ?? 0} breadcrumb items. Edit labels below.
        </p>
        {content.items?.map((item, idx) => (
          <PropRow key={item.id} label={`Item ${idx + 1}`}>
            <TextInput value={item.label} onChange={(v) => {
              const next = content.items?.map((it) => it.id === item.id ? { ...it, label: v } : it) ?? []
              patch({ items: next })
            }} placeholder="Label" />
          </PropRow>
        ))}
      </PropGroup>
    </>
  )
}
