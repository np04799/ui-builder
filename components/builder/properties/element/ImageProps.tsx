'use client'

import type { ElementNode } from '@/types/store.types'
import type { ObjectFit } from '@/types/builder.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import NumberInput from '@/components/builder/controls/NumberInput'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'
import ImageUpload from '@/components/builder/controls/ImageUpload'

const FIT_OPTIONS: { label: string; value: ObjectFit }[] = [
  { label: 'Cover', value: 'cover' },
  { label: 'Contain', value: 'contain' },
  { label: 'Fill', value: 'fill' },
]

const POSITION_OPTIONS = [
  { label: 'Center', value: 'center' },
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
]

interface Props {
  element: ElementNode
}

export default function ImageProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'image') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  return (
    <>
      <PropGroup label="Source">
        <div style={{ padding: '4px 0' }}>
          <ImageUpload
            src={content.src}
            onChange={(url) => patchContent({ src: url })}
          />
        </div>
        <PropRow label="Alt text" stack>
          <TextInput
            value={content.alt}
            onChange={(v) => patchContent({ alt: v })}
            placeholder="Describe the image…"
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Display">
        <PropRow label="Fit">
          <SelectInput
            value={content.objectFit}
            options={FIT_OPTIONS}
            onChange={(v) => patchContent({ objectFit: v as ObjectFit })}
          />
        </PropRow>
        <PropRow label="Position">
          <SelectInput
            value={styles.objectPosition ?? 'center'}
            options={POSITION_OPTIONS}
            onChange={(v) => patchStyle('objectPosition', v)}
          />
        </PropRow>
        <PropRow label="Width">
          <NumberInput
            value={styles.width ?? ''}
            onChange={(v) => patchStyle('width', v)}
            unit="%"
            max={100}
            placeholder="100"
          />
        </PropRow>
        <PropRow label="Height">
          <NumberInput
            value={styles.height ?? ''}
            onChange={(v) => patchStyle('height', v)}
            placeholder="auto"
          />
        </PropRow>
        <PropRow label="Radius">
          <NumberInput
            value={styles.borderRadius ?? ''}
            onChange={(v) => patchStyle('borderRadius', v)}
            placeholder="0"
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Spacing">
        <PropRow label="Margin" stack>
          <SpacingControl
            value={styles.margin ?? '0px'}
            onChange={(v) => patchStyle('margin', v)}
          />
        </PropRow>
      </PropGroup>

      <CustomCSSField
        styles={styles}
        knownKeys={['objectPosition', 'width', 'height', 'borderRadius', 'margin']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
