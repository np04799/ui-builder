'use client'

interface Props {
  heading?: string
  subtext?: string
  cta?: string
  ctaHref?: string
  style?: React.CSSProperties
}

const PARTICLES = [
  { x: 10, y: 15, s: 3, d: 0 }, { x: 20, y: 70, s: 2, d: 1.2 },
  { x: 35, y: 25, s: 4, d: 0.6 }, { x: 50, y: 80, s: 2.5, d: 2 },
  { x: 65, y: 10, s: 3.5, d: 0.3 }, { x: 75, y: 55, s: 2, d: 1.8 },
  { x: 85, y: 30, s: 4, d: 0.9 }, { x: 92, y: 75, s: 2.5, d: 0.5 },
  { x: 5, y: 45, s: 2, d: 1.5 }, { x: 28, y: 50, s: 3, d: 2.2 },
  { x: 45, y: 35, s: 2, d: 0.7 }, { x: 58, y: 65, s: 3.5, d: 1.1 },
  { x: 70, y: 85, s: 2, d: 1.9 }, { x: 80, y: 15, s: 3, d: 0.4 },
  { x: 15, y: 85, s: 2.5, d: 2.5 }, { x: 42, y: 60, s: 2, d: 0.8 },
]

export default function BannerParticleElement({
  heading = 'Particles of Innovation',
  subtext = 'Every pixel has purpose. Every moment, an opportunity to connect.',
  cta = 'Join the Movement',
  ctaHref = '#',
  style,
}: Props) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 400,
        background: 'linear-gradient(135deg, #0c0c1d 0%, #111128 50%, #0a0a1a 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 48px',
        ...style,
      }}
    >
      {/* Connecting lines (SVG) */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.15 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        {PARTICLES.slice(0, 8).map((p, i) => {
          const next = PARTICLES[(i + 3) % PARTICLES.length]
          return <line key={i} x1={p.x} y1={p.y} x2={next.x} y2={next.y} stroke="#6366f1" strokeWidth="0.3" />
        })}
        {PARTICLES.slice(4, 12).map((p, i) => {
          const next = PARTICLES[(i + 5) % PARTICLES.length]
          return <line key={`b${i}`} x1={p.x} y1={p.y} x2={next.x} y2={next.y} stroke="#8b5cf6" strokeWidth="0.25" />
        })}
      </svg>

      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.s, height: p.s, borderRadius: '50%',
          background: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4',
          boxShadow: `0 0 ${p.s * 4}px ${i % 3 === 0 ? 'rgba(99,102,241,0.8)' : i % 3 === 1 ? 'rgba(139,92,246,0.8)' : 'rgba(6,182,212,0.8)'}`,
          pointerEvents: 'none',
          animation: `bp-float ${5 + p.d}s ease-in-out infinite ${p.d}s`,
        }} />
      ))}

      {/* Central glow */}
      <div style={{
        position: 'absolute', width: 400, height: 300,
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        pointerEvents: 'none',
      }} />

      {/* 3D perspective ring */}
      <div style={{
        position: 'absolute', width: 300, height: 300,
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: '50%',
        top: '50%', left: '50%', transform: 'translate(-50%,-50%) perspective(600px) rotateX(70deg)',
        pointerEvents: 'none',
        animation: 'bp-float-slow 16s linear infinite',
      }} />
      <div style={{
        position: 'absolute', width: 200, height: 200,
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '50%',
        top: '50%', left: '50%', transform: 'translate(-50%,-50%) perspective(600px) rotateX(70deg)',
        pointerEvents: 'none',
        animation: 'bp-float-slow 10s linear infinite reverse',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 640 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 16px', borderRadius: 20,
          background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
          color: '#818cf8', textTransform: 'uppercase', marginBottom: 24,
          animation: 'bp-fade-in 0.6s ease both',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px rgba(99,102,241,0.9)' }} />
          Live Network
        </div>
        <h1 style={{
          color: '#ffffff', fontSize: '50px', fontWeight: 900, lineHeight: 1.1,
          margin: '0 0 20px',
          background: 'linear-gradient(135deg, #c7d2fe 0%, #fff 40%, #a5f3fc 80%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'bp-fade-up 0.7s ease 0.15s both',
        }}>
          {heading}
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.55)', fontSize: '17px', lineHeight: 1.7,
          margin: '0 0 36px',
          animation: 'bp-fade-up 0.7s ease 0.3s both',
        }}>
          {subtext}
        </p>
        <a href={ctaHref} style={{
          display: 'inline-block', padding: '14px 38px', borderRadius: 50,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
          animation: 'bp-fade-up 0.7s ease 0.45s both',
        }}>
          {cta}
        </a>
      </div>
    </div>
  )
}
