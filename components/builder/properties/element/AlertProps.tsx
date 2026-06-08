'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'

interface Props { element: ElementNode }

export default function AlertProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'alert') return null
  const { content } = element
  function patch(p: Partial<typeof content>) { updateElement(element.id, { content: { ...content, ...p } }) }

  return (
    <>
      <PropGroup label="Type">
        <PropRow label="Variant">
          <SelectInput value={content.variant ?? 'info'} options={[{ label: 'Info', value: 'info' }, { label: 'Success', value: 'success' }, { label: 'Warning', value: 'warning' }, { label: 'Danger', value: 'danger' }]} onChange={(v) => patch({ variant: v as 'info' | 'success' | 'warning' | 'danger' })} />
        </PropRow>
        <PropRow label="Dismissible">
          <SelectInput value={content.dismissible ? 'true' : 'false'} options={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]} onChange={(v) => patch({ dismissible: v === 'true' })} />
        </PropRow>
        <PropRow label="Show Icon">
          <SelectInput value={content.showIcon ? 'true' : 'false'} options={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]} onChange={(v) => patch({ showIcon: v === 'true' })} />
        </PropRow>
      </PropGroup>
      <PropGroup label="Content">
        <PropRow label="Title" stack>
          <TextInput value={content.title ?? ''} onChange={(v) => patch({ title: v })} placeholder="Optional title" />
        </PropRow>
        <PropRow label="Message" stack>
          <TextInput value={content.message ?? ''} onChange={(v) => patch({ message: v })} placeholder="Alert message" />
        </PropRow>
      </PropGroup>
    </>
  )
}
