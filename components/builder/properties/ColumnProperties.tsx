'use client'

import { useColumn } from '@/hooks/useBuilderSelectors'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import SelectInput from '@/components/builder/controls/SelectInput'
import AlignButtonGroup from '@/components/builder/controls/AlignButtonGroup'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import NumberInput from '@/components/builder/controls/NumberInput'
import ResponsiveVisibility from '@/components/builder/controls/ResponsiveVisibility'
import type { ResponsiveStyles } from '@/types/builder.types'

interface Props {
  id: string
}

const SPAN_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1} / 12`,
  value: String(i + 1),
}))

const VALIGN_OPTIONS = [
  { label: 'Top', value: 'flex-start' },
  { label: 'Middle', value: 'center' },
  { label: 'Bottom', value: 'flex-end' },
  { label: 'Stretch', value: 'stretch' },
]

export default function ColumnProperties({ id }: Props) {
  const column = useColumn(id)
  const updateColumn = useBuilderStore((s) => s.updateColumn)

  if (!column) return null

  const styles = column.styles as Record<string, string>

  function patchStyle(key: string, value: string) {
    updateColumn(id, { styles: { [key]: value } })
  }

  function patchSpan(breakpoint: 'desktop' | 'tablet' | 'mobile', value: number) {
    updateColumn(id, { span: { [breakpoint]: value } })
  }

  return (
    <>
      <PropGroup label="Width">
        <PropRow label="Desktop">
          <SelectInput
            value={String(column.span?.desktop ?? 12)}
            options={SPAN_OPTIONS}
            onChange={(v) => patchSpan('desktop', Number(v))}
          />
        </PropRow>
        <PropRow label="Tablet">
          <SelectInput
            value={String(column.span?.tablet ?? 12)}
            options={SPAN_OPTIONS}
            onChange={(v) => patchSpan('tablet', Number(v))}
          />
        </PropRow>
        <PropRow label="Mobile">
          <SelectInput
            value={String(column.span?.mobile ?? 12)}
            options={SPAN_OPTIONS}
            onChange={(v) => patchSpan('mobile', Number(v))}
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Size">
        <PropRow label="Min Height">
          <NumberInput
            value={styles.minHeight ?? ''}
            placeholder="auto"
            min={0}
            onChange={(v) => patchStyle('minHeight', v || '0px')}
          />
        </PropRow>
        <PropRow label="Max Height">
          <NumberInput
            value={styles.maxHeight === 'none' ? '' : (styles.maxHeight ?? '')}
            placeholder="none"
            min={0}
            onChange={(v) => patchStyle('maxHeight', v || 'none')}
          />
        </PropRow>
        <PropRow label="Min Width">
          <NumberInput
            value={styles.minWidth ?? ''}
            placeholder="auto"
            min={0}
            onChange={(v) => patchStyle('minWidth', v || '0px')}
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Layout">
        <PropRow label="H-Align">
          <AlignButtonGroup
            value={styles.alignItems ?? 'stretch'}
            onChange={(v) => patchStyle('alignItems', v)}
            options={[
              { value: 'flex-start', title: 'Left', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 2v10M5 4h6M5 7h4M5 10h5" /></svg> },
              { value: 'center', title: 'Center', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M7 2v10M4 4h6M5 7h4M4 10h6" /></svg> },
              { value: 'flex-end', title: 'Right', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2v10M3 4h6M5 7h4M4 10h5" /></svg> },
              { value: 'stretch', title: 'Stretch', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 4h10M2 7h10M2 10h10" /></svg> },
            ]}
          />
        </PropRow>
        <PropRow label="V-Align">
          <SelectInput
            value={styles.justifyContent ?? 'flex-start'}
            options={VALIGN_OPTIONS}
            onChange={(v) => patchStyle('justifyContent', v)}
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
        responsive={column.responsive ?? {}}
        onUpdate={(r: ResponsiveStyles) => updateColumn(id, { responsive: r })}
      />
    </>
  )
}
