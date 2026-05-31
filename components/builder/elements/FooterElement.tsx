'use client'

import type { NavItem } from '@/types/builder.types'

interface Props {
  links?: NavItem[]
  copyright?: string
  socials?: NavItem[]
  style?: React.CSSProperties
}

export default function FooterElement({
  links = [
    { id: '1', label: 'Privacy', href: '#' },
    { id: '2', label: 'Terms', href: '#' },
    { id: '3', label: 'Contact', href: '#' },
  ],
  copyright = `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
  socials,
  style,
}: Props) {
  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: '#111827',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        borderRadius: 8,
        ...style,
      }}
    >
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {links.map((link) => (
          <a key={link.id} href={link.href} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
            {link.label}
          </a>
        ))}
      </div>
      {socials && socials.length > 0 && (
        <div style={{ display: 'flex', gap: 16 }}>
          {socials.map((s) => (
            <a key={s.id} href={s.href} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
              {s.label}
            </a>
          ))}
        </div>
      )}
      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{copyright}</p>
    </footer>
  )
}
