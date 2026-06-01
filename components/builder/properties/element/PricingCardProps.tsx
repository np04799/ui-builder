'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'

interface Props { element: ElementNode }

export default function PricingCardProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'pricing-card') return null
  const { content } = element
  function patch(p: Partial<typeof content>) { updateElement(element.id, { content: { ...content, ...p } }) }

  return (
    <>
      <PropGroup label="Preset">
        <PropRow label="Style">
          <SelectInput value={content.preset ?? 'simple'} options={[{ label: 'Simple', value: 'simple' }, { label: 'Featured (highlighted)', value: 'featured' }, { label: 'Minimal', value: 'minimal' }, { label: 'Bordered', value: 'bordered' }]} onChange={(v) => patch({ preset: v as typeof content.preset })} />
        </PropRow>
        <PropRow label="Highlighted">
          <SelectInput value={content.highlighted ? 'true' : 'false'} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} onChange={(v) => patch({ highlighted: v === 'true' })} />
        </PropRow>
      </PropGroup>
      <PropGroup label="Content">
        <PropRow label="Plan name" stack><TextInput value={content.planName ?? ''} onChange={(v) => patch({ planName: v })} placeholder="Pro" /></PropRow>
        <PropRow label="Price" stack><TextInput value={content.price ?? ''} onChange={(v) => patch({ price: v })} placeholder="$29" /></PropRow>
        <PropRow label="Period" stack><TextInput value={content.period ?? ''} onChange={(v) => patch({ period: v })} placeholder="/month" /></PropRow>
        <PropRow label="Description" stack><TextInput value={content.description ?? ''} onChange={(v) => patch({ description: v })} placeholder="Plan description" /></PropRow>
        <PropRow label="Badge" stack><TextInput value={content.badge ?? ''} onChange={(v) => patch({ badge: v })} placeholder="Most Popular (or blank)" /></PropRow>
      </PropGroup>
      <PropGroup label="CTA Button">
        <PropRow label="Text" stack><TextInput value={content.ctaText ?? ''} onChange={(v) => patch({ ctaText: v })} placeholder="Get started" /></PropRow>
        <PropRow label="Link" stack><TextInput value={content.ctaHref ?? ''} onChange={(v) => patch({ ctaHref: v })} placeholder="#" /></PropRow>
        <PropRow label="Style">
          <SelectInput value={content.ctaVariant ?? 'primary'} options={[{ label: 'Primary', value: 'primary' }, { label: 'Outline', value: 'outline' }, { label: 'Secondary', value: 'secondary' }]} onChange={(v) => patch({ ctaVariant: v as typeof content.ctaVariant })} />
        </PropRow>
      </PropGroup>
    </>
  )
}
