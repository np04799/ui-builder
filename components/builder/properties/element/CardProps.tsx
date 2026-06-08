'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import NumberInput from '@/components/builder/controls/NumberInput'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'
import ImageUpload from '@/components/builder/controls/ImageUpload'

interface Props { element: ElementNode }

export default function CardProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'card') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchImage(patch: Partial<typeof content.image>) {
    patchContent({ image: { ...content.image, ...patch } })
  }

  function patchButton(patch: Partial<NonNullable<typeof content.button>>) {
    patchContent({ button: { text: content.button?.text ?? 'Learn more', href: content.button?.href ?? '#', ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  return (
    <>
      <PropGroup label="Content">
        <PropRow label="Title" stack>
          <TextInput value={content.title} onChange={(v) => patchContent({ title: v })} placeholder="Card title" />
        </PropRow>
        <PropRow label="Description" stack>
          <TextInput value={content.description} onChange={(v) => patchContent({ description: v })} placeholder="Card description" />
        </PropRow>
        <PropRow label="Image" stack>
          <ImageUpload src={content.image.src} onChange={(v) => patchImage({ src: v })} />
        </PropRow>
        <PropRow label="Image alt" stack>
          <TextInput value={content.image.alt} onChange={(v) => patchImage({ alt: v })} placeholder="Image description" />
        </PropRow>
        <PropRow label="Button text" stack>
          <TextInput value={content.button?.text ?? ''} onChange={(v) => patchButton({ text: v })} placeholder="Learn more" />
        </PropRow>
        <PropRow label="Button link" stack>
          <TextInput value={content.button?.href ?? ''} onChange={(v) => patchButton({ href: v })} placeholder="https://..." />
        </PropRow>
      </PropGroup>

      <PropGroup label="Style">
        <PropRow label="Bg color">
          <ColorSwatch value={styles.backgroundColor ?? ''} onChange={(v) => patchStyle('backgroundColor', v)} />
        </PropRow>
        <PropRow label="Text color">
          <ColorSwatch value={styles.color ?? ''} onChange={(v) => patchStyle('color', v)} />
        </PropRow>
        <PropRow label="Border color">
          <ColorSwatch value={styles.borderColor ?? ''} onChange={(v) => patchStyle('borderColor', v)} />
        </PropRow>
        <PropRow label="Radius">
          <NumberInput value={styles.borderRadius ?? '12px'} onChange={(v) => patchStyle('borderRadius', v)} placeholder="12" />
        </PropRow>
      </PropGroup>

      <PropGroup label="Spacing">
        <PropRow label="Padding" stack>
          <SpacingControl value={styles.padding ?? '0px'} onChange={(v) => patchStyle('padding', v)} />
        </PropRow>
      </PropGroup>

      <CustomCSSField
        styles={styles}
        knownKeys={['backgroundColor', 'color', 'borderColor', 'borderRadius', 'padding']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
