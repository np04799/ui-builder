'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import SelectInput from '@/components/builder/controls/SelectInput'
import NumberInput from '@/components/builder/controls/NumberInput'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

const STYLE_OPTIONS = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
]

interface Props { element: ElementNode }

export default function DividerProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'divider') return null
  const { styles } = element

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  return (
    <>
      <PropGroup label="Appearance">
        <PropRow label="Color">
          <ColorSwatch
            value={styles.borderTopColor ?? styles.color ?? ''}
            onChange={(v) => patchStyle('borderTopColor', v)}
          />
        </PropRow>
        <PropRow label="Thickness">
          <NumberInput
            value={styles.borderTopWidth ?? '1px'}
            onChange={(v) => patchStyle('borderTopWidth', v)}
            placeholder="1"
          />
        </PropRow>
        <PropRow label="Style">
          <SelectInput
            value={styles.borderTopStyle ?? 'solid'}
            options={STYLE_OPTIONS}
            onChange={(v) => patchStyle('borderTopStyle', v)}
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
      </PropGroup>

      <PropGroup label="Spacing">
        <PropRow label="Margin" stack>
          <SpacingControl
            value={styles.margin ?? '8px 0px'}
            onChange={(v) => patchStyle('margin', v)}
          />
        </PropRow>
      </PropGroup>

      <CustomCSSField
        styles={styles}
        knownKeys={['borderTopColor', 'color', 'borderTopWidth', 'borderTopStyle', 'width', 'margin']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
