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
  layoutVariant?: 'classic' | 'centered' | 'split' | 'minimal' | 'brand-hero'
  desktopLayout?: 'left' | 'center' | 'right'
  contactInfo?: string
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

function Logo({
  logoType,
  logoText,
  logoSrc,
  tagline,
  large,
}: {
  logoType: string
  logoText: string
  logoSrc?: string
  tagline?: string
  large?: boolean
}) {
  if (logoType === 'image' && logoSrc) {
    return (
      <a href="#" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt={logoText || 'Logo'} style={{ height: large ? 48 : 32, width: 'auto', objectFit: 'contain', display: 'block' }} />
      </a>
    )
  }
  return (
    <a
      href="#"
      style={{
        display: 'flex',
        flexDirection: tagline ? 'column' : 'row',
        alignItems: tagline ? 'flex-start' : 'center',
        textDecoration: 'none',
        flexShrink: 0,
        gap: 2,
      }}
    >
      <span style={{ fontWeight: 800, fontSize: large ? '1.5rem' : '1.125rem', color: 'inherit', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        {logoText || 'Brand'}
      </span>
      {tagline && (
        <span style={{ fontSize: '0.7rem', fontWeight: 400, opacity: 0.6, letterSpacing: '0.02em', color: 'inherit' }}>
          {tagline}
        </span>
      )}
    </a>
  )
}

// ─── Desktop nav item with optional submenu ───────────────────────────────────

function DesktopNavItem({ item, navColor }: { item: NavItem; navColor?: string }) {
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
                    style={{ flex: 1, display: 'block', padding: '13px 0', color: textColor, textDecoration: 'none', fontSize: '1rem', fontWeight: 500 }}
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
                {hasSub && isExpanded && (
                  <div style={{ paddingLeft: 14, borderLeft: `2px solid ${textColor}22`, marginBottom: 4 }}>
                    {item.children!.map((child) => (
                      <a
                        key={child.id}
                        href={child.href}
                        onClick={onClose}
                        style={{ display: 'block', padding: '9px 0', color: textColor, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 400, opacity: 0.75 }}
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

        {showCta && cta && (
          <div style={{ marginTop: 24 }}>
            <CtaButton cta={cta} small />
          </div>
        )}
      </div>
    </>
  )
}

// ─── Hamburger trigger button ─────────────────────────────────────────────────

function HamburgerBtn({ open, color, onClick }: { open: boolean; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
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
        color,
        flexShrink: 0,
      }}
    >
      <HamburgerIcon open={open} color={color} />
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout renderers
// ─────────────────────────────────────────────────────────────────────────────

// Layout 1 — Classic: Logo left | Links right | CTA far right
function LayoutClassic({
  items, cta, logoType, logoText, logoSrc, navBg, navColor, isMobile, mobileOpen, setMobileOpen,
  mobileMenuStyle, mobilePanelBg, mobileTextColor, showCtaMobile, style, desktopLayout,
}: LayoutSharedProps & { desktopLayout?: 'left' | 'center' | 'right' }) {
  const closeMobile = useCallback(() => setMobileOpen(false), [setMobileOpen])
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64, backgroundColor: navBg, color: navColor, borderBottom: '1px solid rgba(0,0,0,0.08)', position: 'relative', ...style }}>
      <Logo logoType={logoType} logoText={logoText} logoSrc={logoSrc} />

      {!isMobile && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 28,
          flex: desktopLayout === 'center' ? 1 : undefined,
          justifyContent: desktopLayout === 'center' ? 'center' : 'flex-start',
          marginLeft: desktopLayout === 'right' ? 'auto' : undefined,
          marginRight: desktopLayout === 'right' && cta ? 24 : undefined,
        }}>
          {items.map((item) => <DesktopNavItem key={item.id} item={item} navColor={navColor} />)}
        </div>
      )}

      {!isMobile && cta && <CtaButton cta={cta} />}

      {isMobile && (
        <>
          <HamburgerBtn open={mobileOpen} color={navColor} onClick={() => setMobileOpen((v) => !v)} />
          <MobileDrawer open={mobileOpen} onClose={closeMobile} items={items} cta={cta} showCta={showCtaMobile} logoType={logoType} logoText={logoText} logoSrc={logoSrc} menuStyle={mobileMenuStyle} panelBg={mobilePanelBg} textColor={mobileTextColor} />
        </>
      )}
    </nav>
  )
}

// Layout 2 — Centered: Logo top-center, nav links below centered (2-row)
function LayoutCentered({
  items, cta, logoType, logoText, logoSrc, navBg, navColor, isMobile, mobileOpen, setMobileOpen,
  mobileMenuStyle, mobilePanelBg, mobileTextColor, showCtaMobile, style,
}: LayoutSharedProps) {
  const closeMobile = useCallback(() => setMobileOpen(false), [setMobileOpen])
  return (
    <nav style={{ backgroundColor: navBg, color: navColor, borderBottom: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden', ...style }}>
      {/* Row 1: logo centered */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 24px 0', position: 'relative', minHeight: 52 }}>
        <Logo logoType={logoType} logoText={logoText} logoSrc={logoSrc} />
        {/* Mobile hamburger in corner */}
        {isMobile && (
          <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}>
            <HamburgerBtn open={mobileOpen} color={navColor} onClick={() => setMobileOpen((v) => !v)} />
          </div>
        )}
      </div>

      {/* Row 2: links centered (desktop only) */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '8px 24px 14px', borderTop: `1px solid ${navColor}12`, marginTop: 8 }}>
          {items.map((item) => <DesktopNavItem key={item.id} item={item} navColor={navColor} />)}
          {cta && <CtaButton cta={cta} />}
        </div>
      )}

      {isMobile && (
        <MobileDrawer open={mobileOpen} onClose={closeMobile} items={items} cta={cta} showCta={showCtaMobile} logoType={logoType} logoText={logoText} logoSrc={logoSrc} menuStyle={mobileMenuStyle} panelBg={mobilePanelBg} textColor={mobileTextColor} />
      )}
    </nav>
  )
}

// Layout 3 — Split: Logo left | Links absolutely centered | CTA right
function LayoutSplit({
  items, cta, logoType, logoText, logoSrc, navBg, navColor, isMobile, mobileOpen, setMobileOpen,
  mobileMenuStyle, mobilePanelBg, mobileTextColor, showCtaMobile, style,
}: LayoutSharedProps) {
  const closeMobile = useCallback(() => setMobileOpen(false), [setMobileOpen])
  return (
    <nav style={{ display: 'flex', alignItems: 'center', padding: '0 24px', height: 64, backgroundColor: navBg, color: navColor, borderBottom: '1px solid rgba(0,0,0,0.08)', position: 'relative', ...style }}>
      {/* Logo — left */}
      <Logo logoType={logoType} logoText={logoText} logoSrc={logoSrc} />

      {/* Links — absolute center of the bar */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}>
          {items.map((item) => <DesktopNavItem key={item.id} item={item} navColor={navColor} />)}
        </div>
      )}

      {/* CTA — right */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        {!isMobile && cta && <CtaButton cta={cta} />}
        {isMobile && (
          <>
            <HamburgerBtn open={mobileOpen} color={navColor} onClick={() => setMobileOpen((v) => !v)} />
            <MobileDrawer open={mobileOpen} onClose={closeMobile} items={items} cta={cta} showCta={showCtaMobile} logoType={logoType} logoText={logoText} logoSrc={logoSrc} menuStyle={mobileMenuStyle} panelBg={mobilePanelBg} textColor={mobileTextColor} />
          </>
        )}
      </div>
    </nav>
  )
}

// Layout 4 — Minimal: Logo left | contact info + hamburger right (always mobile-style nav)
function LayoutMinimal({
  items, cta, logoType, logoText, logoSrc, navBg, navColor, isMobile, mobileOpen, setMobileOpen,
  mobileMenuStyle, mobilePanelBg, mobileTextColor, showCtaMobile, style, contactInfo,
}: LayoutSharedProps & { contactInfo?: string }) {
  const closeMobile = useCallback(() => setMobileOpen(false), [setMobileOpen])
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64, backgroundColor: navBg, color: navColor, borderBottom: '1px solid rgba(0,0,0,0.08)', position: 'relative', ...style }}>
      <Logo logoType={logoType} logoText={logoText} logoSrc={logoSrc} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Contact info — hidden on small screens */}
        {contactInfo && !isMobile && (
          <a
            href={contactInfo.includes('@') ? `mailto:${contactInfo}` : contactInfo.startsWith('+') ? `tel:${contactInfo}` : '#'}
            style={{ fontSize: '0.8rem', color: 'inherit', textDecoration: 'none', opacity: 0.75, fontWeight: 500, whiteSpace: 'nowrap' }}
          >
            {contactInfo}
          </a>
        )}
        {/* Always show hamburger for minimal layout */}
        <HamburgerBtn open={mobileOpen} color={navColor} onClick={() => setMobileOpen((v) => !v)} />
      </div>

      <MobileDrawer open={mobileOpen} onClose={closeMobile} items={items} cta={cta} showCta={showCtaMobile} logoType={logoType} logoText={logoText} logoSrc={logoSrc} menuStyle={mobileMenuStyle} panelBg={mobilePanelBg} textColor={mobileTextColor} />
    </nav>
  )
}

// Layout 5 — Brand Hero: Large logo + tagline left half | stacked nav links right half
function LayoutBrandHero({
  items, cta, logoType, logoText, logoSrc, navBg, navColor, isMobile, mobileOpen, setMobileOpen,
  mobileMenuStyle, mobilePanelBg, mobileTextColor, showCtaMobile, style,
}: LayoutSharedProps) {
  const closeMobile = useCallback(() => setMobileOpen(false), [setMobileOpen])
  return (
    <nav style={{ display: 'flex', alignItems: 'stretch', backgroundColor: navBg, color: navColor, overflow: 'hidden', minHeight: 80, borderBottom: '1px solid rgba(0,0,0,0.08)', ...style }}>
      {/* Left: large logo + tagline */}
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', padding: '12px 28px', borderRight: `1px solid ${navColor}14`, minWidth: 180 }}>
        <Logo logoType={logoType} logoText={logoText} logoSrc={logoSrc} tagline="Your tagline here" large />
      </div>

      {/* Right: nav links stacked horizontally (wrapping on mobile) */}
      {!isMobile ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 28, padding: '0 28px', flexWrap: 'wrap' }}>
          {items.map((item) => <DesktopNavItem key={item.id} item={item} navColor={navColor} />)}
          {cta && <div style={{ marginLeft: 'auto' }}><CtaButton cta={cta} /></div>}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 16px' }}>
          <HamburgerBtn open={mobileOpen} color={navColor} onClick={() => setMobileOpen((v) => !v)} />
          <MobileDrawer open={mobileOpen} onClose={closeMobile} items={items} cta={cta} showCta={showCtaMobile} logoType={logoType} logoText={logoText} logoSrc={logoSrc} menuStyle={mobileMenuStyle} panelBg={mobilePanelBg} textColor={mobileTextColor} />
        </div>
      )}
    </nav>
  )
}

// ─── Shared props for layout components ──────────────────────────────────────

interface LayoutSharedProps {
  items: NavItem[]
  cta?: NavbarCta
  logoType: string
  logoText: string
  logoSrc?: string
  navBg: string
  navColor: string
  isMobile: boolean
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
  mobileMenuStyle: 'drawer-left' | 'drawer-right' | 'fullscreen'
  mobilePanelBg: string
  mobileTextColor: string
  showCtaMobile?: boolean
  style?: React.CSSProperties
}

// ─── Main NavbarElement ───────────────────────────────────────────────────────

const NavbarElement = memo(function NavbarElement({
  logoType = 'text',
  logoText = 'Brand',
  logoSrc,
  items = [
    { id: '1', label: 'Home', href: '#' },
    { id: '2', label: 'About', href: '#' },
    { id: '3', label: 'Contact', href: '#' },
  ],
  cta,
  layoutVariant = 'classic',
  desktopLayout = 'right',
  contactInfo = 'hello@company.com',
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
  const isPreview = previewState !== null
  // In builder canvas always show desktop layout so nav links are always visible.
  // In preview, use the real window matchMedia result.
  const effectiveIsMobile = isPreview ? _isMobile : false

  useEffect(() => {
    // Always run matchMedia so it's ready when isPreview becomes true.
    // effectiveIsMobile ignores this value in builder context.
    const mq = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [mobileBreakpoint])

  void uid // suppress unused warning when framework branches don't use it

  // ── Bootstrap navbar ───────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    const bsNavBg = style?.backgroundColor ?? '#ffffff'
    const bsNavColor = style?.color ?? '#111827'
    const isDarkBs = bsNavBg !== '#ffffff' && bsNavBg !== '#fff' && bsNavBg !== 'white'
    const bsScheme = isDarkBs ? 'navbar-dark' : 'navbar-light'
    const navBase: React.CSSProperties = { width: '100%', backgroundColor: bsNavBg, color: bsNavColor, borderBottom: '1px solid rgba(0,0,0,0.08)' }
    // Use px-4 wrapper instead of container-fluid to avoid Bootstrap's gutter padding on nav content
    if (layoutVariant === 'centered') {
      return (
        <nav className={`navbar ${bsScheme}`} style={navBase}>
          <div className="w-100 d-flex flex-column align-items-center px-4 pb-2 pt-2">
            <a className="navbar-brand fw-bold mb-1">{logoType === 'image' && logoSrc ? <img src={logoSrc} alt={logoText} height={32} /> : logoText}</a>
            <div className="d-flex gap-3 align-items-center">
              {items.map((item) => <a key={item.id} className="nav-link py-0" href={item.href} style={{ color: bsNavColor }}>{item.label}</a>)}
              {cta && <a href={cta.href} className="btn btn-primary btn-sm">{cta.text}</a>}
            </div>
          </div>
        </nav>
      )
    }
    if (layoutVariant === 'minimal') {
      return (
        <nav className={`navbar ${bsScheme}`} style={navBase}>
          <div className="w-100 d-flex align-items-center px-4" style={{ minHeight: 56 }}>
            <a className="navbar-brand fw-bold mb-0">{logoType === 'image' && logoSrc ? <img src={logoSrc} alt={logoText} height={32} /> : logoText}</a>
            <div className="d-flex align-items-center gap-2 ms-auto">
              {contactInfo && <small className="opacity-75" style={{ color: bsNavColor }}>{contactInfo}</small>}
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target={`#nb-${uid}`} style={{ borderColor: `${bsNavColor}40` }}><span className="navbar-toggler-icon" /></button>
            </div>
          </div>
          <div className="collapse navbar-collapse px-4" id={`nb-${uid}`}>
            <ul className="navbar-nav ms-auto">
              {items.map((item) => <li key={item.id} className="nav-item"><a className="nav-link" href={item.href} style={{ color: bsNavColor }}>{item.label}</a></li>)}
            </ul>
            {cta && <a href={cta.href} className="btn btn-primary ms-2 my-1">{cta.text}</a>}
          </div>
        </nav>
      )
    }
    // classic / split / brand-hero — standard Bootstrap expand-lg, no container gutter
    return (
      <nav className={`navbar navbar-expand-lg ${bsScheme}`} style={navBase}>
        <div className="w-100 d-flex align-items-center px-4" style={{ minHeight: 56 }}>
          <a className="navbar-brand fw-bold" href="#" style={{ color: bsNavColor }}>{logoType === 'image' && logoSrc ? <img src={logoSrc} alt={logoText} height={32} /> : logoText}</a>
          <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target={`#nb-${uid}`} style={{ borderColor: `${bsNavColor}40` }}>
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id={`nb-${uid}`}>
            <ul className={`navbar-nav ${layoutVariant === 'split' ? 'mx-auto' : 'me-auto'} mb-2 mb-lg-0`}>
              {items.map((item) => (
                <li key={item.id} className="nav-item">
                  <a className="nav-link" href={item.href} style={{ color: bsNavColor }}>{item.label}</a>
                </li>
              ))}
            </ul>
            {cta && <a href={cta.href} className={`btn btn-${cta.variant === 'outline' ? 'outline-primary' : 'primary'} ms-2`}>{cta.text}</a>}
          </div>
        </div>
      </nav>
    )
  }

  // ── MUI AppBar ─────────────────────────────────────────────────────────────
  if (framework === 'mui') {
    const muiBg = style?.backgroundColor ?? 'var(--color-primary)'
    const muiColor = style?.color ?? '#fff'
    if (layoutVariant === 'centered') {
      return (
        <header className="mui-root MuiAppBar-root" style={{ backgroundColor: muiBg, color: muiColor }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 16px 6px', width: '100%' }}>
            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: muiColor, marginBottom: 6 }}>
              {logoType === 'image' && logoSrc ? <img src={logoSrc} alt={logoText} height={32} style={{ verticalAlign: 'middle' }} /> : logoText}
            </span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              {items.map((item) => (
                <a key={item.id} href={item.href} className="MuiButton-root MuiButton-text" style={{ color: muiColor }}>{item.label}</a>
              ))}
              {cta && <a href={cta.href} className="MuiButton-root MuiButton-outlined" style={{ color: muiColor, borderColor: `${muiColor}80` }}>{cta.text}</a>}
            </div>
          </div>
        </header>
      )
    }
    if (layoutVariant === 'minimal') {
      return (
        <header className="mui-root MuiAppBar-root" style={{ backgroundColor: muiBg, color: muiColor }}>
          <div className="MuiToolbar-root" style={{ gap: 16 }}>
            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: muiColor }}>
              {logoType === 'image' && logoSrc ? <img src={logoSrc} alt={logoText} height={32} style={{ verticalAlign: 'middle' }} /> : logoText}
            </span>
            {contactInfo && <span style={{ fontSize: '0.8rem', opacity: 0.75, color: muiColor }}>{contactInfo}</span>}
            <div style={{ marginLeft: 'auto' }}>
              {cta && <a href={cta.href} className="MuiButton-root MuiButton-outlined" style={{ color: muiColor, borderColor: `${muiColor}80` }}>{cta.text}</a>}
            </div>
          </div>
        </header>
      )
    }
    return (
      <header className="mui-root MuiAppBar-root" style={{ backgroundColor: muiBg, color: muiColor }}>
        <div className="MuiToolbar-root" style={{ gap: 16 }}>
          <span style={{ fontWeight: 700, fontSize: '1.25rem', color: muiColor, flexShrink: 0 }}>
            {logoType === 'image' && logoSrc ? <img src={logoSrc} alt={logoText} height={32} style={{ verticalAlign: 'middle' }} /> : logoText}
          </span>
          <div style={{ display: 'flex', gap: 8, flex: layoutVariant === 'split' ? 'none' : 1, margin: layoutVariant === 'split' ? '0 auto' : undefined }}>
            {items.map((item) => (
              <a key={item.id} href={item.href} className="MuiButton-root MuiButton-text" style={{ color: muiColor }}>{item.label}</a>
            ))}
          </div>
          {cta && <a href={cta.href} className="MuiButton-root MuiButton-outlined" style={{ color: muiColor, borderColor: `${muiColor}80`, marginLeft: layoutVariant === 'split' ? 0 : 'auto' }}>{cta.text}</a>}
        </div>
      </header>
    )
  }

  // ── Tailwind navbar ────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    const twBg = style?.backgroundColor ?? '#ffffff'
    const twColor = style?.color ?? '#111827'
    if (layoutVariant === 'centered') {
      return (
        <nav className="w-full border-b border-gray-200" style={{ backgroundColor: twBg, color: twColor, ...style }}>
          <div className="flex justify-center px-6 pt-3 pb-0">
            <a href="#" className="font-bold text-lg" style={{ color: 'inherit' }}>{logoType === 'image' && logoSrc ? <img src={logoSrc} alt={logoText} className="h-8 w-auto" /> : logoText}</a>
          </div>
          <div className="flex items-center justify-center gap-6 px-6 py-2 border-t border-gray-100 mt-2">
            {items.map((item) => <a key={item.id} href={item.href} className="text-sm font-medium" style={{ color: 'inherit' }}>{item.label}</a>)}
            {cta && <a href={cta.href} className="inline-block px-4 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-semibold">{cta.text}</a>}
          </div>
        </nav>
      )
    }
    return (
      <nav className="w-full flex items-center justify-between px-6 py-3 border-b border-gray-200 relative" style={{ backgroundColor: twBg, color: twColor, minHeight: layoutVariant === 'brand-hero' ? 72 : 56, ...style }}>
        <a href="#" className="font-bold text-lg shrink-0" style={{ color: 'inherit', textDecoration: 'none' }}>
          {logoType === 'image' && logoSrc ? <img src={logoSrc} alt={logoText} className="h-8 w-auto" /> : logoText}
        </a>
        {layoutVariant !== 'minimal' && (
          <div className={`flex items-center gap-6 ${layoutVariant === 'split' ? 'absolute left-1/2 -translate-x-1/2' : ''}`}>
            {items.map((item) => <a key={item.id} href={item.href} className="text-sm font-medium" style={{ color: 'inherit', textDecoration: 'none' }}>{item.label}</a>)}
          </div>
        )}
        <div className="flex items-center gap-3 ml-auto">
          {layoutVariant === 'minimal' && contactInfo && <span className="text-xs opacity-75">{contactInfo}</span>}
          {cta && <a href={cta.href} className="inline-block px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold">{cta.text}</a>}
        </div>
      </nav>
    )
  }

  const navBg = (style?.backgroundColor as string | undefined) ?? '#ffffff'
  const navColor = (style?.color as string | undefined) ?? '#111827'

  const sharedProps: LayoutSharedProps = {
    items,
    cta,
    logoType,
    logoText,
    logoSrc,
    navBg,
    navColor,
    isMobile: effectiveIsMobile,
    mobileOpen,
    setMobileOpen,
    mobileMenuStyle,
    mobilePanelBg,
    mobileTextColor,
    showCtaMobile,
    style,
  }

  if (layoutVariant === 'centered') return <LayoutCentered {...sharedProps} />
  if (layoutVariant === 'split') return <LayoutSplit {...sharedProps} />
  if (layoutVariant === 'minimal') return <LayoutMinimal {...sharedProps} contactInfo={contactInfo} />
  if (layoutVariant === 'brand-hero') return <LayoutBrandHero {...sharedProps} />
  return <LayoutClassic {...sharedProps} desktopLayout={desktopLayout} />
})

export default NavbarElement
