'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

const POSITION_OPTIONS = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
]

const TRIGGER_OPTIONS = [
  { label: 'Underline text', value: 'underline' },
  { label: 'Info icon', value: 'icon' },
  { label: 'Button', value: 'button' },
]

interface Props {
  element: ElementNode
}

export default function TooltipProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'tooltip') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  return (
    <>
      <PropGroup label="Tooltip">
        <PropRow label="Label" stack>
          <TextInput
            value={content.label}
            onChange={(v) => patchContent({ label: v })}
            placeholder="Hover me"
          />
        </PropRow>
        <PropRow label="Tip text" stack>
          <TextInput
            value={content.tip}
            onChange={(v) => patchContent({ tip: v })}
            placeholder="Tooltip message"
          />
        </PropRow>
        <PropRow label="Position">
          <SelectInput
            value={content.position ?? 'top'}
            options={POSITION_OPTIONS}
            onChange={(v) => patchContent({ position: v as 'top' | 'bottom' | 'left' | 'right' })}
          />
        </PropRow>
        <PropRow label="Trigger">
          <SelectInput
            value={content.triggerStyle ?? 'underline'}
            options={TRIGGER_OPTIONS}
            onChange={(v) => patchContent({ triggerStyle: v as 'underline' | 'icon' | 'button' })}
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Style">
        <PropRow label="Color">
          <ColorSwatch value={styles.color ?? ''} onChange={(v) => patchStyle('color', v)} />
        </PropRow>
      </PropGroup>

      <CustomCSSField
        styles={styles}
        knownKeys={['color']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
