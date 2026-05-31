'use client'

import { memo, useState, lazy, Suspense } from 'react'
import type { ButtonVariant } from '@/types/builder.types'
import { usePreviewState } from './PreviewStateContext'
import { useFramework } from '@/hooks/useFramework'
import { renderElement } from './registry'

// Lazy-load ColumnRenderer to avoid circular dep (elements → renderers → elements)
const ColumnRenderer = lazy(() => import('@/components/builder/renderers/ColumnRenderer'))

interface NavItem {
  id: string
  label: string
  href: string
  icon?: string
  badge?: string
}

interface Props {
  triggerText?: string
  triggerVariant?: ButtonVariant
  position?: 'left' | 'right' | 'top' | 'bottom'
  displayMode?: 'modal' | 'persistent'
  expandBehavior?: 'overlay' | 'push'
  width?: number
  collapsedWidth?: number
  height?: number
  collapsedHeight?: number
  defaultCollapsed?: boolean
  title?: string
  subtitle?: string
  logoText?: string
  logoSrc?: string
  navItems?: NavItem[]
  footerText?: string
  overlayColor?: string
  panelBg?: string
  headerBg?: string
  accentColor?: string
  textColor?: string
  closeOnOverlay?: boolean
  showDrawer?: boolean
  contentColumnId?: string
  // Top header
  showTopHeader?: boolean
  topHeaderHeight?: number
  topHeaderBg?: string
  topHeaderBorderColor?: string
  topHeaderTextColor?: string
  topHeaderIconColor?: string
  topHeaderShadow?: boolean
  topHeaderPageTitle?: string
  topHeaderShowSearch?: boolean
  topHeaderSearchPlaceholder?: string
  topHeaderShowNotifications?: boolean
  topHeaderNotificationCount?: number
  topHeaderShowMessages?: boolean
  topHeaderMessageCount?: number
  topHeaderShowSettings?: boolean
  topHeaderShowHelp?: boolean
  topHeaderShowProfile?: boolean
  topHeaderProfileName?: string
  topHeaderProfileRole?: string
  topHeaderProfileSrc?: string
  topHeaderProfileInitials?: string
  style?: React.CSSProperties
}

const TRIGGER_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary:   { background: 'var(--color-primary)', color: '#fff', border: 'none' },
  secondary: { background: 'var(--color-border)', color: 'var(--color-text-primary)', border: 'none' },
  outline:   { background: 'transparent', color: 'var(--color-primary)', border: '1.5px solid var(--color-primary)' },
  ghost:     { background: 'transparent', color: 'var(--color-primary)', border: 'none' },
}

const NAV_ICONS: Record<string, string> = {
  dashboard: 'M3 5a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V5zM3 15a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z',
  analytics: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  folder:    'M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z',
  mail:      'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  settings:  'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  home:      'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  users:     'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  bell:      'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
}

function NavIcon({ name, size = 18 }: { name?: string; size?: number }) {
  const path = name ? NAV_ICONS[name] : null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {path ? <path d={path} /> : <circle cx="12" cy="12" r="4" />}
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' | 'up' | 'down' }) {
  const rotations = { left: 180, right: 0, up: 270, down: 90 }
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: `rotate(${rotations[direction]}deg)`, transition: 'transform 0.3s' }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

// ─── Content column renderer (shared across all framework variants) ───────────
function ContentColumn({ contentColumnId, previewState }: { contentColumnId?: string; previewState: ReturnType<typeof usePreviewState> }) {
  if (!contentColumnId) return null
  if (previewState) {
    const col = previewState.columns[contentColumnId]
    if (!col) return null
    return (
      <>
        {col.elementIds.map((eid) => {
          const el = previewState.elements[eid]
          if (!el) return null
          return (
            <div key={eid} style={{ marginBottom: 12 }}>
              {renderElement(el.content, el.styles as React.CSSProperties) ?? (
                <div style={{ color: '#aaa', fontSize: 12 }}>{el.content.type}</div>
              )}
            </div>
          )
        })}
      </>
    )
  }
  return (
    <Suspense fallback={null}>
      <ColumnRenderer id={contentColumnId} skipIfManaged={false} />
    </Suspense>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOTSTRAP variant
// ─────────────────────────────────────────────────────────────────────────────
function BootstrapDrawer({
  triggerText, triggerVariant = 'primary', position = 'left',
  displayMode = 'modal', width = 240, height = 320,
  title = 'Navigation', subtitle, logoText, navItems = [], footerText,
  showTopHeader, topHeaderPageTitle, topHeaderProfileName = 'John Doe',
  contentColumnId, showDrawer = true, style,
  previewState,
}: Props & { previewState: ReturnType<typeof usePreviewState> }) {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState(navItems[0]?.id ?? '')

  const offcanvasPlacement =
    position === 'left' ? 'offcanvas-start' :
    position === 'right' ? 'offcanvas-end' :
    position === 'top' ? 'offcanvas-top' : 'offcanvas-bottom'

  const bsTriggerClass =
    triggerVariant === 'primary' ? 'btn btn-primary' :
    triggerVariant === 'secondary' ? 'btn btn-secondary' :
    triggerVariant === 'outline' ? 'btn btn-outline-primary' :
    'btn btn-link'

  if (displayMode === 'persistent') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', ...(style as object) }}>
        {showTopHeader && (
          <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3" style={{ flexShrink: 0 }}>
            <span className="navbar-brand fw-bold">{logoText ?? title}</span>
            {topHeaderPageTitle && <span className="text-muted ms-2 small">/ {topHeaderPageTitle}</span>}
            <div className="ms-auto d-flex align-items-center gap-2">
              <span className="text-muted small">{topHeaderProfileName}</span>
            </div>
          </nav>
        )}
        <div className="d-flex flex-row flex-grow-1" style={{ minHeight: 0, overflow: 'hidden' }}>
          {showDrawer && (
            <div
              className="d-flex flex-column bg-white border-end"
              style={{ width, minWidth: width, flexShrink: 0, overflowY: 'auto' }}
            >
              <div className="p-3 border-bottom">
                <span className="fw-bold fs-6">{logoText ?? title}</span>
                {subtitle && <div className="text-muted small">{subtitle}</div>}
              </div>
              <ul className="nav nav-pills flex-column p-2 gap-1 flex-grow-1">
                {navItems.map((item) => (
                  <li key={item.id} className="nav-item">
                    <a
                      href={item.href}
                      className={`nav-link d-flex align-items-center gap-2${item.id === activeId ? ' active' : ''}`}
                      onClick={(e) => { e.preventDefault(); setActiveId(item.id) }}
                    >
                      <NavIcon name={item.icon} size={16} />
                      <span className="flex-grow-1">{item.label}</span>
                      {item.badge && <span className="badge bg-primary rounded-pill">{item.badge}</span>}
                    </a>
                  </li>
                ))}
              </ul>
              {footerText && (
                <div className="p-3 border-top text-muted small">{footerText}</div>
              )}
            </div>
          )}
          <div className="flex-grow-1 p-3" style={{ minWidth: 0, overflowY: 'auto' }}>
            <ContentColumn contentColumnId={contentColumnId} previewState={previewState} />
          </div>
        </div>
      </div>
    )
  }

  // Modal / offcanvas mode
  return (
    <div style={style}>
      <button className={bsTriggerClass} onClick={() => setOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ marginRight: 6 }}>
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        {triggerText}
      </button>

      {open && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={() => setOpen(false)}
          />
          <div
            className={`offcanvas ${offcanvasPlacement} show`}
            style={{
              zIndex: 1045,
              visibility: 'visible',
              ...(position === 'left' || position === 'right' ? { width } : { height }),
            }}
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">{logoText ?? title}</h5>
              <button className="btn-close" onClick={() => setOpen(false)} />
            </div>
            <div className="offcanvas-body p-0">
              <ul className="nav nav-pills flex-column p-2 gap-1">
                {navItems.map((item) => (
                  <li key={item.id} className="nav-item">
                    <a
                      href={item.href}
                      className={`nav-link d-flex align-items-center gap-2${item.id === activeId ? ' active' : ''}`}
                      onClick={(e) => { e.preventDefault(); setActiveId(item.id); setOpen(false) }}
                    >
                      <NavIcon name={item.icon} size={16} />
                      <span className="flex-grow-1">{item.label}</span>
                      {item.badge && <span className="badge bg-primary rounded-pill">{item.badge}</span>}
                    </a>
                  </li>
                ))}
              </ul>
              {footerText && (
                <div className="p-3 border-top text-muted small mt-auto">{footerText}</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MUI variant
// ─────────────────────────────────────────────────────────────────────────────
function MuiDrawer({
  triggerText, triggerVariant = 'primary', position = 'left',
  displayMode = 'modal', width = 240, height = 320,
  title = 'Navigation', subtitle, logoText, navItems = [], footerText,
  showTopHeader, topHeaderPageTitle, topHeaderProfileName = 'John Doe',
  contentColumnId, showDrawer = true, accentColor = '#6366f1', style,
  previewState,
}: Props & { previewState: ReturnType<typeof usePreviewState> }) {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState(navItems[0]?.id ?? '')

  const muiBtnClass =
    triggerVariant === 'primary' ? 'MuiButton-root MuiButton-contained' :
    triggerVariant === 'secondary' ? 'MuiButton-root MuiButton-colorInherit' :
    triggerVariant === 'outline' ? 'MuiButton-root MuiButton-outlined' :
    'MuiButton-root MuiButton-text'

  const drawerPaperStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1200,
    backgroundColor: '#fff',
    boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'transform 225ms cubic-bezier(0,0,0.2,1)',
    ...(position === 'left' ? { top: 0, left: 0, bottom: 0, width, transform: open ? 'translateX(0)' : `translateX(-${width}px)` } :
       position === 'right' ? { top: 0, right: 0, bottom: 0, width, transform: open ? 'translateX(0)' : `translateX(${width}px)` } :
       position === 'top' ? { top: 0, left: 0, right: 0, height, transform: open ? 'translateY(0)' : `translateY(-${height}px)` } :
       { bottom: 0, left: 0, right: 0, height, transform: open ? 'translateY(0)' : `translateY(${height}px)` }),
  }

  if (displayMode === 'persistent') {
    return (
      <div className="mui-root" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', ...(style as object) }}>
        {showTopHeader && (
          <header className="MuiAppBar-root" style={{ flexShrink: 0 }}>
            <div className="MuiToolbar-root" style={{ justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>{logoText ?? title}</span>
              {topHeaderPageTitle && <span style={{ opacity: 0.7, fontSize: 14 }}>{topHeaderPageTitle}</span>}
              <span style={{ fontSize: 14, opacity: 0.85 }}>{topHeaderProfileName}</span>
            </div>
          </header>
        )}
        <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {showDrawer && (
            <div style={{
              width,
              minWidth: width,
              flexShrink: 0,
              backgroundColor: '#fff',
              borderRight: '1px solid rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}>
              <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 15, color: 'rgba(0,0,0,0.87)' }}>{logoText ?? title}</div>
                {subtitle && <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: 'rgba(0,0,0,0.54)', marginTop: 2 }}>{subtitle}</div>}
              </div>
              <ul className="MuiList-root" style={{ padding: '8px 0', flex: 1 }}>
                {navItems.map((item) => (
                  <li key={item.id} className="MuiListItem-root" style={{ padding: '2px 8px' }}>
                    <a
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); setActiveId(item.id) }}
                      className="MuiListItemButton-root"
                      style={{
                        borderRadius: 4,
                        backgroundColor: item.id === activeId ? `${accentColor}14` : 'transparent',
                        color: item.id === activeId ? accentColor : 'rgba(0,0,0,0.87)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '8px 12px',
                        textDecoration: 'none',
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: 14,
                        fontWeight: item.id === activeId ? 600 : 400,
                        transition: 'background-color 150ms cubic-bezier(0.4,0,0.2,1)',
                        width: '100%',
                      }}
                    >
                      <span className="MuiListItemIcon-root" style={{ color: item.id === activeId ? accentColor : 'rgba(0,0,0,0.54)', minWidth: 24, display: 'flex' }}>
                        <NavIcon name={item.icon} size={20} />
                      </span>
                      <span className="MuiListItemText-root" style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && (
                        <span style={{ background: accentColor, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 12 }}>
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
              {footerText && (
                <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.08)', fontSize: 12, color: 'rgba(0,0,0,0.54)', fontFamily: 'Roboto, sans-serif' }}>
                  {footerText}
                </div>
              )}
            </div>
          )}
          <div className="MuiPaper-root" style={{ flex: 1, minWidth: 0, overflowY: 'auto', backgroundColor: '#fafafa', padding: 16 }}>
            <ContentColumn contentColumnId={contentColumnId} previewState={previewState} />
          </div>
        </div>
      </div>
    )
  }

  // Modal mode
  return (
    <div className="mui-root" style={style}>
      <a className={muiBtnClass} onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ marginRight: 8 }}>
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        {triggerText}
      </a>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 1199, backgroundColor: 'rgba(0,0,0,0.5)', transition: 'opacity 225ms' }}
          />
          <div style={drawerPaperStyle}>
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 15, color: 'rgba(0,0,0,0.87)' }}>{logoText ?? title}</div>
                {subtitle && <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.54)', fontFamily: 'Roboto, sans-serif' }}>{subtitle}</div>}
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.54)', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 4 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <ul className="MuiList-root" style={{ padding: '8px 0', flex: 1, overflowY: 'auto' }}>
              {navItems.map((item) => (
                <li key={item.id} className="MuiListItem-root" style={{ padding: '2px 8px' }}>
                  <a
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); setActiveId(item.id); setOpen(false) }}
                    className="MuiListItemButton-root"
                    style={{
                      borderRadius: 4,
                      backgroundColor: item.id === activeId ? `${accentColor}14` : 'transparent',
                      color: item.id === activeId ? accentColor : 'rgba(0,0,0,0.87)',
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '8px 12px', textDecoration: 'none',
                      fontFamily: 'Roboto, sans-serif', fontSize: 14,
                      fontWeight: item.id === activeId ? 600 : 400,
                      width: '100%',
                    }}
                  >
                    <span style={{ color: item.id === activeId ? accentColor : 'rgba(0,0,0,0.54)', display: 'flex' }}>
                      <NavIcon name={item.icon} size={20} />
                    </span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ background: accentColor, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 12 }}>
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
            {footerText && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.12)', fontSize: 12, color: 'rgba(0,0,0,0.54)', fontFamily: 'Roboto, sans-serif', flexShrink: 0 }}>
                {footerText}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TAILWIND variant
// ─────────────────────────────────────────────────────────────────────────────
function TailwindDrawer({
  triggerText, triggerVariant = 'primary', position = 'left',
  displayMode = 'modal', width = 240, height = 320,
  title = 'Navigation', subtitle, logoText, navItems = [], footerText,
  showTopHeader, topHeaderPageTitle, topHeaderProfileName = 'John Doe',
  contentColumnId, showDrawer = true, closeOnOverlay = true, style,
  previewState,
}: Props & { previewState: ReturnType<typeof usePreviewState> }) {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState(navItems[0]?.id ?? '')

  const twBtnClass =
    triggerVariant === 'primary' ? 'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors' :
    triggerVariant === 'secondary' ? 'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors' :
    triggerVariant === 'outline' ? 'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors' :
    'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors'

  const translateClass =
    position === 'left' ? (open ? 'translate-x-0' : '-translate-x-full') :
    position === 'right' ? (open ? 'translate-x-0' : 'translate-x-full') :
    position === 'top' ? (open ? 'translate-y-0' : '-translate-y-full') :
    (open ? 'translate-y-0' : 'translate-y-full')

  const panelPositionStyle: React.CSSProperties =
    position === 'left' ? { top: 0, left: 0, bottom: 0, width } :
    position === 'right' ? { top: 0, right: 0, bottom: 0, width } :
    position === 'top' ? { top: 0, left: 0, right: 0, height } :
    { bottom: 0, left: 0, right: 0, height }

  if (displayMode === 'persistent') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', ...(style as object) }}>
        {showTopHeader && (
          <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200" style={{ flexShrink: 0 }}>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-gray-900">{logoText ?? title}</span>
              {topHeaderPageTitle && <span className="text-sm text-gray-400">/ {topHeaderPageTitle}</span>}
            </div>
            <span className="text-sm text-gray-600">{topHeaderProfileName}</span>
          </header>
        )}
        <div className="flex flex-row flex-1" style={{ minHeight: 0, overflow: 'hidden' }}>
          {showDrawer && (
            <div
              className="flex flex-col bg-gray-900 border-r border-gray-700"
              style={{ width, minWidth: width, flexShrink: 0, overflowY: 'auto' }}
            >
              <div className="px-4 py-4 border-b border-gray-700">
                <div className="text-sm font-bold text-white">{logoText ?? title}</div>
                {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
              </div>
              <nav className="flex-1 px-2 py-3 space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); setActiveId(item.id) }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.id === activeId
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <NavIcon name={item.icon} size={16} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                    )}
                  </a>
                ))}
              </nav>
              {footerText && (
                <div className="px-4 py-3 border-t border-gray-700 text-xs text-gray-400">{footerText}</div>
              )}
            </div>
          )}
          <div className="flex-1 overflow-auto bg-gray-50 p-4" style={{ minWidth: 0 }}>
            <ContentColumn contentColumnId={contentColumnId} previewState={previewState} />
          </div>
        </div>
      </div>
    )
  }

  // Modal / slide-in mode
  return (
    <div style={style}>
      <button className={twBtnClass} onClick={() => setOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        {triggerText}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: 1000 }}
            onClick={() => closeOnOverlay && setOpen(false)}
          />
          <div
            className={`fixed bg-gray-900 flex flex-col transform transition-transform duration-300 ease-in-out ${translateClass}`}
            style={{ zIndex: 1001, ...panelPositionStyle }}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
              <div>
                <div className="text-sm font-bold text-white">{logoText ?? title}</div>
                {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); setActiveId(item.id); setOpen(false) }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.id === activeId
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <NavIcon name={item.icon} size={16} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                  )}
                </a>
              ))}
            </nav>
            {footerText && (
              <div className="px-4 py-3 border-t border-gray-700 text-xs text-gray-400">{footerText}</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM — original rich implementation (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

function TopBar({
  logoText, logoSrc, accentColor,
  pageTitle, bg, borderColor, textColor, iconColor, shadow, height,
  showSearch, searchPlaceholder,
  showNotifications, notificationCount,
  showMessages, messageCount,
  showSettings, showHelp,
  showProfile, profileName, profileRole, profileSrc, profileInitials,
}: {
  logoText: string
  logoSrc?: string
  accentColor: string
  pageTitle?: string
  bg: string
  borderColor: string
  textColor: string
  iconColor: string
  shadow: boolean
  height: number
  showSearch: boolean
  searchPlaceholder: string
  showNotifications: boolean
  notificationCount: number
  showMessages: boolean
  messageCount: number
  showSettings: boolean
  showHelp: boolean
  showProfile: boolean
  profileName: string
  profileRole?: string
  profileSrc?: string
  profileInitials?: string
}) {
  const dimText = textColor + '99'
  const iconBtnBg = iconColor + '14'
  const logoChar = logoText ? logoText[0].toUpperCase() : 'A'
  const initials = profileInitials
    || (profileName ? profileName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : 'U')

  return (
    <header style={{
      width: '100%', height, minHeight: height, flexShrink: 0,
      background: bg, borderBottom: `1px solid ${borderColor}`,
      boxShadow: shadow ? '0 1px 6px rgba(0,0,0,0.07)' : 'none',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16,
      position: 'sticky', top: 0, zIndex: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {logoSrc
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={logoSrc} alt={logoText} style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
          : (
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: accentColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
            }}>
              {logoChar}
            </div>
          )
        }
        <span style={{ fontSize: 15, fontWeight: 700, color: textColor, letterSpacing: '-0.02em' }}>
          {logoText}
        </span>
        {pageTitle && (
          <>
            <span style={{ color: borderColor, fontSize: 18, fontWeight: 300 }}>/</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: dimText }}>{pageTitle}</span>
          </>
        )}
      </div>

      {showSearch && (
        <div style={{ flex: 1, maxWidth: 380, margin: '0 auto', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: 10, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={iconColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7" cy="7" r="5" /><path d="M12 12l2.5 2.5" />
            </svg>
          </div>
          <input readOnly placeholder={searchPlaceholder} style={{
            width: '100%', height: 34, paddingLeft: 34, paddingRight: 40,
            borderRadius: 8, border: `1px solid ${borderColor}`,
            background: iconColor + '0d', color: textColor, fontSize: 13, outline: 'none', cursor: 'text',
          }} />
          <span style={{
            position: 'absolute', right: 8, fontSize: 10, color: dimText,
            background: bg, border: `1px solid ${borderColor}`, borderRadius: 4, padding: '1px 5px', fontFamily: 'monospace',
          }}>⌘K</span>
        </div>
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        {showHelp && <IconBtn accent={accentColor} bg={iconBtnBg}><HelpSvg c={iconColor} /></IconBtn>}
        {showSettings && <IconBtn accent={accentColor} bg={iconBtnBg}><SettingsSvg c={iconColor} /></IconBtn>}
        {showMessages && <IconBtn badge={messageCount} accent={accentColor} bg={iconBtnBg}><MessageSvg c={iconColor} /></IconBtn>}
        {showNotifications && <IconBtn badge={notificationCount} accent={accentColor} bg={iconBtnBg}><BellSvg c={iconColor} /></IconBtn>}

        {showProfile && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginLeft: 4, padding: '4px 8px 4px 4px',
            borderRadius: 8, cursor: 'pointer',
            border: `1px solid ${borderColor}`,
          }}>
            {profileSrc
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={profileSrc} alt={profileName} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
              : (
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', background: accentColor,
                  color: '#fff', fontWeight: 700, fontSize: 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {initials}
                </div>
              )
            }
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: textColor, whiteSpace: 'nowrap' }}>{profileName}</div>
              {profileRole && <div style={{ fontSize: 10, color: dimText, whiteSpace: 'nowrap' }}>{profileRole}</div>}
            </div>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4.5l3 3 3-3" />
            </svg>
          </div>
        )}
      </div>
    </header>
  )
}

function BellSvg({ c }: { c: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2a5 5 0 0 1 5 5c0 3 1 4 1.5 5h-13C3 11 4 10 4 7a5 5 0 0 1 5-5z" />
      <path d="M7.5 14.5a1.5 1.5 0 0 0 3 0" />
    </svg>
  )
}
function MessageSvg({ c }: { c: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="14" height="11" rx="2" />
      <path d="M2 6l7 5 7-5" />
    </svg>
  )
}
function SettingsSvg({ c }: { c: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="2.5" />
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4" />
    </svg>
  )
}
function HelpSvg({ c }: { c: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="7" />
      <path d="M6.8 6.8a2.2 2.2 0 0 1 4.2.7c0 1.5-2.2 1.8-2.2 3.5" />
      <circle cx="9" cy="13.5" r=".5" fill={c} stroke="none" />
    </svg>
  )
}
function IconBtn({ children, badge, accent, bg }: { children: React.ReactNode; badge?: number; accent: string; bg: string }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button style={{ width: 34, height: 34, borderRadius: 8, border: 'none', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        {children}
      </button>
      {badge !== undefined && badge > 0 && (
        <span style={{
          position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16,
          padding: '0 4px', borderRadius: 8, background: accent, color: '#fff',
          fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
        }}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </div>
  )
}

function PersistentSidebar({
  position, expandBehavior, width, collapsedWidth, height, collapsedHeight,
  collapsed, onToggle, activeId, onActivate,
  title, subtitle, logoText, logoSrc, navItems, footerText,
  panelBg, headerBg, accentColor, textColor,
}: {
  position: 'left' | 'right' | 'top' | 'bottom'
  expandBehavior: 'overlay' | 'push'
  width: number
  collapsedWidth: number
  height: number
  collapsedHeight: number
  collapsed: boolean
  onToggle: () => void
  activeId: string
  onActivate: (id: string) => void
  title: string
  subtitle?: string
  logoText?: string
  logoSrc?: string
  navItems: NavItem[]
  footerText?: string
  panelBg: string
  headerBg: string
  accentColor: string
  textColor: string
}) {
  const isHorizontal = position === 'left' || position === 'right'
  const dimText = textColor + '99'
  const isOverlay = expandBehavior === 'overlay'
  const currentWidth  = isHorizontal ? (collapsed ? collapsedWidth : width) : '100%'
  const currentHeight = isHorizontal ? '100%' : (collapsed ? collapsedHeight : height)

  const chevronDir: 'left' | 'right' | 'up' | 'down' =
    position === 'left'   ? (collapsed ? 'right' : 'left') :
    position === 'right'  ? (collapsed ? 'left'  : 'right') :
    position === 'top'    ? (collapsed ? 'down'  : 'up') :
    /* bottom */            (collapsed ? 'up'    : 'down')

  const panelStyle: React.CSSProperties = {
    display: 'flex', flexDirection: isHorizontal ? 'column' : 'row',
    background: panelBg,
    width: currentWidth, height: currentHeight,
    transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), height 0.3s cubic-bezier(0.4,0,0.2,1)',
    overflow: 'hidden',
    boxShadow: isOverlay
      ? (position === 'left' ? '4px 0 24px rgba(0,0,0,0.25)' :
         position === 'right' ? '-4px 0 24px rgba(0,0,0,0.25)' :
         position === 'top' ? '0 4px 24px rgba(0,0,0,0.25)' :
         '0 -4px 24px rgba(0,0,0,0.25)')
      : 'none',
    ...(isOverlay ? {
      position: 'absolute', zIndex: 100,
      top: position === 'bottom' ? undefined : 0,
      bottom: position === 'top' ? undefined : (isHorizontal ? 0 : undefined),
      left: position === 'right' ? undefined : (isHorizontal ? 0 : 0),
      right: position === 'left' ? undefined : (isHorizontal ? 0 : 0),
    } : {}),
  }

  const logoChar = (logoText ?? title).charAt(0).toUpperCase()

  return (
    <div style={panelStyle}>
      <div style={{
        background: headerBg, flexShrink: 0,
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        padding: collapsed ? (isHorizontal ? '12px 0' : '0 12px') : (isHorizontal ? '12px 12px' : '0 12px'),
        gap: 8,
        borderBottom: isHorizontal ? `1px solid rgba(255,255,255,0.07)` : 'none',
        borderRight: !isHorizontal ? `1px solid rgba(255,255,255,0.07)` : 'none',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: isHorizontal ? 56 : '100%',
        minWidth: !isHorizontal ? 56 : '100%',
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, overflow: 'hidden', flex: 1, minWidth: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9, background: accentColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 15, color: '#fff', flexShrink: 0,
            }}>
              {logoSrc
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={logoSrc} alt="logo" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
                : logoChar
              }
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: textColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {logoText ?? title}
              </div>
              {subtitle && <div style={{ fontSize: 11, color: dimText, whiteSpace: 'nowrap' }}>{subtitle}</div>}
            </div>
          </div>
        )}
        <button onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'} style={{
          background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 6,
          width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: textColor, flexShrink: 0,
        }}>
          <ChevronIcon direction={chevronDir} />
        </button>
      </div>

      {!collapsed && isHorizontal && navItems.length > 0 && (
        <div style={{ padding: '14px 16px 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: dimText, flexShrink: 0 }}>
          MENU
        </div>
      )}

      <nav style={{
        flex: 1,
        overflowY: isHorizontal ? 'auto' : 'hidden',
        overflowX: !isHorizontal ? 'auto' : 'hidden',
        padding: collapsed ? (isHorizontal ? '8px 0' : '0 8px') : (isHorizontal ? '4px 8px 8px' : '0 8px'),
        display: !isHorizontal ? 'flex' : 'block',
        alignItems: !isHorizontal ? 'center' : undefined,
        gap: !isHorizontal ? 4 : undefined,
      }}>
        {navItems.map((item) => {
          const isActive = item.id === activeId
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => { e.preventDefault(); onActivate(item.id) }}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
                gap: 10, padding: collapsed ? '10px 0' : '9px 10px', borderRadius: 8,
                marginBottom: isHorizontal ? 2 : 0, textDecoration: 'none', cursor: 'pointer',
                background: isActive ? `${accentColor}25` : 'transparent',
                color: isActive ? accentColor : textColor,
                fontWeight: isActive ? 600 : 400, fontSize: 13, position: 'relative',
                transition: 'background 0.15s, color 0.15s', whiteSpace: 'nowrap',
                minWidth: collapsed && isHorizontal ? collapsedWidth : undefined,
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  ...(isHorizontal
                    ? { left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, borderRadius: '0 3px 3px 0' }
                    : { top: 0, left: '50%', transform: 'translateX(-50%)', height: 3, width: 20, borderRadius: '0 0 3px 3px' }
                  ),
                  background: accentColor,
                }} />
              )}
              <span style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0, display: 'flex' }}>
                <NavIcon name={item.icon} />
              </span>
              {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              {!collapsed && item.badge && (
                <span style={{ background: accentColor, color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 20 }}>
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <div style={{ position: 'absolute', top: 6, right: isHorizontal ? 8 : 6, width: 7, height: 7, borderRadius: '50%', background: accentColor }} />
              )}
            </a>
          )
        })}
      </nav>

      {footerText && !collapsed && isHorizontal && (
        <div style={{ padding: '12px 16px', borderTop: `1px solid rgba(255,255,255,0.07)`, fontSize: 11, color: dimText, flexShrink: 0 }}>
          {footerText}
        </div>
      )}
    </div>
  )
}

function CustomDrawer({
  triggerText = 'Open Menu', triggerVariant = 'primary',
  position = 'left', displayMode = 'persistent', expandBehavior = 'push',
  width = 240, collapsedWidth = 60, height = 320, collapsedHeight = 60,
  defaultCollapsed = false, title = 'Navigation', subtitle, logoText, logoSrc,
  navItems = [], footerText, overlayColor = 'rgba(0,0,0,0.45)',
  panelBg = '#1e1e2e', headerBg = '#16162a', accentColor = '#6366f1',
  textColor = '#e2e8f0', closeOnOverlay = true, showDrawer = true,
  contentColumnId,
  showTopHeader = false, topHeaderHeight = 60, topHeaderBg = '#ffffff',
  topHeaderBorderColor = '#e5e7eb', topHeaderTextColor = '#111827',
  topHeaderIconColor = '#6b7280', topHeaderShadow = true, topHeaderPageTitle,
  topHeaderShowSearch = true, topHeaderSearchPlaceholder = 'Search…',
  topHeaderShowNotifications = true, topHeaderNotificationCount = 3,
  topHeaderShowMessages = true, topHeaderMessageCount = 0,
  topHeaderShowSettings = true, topHeaderShowHelp = false,
  topHeaderShowProfile = true, topHeaderProfileName = 'John Doe',
  topHeaderProfileRole, topHeaderProfileSrc, topHeaderProfileInitials,
  style, previewState,
}: Props & { previewState: ReturnType<typeof usePreviewState> }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [activeId, setActiveId] = useState(navItems[0]?.id ?? '')
  const isHorizontal = position === 'left' || position === 'right'

  if (displayMode === 'persistent') {
    const sidebar = (
      <PersistentSidebar
        position={position} expandBehavior={expandBehavior}
        width={width} collapsedWidth={collapsedWidth}
        height={height} collapsedHeight={collapsedHeight}
        collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)}
        activeId={activeId} onActivate={setActiveId}
        title={title} subtitle={subtitle} logoText={logoText} logoSrc={logoSrc}
        navItems={navItems} footerText={footerText}
        panelBg={panelBg} headerBg={headerBg} accentColor={accentColor} textColor={textColor}
      />
    )

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', ...(style as object) }}>
        {showTopHeader && (
          <TopBar
            logoText={logoText ?? title} logoSrc={logoSrc} accentColor={accentColor}
            pageTitle={topHeaderPageTitle} bg={topHeaderBg} borderColor={topHeaderBorderColor}
            textColor={topHeaderTextColor} iconColor={topHeaderIconColor}
            shadow={topHeaderShadow} height={topHeaderHeight}
            showSearch={topHeaderShowSearch} searchPlaceholder={topHeaderSearchPlaceholder}
            showNotifications={topHeaderShowNotifications} notificationCount={topHeaderNotificationCount}
            showMessages={topHeaderShowMessages} messageCount={topHeaderMessageCount}
            showSettings={topHeaderShowSettings} showHelp={topHeaderShowHelp}
            showProfile={topHeaderShowProfile} profileName={topHeaderProfileName}
            profileRole={topHeaderProfileRole} profileSrc={topHeaderProfileSrc}
            profileInitials={topHeaderProfileInitials}
          />
        )}
        <div style={{ display: 'flex', flexDirection: isHorizontal ? 'row' : 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {showDrawer && sidebar}
          <div style={{ flex: 1, minWidth: 0, minHeight: 0, overflow: 'auto', background: 'var(--color-bg, #f8f9fa)' }}>
            <ContentColumn contentColumnId={contentColumnId} previewState={previewState} />
          </div>
        </div>
      </div>
    )
  }

  // Modal mode
  const drawerStyle: React.CSSProperties = {
    position: 'fixed', zIndex: 1001, background: panelBg,
    display: 'flex', flexDirection: 'column',
    transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
    ...(position === 'left'   ? { top: 0, left: 0, bottom: 0, width, boxShadow: '4px 0 32px rgba(0,0,0,0.3)', transform: modalOpen ? 'translateX(0)' : `translateX(-${width}px)` } :
       position === 'right'  ? { top: 0, right: 0, bottom: 0, width, boxShadow: '-4px 0 32px rgba(0,0,0,0.3)', transform: modalOpen ? 'translateX(0)' : `translateX(${width}px)` } :
       position === 'top'    ? { top: 0, left: 0, right: 0, height, boxShadow: '0 4px 32px rgba(0,0,0,0.3)', transform: modalOpen ? 'translateY(0)' : `translateY(-${height}px)` } :
       /* bottom */            { bottom: 0, left: 0, right: 0, height, boxShadow: '0 -4px 32px rgba(0,0,0,0.3)', transform: modalOpen ? 'translateY(0)' : `translateY(${height}px)` }),
  }
  const dimText = textColor + '99'

  return (
    <div style={style}>
      <button
        onClick={() => setModalOpen(true)}
        style={{
          padding: '10px 22px', borderRadius: 8, cursor: 'pointer',
          fontSize: 14, fontWeight: 600, letterSpacing: '0.01em',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          ...TRIGGER_STYLES[triggerVariant],
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        {triggerText}
      </button>

      {modalOpen && (
        <>
          <div
            onClick={() => closeOnOverlay && setModalOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: overlayColor, backdropFilter: 'blur(2px)' }}
          />
          <div style={drawerStyle}>
            <div style={{
              background: headerBg, padding: '18px 16px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: `1px solid rgba(255,255,255,0.07)`, flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10, background: accentColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 15, color: '#fff',
                }}>
                  {logoSrc
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={logoSrc} alt="logo" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
                    : (logoText ?? title).charAt(0).toUpperCase()
                  }
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: textColor }}>{logoText ?? title}</div>
                  {subtitle && <div style={{ fontSize: 11, color: dimText }}>{subtitle}</div>}
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer',
                  width: 28, height: 28, borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {navItems.length > 0 && (
              <div style={{ padding: '14px 16px 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: dimText }}>
                MENU
              </div>
            )}

            <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 8px' }}>
              {navItems.map((item) => {
                const isActive = item.id === activeId
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); setActiveId(item.id) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 10px', borderRadius: 8, marginBottom: 2,
                      textDecoration: 'none', cursor: 'pointer',
                      background: isActive ? `${accentColor}25` : 'transparent',
                      color: isActive ? accentColor : textColor,
                      fontWeight: isActive ? 600 : 400, fontSize: 13, position: 'relative',
                      transition: 'background 0.15s',
                    }}
                  >
                    {isActive && (
                      <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, borderRadius: '0 3px 3px 0', background: accentColor }} />
                    )}
                    <span style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0, display: 'flex' }}>
                      <NavIcon name={item.icon} />
                    </span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ background: accentColor, color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 20 }}>
                        {item.badge}
                      </span>
                    )}
                  </a>
                )
              })}
            </nav>

            {footerText && (
              <div style={{ padding: '12px 16px', borderTop: `1px solid rgba(255,255,255,0.07)`, fontSize: 11, color: dimText, flexShrink: 0 }}>
                {footerText}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export — dispatches to framework variant
// ─────────────────────────────────────────────────────────────────────────────
function DrawerElement(props: Props) {
  const framework = useFramework()
  const previewState = usePreviewState()

  if (framework === 'bootstrap') return <BootstrapDrawer {...props} previewState={previewState} />
  if (framework === 'mui') return <MuiDrawer {...props} previewState={previewState} />
  if (framework === 'tailwind') return <TailwindDrawer {...props} previewState={previewState} />
  return <CustomDrawer {...props} previewState={previewState} />
}

export default memo(DrawerElement)
