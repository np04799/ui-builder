'use client'

import React, { useState } from 'react'
import type { ElementNode } from '@/types/store.types'
import type { FormField, FormFieldType, FormStylePreset } from '@/types/builder.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'presets' | 'content' | 'style'

interface StylePreset {
  value: FormStylePreset
  label: string
  desc: string
  accentColor: string
  cardBg: string
  inputPreview: React.CSSProperties
  btnPreview: React.CSSProperties
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const STYLE_PRESETS: StylePreset[] = [
  {
    value: 'default',
    label: 'Clean SaaS',
    desc: 'Icon inputs · shimmer button',
    accentColor: '#6366f1',
    cardBg: '#f8fafc',
    inputPreview: { border: '1.5px solid #e2e8f0', borderRadius: 10, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    btnPreview: { background: '#6366f1', borderRadius: 10, boxShadow: '0 3px 10px rgba(99,102,241,0.4)' },
  },
  {
    value: 'flat',
    label: 'Neon Dark',
    desc: 'Dark card · neon glow · pulse ring',
    accentColor: '#a78bfa',
    cardBg: 'linear-gradient(160deg,#0f0f1a,#1a1033)',
    inputPreview: { border: '1px solid rgba(167,139,250,0.3)', borderRadius: 8, background: 'rgba(255,255,255,0.06)' },
    btnPreview: { background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', borderRadius: 8 },
  },
  {
    value: 'card',
    label: 'Glass Aurora',
    desc: 'Aurora gradient · frosted inputs',
    accentColor: '#38bdf8',
    cardBg: 'linear-gradient(135deg,#4f46e5,#7c3aed,#0ea5e9)',
    inputPreview: { border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12, background: 'rgba(255,255,255,0.12)' },
    btnPreview: { background: 'rgba(255,255,255,0.9)', borderRadius: 12 },
  },
  {
    value: 'floating',
    label: 'Floating Label',
    desc: 'Animated labels · gradient btn',
    accentColor: '#6366f1',
    cardBg: '#f1f5f9',
    inputPreview: { borderBottom: '2px solid #6366f1', borderRadius: '8px 8px 0 0', background: '#f1f5f9' },
    btnPreview: { background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 8 },
  },
  {
    value: 'minimal',
    label: 'Neumorphic',
    desc: 'Soft-UI raised · 3D pressed focus',
    accentColor: '#6366f1',
    cardBg: '#e8edf2',
    inputPreview: { borderRadius: 10, background: '#e8edf2', boxShadow: '4px 4px 8px #c8cdd2,-4px -4px 8px #fff' },
    btnPreview: { background: '#e8edf2', borderRadius: 10, boxShadow: '3px 3px 6px #c8cdd2,-3px -3px 6px #fff' },
  },
  {
    value: 'glass',
    label: 'Editorial',
    desc: 'High-contrast · fill-reveal button',
    accentColor: '#111827',
    cardBg: '#fff',
    inputPreview: { borderBottom: '2.5px solid #111827', borderRadius: 0, background: 'transparent' },
    btnPreview: { background: 'transparent', border: '2.5px solid #111827', borderRadius: 0 },
  },
]

// ─── Mini preview card ────────────────────────────────────────────────────────

function MiniPreview({ preset, isActive }: { preset: StylePreset; isActive: boolean }) {
  return (
    <button
      title={preset.desc}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 0,
        padding: 0,
        borderRadius: 10,
        border: isActive ? `2px solid ${preset.accentColor}` : '1.5px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 150ms, box-shadow 150ms',
        overflow: 'hidden',
        boxShadow: isActive ? `0 0 0 3px ${preset.accentColor}22` : 'none',
      }}
    >
      <div style={{ background: preset.cardBg, padding: '10px 10px 8px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ height: 4, width: '40%', borderRadius: 2, background: 'rgba(0,0,0,0.15)' }} />
        <div style={{ height: 18, width: '100%', ...preset.inputPreview }} />
        <div style={{ height: 4, width: '30%', borderRadius: 2, background: 'rgba(0,0,0,0.12)', marginTop: 2 }} />
        <div style={{ height: 18, width: '100%', ...preset.inputPreview }} />
        <div style={{ height: 16, width: '55%', marginTop: 4, ...preset.btnPreview }} />
      </div>
      <div style={{ padding: '7px 10px 8px', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: isActive ? preset.accentColor : 'var(--color-text-primary)', lineHeight: 1.3 }}>
          {preset.label}
        </div>
        <div style={{ fontSize: '0.6rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginTop: 1 }}>
          {preset.desc}
        </div>
      </div>
    </button>
  )
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

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

// ─── Field options ────────────────────────────────────────────────────────────

const FIELD_TYPE_OPTIONS: { label: string; value: FormFieldType }[] = [
  { label: 'Text', value: 'text' },
  { label: 'Email', value: 'email' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Select', value: 'select' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Radio', value: 'radio' },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props { element: ElementNode }

export default function FormProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const [tab, setTab] = useState<Tab>('presets')

  if (element.content.type !== 'form') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  function patchField(fieldId: string, patch: Partial<FormField>) {
    patchContent({ fields: content.fields.map((f) => f.id === fieldId ? { ...f, ...patch } : f) })
  }

  function addField() {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type: 'text',
      label: 'New Field',
      placeholder: '',
      required: false,
    }
    patchContent({ fields: [...content.fields, newField] })
  }

  function removeField(fieldId: string) {
    patchContent({ fields: content.fields.filter((f) => f.id !== fieldId) })
  }

  const activeStyle = content.formStyle ?? 'default'

  return (
    <>
      <TabBar active={tab} onChange={setTab} />

      {tab === 'presets' && (
        <PropGroup label="Form style">
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
            Custom framework gets the full visual treatment. Bootstrap / MUI / Tailwind use native framework inputs.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '4px 0' }}>
            {STYLE_PRESETS.map((preset) => (
              <div key={preset.value} onClick={() => { patchContent({ formStyle: preset.value }); setTab('content') }}>
                <MiniPreview preset={preset} isActive={activeStyle === preset.value} />
              </div>
            ))}
          </div>
        </PropGroup>
      )}

      {tab === 'content' && (
        <>
          <PropGroup label="Submit">
            <PropRow label="Button label" stack>
              <TextInput
                value={content.submitLabel}
                onChange={(v) => patchContent({ submitLabel: v })}
                placeholder="Submit"
              />
            </PropRow>
          </PropGroup>

          <PropGroup label="Fields">
            {content.fields.map((field, i) => (
              <div
                key={field.id}
                style={{ borderTop: i > 0 ? '1px solid var(--color-border)' : undefined, paddingTop: i > 0 ? 8 : 0, marginTop: i > 0 ? 8 : 0, display: 'flex', flexDirection: 'column', gap: 4 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Field {i + 1}</span>
                  <button
                    onClick={() => removeField(field.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.7rem', padding: '2px 4px' }}
                  >✕</button>
                </div>
                <PropRow label="Label" stack>
                  <TextInput value={field.label} onChange={(v) => patchField(field.id, { label: v })} />
                </PropRow>
                <PropRow label="Type">
                  <SelectInput
                    value={field.type}
                    options={FIELD_TYPE_OPTIONS}
                    onChange={(v) => patchField(field.id, { type: v as FormFieldType })}
                  />
                </PropRow>
                {(field.type === 'text' || field.type === 'email' || field.type === 'textarea') && (
                  <PropRow label="Placeholder" stack>
                    <TextInput
                      value={field.placeholder ?? ''}
                      onChange={(v) => patchField(field.id, { placeholder: v })}
                    />
                  </PropRow>
                )}
              </div>
            ))}

            <button
              onClick={addField}
              style={{ marginTop: 10, width: '100%', height: 30, border: '1px dashed var(--color-border)', borderRadius: 4, backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              + Add field
            </button>
          </PropGroup>
        </>
      )}

      {tab === 'style' && (
        <>
          <PropGroup label="Colors">
            <PropRow label="Background">
              <ColorSwatch value={styles.backgroundColor ?? ''} onChange={(v) => patchStyle('backgroundColor', v)} />
            </PropRow>
            <PropRow label="Text color">
              <ColorSwatch value={styles.color ?? ''} onChange={(v) => patchStyle('color', v)} />
            </PropRow>
          </PropGroup>

          <PropGroup label="Spacing">
            <PropRow label="Padding" stack>
              <SpacingControl value={styles.padding ?? '0px'} onChange={(v) => patchStyle('padding', v)} />
            </PropRow>
            <PropRow label="Margin" stack>
              <SpacingControl value={styles.margin ?? '0px'} onChange={(v) => patchStyle('margin', v)} />
            </PropRow>
          </PropGroup>

          <CustomCSSField
            styles={styles}
            knownKeys={['backgroundColor', 'color', 'padding', 'margin']}
            onChange={(s) => updateElement(element.id, { styles: s })}
          />
        </>
      )}
    </>
  )
}
