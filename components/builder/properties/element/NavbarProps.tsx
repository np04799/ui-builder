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

const LAYOUT_VARIANT_OPTS = [
  { label: 'Classic — logo left, links right', value: 'classic' },
  { label: 'Centered — 2-row, links below logo', value: 'centered' },
  { label: 'Split — logo · center links · CTA', value: 'split' },
  { label: 'Minimal — logo + contact + hamburger', value: 'minimal' },
  { label: 'Brand Hero — large logo + stacked nav', value: 'brand-hero' },
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

type LayoutVariant = 'classic' | 'centered' | 'split' | 'minimal' | 'brand-hero'

interface NavbarPreset {
  id: string
  name: string
  description: string
  bg: string
  color: string
  layoutVariant: LayoutVariant
  ctaVariant: 'primary' | 'outline' | 'ghost'
  accentColor?: string
}

const NAVBAR_PRESETS: NavbarPreset[] = [
  {
    id: 'classic-light',
    name: 'Classic Light',
    description: 'Logo left · Links right · CTA',
    bg: '#ffffff',
    color: '#111827',
    layoutVariant: 'classic',
    ctaVariant: 'primary',
  },
  {
    id: 'centered-dark',
    name: 'Centered',
    description: 'Logo top-center · Links below',
    bg: '#0f172a',
    color: '#f1f5f9',
    layoutVariant: 'centered',
    ctaVariant: 'outline',
  },
  {
    id: 'split-indigo',
    name: 'Split Nav',
    description: 'Logo · Links center · CTA right',
    bg: '#4f46e5',
    color: '#ffffff',
    layoutVariant: 'split',
    ctaVariant: 'outline',
  },
  {
    id: 'minimal-slate',
    name: 'Minimal',
    description: 'Logo · Email/phone · Hamburger',
    bg: '#1e293b',
    color: '#e2e8f0',
    layoutVariant: 'minimal',
    ctaVariant: 'ghost',
  },
  {
    id: 'brand-hero-green',
    name: 'Brand Hero',
    description: 'Large logo + tagline · Nav right',
    bg: '#065f46',
    color: '#ffffff',
    layoutVariant: 'brand-hero',
    ctaVariant: 'outline',
  },
]

// Mini SVG previews for each layout structure
function MiniPreview({ preset }: { preset: NavbarPreset }) {
  const { bg, color, layoutVariant, ctaVariant } = preset
  const linkColor = color
  const ctaBg = ctaVariant === 'primary' ? color : 'transparent'
  const ctaColor = ctaVariant === 'primary' ? bg : color

  if (layoutVariant === 'centered') {
    return (
      <div style={{ background: bg, padding: '6px 8px', minHeight: 46 }}>
        {/* Row 1: centered logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: '0.58rem', fontWeight: 800, color: linkColor, letterSpacing: '-0.01em' }}>Brand</span>
        </div>
        {/* Row 2: centered links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, borderTop: `1px solid ${color}22`, paddingTop: 4 }}>
          {['Home', 'About', 'Blog'].map((l) => (
            <span key={l} style={{ fontSize: '0.44rem', color: linkColor, opacity: 0.75 }}>{l}</span>
          ))}
          <span style={{ fontSize: '0.4rem', padding: '1px 4px', borderRadius: 3, background: ctaBg, color: ctaColor, border: `1px solid ${color}`, opacity: 0.9 }}>CTA</span>
        </div>
      </div>
    )
  }

  if (layoutVariant === 'split') {
    return (
      <div style={{ background: bg, padding: '8px 8px', display: 'flex', alignItems: 'center', minHeight: 36 }}>
        <span style={{ fontSize: '0.58rem', fontWeight: 800, color: linkColor, marginRight: 4 }}>Brand</span>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4 }}>
          {['Home', 'About', 'Blog'].map((l) => (
            <span key={l} style={{ fontSize: '0.44rem', color: linkColor, opacity: 0.75 }}>{l}</span>
          ))}
        </div>
        <span style={{ fontSize: '0.4rem', padding: '1px 4px', borderRadius: 3, background: ctaBg, color: ctaColor, border: `1px solid ${color}`, opacity: 0.9 }}>CTA</span>
      </div>
    )
  }

  if (layoutVariant === 'minimal') {
    return (
      <div style={{ background: bg, padding: '8px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 36 }}>
        <span style={{ fontSize: '0.58rem', fontWeight: 800, color: linkColor }}>Brand</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: '0.42rem', color: linkColor, opacity: 0.65 }}>hello@co.com</span>
          {/* Hamburger icon */}
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 1.5h8M1 4h8M1 6.5h8" />
          </svg>
        </div>
      </div>
    )
  }

  if (layoutVariant === 'brand-hero') {
    return (
      <div style={{ background: bg, display: 'flex', alignItems: 'stretch', minHeight: 46, overflow: 'hidden' }}>
        <div style={{ padding: '6px 8px', borderRight: `1px solid ${color}20`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 800, color: linkColor, lineHeight: 1 }}>Brand</span>
          <span style={{ fontSize: '0.38rem', color: linkColor, opacity: 0.55, marginTop: 1 }}>tagline</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px', flexWrap: 'wrap' }}>
          {['Home', 'About', 'Blog'].map((l) => (
            <span key={l} style={{ fontSize: '0.44rem', color: linkColor, opacity: 0.75 }}>{l}</span>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.4rem', padding: '1px 4px', borderRadius: 3, background: ctaBg, color: ctaColor, border: `1px solid ${color}`, opacity: 0.9 }}>CTA</span>
        </div>
      </div>
    )
  }

  // classic
  return (
    <div style={{ background: bg, padding: '8px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 36 }}>
      <span style={{ fontSize: '0.58rem', fontWeight: 800, color: linkColor }}>Brand</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {['Home', 'About', 'Blog'].map((l) => (
          <span key={l} style={{ fontSize: '0.44rem', color: linkColor, opacity: 0.75 }}>{l}</span>
        ))}
        <span style={{ fontSize: '0.4rem', padding: '1px 4px', borderRadius: 3, background: ctaBg, color: ctaColor, border: `1px solid ${color}`, opacity: 0.9 }}>CTA</span>
      </div>
    </div>
  )
}

function PresetPicker({ onApply }: { onApply: (p: NavbarPreset) => void }) {
  return (
    <div style={{ padding: '12px 0' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
        Each style has a different layout structure. Pick one and customise colors after.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {NAVBAR_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onApply(p)}
            style={{
              border: '1.5px solid var(--color-border)',
              borderRadius: 8,
              overflow: 'hidden',
              cursor: 'pointer',
              padding: 0,
              background: 'none',
              textAlign: 'left',
              transition: 'border-color 150ms',
            }}
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
        layoutVariant: p.layoutVariant,
        mobilePanelBg: p.bg,
        mobileTextColor: p.color,
        cta: content.cta ? { ...content.cta, variant: p.ctaVariant } : undefined,
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
          <PropGroup label="Layout structure">
            <PropRow label="Style" stack>
              <SelectInput
                value={content.layoutVariant ?? 'classic'}
                options={LAYOUT_VARIANT_OPTS}
                onChange={(v) => patchContent({ layoutVariant: v as typeof content.layoutVariant })}
              />
            </PropRow>

            {/* Classic: links position sub-option */}
            {(content.layoutVariant === 'classic' || !content.layoutVariant) && (
              <PropRow label="Links align">
                <SelectInput
                  value={content.desktopLayout ?? 'right'}
                  options={DESKTOP_LAYOUT_OPTS}
                  onChange={(v) => patchContent({ desktopLayout: v as 'right' | 'center' })}
                />
              </PropRow>
            )}

            {/* Minimal: contact info */}
            {content.layoutVariant === 'minimal' && (
              <PropRow label="Contact" stack>
                <TextInput
                  value={content.contactInfo ?? ''}
                  onChange={(v) => patchContent({ contactInfo: v })}
                  placeholder="hello@company.com or +1 555 000"
                />
              </PropRow>
            )}
          </PropGroup>

          <PropGroup label="Note">
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Desktop view shows when canvas width exceeds the mobile breakpoint (set in Mobile tab). Use the Presets tab to switch layout structure visually.
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
