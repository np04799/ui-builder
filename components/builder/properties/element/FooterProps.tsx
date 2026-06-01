'use client'

import { useState } from 'react'
import type { ElementNode } from '@/types/store.types'
import type { NavItem } from '@/types/builder.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

// ─── Types ────────────────────────────────────────────────────────────────────

type FooterVariant = 'simple' | 'columns' | 'minimal' | 'centered-brand' | 'mega'

interface FooterPreset {
  id: string
  name: string
  description: string
  layoutVariant: FooterVariant
  bg: string
  color: string
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const FOOTER_PRESETS: FooterPreset[] = [
  {
    id: 'simple',
    name: 'Simple',
    description: 'Links row · copyright · clean',
    layoutVariant: 'simple',
    bg: '#1f2937',
    color: '#9ca3af',
  },
  {
    id: 'columns',
    name: 'Columns',
    description: 'Brand + 3-col links + socials',
    layoutVariant: 'columns',
    bg: '#111827',
    color: '#9ca3af',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Dark strip · copyright only',
    layoutVariant: 'minimal',
    bg: '#0f172a',
    color: '#475569',
  },
  {
    id: 'centered-brand',
    name: 'Centered Brand',
    description: 'Logo + tagline centered + socials',
    layoutVariant: 'centered-brand',
    bg: '#1e293b',
    color: '#94a3b8',
  },
  {
    id: 'mega',
    name: 'Mega Footer',
    description: '4-col grid + bottom bar + socials',
    layoutVariant: 'mega',
    bg: '#030712',
    color: '#6b7280',
  },
]

// ─── Mini SVG previews ────────────────────────────────────────────────────────

function MiniPreview({ preset }: { preset: FooterPreset }) {
  const { bg, color, layoutVariant } = preset

  if (layoutVariant === 'columns') {
    return (
      <div style={{ background: bg, padding: '8px 10px', minHeight: 54 }}>
        <div style={{ display: 'flex', gap: 14, marginBottom: 8 }}>
          {/* brand col */}
          <div style={{ minWidth: 36 }}>
            <div style={{ width: 28, height: 4, backgroundColor: color, borderRadius: 2, marginBottom: 4, opacity: 0.9 }} />
            <div style={{ width: 36, height: 3, backgroundColor: color, borderRadius: 2, opacity: 0.4 }} />
          </div>
          {[0, 1, 2].map((c) => (
            <div key={c} style={{ minWidth: 30 }}>
              <div style={{ width: 26, height: 3, backgroundColor: color, borderRadius: 2, marginBottom: 4, opacity: 0.6 }} />
              {[0, 1].map((r) => <div key={r} style={{ width: 30, height: 2, backgroundColor: color, borderRadius: 2, marginBottom: 2, opacity: 0.3 }} />)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${color}30`, paddingTop: 5, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 60, height: 2, backgroundColor: color, borderRadius: 2, opacity: 0.3 }} />
        </div>
      </div>
    )
  }

  if (layoutVariant === 'minimal') {
    return (
      <div style={{ background: bg, padding: '10px', minHeight: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 80, height: 3, backgroundColor: color, borderRadius: 2, opacity: 0.5 }} />
      </div>
    )
  }

  if (layoutVariant === 'centered-brand') {
    return (
      <div style={{ background: bg, padding: '8px', textAlign: 'center', minHeight: 52 }}>
        <div style={{ width: 32, height: 4, backgroundColor: color, borderRadius: 2, margin: '0 auto 4px', opacity: 0.9 }} />
        <div style={{ width: 50, height: 2, backgroundColor: color, borderRadius: 2, margin: '0 auto 6px', opacity: 0.4 }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 18, height: 2, backgroundColor: color, borderRadius: 2, opacity: 0.4 }} />)}
        </div>
      </div>
    )
  }

  if (layoutVariant === 'mega') {
    return (
      <div style={{ background: bg, minHeight: 58 }}>
        <div style={{ padding: '8px 10px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 4 }}>
          {[0, 1, 2, 3].map((c) => (
            <div key={c}>
              <div style={{ width: '70%', height: 3, backgroundColor: color, borderRadius: 2, marginBottom: 4, opacity: 0.7 }} />
              {[0, 1].map((r) => <div key={r} style={{ width: '90%', height: 2, backgroundColor: color, borderRadius: 2, marginBottom: 2, opacity: 0.25 }} />)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${color}20`, padding: '5px 10px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: 50, height: 2, backgroundColor: color, borderRadius: 2, opacity: 0.3 }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 12, height: 2, backgroundColor: color, borderRadius: 2, opacity: 0.3 }} />)}
          </div>
        </div>
      </div>
    )
  }

  // simple (default)
  return (
    <div style={{ background: bg, padding: '10px', textAlign: 'center', minHeight: 42 }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 22, height: 3, backgroundColor: color, borderRadius: 2, opacity: 0.5 }} />)}
      </div>
      <div style={{ width: 70, height: 2, backgroundColor: color, borderRadius: 2, margin: '0 auto', opacity: 0.3 }} />
    </div>
  )
}

function PresetPicker({ onApply }: { onApply: (p: FooterPreset) => void }) {
  return (
    <div style={{ padding: '12px 0' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
        Each style has a different layout structure. Works across all UI frameworks.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FOOTER_PRESETS.map((p) => (
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

// ─── Add button ───────────────────────────────────────────────────────────────

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ marginTop: 8, width: '100%', padding: '7px', fontSize: '0.75rem', border: '1px dashed var(--color-border)', borderRadius: 6, background: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
    >
      {label}
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props { element: ElementNode }

export default function FooterProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const [tab, setTab] = useState<Tab>('presets')

  if (element.content.type !== 'footer') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchLink(id: string, patch: Partial<NavItem>) {
    patchContent({ links: content.links.map((l) => l.id === id ? { ...l, ...patch } : l) })
  }

  function addLink() {
    patchContent({ links: [...content.links, { id: crypto.randomUUID(), label: 'New Link', href: '#' }] })
  }

  function removeLink(id: string) {
    patchContent({ links: content.links.filter((l) => l.id !== id) })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  function applyPreset(p: FooterPreset) {
    updateElement(element.id, {
      styles: { ...styles, backgroundColor: p.bg, color: p.color },
      content: { ...content, layoutVariant: p.layoutVariant },
    })
    setTab('content')
  }

  const variant = content.layoutVariant ?? 'simple'

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
          <PropGroup label="Brand">
            <PropRow label="Name" stack>
              <TextInput
                value={content.brand?.name ?? ''}
                onChange={(v) => patchContent({ brand: { ...(content.brand ?? { name: '' }), name: v } })}
                placeholder="YourBrand"
              />
            </PropRow>
            <PropRow label="Tagline" stack>
              <TextInput
                value={content.brand?.tagline ?? ''}
                onChange={(v) => patchContent({ brand: { ...(content.brand ?? { name: '' }), tagline: v } })}
                placeholder="Short tagline..."
              />
            </PropRow>
          </PropGroup>

          <PropGroup label="Copyright">
            <PropRow label="Text" stack>
              <TextInput
                value={content.copyright}
                onChange={(v) => patchContent({ copyright: v })}
                placeholder="© 2024 Company"
              />
            </PropRow>
          </PropGroup>

          {/* Links — shown for simple, centered-brand, mega */}
          {(variant === 'simple' || variant === 'centered-brand' || variant === 'mega') && (
            <PropGroup label="Links">
              {content.links.map((link, i) => (
                <div
                  key={link.id}
                  style={{ borderTop: i > 0 ? '1px solid var(--color-border)' : undefined, paddingTop: i > 0 ? 8 : 0, marginTop: i > 0 ? 8 : 0, display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Link {i + 1}</span>
                    <button onClick={() => removeLink(link.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.7rem', padding: '2px 4px' }}>✕</button>
                  </div>
                  <PropRow label="Label" stack>
                    <TextInput value={link.label} onChange={(v) => patchLink(link.id, { label: v })} />
                  </PropRow>
                  <PropRow label="URL" stack>
                    <TextInput value={link.href} onChange={(v) => patchLink(link.id, { href: v })} placeholder="#" />
                  </PropRow>
                </div>
              ))}
              <AddBtn label="+ Add link" onClick={addLink} />
            </PropGroup>
          )}

          {/* Column links — shown for columns, mega */}
          {(variant === 'columns' || variant === 'mega') && (
            <PropGroup label="Column links">
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '0 0 8px', lineHeight: 1.5 }}>
                Column structure is seeded from defaults. Use the exported code to customize column headings and items.
              </p>
            </PropGroup>
          )}
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
          </PropGroup>

          <CustomCSSField
            styles={styles}
            knownKeys={['backgroundColor', 'color', 'padding']}
            onChange={(s) => updateElement(element.id, { styles: s })}
          />
        </>
      )}
    </>
  )
}
