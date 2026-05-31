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
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

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

interface Props {
  element: ElementNode
}

export default function DrawerProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'drawer') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
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

      <PropGroup label="Drawer">
        <PropRow label="Display mode">
          <SelectInput
            value={content.displayMode ?? 'persistent'}
            options={DISPLAY_MODE_OPTIONS}
            onChange={(v) => patchContent({ displayMode: v as 'modal' | 'persistent' })}
          />
        </PropRow>
        {(content.displayMode ?? 'persistent') === 'persistent' && (
          <PropRow label="Show drawer">
            <SelectInput
              value={String(content.showDrawer ?? true)}
              options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]}
              onChange={(v) => patchContent({ showDrawer: v === 'true' })}
            />
          </PropRow>
        )}
        {(content.displayMode ?? 'persistent') === 'persistent' && (
          <PropRow label="Expand behavior">
            <SelectInput
              value={content.expandBehavior ?? 'push'}
              options={EXPAND_BEHAVIOR_OPTIONS}
              onChange={(v) => patchContent({ expandBehavior: v as 'overlay' | 'push' })}
            />
          </PropRow>
        )}
        <PropRow label="Position">
          <SelectInput
            value={content.position ?? 'left'}
            options={POSITION_OPTIONS}
            onChange={(v) => patchContent({ position: v as 'left' | 'right' | 'top' | 'bottom' })}
          />
        </PropRow>
        {isHorizontal ? (
          <>
            <PropRow label="Expanded width">
              <NumberInput
                value={String(content.width ?? 240)}
                min={160}
                max={600}
                unit=""
                onChange={(v) => patchContent({ width: parseInt(v) || 240 })}
              />
            </PropRow>
            {(content.displayMode ?? 'persistent') === 'persistent' && (
              <PropRow label="Collapsed width">
                <NumberInput
                  value={String(content.collapsedWidth ?? 60)}
                  min={40}
                  max={120}
                  unit=""
                  onChange={(v) => patchContent({ collapsedWidth: parseInt(v) || 60 })}
                />
              </PropRow>
            )}
          </>
        ) : (
          <>
            <PropRow label="Expanded height">
              <NumberInput
                value={String(content.height ?? 320)}
                min={100}
                max={600}
                unit=""
                onChange={(v) => patchContent({ height: parseInt(v) || 320 })}
              />
            </PropRow>
            {(content.displayMode ?? 'persistent') === 'persistent' && (
              <PropRow label="Collapsed height">
                <NumberInput
                  value={String(content.collapsedHeight ?? 60)}
                  min={40}
                  max={120}
                  unit=""
                  onChange={(v) => patchContent({ collapsedHeight: parseInt(v) || 60 })}
                />
              </PropRow>
            )}
          </>
        )}
        {(content.displayMode ?? 'persistent') === 'persistent' && (
          <PropRow label="Default state">
            <SelectInput
              value={content.defaultCollapsed ? 'collapsed' : 'expanded'}
              options={[{ label: 'Expanded', value: 'expanded' }, { label: 'Collapsed', value: 'collapsed' }]}
              onChange={(v) => patchContent({ defaultCollapsed: v === 'collapsed' })}
            />
          </PropRow>
        )}
        {(content.displayMode ?? 'persistent') === 'modal' && (
          <PropRow label="Close on overlay">
            <SelectInput
              value={content.closeOnOverlay === false ? 'false' : 'true'}
              options={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
              onChange={(v) => patchContent({ closeOnOverlay: v === 'true' })}
            />
          </PropRow>
        )}
      </PropGroup>

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
          style={{
            width: '100%',
            padding: '8px 0',
            borderRadius: 6,
            border: '1.5px dashed var(--color-border)',
            background: 'none',
            cursor: 'pointer',
            fontSize: 12,
            color: 'var(--color-text-secondary)',
            fontWeight: 500,
          }}
        >
          + Add item
        </button>
      </PropGroup>

      <PropGroup label="Colors">
        <PropRow label="Panel background">
          <ColorSwatch value={content.panelBg ?? '#1e1e2e'} onChange={(v) => patchContent({ panelBg: v })} />
        </PropRow>
        <PropRow label="Header background">
          <ColorSwatch value={content.headerBg ?? '#16162a'} onChange={(v) => patchContent({ headerBg: v })} />
        </PropRow>
        <PropRow label="Accent color">
          <ColorSwatch value={content.accentColor ?? '#6366f1'} onChange={(v) => patchContent({ accentColor: v })} />
        </PropRow>
        <PropRow label="Text color">
          <ColorSwatch value={content.textColor ?? '#e2e8f0'} onChange={(v) => patchContent({ textColor: v })} />
        </PropRow>
        <PropRow label="Overlay color">
          <ColorSwatch value={content.overlayColor ?? 'rgba(0,0,0,0.45)'} onChange={(v) => patchContent({ overlayColor: v })} />
        </PropRow>
      </PropGroup>

      <PropGroup label="Top Header">
        <PropRow label="Show header">
          <SelectInput
            value={String(content.showTopHeader ?? false)}
            options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]}
            onChange={(v) => patchContent({ showTopHeader: v === 'true' })}
          />
        </PropRow>
        {(content.showTopHeader ?? false) && (
          <>
            <PropRow label="Height">
              <NumberInput value={String(content.topHeaderHeight ?? 60)} min={40} max={120} unit="" onChange={(v) => patchContent({ topHeaderHeight: parseInt(v) || 60 })} />
            </PropRow>
            <PropRow label="Page title" stack>
              <TextInput value={content.topHeaderPageTitle ?? ''} onChange={(v) => patchContent({ topHeaderPageTitle: v || undefined })} placeholder="Optional breadcrumb" />
            </PropRow>
            <PropRow label="Search">
              <SelectInput value={String(content.topHeaderShowSearch ?? true)} options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]} onChange={(v) => patchContent({ topHeaderShowSearch: v === 'true' })} />
            </PropRow>
            {(content.topHeaderShowSearch ?? true) && (
              <PropRow label="Placeholder" stack>
                <TextInput value={content.topHeaderSearchPlaceholder ?? ''} onChange={(v) => patchContent({ topHeaderSearchPlaceholder: v })} placeholder="Search…" />
              </PropRow>
            )}
            <PropRow label="Notifications">
              <SelectInput value={String(content.topHeaderShowNotifications ?? true)} options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]} onChange={(v) => patchContent({ topHeaderShowNotifications: v === 'true' })} />
            </PropRow>
            {(content.topHeaderShowNotifications ?? true) && (
              <PropRow label="Notif. badge">
                <NumberInput value={String(content.topHeaderNotificationCount ?? 0)} min={0} max={99} unit="" onChange={(v) => patchContent({ topHeaderNotificationCount: parseInt(v) || 0 })} />
              </PropRow>
            )}
            <PropRow label="Messages">
              <SelectInput value={String(content.topHeaderShowMessages ?? true)} options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]} onChange={(v) => patchContent({ topHeaderShowMessages: v === 'true' })} />
            </PropRow>
            {(content.topHeaderShowMessages ?? true) && (
              <PropRow label="Msg. badge">
                <NumberInput value={String(content.topHeaderMessageCount ?? 0)} min={0} max={99} unit="" onChange={(v) => patchContent({ topHeaderMessageCount: parseInt(v) || 0 })} />
              </PropRow>
            )}
            <PropRow label="Settings btn">
              <SelectInput value={String(content.topHeaderShowSettings ?? true)} options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]} onChange={(v) => patchContent({ topHeaderShowSettings: v === 'true' })} />
            </PropRow>
            <PropRow label="Help btn">
              <SelectInput value={String(content.topHeaderShowHelp ?? false)} options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]} onChange={(v) => patchContent({ topHeaderShowHelp: v === 'true' })} />
            </PropRow>
            <PropRow label="Profile">
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
                <PropRow label="Avatar URL" stack>
                  <TextInput value={content.topHeaderProfileSrc ?? ''} onChange={(v) => patchContent({ topHeaderProfileSrc: v || undefined })} placeholder="https://…" />
                </PropRow>
              </>
            )}
            <PropRow label="Background">
              <ColorSwatch value={content.topHeaderBg ?? '#ffffff'} onChange={(v) => patchContent({ topHeaderBg: v })} />
            </PropRow>
            <PropRow label="Border color">
              <ColorSwatch value={content.topHeaderBorderColor ?? '#e5e7eb'} onChange={(v) => patchContent({ topHeaderBorderColor: v })} />
            </PropRow>
            <PropRow label="Text color">
              <ColorSwatch value={content.topHeaderTextColor ?? '#111827'} onChange={(v) => patchContent({ topHeaderTextColor: v })} />
            </PropRow>
            <PropRow label="Icon color">
              <ColorSwatch value={content.topHeaderIconColor ?? '#6b7280'} onChange={(v) => patchContent({ topHeaderIconColor: v })} />
            </PropRow>
            <PropRow label="Shadow">
              <SelectInput value={String(content.topHeaderShadow ?? true)} options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]} onChange={(v) => patchContent({ topHeaderShadow: v === 'true' })} />
            </PropRow>
          </>
        )}
      </PropGroup>

      <CustomCSSField
        styles={styles}
        knownKeys={[]}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
