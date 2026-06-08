'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

const VARIANT_OPTIONS = [
  { label: 'Default (card)', value: 'default' },
  { label: 'Flush', value: 'flush' },
  { label: 'Bordered', value: 'bordered' },
]

const BOOL_OPTIONS = [
  { label: 'No', value: 'false' },
  { label: 'Yes', value: 'true' },
]

interface Props {
  element: ElementNode
}

export default function AccordionProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'accordion') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  function updateItem(itemId: string, field: 'title' | 'content', value: string) {
    patchContent({
      items: content.items.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)),
    })
  }

  function toggleDefaultOpen(itemId: string) {
    patchContent({
      items: content.items.map((it) =>
        it.id === itemId ? { ...it, defaultOpen: !it.defaultOpen } : it
      ),
    })
  }

  function addItem() {
    patchContent({
      items: [
        ...content.items,
        { id: crypto.randomUUID(), title: `Section ${content.items.length + 1}`, content: 'New section content.' },
      ],
    })
  }

  function removeItem(itemId: string) {
    if (content.items.length <= 1) return
    patchContent({ items: content.items.filter((it) => it.id !== itemId) })
  }

  return (
    <>
      <PropGroup label="Accordion">
        <PropRow label="Variant">
          <SelectInput
            value={content.variant ?? 'default'}
            options={VARIANT_OPTIONS}
            onChange={(v) => patchContent({ variant: v as 'default' | 'flush' | 'bordered' })}
          />
        </PropRow>
        <PropRow label="Multi-open">
          <SelectInput
            value={String(content.allowMultiple ?? false)}
            options={BOOL_OPTIONS}
            onChange={(v) => patchContent({ allowMultiple: v === 'true' })}
          />
        </PropRow>
      </PropGroup>

      {content.items.map((item, idx) => (
        <PropGroup key={item.id} label={`Item ${idx + 1}`} defaultOpen={idx === 0}>
          <PropRow label="Title" stack>
            <TextInput value={item.title} onChange={(v) => updateItem(item.id, 'title', v)} placeholder="Section title" />
          </PropRow>
          <PropRow label="Content" stack>
            <TextInput value={item.content} onChange={(v) => updateItem(item.id, 'content', v)} placeholder="Section content" />
          </PropRow>
          <PropRow label="Default open">
            <SelectInput
              value={String(item.defaultOpen ?? false)}
              options={BOOL_OPTIONS}
              onChange={() => toggleDefaultOpen(item.id)}
            />
          </PropRow>
          <button
            onClick={() => removeItem(item.id)}
            disabled={content.items.length <= 1}
            style={{
              alignSelf: 'flex-start',
              padding: '4px 10px',
              fontSize: '0.75rem',
              border: '1px solid #fca5a5',
              borderRadius: 4,
              background: 'none',
              color: '#ef4444',
              cursor: content.items.length <= 1 ? 'not-allowed' : 'pointer',
              opacity: content.items.length <= 1 ? 0.4 : 1,
            }}
          >
            Remove item
          </button>
        </PropGroup>
      ))}

      <div style={{ padding: '8px 16px' }}>
        <button
          onClick={addItem}
          style={{
            width: '100%',
            padding: '7px',
            fontSize: '0.8125rem',
            border: '1px dashed var(--color-border)',
            borderRadius: 6,
            background: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
        >
          + Add item
        </button>
      </div>

      <PropGroup label="Style">
        <PropRow label="Bg color">
          <ColorSwatch value={styles.backgroundColor ?? ''} onChange={(v) => patchStyle('backgroundColor', v)} />
        </PropRow>
        <PropRow label="Text color">
          <ColorSwatch value={styles.color ?? ''} onChange={(v) => patchStyle('color', v)} />
        </PropRow>
        <PropRow label="Padding" stack>
          <SpacingControl value={styles.padding ?? '0px'} onChange={(v) => patchStyle('padding', v)} />
        </PropRow>
      </PropGroup>

      <CustomCSSField
        styles={styles}
        knownKeys={['backgroundColor', 'color', 'padding']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
