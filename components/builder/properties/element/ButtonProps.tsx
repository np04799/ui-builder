'use client'

import { useState } from 'react'
import type { ElementNode } from '@/types/store.types'
import type { ButtonVariant } from '@/types/builder.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import NumberInput from '@/components/builder/controls/NumberInput'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

// ─── Presets ──────────────────────────────────────────────────────────────────

interface ButtonPreset {
  id: string
  name: string
  description: string
  variant: ButtonVariant
  borderRadius: string
  padding: string
  fontSize: string
  backgroundColor?: string
  color?: string
  borderColor?: string
}

const BUTTON_PRESETS: ButtonPreset[] = [
  {
    id: 'primary-rounded',
    name: 'Primary',
    description: 'Solid fill · rounded · main CTA',
    variant: 'primary',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
  },
  {
    id: 'outline-pill',
    name: 'Pill Outline',
    description: 'Border only · pill shape · secondary',
    variant: 'outline',
    borderRadius: '999px',
    padding: '10px 24px',
    fontSize: '14px',
  },
  {
    id: 'ghost-link',
    name: 'Ghost / Link',
    description: 'No background · no border · subtle',
    variant: 'ghost',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
  },
  {
    id: 'large-cta',
    name: 'Large CTA',
    description: 'Big solid button · hero sections',
    variant: 'primary',
    borderRadius: '12px',
    padding: '14px 32px',
    fontSize: '16px',
  },
  {
    id: 'secondary-square',
    name: 'Secondary',
    description: 'Secondary color · square corners',
    variant: 'secondary',
    borderRadius: '4px',
    padding: '10px 20px',
    fontSize: '14px',
  },
]

// ─── Mini button previews ─────────────────────────────────────────────────────

function MiniPreview({ preset }: { preset: ButtonPreset }) {
  const isSolid = preset.variant === 'primary' || preset.variant === 'secondary'
  const isOutline = preset.variant === 'outline'
  const fillColor = preset.variant === 'secondary' ? '#4b5563' : '#4f46e5'

  return (
    <div style={{ background: '#f8fafc', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span
        style={{
          display: 'inline-block',
          padding: preset.variant === 'ghost' ? '6px 12px' : '6px 14px',
          borderRadius: preset.borderRadius,
          fontSize: '0.6rem',
          fontWeight: 600,
          letterSpacing: '0.02em',
          backgroundColor: isSolid ? fillColor : 'transparent',
          color: isSolid ? '#fff' : isOutline ? '#4f46e5' : '#6b7280',
          border: isOutline ? `1.5px solid #4f46e5` : isSolid ? 'none' : 'none',
          cursor: 'default',
        }}
      >
        {preset.name}
      </span>
    </div>
  )
}

function PresetPicker({ onApply }: { onApply: (p: ButtonPreset) => void }) {
  return (
    <div style={{ padding: '12px 0' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
        Presets set variant, size, and shape. Works across all UI frameworks.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {BUTTON_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onApply(p)}
            style={{ border: '1.5px solid var(--color-border)', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'none', textAlign: 'left', transition: 'border-color 150ms' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-primary)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)' }}
          >
            <MiniPreview preset={p} />
            <div style={{ padding: '5px 8px', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{p.name}</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--color-text-secondary)' }}>{p.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

type Tab = 'presets' | 'content' | 'style'

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'presets', label: 'Presets' },
    { id: 'content', label: 'Content' },
    { id: 'style', label: 'Style' },
  ]
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: 2 }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{ flex: 1, height: 34, border: 'none', borderBottom: active === t.id ? '2px solid var(--color-primary)' : '2px solid transparent', background: 'none', color: active === t.id ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontWeight: active === t.id ? 600 : 400, fontSize: '0.6875rem', cursor: 'pointer', transition: 'color 150ms', padding: 0 }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ─── Options ──────────────────────────────────────────────────────────────────

const VARIANT_OPTIONS: { label: string; value: ButtonVariant }[] = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Outline', value: 'outline' },
  { label: 'Ghost', value: 'ghost' },
]

const TARGET_OPTIONS = [
  { label: 'Same tab', value: '_self' },
  { label: 'New tab', value: '_blank' },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props { element: ElementNode }

export default function ButtonProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const [tab, setTab] = useState<Tab>('presets')

  if (element.content.type !== 'button') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  function applyPreset(p: ButtonPreset) {
    updateElement(element.id, {
      content: { ...content, variant: p.variant },
      styles: {
        ...styles,
        borderRadius: p.borderRadius,
        padding: p.padding,
        fontSize: p.fontSize,
        ...(p.backgroundColor ? { backgroundColor: p.backgroundColor } : {}),
        ...(p.color ? { color: p.color } : {}),
        ...(p.borderColor ? { borderColor: p.borderColor } : {}),
      },
    })
    setTab('style')
  }

  return (
    <>
      <TabBar active={tab} onChange={setTab} />

      {tab === 'presets' && (
        <PropGroup label="Style presets">
          <PresetPicker onApply={applyPreset} />
        </PropGroup>
      )}

      {tab === 'content' && (
        <>
          <PropGroup label="Button">
            <PropRow label="Text" stack>
              <TextInput
                value={content.text}
                onChange={(v) => patchContent({ text: v })}
                placeholder="Click Here"
              />
            </PropRow>
            <PropRow label="URL" stack>
              <TextInput
                value={content.href}
                onChange={(v) => patchContent({ href: v })}
                placeholder="https://..."
              />
            </PropRow>
            <PropRow label="Target">
              <SelectInput
                value={content.target ?? '_self'}
                options={TARGET_OPTIONS}
                onChange={(v) => patchContent({ target: v as '_blank' | '_self' })}
              />
            </PropRow>
          </PropGroup>
        </>
      )}

      {tab === 'style' && (
        <>
          <PropGroup label="Variant">
            <PropRow label="Type">
              <SelectInput
                value={content.variant}
                options={VARIANT_OPTIONS}
                onChange={(v) => patchContent({ variant: v as ButtonVariant })}
              />
            </PropRow>
          </PropGroup>

          <PropGroup label="Colors">
            <PropRow label="Bg color">
              <ColorSwatch
                value={styles.backgroundColor ?? ''}
                onChange={(v) => patchStyle('backgroundColor', v)}
              />
            </PropRow>
            <PropRow label="Text color">
              <ColorSwatch
                value={styles.color ?? ''}
                onChange={(v) => patchStyle('color', v)}
              />
            </PropRow>
            <PropRow label="Border color">
              <ColorSwatch
                value={styles.borderColor ?? ''}
                onChange={(v) => patchStyle('borderColor', v)}
              />
            </PropRow>
          </PropGroup>

          <PropGroup label="Shape & size">
            <PropRow label="Radius">
              <NumberInput
                value={styles.borderRadius ?? ''}
                onChange={(v) => patchStyle('borderRadius', v)}
                placeholder="8"
              />
            </PropRow>
            <PropRow label="Font size">
              <NumberInput
                value={styles.fontSize ?? ''}
                onChange={(v) => patchStyle('fontSize', v)}
                placeholder="14"
              />
            </PropRow>
            <PropRow label="Padding" stack>
              <SpacingControl
                value={styles.padding ?? '0px'}
                onChange={(v) => patchStyle('padding', v)}
              />
            </PropRow>
            <PropRow label="Margin" stack>
              <SpacingControl
                value={styles.margin ?? '0px'}
                onChange={(v) => patchStyle('margin', v)}
              />
            </PropRow>
          </PropGroup>

          <CustomCSSField
            styles={styles}
            knownKeys={['backgroundColor', 'color', 'borderColor', 'borderRadius', 'fontSize', 'padding', 'margin']}
            onChange={(s) => updateElement(element.id, { styles: s })}
          />
        </>
      )}
    </>
  )
}
