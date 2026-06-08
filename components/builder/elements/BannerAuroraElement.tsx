'use client'

interface Props {
  heading?: string
  subtext?: string
  badge?: string
  cta?: string
  ctaHref?: string
  style?: React.CSSProperties
}

export default function BannerAuroraElement({
  heading = 'Where Ideas Come Alive',
  subtext = 'Aurora-lit creativity, infinite possibilities, zero compromise.',
  badge = 'New Era',
  cta = 'Begin Your Journey',
  ctaHref = '#',
  style,
}: Props) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 420,
        background: 'linear-gradient(180deg, #020818 0%, #060d24 60%, #050d1e 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 48px',
        ...style,
      }}
    >
      {/* Aurora curtains */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 120% 60% at 20% 0%, rgba(0,200,150,0.22) 0%, transparent 60%),
          radial-gradient(ellipse 100% 50% at 80% 0%, rgba(100,60,220,0.25) 0%, transparent 55%),
          radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0,150,255,0.18) 0%, transparent 50%)
        `,
        animation: 'bp-float-slow 14s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 90% 40% at 30% 10%, rgba(0,255,180,0.12) 0%, transparent 50%),
          radial-gradient(ellipse 110% 45% at 70% 5%, rgba(180,50,255,0.15) 0%, transparent 55%)
        `,
        animation: 'bp-float 18s ease-in-out infinite 3s',
      }} />

      {/* Star field */}
      {[
        [8, 12], [15, 30], [25, 8], [40, 20], [55, 15], [70, 25], [85, 10], [92, 35],
        [12, 55], [30, 48], [50, 60], [68, 52], [80, 65], [95, 42], [5, 75], [45, 80],
      ].map(([x, y], i) => (
        <div key={i} style={{
          position: 'absolute', left: `${x}%`, top: `${y}%`,
          width: i % 3 === 0 ? 2 : 1.5, height: i % 3 === 0 ? 2 : 1.5,
          borderRadius: '50%', background: 'rgba(255,255,255,0.7)',
          pointerEvents: 'none',
          animation: `bp-pulse-glow ${2.5 + (i % 3)}s ease-in-out infinite ${i * 0.4}s`,
        }} />
      ))}

      {/* 3D floating orbs */}
      <div style={{
        position: 'absolute', width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, rgba(0,255,180,0.5) 0%, rgba(0,150,255,0.2) 50%, transparent 70%)',
        top: '8%', right: '12%', pointerEvents: 'none',
        animation: 'bp-float 9s ease-in-out infinite',
        boxShadow: '0 0 60px rgba(0,220,170,0.3), inset 0 0 40px rgba(0,180,255,0.15)',
        border: '1px solid rgba(0,255,180,0.2)',
      }} />
      <div style={{
        position: 'absolute', width: 100, height: 100, borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, rgba(180,50,255,0.5) 0%, transparent 70%)',
        bottom: '15%', left: '10%', pointerEvents: 'none',
        animation: 'bp-float-slow 12s ease-in-out infinite 5s',
        boxShadow: '0 0 40px rgba(180,50,255,0.25)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 660 }}>
        <div style={{
          display: 'inline-block', padding: '5px 16px', borderRadius: 20,
          background: 'rgba(0,255,180,0.1)', border: '1px solid rgba(0,255,180,0.3)',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
          color: '#5eead4', textTransform: 'uppercase', marginBottom: 24,
          animation: 'bp-fade-in 0.6s ease both',
        }}>
          ✦ {badge}
        </div>
        <h1 style={{
          color: '#ffffff', fontSize: '54px', fontWeight: 900, lineHeight: 1.08,
          margin: '0 0 20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #5eead4 40%, #a78bfa 80%, #fff 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundSize: '200% auto',
          animation: 'bp-fade-up 0.7s ease 0.15s both',
        }}>
          {heading}
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.55)', fontSize: '18px', lineHeight: 1.7,
          margin: '0 0 40px',
          animation: 'bp-fade-up 0.7s ease 0.3s both',
        }}>
          {subtext}
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', animation: 'bp-fade-up 0.7s ease 0.45s both' }}>
          <a href={ctaHref} style={{
            display: 'inline-block', padding: '15px 40px', borderRadius: 50,
            background: 'linear-gradient(135deg, rgba(0,220,170,0.9), rgba(100,60,220,0.9))',
            color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px',
            boxShadow: '0 8px 32px rgba(0,200,150,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
          }}>
            {cta}
          </a>
          <a href="#" style={{
            display: 'inline-block', padding: '15px 32px', borderRadius: 50,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: 600, fontSize: '15px',
          }}>
            Learn more
          </a>
        </div>
      </div>
    </div>
  )
}
