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

export default function DivContainerProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'div-container') return null
  const { content } = element

  function patch(p: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...p } })
  }

  return (
    <>
      <PropGroup label="Element">
        <PropRow label="HTML tag">
          <SelectInput value={content.tag ?? 'div'} options={[
            { label: '<div> — block', value: 'div' },
            { label: '<span> — inline', value: 'span' },
            { label: '<article>', value: 'article' },
            { label: '<aside>', value: 'aside' },
            { label: '<nav>', value: 'nav' },
            { label: '<header>', value: 'header' },
            { label: '<footer>', value: 'footer' },
            { label: '<main>', value: 'main' },
          ]} onChange={(v) => patch({ tag: v as typeof content.tag })} />
        </PropRow>
        <PropRow label="Display">
          <SelectInput value={content.display ?? 'block'} options={[
            { label: 'block', value: 'block' },
            { label: 'inline', value: 'inline' },
            { label: 'inline-block', value: 'inline-block' },
            { label: 'flex', value: 'flex' },
            { label: 'inline-flex', value: 'inline-flex' },
            { label: 'grid', value: 'grid' },
          ]} onChange={(v) => patch({ display: v as typeof content.display })} />
        </PropRow>
        <PropRow label="Text" stack><TextInput value={content.text ?? ''} onChange={(v) => patch({ text: v })} placeholder="Optional inline text" /></PropRow>
      </PropGroup>

      <PropGroup label="Style">
        <PropRow label="Background"><ColorSwatch value={content.bg ?? 'transparent'} onChange={(v) => patch({ bg: v })} /></PropRow>
        <PropRow label="Text colour"><ColorSwatch value={content.textColor ?? ''} onChange={(v) => patch({ textColor: v })} /></PropRow>
        <PropRow label="Padding"><NumberInput value={String(content.padding ?? 16)} onChange={(v) => patch({ padding: parseInt(v) || 0 })} min={0} max={200} /></PropRow>
        <PropRow label="Border radius"><NumberInput value={String(content.borderRadius ?? 0)} onChange={(v) => patch({ borderRadius: parseInt(v) || 0 })} min={0} max={50} /></PropRow>
        <PropRow label="Min height"><NumberInput value={String(content.minHeight ?? 0)} onChange={(v) => patch({ minHeight: parseInt(v) || undefined })} min={0} max={1000} /></PropRow>
        <PropRow label="Border">
          <SelectInput value={content.showBorder ? 'true' : 'false'} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} onChange={(v) => patch({ showBorder: v === 'true' })} />
        </PropRow>
        {content.showBorder && (
          <PropRow label="Border colour"><ColorSwatch value={content.borderColor ?? '#e5e7eb'} onChange={(v) => patch({ borderColor: v })} /></PropRow>
        )}
      </PropGroup>
    </>
  )
}
