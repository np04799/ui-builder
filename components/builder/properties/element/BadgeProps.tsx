'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'

interface Props { element: ElementNode }

export default function BadgeProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'badge') return null
  const { content } = element
  function patch(p: Partial<typeof content>) { updateElement(element.id, { content: { ...content, ...p } }) }

  return (
    <>
      <PropGroup label="Badge">
        <PropRow label="Text" stack><TextInput value={content.text ?? 'Badge'} onChange={(v) => patch({ text: v })} placeholder="Badge label" /></PropRow>
        <PropRow label="Variant">
          <SelectInput value={content.variant ?? 'primary'} options={['primary','secondary','success','danger','warning','info','light','dark'].map((v) => ({ label: v.charAt(0).toUpperCase() + v.slice(1), value: v }))} onChange={(v) => patch({ variant: v as typeof content.variant })} />
        </PropRow>
        <PropRow label="Size">
          <SelectInput value={content.size ?? 'md'} options={[{ label: 'Small', value: 'sm' }, { label: 'Medium', value: 'md' }, { label: 'Large', value: 'lg' }]} onChange={(v) => patch({ size: v as 'sm' | 'md' | 'lg' })} />
        </PropRow>
        <PropRow label="Pill shape">
          <SelectInput value={content.pill ? 'true' : 'false'} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} onChange={(v) => patch({ pill: v === 'true' })} />
        </PropRow>
      </PropGroup>
    </>
  )
}
