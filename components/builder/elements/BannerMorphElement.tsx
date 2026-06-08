'use client'

interface Props {
  heading?: string
  subtext?: string
  badge?: string
  cta?: string
  ctaHref?: string
  style?: React.CSSProperties
}

export default function BannerMorphElement({
  heading = 'Design Without Limits',
  subtext = 'A canvas that moves with your ideas. Fluid. Alive. Yours.',
  badge = 'Creative Studio',
  cta = 'Start Creating',
  ctaHref = '#',
  style,
}: Props) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 400,
        backgroundColor: '#fff',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '60px 56px',
        ...style,
      }}
    >
      {/* Morphing blob — left side */}
      <div style={{
        position: 'absolute', left: -100, top: '50%',
        transform: 'translateY(-50%)',
        width: 440, height: 440,
        background: 'linear-gradient(135deg, #fbc2eb, #a18cd1, #ffecd2)',
        animation: 'bp-morph 10s ease-in-out infinite, bp-spin-slow 25s linear infinite',
        opacity: 0.55,
        filter: 'blur(2px)',
        pointerEvents: 'none',
      }} />

      {/* Morphing blob — top right */}
      <div style={{
        position: 'absolute', right: -60, top: -80,
        width: 320, height: 320,
        background: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
        animation: 'bp-morph 14s ease-in-out infinite 3s, bp-spin-slow 30s linear infinite reverse',
        opacity: 0.45,
        filter: 'blur(4px)',
        pointerEvents: 'none',
      }} />

      {/* Floating shape accents */}
      {[
        { size: 14, top: '20%', left: '45%', delay: '0s', color: '#a78bfa', dur: '4s' },
        { size: 10, top: '70%', left: '55%', delay: '1.5s', color: '#34d399', dur: '5s' },
        { size: 18, top: '40%', left: '70%', delay: '0.7s', color: '#f472b6', dur: '6s' },
        { size: 8, top: '15%', left: '60%', delay: '2s', color: '#60a5fa', dur: '3.5s' },
      ].map((dot, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: dot.size, height: dot.size, borderRadius: '50%',
          backgroundColor: dot.color,
          top: dot.top, left: dot.left,
          animation: `bp-float ${dot.dur} ease-in-out infinite ${dot.delay}`,
          opacity: 0.7,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Content — left column */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <span style={{
          display: 'inline-block', width: 'fit-content',
          padding: '5px 14px', borderRadius: 20,
          background: 'linear-gradient(90deg, #f9a8d4, #c4b5fd)',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
          color: '#4c1d95', textTransform: 'uppercase',
          animation: 'bp-scale-in 0.5s ease both',
        }}>
          {badge}
        </span>

        <h1 style={{
          fontSize: '48px', fontWeight: 900, lineHeight: 1.1,
          color: 'var(--color-text-primary)', margin: 0,
          animation: 'bp-slide-right 0.7s ease 0.15s both',
        }}>
          {heading}
        </h1>

        <p style={{
          fontSize: '17px', color: 'var(--color-text-secondary)', lineHeight: 1.7,
          margin: 0,
          animation: 'bp-slide-right 0.7s ease 0.3s both',
        }}>
          {subtext}
        </p>

        <a href={ctaHref} style={{
          display: 'inline-block', width: 'fit-content',
          padding: '13px 32px', borderRadius: 50,
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          color: '#fff', textDecoration: 'none',
          fontWeight: 700, fontSize: '15px',
          boxShadow: '0 8px 24px rgba(124,58,237,0.3)',
          animation: 'bp-fade-up 0.7s ease 0.45s both',
          transition: 'transform 200ms ease, box-shadow 200ms ease',
        }}>
          {cta}
        </a>
      </div>
    </div>
  )
}
