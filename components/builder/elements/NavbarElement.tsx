'use client'

import { memo, useState, useEffect, useCallback, useId } from 'react'
import type { NavItem, NavbarCta } from '@/types/builder.types'
import { useFramework } from '@/hooks/useFramework'
import { usePreviewState } from '@/components/builder/elements/PreviewStateContext'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  logoType?: 'text' | 'image'
  logoText?: string
  logoSrc?: string
  logoVisibility?: { desktop?: boolean; tablet?: boolean; mobile?: boolean }
  items?: NavItem[]
  cta?: NavbarCta
  desktopLayout?: 'left' | 'center' | 'right'
  mobileBreakpoint?: number
  mobileMenuStyle?: 'drawer-left' | 'drawer-right' | 'fullscreen'
  mobilePanelBg?: string
  mobileTextColor?: string
  showCtaMobile?: boolean
  style?: React.CSSProperties
}

// ─── CTA button ───────────────────────────────────────────────────────────────

function CtaButton({ cta, small }: { cta: NavbarCta; small?: boolean }) {
  const bg = cta.variant === 'primary' ? 'var(--color-primary)' : cta.variant === 'secondary' ? 'var(--color-text-secondary)' : 'transparent'
  const color = cta.variant === 'ghost' || cta.variant === 'outline' ? 'var(--color-primary)' : '#fff'
  const border = cta.variant === 'outline' ? '1.5px solid var(--color-primary)' : '1.5px solid transparent'
  return (
    <a
      href={cta.href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: small ? '6px 14px' : '8px 18px',
        borderRadius: 7,
        backgroundColor: bg,
        color,
        border,
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: small ? '0.8rem' : '0.875rem',
        whiteSpace: 'nowrap',
        transition: 'opacity 150ms',
        flexShrink: 0,
      }}
    >
      {cta.text}
    </a>
  )
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo({ logoType, logoText, logoSrc }: { logoType: string; logoText: string; logoSrc?: string }) {
  if (logoType === 'image' && logoSrc) {
    return (
      <a href="#" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt={logoText || 'Logo'} style={{ height: 32, width: 'auto', objectFit: 'contain', display: 'block' }} />
      </a>
    )
  }
  return (
    <a href="#" style={{ fontWeight: 800, fontSize: '1.125rem', color: 'inherit', textDecoration: 'none', flexShrink: 0, letterSpacing: '-0.02em' }}>
      {logoText || 'Brand'}
    </a>
  )
}

// ─── Desktop nav item with optional submenu ───────────────────────────────────

function DesktopNavItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const hasSub = (item.children?.length ?? 0) > 0

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => hasSub && setOpen(true)}
      onMouseLeave={() => hasSub && setOpen(false)}
    >
      <a
        href={item.href}
        target={item.target}
        rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: 'inherit',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          padding: '4px 2px',
          whiteSpace: 'nowrap',
          transition: 'opacity 150ms',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.65' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
      >
        {item.label}
        {hasSub && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>
            <path d="M2 3.5l3 3 3-3" />
          </svg>
        )}
      </a>

      {/* Dropdown */}
      {hasSub && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          marginTop: 8,
          minWidth: 160,
          backgroundColor: 'var(--color-bg)',
          borderRadius: 10,
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          border: '1px solid var(--color-border)',
          padding: '6px 0',
          zIndex: 100,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transform: open ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-6px)',
          transition: 'opacity 160ms ease, transform 160ms ease',
        }}>
          {item.children!.map((child) => (
            <a
              key={child.id}
              href={child.href}
              style={{
                display: 'block',
                padding: '8px 16px',
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
                fontSize: '0.8375rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                transition: 'background 100ms',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#f9fafb' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent' }}
            >
              {child.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Hamburger icon ───────────────────────────────────────────────────────────

function HamburgerIcon({ open, color }: { open: boolean; color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" style={{ transition: 'all 200ms' }}>
      {open ? (
        <>
          <path d="M4 4l14 14" />
          <path d="M18 4L4 18" />
        </>
      ) : (
        <>
          <path d="M3 6h16" />
          <path d="M3 11h16" />
          <path d="M3 16h16" />
        </>
      )}
    </svg>
  )
}

// ─── Mobile drawer ────────────────────────────────────────────────────────────

function MobileDrawer({
  open,
  onClose,
  items,
  cta,
  showCta,
  logoType,
  logoText,
  logoSrc,
  menuStyle,
  panelBg,
  textColor,
}: {
  open: boolean
  onClose: () => void
  items: NavItem[]
  cta?: NavbarCta
  showCta?: boolean
  logoType: string
  logoText: string
  logoSrc?: string
  menuStyle: 'drawer-left' | 'drawer-right' | 'fullscreen'
  panelBg: string
  textColor: string
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isFullscreen = menuStyle === 'fullscreen'
  const isRight = menuStyle === 'drawer-right'

  const panelStyle: React.CSSProperties = isFullscreen
    ? {
        position: 'fixed',
        inset: 0,
        backgroundColor: panelBg,
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 28px',
        overflowY: 'auto',
        opacity: open ? 1 : 0,
        transform: open ? 'none' : 'translateY(-12px)',
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 250ms ease, transform 250ms ease',
      }
    : {
        position: 'fixed',
        top: 0,
        [isRight ? 'right' : 'left']: 0,
        bottom: 0,
        width: 'min(320px, 85vw)',
        backgroundColor: panelBg,
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 24px',
        overflowY: 'auto',
        boxShadow: '0 0 40px rgba(0,0,0,0.18)',
        transform: open
          ? 'translateX(0)'
          : isRight ? 'translateX(100%)' : 'translateX(-100%)',
        pointerEvents: open ? 'auto' : 'none',
        transition: 'transform 280ms cubic-bezier(0.4,0,0.2,1)',
        borderRadius: isRight ? '16px 0 0 16px' : '0 16px 16px 0',
      }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <>
      {/* Overlay */}
      {!isFullscreen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 1000,
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
            transition: 'opacity 280ms ease',
          }}
        />
      )}

      <div style={panelStyle} role="dialog" aria-modal="true">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <Logo logoType={logoType} logoText={logoText} logoSrc={logoSrc} />
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, color: textColor, opacity: 0.6 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 3l12 12M15 3L3 15" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav style={{ flex: 1 }}>
          {items.map((item, i) => {
            const hasSub = (item.children?.length ?? 0) > 0
            const isExpanded = expandedIds.has(item.id)
            return (
              <div key={item.id}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: i < items.length - 1 ? `1px solid ${textColor}18` : 'none',
                }}>
                  <a
                    href={item.href}
                    target={item.target}
                    rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                    onClick={hasSub ? undefined : onClose}
                    style={{
                      flex: 1,
                      display: 'block',
                      padding: '13px 0',
                      color: textColor,
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </a>
                  {hasSub && (
                    <button
                      onClick={() => toggleExpand(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: textColor, opacity: 0.6 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
                        <path d="M3 5l4 4 4-4" />
                      </svg>
                    </button>
                  )}
                </div>
                {/* Submenu */}
                {hasSub && isExpanded && (
                  <div style={{ paddingLeft: 14, borderLeft: `2px solid ${textColor}22`, marginBottom: 4 }}>
                    {item.children!.map((child) => (
                      <a
                        key={child.id}
                        href={child.href}
                        onClick={onClose}
                        style={{
                          display: 'block',
                          padding: '9px 0',
                          color: textColor,
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: 400,
                          opacity: 0.75,
                        }}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* CTA */}
        {showCta && cta && (
          <div style={{ marginTop: 24 }}>
            <CtaButton cta={cta} small />
          </div>
        )}
      </div>
    </>
  )
}

// ─── Main NavbarElement ───────────────────────────────────────────────────────

const NavbarElement = memo(function NavbarElement({
  logoType = 'text',
  logoText = 'Brand',
  logoSrc,
  logoVisibility = { desktop: true, tablet: true, mobile: true },
  items = [
    { id: '1', label: 'Home', href: '#' },
    { id: '2', label: 'About', href: '#' },
    { id: '3', label: 'Contact', href: '#' },
  ],
  cta,
  desktopLayout = 'right',
  mobileBreakpoint = 768,
  mobileMenuStyle = 'drawer-left',
  mobilePanelBg = '#ffffff',
  mobileTextColor = '#111827',
  showCtaMobile = true,
  style,
}: Props) {
  const uid = useId().replace(/:/g, '')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [_isMobile, setIsMobile] = useState(false)
  const framework = useFramework()
  const previewState = usePreviewState()
  // In builder canvas (not preview), always show desktop layout so nav links
  // are visible regardless of the canvas panel width.
  const isPreview = previewState !== null
  const effectiveIsMobile = isPreview ? _isMobile : false

  useEffect(() => {
    if (!isPreview) return
    const mq = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [mobileBreakpoint, isPreview])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  // ── Bootstrap navbar ───────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    // In builder, we force-show the collapse so items are always visible.
    // In preview (real app), normal collapse behavior applies.
    const forceShow = !isPreview
    const bgColor = style?.backgroundColor ?? '#ffffff'
    const textColor = (style?.color as string) ?? '#212529'

    return (
      <nav className="navbar navbar-expand-sm" style={{ backgroundColor: bgColor, color: textColor, borderRadius: 6, ...style }}>
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#" style={{ color: textColor }}>
            {logoType === 'image' && logoSrc
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={logoSrc} alt={logoText || 'Logo'} height={32} style={{ display: 'block' }} />
              : (logoText || 'Brand')}
          </a>
          {!forceShow && (
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target={`#${uid}-nav`} aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
          )}
          <div className={`collapse navbar-collapse${forceShow ? ' show' : ''}`} id={`${uid}-nav`} style={forceShow ? { display: 'flex' } : undefined}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {items.map((item) => (
                <li key={item.id} className="nav-item">
                  <a className="nav-link" href={item.href} style={{ color: textColor }}>{item.label}</a>
                </li>
              ))}
            </ul>
            {cta && (
              <a
                href={cta.href}
                className={`btn ${cta.variant === 'outline' ? 'btn-outline-primary' : cta.variant === 'secondary' ? 'btn-secondary' : cta.variant === 'ghost' ? 'btn-link' : 'btn-primary'} ms-2`}
              >
                {cta.text}
              </a>
            )}
          </div>
        </div>
      </nav>
    )
  }

  // ── MUI AppBar ─────────────────────────────────────────────────────────────
  if (framework === 'mui') {
    return (
      <header className="mui-root MuiAppBar-root" style={style}>
        <div className="MuiToolbar-root" style={{ gap: 24 }}>
          <span style={{ fontWeight: 700, fontSize: '1.25rem', flex: logoType === 'image' && logoSrc ? undefined : undefined }}>
            {logoType === 'image' && logoSrc ? <img src={logoSrc} alt={logoText} height={32} style={{ verticalAlign: 'middle' }} /> : logoText}
          </span>
          <div style={{ display: 'flex', gap: 8, flex: 1 }}>
            {items.map((item) => (
              <a key={item.id} href={item.href} className="MuiButton-root MuiButton-text" style={{ color: '#fff' }}>{item.label}</a>
            ))}
          </div>
          {cta && <a href={cta.href} className="MuiButton-root MuiButton-outlined" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>{cta.text}</a>}
        </div>
      </header>
    )
  }

  // ── Tailwind navbar ────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    return (
      <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 rounded-lg" style={style}>
        <a href="#" className="font-bold text-lg text-gray-900">
          {logoType === 'image' && logoSrc ? <img src={logoSrc} alt={logoText} className="h-8 w-auto" /> : logoText}
        </a>
        <div className="flex items-center gap-6">
          {items.map((item) => (
            <a key={item.id} href={item.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">{item.label}</a>
          ))}
        </div>
        {cta && <a href={cta.href} className="inline-block px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">{cta.text}</a>}
      </nav>
    )
  }

  const showLogoOnDesktop = logoVisibility?.desktop !== false
  const showLogoOnMobile = logoVisibility?.mobile !== false
  const showLogoNow = effectiveIsMobile ? showLogoOnMobile : showLogoOnDesktop

  const navBg = (style?.backgroundColor as string | undefined) ?? '#ffffff'
  const navColor = (style?.color as string | undefined) ?? '#111827'

  // ── Desktop layout variants ────────────────────────────────────────────────
  // 'right': logo left | links center-right | cta right
  // 'center': logo left | links center | cta right
  // 'left': links left | logo right | cta right (rare)

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 60,
        backgroundColor: navBg,
        color: navColor,
        borderBottom: '1px solid #e5e7eb',
        borderRadius: 8,
        position: 'relative',
        ...style,
      }}
    >
      {/* Logo */}
      {showLogoNow && <Logo logoType={logoType} logoText={logoText} logoSrc={logoSrc} />}
      {!showLogoNow && <span />}

      {/* Desktop links */}
      {!effectiveIsMobile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          flex: desktopLayout === 'center' ? 1 : undefined,
          justifyContent: desktopLayout === 'center' ? 'center' : 'flex-start',
          marginLeft: desktopLayout === 'right' ? 'auto' : undefined,
          marginRight: desktopLayout === 'right' ? 24 : undefined,
        }}>
          {items.map((item) => <DesktopNavItem key={item.id} item={item} />)}
        </div>
      )}

      {/* Desktop CTA */}
      {!effectiveIsMobile && cta && <CtaButton cta={cta} />}

      {/* Mobile hamburger trigger */}
      {effectiveIsMobile && (
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          style={{
            width: 40,
            height: 40,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            color: navColor,
            marginLeft: 'auto',
          }}
        >
          <HamburgerIcon open={mobileOpen} color={navColor} />
        </button>
      )}

      {/* Mobile drawer */}
      {effectiveIsMobile && (
        <MobileDrawer
          open={mobileOpen}
          onClose={closeMobile}
          items={items}
          cta={cta}
          showCta={showCtaMobile}
          logoType={logoType}
          logoText={logoText}
          logoSrc={logoSrc}
          menuStyle={mobileMenuStyle}
          panelBg={mobilePanelBg}
          textColor={mobileTextColor}
        />
      )}
    </nav>
  )
})

export default NavbarElement
