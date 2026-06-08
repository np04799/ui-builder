'use client'

interface Props {
  heading?: string
  subtext?: string
  cta?: string
  ctaHref?: string
  tickerItems?: string[]
  style?: React.CSSProperties
}

const DEFAULT_TICKER = [
  '⚡ 10× Faster Builds',
  '🎨 Pixel-Perfect Design',
  '🚀 One-Click Deploy',
  '🔒 Enterprise Security',
  '🌍 Global CDN',
  '💡 AI-Powered Suggestions',
  '📱 Mobile-First Responsive',
  '🔗 200+ Integrations',
]

export default function BannerTickerElement({
  heading = 'The Platform Pros Choose',
  subtext = 'Everything you need to ship world-class products — shipped to you, ready to go.',
  cta = 'Start Free',
  ctaHref = '#',
  tickerItems = DEFAULT_TICKER,
  style,
}: Props) {
  const items = [...tickerItems, ...tickerItems]

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        background: 'linear-gradient(180deg, #0a0a18 0%, #0f172a 100%)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Subtle star field dots */}
      {[...Array(18)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 2, height: 2, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.4)',
          top: `${(i * 37 + 11) % 90}%`,
          left: `${(i * 53 + 7) % 95}%`,
          animation: `bp-fade-in ${1 + (i % 4) * 0.5}s ease ${(i * 0.3) % 2}s both`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Main hero content */}
      <div style={{
        padding: '80px 48px 56px',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        position: 'relative', zIndex: 1,
      }}>
        {/* Shimmer badge */}
        <div style={{
          padding: '6px 18px', borderRadius: 20, fontSize: '11px',
          fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 40%, #06b6d4 80%, #6366f1 100%)',
          backgroundSize: '200% auto',
          color: '#fff',
          animation: 'bp-shimmer 3s linear infinite',
        }}>
          Trusted by 50,000+ teams
        </div>

        <h1 style={{
          color: '#f1f5f9', fontSize: '52px', fontWeight: 900, lineHeight: 1.1,
          margin: 0, maxWidth: 640, letterSpacing: '-0.025em',
          animation: 'bp-fade-up 0.8s ease 0.1s both',
        }}>
          {heading}
        </h1>

        <p style={{
          color: '#64748b', fontSize: '18px', lineHeight: 1.7,
          margin: 0, maxWidth: 520,
          animation: 'bp-fade-up 0.8s ease 0.25s both',
        }}>
          {subtext}
        </p>

        <a href={ctaHref} style={{
          display: 'inline-block',
          padding: '15px 40px', borderRadius: 50,
          background: 'linear-gradient(135deg, var(--color-primary), #7c3aed)',
          color: '#fff', textDecoration: 'none',
          fontWeight: 700, fontSize: '16px',
          boxShadow: '0 8px 32px rgba(79,70,229,0.4)',
          animation: 'bp-fade-up 0.8s ease 0.4s both, bp-pulse-glow 3s ease-in-out 1.5s infinite',
        }}>
          {cta}
        </a>
      </div>

      {/* Ticker tape */}
      <div style={{
        width: '100%', overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.025)',
        padding: '14px 0',
      }}>
        <div style={{
          display: 'flex', gap: 0,
          width: 'max-content',
          animation: 'bp-ticker 28s linear infinite',
        }}>
          {items.map((item, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 28,
              color: '#94a3b8', fontSize: '13px', fontWeight: 500,
              whiteSpace: 'nowrap', padding: '0 28px',
            }}>
              {item}
              <span style={{ color: 'rgba(148,163,184,0.3)', fontSize: '16px' }}>•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
