'use client'

import { useFramework } from '@/hooks/useFramework'
import type { NavItem } from '@/types/builder.types'

interface ColumnLink { heading: string; items: NavItem[] }
interface Brand { name: string; tagline?: string; logoSrc?: string }

interface Props {
  links?: NavItem[]
  copyright?: string
  socials?: NavItem[]
  layoutVariant?: 'simple' | 'columns' | 'minimal' | 'centered-brand' | 'mega'
  brand?: Brand
  columnLinks?: ColumnLink[]
  style?: React.CSSProperties
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_LINKS: NavItem[] = [
  { id: '1', label: 'Privacy', href: '#' },
  { id: '2', label: 'Terms', href: '#' },
  { id: '3', label: 'Contact', href: '#' },
]

const DEFAULT_COLUMNS: ColumnLink[] = [
  { heading: 'Product', items: [{ id: 'p1', label: 'Features', href: '#' }, { id: 'p2', label: 'Pricing', href: '#' }, { id: 'p3', label: 'Changelog', href: '#' }] },
  { heading: 'Company', items: [{ id: 'c1', label: 'About', href: '#' }, { id: 'c2', label: 'Blog', href: '#' }, { id: 'c3', label: 'Careers', href: '#' }] },
  { heading: 'Support', items: [{ id: 's1', label: 'Help Center', href: '#' }, { id: 's2', label: 'Contact', href: '#' }, { id: 's3', label: 'Status', href: '#' }] },
]

const DEFAULT_BRAND: Brand = { name: 'YourBrand', tagline: 'Building better products.' }

const DEFAULT_COPYRIGHT = `© ${new Date().getFullYear()} Your Company. All rights reserved.`

const SOCIAL_LABELS = ['Twitter', 'GitHub', 'LinkedIn']

// ─── Social icons (SVG inline) ────────────────────────────────────────────────

function SocialIcon({ label, color = '#9ca3af' }: { label: string; color?: string }) {
  if (label === 'Twitter' || label === 'X') {
    return (
      <a href="#" aria-label="Twitter" style={{ color, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
    )
  }
  if (label === 'GitHub') {
    return (
      <a href="#" aria-label="GitHub" style={{ color, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
      </a>
    )
  }
  // LinkedIn default
  return (
    <a href="#" aria-label="LinkedIn" style={{ color, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    </a>
  )
}

// ─── CUSTOM variants ──────────────────────────────────────────────────────────

function CustomSimple({ links, copyright, style }: Props) {
  const l = links?.length ? links : DEFAULT_LINKS
  return (
    <footer style={{ width: '100%', backgroundColor: '#1f2937', padding: '24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, ...style }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {l.map((link) => <a key={link.id} href={link.href} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 150ms' }}>{link.label}</a>)}
      </div>
      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{copyright ?? DEFAULT_COPYRIGHT}</p>
    </footer>
  )
}

function CustomColumns({ columnLinks, brand, copyright, socials, style }: Props) {
  const cols = columnLinks?.length ? columnLinks : DEFAULT_COLUMNS
  const b = brand ?? DEFAULT_BRAND
  const sl = socials?.length ? socials : SOCIAL_LABELS.map((label, i) => ({ id: String(i), label, href: '#' }))
  return (
    <footer style={{ width: '100%', backgroundColor: '#111827', padding: '48px 40px 28px', ...style }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', marginBottom: 40 }}>
          {/* Brand col */}
          <div style={{ minWidth: 180 }}>
            {b.logoSrc ? <img src={b.logoSrc} alt={b.name} style={{ height: 32, marginBottom: 10 }} /> : <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f9fafb' }}>{b.name}</span>}
            {b.tagline && <p style={{ margin: '8px 0 16px', fontSize: '0.8125rem', color: '#9ca3af', lineHeight: 1.5 }}>{b.tagline}</p>}
            <div style={{ display: 'flex', gap: 12 }}>
              {sl.map((s) => <SocialIcon key={s.id} label={s.label} />)}
            </div>
          </div>
          {/* Link columns */}
          {cols.map((col, i) => (
            <div key={i} style={{ minWidth: 130 }}>
              <h4 style={{ margin: '0 0 14px', fontSize: '0.75rem', fontWeight: 700, color: '#f9fafb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col.heading}</h4>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map((item) => <li key={item.id}><a href={item.href} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>{item.label}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #374151', paddingTop: 20, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{copyright ?? DEFAULT_COPYRIGHT}</p>
        </div>
      </div>
    </footer>
  )
}

function CustomMinimal({ copyright, style }: Props) {
  return (
    <footer style={{ width: '100%', backgroundColor: '#0f172a', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#475569' }}>{copyright ?? DEFAULT_COPYRIGHT}</p>
    </footer>
  )
}

function CustomCenteredBrand({ brand, links, copyright, socials, style }: Props) {
  const b = brand ?? DEFAULT_BRAND
  const l = links?.length ? links : DEFAULT_LINKS
  const sl = socials?.length ? socials : SOCIAL_LABELS.map((label, i) => ({ id: String(i), label, href: '#' }))
  return (
    <footer style={{ width: '100%', backgroundColor: '#1e293b', padding: '48px 32px 28px', textAlign: 'center', ...style }}>
      {b.logoSrc
        ? <img src={b.logoSrc} alt={b.name} style={{ height: 36, marginBottom: 10 }} />
        : <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>{b.name}</div>
      }
      {b.tagline && <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>{b.tagline}</p>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
        {l.map((link) => <a key={link.id} href={link.href} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>{link.label}</a>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 24 }}>
        {sl.map((s) => <SocialIcon key={s.id} label={s.label} color="#94a3b8" />)}
      </div>
      <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569' }}>{copyright ?? DEFAULT_COPYRIGHT}</p>
    </footer>
  )
}

function CustomMega({ columnLinks, brand, copyright, links, socials, style }: Props) {
  const cols = columnLinks?.length ? columnLinks : DEFAULT_COLUMNS
  const b = brand ?? DEFAULT_BRAND
  const l = links?.length ? links : DEFAULT_LINKS
  const sl = socials?.length ? socials : SOCIAL_LABELS.map((label, i) => ({ id: String(i), label, href: '#' }))
  return (
    <footer style={{ width: '100%', backgroundColor: '#030712', ...style }}>
      <div style={{ padding: '56px 40px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            {b.logoSrc ? <img src={b.logoSrc} alt={b.name} style={{ height: 32, marginBottom: 12 }} /> : <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f9fafb', display: 'block', marginBottom: 8 }}>{b.name}</span>}
            {b.tagline && <p style={{ margin: '0 0 16px', fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>{b.tagline}</p>}
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <h4 style={{ margin: '0 0 14px', fontSize: '0.72rem', fontWeight: 700, color: '#e5e7eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{col.heading}</h4>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map((item) => <li key={item.id}><a href={item.href} style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>{item.label}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #1f2937', padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#4b5563' }}>{copyright ?? DEFAULT_COPYRIGHT}</p>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {l.map((link) => <a key={link.id} href={link.href} style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.75rem' }}>{link.label}</a>)}
          <div style={{ display: 'flex', gap: 10 }}>
            {sl.map((s) => <SocialIcon key={s.id} label={s.label} color="#4b5563" />)}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── BOOTSTRAP variants ───────────────────────────────────────────────────────

function BsSimple({ links, copyright, style }: Props) {
  const l = links?.length ? links : DEFAULT_LINKS
  return (
    <footer className="footer py-4" style={{ backgroundColor: '#212529', ...style }}>
      <div className="d-flex flex-column align-items-center gap-3">
        <ul className="nav justify-content-center">
          {l.map((link) => <li key={link.id} className="nav-item"><a href={link.href} className="nav-link px-3 text-secondary">{link.label}</a></li>)}
        </ul>
        <small className="text-secondary">{copyright ?? DEFAULT_COPYRIGHT}</small>
      </div>
    </footer>
  )
}

function BsColumns({ columnLinks, brand, copyright, socials, style }: Props) {
  const cols = columnLinks?.length ? columnLinks : DEFAULT_COLUMNS
  const b = brand ?? DEFAULT_BRAND
  const sl = socials?.length ? socials : SOCIAL_LABELS.map((label, i) => ({ id: String(i), label, href: '#' }))
  return (
    <footer style={{ backgroundColor: '#212529', ...style }}>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            {b.logoSrc ? <img src={b.logoSrc} alt={b.name} height="32" className="mb-2" /> : <h5 className="text-white fw-bold">{b.name}</h5>}
            {b.tagline && <p className="text-secondary small">{b.tagline}</p>}
            <div className="d-flex gap-3 mt-2">
              {sl.map((s) => <SocialIcon key={s.id} label={s.label} />)}
            </div>
          </div>
          {cols.map((col, i) => (
            <div key={i} className="col-6 col-md">
              <h6 className="text-uppercase fw-bold text-white-50 mb-3" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>{col.heading}</h6>
              <ul className="list-unstyled">
                {col.items.map((item) => <li key={item.id} className="mb-2"><a href={item.href} className="text-secondary text-decoration-none small">{item.label}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <hr className="border-secondary" />
        <p className="text-center text-secondary small mb-0">{copyright ?? DEFAULT_COPYRIGHT}</p>
      </div>
    </footer>
  )
}

function BsMinimal({ copyright, style }: Props) {
  return (
    <footer className="py-3" style={{ backgroundColor: '#0d1117', ...style }}>
      <p className="text-center mb-0 small" style={{ color: '#495057' }}>{copyright ?? DEFAULT_COPYRIGHT}</p>
    </footer>
  )
}

function BsCenteredBrand({ brand, links, copyright, socials, style }: Props) {
  const b = brand ?? DEFAULT_BRAND
  const l = links?.length ? links : DEFAULT_LINKS
  const sl = socials?.length ? socials : SOCIAL_LABELS.map((label, i) => ({ id: String(i), label, href: '#' }))
  return (
    <footer className="py-5 text-center" style={{ backgroundColor: '#1e293b', ...style }}>
      {b.logoSrc ? <img src={b.logoSrc} alt={b.name} height="36" className="mb-2" /> : <h5 className="fw-bold text-white mb-1">{b.name}</h5>}
      {b.tagline && <p className="text-secondary small mb-3">{b.tagline}</p>}
      <ul className="nav justify-content-center mb-3">
        {l.map((link) => <li key={link.id} className="nav-item"><a href={link.href} className="nav-link px-2 text-secondary small">{link.label}</a></li>)}
      </ul>
      <div className="d-flex justify-content-center gap-3 mb-3">
        {sl.map((s) => <SocialIcon key={s.id} label={s.label} color="#6c757d" />)}
      </div>
      <small className="text-secondary">{copyright ?? DEFAULT_COPYRIGHT}</small>
    </footer>
  )
}

function BsMega({ columnLinks, brand, copyright, links, socials, style }: Props) {
  const cols = columnLinks?.length ? columnLinks : DEFAULT_COLUMNS
  const b = brand ?? DEFAULT_BRAND
  const l = links?.length ? links : DEFAULT_LINKS
  const sl = socials?.length ? socials : SOCIAL_LABELS.map((label, i) => ({ id: String(i), label, href: '#' }))
  return (
    <footer style={{ backgroundColor: '#030712', ...style }}>
      <div className="container py-5">
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            {b.logoSrc ? <img src={b.logoSrc} alt={b.name} height="30" className="mb-2" /> : <h5 className="fw-bold text-white mb-1">{b.name}</h5>}
            {b.tagline && <p className="small mb-0" style={{ color: '#6b7280' }}>{b.tagline}</p>}
          </div>
          {cols.map((col, i) => (
            <div key={i} className="col-6 col-md">
              <h6 className="text-uppercase fw-bold mb-3" style={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: '#e5e7eb' }}>{col.heading}</h6>
              <ul className="list-unstyled">
                {col.items.map((item) => <li key={item.id} className="mb-2"><a href={item.href} className="text-decoration-none small" style={{ color: '#6b7280' }}>{item.label}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 border-top pt-3" style={{ borderColor: '#1f2937 !important' }}>
          <small style={{ color: '#4b5563' }}>{copyright ?? DEFAULT_COPYRIGHT}</small>
          <div className="d-flex align-items-center gap-3">
            {l.map((link) => <a key={link.id} href={link.href} className="text-decoration-none small" style={{ color: '#4b5563' }}>{link.label}</a>)}
            {sl.map((s) => <SocialIcon key={s.id} label={s.label} color="#4b5563" />)}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── MUI variants ─────────────────────────────────────────────────────────────

function MuiSimple({ links, copyright, style }: Props) {
  const l = links?.length ? links : DEFAULT_LINKS
  return (
    <footer className="mui-root" style={{ backgroundColor: '#212121', padding: '24px 32px', width: '100%', ...style }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', gap: 20 }}>
          {l.map((link) => <a key={link.id} href={link.href} className="MuiTypography-root MuiLink-root" style={{ color: '#9e9e9e', textDecoration: 'none', fontSize: '0.875rem' }}>{link.label}</a>)}
        </div>
        <p className="MuiTypography-root MuiTypography-caption" style={{ margin: 0, color: '#616161' }}>{copyright ?? DEFAULT_COPYRIGHT}</p>
      </div>
    </footer>
  )
}

function MuiColumns({ columnLinks, brand, copyright, socials, style }: Props) {
  const cols = columnLinks?.length ? columnLinks : DEFAULT_COLUMNS
  const b = brand ?? DEFAULT_BRAND
  const sl = socials?.length ? socials : SOCIAL_LABELS.map((label, i) => ({ id: String(i), label, href: '#' }))
  return (
    <footer className="mui-root" style={{ backgroundColor: '#212121', padding: '48px 40px 28px', width: '100%', ...style }}>
      <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', marginBottom: 40 }}>
        <div style={{ minWidth: 180 }}>
          {b.logoSrc ? <img src={b.logoSrc} alt={b.name} style={{ height: 32, marginBottom: 10 }} /> : <span className="MuiTypography-root MuiTypography-h6" style={{ color: '#fff', display: 'block', marginBottom: 8 }}>{b.name}</span>}
          {b.tagline && <p className="MuiTypography-root MuiTypography-body2" style={{ color: '#9e9e9e', marginBottom: 16 }}>{b.tagline}</p>}
          <div style={{ display: 'flex', gap: 12 }}>
            {sl.map((s) => <SocialIcon key={s.id} label={s.label} />)}
          </div>
        </div>
        {cols.map((col, i) => (
          <div key={i} style={{ minWidth: 130 }}>
            <p className="MuiTypography-root MuiTypography-overline" style={{ color: '#bdbdbd', marginBottom: 14 }}>{col.heading}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.items.map((item) => <li key={item.id}><a href={item.href} className="MuiTypography-root MuiLink-root" style={{ color: '#9e9e9e', textDecoration: 'none', fontSize: '0.875rem' }}>{item.label}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #424242', paddingTop: 20 }}>
        <p className="MuiTypography-root MuiTypography-caption" style={{ margin: 0, color: '#616161', textAlign: 'center' }}>{copyright ?? DEFAULT_COPYRIGHT}</p>
      </div>
    </footer>
  )
}

function MuiMinimal({ copyright, style }: Props) {
  return (
    <footer className="mui-root" style={{ backgroundColor: '#0a0a0a', padding: '16px 32px', width: '100%', ...style }}>
      <p className="MuiTypography-root MuiTypography-caption" style={{ margin: 0, textAlign: 'center', color: '#424242' }}>{copyright ?? DEFAULT_COPYRIGHT}</p>
    </footer>
  )
}

function MuiCenteredBrand({ brand, links, copyright, socials, style }: Props) {
  const b = brand ?? DEFAULT_BRAND
  const l = links?.length ? links : DEFAULT_LINKS
  const sl = socials?.length ? socials : SOCIAL_LABELS.map((label, i) => ({ id: String(i), label, href: '#' }))
  return (
    <footer className="mui-root" style={{ backgroundColor: '#1a1a2e', padding: '48px 32px 28px', width: '100%', textAlign: 'center', ...style }}>
      {b.logoSrc ? <img src={b.logoSrc} alt={b.name} style={{ height: 36, marginBottom: 10 }} /> : <span className="MuiTypography-root MuiTypography-h6" style={{ color: '#fff', display: 'block', marginBottom: 6 }}>{b.name}</span>}
      {b.tagline && <p className="MuiTypography-root MuiTypography-body2" style={{ color: '#9e9e9e', marginBottom: 20 }}>{b.tagline}</p>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 18 }}>
        {l.map((link) => <a key={link.id} href={link.href} className="MuiTypography-root MuiLink-root" style={{ color: '#9e9e9e', textDecoration: 'none', fontSize: '0.875rem' }}>{link.label}</a>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 20 }}>
        {sl.map((s) => <SocialIcon key={s.id} label={s.label} color="#9e9e9e" />)}
      </div>
      <p className="MuiTypography-root MuiTypography-caption" style={{ margin: 0, color: '#616161' }}>{copyright ?? DEFAULT_COPYRIGHT}</p>
    </footer>
  )
}

function MuiMega({ columnLinks, brand, copyright, links, socials, style }: Props) {
  const cols = columnLinks?.length ? columnLinks : DEFAULT_COLUMNS
  const b = brand ?? DEFAULT_BRAND
  const l = links?.length ? links : DEFAULT_LINKS
  const sl = socials?.length ? socials : SOCIAL_LABELS.map((label, i) => ({ id: String(i), label, href: '#' }))
  return (
    <footer className="mui-root" style={{ backgroundColor: '#0a0a0a', width: '100%', ...style }}>
      <div style={{ padding: '56px 40px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 40, marginBottom: 48 }}>
          <div>
            {b.logoSrc ? <img src={b.logoSrc} alt={b.name} style={{ height: 30, marginBottom: 10 }} /> : <span className="MuiTypography-root MuiTypography-h6" style={{ color: '#fff', display: 'block', marginBottom: 6 }}>{b.name}</span>}
            {b.tagline && <p className="MuiTypography-root MuiTypography-body2" style={{ color: '#616161', marginBottom: 0 }}>{b.tagline}</p>}
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <p className="MuiTypography-root MuiTypography-overline" style={{ color: '#e0e0e0', marginBottom: 14 }}>{col.heading}</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map((item) => <li key={item.id}><a href={item.href} style={{ color: '#616161', textDecoration: 'none', fontSize: '0.875rem' }}>{item.label}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid #1f1f1f', padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p className="MuiTypography-root MuiTypography-caption" style={{ margin: 0, color: '#424242' }}>{copyright ?? DEFAULT_COPYRIGHT}</p>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {l.map((link) => <a key={link.id} href={link.href} style={{ color: '#424242', textDecoration: 'none', fontSize: '0.75rem' }}>{link.label}</a>)}
          {sl.map((s) => <SocialIcon key={s.id} label={s.label} color="#424242" />)}
        </div>
      </div>
    </footer>
  )
}

// ─── TAILWIND variants ────────────────────────────────────────────────────────

function TwSimple({ links, copyright, style }: Props) {
  const l = links?.length ? links : DEFAULT_LINKS
  return (
    <footer className="w-full bg-gray-900 py-6 px-8" style={style}>
      <div className="flex flex-col items-center gap-4">
        <nav className="flex gap-6 flex-wrap justify-center">
          {l.map((link) => <a key={link.id} href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</a>)}
        </nav>
        <p className="text-xs text-gray-500 m-0">{copyright ?? DEFAULT_COPYRIGHT}</p>
      </div>
    </footer>
  )
}

function TwColumns({ columnLinks, brand, copyright, socials, style }: Props) {
  const cols = columnLinks?.length ? columnLinks : DEFAULT_COLUMNS
  const b = brand ?? DEFAULT_BRAND
  const sl = socials?.length ? socials : SOCIAL_LABELS.map((label, i) => ({ id: String(i), label, href: '#' }))
  return (
    <footer className="w-full bg-gray-900" style={style}>
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex gap-12 flex-wrap mb-10">
          <div className="min-w-[180px]">
            {b.logoSrc ? <img src={b.logoSrc} alt={b.name} className="h-8 mb-2" /> : <span className="text-lg font-extrabold text-white block mb-2">{b.name}</span>}
            {b.tagline && <p className="text-sm text-gray-400 mb-4">{b.tagline}</p>}
            <div className="flex gap-3">
              {sl.map((s) => <SocialIcon key={s.id} label={s.label} color="#9ca3af" />)}
            </div>
          </div>
          {cols.map((col, i) => (
            <div key={i} className="min-w-[130px]">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-4">{col.heading}</h4>
              <ul className="space-y-3 list-none p-0 m-0">
                {col.items.map((item) => <li key={item.id}><a href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">{item.label}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 pt-5 text-center">
          <p className="text-xs text-gray-500 m-0">{copyright ?? DEFAULT_COPYRIGHT}</p>
        </div>
      </div>
    </footer>
  )
}

function TwMinimal({ copyright, style }: Props) {
  return (
    <footer className="w-full bg-gray-950 py-4 px-8" style={style}>
      <p className="text-center text-xs text-gray-600 m-0">{copyright ?? DEFAULT_COPYRIGHT}</p>
    </footer>
  )
}

function TwCenteredBrand({ brand, links, copyright, socials, style }: Props) {
  const b = brand ?? DEFAULT_BRAND
  const l = links?.length ? links : DEFAULT_LINKS
  const sl = socials?.length ? socials : SOCIAL_LABELS.map((label, i) => ({ id: String(i), label, href: '#' }))
  return (
    <footer className="w-full bg-slate-800 py-12 px-8 text-center" style={style}>
      {b.logoSrc ? <img src={b.logoSrc} alt={b.name} className="h-9 mx-auto mb-2" /> : <span className="text-xl font-extrabold text-white block mb-2">{b.name}</span>}
      {b.tagline && <p className="text-sm text-slate-400 mb-5">{b.tagline}</p>}
      <nav className="flex justify-center gap-6 flex-wrap mb-5">
        {l.map((link) => <a key={link.id} href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">{link.label}</a>)}
      </nav>
      <div className="flex justify-center gap-4 mb-6">
        {sl.map((s) => <SocialIcon key={s.id} label={s.label} color="#94a3b8" />)}
      </div>
      <p className="text-xs text-slate-500 m-0">{copyright ?? DEFAULT_COPYRIGHT}</p>
    </footer>
  )
}

function TwMega({ columnLinks, brand, copyright, links, socials, style }: Props) {
  const cols = columnLinks?.length ? columnLinks : DEFAULT_COLUMNS
  const b = brand ?? DEFAULT_BRAND
  const l = links?.length ? links : DEFAULT_LINKS
  const sl = socials?.length ? socials : SOCIAL_LABELS.map((label, i) => ({ id: String(i), label, href: '#' }))
  return (
    <footer className="w-full bg-gray-950" style={style}>
      <div className="px-10 pt-14">
        <div className="grid gap-10 mb-12" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          <div>
            {b.logoSrc ? <img src={b.logoSrc} alt={b.name} className="h-8 mb-3" /> : <span className="text-base font-extrabold text-white block mb-2">{b.name}</span>}
            {b.tagline && <p className="text-sm text-gray-500 m-0">{b.tagline}</p>}
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-4">{col.heading}</h4>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {col.items.map((item) => <li key={item.id}><a href={item.href} className="text-sm text-gray-500 hover:text-gray-200 transition-colors">{item.label}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-800 px-10 py-4 flex justify-between items-center flex-wrap gap-3">
        <p className="text-xs text-gray-600 m-0">{copyright ?? DEFAULT_COPYRIGHT}</p>
        <div className="flex items-center gap-4">
          {l.map((link) => <a key={link.id} href={link.href} className="text-xs text-gray-600 hover:text-gray-300 transition-colors">{link.label}</a>)}
          {sl.map((s) => <SocialIcon key={s.id} label={s.label} color="#4b5563" />)}
        </div>
      </div>
    </footer>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function FooterElement(props: Props) {
  const framework = useFramework()
  const variant = props.layoutVariant ?? 'simple'

  if (framework === 'bootstrap') {
    if (variant === 'columns')        return <BsColumns {...props} />
    if (variant === 'minimal')        return <BsMinimal {...props} />
    if (variant === 'centered-brand') return <BsCenteredBrand {...props} />
    if (variant === 'mega')           return <BsMega {...props} />
    return <BsSimple {...props} />
  }

  if (framework === 'mui') {
    if (variant === 'columns')        return <MuiColumns {...props} />
    if (variant === 'minimal')        return <MuiMinimal {...props} />
    if (variant === 'centered-brand') return <MuiCenteredBrand {...props} />
    if (variant === 'mega')           return <MuiMega {...props} />
    return <MuiSimple {...props} />
  }

  if (framework === 'tailwind') {
    if (variant === 'columns')        return <TwColumns {...props} />
    if (variant === 'minimal')        return <TwMinimal {...props} />
    if (variant === 'centered-brand') return <TwCenteredBrand {...props} />
    if (variant === 'mega')           return <TwMega {...props} />
    return <TwSimple {...props} />
  }

  // Custom
  if (variant === 'columns')        return <CustomColumns {...props} />
  if (variant === 'minimal')        return <CustomMinimal {...props} />
  if (variant === 'centered-brand') return <CustomCenteredBrand {...props} />
  if (variant === 'mega')           return <CustomMega {...props} />
  return <CustomSimple {...props} />
}
