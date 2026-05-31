'use client'

import { memo, useState, useCallback, useEffect } from 'react'
import type { ButtonVariant } from '@/types/builder.types'

interface MenuLink {
  id: string
  label: string
  href: string
  target?: '_blank' | '_self'
}

interface Props {
  menuStyle?: 'left-drawer' | 'right-drawer' | 'fullscreen'
  animation?: 'slide' | 'fade'
  iconStyle?: '3lines' | '3lines-x' | 'dots'
  logoType?: 'text' | 'image'
  logoText?: string
  logoSrc?: string
  logoAlign?: 'left' | 'center' | 'right'
  links?: MenuLink[]
  cta?: { text: string; href: string; variant: ButtonVariant }
  overlayColor?: string
  panelBg?: string
  textColor?: string
  closeOnOverlay?: boolean
  drawerWidth?: number
  style?: React.CSSProperties
}

// ── Hamburger icon ────────────────────────────────────────────────────────────

function HamburgerIcon({
  open,
  iconStyle,
  color,
}: {
  open: boolean
  iconStyle: '3lines' | '3lines-x' | 'dots'
  color: string
}) {
  if (iconStyle === 'dots') {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill={color}>
        <circle cx="11" cy="5" r="2" />
        <circle cx="11" cy="11" r="2" />
        <circle cx="11" cy="17" r="2" />
      </svg>
    )
  }

  if (iconStyle === '3lines-x' && open) {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M4 4l14 14M18 4L4 18" />
      </svg>
    )
  }

  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M3 6h16M3 11h16M3 16h16" />
    </svg>
  )
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function PanelLogo({
  logoType,
  logoText,
  logoSrc,
  logoAlign,
  textColor,
}: {
  logoType: 'text' | 'image'
  logoText?: string
  logoSrc?: string
  logoAlign: 'left' | 'center' | 'right'
  textColor: string
}) {
  const alignMap = { left: 'flex-start', center: 'center', right: 'flex-end' }
  return (
    <div style={{ display: 'flex', justifyContent: alignMap[logoAlign] }}>
      {logoType === 'image' && logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt="logo" style={{ maxHeight: 40, maxWidth: 160, objectFit: 'contain' }} />
      ) : (
        <span style={{ fontSize: '1.125rem', fontWeight: 700, color: textColor, letterSpacing: '-0.02em' }}>
          {logoText || 'Brand'}
        </span>
      )}
    </div>
  )
}

// ── CTA button styles ─────────────────────────────────────────────────────────

function ctaStyle(variant: ButtonVariant): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-block',
    padding: '10px 24px',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: '0.9rem',
    textDecoration: 'none',
    cursor: 'pointer',
    border: '1.5px solid transparent',
    transition: 'opacity 150ms',
    textAlign: 'center',
  }
  switch (variant) {
    case 'primary':   return { ...base, backgroundColor: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)' }
    case 'secondary': return { ...base, backgroundColor: 'var(--color-text-secondary)', color: '#fff', borderColor: 'var(--color-text-secondary)' }
    case 'outline':   return { ...base, backgroundColor: 'transparent', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }
    case 'ghost':     return { ...base, backgroundColor: 'transparent', color: 'inherit', borderColor: 'transparent' }
  }
}

// ── Main component ────────────────────────────────────────────────────────────

function HamburgerMenuElement({
  menuStyle = 'left-drawer',
  animation = 'slide',
  iconStyle = '3lines',
  logoType = 'text',
  logoText = 'My Brand',
  logoSrc,
  logoAlign = 'left',
  links = [],
  cta,
  overlayColor = 'rgba(0,0,0,0.5)',
  panelBg = '#ffffff',
  textColor = '#111827',
  closeOnOverlay = true,
  drawerWidth,
  style,
}: Props) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((o) => !o), [])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isFullscreen = menuStyle === 'fullscreen'
  const isRight = menuStyle === 'right-drawer'

  function panelCss(): React.CSSProperties {
    const base: React.CSSProperties = {
      position: 'fixed',
      backgroundColor: panelBg,
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      padding: '28px 32px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      transition: animation === 'slide'
        ? 'transform 320ms cubic-bezier(0.4, 0, 0.2, 1)'
        : 'opacity 260ms ease',
      overflowY: 'auto',
    }

    if (isFullscreen) {
      return {
        ...base,
        inset: 0,
        opacity: animation === 'fade' ? (open ? 1 : 0) : undefined,
        transform: animation === 'slide'
          ? (open ? 'translateY(0)' : 'translateY(-100%)')
          : undefined,
        pointerEvents: open ? 'auto' : 'none',
      }
    }

    const drawerW = drawerWidth ? `min(${drawerWidth}px, 95vw)` : 'min(360px, 85vw)'

    if (isRight) {
      return {
        ...base,
        top: 0,
        right: 0,
        bottom: 0,
        width: drawerW,
        borderRadius: '12px 0 0 12px',
        opacity: animation === 'fade' ? (open ? 1 : 0) : undefined,
        transform: animation === 'slide'
          ? (open ? 'translateX(0)' : 'translateX(100%)')
          : undefined,
        pointerEvents: open ? 'auto' : 'none',
      }
    }

    return {
      ...base,
      top: 0,
      left: 0,
      bottom: 0,
      width: drawerW,
      borderRadius: '0 12px 12px 0',
      opacity: animation === 'fade' ? (open ? 1 : 0) : undefined,
      transform: animation === 'slide'
        ? (open ? 'translateX(0)' : 'translateX(-100%)')
        : undefined,
      pointerEvents: open ? 'auto' : 'none',
    }
  }

  const logoNode = (
    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
      {logoType === 'image' && logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt="logo" style={{ maxHeight: 36, maxWidth: 140, objectFit: 'contain', display: 'block' }} />
      ) : (
        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor, whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>
          {logoText || 'Brand'}
        </span>
      )}
    </div>
  )

  const triggerBtn = (
    <button
      onClick={toggle}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        borderRadius: 8,
        padding: 0,
        transition: 'background-color 150ms',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.06)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent')}
    >
      <HamburgerIcon open={open} iconStyle={iconStyle} color={textColor} />
    </button>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit', ...style }}>
      {/* Logo on left, hamburger on right — unless logoAlign is 'right', then swap */}
      {logoAlign === 'right' ? (
        <>
          {triggerBtn}
          {logoNode}
        </>
      ) : (
        <>
          {logoNode}
          {triggerBtn}
        </>
      )}

      {/* Overlay backdrop */}
      {open && (
        <div
          onClick={closeOnOverlay ? close : undefined}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: overlayColor,
            zIndex: 1000,
            transition: 'opacity 260ms ease',
          }}
        />
      )}

      {/* Menu panel */}
      <div style={panelCss()} role="dialog" aria-modal="true" aria-label="Navigation menu">
        {/* Panel header: logo + close button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <PanelLogo
              logoType={logoType}
              logoText={logoText}
              logoSrc={logoSrc}
              logoAlign={logoAlign}
              textColor={textColor}
            />
          </div>
          <button
            onClick={close}
            aria-label="Close menu"
            style={{
              flexShrink: 0,
              width: 36,
              height: 36,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: textColor,
              opacity: 0.6,
              transition: 'opacity 150ms',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.6')}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 3l12 12M15 3L3 15" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1 }}>
          {links.length === 0 && (
            <p style={{ color: textColor, opacity: 0.4, fontSize: '0.875rem' }}>No links added yet.</p>
          )}
          {links.map((link, idx) => (
            <a
              key={link.id}
              href={link.href}
              target={link.target}
              rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
              onClick={close}
              style={{
                display: 'block',
                padding: '12px 0',
                borderBottom: idx < links.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none',
                color: textColor,
                textDecoration: 'none',
                fontSize: isFullscreen ? '1.5rem' : '1rem',
                fontWeight: isFullscreen ? 700 : 500,
                letterSpacing: isFullscreen ? '-0.02em' : 'normal',
                transition: 'opacity 150ms',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.6')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA button */}
        {cta && (
          <div style={{ marginTop: 32 }}>
            <a
              href={cta.href}
              onClick={close}
              style={{ ...ctaStyle(cta.variant), width: '100%', boxSizing: 'border-box' }}
            >
              {cta.text}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(HamburgerMenuElement)
