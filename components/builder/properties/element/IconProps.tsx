'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import SelectInput from '@/components/builder/controls/SelectInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import NumberInput from '@/components/builder/controls/NumberInput'
import AlignButtonGroup from '@/components/builder/controls/AlignButtonGroup'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

const ICON_OPTIONS = [
  { label: 'Star', value: 'star' },
  { label: 'Heart', value: 'heart' },
  { label: 'Check', value: 'check' },
  { label: 'Arrow', value: 'arrow' },
  { label: 'Mail', value: 'mail' },
  { label: 'Phone', value: 'phone' },
]

interface Props { element: ElementNode }

export default function IconProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'icon') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  return (
    <>
      <PropGroup label="Icon">
        <PropRow label="Type">
          <SelectInput
            value={content.name ?? 'star'}
            options={ICON_OPTIONS}
            onChange={(v) => patchContent({ name: v })}
          />
        </PropRow>
        <PropRow label="Size">
          <NumberInput
            value={content.size ?? '24px'}
            onChange={(v) => patchContent({ size: v })}
            placeholder="24"
          />
        </PropRow>
        <PropRow label="Color">
          <ColorSwatch
            value={content.color === 'currentColor' ? '' : (content.color ?? '')}
            onChange={(v) => patchContent({ color: v || 'currentColor' })}
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Layout">
        <PropRow label="Align">
          <AlignButtonGroup
            value={styles.textAlign ?? 'left'}
            onChange={(v) => patchStyle('textAlign', v)}
            options={[
              { value: 'left', title: 'Left', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h10M2 6h7M2 9h10M2 12h5" /></svg> },
              { value: 'center', title: 'Center', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h10M4 6h6M2 9h10M4 12h6" /></svg> },
              { value: 'right', title: 'Right', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h10M5 6h7M2 9h10M7 12h5" /></svg> },
            ]}
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
        knownKeys={['textAlign', 'margin']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
