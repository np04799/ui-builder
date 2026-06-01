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
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import ImageUpload from '@/components/builder/controls/ImageUpload'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

// ─── Presets ──────────────────────────────────────────────────────────────────

interface HamburgerPreset {
  id: string
  name: string
  description: string
  menuStyle: 'left-drawer' | 'right-drawer' | 'fullscreen'
  iconStyle: '3lines' | '3lines-x' | 'dots'
  animation: 'slide' | 'fade'
  panelBg: string
  textColor: string
  overlayColor: string
  drawerWidth?: number
}

const HAMBURGER_PRESETS: HamburgerPreset[] = [
  {
    id: 'minimal-left',
    name: 'Minimal Left',
    description: 'Clean white panel · slides from left',
    menuStyle: 'left-drawer',
    iconStyle: '3lines',
    animation: 'slide',
    panelBg: '#ffffff',
    textColor: '#111827',
    overlayColor: 'rgba(0,0,0,0.4)',
    drawerWidth: 300,
  },
  {
    id: 'dark-right',
    name: 'Dark Right',
    description: 'Dark panel · slides from right · animated X',
    menuStyle: 'right-drawer',
    iconStyle: '3lines-x',
    animation: 'slide',
    panelBg: '#1e1e2e',
    textColor: '#e2e8f0',
    overlayColor: 'rgba(0,0,0,0.6)',
    drawerWidth: 320,
  },
  {
    id: 'fullscreen-fade',
    name: 'Fullscreen',
    description: 'Full-viewport overlay · fade animation',
    menuStyle: 'fullscreen',
    iconStyle: '3lines-x',
    animation: 'fade',
    panelBg: '#0f172a',
    textColor: '#f8fafc',
    overlayColor: 'rgba(0,0,0,0.7)',
  },
]

// ─── Mini preview ─────────────────────────────────────────────────────────────

function MiniHamburgerPreview({ preset }: { preset: HamburgerPreset }) {
  const isRight = preset.menuStyle === 'right-drawer'
  const isFull = preset.menuStyle === 'fullscreen'
  const isDark = preset.panelBg.startsWith('#0') || preset.panelBg.startsWith('#1')

  return (
    <div style={{ background: '#f8fafc', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 52 }}>
      {/* Trigger bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        {!isRight && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 14, height: 2, borderRadius: 1, background: '#374151' }} />)}
          </div>
        )}
        <div style={{ fontSize: '0.6rem', color: '#6b7280', fontWeight: 600 }}>Brand</div>
        {isRight && (
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 14, height: 2, borderRadius: 1, background: '#374151' }} />)}
          </div>
        )}
      </div>
      {/* Panel swatch */}
      <div style={{
        width: isFull ? 36 : 22,
        height: 36,
        borderRadius: 4,
        background: preset.panelBg,
        border: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '6px 5px',
      }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ height: 2, borderRadius: 1, background: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)', width: i === 2 ? '60%' : '100%' }} />
        ))}
      </div>
    </div>
  )
}

function PresetPicker({ onApply }: { onApply: (p: HamburgerPreset) => void }) {
  return (
    <div style={{ padding: '12px 0' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
        Presets configure panel style, animation, and colors in one click.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {HAMBURGER_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onApply(p)}
            style={{ border: '1.5px solid var(--color-border)', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'none', textAlign: 'left', transition: 'border-color 150ms' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-primary)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)' }}
          >
            <MiniHamburgerPreview preset={p} />
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

const STYLE_OPTIONS = [
  { label: 'Left Drawer', value: 'left-drawer' },
  { label: 'Right Drawer', value: 'right-drawer' },
  { label: 'Full Screen', value: 'fullscreen' },
]

const ANIMATION_OPTIONS = [
  { label: 'Slide', value: 'slide' },
  { label: 'Fade', value: 'fade' },
]

const ICON_OPTIONS = [
  { label: '3 Lines (default)', value: '3lines' },
  { label: '3 Lines → X (animated)', value: '3lines-x' },
  { label: 'Dots (vertical)', value: 'dots' },
]

const TARGET_OPTIONS = [
  { label: 'Same tab', value: '_self' },
  { label: 'New tab', value: '_blank' },
]

const CTA_VARIANT_OPTIONS = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Outline', value: 'outline' },
  { label: 'Ghost', value: 'ghost' },
]

const LOGO_TYPE_OPTS = [
  { label: 'Text / wordmark', value: 'text' },
  { label: 'Image / SVG', value: 'image' },
]

const LOGO_ALIGN_OPTS = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]

const CLOSE_OPTIONS = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props { element: ElementNode }

export default function HamburgerMenuProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const [tab, setTab] = useState<Tab>('presets')

  if (element.content.type !== 'hamburger-menu') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  function applyPreset(p: HamburgerPreset) {
    updateElement(element.id, {
      content: {
        ...content,
        menuStyle: p.menuStyle,
        iconStyle: p.iconStyle,
        animation: p.animation,
        panelBg: p.panelBg,
        textColor: p.textColor,
        overlayColor: p.overlayColor,
        ...(p.drawerWidth ? { drawerWidth: p.drawerWidth } : {}),
      },
    })
    setTab('content')
  }

  function updateLink(id: string, field: string, value: string) {
    patchContent({
      links: content.links.map((l) => l.id === id ? { ...l, [field]: value } : l),
    })
  }

  function addLink() {
    patchContent({
      links: [
        ...content.links,
        { id: crypto.randomUUID(), label: `Link ${content.links.length + 1}`, href: '#', target: '_self' as const },
      ],
    })
  }

  function removeLink(id: string) {
    patchContent({ links: content.links.filter((l) => l.id !== id) })
  }

  return (
    <>
      <TabBar active={tab} onChange={setTab} />

      {/* ── Presets tab ─────────────────────────────────────────────────── */}
      {tab === 'presets' && (
        <PropGroup label="Style presets">
          <PresetPicker onApply={applyPreset} />
        </PropGroup>
      )}

      {/* ── Content tab ─────────────────────────────────────────────────── */}
      {tab === 'content' && (
        <>
          {/* Logo */}
          <PropGroup label="Logo">
            <PropRow label="Type">
              <SelectInput
                value={content.logoType ?? 'text'}
                options={LOGO_TYPE_OPTS}
                onChange={(v) => patchContent({ logoType: v as 'text' | 'image' })}
              />
            </PropRow>
            {(content.logoType ?? 'text') === 'text' ? (
              <PropRow label="Text" stack>
                <TextInput
                  value={content.logoText ?? ''}
                  onChange={(v) => patchContent({ logoText: v })}
                  placeholder="My Brand"
                />
              </PropRow>
            ) : (
              <PropRow label="Image" stack>
                <ImageUpload
                  src={content.logoSrc ?? ''}
                  onChange={(v) => patchContent({ logoSrc: v })}
                />
              </PropRow>
            )}
            <PropRow label="Alignment">
              <SelectInput
                value={content.logoAlign ?? 'left'}
                options={LOGO_ALIGN_OPTS}
                onChange={(v) => patchContent({ logoAlign: v as 'left' | 'center' | 'right' })}
              />
            </PropRow>
          </PropGroup>

          {/* Nav Links */}
          <PropGroup label="Nav Links">
            {content.links.map((link, i) => (
              <div
                key={link.id}
                style={{
                  borderTop: i > 0 ? '1px solid var(--color-border)' : undefined,
                  paddingTop: i > 0 ? 8 : 0,
                  marginTop: i > 0 ? 8 : 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    Link {i + 1}
                  </span>
                  <button
                    onClick={() => removeLink(link.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.7rem', padding: '2px 4px' }}
                  >
                    ✕
                  </button>
                </div>
                <PropRow label="Label" stack>
                  <TextInput value={link.label} onChange={(v) => updateLink(link.id, 'label', v)} placeholder="Home" />
                </PropRow>
                <PropRow label="URL" stack>
                  <TextInput value={link.href} onChange={(v) => updateLink(link.id, 'href', v)} placeholder="https://..." />
                </PropRow>
                <PropRow label="Opens in">
                  <SelectInput
                    value={link.target ?? '_self'}
                    options={TARGET_OPTIONS}
                    onChange={(v) => updateLink(link.id, 'target', v)}
                  />
                </PropRow>
              </div>
            ))}
            <button
              onClick={addLink}
              style={{ marginTop: 10, width: '100%', padding: '7px', fontSize: '0.8125rem', border: '1px dashed var(--color-border)', borderRadius: 6, background: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            >
              + Add link
            </button>
          </PropGroup>

          {/* CTA Button */}
          <PropGroup label="CTA Button (optional)">
            <PropRow label="Text" stack>
              <TextInput
                value={content.cta?.text ?? ''}
                onChange={(v) => patchContent({ cta: { text: v, href: content.cta?.href ?? '#', variant: content.cta?.variant ?? 'primary' } })}
                placeholder="Get Started"
              />
            </PropRow>
            <PropRow label="URL" stack>
              <TextInput
                value={content.cta?.href ?? ''}
                onChange={(v) => patchContent({ cta: { text: content.cta?.text ?? 'Get Started', href: v, variant: content.cta?.variant ?? 'primary' } })}
                placeholder="https://..."
              />
            </PropRow>
            <PropRow label="Variant">
              <SelectInput
                value={content.cta?.variant ?? 'primary'}
                options={CTA_VARIANT_OPTIONS}
                onChange={(v) => patchContent({ cta: { text: content.cta?.text ?? 'Get Started', href: content.cta?.href ?? '#', variant: v as ButtonVariant } })}
              />
            </PropRow>
            {content.cta && (
              <button
                onClick={() => patchContent({ cta: undefined })}
                style={{ width: '100%', padding: '5px', fontSize: '0.75rem', border: '1px solid #fca5a5', borderRadius: 4, background: 'none', color: '#ef4444', cursor: 'pointer', marginTop: 4 }}
              >
                Remove CTA
              </button>
            )}
          </PropGroup>
        </>
      )}

      {/* ── Style tab ───────────────────────────────────────────────────── */}
      {tab === 'style' && (
        <>
          {/* Behaviour */}
          <PropGroup label="Behaviour">
            <PropRow label="Menu style">
              <SelectInput
                value={content.menuStyle}
                options={STYLE_OPTIONS}
                onChange={(v) => patchContent({ menuStyle: v as typeof content.menuStyle })}
              />
            </PropRow>
            <PropRow label="Animation">
              <SelectInput
                value={content.animation}
                options={ANIMATION_OPTIONS}
                onChange={(v) => patchContent({ animation: v as typeof content.animation })}
              />
            </PropRow>
            <PropRow label="Icon style">
              <SelectInput
                value={content.iconStyle}
                options={ICON_OPTIONS}
                onChange={(v) => patchContent({ iconStyle: v as typeof content.iconStyle })}
              />
            </PropRow>
            <PropRow label="Close on overlay" stack>
              <SelectInput
                value={content.closeOnOverlay !== false ? 'true' : 'false'}
                options={CLOSE_OPTIONS}
                onChange={(v) => patchContent({ closeOnOverlay: v === 'true' })}
              />
            </PropRow>
            {content.menuStyle !== 'fullscreen' && (
              <PropRow label="Drawer width (px)" stack>
                <NumberInput
                  value={content.drawerWidth ? `${content.drawerWidth}` : ''}
                  placeholder="360"
                  unit=""
                  min={120}
                  max={1200}
                  onChange={(v) => patchContent({ drawerWidth: v ? parseInt(v) : undefined })}
                />
              </PropRow>
            )}
          </PropGroup>

          {/* Colours */}
          <PropGroup label="Colours">
            <PropRow label="Panel bg" stack>
              <ColorSwatch value={content.panelBg ?? '#ffffff'} onChange={(v) => patchContent({ panelBg: v })} />
            </PropRow>
            <PropRow label="Text color" stack>
              <ColorSwatch value={content.textColor ?? '#111827'} onChange={(v) => patchContent({ textColor: v })} />
            </PropRow>
            <PropRow label="Overlay color" stack>
              <TextInput value={content.overlayColor ?? 'rgba(0,0,0,0.5)'} onChange={(v) => patchContent({ overlayColor: v })} placeholder="rgba(0,0,0,0.5) or #hex" />
            </PropRow>
          </PropGroup>

          {/* Trigger bar */}
          <PropGroup label="Trigger Bar">
            <PropRow label="Bg color" stack>
              <ColorSwatch value={styles.backgroundColor ?? ''} onChange={(v) => patchStyle('backgroundColor', v)} />
            </PropRow>
            <PropRow label="Padding" stack>
              <TextInput value={styles.padding ?? ''} onChange={(v) => patchStyle('padding', v)} placeholder="e.g. 8px 16px" />
            </PropRow>
          </PropGroup>

          <CustomCSSField
            styles={styles}
            knownKeys={['backgroundColor', 'padding']}
            onChange={(s) => updateElement(element.id, { styles: s })}
          />
        </>
      )}
    </>
  )
}
