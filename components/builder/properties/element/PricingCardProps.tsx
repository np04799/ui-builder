'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'

interface Props { element: ElementNode }

export default function PricingCardProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'pricing-card') return null
  const { content } = element

  function patch(p: Partial<typeof content>) { updateElement(element.id, { content: { ...content, ...p } }) }

  function updateFeature(id: string, patchItem: Partial<typeof content.features[number]>) {
    patch({ features: content.features.map((f) => f.id === id ? { ...f, ...patchItem } : f) })
  }
  function addFeature() {
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `feat-${Date.now()}`
    patch({ features: [...content.features, { id, text: 'New feature', included: true }] })
  }
  function removeFeature(id: string) {
    patch({ features: content.features.filter((f) => f.id !== id) })
  }
  function moveFeature(id: string, dir: -1 | 1) {
    const idx = content.features.findIndex((f) => f.id === id)
    if (idx < 0) return
    const next = [...content.features]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    patch({ features: next })
  }

  return (
    <>
      <PropGroup label="Preset">
        <PropRow label="Style">
          <SelectInput value={content.preset ?? 'simple'} options={[
            { label: 'Simple', value: 'simple' },
            { label: 'Featured (highlighted)', value: 'featured' },
            { label: 'Minimal', value: 'minimal' },
            { label: 'Bordered', value: 'bordered' },
          ]} onChange={(v) => patch({ preset: v as typeof content.preset })} />
        </PropRow>
        <PropRow label="Highlighted">
          <SelectInput value={content.highlighted ? 'true' : 'false'} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} onChange={(v) => patch({ highlighted: v === 'true' })} />
        </PropRow>
      </PropGroup>

      <PropGroup label="Plan">
        <PropRow label="Plan name" stack><TextInput value={content.planName ?? ''} onChange={(v) => patch({ planName: v })} placeholder="Pro" /></PropRow>
        <PropRow label="Price" stack><TextInput value={content.price ?? ''} onChange={(v) => patch({ price: v })} placeholder="$29" /></PropRow>
        <PropRow label="Period" stack><TextInput value={content.period ?? ''} onChange={(v) => patch({ period: v })} placeholder="/month" /></PropRow>
        <PropRow label="Description" stack><TextInput value={content.description ?? ''} onChange={(v) => patch({ description: v })} placeholder="Plan description" /></PropRow>
        <PropRow label="Badge" stack><TextInput value={content.badge ?? ''} onChange={(v) => patch({ badge: v })} placeholder="Most Popular (or blank)" /></PropRow>
      </PropGroup>

      <PropGroup label={`Features (${content.features.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {content.features.map((f, idx) => (
            <div key={f.id} style={{ border: '1px solid var(--color-border)', borderRadius: 6, padding: 8, display: 'flex', flexDirection: 'column', gap: 6, backgroundColor: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => updateFeature(f.id, { included: !f.included })}
                  style={{ width: 22, height: 22, borderRadius: 4, border: 'none', cursor: 'pointer',
                    backgroundColor: f.included ? '#22c55e' : 'var(--color-border)',
                    color: '#fff', fontSize: '0.7rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title={f.included ? 'Included' : 'Not included (click to toggle)'}>
                  {f.included ? '✓' : '✕'}
                </button>
                <div style={{ flex: 1 }}>
                  <TextInput value={f.text} onChange={(v) => updateFeature(f.id, { text: v })} placeholder="Feature description" />
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  <button onClick={() => moveFeature(f.id, -1)} disabled={idx === 0} style={iconBtnStyle(idx === 0)} title="Move up">↑</button>
                  <button onClick={() => moveFeature(f.id, 1)} disabled={idx === content.features.length - 1} style={iconBtnStyle(idx === content.features.length - 1)} title="Move down">↓</button>
                  <button onClick={() => removeFeature(f.id)} style={{ ...iconBtnStyle(false), color: '#ef4444' }} title="Remove">✕</button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addFeature} style={addBtnStyle}>+ Add feature</button>
        </div>
      </PropGroup>

      <PropGroup label="CTA Button">
        <PropRow label="Text" stack><TextInput value={content.ctaText ?? ''} onChange={(v) => patch({ ctaText: v })} placeholder="Get started" /></PropRow>
        <PropRow label="Link" stack><TextInput value={content.ctaHref ?? ''} onChange={(v) => patch({ ctaHref: v })} placeholder="#" /></PropRow>
        <PropRow label="Style">
          <SelectInput value={content.ctaVariant ?? 'primary'} options={[{ label: 'Primary', value: 'primary' }, { label: 'Outline', value: 'outline' }, { label: 'Secondary', value: 'secondary' }]} onChange={(v) => patch({ ctaVariant: v as typeof content.ctaVariant })} />
        </PropRow>
      </PropGroup>
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
