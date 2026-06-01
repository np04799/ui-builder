'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'

interface Props { element: ElementNode }

export default function AvatarProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'avatar') return null
  const { content } = element
  function patch(p: Partial<typeof content>) { updateElement(element.id, { content: { ...content, ...p } }) }

  return (
    <>
      <PropGroup label="Mode">
        <PropRow label="Group mode">
          <SelectInput value={content.group ? 'true' : 'false'} options={[{ label: 'Single', value: 'false' }, { label: 'Group (stacked)', value: 'true' }]} onChange={(v) => patch({ group: v === 'true' })} />
        </PropRow>
      </PropGroup>
      {!content.group && (
        <PropGroup label="Avatar">
          <PropRow label="Name" stack><TextInput value={content.name ?? ''} onChange={(v) => patch({ name: v })} placeholder="John Doe" /></PropRow>
          <PropRow label="Initials" stack><TextInput value={content.initials ?? ''} onChange={(v) => patch({ initials: v })} placeholder="JD (auto)" /></PropRow>
          <PropRow label="Size">
            <SelectInput value={content.size ?? 'md'} options={[{ label: 'XS (24px)', value: 'xs' }, { label: 'SM (32px)', value: 'sm' }, { label: 'MD (40px)', value: 'md' }, { label: 'LG (56px)', value: 'lg' }, { label: 'XL (72px)', value: 'xl' }]} onChange={(v) => patch({ size: v as typeof content.size })} />
          </PropRow>
          <PropRow label="Shape">
            <SelectInput value={content.shape ?? 'circle'} options={[{ label: 'Circle', value: 'circle' }, { label: 'Rounded', value: 'rounded' }, { label: 'Square', value: 'square' }]} onChange={(v) => patch({ shape: v as typeof content.shape })} />
          </PropRow>
          <PropRow label="Status">
            <SelectInput value={content.status ?? ''} options={[{ label: 'None', value: '' }, { label: 'Online', value: 'online' }, { label: 'Offline', value: 'offline' }, { label: 'Busy', value: 'busy' }, { label: 'Away', value: 'away' }]} onChange={(v) => patch({ status: (v || undefined) as typeof content.status })} />
          </PropRow>
        </PropGroup>
      )}
      {content.group && (
        <PropGroup label="Group">
          <PropRow label="Max visible"><SelectInput value={String(content.groupMax ?? 4)} options={['2','3','4','5','6'].map((v) => ({ label: v, value: v }))} onChange={(v) => patch({ groupMax: parseInt(v) })} /></PropRow>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '8px 0 0', lineHeight: 1.5 }}>Group members are configured via the data layer. Add groupItems in your project data.</p>
        </PropGroup>
      )}
    </>
  )
}
