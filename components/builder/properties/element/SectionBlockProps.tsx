'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import NumberInput from '@/components/builder/controls/NumberInput'

interface Props { element: ElementNode }

export default function SectionBlockProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'section-block') return null
  const { content } = element

  function patch(p: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...p } })
  }

  return (
    <>
      <PropGroup label="Preset">
        <PropRow label="Style">
          <SelectInput value={content.preset ?? 'plain'} options={[
            { label: 'Plain', value: 'plain' },
            { label: 'Card', value: 'card' },
            { label: 'Hero (gradient)', value: 'hero' },
            { label: 'Feature', value: 'feature' },
            { label: 'CTA (dark)', value: 'cta' },
          ]} onChange={(v) => patch({ preset: v as typeof content.preset })} />
        </PropRow>
        <PropRow label="HTML tag">
          <SelectInput value={content.tag ?? 'section'} options={[
            { label: '<section>', value: 'section' },
            { label: '<article>', value: 'article' },
            { label: '<aside>', value: 'aside' },
            { label: '<main>', value: 'main' },
            { label: '<header>', value: 'header' },
            { label: '<footer>', value: 'footer' },
            { label: '<div>', value: 'div' },
          ]} onChange={(v) => patch({ tag: v as typeof content.tag })} />
        </PropRow>
      </PropGroup>

      <PropGroup label="Content">
        <PropRow label="Heading" stack><TextInput value={content.heading ?? ''} onChange={(v) => patch({ heading: v })} placeholder="Section heading" /></PropRow>
        <PropRow label="Subtitle" stack><TextInput value={content.subtitle ?? ''} onChange={(v) => patch({ subtitle: v })} placeholder="Optional subtitle" /></PropRow>
        <PropRow label="Body" stack><TextInput value={content.content ?? ''} onChange={(v) => patch({ content: v })} placeholder="Section content" /></PropRow>
        <PropRow label="Align">
          <SelectInput value={content.align ?? 'left'} options={[
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ]} onChange={(v) => patch({ align: v as typeof content.align })} />
        </PropRow>
      </PropGroup>

      <PropGroup label="Layout">
        <PropRow label="Max width" stack>
          <SelectInput value={content.maxWidth ?? '1200px'} options={[
            { label: 'Full width', value: '100%' },
            { label: 'Narrow (640px)', value: '640px' },
            { label: 'Medium (960px)', value: '960px' },
            { label: 'Wide (1200px)', value: '1200px' },
            { label: 'Extra wide (1440px)', value: '1440px' },
          ]} onChange={(v) => patch({ maxWidth: v })} />
        </PropRow>
        <PropRow label="Padding Y"><NumberInput value={String(content.paddingY ?? 32)} onChange={(v) => patch({ paddingY: parseInt(v) || 0 })} min={0} max={200} /></PropRow>
        <PropRow label="Padding X"><NumberInput value={String(content.paddingX ?? 24)} onChange={(v) => patch({ paddingX: parseInt(v) || 0 })} min={0} max={200} /></PropRow>
      </PropGroup>

      <PropGroup label="Style overrides">
        <PropRow label="Background"><ColorSwatch value={content.bg ?? ''} onChange={(v) => patch({ bg: v })} /></PropRow>
        <PropRow label="Text colour"><ColorSwatch value={content.textColor ?? ''} onChange={(v) => patch({ textColor: v })} /></PropRow>
        <PropRow label="Show border">
          <SelectInput value={content.showBorder ? 'true' : 'false'} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} onChange={(v) => patch({ showBorder: v === 'true' })} />
        </PropRow>
      </PropGroup>
    </>
  )
}
