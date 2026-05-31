'use client'

import React from 'react'
import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

interface Props { element: ElementNode }

export default function Banner3DProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'banner-3d') return null
  const { content } = element

  function patch(p: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...p } })
  }

  return (
    <React.Fragment>
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

      <CustomCSSField
        styles={element.styles}
        knownKeys={[]}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </React.Fragment>
  )
}
