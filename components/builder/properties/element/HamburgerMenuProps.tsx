'use client'

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

interface Props { element: ElementNode }

export default function HamburgerMenuProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'hamburger-menu') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
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
      {/* ── Behaviour ─────────────────────────────────────────────────── */}
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
        <PropRow label="Close on overlay">
          <SelectInput
            value={content.closeOnOverlay !== false ? 'true' : 'false'}
            options={CLOSE_OPTIONS}
            onChange={(v) => patchContent({ closeOnOverlay: v === 'true' })}
          />
        </PropRow>
        {content.menuStyle !== 'fullscreen' && (
          <PropRow label="Drawer width">
            <NumberInput
              value={content.drawerWidth ? `${content.drawerWidth}px` : ''}
              placeholder="360"
              min={120}
              max={1200}
              onChange={(v) => patchContent({ drawerWidth: v ? parseInt(v) : undefined })}
            />
          </PropRow>
        )}
      </PropGroup>

      {/* ── Logo ──────────────────────────────────────────────────────── */}
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

      {/* ── Nav links ─────────────────────────────────────────────────── */}
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
              <TextInput
                value={link.label}
                onChange={(v) => updateLink(link.id, 'label', v)}
                placeholder="Home"
              />
            </PropRow>
            <PropRow label="URL" stack>
              <TextInput
                value={link.href}
                onChange={(v) => updateLink(link.id, 'href', v)}
                placeholder="https://..."
              />
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
          style={{
            marginTop: 10,
            width: '100%',
            padding: '7px',
            fontSize: '0.8125rem',
            border: '1px dashed var(--color-border)',
            borderRadius: 6,
            background: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
        >
          + Add link
        </button>
      </PropGroup>

      {/* ── CTA button ────────────────────────────────────────────────── */}
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
            style={{
              width: '100%',
              padding: '5px',
              fontSize: '0.75rem',
              border: '1px solid #fca5a5',
              borderRadius: 4,
              background: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              marginTop: 4,
            }}
          >
            Remove CTA
          </button>
        )}
      </PropGroup>

      {/* ── Colours ───────────────────────────────────────────────────── */}
      <PropGroup label="Colours">
        <PropRow label="Panel bg">
          <ColorSwatch
            value={content.panelBg ?? '#ffffff'}
            onChange={(v) => patchContent({ panelBg: v })}
          />
        </PropRow>
        <PropRow label="Text color">
          <ColorSwatch
            value={content.textColor ?? '#111827'}
            onChange={(v) => patchContent({ textColor: v })}
          />
        </PropRow>
        <PropRow label="Overlay">
          <ColorSwatch
            value={content.overlayColor ?? 'rgba(0,0,0,0.5)'}
            onChange={(v) => patchContent({ overlayColor: v })}
          />
        </PropRow>
      </PropGroup>

      {/* ── Container style ───────────────────────────────────────────── */}
      <PropGroup label="Trigger Style">
        <PropRow label="Bg color">
          <ColorSwatch value={styles.backgroundColor ?? ''} onChange={(v) => patchStyle('backgroundColor', v)} />
        </PropRow>
        <PropRow label="Padding" stack>
          <TextInput value={styles.padding ?? ''} onChange={(v) => patchStyle('padding', v)} placeholder="e.g. 8px" />
        </PropRow>
      </PropGroup>

      <CustomCSSField
        styles={styles}
        knownKeys={['backgroundColor', 'padding']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
