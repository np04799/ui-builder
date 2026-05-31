'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import NumberInput from '@/components/builder/controls/NumberInput'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

interface Props { element: ElementNode }

export default function SpacerProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'spacer') return null
  const { content } = element

  function setHeight(v: string) {
    updateElement(element.id, { content: { ...content, height: v } })
  }

  return (
    <>
      <PropGroup label="Size">
        <PropRow label="Height">
          <NumberInput
            value={content.height ?? '40px'}
            onChange={setHeight}
            placeholder="40"
          />
        </PropRow>
      </PropGroup>

      <CustomCSSField
        styles={element.styles}
        knownKeys={[]}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
