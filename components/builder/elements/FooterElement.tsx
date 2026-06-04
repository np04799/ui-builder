'use client'

import type { NavItem } from '@/types/builder.types'
import { useFramework } from '@/hooks/useFramework'

interface Props {
  links?: NavItem[]
  copyright?: string
  socials?: NavItem[]
  style?: React.CSSProperties
}

export default function FooterElement({ links = [{ id: '1', label: 'Privacy', href: '#' }, { id: '2', label: 'Terms', href: '#' }, { id: '3', label: 'Contact', href: '#' }], copyright = `© ${new Date().getFullYear()} Your Company. All rights reserved.`, socials, style }: Props) {
  const framework = useFramework()

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    return (
      <footer className="py-4 bg-dark text-white" style={{ borderRadius: 8, ...style }}>
        <div className="container-fluid">
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-3">
            {links.map((link) => (
              <a key={link.id} href={link.href} className="text-secondary text-decoration-none small">{link.label}</a>
            ))}
          </div>
          {socials && socials.length > 0 && (
            <div className="d-flex justify-content-center gap-3 mb-3">
              {socials.map((s) => <a key={s.id} href={s.href} className="text-secondary text-decoration-none small">{s.label}</a>)}
            </div>
          )}
          <p className="text-center text-secondary mb-0" style={{ fontSize: '0.75rem' }}>{copyright}</p>
        </div>
      </footer>
    )
  }

  // ── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    return (
      <footer className="w-full bg-gray-900 text-white py-6 px-4 rounded-lg" style={style}>
        <div className="flex flex-wrap justify-center gap-4 mb-3">
          {links.map((link) => <a key={link.id} href={link.href} className="text-gray-400 text-sm hover:text-white no-underline">{link.label}</a>)}
        </div>
        {socials && socials.length > 0 && (
          <div className="flex justify-center gap-3 mb-3">{socials.map((s) => <a key={s.id} href={s.href} className="text-gray-400 text-sm hover:text-white no-underline">{s.label}</a>)}</div>
        )}
        <p className="text-center text-gray-500 text-xs m-0">{copyright}</p>
      </footer>
    )
  }

  // ── MUI ───────────────────────────────────────────────────────────────────
  if (framework === 'mui') {
    return (
      <footer style={{ width: '100%', backgroundColor: '#1e293b', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, borderRadius: 4, ...style }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {links.map((link) => <a key={link.id} href={link.href} className="MuiTypography-root" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>{link.label}</a>)}
        </div>
        {socials && socials.length > 0 && (
          <div style={{ display: 'flex', gap: 16 }}>{socials.map((s) => <a key={s.id} href={s.href} className="MuiTypography-root" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>{s.label}</a>)}</div>
        )}
        <p className="MuiTypography-root MuiTypography-body2" style={{ margin: 0, color: '#64748b' }}>{copyright}</p>
      </footer>
    )
  }

  // ── Custom ─────────────────────────────────────────────────────────────────
  return (
    <footer style={{ width: '100%', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, borderRadius: 8, ...style }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {links.map((link) => <a key={link.id} href={link.href} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>{link.label}</a>)}
      </div>
      {socials && socials.length > 0 && (
        <div style={{ display: 'flex', gap: 16 }}>{socials.map((s) => <a key={s.id} href={s.href} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>{s.label}</a>)}</div>
      )}
      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{copyright}</p>
    </footer>
  )
}
