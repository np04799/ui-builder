'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import NumberInput from '@/components/builder/controls/NumberInput'

interface Props { element: ElementNode }

export default function ProgressProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'progress') return null
  const { content } = element
  function patch(p: Partial<typeof content>) { updateElement(element.id, { content: { ...content, ...p } }) }

  return (
    <>
      <PropGroup label="Values">
        <PropRow label="Label" stack><TextInput value={content.label ?? ''} onChange={(v) => patch({ label: v })} placeholder="Progress label" /></PropRow>
        <PropRow label="Value"><NumberInput value={String(content.value ?? 65)} onChange={(v) => patch({ value: parseInt(v) || 0 })} min={0} max={content.max ?? 100} /></PropRow>
        <PropRow label="Max"><NumberInput value={String(content.max ?? 100)} onChange={(v) => patch({ max: parseInt(v) || 100 })} min={1} max={9999} /></PropRow>
        <PropRow label="Show label">
          <SelectInput value={content.showLabel ? 'true' : 'false'} options={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]} onChange={(v) => patch({ showLabel: v === 'true' })} />
        </PropRow>
      </PropGroup>
      <PropGroup label="Style">
        <PropRow label="Variant">
          <SelectInput value={content.variant ?? 'primary'} options={['primary','success','danger','warning','info'].map((v) => ({ label: v.charAt(0).toUpperCase() + v.slice(1), value: v }))} onChange={(v) => patch({ variant: v as typeof content.variant })} />
        </PropRow>
        <PropRow label="Height (px)"><NumberInput value={String(content.height ?? 10)} onChange={(v) => patch({ height: parseInt(v) || 10 })} min={4} max={40} /></PropRow>
        <PropRow label="Striped">
          <SelectInput value={content.striped ? 'true' : 'false'} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} onChange={(v) => patch({ striped: v === 'true' })} />
        </PropRow>
        <PropRow label="Animated">
          <SelectInput value={content.animated ? 'true' : 'false'} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} onChange={(v) => patch({ animated: v === 'true' })} />
        </PropRow>
      </PropGroup>
    </>
  )
}
