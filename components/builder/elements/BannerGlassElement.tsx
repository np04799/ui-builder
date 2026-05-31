'use client'

interface Props {
  heading?: string
  subtext?: string
  cta?: string
  ctaHref?: string
  style?: React.CSSProperties
}

export default function BannerGlassElement({
  heading = 'The Future Is Transparent',
  subtext = 'Glassmorphism meets modern design. Beautiful, layered, alive.',
  cta = 'Explore Now',
  ctaHref = '#',
  style,
}: Props) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 400,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 48px',
        ...style,
      }}
    >
      {/* Background blobs */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 65%)',
        top: '-200px', left: '-150px', pointerEvents: 'none',
        animation: 'bp-float-slow 10s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 65%)',
        bottom: '-150px', right: '-100px', pointerEvents: 'none',
        animation: 'bp-float 12s ease-in-out infinite 2s',
      }} />
      <div style={{
        position: 'absolute', width: 250, height: 250, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 65%)',
        top: '40%', right: '20%', pointerEvents: 'none',
        animation: 'bp-float 8s ease-in-out infinite 1s',
      }} />

      {/* Floating glass cards behind content */}
      <div style={{
        position: 'absolute', top: 30, right: 60, width: 140, height: 90,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 16, backdropFilter: 'blur(12px)',
        transform: 'perspective(800px) rotateX(15deg) rotateY(-20deg)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
        animation: 'bp-float 8s ease-in-out infinite',
        pointerEvents: 'none',
      }}>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ width: 60, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.3)', marginBottom: 8 }} />
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 40, left: 60, width: 110, height: 70,
        background: 'rgba(99,102,241,0.12)',
        border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: 14, backdropFilter: 'blur(10px)',
        transform: 'perspective(800px) rotateX(-10deg) rotateY(25deg)',
        boxShadow: '0 16px 40px rgba(99,102,241,0.2)',
        animation: 'bp-float-slow 11s ease-in-out infinite 4s',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '30%', left: '12%', width: 70, height: 70,
        background: 'rgba(236,72,153,0.1)',
        border: '1px solid rgba(236,72,153,0.3)',
        borderRadius: '50%', backdropFilter: 'blur(8px)',
        animation: 'bp-float 7s ease-in-out infinite 3s',
        pointerEvents: 'none',
      }} />

      {/* Main glass card */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 24, backdropFilter: 'blur(20px)',
        padding: '56px 64px',
        textAlign: 'center', maxWidth: 640,
        boxShadow: '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
        animation: 'bp-fade-in 0.8s ease both',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 14px', borderRadius: 20,
          background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
          color: '#a5b4fc', textTransform: 'uppercase', marginBottom: 24,
          animation: 'bp-fade-up 0.6s ease 0.1s both',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a5b4fc', display: 'inline-block', animation: 'bp-pulse-glow 2s ease-in-out infinite' }} />
          Glass UI
        </div>
        <h1 style={{
          color: '#ffffff', fontSize: '48px', fontWeight: 900, lineHeight: 1.1,
          margin: '0 0 18px',
          background: 'linear-gradient(135deg, #fff 30%, rgba(165,180,252,0.9) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'bp-fade-up 0.7s ease 0.2s both',
        }}>
          {heading}
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.6)', fontSize: '17px', lineHeight: 1.7,
          margin: '0 0 36px',
          animation: 'bp-fade-up 0.7s ease 0.35s both',
        }}>
          {subtext}
        </p>
        <a href={ctaHref} style={{
          display: 'inline-block', padding: '14px 36px', borderRadius: 50,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(8px)',
          color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
          animation: 'bp-fade-up 0.7s ease 0.5s both',
          transition: 'background 200ms, transform 200ms',
        }}>
          {cta}
        </a>
      </div>
    </div>
  )
}
