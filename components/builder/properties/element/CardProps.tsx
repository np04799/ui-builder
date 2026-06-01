'use client'

import { useState } from 'react'
import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import NumberInput from '@/components/builder/controls/NumberInput'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'
import ImageUpload from '@/components/builder/controls/ImageUpload'

// ─── Types ────────────────────────────────────────────────────────────────────

type CardVariant = 'image-top' | 'horizontal' | 'pricing' | 'feature' | 'testimonial'

interface CardPreset {
  id: string
  name: string
  description: string
  layoutVariant: CardVariant
  bg: string
  color: string
  borderColor: string
  borderRadius: string
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const CARD_PRESETS: CardPreset[] = [
  {
    id: 'image-top',
    name: 'Image Card',
    description: 'Photo top · title · text · CTA',
    layoutVariant: 'image-top',
    bg: '#ffffff',
    color: '#111827',
    borderColor: '#e5e7eb',
    borderRadius: '12px',
  },
  {
    id: 'horizontal',
    name: 'Horizontal',
    description: 'Image left · text right (media card)',
    layoutVariant: 'horizontal',
    bg: '#ffffff',
    color: '#111827',
    borderColor: '#e5e7eb',
    borderRadius: '12px',
  },
  {
    id: 'pricing',
    name: 'Pricing',
    description: 'Price · feature list · CTA button',
    layoutVariant: 'pricing',
    bg: '#f8fafc',
    color: '#111827',
    borderColor: '#6366f1',
    borderRadius: '14px',
  },
  {
    id: 'feature',
    name: 'Feature',
    description: 'Icon top · heading · description',
    layoutVariant: 'feature',
    bg: '#ffffff',
    color: '#111827',
    borderColor: '#e5e7eb',
    borderRadius: '12px',
  },
  {
    id: 'testimonial',
    name: 'Testimonial',
    description: 'Stars · quote · avatar · author',
    layoutVariant: 'testimonial',
    bg: '#ffffff',
    color: '#374151',
    borderColor: '#e5e7eb',
    borderRadius: '12px',
  },
]

// ─── Mini SVG previews ────────────────────────────────────────────────────────

function MiniPreview({ preset }: { preset: CardPreset }) {
  const { bg, color, borderColor, layoutVariant } = preset

  if (layoutVariant === 'horizontal') {
    return (
      <div style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 6, overflow: 'hidden', display: 'flex', minHeight: 48 }}>
        <div style={{ width: 38, backgroundColor: '#d1d5db', flexShrink: 0 }} />
        <div style={{ padding: '6px 8px', flex: 1 }}>
          <div style={{ width: '70%', height: 5, backgroundColor: color, borderRadius: 2, marginBottom: 4, opacity: 0.8 }} />
          <div style={{ width: '90%', height: 3, backgroundColor: color, borderRadius: 2, marginBottom: 2, opacity: 0.35 }} />
          <div style={{ width: '80%', height: 3, backgroundColor: color, borderRadius: 2, opacity: 0.35 }} />
        </div>
      </div>
    )
  }

  if (layoutVariant === 'pricing') {
    return (
      <div style={{ background: bg, border: `2px solid ${borderColor}`, borderRadius: 6, padding: '6px 8px', textAlign: 'center', minHeight: 52 }}>
        <div style={{ fontSize: '0.5rem', fontWeight: 700, color, marginBottom: 3 }}>Pro Plan</div>
        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: borderColor, marginBottom: 4 }}>$29<span style={{ fontSize: '0.4rem', color, opacity: 0.6 }}>/mo</span></div>
        {['Feature one', 'Feature two'].map((f) => (
          <div key={f} style={{ fontSize: '0.4rem', color, opacity: 0.6, display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-start', marginBottom: 2 }}>
            <span style={{ color: '#10b981', fontSize: '0.45rem' }}>✓</span>{f}
          </div>
        ))}
      </div>
    )
  }

  if (layoutVariant === 'feature') {
    return (
      <div style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 6, padding: '8px', minHeight: 52 }}>
        <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: '#ede9fe', marginBottom: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem' }}>⚡</div>
        <div style={{ width: '65%', height: 5, backgroundColor: color, borderRadius: 2, marginBottom: 3, opacity: 0.8 }} />
        <div style={{ width: '90%', height: 3, backgroundColor: color, borderRadius: 2, opacity: 0.35 }} />
      </div>
    )
  }

  if (layoutVariant === 'testimonial') {
    return (
      <div style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 6, padding: '7px 8px', minHeight: 52 }}>
        <div style={{ display: 'flex', gap: 1, marginBottom: 4 }}>
          {[1,2,3,4,5].map((s) => <span key={s} style={{ fontSize: '0.45rem', color: '#f59e0b' }}>★</span>)}
        </div>
        <div style={{ width: '90%', height: 3, backgroundColor: color, borderRadius: 2, opacity: 0.4, marginBottom: 2 }} />
        <div style={{ width: '75%', height: 3, backgroundColor: color, borderRadius: 2, opacity: 0.4, marginBottom: 6 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#e0e7ff' }} />
          <div style={{ width: '50%', height: 3, backgroundColor: color, borderRadius: 2, opacity: 0.55 }} />
        </div>
      </div>
    )
  }

  // image-top (default)
  return (
    <div style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 6, overflow: 'hidden', minHeight: 60 }}>
      <div style={{ height: 26, backgroundColor: '#d1d5db' }} />
      <div style={{ padding: '6px 8px' }}>
        <div style={{ width: '60%', height: 5, backgroundColor: color, borderRadius: 2, marginBottom: 4, opacity: 0.8 }} />
        <div style={{ width: '90%', height: 3, backgroundColor: color, borderRadius: 2, opacity: 0.35 }} />
      </div>
    </div>
  )
}

function PresetPicker({ onApply }: { onApply: (p: CardPreset) => void }) {
  return (
    <div style={{ padding: '12px 0' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
        Each style has a different layout structure. Works across all UI frameworks.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CARD_PRESETS.map((p) => (
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

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props { element: ElementNode }

export default function CardProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const [tab, setTab] = useState<Tab>('presets')

  if (element.content.type !== 'card') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchImage(patch: Partial<typeof content.image>) {
    patchContent({ image: { ...content.image, ...patch } })
  }

  function patchButton(patch: Partial<NonNullable<typeof content.button>>) {
    patchContent({ button: { text: content.button?.text ?? 'Learn more', href: content.button?.href ?? '#', ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  function applyPreset(p: CardPreset) {
    updateElement(element.id, {
      styles: { ...styles, backgroundColor: p.bg, color: p.color, borderColor: p.borderColor, borderRadius: p.borderRadius },
      content: {
        ...content,
        layoutVariant: p.layoutVariant,
        // seed default content for pricing/feature/testimonial if not yet set
        ...(p.layoutVariant === 'pricing' && !content.price ? { price: '$29', priceUnit: '/mo', features: ['Feature one', 'Feature two', 'Feature three'] } : {}),
        ...(p.layoutVariant === 'feature' && !content.icon ? { icon: '⚡' } : {}),
        ...(p.layoutVariant === 'testimonial' && !content.author ? { author: 'Jane Smith', authorRole: 'CEO, Acme Inc.', rating: 5 } : {}),
      },
    })
    setTab('content')
  }

  const variant = content.layoutVariant ?? 'image-top'

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
          <PropGroup label="Card content">
            <PropRow label="Title" stack>
              <TextInput value={content.title} onChange={(v) => patchContent({ title: v })} placeholder="Card title" />
            </PropRow>
            <PropRow label="Description" stack>
              <TextInput value={content.description} onChange={(v) => patchContent({ description: v })} placeholder="Card description" />
            </PropRow>

            {/* Image — shown for image-top and horizontal */}
            {(variant === 'image-top' || variant === 'horizontal') && (
              <>
                <PropRow label="Image" stack>
                  <ImageUpload src={content.image.src} onChange={(v) => patchImage({ src: v })} />
                </PropRow>
                <PropRow label="Image alt" stack>
                  <TextInput value={content.image.alt} onChange={(v) => patchImage({ alt: v })} placeholder="Image description" />
                </PropRow>
              </>
            )}

            {/* Pricing extras */}
            {variant === 'pricing' && (
              <>
                <PropRow label="Price" stack>
                  <TextInput value={content.price ?? '$29'} onChange={(v) => patchContent({ price: v })} placeholder="$29" />
                </PropRow>
                <PropRow label="Price unit" stack>
                  <TextInput value={content.priceUnit ?? '/mo'} onChange={(v) => patchContent({ priceUnit: v })} placeholder="/mo" />
                </PropRow>
                <PropRow label="Features (one per line)" stack>
                  <textarea
                    value={(content.features ?? []).join('\n')}
                    onChange={(e) => patchContent({ features: e.target.value.split('\n').filter(Boolean) })}
                    rows={4}
                    placeholder={'Feature one\nFeature two\nFeature three'}
                    style={{ width: '100%', fontSize: '0.75rem', padding: '6px 8px', border: '1px solid var(--color-border)', borderRadius: 6, resize: 'vertical', fontFamily: 'inherit', color: 'var(--color-text-primary)', background: 'var(--color-bg)', boxSizing: 'border-box' }}
                  />
                </PropRow>
              </>
            )}

            {/* Feature extras */}
            {variant === 'feature' && (
              <PropRow label="Icon (emoji)" stack>
                <TextInput value={content.icon ?? '⚡'} onChange={(v) => patchContent({ icon: v })} placeholder="⚡" />
              </PropRow>
            )}

            {/* Testimonial extras */}
            {variant === 'testimonial' && (
              <>
                <PropRow label="Author name" stack>
                  <TextInput value={content.author ?? ''} onChange={(v) => patchContent({ author: v })} placeholder="Jane Smith" />
                </PropRow>
                <PropRow label="Author role" stack>
                  <TextInput value={content.authorRole ?? ''} onChange={(v) => patchContent({ authorRole: v })} placeholder="CEO, Acme Inc." />
                </PropRow>
                <PropRow label="Avatar image" stack>
                  <ImageUpload src={content.avatarSrc ?? ''} onChange={(v) => patchContent({ avatarSrc: v })} />
                </PropRow>
                <PropRow label="Rating (1–5)" stack>
                  <NumberInput value={String(content.rating ?? 5)} onChange={(v) => patchContent({ rating: Math.max(1, Math.min(5, Number(v))) })} placeholder="5" />
                </PropRow>
              </>
            )}

            {/* CTA button */}
            {variant !== 'feature' && variant !== 'testimonial' && (
              <>
                <PropRow label="Button text" stack>
                  <TextInput value={content.button?.text ?? ''} onChange={(v) => patchButton({ text: v })} placeholder="Learn more" />
                </PropRow>
                <PropRow label="Button link" stack>
                  <TextInput value={content.button?.href ?? ''} onChange={(v) => patchButton({ href: v })} placeholder="https://..." />
                </PropRow>
              </>
            )}
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
            <PropRow label="Border color">
              <ColorSwatch value={styles.borderColor ?? ''} onChange={(v) => patchStyle('borderColor', v)} />
            </PropRow>
            <PropRow label="Radius">
              <NumberInput value={styles.borderRadius ?? '12px'} onChange={(v) => patchStyle('borderRadius', v)} placeholder="12" />
            </PropRow>
          </PropGroup>

          <CustomCSSField
            styles={styles}
            knownKeys={['backgroundColor', 'color', 'borderColor', 'borderRadius']}
            onChange={(s) => updateElement(element.id, { styles: s })}
          />
        </>
      )}
    </>
  )
}
