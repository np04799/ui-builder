'use client'

interface Props {
  heading?: string
  subtext?: string
  cta?: string
  ctaHref?: string
  style?: React.CSSProperties
}

export default function BannerNeonElement({
  heading = 'Glow Different',
  subtext = 'Neon aesthetics for the bold. Stand out from the noise.',
  cta = 'Light It Up',
  ctaHref = '#',
  style,
}: Props) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 400,
        background: '#050510',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 48px',
        ...style,
      }}
    >
      {/* Neon grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,255,200,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,200,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Glow spots */}
      <div style={{
        position: 'absolute', width: 600, height: 200,
        background: 'radial-gradient(ellipse, rgba(0,255,200,0.15) 0%, transparent 70%)',
        bottom: 0, left: '50%', transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(255,0,200,0.12) 0%, transparent 70%)',
        top: '-50px', right: '10%', pointerEvents: 'none',
        animation: 'bp-pulse-glow 4s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(0,150,255,0.15) 0%, transparent 70%)',
        top: '20%', left: '5%', pointerEvents: 'none',
        animation: 'bp-pulse-glow 5s ease-in-out infinite 1.5s',
      }} />

      {/* Neon lines */}
      <div style={{
        position: 'absolute', height: 1, width: '40%',
        background: 'linear-gradient(90deg, transparent, rgba(0,255,200,0.6), transparent)',
        top: '30%', left: 0, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', height: 1, width: '30%',
        background: 'linear-gradient(90deg, transparent, rgba(255,0,200,0.5), transparent)',
        bottom: '25%', right: 0, pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 620 }}>
        <div style={{
          display: 'inline-block', padding: '4px 16px', borderRadius: 4,
          border: '1px solid rgba(0,255,200,0.5)',
          background: 'rgba(0,255,200,0.05)',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em',
          color: '#00ffc8', textTransform: 'uppercase', marginBottom: 24,
          boxShadow: '0 0 12px rgba(0,255,200,0.3), inset 0 0 12px rgba(0,255,200,0.05)',
          animation: 'bp-fade-in 0.6s ease both',
        }}>
          NEON STUDIO
        </div>
        <h1 style={{
          fontSize: '58px', fontWeight: 900, lineHeight: 1.05,
          margin: '0 0 20px',
          color: '#fff',
          textShadow: '0 0 40px rgba(0,255,200,0.5), 0 0 80px rgba(0,255,200,0.25)',
          animation: 'bp-fade-up 0.7s ease 0.15s both',
        }}>
          {heading}
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.55)', fontSize: '17px', lineHeight: 1.7,
          margin: '0 0 40px',
          animation: 'bp-fade-up 0.7s ease 0.3s both',
        }}>
          {subtext}
        </p>
        <a href={ctaHref} style={{
          display: 'inline-block', padding: '14px 40px', borderRadius: 6,
          background: 'transparent',
          border: '1.5px solid rgba(0,255,200,0.7)',
          color: '#00ffc8', textDecoration: 'none', fontWeight: 700, fontSize: '15px',
          letterSpacing: '0.05em',
          boxShadow: '0 0 20px rgba(0,255,200,0.25), inset 0 0 20px rgba(0,255,200,0.05)',
          textShadow: '0 0 10px rgba(0,255,200,0.6)',
          animation: 'bp-fade-up 0.7s ease 0.45s both',
        }}>
          {cta}
        </a>
      </div>
    </div>
  )
}
