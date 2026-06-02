'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'

interface Props { element: ElementNode }

/**
 * Common metadata controls shared by every element:
 * - Display name (shown in Layers panel)
 * - HTML id attribute
 * - Extra CSS class names
 */
export default function CommonElementMeta({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  return (
    <PropGroup label="Element meta">
      <PropRow label="Name" stack>
        <TextInput
          value={element.name ?? ''}
          onChange={(v) => updateElement(element.id, { name: v || undefined })}
          placeholder="Shown in Layers panel"
        />
      </PropRow>
      <PropRow label="HTML id" stack>
        <TextInput
          value={element.htmlId ?? ''}
          onChange={(v) => updateElement(element.id, { htmlId: v || undefined })}
          placeholder="my-element-id"
        />
      </PropRow>
      <PropRow label="CSS class(es)" stack>
        <TextInput
          value={element.classNames ?? ''}
          onChange={(v) => updateElement(element.id, { classNames: v || undefined })}
          placeholder="my-class another-class"
        />
      </PropRow>
      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', margin: '4px 0 0', lineHeight: 1.5 }}>
        Custom id and classes are added to the rendered HTML and stay through framework switches and exports.
      </p>
    </PropGroup>
  )
}
