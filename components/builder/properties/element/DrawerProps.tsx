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
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

// ─── Presets ──────────────────────────────────────────────────────────────────

interface DrawerPreset {
  id: string
  name: string
  description: string
  position: 'left' | 'right' | 'top' | 'bottom'
  displayMode: 'persistent' | 'modal'
  expandBehavior: 'push' | 'overlay'
  panelBg: string
  headerBg: string
  accentColor: string
  textColor: string
  width?: number
  collapsedWidth?: number
  defaultCollapsed?: boolean
  showTopHeader?: boolean
}

const DRAWER_PRESETS: DrawerPreset[] = [
  {
    id: 'dark-sidebar',
    name: 'Dark Sidebar',
    description: 'Persistent left · dark theme · push layout',
    position: 'left',
    displayMode: 'persistent',
    expandBehavior: 'push',
    panelBg: '#1e1e2e',
    headerBg: '#16162a',
    accentColor: '#6366f1',
    textColor: '#e2e8f0',
    width: 240,
    collapsedWidth: 60,
    defaultCollapsed: false,
    showTopHeader: false,
  },
  {
    id: 'light-sidebar',
    name: 'Light Sidebar',
    description: 'Persistent left · clean white · collapsible',
    position: 'left',
    displayMode: 'persistent',
    expandBehavior: 'push',
    panelBg: '#ffffff',
    headerBg: '#f9fafb',
    accentColor: '#4f46e5',
    textColor: '#111827',
    width: 260,
    collapsedWidth: 56,
    defaultCollapsed: false,
    showTopHeader: true,
  },
  {
    id: 'modal-right',
    name: 'Modal Drawer',
    description: 'Slide-in from right · triggered by button',
    position: 'right',
    displayMode: 'modal',
    expandBehavior: 'overlay',
    panelBg: '#0f172a',
    headerBg: '#1e293b',
    accentColor: '#38bdf8',
    textColor: '#f1f5f9',
    width: 280,
  },
]

// ─── Mini preview ─────────────────────────────────────────────────────────────

function MiniDrawerPreview({ preset }: { preset: DrawerPreset }) {
  const isDark = preset.panelBg === '#1e1e2e' || preset.panelBg === '#0f172a'
  const accentHex = preset.accentColor

  if (preset.displayMode === 'modal') {
    return (
      <div style={{ background: '#f0f4f8', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, minHeight: 56 }}>
        <div style={{ padding: '5px 12px', borderRadius: 6, background: accentHex, color: '#fff', fontSize: '0.6rem', fontWeight: 600 }}>
          Open Menu
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.4 }}>
          <div style={{ width: 28, height: 40, borderRadius: 4, background: preset.panelBg, border: '1px solid rgba(0,0,0,0.12)' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 6 }}>
            {[0,1,2].map(i => <div key={i} style={{ height: 3, borderRadius: 2, background: '#cbd5e1', width: i === 2 ? '50%' : '80%' }} />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#f0f4f8', padding: '6px', display: 'flex', gap: 4, minHeight: 56, borderRadius: 4 }}>
      {/* Sidebar panel */}
      <div style={{ width: 40, borderRadius: 4, background: preset.panelBg, display: 'flex', flexDirection: 'column', gap: 4, padding: '6px 5px', flexShrink: 0 }}>
        <div style={{ height: 6, borderRadius: 3, background: accentHex, width: '70%', marginBottom: 4 }} />
        {[0,1,2].map(i => (
          <div key={i} style={{ height: 3, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)', width: i === 0 ? '90%' : '70%' }} />
        ))}
      </div>
      {/* Content area */}
      <div style={{ flex: 1, borderRadius: 4, background: '#ffffff', display: 'flex', flexDirection: 'column', gap: 4, padding: 6 }}>
        {[0,1,2].map(i => <div key={i} style={{ height: 3, borderRadius: 2, background: '#e2e8f0', width: ['80%','60%','70%'][i] }} />)}
      </div>
    </div>
  )
}

function PresetPicker({ onApply }: { onApply: (p: DrawerPreset) => void }) {
  return (
    <div style={{ padding: '12px 0' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
        Presets configure layout, color scheme, and display mode in one click.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DRAWER_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onApply(p)}
            style={{ border: '1.5px solid var(--color-border)', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'none', textAlign: 'left', transition: 'border-color 150ms' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-primary)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)' }}
          >
            <MiniDrawerPreview preset={p} />
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

const VARIANT_OPTIONS = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Outline', value: 'outline' },
  { label: 'Ghost', value: 'ghost' },
]

const POSITION_OPTIONS = [
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
]

const DISPLAY_MODE_OPTIONS = [
  { label: 'Persistent (always visible)', value: 'persistent' },
  { label: 'Modal (trigger button)', value: 'modal' },
]

const EXPAND_BEHAVIOR_OPTIONS = [
  { label: 'Push content', value: 'push' },
  { label: 'Overlay content', value: 'overlay' },
]

const ICON_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'Folder', value: 'folder' },
  { label: 'Mail', value: 'mail' },
  { label: 'Settings', value: 'settings' },
  { label: 'Home', value: 'home' },
  { label: 'Users', value: 'users' },
  { label: 'Bell', value: 'bell' },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props { element: ElementNode }

export default function DrawerProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const [tab, setTab] = useState<Tab>('presets')

  if (element.content.type !== 'drawer') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function applyPreset(p: DrawerPreset) {
    updateElement(element.id, {
      content: {
        ...content,
        position: p.position,
        displayMode: p.displayMode,
        expandBehavior: p.expandBehavior,
        panelBg: p.panelBg,
        headerBg: p.headerBg,
        accentColor: p.accentColor,
        textColor: p.textColor,
        ...(p.width ? { width: p.width } : {}),
        ...(p.collapsedWidth ? { collapsedWidth: p.collapsedWidth } : {}),
        ...(p.defaultCollapsed !== undefined ? { defaultCollapsed: p.defaultCollapsed } : {}),
        ...(p.showTopHeader !== undefined ? { showTopHeader: p.showTopHeader } : {}),
      },
    })
    setTab('content')
  }

  const navItems = content.navItems ?? []
  const isHorizontal = content.position === 'left' || content.position === 'right'

  function addNavItem() {
    patchContent({
      navItems: [
        ...navItems,
        { id: crypto.randomUUID(), label: 'New Item', href: '#', icon: 'home' },
      ],
    })
  }

  function removeNavItem(id: string) {
    patchContent({ navItems: navItems.filter((i) => i.id !== id) })
  }

  function patchNavItem(id: string, patch: Partial<(typeof navItems)[number]>) {
    patchContent({ navItems: navItems.map((i) => (i.id === id ? { ...i, ...patch } : i)) })
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
          {/* Trigger (modal mode only) */}
          {(content.displayMode ?? 'persistent') === 'modal' && (
            <PropGroup label="Trigger">
              <PropRow label="Button text" stack>
                <TextInput
                  value={content.triggerText}
                  onChange={(v) => patchContent({ triggerText: v })}
                  placeholder="Open Menu"
                />
              </PropRow>
              <PropRow label="Variant">
                <SelectInput
                  value={content.triggerVariant ?? 'primary'}
                  options={VARIANT_OPTIONS}
                  onChange={(v) => patchContent({ triggerVariant: v as ButtonVariant })}
                />
              </PropRow>
            </PropGroup>
          )}

          {/* Header */}
          <PropGroup label="Header">
            <PropRow label="Logo text" stack>
              <TextInput
                value={content.logoText ?? ''}
                onChange={(v) => patchContent({ logoText: v })}
                placeholder="MyApp"
              />
            </PropRow>
            <PropRow label="Subtitle" stack>
              <TextInput
                value={content.subtitle ?? ''}
                onChange={(v) => patchContent({ subtitle: v })}
                placeholder="Main Menu"
              />
            </PropRow>
            <PropRow label="Footer text" stack>
              <TextInput
                value={content.footerText ?? ''}
                onChange={(v) => patchContent({ footerText: v })}
                placeholder="© 2025 MyApp"
              />
            </PropRow>
          </PropGroup>

          {/* Nav items */}
          <PropGroup label="Nav items">
            {navItems.map((item, idx) => (
              <div key={item.id} style={{ marginBottom: 10, padding: '10px 12px', background: 'var(--color-surface)', borderRadius: 6, border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Item {idx + 1}
                  </span>
                  <button
                    onClick={() => removeNavItem(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 14, padding: '0 2px', lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>
                <PropRow label="Label" stack>
                  <TextInput value={item.label} onChange={(v) => patchNavItem(item.id, { label: v })} placeholder="Label" />
                </PropRow>
                <PropRow label="Href" stack>
                  <TextInput value={item.href} onChange={(v) => patchNavItem(item.id, { href: v })} placeholder="#" />
                </PropRow>
                <PropRow label="Icon">
                  <SelectInput value={item.icon ?? ''} options={ICON_OPTIONS} onChange={(v) => patchNavItem(item.id, { icon: v })} />
                </PropRow>
                <PropRow label="Badge" stack>
                  <TextInput value={item.badge ?? ''} onChange={(v) => patchNavItem(item.id, { badge: v || undefined })} placeholder="e.g. New, 3" />
                </PropRow>
              </div>
            ))}
            <button
              onClick={addNavItem}
              style={{ width: '100%', padding: '8px 0', borderRadius: 6, border: '1.5px dashed var(--color-border)', background: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}
            >
              + Add item
            </button>
          </PropGroup>

          {/* Top Header content */}
          <PropGroup label="Top Header">
            <PropRow label="Show header" stack>
              <SelectInput
                value={String(content.showTopHeader ?? false)}
                options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]}
                onChange={(v) => patchContent({ showTopHeader: v === 'true' })}
              />
            </PropRow>
            {(content.showTopHeader ?? false) && (
              <>
                <PropRow label="Page title" stack>
                  <TextInput value={content.topHeaderPageTitle ?? ''} onChange={(v) => patchContent({ topHeaderPageTitle: v || undefined })} placeholder="Optional breadcrumb" />
                </PropRow>
                <PropRow label="Search" stack>
                  <SelectInput value={String(content.topHeaderShowSearch ?? true)} options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]} onChange={(v) => patchContent({ topHeaderShowSearch: v === 'true' })} />
                </PropRow>
                {(content.topHeaderShowSearch ?? true) && (
                  <PropRow label="Search hint" stack>
                    <TextInput value={content.topHeaderSearchPlaceholder ?? ''} onChange={(v) => patchContent({ topHeaderSearchPlaceholder: v })} placeholder="Search…" />
                  </PropRow>
                )}
                <PropRow label="Notifications" stack>
                  <SelectInput value={String(content.topHeaderShowNotifications ?? true)} options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]} onChange={(v) => patchContent({ topHeaderShowNotifications: v === 'true' })} />
                </PropRow>
                {(content.topHeaderShowNotifications ?? true) && (
                  <PropRow label="Notif. count" stack>
                    <NumberInput value={String(content.topHeaderNotificationCount ?? 0)} min={0} max={99} unit="" onChange={(v) => patchContent({ topHeaderNotificationCount: parseInt(v) || 0 })} />
                  </PropRow>
                )}
                <PropRow label="Messages" stack>
                  <SelectInput value={String(content.topHeaderShowMessages ?? true)} options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]} onChange={(v) => patchContent({ topHeaderShowMessages: v === 'true' })} />
                </PropRow>
                {(content.topHeaderShowMessages ?? true) && (
                  <PropRow label="Msg. count" stack>
                    <NumberInput value={String(content.topHeaderMessageCount ?? 0)} min={0} max={99} unit="" onChange={(v) => patchContent({ topHeaderMessageCount: parseInt(v) || 0 })} />
                  </PropRow>
                )}
                <PropRow label="Profile" stack>
                  <SelectInput value={String(content.topHeaderShowProfile ?? true)} options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]} onChange={(v) => patchContent({ topHeaderShowProfile: v === 'true' })} />
                </PropRow>
                {(content.topHeaderShowProfile ?? true) && (
                  <>
                    <PropRow label="Profile name" stack>
                      <TextInput value={content.topHeaderProfileName ?? ''} onChange={(v) => patchContent({ topHeaderProfileName: v })} placeholder="John Doe" />
                    </PropRow>
                    <PropRow label="Profile role" stack>
                      <TextInput value={content.topHeaderProfileRole ?? ''} onChange={(v) => patchContent({ topHeaderProfileRole: v || undefined })} placeholder="Administrator" />
                    </PropRow>
                    <PropRow label="Initials" stack>
                      <TextInput value={content.topHeaderProfileInitials ?? ''} onChange={(v) => patchContent({ topHeaderProfileInitials: v || undefined })} placeholder="Auto" />
                    </PropRow>
                  </>
                )}
              </>
            )}
          </PropGroup>
        </>
      )}

      {/* ── Style tab ───────────────────────────────────────────────────── */}
      {tab === 'style' && (
        <>
          {/* Layout */}
          <PropGroup label="Layout">
            <PropRow label="Display mode" stack>
              <SelectInput
                value={content.displayMode ?? 'persistent'}
                options={DISPLAY_MODE_OPTIONS}
                onChange={(v) => patchContent({ displayMode: v as 'modal' | 'persistent' })}
              />
            </PropRow>
            {(content.displayMode ?? 'persistent') === 'persistent' && (
              <PropRow label="Show drawer" stack>
                <SelectInput
                  value={String(content.showDrawer ?? true)}
                  options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]}
                  onChange={(v) => patchContent({ showDrawer: v === 'true' })}
                />
              </PropRow>
            )}
            {(content.displayMode ?? 'persistent') === 'persistent' && (
              <PropRow label="Expand behavior" stack>
                <SelectInput
                  value={content.expandBehavior ?? 'push'}
                  options={EXPAND_BEHAVIOR_OPTIONS}
                  onChange={(v) => patchContent({ expandBehavior: v as 'overlay' | 'push' })}
                />
              </PropRow>
            )}
            <PropRow label="Position" stack>
              <SelectInput
                value={content.position ?? 'left'}
                options={POSITION_OPTIONS}
                onChange={(v) => patchContent({ position: v as 'left' | 'right' | 'top' | 'bottom' })}
              />
            </PropRow>
            {isHorizontal ? (
              <>
                <PropRow label="Expanded width (px)" stack>
                  <NumberInput value={String(content.width ?? 240)} min={160} max={600} unit="" onChange={(v) => patchContent({ width: parseInt(v) || 240 })} />
                </PropRow>
                {(content.displayMode ?? 'persistent') === 'persistent' && (
                  <PropRow label="Collapsed width (px)" stack>
                    <NumberInput value={String(content.collapsedWidth ?? 60)} min={40} max={120} unit="" onChange={(v) => patchContent({ collapsedWidth: parseInt(v) || 60 })} />
                  </PropRow>
                )}
              </>
            ) : (
              <>
                <PropRow label="Expanded height (px)" stack>
                  <NumberInput value={String(content.height ?? 320)} min={100} max={600} unit="" onChange={(v) => patchContent({ height: parseInt(v) || 320 })} />
                </PropRow>
                {(content.displayMode ?? 'persistent') === 'persistent' && (
                  <PropRow label="Collapsed height (px)" stack>
                    <NumberInput value={String(content.collapsedHeight ?? 60)} min={40} max={120} unit="" onChange={(v) => patchContent({ collapsedHeight: parseInt(v) || 60 })} />
                  </PropRow>
                )}
              </>
            )}
            {(content.displayMode ?? 'persistent') === 'persistent' && (
              <PropRow label="Default state" stack>
                <SelectInput
                  value={content.defaultCollapsed ? 'collapsed' : 'expanded'}
                  options={[{ label: 'Expanded', value: 'expanded' }, { label: 'Collapsed', value: 'collapsed' }]}
                  onChange={(v) => patchContent({ defaultCollapsed: v === 'collapsed' })}
                />
              </PropRow>
            )}
            {(content.displayMode ?? 'persistent') === 'modal' && (
              <PropRow label="Close on overlay" stack>
                <SelectInput
                  value={content.closeOnOverlay === false ? 'false' : 'true'}
                  options={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
                  onChange={(v) => patchContent({ closeOnOverlay: v === 'true' })}
                />
              </PropRow>
            )}
          </PropGroup>

          {/* Colors */}
          <PropGroup label="Colors">
            <PropRow label="Panel bg" stack>
              <ColorSwatch value={content.panelBg ?? '#1e1e2e'} onChange={(v) => patchContent({ panelBg: v })} />
            </PropRow>
            <PropRow label="Header bg" stack>
              <ColorSwatch value={content.headerBg ?? '#16162a'} onChange={(v) => patchContent({ headerBg: v })} />
            </PropRow>
            <PropRow label="Accent" stack>
              <ColorSwatch value={content.accentColor ?? '#6366f1'} onChange={(v) => patchContent({ accentColor: v })} />
            </PropRow>
            <PropRow label="Text" stack>
              <ColorSwatch value={content.textColor ?? '#e2e8f0'} onChange={(v) => patchContent({ textColor: v })} />
            </PropRow>
            <PropRow label="Overlay color" stack>
              <TextInput value={content.overlayColor ?? 'rgba(0,0,0,0.45)'} onChange={(v) => patchContent({ overlayColor: v })} placeholder="rgba(0,0,0,0.45) or #hex" />
            </PropRow>
          </PropGroup>

          {/* Top header colors */}
          {(content.showTopHeader ?? false) && (
            <PropGroup label="Top Header Colors">
              <PropRow label="Height (px)" stack>
                <NumberInput value={String(content.topHeaderHeight ?? 60)} min={40} max={120} unit="" onChange={(v) => patchContent({ topHeaderHeight: parseInt(v) || 60 })} />
              </PropRow>
              <PropRow label="Background" stack>
                <ColorSwatch value={content.topHeaderBg ?? '#ffffff'} onChange={(v) => patchContent({ topHeaderBg: v })} />
              </PropRow>
              <PropRow label="Border color" stack>
                <ColorSwatch value={content.topHeaderBorderColor ?? '#e5e7eb'} onChange={(v) => patchContent({ topHeaderBorderColor: v })} />
              </PropRow>
              <PropRow label="Text color" stack>
                <ColorSwatch value={content.topHeaderTextColor ?? '#111827'} onChange={(v) => patchContent({ topHeaderTextColor: v })} />
              </PropRow>
              <PropRow label="Icon color" stack>
                <ColorSwatch value={content.topHeaderIconColor ?? '#6b7280'} onChange={(v) => patchContent({ topHeaderIconColor: v })} />
              </PropRow>
              <PropRow label="Shadow" stack>
                <SelectInput value={String(content.topHeaderShadow ?? true)} options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]} onChange={(v) => patchContent({ topHeaderShadow: v === 'true' })} />
              </PropRow>
            </PropGroup>
          )}

          <CustomCSSField
            styles={styles}
            knownKeys={[]}
            onChange={(s) => updateElement(element.id, { styles: s })}
          />
        </>
      )}
    </>
  )
}
