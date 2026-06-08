'use client'

import React, { useState, useEffect } from 'react'
import type { Breakpoint, ResponsiveStyles } from '@/types/builder.types'
import { useResponsiveMode } from '@/hooks/useBuilderSelectors'
import PropGroup from './PropGroup'
import PropRow from './PropRow'
import NumberInput from './NumberInput'
import SelectInput from './SelectInput'
import SpacingControl from './SpacingControl'
import ColorSwatch from './ColorSwatch'

// ─── constants ────────────────────────────────────────────────────────────────

const BREAKPOINTS: { key: Breakpoint; label: string; icon: React.ReactNode }[] = [
  {
    key: 'desktop',
    label: 'Desktop',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="2" width="12" height="8" rx="1.5" />
        <path d="M4 12h6M7 10v2" />
      </svg>
    ),
  },
  {
    key: 'tablet',
    label: 'Tablet',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="1" width="10" height="12" rx="1.5" />
        <circle cx="7" cy="11" r="0.7" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'mobile',
    label: 'Mobile',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="1" width="7" height="12" rx="1.5" />
        <circle cx="7" cy="11" r="0.7" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

const ALIGN_OPTIONS = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
  { label: 'Justify', value: 'justify' },
]

const DISPLAY_OPTIONS = [
  { label: 'Block', value: 'block' },
  { label: 'Flex', value: 'flex' },
  { label: 'Inline', value: 'inline' },
  { label: 'Inline-flex', value: 'inline-flex' },
  { label: 'Grid', value: 'grid' },
]

// ─── VisibilityToggle ─────────────────────────────────────────────────────────

function VisibilityToggle({
  label,
  icon,
  visible,
  onToggle,
}: {
  label: string
  icon: React.ReactNode
  visible: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      title={visible ? `Hide on ${label}` : `Show on ${label}`}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        padding: '8px 4px',
        borderRadius: 7,
        border: `1.5px solid ${visible ? 'var(--color-primary)' : 'var(--color-border)'}`,
        backgroundColor: visible ? 'var(--color-selected)' : 'var(--color-bg)',
        cursor: 'pointer',
        transition: 'all 120ms',
        color: visible ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        position: 'relative',
      }}
    >
      {icon}
      <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.03em' }}>
        {label}
      </span>
      {/* Eye slash overlay when hidden */}
      {!visible && (
        <span style={{
          position: 'absolute',
          top: 3, right: 5,
          fontSize: '0.55rem',
          color: 'var(--color-danger)',
          fontWeight: 700,
        }}>✕</span>
      )}
    </button>
  )
}

// ─── ResponsiveVisibility ────────────────────────────────────────────────────

interface Props {
  responsive: ResponsiveStyles
  onUpdate: (responsive: ResponsiveStyles) => void
}

export default function ResponsiveVisibility({ responsive, onUpdate }: Props) {
  const responsiveMode = useResponsiveMode()
  const [activeTab, setActiveTab] = useState<Breakpoint>(responsiveMode)

  // Sync active tab when canvas breakpoint changes
  useEffect(() => { setActiveTab(responsiveMode) }, [responsiveMode])

  function isVisible(bp: Breakpoint) {
    return responsive[bp]?.display !== 'none'
  }

  function toggleVisibility(bp: Breakpoint) {
    const current = responsive[bp] ?? {}
    const wasHidden = current.display === 'none'
    const updated = { ...current }
    if (wasHidden) {
      delete updated.display
    } else {
      updated.display = 'none'
    }
    onUpdate({ ...responsive, [bp]: updated })
  }

  function patchBreakpointStyle(bp: Breakpoint, key: string, value: string) {
    const current = responsive[bp] ?? {}
    const updated = value === '' ? { ...current } : { ...current, [key]: value }
    if (value === '') delete updated[key]
    onUpdate({ ...responsive, [bp]: updated })
  }

  const tabStyles = responsive[activeTab] ?? {}
  const isTabHidden = tabStyles.display === 'none'

  return (
    <>
      {/* Visibility toggles */}
      <PropGroup label="Responsive Visibility" defaultOpen>
        <div style={{ display: 'flex', gap: 6, padding: '2px 0 4px' }}>
          {BREAKPOINTS.map(({ key, label, icon }) => (
            <VisibilityToggle
              key={key}
              label={label}
              icon={icon}
              visible={isVisible(key)}
              onToggle={() => toggleVisibility(key)}
            />
          ))}
        </div>
        <p style={{
          fontSize: '0.7rem',
          color: 'var(--color-text-secondary)',
          margin: '4px 0 0',
          lineHeight: 1.5,
        }}>
          Click a device to toggle visibility. Red ✕ means hidden on that breakpoint.
        </p>
      </PropGroup>

      {/* Per-breakpoint style overrides */}
      <PropGroup label="Responsive Styles" defaultOpen>
        {/* Breakpoint tab bar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {BREAKPOINTS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                height: 28,
                borderRadius: 6,
                border: `1.5px solid ${activeTab === key ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: activeTab === key ? 'var(--color-selected)' : 'var(--color-bg)',
                color: activeTab === key ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 120ms',
              }}
            >
              {icon}
              <span style={{ fontSize: '0.625rem' }}>{label}</span>
            </button>
          ))}
        </div>

        {isTabHidden ? (
          <div style={{
            padding: '8px 10px',
            borderRadius: 6,
            backgroundColor: 'var(--color-border)',
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
          }}>
            Element is hidden on {activeTab} — enable visibility above to edit styles.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <PropRow label="Font size">
              <NumberInput
                value={tabStyles.fontSize ?? ''}
                onChange={(v) => patchBreakpointStyle(activeTab, 'fontSize', v)}
                placeholder="inherit"
              />
            </PropRow>
            <PropRow label="Text align">
              <SelectInput
                value={tabStyles.textAlign ?? ''}
                options={[{ label: 'Inherit', value: '' }, ...ALIGN_OPTIONS]}
                onChange={(v) => patchBreakpointStyle(activeTab, 'textAlign', v)}
              />
            </PropRow>
            <PropRow label="Text color">
              <ColorSwatch
                value={tabStyles.color ?? ''}
                onChange={(v) => patchBreakpointStyle(activeTab, 'color', v)}
              />
            </PropRow>
            <PropRow label="Display">
              <SelectInput
                value={tabStyles.display ?? ''}
                options={[{ label: 'Inherit', value: '' }, ...DISPLAY_OPTIONS]}
                onChange={(v) => patchBreakpointStyle(activeTab, 'display', v)}
              />
            </PropRow>
            <PropRow label="Width">
              <NumberInput
                value={tabStyles.width ?? ''}
                onChange={(v) => patchBreakpointStyle(activeTab, 'width', v)}
                placeholder="auto"
                unit="%"
              />
            </PropRow>
            <PropRow label="Margin" stack>
              <SpacingControl
                value={tabStyles.margin ?? ''}
                onChange={(v) => patchBreakpointStyle(activeTab, 'margin', v)}
              />
            </PropRow>
            <PropRow label="Padding" stack>
              <SpacingControl
                value={tabStyles.padding ?? ''}
                onChange={(v) => patchBreakpointStyle(activeTab, 'padding', v)}
              />
            </PropRow>

            {/* Custom key-value override */}
            <div style={{ marginTop: 4, paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-secondary)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active overrides on {activeTab}
              </p>
              {Object.entries(tabStyles).length === 0 ? (
                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  No overrides — uses base styles.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {Object.entries(tabStyles).map(([k, v]) => (
                    <div key={k} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: '0.7rem', padding: '3px 6px', borderRadius: 4,
                      backgroundColor: 'var(--color-border)',
                    }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{k}</span>
                      <span style={{ color: 'var(--color-primary)', fontFamily: 'monospace', fontWeight: 600 }}>{v}</span>
                      <button
                        onClick={() => patchBreakpointStyle(activeTab, k, '')}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--color-text-secondary)', padding: '0 2px',
                          fontSize: '0.75rem', lineHeight: 1,
                        }}
                        title="Remove override"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </PropGroup>
    </>
  )
}
