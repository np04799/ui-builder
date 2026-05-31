'use client'

import { useFramework } from '@/hooks/useFramework'

interface Props {
  image?: { src: string; alt: string }
  title?: string
  description?: string
  button?: { text: string; href: string }
  style?: React.CSSProperties
}

const PlaceholderImg = () => (
  <div style={{ width: '100%', height: 180, backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#9ca3af" strokeWidth="1.5">
      <rect x="4" y="4" width="32" height="32" rx="4" />
      <circle cx="14" cy="14" r="4" />
      <path d="M4 28l8-8 6 6 5-5 13 13" />
    </svg>
  </div>
)

export default function CardElement({
  image = { src: '', alt: 'Card image' },
  title = 'Card Title',
  description = 'Card description goes here. Add your content.',
  button,
  style,
}: Props) {
  const framework = useFramework()

  // ─── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    return (
      <div className="card" style={style}>
        {image.src
          ? <img src={image.src} alt={image.alt} className="card-img-top" style={{ height: 180, objectFit: 'cover' }} />
          : <PlaceholderImg />
        }
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          {button && <a href={button.href} className="btn btn-primary">{button.text}</a>}
        </div>
      </div>
    )
  }

  // ─── MUI ────────────────────────────────────────────────────────────────────
  if (framework === 'mui') {
    return (
      <div className="mui-root MuiCard-root" style={style}>
        {image.src
          ? <img src={image.src} alt={image.alt} className="MuiCardMedia-root" style={{ height: 180, objectFit: 'cover' }} />
          : <PlaceholderImg />
        }
        <div className="MuiCardContent-root">
          <p className="MuiTypography-root MuiTypography-h6 MuiTypography-gutterBottom">{title}</p>
          <p className="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextSecondary">{description}</p>
        </div>
        {button && (
          <div className="MuiCardActions-root">
            <a href={button.href} className="MuiButton-root MuiButton-text">{button.text}</a>
          </div>
        )}
      </div>
    )
  }

  // ─── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    return (
      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm" style={style}>
        {image.src
          ? <img src={image.src} alt={image.alt} className="w-full object-cover" style={{ height: 180 }} />
          : <PlaceholderImg />
        }
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">{description}</p>
          {button && (
            <a href={button.href} className="inline-block px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
              {button.text}
            </a>
          )}
        </div>
      </div>
    )
  }

  // ─── Custom ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        borderRadius: 10,
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
        ...style,
      }}
    >
      {image.src ? (
        <img src={image.src} alt={image.alt} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
      ) : (
        <PlaceholderImg />
      )}
      <div style={{ padding: '16px 20px 20px' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</h3>
        <p style={{ margin: '0 0 16px', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{description}</p>
        {button && (
          <a
            href={button.href}
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: 6,
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
            }}
          >
            {button.text}
          </a>
        )}
      </div>
    </div>
  )
}
