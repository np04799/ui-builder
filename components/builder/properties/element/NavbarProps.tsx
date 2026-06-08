'use client'

import { useState } from 'react'
import type { ElementNode } from '@/types/store.types'
import type { NavItem, ButtonVariant } from '@/types/builder.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import ImageUpload from '@/components/builder/controls/ImageUpload'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

// ─── Options ──────────────────────────────────────────────────────────────────

const LOGO_TYPE_OPTS = [
  { label: 'Text / wordmark', value: 'text' },
  { label: 'Image / SVG', value: 'image' },
]

const DESKTOP_LAYOUT_OPTS = [
  { label: 'Links right (default)', value: 'right' },
  { label: 'Links centered', value: 'center' },
]

const MOBILE_STYLE_OPTS = [
  { label: 'Drawer — left', value: 'drawer-left' },
  { label: 'Drawer — right', value: 'drawer-right' },
  { label: 'Full screen', value: 'fullscreen' },
]

const BREAKPOINT_OPTS = [
  { label: '640 px (sm)', value: '640' },
  { label: '768 px (md — default)', value: '768' },
  { label: '1024 px (lg)', value: '1024' },
]

const CTA_VARIANT_OPTS: { label: string; value: ButtonVariant }[] = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Outline', value: 'outline' },
  { label: 'Ghost', value: 'ghost' },
]

const BOOL_OPTS = [
  { label: 'Show', value: 'true' },
  { label: 'Hide', value: 'false' },
]

const TARGET_OPTS = [
  { label: 'Same tab', value: '_self' },
  { label: 'New tab', value: '_blank' },
]

// ─── Presets ──────────────────────────────────────────────────────────────────

interface NavbarPreset {
  id: string
  name: string
  description: string
  bg: string
  color: string
  layout: 'right' | 'center'
  ctaVariant: 'primary' | 'outline' | 'ghost'
  mobileMenuStyle: 'drawer-left' | 'drawer-right' | 'fullscreen'
  hasCta: boolean
}

const NAVBAR_PRESETS: NavbarPreset[] = [
  {
    id: 'clean-light',
    name: 'Clean Light',
    description: 'White nav, links right, primary CTA',
    bg: '#ffffff',   color: '#111827', layout: 'right',  ctaVariant: 'primary',
    mobileMenuStyle: 'drawer-left', hasCta: true,
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Dark background, ghost CTA',
    bg: '#111827',   color: '#f9fafb', layout: 'right',  ctaVariant: 'outline',
    mobileMenuStyle: 'drawer-right', hasCta: true,
  },
  {
    id: 'indigo',
    name: 'Indigo Brand',
    description: 'Brand-coloured bar, outline CTA',
    bg: '#4f46e5',   color: '#ffffff', layout: 'right',  ctaVariant: 'outline',
    mobileMenuStyle: 'drawer-left', hasCta: true,
  },
  {
    id: 'slate',
    name: 'Slate Pro',
    description: 'Slate dark, ghost CTA, links right',
    bg: '#1e293b',   color: '#e2e8f0', layout: 'right',  ctaVariant: 'ghost',
    mobileMenuStyle: 'drawer-left', hasCta: true,
  },
  {
    id: 'centered',
    name: 'Centered',
    description: 'White, links centered, minimal',
    bg: '#ffffff',   color: '#0f172a', layout: 'center', ctaVariant: 'primary',
    mobileMenuStyle: 'fullscreen', hasCta: true,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'No CTA, links only, clean',
    bg: '#ffffff',   color: '#374151', layout: 'right',  ctaVariant: 'ghost',
    mobileMenuStyle: 'drawer-left', hasCta: false,
  },
  {
    id: 'green',
    name: 'Green SaaS',
    description: 'Deep green, outline CTA',
    bg: '#065f46',   color: '#ffffff', layout: 'right',  ctaVariant: 'outline',
    mobileMenuStyle: 'drawer-right', hasCta: true,
  },
  {
    id: 'transparent',
    name: 'Transparent',
    description: 'No background, overlay use',
    bg: 'transparent', color: '#111827', layout: 'right', ctaVariant: 'outline',
    mobileMenuStyle: 'drawer-left', hasCta: true,
  },
]

function PresetPicker({ onApply }: { onApply: (p: NavbarPreset) => void }) {
  return (
    <div style={{ padding: '8px 0' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
        Apply a preset to change layout, colours, and CTA style at once.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {NAVBAR_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onApply(p)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: '1.5px solid var(--color-border)',
              borderRadius: 8,
              overflow: 'hidden',
              cursor: 'pointer',
              padding: 0,
              background: 'none',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-primary)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)' }}
          >
            {/* Mini navbar preview */}
            <div style={{
              width: 88,
              height: 44,
              flexShrink: 0,
              background: p.bg === 'transparent' ? 'repeating-linear-gradient(45deg,#e5e7eb 0,#e5e7eb 4px,#f9fafb 4px,#f9fafb 8px)' : p.bg,
              borderRight: `1px solid ${p.color === '#ffffff' ? 'rgba(255,255,255,0.15)' : '#e5e7eb'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px',
              gap: 4,
            }}>
              {/* Logo */}
              <span style={{ fontSize: '0.55rem', fontWeight: 800, color: p.color, letterSpacing: '-0.01em', whiteSpace: 'nowrap', flexShrink: 0 }}>Brand</span>
              {/* Links */}
              <div style={{ display: 'flex', gap: 4, flex: 1, justifyContent: p.layout === 'center' ? 'center' : 'flex-end' }}>
                {['Home', 'About'].map((l) => (
                  <span key={l} style={{ fontSize: '0.42rem', color: p.color, opacity: 0.75, fontWeight: 500 }}>{l}</span>
                ))}
              </div>
              {/* CTA */}
              {p.hasCta && (
                <span style={{
                  fontSize: '0.38rem', fontWeight: 700,
                  padding: '2px 5px', borderRadius: 4, flexShrink: 0,
                  background: p.ctaVariant === 'primary' ? p.color : 'transparent',
                  color: p.ctaVariant === 'primary' ? p.bg : p.color,
                  border: `1px solid ${p.color}${p.ctaVariant === 'ghost' ? '44' : ''}`,
                  opacity: 0.9,
                  whiteSpace: 'nowrap',
                }}>CTA</span>
              )}
            </div>
            {/* Label */}
            <div style={{ flex: 1, padding: '0 10px 0 0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{p.name}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginTop: 1 }}>{p.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

type Tab = 'presets' | 'brand' | 'links' | 'desktop' | 'mobile'

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'presets', label: 'Presets' },
    { id: 'brand', label: 'Brand' },
    { id: 'links', label: 'Links' },
    { id: 'desktop', label: 'Desktop' },
    { id: 'mobile', label: 'Mobile' },
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

// ─── Add-item button ──────────────────────────────────────────────────────────

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        marginTop: 8,
        width: '100%',
        padding: '7px',
        fontSize: '0.75rem',
        border: '1px dashed var(--color-border)',
        borderRadius: 6,
        background: 'none',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props { element: ElementNode }

export default function NavbarProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const [tab, setTab] = useState<Tab>('presets')

  if (element.content.type !== 'navbar') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  // ── Link helpers ────────────────────────────────────────────────────────────

  function patchItem(id: string, patch: Partial<NavItem>) {
    patchContent({ items: content.items.map((it) => it.id === id ? { ...it, ...patch } : it) })
  }

  function addItem() {
    patchContent({ items: [...content.items, { id: crypto.randomUUID(), label: 'New Link', href: '#', target: '_self' as const }] })
  }

  function removeItem(id: string) {
    patchContent({ items: content.items.filter((it) => it.id !== id) })
  }

  function addSubItem(parentId: string) {
    patchContent({
      items: content.items.map((it) =>
        it.id === parentId
          ? { ...it, children: [...(it.children ?? []), { id: crypto.randomUUID(), label: 'Sub link', href: '#' }] }
          : it
      ),
    })
  }

  function patchSubItem(parentId: string, childId: string, patch: { label?: string; href?: string }) {
    patchContent({
      items: content.items.map((it) =>
        it.id === parentId
          ? { ...it, children: (it.children ?? []).map((c) => c.id === childId ? { ...c, ...patch } : c) }
          : it
      ),
    })
  }

  function removeSubItem(parentId: string, childId: string) {
    patchContent({
      items: content.items.map((it) =>
        it.id === parentId
          ? { ...it, children: (it.children ?? []).filter((c) => c.id !== childId) }
          : it
      ),
    })
  }

  // ── CTA helpers ─────────────────────────────────────────────────────────────

  function patchCta(patch: Partial<NonNullable<typeof content.cta>>) {
    patchContent({ cta: { text: '', href: '#', variant: 'primary', ...content.cta, ...patch } })
  }

  // ── Preset apply ────────────────────────────────────────────────────────────

  function applyPreset(p: NavbarPreset) {
    updateElement(element.id, {
      styles: { ...styles, backgroundColor: p.bg, color: p.color },
      content: {
        ...content,
        desktopLayout: p.layout,
        mobilePanelBg: p.bg === 'transparent' ? '#ffffff' : p.bg,
        mobileTextColor: p.color === '#ffffff' ? '#111827' : p.color,
        mobileMenuStyle: p.mobileMenuStyle,
        cta: p.hasCta
          ? { text: content.cta?.text || 'Get Started', href: content.cta?.href || '#', variant: p.ctaVariant }
          : undefined,
      },
    })
    setTab('brand')
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <TabBar active={tab} onChange={setTab} />

      {/* ── PRESETS tab ───────────────────────────────────────────── */}
      {tab === 'presets' && (
        <PropGroup label="Style presets">
          <PresetPicker onApply={applyPreset} />
        </PropGroup>
      )}

      {/* ── BRAND tab ─────────────────────────────────────────────── */}
      {tab === 'brand' && (
        <>
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
                  placeholder="Brand name"
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

            <PropRow label="Desktop">
              <SelectInput
                value={String(content.logoVisibility?.desktop !== false)}
                options={BOOL_OPTS}
                onChange={(v) => patchContent({ logoVisibility: { ...content.logoVisibility, desktop: v === 'true' } })}
              />
            </PropRow>
            <PropRow label="Tablet">
              <SelectInput
                value={String(content.logoVisibility?.tablet !== false)}
                options={BOOL_OPTS}
                onChange={(v) => patchContent({ logoVisibility: { ...content.logoVisibility, tablet: v === 'true' } })}
              />
            </PropRow>
            <PropRow label="Mobile">
              <SelectInput
                value={String(content.logoVisibility?.mobile !== false)}
                options={BOOL_OPTS}
                onChange={(v) => patchContent({ logoVisibility: { ...content.logoVisibility, mobile: v === 'true' } })}
              />
            </PropRow>
          </PropGroup>

          <PropGroup label="CTA Button">
            <PropRow label="Text" stack>
              <TextInput value={content.cta?.text ?? ''} onChange={(v) => patchCta({ text: v })} placeholder="Get Started" />
            </PropRow>
            <PropRow label="URL" stack>
              <TextInput value={content.cta?.href ?? ''} onChange={(v) => patchCta({ href: v })} placeholder="https://..." />
            </PropRow>
            <PropRow label="Variant">
              <SelectInput
                value={content.cta?.variant ?? 'primary'}
                options={CTA_VARIANT_OPTS}
                onChange={(v) => patchCta({ variant: v as ButtonVariant })}
              />
            </PropRow>
            {content.cta && (
              <button
                onClick={() => patchContent({ cta: undefined })}
                style={{ marginTop: 6, width: '100%', padding: '5px', fontSize: '0.75rem', border: '1px solid #fca5a5', borderRadius: 4, background: 'none', color: '#ef4444', cursor: 'pointer' }}
              >
                Remove CTA
              </button>
            )}
            {!content.cta && (
              <AddBtn label="+ Add CTA button" onClick={() => patchCta({ text: 'Get Started', href: '#', variant: 'primary' })} />
            )}
          </PropGroup>

          <PropGroup label="Navbar style">
            <PropRow label="Background">
              <ColorSwatch value={styles.backgroundColor ?? '#ffffff'} onChange={(v) => patchStyle('backgroundColor', v)} />
            </PropRow>
            <PropRow label="Text / link color">
              <ColorSwatch value={styles.color ?? '#111827'} onChange={(v) => patchStyle('color', v)} />
            </PropRow>
          </PropGroup>

          <CustomCSSField styles={styles} knownKeys={['backgroundColor', 'color']} onChange={(s) => updateElement(element.id, { styles: s })} />
        </>
      )}

      {/* ── LINKS tab ─────────────────────────────────────────────── */}
      {tab === 'links' && (
        <PropGroup label="Navigation links">
          {content.items.map((item, i) => (
            <div key={item.id} style={{ borderTop: i > 0 ? '1px solid var(--color-border)' : undefined, paddingTop: i > 0 ? 10 : 0, marginTop: i > 0 ? 10 : 0 }}>
              {/* Link header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Link {i + 1}</span>
                <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.7rem', padding: '2px 4px' }}>✕</button>
              </div>

              <PropRow label="Label" stack>
                <TextInput value={item.label} onChange={(v) => patchItem(item.id, { label: v })} placeholder="Home" />
              </PropRow>
              <PropRow label="URL" stack>
                <TextInput value={item.href} onChange={(v) => patchItem(item.id, { href: v })} placeholder="#" />
              </PropRow>
              <PropRow label="Opens in">
                <SelectInput value={item.target ?? '_self'} options={TARGET_OPTS} onChange={(v) => patchItem(item.id, { target: v as '_self' | '_blank' })} />
              </PropRow>

              {/* Submenu */}
              {(item.children ?? []).length > 0 && (
                <div style={{ marginTop: 6, paddingLeft: 8, borderLeft: '2px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submenu</span>
                  {(item.children ?? []).map((child, ci) => (
                    <div key={child.id} style={{ marginTop: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>Sub {ci + 1}</span>
                        <button onClick={() => removeSubItem(item.id, child.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.65rem', padding: '1px 3px' }}>✕</button>
                      </div>
                      <PropRow label="Label" stack>
                        <TextInput value={child.label} onChange={(v) => patchSubItem(item.id, child.id, { label: v })} placeholder="Sub link" />
                      </PropRow>
                      <PropRow label="URL" stack>
                        <TextInput value={child.href} onChange={(v) => patchSubItem(item.id, child.id, { href: v })} placeholder="#" />
                      </PropRow>
                    </div>
                  ))}
                </div>
              )}
              <AddBtn label="+ Add submenu item" onClick={() => addSubItem(item.id)} />
            </div>
          ))}
          <AddBtn label="+ Add link" onClick={addItem} />
        </PropGroup>
      )}

      {/* ── DESKTOP tab ───────────────────────────────────────────── */}
      {tab === 'desktop' && (
        <>
          <PropGroup label="Layout">
            <PropRow label="Links position">
              <SelectInput
                value={content.desktopLayout ?? 'right'}
                options={DESKTOP_LAYOUT_OPTS}
                onChange={(v) => patchContent({ desktopLayout: v as 'right' | 'center' })}
              />
            </PropRow>
          </PropGroup>
          <PropGroup label="Preview note">
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              The desktop view renders when the canvas is wider than the mobile breakpoint set in the Mobile tab.
            </p>
          </PropGroup>
        </>
      )}

      {/* ── MOBILE tab ────────────────────────────────────────────── */}
      {tab === 'mobile' && (
        <>
          <PropGroup label="Breakpoint">
            <PropRow label="Switch at">
              <SelectInput
                value={String(content.mobileBreakpoint ?? 768)}
                options={BREAKPOINT_OPTS}
                onChange={(v) => patchContent({ mobileBreakpoint: Number(v) })}
              />
            </PropRow>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '4px 0 0', lineHeight: 1.4 }}>
              Below this width the hamburger menu appears. Resize the canvas to preview.
            </p>
          </PropGroup>

          <PropGroup label="Mobile menu">
            <PropRow label="Menu style">
              <SelectInput
                value={content.mobileMenuStyle ?? 'drawer-left'}
                options={MOBILE_STYLE_OPTS}
                onChange={(v) => patchContent({ mobileMenuStyle: v as typeof content.mobileMenuStyle })}
              />
            </PropRow>
            <PropRow label="Panel background">
              <ColorSwatch value={content.mobilePanelBg ?? '#ffffff'} onChange={(v) => patchContent({ mobilePanelBg: v })} />
            </PropRow>
            <PropRow label="Text color">
              <ColorSwatch value={content.mobileTextColor ?? '#111827'} onChange={(v) => patchContent({ mobileTextColor: v })} />
            </PropRow>
            <PropRow label="Show CTA">
              <SelectInput
                value={String(content.showCtaMobile !== false)}
                options={BOOL_OPTS}
                onChange={(v) => patchContent({ showCtaMobile: v === 'true' })}
              />
            </PropRow>
          </PropGroup>
        </>
      )}
    </>
  )
}
