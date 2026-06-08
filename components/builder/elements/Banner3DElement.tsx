'use client'

interface Props {
  heading?: string
  subtext?: string
  cta?: string
  ctaHref?: string
  style?: React.CSSProperties
}

export default function Banner3DElement({
  heading = 'Next-Gen Platform',
  subtext = 'Built for speed. Designed for scale.',
  cta = 'Get Started',
  ctaHref = '#',
  style,
}: Props) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 380,
        background: 'linear-gradient(135deg, #0a0a1a 0%, #12003a 50%, #0d1b3e 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 48px',
        ...style,
      }}
    >
      {/* 3D rotating background orbs */}
      <div style={{
        position: 'absolute', width: 420, height: 420, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
        top: '-120px', left: '-100px',
        animation: 'bp-float-slow 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
        bottom: '-80px', right: '-60px',
        animation: 'bp-float 10s ease-in-out infinite 2s',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)',
        top: '30%', right: '15%',
        animation: 'bp-float 6s ease-in-out infinite 1s',
        pointerEvents: 'none',
      }} />

      {/* 3D floating card illusion */}
      <div style={{
        position: 'absolute', top: 40, right: 80, width: 120, height: 80,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12,
        backdropFilter: 'blur(8px)',
        transform: 'perspective(600px) rotateX(12deg) rotateY(-18deg)',
        animation: 'bp-float 7s ease-in-out infinite',
        boxShadow: '0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 60, left: 80, width: 90, height: 60,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1))',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 10,
        transform: 'perspective(600px) rotateX(-8deg) rotateY(22deg)',
        animation: 'bp-float-slow 9s ease-in-out infinite 3s',
        boxShadow: '0 16px 40px rgba(99,102,241,0.2)',
        pointerEvents: 'none',
      }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 600 }}>
        <div style={{
          display: 'inline-block', padding: '4px 14px', borderRadius: 20,
          background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a5b4fc',
          textTransform: 'uppercase', marginBottom: 20,
          animation: 'bp-fade-in 0.6s ease both',
        }}>
          New Release
        </div>
        <h1 style={{
          color: '#ffffff', fontSize: '52px', fontWeight: 900, lineHeight: 1.1,
          margin: '0 0 20px',
          background: 'linear-gradient(135deg, #fff 40%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'bp-fade-up 0.7s ease 0.1s both',
        }}>
          {heading}
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.65)', fontSize: '18px', lineHeight: 1.65,
          margin: '0 0 36px',
          animation: 'bp-fade-up 0.7s ease 0.25s both',
        }}>
          {subtext}
        </p>
        <a
          href={ctaHref}
          style={{
            display: 'inline-block', padding: '14px 36px', borderRadius: 50,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px',
            animation: 'bp-fade-up 0.7s ease 0.4s both, bp-pulse-glow 3s ease-in-out 1.5s infinite',
            boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
          }}
        >
          {cta}
        </a>
      </div>
    </div>
  )
}
