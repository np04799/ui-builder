'use client'

import type { ElementNode } from '@/types/store.types'
import type { VideoProvider } from '@/types/builder.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import NumberInput from '@/components/builder/controls/NumberInput'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

const PROVIDER_OPTIONS = [
  { label: 'YouTube', value: 'youtube' },
  { label: 'Vimeo', value: 'vimeo' },
]

interface Props { element: ElementNode }

export default function VideoProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'video') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  return (
    <>
      <PropGroup label="Video">
        <PropRow label="Provider">
          <SelectInput
            value={content.provider ?? 'youtube'}
            options={PROVIDER_OPTIONS}
            onChange={(v) => patchContent({ provider: v as VideoProvider })}
          />
        </PropRow>
        <PropRow label="URL" stack>
          <TextInput
            value={content.src ?? ''}
            onChange={(v) => patchContent({ src: v })}
            placeholder="https://youtube.com/watch?v=..."
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Display">
        <PropRow label="Radius">
          <NumberInput
            value={styles.borderRadius ?? '8px'}
            onChange={(v) => patchStyle('borderRadius', v)}
            placeholder="8"
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
        knownKeys={['borderRadius', 'margin']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
