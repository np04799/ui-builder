'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useThemeStore } from '@/store/theme.store'

const NAV_LINKS = [
  { label: 'About Us', href: '#about' },
  { label: 'Templates', href: '#templates' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

// ── Icons ──────────────────────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M11.89 4.11l1.06-1.06M3.05 12.95l1.06-1.06" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 10A6 6 0 0 1 6 2.5a6 6 0 1 0 7.5 7.5z" />
    </svg>
  )
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {open ? (
        <>
          <path d="M4 4l12 12M16 4L4 16" />
        </>
      ) : (
        <>
          <path d="M3 5h14M3 10h14M3 15h14" />
        </>
      )}
    </svg>
  )
}

// ── Theme Toggle (sun / pill-toggle / moon) ────────────────────────────────────

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 8px',
        borderRadius: 999,
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      {/* Sun */}
      <span style={{ color: !isDark ? 'var(--color-primary)' : 'var(--color-text-secondary)', display: 'flex' }}>
        <SunIcon />
      </span>

      {/* Pill toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        style={{
          position: 'relative',
          width: 38,
          height: 22,
          borderRadius: 999,
          border: 'none',
          backgroundColor: 'var(--color-primary)',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: isDark ? 19 : 3,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: '#fff',
            transition: 'left 0.18s ease',
          }}
        />
      </button>

      {/* Moon */}
      <span style={{ color: isDark ? 'var(--color-primary)' : 'var(--color-text-secondary)', display: 'flex' }}>
        <MoonIcon />
      </span>
    </div>
  )
}

// ── Mobile Drawer ──────────────────────────────────────────────────────────────

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 49,
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      />
      {/* Drawer */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          width: 260,
          backgroundColor: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 24px 32px',
          gap: 4,
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onClose}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9375rem',
            }}
          >
            {link.label}
          </a>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 24 }}>
          <ThemeToggle />
        </div>
      </nav>
    </>
  )
}

// ── Header ─────────────────────────────────────────────────────────────────────

export default function MarketingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          width: '100%',
          height: 72,
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 0,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
            <Image
              src="/logo.svg"
              alt="UI Builder"
              width={180}
              height={50}
              priority
              style={{ height: 50, width: 'auto', display: 'block' }}
            />
          </Link>

          {/* Nav links — desktop */}
          <nav
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
            className="hide-on-mobile"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  padding: '6px 16px',
                  borderRadius: 8,
                  color: 'var(--color-text-primary)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.9375rem',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.12s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: theme toggle + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Theme toggle — desktop */}
            <div className="hide-on-mobile">
              <ThemeToggle />
            </div>

            {/* Hamburger — mobile */}
            <button
              className="show-on-mobile"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-primary)',
                padding: 0,
              }}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
