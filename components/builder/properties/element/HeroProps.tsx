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

export default function HeroProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'hero') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchCta(patch: Partial<typeof content.cta>) {
    updateElement(element.id, { content: { ...content, cta: { ...content.cta, ...patch } } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  return (
    <>
      <PropGroup label="Content">
        <PropRow label="Heading" stack>
          <TextInput
            value={content.heading}
            onChange={(v) => patchContent({ heading: v })}
            placeholder="Your heading…"
          />
        </PropRow>
        <PropRow label="Paragraph" stack>
          <TextInput
            value={content.paragraph}
            onChange={(v) => patchContent({ paragraph: v })}
            placeholder="Subheading text…"
          />
        </PropRow>
        <PropRow label="CTA text" stack>
          <TextInput
            value={content.cta.text}
            onChange={(v) => patchCta({ text: v })}
            placeholder="Get Started"
          />
        </PropRow>
        <PropRow label="CTA link" stack>
          <TextInput
            value={content.cta.href}
            onChange={(v) => patchCta({ href: v })}
            placeholder="https://..."
          />
        </PropRow>
        <PropRow label="Bg image" stack>
          <ImageUpload
            src={content.backgroundImage ?? ''}
            onChange={(v) => patchContent({ backgroundImage: v || undefined })}
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Style">
        <PropRow label="Bg color">
          <ColorSwatch
            value={styles.backgroundColor ?? '#f0f4ff'}
            onChange={(v) => patchStyle('backgroundColor', v)}
          />
        </PropRow>
        <PropRow label="Text color">
          <ColorSwatch
            value={styles.color ?? ''}
            onChange={(v) => patchStyle('color', v)}
          />
        </PropRow>
        <PropRow label="Min height">
          <NumberInput
            value={styles.minHeight ?? '320px'}
            onChange={(v) => patchStyle('minHeight', v)}
            placeholder="320"
          />
        </PropRow>
        <PropRow label="Radius">
          <NumberInput
            value={styles.borderRadius ?? '8px'}
            onChange={(v) => patchStyle('borderRadius', v)}
            placeholder="8"
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Spacing">
        <PropRow label="Padding" stack>
          <SpacingControl
            value={styles.padding ?? '60px 24px'}
            onChange={(v) => patchStyle('padding', v)}
          />
        </PropRow>
      </PropGroup>

      <CustomCSSField
        styles={styles}
        knownKeys={['backgroundColor', 'color', 'minHeight', 'borderRadius', 'padding']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
