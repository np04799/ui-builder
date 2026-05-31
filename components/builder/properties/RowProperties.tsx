'use client'

import { useRow } from '@/hooks/useBuilderSelectors'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import SelectInput from '@/components/builder/controls/SelectInput'
import NumberInput from '@/components/builder/controls/NumberInput'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import ResponsiveVisibility from '@/components/builder/controls/ResponsiveVisibility'
import type { ResponsiveStyles } from '@/types/builder.types'

interface Props {
  id: string
}

const ALIGN_OPTIONS = [
  { label: 'Top', value: 'flex-start' },
  { label: 'Middle', value: 'center' },
  { label: 'Bottom', value: 'flex-end' },
  { label: 'Stretch', value: 'stretch' },
]

const JUSTIFY_OPTIONS = [
  { label: 'Start', value: 'flex-start' },
  { label: 'Center', value: 'center' },
  { label: 'End', value: 'flex-end' },
  { label: 'Space between', value: 'space-between' },
]

export default function RowProperties({ id }: Props) {
  const row = useRow(id)
  const updateRow = useBuilderStore((s) => s.updateRow)

  if (!row) return null

  const styles = row.styles as Record<string, string>

  function patchStyle(key: string, value: string) {
    updateRow(id, { styles: { [key]: value } })
  }

  return (
    <>
      <PropGroup label="Layout">
        <PropRow label="Align">
          <SelectInput
            value={styles.alignItems ?? 'flex-start'}
            options={ALIGN_OPTIONS}
            onChange={(v) => patchStyle('alignItems', v)}
          />
        </PropRow>
        <PropRow label="Justify">
          <SelectInput
            value={styles.justifyContent ?? 'flex-start'}
            options={JUSTIFY_OPTIONS}
            onChange={(v) => patchStyle('justifyContent', v)}
          />
        </PropRow>
        <PropRow label="Column gap">
          <NumberInput
            value={styles.gap ?? '0px'}
            onChange={(v) => patchStyle('gap', v)}
            placeholder="0"
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Background">
        <PropRow label="Color">
          <ColorSwatch
            value={styles.backgroundColor ?? ''}
            onChange={(v) => patchStyle('backgroundColor', v)}
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Spacing">
        <PropRow label="Padding" stack>
          <SpacingControl
            value={styles.padding ?? '0px'}
            onChange={(v) => patchStyle('padding', v)}
          />
        </PropRow>
      </PropGroup>

      <ResponsiveVisibility
        responsive={row.responsive ?? {}}
        onUpdate={(r: ResponsiveStyles) => updateRow(id, { responsive: r })}
      />
    </>
  )
}
