'use client'

import { memo } from 'react'
import { useFramework } from '@/hooks/useFramework'

type PricingPreset = 'simple' | 'featured' | 'minimal' | 'bordered'
type CtaVariant = 'primary' | 'outline' | 'secondary'

interface Feature { id: string; text: string; included: boolean }

interface Props {
  preset?: PricingPreset
  planName?: string
  price?: string
  period?: string
  description?: string
  features?: Feature[]
  ctaText?: string
  ctaHref?: string
  ctaVariant?: CtaVariant
  badge?: string
  highlighted?: boolean
  style?: React.CSSProperties
}

const DEFAULT_FEATURES: Feature[] = [
  { id: '1', text: '10 projects', included: true },
  { id: '2', text: 'Up to 5 users', included: true },
  { id: '3', text: 'Basic analytics', included: true },
  { id: '4', text: 'Priority support', included: false },
  { id: '5', text: 'Custom domain', included: false },
]

function CheckIcon({ included }: { included: boolean }) {
  return included
    ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3.5 3.5L13 5" /></svg>
    : <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>
}

const PricingCardElement = memo(function PricingCardElement({
  preset = 'simple',
  planName = 'Pro',
  price = '$29',
  period = '/month',
  description = 'Perfect for growing teams and businesses.',
  features = DEFAULT_FEATURES,
  ctaText = 'Get started',
  ctaHref = '#',
  ctaVariant = 'primary',
  badge,
  highlighted = false,
  style,
}: Props) {
  const framework = useFramework()
  const isFeatured = preset === 'featured' || highlighted

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    const cardClass = isFeatured
      ? 'card border-primary shadow-lg text-center position-relative'
      : preset === 'minimal' ? 'card border-0 bg-body-secondary text-center'
      : 'card text-center'
    const btnClass = ctaVariant === 'outline' ? 'btn btn-outline-primary w-100' : ctaVariant === 'secondary' ? 'btn btn-secondary w-100' : 'btn btn-primary w-100'

    return (
      <div className={cardClass} style={isFeatured ? { borderWidth: 2, ...style } : style}>
        {badge && <span className="position-absolute top-0 start-50 translate-middle badge bg-primary rounded-pill px-3">{badge}</span>}
        <div className="card-body p-4">
          <h5 className="card-title fw-bold mb-1">{planName}</h5>
          {description && <p className="text-muted small mb-3">{description}</p>}
          <div className="mb-3">
            <span className="display-5 fw-bold">{price}</span>
            <span className="text-muted">{period}</span>
          </div>
          <a href={ctaHref} className={btnClass}>{ctaText}</a>
          <hr className="my-3" />
          <ul className="list-unstyled text-start mb-0">
            {features.map((f) => (
              <li key={f.id} className={`d-flex align-items-center gap-2 mb-2 small ${f.included ? '' : 'text-muted'}`}>
                <CheckIcon included={f.included} />
                {f.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // ── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    const bg = isFeatured ? 'bg-indigo-600 text-white' : preset === 'minimal' ? 'bg-gray-50' : 'bg-white'
    const border = isFeatured ? 'border-2 border-indigo-600 shadow-xl' : preset === 'bordered' ? 'border-2 border-gray-200' : 'border border-gray-200 shadow-sm'
    const btnCls = isFeatured
      ? 'w-full py-2.5 rounded-lg bg-white text-indigo-600 font-semibold text-sm hover:bg-gray-100 transition-colors'
      : ctaVariant === 'outline' ? 'w-full py-2.5 rounded-lg border border-indigo-600 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-colors'
      : 'w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors'

    return (
      <div className={`relative rounded-2xl p-6 ${bg} ${border}`} style={style}>
        {badge && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
            {badge}
          </span>
        )}
        <div className="text-center mb-5">
          <h3 className={`text-lg font-bold mb-1 ${isFeatured ? 'text-white' : 'text-gray-900'}`}>{planName}</h3>
          {description && <p className={`text-sm mb-3 ${isFeatured ? 'text-indigo-200' : 'text-gray-500'}`}>{description}</p>}
          <div>
            <span className={`text-4xl font-extrabold ${isFeatured ? 'text-white' : 'text-gray-900'}`}>{price}</span>
            <span className={`text-sm ${isFeatured ? 'text-indigo-200' : 'text-gray-500'}`}>{period}</span>
          </div>
        </div>
        <a href={ctaHref} className={`block text-center mb-5 no-underline ${btnCls}`}>{ctaText}</a>
        <ul className="space-y-2.5 m-0 p-0 list-none">
          {features.map((f) => (
            <li key={f.id} className={`flex items-center gap-2.5 text-sm ${f.included ? (isFeatured ? 'text-white' : 'text-gray-700') : isFeatured ? 'text-indigo-300' : 'text-gray-400'}`}>
              <CheckIcon included={f.included} />
              {f.text}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // ── Custom / MUI ───────────────────────────────────────────────────────────
  const bg = isFeatured ? '#4f46e5' : preset === 'minimal' ? 'var(--color-surface)' : 'var(--color-bg)'
  const border = isFeatured ? '2px solid #4f46e5' : `1px solid var(--color-border)`
  const textPrimary = isFeatured ? '#fff' : 'var(--color-text-primary)'
  const textSecondary = isFeatured ? 'rgba(255,255,255,0.75)' : 'var(--color-text-secondary)'

  return (
    <div style={{ position: 'relative', borderRadius: 16, padding: 24, backgroundColor: bg, border, boxShadow: isFeatured ? '0 8px 32px rgba(79,70,229,0.3)' : '0 1px 4px rgba(0,0,0,0.07)', ...style }}>
      {badge && (
        <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#4f46e5', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>
          {badge}
        </span>
      )}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '1.125rem', fontWeight: 700, color: textPrimary }}>{planName}</h3>
        {description && <p style={{ margin: '0 0 12px', fontSize: '0.8125rem', color: textSecondary }}>{description}</p>}
        <div>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, color: textPrimary }}>{price}</span>
          <span style={{ fontSize: '0.875rem', color: textSecondary }}>{period}</span>
        </div>
      </div>
      <a
        href={ctaHref}
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '10px 0',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.9rem',
          textDecoration: 'none',
          marginBottom: 20,
          backgroundColor: isFeatured ? '#fff' : ctaVariant === 'outline' ? 'transparent' : '#4f46e5',
          color: isFeatured ? '#4f46e5' : ctaVariant === 'outline' ? '#4f46e5' : '#fff',
          border: ctaVariant === 'outline' ? '1.5px solid #4f46e5' : 'none',
          transition: 'opacity 150ms',
        }}
      >
        {ctaText}
      </a>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {features.map((f) => (
          <li key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: f.included ? textPrimary : textSecondary, opacity: f.included ? 1 : 0.6 }}>
            <CheckIcon included={f.included} />
            {f.text}
          </li>
        ))}
      </ul>
    </div>
  )
})

export default PricingCardElement
