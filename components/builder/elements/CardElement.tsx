'use client'

import { useFramework } from '@/hooks/useFramework'

interface Props {
  image?: { src: string; alt: string }
  title?: string
  description?: string
  button?: { text: string; href: string }
  layoutVariant?: 'image-top' | 'horizontal' | 'pricing' | 'feature' | 'testimonial'
  price?: string
  priceUnit?: string
  features?: string[]
  icon?: string
  author?: string
  authorRole?: string
  avatarSrc?: string
  rating?: number
  style?: React.CSSProperties
}

// ─── Shared sub-components ───────────────────────────────────────────────────

const PlaceholderImg = ({ height = 180 }: { height?: number }) => (
  <div style={{ width: '100%', height, backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#9ca3af" strokeWidth="1.5">
      <rect x="4" y="4" width="32" height="32" rx="4" />
      <circle cx="14" cy="14" r="4" />
      <path d="M4 28l8-8 6 6 5-5 13 13" />
    </svg>
  </div>
)

const StarRating = ({ rating = 5, color = '#f59e0b' }: { rating?: number; color?: string }) => (
  <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill={i <= rating ? color : 'none'} stroke={color} strokeWidth="1.2">
        <path d="M7 1l1.5 3.5L12 5l-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5z" />
      </svg>
    ))}
  </div>
)

const FeatureIcon = ({ icon = '⚡', size = 40, bg = '#ede9fe', color = '#7c3aed' }: { icon?: string; size?: number; bg?: string; color?: string }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2.5, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, color, marginBottom: 12 }}>
    {icon}
  </div>
)

// ─── CUSTOM framework renders ─────────────────────────────────────────────────

function CustomImageTop({ image, title, description, button, style }: Props) {
  return (
    <div style={{ borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', ...style }}>
      {image?.src ? <img src={image.src} alt={image.alt} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} /> : <PlaceholderImg />}
      <div style={{ padding: '16px 20px 20px' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{title ?? 'Card Title'}</h3>
        <p style={{ margin: '0 0 16px', fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>{description ?? 'Card description goes here.'}</p>
        {button && <a href={button.href} style={{ display: 'inline-block', padding: '8px 16px', borderRadius: 6, backgroundColor: 'var(--color-primary)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.8125rem' }}>{button.text}</a>}
      </div>
    </div>
  )
}

function CustomHorizontal({ image, title, description, button, style }: Props) {
  return (
    <div style={{ borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'stretch', ...style }}>
      <div style={{ width: 140, flexShrink: 0 }}>
        {image?.src ? <img src={image.src} alt={image.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : <PlaceholderImg height={120} />}
      </div>
      <div style={{ padding: '16px 18px', flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: '0 0 6px', fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>{title ?? 'Card Title'}</h3>
        <p style={{ margin: '0 0 14px', fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>{description ?? 'Card description.'}</p>
        {button && <a href={button.href} style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 6, backgroundColor: 'var(--color-primary)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.75rem' }}>{button.text}</a>}
      </div>
    </div>
  )
}

function CustomPricing({ title, price = '$29', priceUnit = '/mo', features = ['Feature one', 'Feature two', 'Feature three'], button, style }: Props) {
  return (
    <div style={{ borderRadius: 12, border: '2px solid #e5e7eb', backgroundColor: '#fff', padding: '28px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', ...style }}>
      <h3 style={{ margin: '0 0 12px', fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>{title ?? 'Pro Plan'}</h3>
      <div style={{ margin: '0 0 20px' }}>
        <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>{price}</span>
        <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: 2 }}>{priceUnit}</span>
      </div>
      <ul style={{ margin: '0 0 24px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: '#374151' }}>
            <span style={{ color: '#10b981', fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
          </li>
        ))}
      </ul>
      {button && <a href={button.href} style={{ display: 'block', padding: '10px 0', borderRadius: 8, backgroundColor: 'var(--color-primary)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>{button.text}</a>}
    </div>
  )
}

function CustomFeature({ icon = '⚡', title, description, style }: Props) {
  return (
    <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', backgroundColor: '#fff', padding: '24px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', ...style }}>
      <FeatureIcon icon={icon} />
      <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{title ?? 'Feature Title'}</h3>
      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>{description ?? 'Describe this feature in a short sentence.'}</p>
    </div>
  )
}

function CustomTestimonial({ description, author = 'Jane Smith', authorRole = 'CEO, Acme Inc.', avatarSrc, rating = 5, style }: Props) {
  return (
    <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', backgroundColor: '#fff', padding: '24px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', ...style }}>
      <StarRating rating={rating} />
      <p style={{ margin: '0 0 20px', fontSize: '0.9375rem', color: '#374151', lineHeight: 1.65, fontStyle: 'italic' }}>"{description ?? 'This product changed our workflow completely. Highly recommend.'}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {avatarSrc
          ? <img src={avatarSrc} alt={author} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
          : <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#4f46e5' }}>{author.charAt(0)}</div>
        }
        <div>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>{author}</p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{authorRole}</p>
        </div>
      </div>
    </div>
  )
}

// ─── BOOTSTRAP renders ────────────────────────────────────────────────────────

function BsImageTop({ image, title, description, button, style }: Props) {
  return (
    <div className="card" style={style}>
      {image?.src ? <img src={image.src} alt={image.alt} className="card-img-top" style={{ height: 180, objectFit: 'cover' }} /> : <PlaceholderImg />}
      <div className="card-body">
        <h5 className="card-title">{title ?? 'Card Title'}</h5>
        <p className="card-text" style={{ color: '#6c757d' }}>{description ?? 'Card description.'}</p>
        {button && <a href={button.href} className="btn btn-primary btn-sm">{button.text}</a>}
      </div>
    </div>
  )
}

function BsHorizontal({ image, title, description, button, style }: Props) {
  return (
    <div className="card" style={{ ...style, overflow: 'hidden' }}>
      <div className="row g-0">
        <div className="col-4">
          {image?.src ? <img src={image.src} alt={image.alt} className="img-fluid h-100" style={{ objectFit: 'cover' }} /> : <PlaceholderImg height={120} />}
        </div>
        <div className="col-8">
          <div className="card-body py-3">
            <h5 className="card-title mb-1">{title ?? 'Card Title'}</h5>
            <p className="card-text small" style={{ color: '#6c757d' }}>{description ?? 'Card description.'}</p>
            {button && <a href={button.href} className="btn btn-primary btn-sm">{button.text}</a>}
          </div>
        </div>
      </div>
    </div>
  )
}

function BsPricing({ title, price = '$29', priceUnit = '/mo', features = ['Feature one', 'Feature two', 'Feature three'], button, style }: Props) {
  return (
    <div className="card text-center" style={style}>
      <div className="card-body p-4">
        <h5 className="card-title">{title ?? 'Pro Plan'}</h5>
        <div className="mb-3">
          <span className="display-6 fw-bold" style={{ color: 'var(--color-primary)' }}>{price}</span>
          <small style={{ color: '#6c757d' }}>{priceUnit}</small>
        </div>
        <ul className="list-unstyled mb-4 text-start">
          {(features ?? []).map((f, i) => (
            <li key={i} className="mb-2 d-flex align-items-center gap-2">
              <span style={{ color: '#198754', fontWeight: 700 }}>✓</span>
              <span className="small">{f}</span>
            </li>
          ))}
        </ul>
        {button && <a href={button.href} className="btn btn-primary d-block">{button.text}</a>}
      </div>
    </div>
  )
}

function BsFeature({ icon = '⚡', title, description, style }: Props) {
  return (
    <div className="card h-100" style={style}>
      <div className="card-body p-4">
        <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-3" style={{ width: 44, height: 44, backgroundColor: '#ede9fe', fontSize: '1.25rem' }}>{icon}</div>
        <h5 className="card-title">{title ?? 'Feature Title'}</h5>
        <p className="card-text small" style={{ color: '#6c757d' }}>{description ?? 'Describe this feature briefly.'}</p>
      </div>
    </div>
  )
}

function BsTestimonial({ description, author = 'Jane Smith', authorRole = 'CEO, Acme Inc.', avatarSrc, rating = 5, style }: Props) {
  return (
    <div className="card" style={style}>
      <div className="card-body p-4">
        <StarRating rating={rating} />
        <p className="card-text fst-italic mb-3">"{description ?? 'This product changed our workflow.'}"</p>
        <div className="d-flex align-items-center gap-3">
          {avatarSrc
            ? <img src={avatarSrc} alt={author} className="rounded-circle" style={{ width: 40, height: 40, objectFit: 'cover' }} />
            : <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 40, height: 40, backgroundColor: '#e0e7ff', color: '#4f46e5', flexShrink: 0 }}>{author.charAt(0)}</div>
          }
          <div>
            <p className="mb-0 fw-bold small">{author}</p>
            <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>{authorRole}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MUI renders ──────────────────────────────────────────────────────────────

function MuiImageTop({ image, title, description, button, style }: Props) {
  return (
    <div className="mui-root MuiCard-root MuiPaper-elevation1" style={{ borderRadius: 8, overflow: 'hidden', ...style }}>
      {image?.src ? <img src={image.src} alt={image.alt} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} /> : <PlaceholderImg />}
      <div className="MuiCardContent-root">
        <p className="MuiTypography-root MuiTypography-h6 MuiTypography-gutterBottom">{title ?? 'Card Title'}</p>
        <p className="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextSecondary">{description ?? 'Card description.'}</p>
      </div>
      {button && <div className="MuiCardActions-root"><a href={button.href} className="MuiButton-root MuiButton-text MuiButton-colorPrimary">{button.text}</a></div>}
    </div>
  )
}

function MuiHorizontal({ image, title, description, button, style }: Props) {
  return (
    <div className="mui-root MuiCard-root MuiPaper-elevation1" style={{ borderRadius: 8, overflow: 'hidden', display: 'flex', ...style }}>
      <div style={{ width: 140, flexShrink: 0 }}>
        {image?.src ? <img src={image.src} alt={image.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : <PlaceholderImg height={120} />}
      </div>
      <div className="MuiCardContent-root" style={{ flex: 1, minWidth: 0 }}>
        <p className="MuiTypography-root MuiTypography-h6 MuiTypography-gutterBottom">{title ?? 'Card Title'}</p>
        <p className="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextSecondary">{description ?? 'Card description.'}</p>
        {button && <a href={button.href} className="MuiButton-root MuiButton-text MuiButton-colorPrimary" style={{ marginTop: 8, display: 'inline-block' }}>{button.text}</a>}
      </div>
    </div>
  )
}

function MuiPricing({ title, price = '$29', priceUnit = '/mo', features = ['Feature one', 'Feature two', 'Feature three'], button, style }: Props) {
  return (
    <div className="mui-root MuiCard-root MuiPaper-elevation2" style={{ borderRadius: 12, textAlign: 'center', ...style }}>
      <div className="MuiCardContent-root" style={{ padding: '28px 24px' }}>
        <p className="MuiTypography-root MuiTypography-h6 MuiTypography-gutterBottom">{title ?? 'Pro Plan'}</p>
        <div style={{ margin: '8px 0 20px' }}>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{price}</span>
          <span className="MuiTypography-root MuiTypography-caption MuiTypography-colorTextSecondary" style={{ marginLeft: 2 }}>{priceUnit}</span>
        </div>
        <ul style={{ listStyle: 'none', margin: '0 0 20px', padding: 0, textAlign: 'left' }}>
          {(features ?? []).map((f, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ color: '#2e7d32', fontWeight: 700 }}>✓</span>
              <span className="MuiTypography-root MuiTypography-body2">{f}</span>
            </li>
          ))}
        </ul>
        {button && <a href={button.href} className="MuiButton-root MuiButton-contained MuiButton-fullWidth" style={{ display: 'block' }}>{button.text}</a>}
      </div>
    </div>
  )
}

function MuiFeature({ icon = '⚡', title, description, style }: Props) {
  return (
    <div className="mui-root MuiCard-root MuiPaper-elevation1" style={{ borderRadius: 8, ...style }}>
      <div className="MuiCardContent-root" style={{ padding: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 12 }}>{icon}</div>
        <p className="MuiTypography-root MuiTypography-h6 MuiTypography-gutterBottom">{title ?? 'Feature Title'}</p>
        <p className="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextSecondary">{description ?? 'Describe this feature briefly.'}</p>
      </div>
    </div>
  )
}

function MuiTestimonial({ description, author = 'Jane Smith', authorRole = 'CEO, Acme Inc.', avatarSrc, rating = 5, style }: Props) {
  return (
    <div className="mui-root MuiCard-root MuiPaper-elevation1" style={{ borderRadius: 8, ...style }}>
      <div className="MuiCardContent-root" style={{ padding: 24 }}>
        <StarRating rating={rating} />
        <p className="MuiTypography-root MuiTypography-body1" style={{ fontStyle: 'italic', marginBottom: 20 }}>"{description ?? 'Great product, highly recommended.'}"</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {avatarSrc
            ? <img src={avatarSrc} alt={author} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
            : <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#4f46e5', flexShrink: 0 }}>{author.charAt(0)}</div>
          }
          <div>
            <p className="MuiTypography-root MuiTypography-subtitle2" style={{ margin: 0 }}>{author}</p>
            <p className="MuiTypography-root MuiTypography-caption MuiTypography-colorTextSecondary" style={{ margin: 0 }}>{authorRole}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TAILWIND renders ─────────────────────────────────────────────────────────

function TwImageTop({ image, title, description, button, style }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm" style={style}>
      {image?.src ? <img src={image.src} alt={image.alt} className="w-full object-cover" style={{ height: 180 }} /> : <PlaceholderImg />}
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-2">{title ?? 'Card Title'}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">{description ?? 'Card description.'}</p>
        {button && <a href={button.href} className="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">{button.text}</a>}
      </div>
    </div>
  )
}

function TwHorizontal({ image, title, description, button, style }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm flex" style={style}>
      <div style={{ width: 140, flexShrink: 0 }}>
        {image?.src ? <img src={image.src} alt={image.alt} className="w-full h-full object-cover" /> : <PlaceholderImg height={120} />}
      </div>
      <div className="p-4 flex-1 min-w-0">
        <h3 className="text-sm font-bold text-gray-900 mb-1">{title ?? 'Card Title'}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">{description ?? 'Card description.'}</p>
        {button && <a href={button.href} className="inline-block px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors">{button.text}</a>}
      </div>
    </div>
  )
}

function TwPricing({ title, price = '$29', priceUnit = '/mo', features = ['Feature one', 'Feature two', 'Feature three'], button, style }: Props) {
  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white p-7 text-center shadow-sm" style={style}>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title ?? 'Pro Plan'}</h3>
      <div className="mb-5">
        <span className="text-4xl font-extrabold text-indigo-600">{price}</span>
        <span className="text-sm text-gray-400 ml-1">{priceUnit}</span>
      </div>
      <ul className="mb-6 text-left space-y-2.5">
        {(features ?? []).map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-500 font-bold flex-shrink-0">✓</span>{f}
          </li>
        ))}
      </ul>
      {button && <a href={button.href} className="block w-full py-2.5 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors text-center">{button.text}</a>}
    </div>
  )
}

function TwFeature({ icon = '⚡', title, description, style }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm" style={style}>
      <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center text-xl mb-3">{icon}</div>
      <h3 className="text-base font-bold text-gray-900 mb-2">{title ?? 'Feature Title'}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description ?? 'Describe this feature briefly.'}</p>
    </div>
  )
}

function TwTestimonial({ description, author = 'Jane Smith', authorRole = 'CEO, Acme Inc.', avatarSrc, rating = 5, style }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm" style={style}>
      <StarRating rating={rating} />
      <p className="text-gray-700 text-sm leading-relaxed italic mb-5">"{description ?? 'Great product, highly recommended.'}"</p>
      <div className="flex items-center gap-3">
        {avatarSrc
          ? <img src={avatarSrc} alt={author} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          : <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 flex-shrink-0">{author.charAt(0)}</div>
        }
        <div>
          <p className="text-sm font-bold text-gray-900 m-0">{author}</p>
          <p className="text-xs text-gray-400 m-0">{authorRole}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function CardElement(props: Props) {
  const framework = useFramework()
  const variant = props.layoutVariant ?? 'image-top'

  if (framework === 'bootstrap') {
    if (variant === 'horizontal')   return <BsHorizontal {...props} />
    if (variant === 'pricing')      return <BsPricing {...props} />
    if (variant === 'feature')      return <BsFeature {...props} />
    if (variant === 'testimonial')  return <BsTestimonial {...props} />
    return <BsImageTop {...props} />
  }

  if (framework === 'mui') {
    if (variant === 'horizontal')   return <MuiHorizontal {...props} />
    if (variant === 'pricing')      return <MuiPricing {...props} />
    if (variant === 'feature')      return <MuiFeature {...props} />
    if (variant === 'testimonial')  return <MuiTestimonial {...props} />
    return <MuiImageTop {...props} />
  }

  if (framework === 'tailwind') {
    if (variant === 'horizontal')   return <TwHorizontal {...props} />
    if (variant === 'pricing')      return <TwPricing {...props} />
    if (variant === 'feature')      return <TwFeature {...props} />
    if (variant === 'testimonial')  return <TwTestimonial {...props} />
    return <TwImageTop {...props} />
  }

  // Custom
  if (variant === 'horizontal')   return <CustomHorizontal {...props} />
  if (variant === 'pricing')      return <CustomPricing {...props} />
  if (variant === 'feature')      return <CustomFeature {...props} />
  if (variant === 'testimonial')  return <CustomTestimonial {...props} />
  return <CustomImageTop {...props} />
}
