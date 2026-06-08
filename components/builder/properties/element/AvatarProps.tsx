'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'

interface Props { element: ElementNode }

export default function AvatarProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'avatar') return null
  const { content } = element

  function patch(p: Partial<typeof content>) { updateElement(element.id, { content: { ...content, ...p } }) }

  function updateMember(id: string, patchItem: Partial<NonNullable<typeof content.groupItems>[number]>) {
    const items = content.groupItems ?? []
    patch({ groupItems: items.map((it) => it.id === id ? { ...it, ...patchItem } : it) })
  }
  function addMember() {
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `mem-${Date.now()}`
    const items = content.groupItems ?? []
    patch({ groupItems: [...items, { id, name: 'New Member' }] })
  }
  function removeMember(id: string) {
    const items = content.groupItems ?? []
    patch({ groupItems: items.filter((it) => it.id !== id) })
  }
  function moveMember(id: string, dir: -1 | 1) {
    const items = [...(content.groupItems ?? [])]
    const idx = items.findIndex((it) => it.id === id)
    if (idx < 0) return
    const target = idx + dir
    if (target < 0 || target >= items.length) return
    ;[items[idx], items[target]] = [items[target], items[idx]]
    patch({ groupItems: items })
  }

  // Seed group items if user switches to group mode and list is empty
  function enableGroup() {
    const seed = content.groupItems && content.groupItems.length > 0
      ? content.groupItems
      : [
          { id: 'm1', name: 'Alice Chen' },
          { id: 'm2', name: 'Bob Patel' },
          { id: 'm3', name: 'Carol Diaz' },
        ]
    patch({ group: true, groupItems: seed, groupMax: content.groupMax ?? 4 })
  }

  return (
    <>
      <PropGroup label="Mode">
        <PropRow label="Display">
          <SelectInput
            value={content.group ? 'true' : 'false'}
            options={[{ label: 'Single avatar', value: 'false' }, { label: 'Group (stacked)', value: 'true' }]}
            onChange={(v) => (v === 'true' ? enableGroup() : patch({ group: false }))}
          />
        </PropRow>
        <PropRow label="Size">
          <SelectInput value={content.size ?? 'md'} options={[
            { label: 'XS (24px)', value: 'xs' }, { label: 'SM (32px)', value: 'sm' },
            { label: 'MD (40px)', value: 'md' }, { label: 'LG (56px)', value: 'lg' }, { label: 'XL (72px)', value: 'xl' },
          ]} onChange={(v) => patch({ size: v as typeof content.size })} />
        </PropRow>
        <PropRow label="Shape">
          <SelectInput value={content.shape ?? 'circle'} options={[
            { label: 'Circle', value: 'circle' }, { label: 'Rounded', value: 'rounded' }, { label: 'Square', value: 'square' },
          ]} onChange={(v) => patch({ shape: v as typeof content.shape })} />
        </PropRow>
      </PropGroup>

      {!content.group && (
        <PropGroup label="Avatar">
          <PropRow label="Name" stack><TextInput value={content.name ?? ''} onChange={(v) => patch({ name: v })} placeholder="John Doe" /></PropRow>
          <PropRow label="Initials" stack><TextInput value={content.initials ?? ''} onChange={(v) => patch({ initials: v })} placeholder="JD (auto if blank)" /></PropRow>
          <PropRow label="Image URL" stack><TextInput value={content.src ?? ''} onChange={(v) => patch({ src: v })} placeholder="https://… (optional)" /></PropRow>
          <PropRow label="Status">
            <SelectInput
              value={content.status ?? ''}
              options={[
                { label: 'None', value: '' },
                { label: 'Online (green)', value: 'online' },
                { label: 'Offline (grey)', value: 'offline' },
                { label: 'Busy (red)', value: 'busy' },
                { label: 'Away (orange)', value: 'away' },
              ]}
              onChange={(v) => patch({ status: (v || undefined) as typeof content.status })}
            />
          </PropRow>
          <PropRow label="Background"><ColorSwatch value={content.bg ?? '#4f46e5'} onChange={(v) => patch({ bg: v })} /></PropRow>
          <PropRow label="Text colour"><ColorSwatch value={content.textColor ?? '#ffffff'} onChange={(v) => patch({ textColor: v })} /></PropRow>
        </PropGroup>
      )}

      {content.group && (
        <PropGroup label={`Team members (${content.groupItems?.length ?? 0})`}>
          <PropRow label="Max visible">
            <SelectInput value={String(content.groupMax ?? 4)} options={['2', '3', '4', '5', '6', '8', '10'].map((v) => ({ label: v, value: v }))} onChange={(v) => patch({ groupMax: parseInt(v) })} />
          </PropRow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            {(content.groupItems ?? []).map((m, idx) => (
              <div key={m.id} style={{ border: '1px solid var(--color-border)', borderRadius: 6, padding: 8, display: 'flex', flexDirection: 'column', gap: 6, backgroundColor: 'var(--color-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Member {idx + 1}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => moveMember(m.id, -1)} disabled={idx === 0} style={iconBtnStyle(idx === 0)} title="Move up">↑</button>
                    <button onClick={() => moveMember(m.id, 1)} disabled={idx === (content.groupItems?.length ?? 0) - 1} style={iconBtnStyle(idx === (content.groupItems?.length ?? 0) - 1)} title="Move down">↓</button>
                    <button onClick={() => removeMember(m.id)} style={{ ...iconBtnStyle(false), color: '#ef4444' }} title="Remove">✕</button>
                  </div>
                </div>
                <TextInput value={m.name} onChange={(v) => updateMember(m.id, { name: v })} placeholder="Name" />
                <TextInput value={m.initials ?? ''} onChange={(v) => updateMember(m.id, { initials: v })} placeholder="Initials (auto)" />
                <TextInput value={m.src ?? ''} onChange={(v) => updateMember(m.id, { src: v })} placeholder="Image URL (optional)" />
              </div>
            ))}
            <button onClick={addMember} style={addBtnStyle}>+ Add member</button>
          </div>
        </PropGroup>
      )}
    </>
  )
}

const iconBtnStyle = (disabled: boolean): React.CSSProperties => ({
  width: 22, height: 22, border: '1px solid var(--color-border)', borderRadius: 4, background: 'var(--color-bg)',
  cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
  opacity: disabled ? 0.4 : 1, color: 'var(--color-text-primary)', padding: 0, flexShrink: 0,
})

const addBtnStyle: React.CSSProperties = {
  padding: '8px 12px', border: '1.5px dashed var(--color-border)', borderRadius: 6, background: 'transparent',
  color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
}
