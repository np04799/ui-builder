'use client'

import { useState } from 'react'
import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import NumberInput from '@/components/builder/controls/NumberInput'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'
import { TOP_HEADER_PRESETS } from '@/components/builder/elements/TopHeaderElement'

// ─── Preset picker ────────────────────────────────────────────────────────────

type PresetId = 'light' | 'dark' | 'indigo' | 'blur' | 'minimal'

const PRESET_META: { id: PresetId; name: string; description: string }[] = [
  { id: 'light',   name: 'Clean Light',   description: 'White background, soft border' },
  { id: 'dark',    name: 'Dark',          description: 'Dark navy, low-light interface' },
  { id: 'indigo',  name: 'Indigo Brand',  description: 'Primary color header' },
  { id: 'blur',    name: 'Frosted Glass', description: 'Translucent + backdrop blur' },
  { id: 'minimal', name: 'Minimal',       description: 'Light grey, no shadow' },
]

function PresetPicker({ current, onApply }: { current: PresetId; onApply: (id: PresetId) => void }) {
  return (
    <div style={{ padding: '8px 0' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
        Apply a style preset. Colors can be overridden in the Style tab.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {PRESET_META.map((p) => {
          const tokens = TOP_HEADER_PRESETS[p.id]
          const isActive = current === p.id
          return (
            <button
              key={p.id}
              onClick={() => onApply(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                border: isActive ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                borderRadius: 8,
                overflow: 'hidden',
                cursor: 'pointer',
                padding: 0,
                background: 'none',
                textAlign: 'left',
              }}
            >
              {/* Mini preview strip */}
              <div style={{
                width: 80,
                height: 40,
                flexShrink: 0,
                backgroundColor: tokens.bg,
                borderRight: `1px solid ${tokens.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px',
                gap: 4,
              }}>
                {/* Page title placeholder */}
                <div style={{ width: 28, height: 5, borderRadius: 3, backgroundColor: tokens.text, opacity: 0.7 }} />
                {/* Avatar dot */}
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', flexShrink: 0 }} />
              </div>
              {/* Label */}
              <div style={{ flex: 1, padding: '0 10px 0 0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: isActive ? 700 : 500, color: 'var(--color-text-primary)' }}>{p.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginTop: 1 }}>{p.description}</div>
              </div>
              {isActive && (
                <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8, flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 5l2.5 2.5L8 3" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Toggle row helper ────────────────────────────────────────────────────────

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <PropRow label={label}>
      <SelectInput
        value={value ? 'true' : 'false'}
        options={[{ label: 'Show', value: 'true' }, { label: 'Hide', value: 'false' }]}
        onChange={(v) => onChange(v === 'true')}
      />
    </PropRow>
  )
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

type Tab = 'presets' | 'content' | 'style' | 'profile'

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'presets', label: 'Presets' },
    { id: 'content', label: 'Content' },
    { id: 'style',   label: 'Style' },
    { id: 'profile', label: 'Profile' },
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

export default function TopHeaderProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const [tab, setTab] = useState<Tab>('presets')

  if (element.content.type !== 'top-header') return null
  const { content, styles } = element

  function patch(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  function applyPreset(id: PresetId) {
    patch({ preset: id, bg: undefined, borderColor: undefined, textColor: undefined, iconColor: undefined, shadow: undefined })
  }

  return (
    <>
      <TabBar active={tab} onChange={setTab} />

      {/* ── PRESETS ─────────────────────────────────────────── */}
      {tab === 'presets' && (
        <PropGroup label="Style presets">
          <PresetPicker current={(content.preset ?? 'light') as PresetId} onApply={applyPreset} />
        </PropGroup>
      )}

      {/* ── CONTENT ─────────────────────────────────────────── */}
      {tab === 'content' && (
        <>
          <PropGroup label="Page title">
            <PropRow label="Breadcrumb" stack>
              <TextInput
                value={content.breadcrumbLabel ?? 'Home'}
                onChange={(v) => patch({ breadcrumbLabel: v })}
                placeholder="Home"
              />
            </PropRow>
            <PropRow label="Page title" stack>
              <TextInput
                value={content.pageTitle ?? ''}
                onChange={(v) => patch({ pageTitle: v })}
                placeholder="Dashboard"
              />
            </PropRow>
          </PropGroup>

          <PropGroup label="Search">
            <ToggleRow label="Search bar" value={content.showSearch !== false} onChange={(v) => patch({ showSearch: v })} />
            {content.showSearch !== false && (
              <PropRow label="Placeholder" stack>
                <TextInput
                  value={content.searchPlaceholder ?? 'Search…'}
                  onChange={(v) => patch({ searchPlaceholder: v })}
                  placeholder="Search…"
                />
              </PropRow>
            )}
          </PropGroup>

          <PropGroup label="Action icons">
            <ToggleRow label="Notifications" value={content.showNotifications !== false} onChange={(v) => patch({ showNotifications: v })} />
            {content.showNotifications !== false && (
              <PropRow label="Badge count">
                <NumberInput
                  value={String(content.notificationCount ?? 0)}
                  onChange={(v) => patch({ notificationCount: parseInt(v) || 0 })}
                  min={0}
                  max={99}
                />
              </PropRow>
            )}
            <ToggleRow label="Messages" value={!!content.showMessages} onChange={(v) => patch({ showMessages: v })} />
            {content.showMessages && (
              <PropRow label="Badge count">
                <NumberInput
                  value={String(content.messageCount ?? 0)}
                  onChange={(v) => patch({ messageCount: parseInt(v) || 0 })}
                  min={0}
                  max={99}
                />
              </PropRow>
            )}
            <ToggleRow label="Settings" value={!!content.showSettings} onChange={(v) => patch({ showSettings: v })} />
            <ToggleRow label="Help / docs" value={!!content.showHelp} onChange={(v) => patch({ showHelp: v })} />
            <ToggleRow label="Theme toggle" value={content.showThemeToggle !== false} onChange={(v) => patch({ showThemeToggle: v })} />
          </PropGroup>
        </>
      )}

      {/* ── STYLE ─────────────────────────────────────────────── */}
      {tab === 'style' && (
        <>
          <PropGroup label="Dimensions">
            <PropRow label="Height (px)">
              <NumberInput
                value={String(content.height ?? 60)}
                onChange={(v) => patch({ height: parseInt(v) || 60 })}
                min={48}
                max={100}
              />
            </PropRow>
          </PropGroup>

          <PropGroup label="Colors (overrides preset)">
            <PropRow label="Background">
              <ColorSwatch
                value={content.bg ?? TOP_HEADER_PRESETS[content.preset ?? 'light'].bg}
                onChange={(v) => patch({ bg: v })}
              />
            </PropRow>
            <PropRow label="Border">
              <ColorSwatch
                value={content.borderColor ?? TOP_HEADER_PRESETS[content.preset ?? 'light'].border}
                onChange={(v) => patch({ borderColor: v })}
              />
            </PropRow>
            <PropRow label="Text">
              <ColorSwatch
                value={content.textColor ?? TOP_HEADER_PRESETS[content.preset ?? 'light'].text}
                onChange={(v) => patch({ textColor: v })}
              />
            </PropRow>
            <PropRow label="Icons">
              <ColorSwatch
                value={content.iconColor ?? TOP_HEADER_PRESETS[content.preset ?? 'light'].icon}
                onChange={(v) => patch({ iconColor: v })}
              />
            </PropRow>
            <ToggleRow
              label="Drop shadow"
              value={content.shadow ?? TOP_HEADER_PRESETS[content.preset ?? 'light'].shadow}
              onChange={(v) => patch({ shadow: v })}
            />
          </PropGroup>

          <CustomCSSField
            styles={styles}
            knownKeys={['backgroundColor', 'color', 'borderColor']}
            onChange={(s) => updateElement(element.id, { styles: s })}
          />
        </>
      )}

      {/* ── PROFILE ─────────────────────────────────────────── */}
      {tab === 'profile' && (
        <>
          <PropGroup label="User profile">
            <ToggleRow label="Show profile" value={content.showProfile !== false} onChange={(v) => patch({ showProfile: v })} />

            {content.showProfile !== false && (
              <>
                <PropRow label="Name" stack>
                  <TextInput
                    value={content.profileName ?? 'John Doe'}
                    onChange={(v) => patch({ profileName: v })}
                    placeholder="John Doe"
                  />
                </PropRow>
                <PropRow label="Role" stack>
                  <TextInput
                    value={content.profileRole ?? ''}
                    onChange={(v) => patch({ profileRole: v })}
                    placeholder="Administrator"
                  />
                </PropRow>
                <PropRow label="Initials" stack>
                  <TextInput
                    value={content.profileInitials ?? ''}
                    onChange={(v) => patch({ profileInitials: v })}
                    placeholder="JD (auto if blank)"
                  />
                </PropRow>
              </>
            )}
          </PropGroup>

          <PropGroup label="Mobile">
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              On small screens the profile name and role are hidden automatically. Only the avatar is shown.
            </p>
          </PropGroup>
        </>
      )}
    </>
  )
}
