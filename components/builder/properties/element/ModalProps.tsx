'use client'

import type { ElementNode } from '@/types/store.types'
import type { ButtonVariant } from '@/types/builder.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

const VARIANT_OPTIONS = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Outline', value: 'outline' },
  { label: 'Ghost', value: 'ghost' },
]

interface Props {
  element: ElementNode
}

export default function ModalProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'modal') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  return (
    <>
      <PropGroup label="Trigger">
        <PropRow label="Text" stack>
          <TextInput
            value={content.triggerText}
            onChange={(v) => patchContent({ triggerText: v })}
            placeholder="Open Modal"
          />
        </PropRow>
        <PropRow label="Variant">
          <SelectInput
            value={content.triggerVariant ?? 'primary'}
            options={VARIANT_OPTIONS}
            onChange={(v) => patchContent({ triggerVariant: v as ButtonVariant })}
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Modal content">
        <PropRow label="Title" stack>
          <TextInput
            value={content.title}
            onChange={(v) => patchContent({ title: v })}
            placeholder="Modal Title"
          />
        </PropRow>
        <PropRow label="Body" stack>
          <TextInput
            value={content.body}
            onChange={(v) => patchContent({ body: v })}
            placeholder="Modal body text"
          />
        </PropRow>
        <PropRow label="Confirm" stack>
          <TextInput
            value={content.confirmText ?? 'Confirm'}
            onChange={(v) => patchContent({ confirmText: v })}
            placeholder="Confirm"
          />
        </PropRow>
        <PropRow label="Cancel" stack>
          <TextInput
            value={content.cancelText ?? 'Cancel'}
            onChange={(v) => patchContent({ cancelText: v })}
            placeholder="Cancel"
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Style">
        <PropRow label="Bg color">
          <ColorSwatch value={styles.backgroundColor ?? ''} onChange={(v) => patchStyle('backgroundColor', v)} />
        </PropRow>
        <PropRow label="Text color">
          <ColorSwatch value={styles.color ?? ''} onChange={(v) => patchStyle('color', v)} />
        </PropRow>
      </PropGroup>

      <CustomCSSField
        styles={styles}
        knownKeys={['backgroundColor', 'color']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
