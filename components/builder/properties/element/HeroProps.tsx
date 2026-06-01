'use client'

import { useState } from 'react'
import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import NumberInput from '@/components/builder/controls/NumberInput'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'
import ImageUpload from '@/components/builder/controls/ImageUpload'

type LayoutVariant = 'centered' | 'split-left' | 'split-right' | 'gradient-dark' | 'minimal'

// ─── Presets ──────────────────────────────────────────────────────────────────

interface HeroPreset {
  id: string
  name: string
  description: string
  layoutVariant: LayoutVariant
  bg: string
  color: string
  hasDualCta: boolean
  hasBadge: boolean
}

const HERO_PRESETS: HeroPreset[] = [
  {
    id: 'centered-light',
    name: 'Centered',
    description: 'Full-width centered text + CTA',
    layoutVariant: 'centered',
    bg: '#f0f4ff',
    color: '#111827',
    hasDualCta: true,
    hasBadge: true,
  },
  {
    id: 'split-left',
    name: 'Split Left',
    description: 'Text left · Image right',
    layoutVariant: 'split-left',
    bg: '#ffffff',
    color: '#111827',
    hasDualCta: true,
    hasBadge: true,
  },
  {
    id: 'split-right',
    name: 'Split Right',
    description: 'Image left · Text right',
    layoutVariant: 'split-right',
    bg: '#f8fafc',
    color: '#111827',
    hasDualCta: true,
    hasBadge: false,
  },
  {
    id: 'gradient-dark',
    name: 'Gradient Dark',
    description: 'Dark gradient · Large headline',
    layoutVariant: 'gradient-dark',
    bg: '#0f172a',
    color: '#ffffff',
    hasDualCta: true,
    hasBadge: true,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean white · Left-aligned · Arrow CTA',
    layoutVariant: 'minimal',
    bg: '#ffffff',
    color: '#111827',
    hasDualCta: true,
    hasBadge: true,
  },
]

function MiniHeroPreview({ preset }: { preset: HeroPreset }) {
  const { bg, color, layoutVariant } = preset
  const isLight = bg === '#ffffff' || bg === '#f0f4ff' || bg === '#f8fafc'
  const textColor = isLight ? '#111827' : color
  const subColor = isLight ? '#6b7280' : 'rgba(255,255,255,0.6)'
  const accentColor = layoutVariant === 'gradient-dark' ? '#a5b4fc' : '#4f46e5'

  if (layoutVariant === 'split-left' || layoutVariant === 'split-right') {
    const textFirst = layoutVariant === 'split-left'
    return (
      <div style={{ background: bg, display: 'flex', alignItems: 'stretch', minHeight: 52, overflow: 'hidden' }}>
        {textFirst ? (
          <>
            <div style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
              <div style={{ width: 16, height: 4, borderRadius: 2, background: accentColor, marginBottom: 2 }} />
              <div style={{ fontSize: '0.55rem', fontWeight: 800, color: textColor, lineHeight: 1.2 }}>Big Headline</div>
              <div style={{ fontSize: '0.42rem', color: subColor, lineHeight: 1.3 }}>Subtext goes here for context</div>
              <div style={{ width: 36, height: 8, borderRadius: 3, background: accentColor, marginTop: 3 }} />
            </div>
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)', minHeight: 52 }} />
          </>
        ) : (
          <>
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)', minHeight: 52 }} />
            <div style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
              <div style={{ width: 16, height: 4, borderRadius: 2, background: accentColor, marginBottom: 2 }} />
              <div style={{ fontSize: '0.55rem', fontWeight: 800, color: textColor, lineHeight: 1.2 }}>Big Headline</div>
              <div style={{ fontSize: '0.42rem', color: subColor, lineHeight: 1.3 }}>Subtext goes here for context</div>
              <div style={{ width: 36, height: 8, borderRadius: 3, background: accentColor, marginTop: 3 }} />
            </div>
          </>
        )}
      </div>
    )
  }

  if (layoutVariant === 'gradient-dark') {
    return (
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minHeight: 52 }}>
        <div style={{ fontSize: '0.45rem', padding: '1px 6px', borderRadius: 999, background: 'rgba(99,102,241,0.3)', color: '#a5b4fc', fontWeight: 600 }}>New Feature</div>
        <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: 1.2 }}>Big Headline Here</div>
        <div style={{ fontSize: '0.4rem', color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>Subtext goes here</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
          <div style={{ width: 28, height: 7, borderRadius: 3, background: '#fff' }} />
          <div style={{ width: 28, height: 7, borderRadius: 3, border: '1px solid rgba(255,255,255,0.3)' }} />
        </div>
      </div>
    )
  }

  if (layoutVariant === 'minimal') {
    return (
      <div style={{ background: '#fff', padding: '8px 10px 8px 14px', borderLeft: '3px solid #4f46e5', display: 'flex', flexDirection: 'column', gap: 3, minHeight: 52, justifyContent: 'center' }}>
        <div style={{ fontSize: '0.45rem', padding: '1px 6px', borderRadius: 999, background: '#eef2ff', color: '#4f46e5', fontWeight: 600, alignSelf: 'flex-start' }}>Badge</div>
        <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>Big Headline Here</div>
        <div style={{ fontSize: '0.4rem', color: '#6b7280' }}>Short subtext description</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 2 }}>
          <div style={{ width: 28, height: 7, borderRadius: 3, background: '#4f46e5' }} />
          <div style={{ fontSize: '0.4rem', color: '#4f46e5' }}>Learn more →</div>
        </div>
      </div>
    )
  }

  // centered
  return (
    <div style={{ background: bg, padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minHeight: 52 }}>
      <div style={{ fontSize: '0.45rem', padding: '1px 6px', borderRadius: 999, background: 'rgba(79,70,229,0.1)', color: '#4f46e5', fontWeight: 600 }}>Badge text</div>
      <div style={{ fontSize: '0.62rem', fontWeight: 800, color: textColor, textAlign: 'center', lineHeight: 1.2 }}>Big Headline Here</div>
      <div style={{ fontSize: '0.4rem', color: subColor, textAlign: 'center' }}>Subtext goes here</div>
      <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
        <div style={{ width: 28, height: 7, borderRadius: 3, background: '#4f46e5' }} />
        <div style={{ width: 28, height: 7, borderRadius: 3, border: '1px solid #d1d5db' }} />
      </div>
    </div>
  )
}

function PresetPicker({ onApply }: { onApply: (p: HeroPreset) => void }) {
  return (
    <div style={{ padding: '12px 0' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
        Each style has a different layout. Pick one and customise content after.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {HERO_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onApply(p)}
            style={{ border: '1.5px solid var(--color-border)', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'none', textAlign: 'left', transition: 'border-color 150ms' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-primary)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)' }}
          >
            <MiniHeroPreview preset={p} />
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
          style={{
            flex: 1,
            height: 34,
            border: 'none',
            borderBottom: active === t.id ? '2px solid var(--color-primary)' : '2px solid transparent',
            background: 'none',
            color: active === t.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: active === t.id ? 600 : 400,
            fontSize: '0.6875rem',
            cursor: 'pointer',
            transition: 'color 150ms',
            padding: 0,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props { element: ElementNode }

export default function HeroProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const [tab, setTab] = useState<Tab>('presets')

  if (element.content.type !== 'hero') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchCta(patch: Partial<NonNullable<typeof content.cta>>) {
    updateElement(element.id, { content: { ...content, cta: { ...content.cta, ...patch } } })
  }

  function patchCtaSecondary(patch: Partial<NonNullable<typeof content.ctaSecondary>>) {
    updateElement(element.id, { content: { ...content, ctaSecondary: { text: '', href: '#', ...content.ctaSecondary, ...patch } } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  function applyPreset(p: HeroPreset) {
    updateElement(element.id, {
      styles: { ...styles, ...(p.layoutVariant !== 'gradient-dark' && { backgroundColor: p.bg }) },
      content: {
        ...content,
        layoutVariant: p.layoutVariant,
        badge: p.hasBadge ? (content.badge || 'New') : undefined,
        ctaSecondary: p.hasDualCta ? (content.ctaSecondary || { text: 'Learn More', href: '#' }) : undefined,
      },
    })
    setTab('content')
  }

  const hasCta = !!content.cta
  const hasCtaSecondary = !!content.ctaSecondary

  return (
    <>
      <TabBar active={tab} onChange={setTab} />

      {/* ── PRESETS ── */}
      {tab === 'presets' && (
        <PropGroup label="Hero style presets">
          <PresetPicker onApply={applyPreset} />
        </PropGroup>
      )}

      {/* ── CONTENT ── */}
      {tab === 'content' && (
        <>
          <PropGroup label="Text">
            <PropRow label="Badge" stack>
              <TextInput
                value={content.badge ?? ''}
                onChange={(v) => patchContent({ badge: v || undefined })}
                placeholder="e.g. New · Beta · v2.0"
              />
            </PropRow>
            <PropRow label="Heading" stack>
              <TextInput
                value={content.heading}
                onChange={(v) => patchContent({ heading: v })}
                placeholder="Your heading…"
              />
            </PropRow>
            <PropRow label="Paragraph" stack>
              <TextInput
                value={content.paragraph}
                onChange={(v) => patchContent({ paragraph: v })}
                placeholder="Subheading text…"
              />
            </PropRow>
          </PropGroup>

          <PropGroup label="Primary CTA">
            <PropRow label="Text" stack>
              <TextInput value={content.cta.text} onChange={(v) => patchCta({ text: v })} placeholder="Get Started" />
            </PropRow>
            <PropRow label="Link" stack>
              <TextInput value={content.cta.href} onChange={(v) => patchCta({ href: v })} placeholder="https://..." />
            </PropRow>
          </PropGroup>

          <PropGroup label="Secondary CTA">
            {hasCtaSecondary ? (
              <>
                <PropRow label="Text" stack>
                  <TextInput value={content.ctaSecondary!.text} onChange={(v) => patchCtaSecondary({ text: v })} placeholder="Learn More" />
                </PropRow>
                <PropRow label="Link" stack>
                  <TextInput value={content.ctaSecondary!.href} onChange={(v) => patchCtaSecondary({ href: v })} placeholder="https://..." />
                </PropRow>
                <button
                  onClick={() => patchContent({ ctaSecondary: undefined })}
                  style={{ marginTop: 4, width: '100%', padding: '5px', fontSize: '0.75rem', border: '1px solid #fca5a5', borderRadius: 4, background: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  Remove secondary CTA
                </button>
              </>
            ) : (
              <button
                onClick={() => patchCtaSecondary({ text: 'Learn More', href: '#' })}
                style={{ width: '100%', padding: '7px', fontSize: '0.75rem', border: '1px dashed var(--color-border)', borderRadius: 6, background: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                + Add secondary CTA
              </button>
            )}
          </PropGroup>

          <PropGroup label="Background image">
            <PropRow label="Image" stack>
              <ImageUpload
                src={content.backgroundImage ?? ''}
                onChange={(v) => patchContent({ backgroundImage: v || undefined })}
              />
            </PropRow>
          </PropGroup>

          <PropGroup label="Layout">
            <PropRow label="Variant" stack>
              <select
                value={content.layoutVariant ?? 'centered'}
                onChange={(e) => patchContent({ layoutVariant: e.target.value as LayoutVariant })}
                style={{ width: '100%', padding: '6px 8px', fontSize: '0.8rem', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text-primary)', cursor: 'pointer' }}
              >
                <option value="centered">Centered</option>
                <option value="split-left">Split Left (text · image)</option>
                <option value="split-right">Split Right (image · text)</option>
                <option value="gradient-dark">Gradient Dark</option>
                <option value="minimal">Minimal</option>
              </select>
            </PropRow>
          </PropGroup>
        </>
      )}

      {/* ── STYLE ── */}
      {tab === 'style' && (
        <>
          <PropGroup label="Colors">
            <PropRow label="Background">
              <ColorSwatch value={styles.backgroundColor ?? '#f0f4ff'} onChange={(v) => patchStyle('backgroundColor', v)} />
            </PropRow>
            <PropRow label="Text color">
              <ColorSwatch value={styles.color ?? ''} onChange={(v) => patchStyle('color', v)} />
            </PropRow>
          </PropGroup>
          <PropGroup label="Size">
            <PropRow label="Min height">
              <NumberInput value={styles.minHeight ?? '400px'} onChange={(v) => patchStyle('minHeight', v)} placeholder="400" />
            </PropRow>
            <PropRow label="Radius">
              <NumberInput value={styles.borderRadius ?? '12px'} onChange={(v) => patchStyle('borderRadius', v)} placeholder="12" />
            </PropRow>
          </PropGroup>
          <PropGroup label="Spacing">
            <PropRow label="Padding" stack>
              <SpacingControl value={styles.padding ?? '72px 24px'} onChange={(v) => patchStyle('padding', v)} />
            </PropRow>
          </PropGroup>
          <CustomCSSField
            styles={styles}
            knownKeys={['backgroundColor', 'color', 'minHeight', 'borderRadius', 'padding']}
            onChange={(s) => updateElement(element.id, { styles: s })}
          />
        </>
      )}
    </>
  )
}
