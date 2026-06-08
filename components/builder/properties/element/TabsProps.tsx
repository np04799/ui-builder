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
  { label: 'Line', value: 'line' },
  { label: 'Pill', value: 'pill' },
  { label: 'Boxed', value: 'boxed' },
]

interface Props {
  element: ElementNode
}

export default function TabsProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'tabs') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  function updateTab(tabId: string, field: 'label' | 'content', value: string) {
    patchContent({
      tabs: content.tabs.map((t) => (t.id === tabId ? { ...t, [field]: value } : t)),
    })
  }

  function addTab() {
    patchContent({
      tabs: [
        ...content.tabs,
        { id: crypto.randomUUID(), label: `Tab ${content.tabs.length + 1}`, content: 'New tab content.' },
      ],
    })
  }

  function removeTab(tabId: string) {
    if (content.tabs.length <= 1) return
    patchContent({ tabs: content.tabs.filter((t) => t.id !== tabId) })
  }

  return (
    <>
      <PropGroup label="Tabs">
        <PropRow label="Variant">
          <SelectInput
            value={content.variant ?? 'line'}
            options={VARIANT_OPTIONS}
            onChange={(v) => patchContent({ variant: v as 'line' | 'pill' | 'boxed' })}
          />
        </PropRow>
      </PropGroup>

      {content.tabs.map((tab, idx) => (
        <PropGroup key={tab.id} label={`Tab ${idx + 1}`} defaultOpen={idx === 0}>
          <PropRow label="Label" stack>
            <TextInput value={tab.label} onChange={(v) => updateTab(tab.id, 'label', v)} placeholder="Tab label" />
          </PropRow>
          <PropRow label="Content" stack>
            <TextInput value={tab.content} onChange={(v) => updateTab(tab.id, 'content', v)} placeholder="Tab content" />
          </PropRow>
          <button
            onClick={() => removeTab(tab.id)}
            disabled={content.tabs.length <= 1}
            style={{
              alignSelf: 'flex-start',
              padding: '4px 10px',
              fontSize: '0.75rem',
              border: '1px solid #fca5a5',
              borderRadius: 4,
              background: 'none',
              color: '#ef4444',
              cursor: content.tabs.length <= 1 ? 'not-allowed' : 'pointer',
              opacity: content.tabs.length <= 1 ? 0.4 : 1,
            }}
          >
            Remove tab
          </button>
        </PropGroup>
      ))}

      <div style={{ padding: '8px 16px' }}>
        <button
          onClick={addTab}
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
          + Add tab
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
