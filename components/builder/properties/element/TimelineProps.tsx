'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import SelectInput from '@/components/builder/controls/SelectInput'

interface Props { element: ElementNode }

export default function TimelineProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'timeline') return null
  const { content } = element
  function patch(p: Partial<typeof content>) { updateElement(element.id, { content: { ...content, ...p } }) }

  return (
    <>
      <PropGroup label="Layout">
        <PropRow label="Variant">
          <SelectInput value={content.variant ?? 'default'} options={[{ label: 'Default', value: 'default' }, { label: 'Compact', value: 'compact' }, { label: 'Alternating', value: 'alternating' }]} onChange={(v) => patch({ variant: v as typeof content.variant })} />
        </PropRow>
      </PropGroup>
      <PropGroup label="Items">
        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {content.items?.length ?? 0} timeline items. Each item has a title, description, date, and accent color.
        </p>
      </PropGroup>
    </>
  )
}
