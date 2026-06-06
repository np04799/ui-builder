'use client'

import type { ElementNode } from '@/types/store.types'
import type { HeadingLevel } from '@/types/builder.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import SelectInput from '@/components/builder/controls/SelectInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import AlignButtonGroup from '@/components/builder/controls/AlignButtonGroup'
import NumberInput from '@/components/builder/controls/NumberInput'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

const LEVEL_OPTIONS: { label: string; value: HeadingLevel }[] = [
  { label: 'H1', value: 'h1' },
  { label: 'H2', value: 'h2' },
  { label: 'H3', value: 'h3' },
  { label: 'H4', value: 'h4' },
  { label: 'H5', value: 'h5' },
  { label: 'H6', value: 'h6' },
]

const WEIGHT_OPTIONS = [
  { label: 'Thin (100)', value: '100' },
  { label: 'Light (300)', value: '300' },
  { label: 'Regular (400)', value: '400' },
  { label: 'Medium (500)', value: '500' },
  { label: 'Semi-bold (600)', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: 'Extra-bold (800)', value: '800' },
  { label: 'Black (900)', value: '900' },
]

interface Props {
  element: ElementNode
}


const FONT_OPTIONS = [
  { label: 'Default', value: 'inherit' },
  { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Helvetica', value: '"Helvetica Neue", sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Open Sans', value: '"Open Sans", sans-serif' },
  { label: 'Lato', value: 'Lato, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'Merriweather', value: 'Merriweather, serif' },
  { label: 'Raleway', value: 'Raleway, sans-serif' },
  { label: 'Nunito', value: 'Nunito, sans-serif' },
]

export default function HeadingProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'heading') return null
  const { content, styles } = element

  function setLevel(level: HeadingLevel) {
    updateElement(element.id, { content: { ...content, level } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  return (
    <>
      <PropGroup label="Content">
        <PropRow label="Level">
          <SelectInput
            value={content.level}
            options={LEVEL_OPTIONS}
            onChange={(v) => setLevel(v as HeadingLevel)}
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Typography">
        <PropRow label="Color">        <PropRow label="Font">
          <SelectInput
            value={styles.fontFamily ?? 'inherit'}
            options={FONT_OPTIONS}
            onChange={(v) => patchStyle('fontFamily', v)}
          />
        </PropRow>
          <ColorSwatch
            value={styles.color ?? ''}
            onChange={(v) => patchStyle('color', v)}
          />
        </PropRow>
        <PropRow label="Size">
          <NumberInput
            value={styles.fontSize ?? ''}
            onChange={(v) => patchStyle('fontSize', v)}
            placeholder="32"
          />
        </PropRow>
        <PropRow label="Weight">
          <SelectInput
            value={styles.fontWeight ?? '700'}
            options={WEIGHT_OPTIONS}
            onChange={(v) => patchStyle('fontWeight', v)}
          />
        </PropRow>
        <PropRow label="Line height">
          <NumberInput
            value={styles.lineHeight ?? ''}
            onChange={(v) => patchStyle('lineHeight', v)}
            unit="em"
            step={0.1}
            placeholder="1.2"
          />
        </PropRow>
        <PropRow label="Letter spacing">
          <NumberInput
            value={styles.letterSpacing ?? ''}
            onChange={(v) => patchStyle('letterSpacing', v)}
            unit="em"
            step={0.01}
            placeholder="0"
          />
        </PropRow>
        <PropRow label="Align">
          <AlignButtonGroup
            value={styles.textAlign ?? 'left'}
            onChange={(v) => patchStyle('textAlign', v)}
            options={[
              { value: 'left', title: 'Align left', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h10M2 6h7M2 9h10M2 12h5" /></svg> },
              { value: 'center', title: 'Align center', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h10M4 6h6M2 9h10M4 12h6" /></svg> },
              { value: 'right', title: 'Align right', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h10M5 6h7M2 9h10M7 12h5" /></svg> },
              { value: 'justify', title: 'Justify', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h10M2 6h10M2 9h10M2 12h10" /></svg> },
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
        <PropRow label="Padding" stack>
          <SpacingControl
            value={styles.padding ?? '0px'}
            onChange={(v) => patchStyle('padding', v)}
          />
        </PropRow>
      </PropGroup>

      <CustomCSSField
        styles={styles}
        knownKeys={['color', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textAlign', 'margin', 'padding']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
