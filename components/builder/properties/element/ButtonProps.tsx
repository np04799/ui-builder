'use client'

import type { ElementNode } from '@/types/store.types'
import type { ButtonVariant } from '@/types/builder.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import NumberInput from '@/components/builder/controls/NumberInput'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

const VARIANT_OPTIONS: { label: string; value: ButtonVariant }[] = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Outline', value: 'outline' },
  { label: 'Ghost', value: 'ghost' },
]

const TARGET_OPTIONS = [
  { label: 'Same tab', value: '_self' },
  { label: 'New tab', value: '_blank' },
]

const SIZE_OPTIONS = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
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

export default function ButtonProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'button') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  return (
    <>
      <PropGroup label="Link">
        <PropRow label="URL" stack>
          <TextInput
            value={content.href}
            onChange={(v) => patchContent({ href: v })}
            placeholder="https://..."
          />
        </PropRow>
        <PropRow label="Target">
          <SelectInput
            value={content.target ?? '_self'}
            options={TARGET_OPTIONS}
            onChange={(v) => patchContent({ target: v as '_blank' | '_self' })}
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Style">
        <PropRow label="Variant">
          <SelectInput
            value={content.variant}
            options={VARIANT_OPTIONS}
            onChange={(v) => patchContent({ variant: v as ButtonVariant })}
          />
        </PropRow>
        <PropRow label="Bg color">
          <ColorSwatch
            value={styles.backgroundColor ?? ''}
            onChange={(v) => patchStyle('backgroundColor', v)}
          />
        </PropRow>
        <PropRow label="Text color">
          <ColorSwatch
            value={styles.color ?? ''}
            onChange={(v) => patchStyle('color', v)}
          />
        </PropRow>
        <PropRow label="Border color">
          <ColorSwatch
            value={styles.borderColor ?? ''}
            onChange={(v) => patchStyle('borderColor', v)}
          />
        </PropRow>
        <PropRow label="Radius">
          <NumberInput
            value={styles.borderRadius ?? ''}
            onChange={(v) => patchStyle('borderRadius', v)}
            placeholder="6"
          />
        </PropRow>
        <PropRow label="Font size">
          <NumberInput
            value={styles.fontSize ?? ''}
            onChange={(v) => patchStyle('fontSize', v)}
            placeholder="14"
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
        <PropRow label="Margin" stack>
          <SpacingControl
            value={styles.margin ?? '0px'}
            onChange={(v) => patchStyle('margin', v)}
          />
        </PropRow>
      </PropGroup>

      <CustomCSSField
        styles={styles}
        knownKeys={['backgroundColor', 'color', 'fontFamily', 'borderColor', 'borderRadius', 'fontSize', 'padding', 'margin']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
