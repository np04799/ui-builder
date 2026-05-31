'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

interface Props { element: ElementNode }

export default function BannerTickerProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'banner-ticker') return null
  const { content } = element

  function patch(p: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...p } })
  }

  function setTickerItem(i: number, val: string) {
    const items = [...content.tickerItems]
    items[i] = val
    patch({ tickerItems: items })
  }

  function addItem() {
    patch({ tickerItems: [...content.tickerItems, 'New item'] })
  }

  function removeItem(i: number) {
    patch({ tickerItems: content.tickerItems.filter((_, idx) => idx !== i) })
  }

  return (
    <>
      <PropGroup label="Content">
        <PropRow label="Heading" stack>
          <TextInput value={content.heading} onChange={(v) => patch({ heading: v })} placeholder="Headline…" />
        </PropRow>
        <PropRow label="Subtext" stack>
          <TextInput value={content.subtext} onChange={(v) => patch({ subtext: v })} placeholder="Subheading…" />
        </PropRow>
        <PropRow label="CTA text" stack>
          <TextInput value={content.cta} onChange={(v) => patch({ cta: v })} placeholder="Button label" />
        </PropRow>
        <PropRow label="CTA link" stack>
          <TextInput value={content.ctaHref} onChange={(v) => patch({ ctaHref: v })} placeholder="https://…" />
        </PropRow>
      </PropGroup>

      <PropGroup label="Ticker items">
        {content.tickerItems.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <TextInput value={item} onChange={(v) => setTickerItem(i, v)} />
            </div>
            <button
              onClick={() => removeItem(i)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.75rem', padding: '0 4px', flexShrink: 0 }}
            >✕</button>
          </div>
        ))}
        <button
          onClick={addItem}
          style={{ marginTop: 6, width: '100%', height: 28, border: '1px dashed var(--color-border)', borderRadius: 4, backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '0.75rem', cursor: 'pointer' }}
        >
          + Add item
        </button>
      </PropGroup>

      <CustomCSSField
        styles={element.styles}
        knownKeys={[]}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
