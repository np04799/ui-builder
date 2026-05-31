'use client'

import { useState } from 'react'
import { GridIcon, LayersIcon, TemplatesIcon, SettingsIcon } from '@/components/builder/icons'
import ElementsPanel from './ElementsPanel'
import LayersPanel from './LayersPanel'
import TemplatesPanel from './TemplatesPanel'
import SettingsPanel from './SettingsPanel'

// ─── Types ────────────────────────────────────────────────────────────────────

type PanelId = 'elements' | 'components' | 'sections' | 'pages' | 'templates' | 'layers' | 'settings'

interface NavItem {
  id: PanelId
  label: string
  icon: React.ReactNode
}

// ─── Extra icons ──────────────────────────────────────────────────────────────

function ComponentsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1l3.5 2v4L8 9 4.5 7V3L8 1z" />
      <path d="M4.5 9L1 11v2l3.5 2L8 13v-2L4.5 9z" />
      <path d="M11.5 9L8 11v2l3.5 2 3.5-2v-2L11.5 9z" />
    </svg>
  )
}

function SectionsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="2" width="14" height="4" rx="1" />
      <rect x="1" y="8" width="14" height="4" rx="1" />
      <path d="M1 14h14" />
    </svg>
  )
}

function PagesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6L9 1z" />
      <path d="M9 1v5h5" />
      <path d="M5 9h6M5 12h4" />
    </svg>
  )
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: 'elements', label: 'Elements', icon: <GridIcon /> },
  { id: 'components', label: 'Components', icon: <ComponentsIcon /> },
  { id: 'sections', label: 'Sections', icon: <SectionsIcon /> },
  { id: 'pages', label: 'Pages', icon: <PagesIcon /> },
  { id: 'templates', label: 'Templates', icon: <TemplatesIcon /> },
  { id: 'layers', label: 'Layers', icon: <LayersIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
]

// ─── Panel host ───────────────────────────────────────────────────────────────

function PanelContent({ activePanel }: { activePanel: PanelId }) {
  switch (activePanel) {
    case 'elements':
      return <ElementsPanel />
    case 'layers':
      return <LayersPanel />
    case 'templates':
      return <TemplatesPanel />
    case 'settings':
      return <SettingsPanel />
    default:
      return (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-secondary)',
            fontSize: '0.8125rem',
            padding: 24,
            textAlign: 'center',
          }}
        >
          Coming soon
        </div>
      )
  }
}

// ─── LeftSidebar ─────────────────────────────────────────────────────────────

export default function LeftSidebar() {
  const [activePanel, setActivePanel] = useState<PanelId | null>('elements')

  const handleNavClick = (id: PanelId) => {
    setActivePanel((prev) => (prev === id ? null : id))
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexShrink: 0,
        height: '100%',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {/* Icon strip */}
      <nav
        style={{
          width: 64,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 8,
          gap: 2,
          borderRight: activePanel ? '1px solid var(--color-border)' : undefined,
        }}
        aria-label="Builder panels"
      >
        {NAV_ITEMS.map(({ id, label, icon }) => {
          const isActive = activePanel === id
          return (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              title={label}
              aria-pressed={isActive}
              style={{
                width: 52,
                height: 52,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                backgroundColor: isActive ? 'var(--color-selected)' : 'transparent',
                flexShrink: 0,
                padding: 0,
              }}
            >
              {icon}
              <span
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.01em',
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Panel content */}
      {activePanel && (
        <div
          data-panel-id={activePanel}
          style={{
            width: 248,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Panel header */}
          <div
            style={{
              height: 40,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              borderBottom: '1px solid var(--color-border)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            {NAV_ITEMS.find((n) => n.id === activePanel)?.label}
          </div>

          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <PanelContent activePanel={activePanel} />
          </div>
        </div>
      )}
    </div>
  )
}
