'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

interface Props { element: ElementNode }

export default function BannerSplitProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'banner-split') return null
  const { content } = element

  function patch(p: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...p } })
  }

  function setStat(i: number, key: 'value' | 'label', val: string) {
    const stats = content.stats.map((s, idx) => idx === i ? { ...s, [key]: val } : s)
    patch({ stats })
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
          <TextInput value={content.cta} onChange={(v) => patch({ cta: v })} placeholder="Primary button" />
        </PropRow>
        <PropRow label="CTA link" stack>
          <TextInput value={content.ctaHref} onChange={(v) => patch({ ctaHref: v })} placeholder="https://…" />
        </PropRow>
        <PropRow label="Secondary" stack>
          <TextInput value={content.ctaSecondary} onChange={(v) => patch({ ctaSecondary: v })} placeholder="Watch demo" />
        </PropRow>
      </PropGroup>

      <PropGroup label="Stats">
        {content.stats.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            <div style={{ flex: '0 0 40%' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Value</div>
              <TextInput value={s.value} onChange={(v) => setStat(i, 'value', v)} placeholder="50K+" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Label</div>
              <TextInput value={s.label} onChange={(v) => setStat(i, 'label', v)} placeholder="Users" />
            </div>
          </div>
        ))}
      </PropGroup>

      <CustomCSSField
        styles={element.styles}
        knownKeys={[]}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
