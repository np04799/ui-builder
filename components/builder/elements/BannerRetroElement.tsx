'use client'

interface Props {
  heading?: string
  subtext?: string
  cta?: string
  ctaHref?: string
  style?: React.CSSProperties
}

export default function BannerRetroElement({
  heading = 'Retro Wave',
  subtext = 'Synthwave aesthetics for the digital age. Bold stripes, bold vision.',
  cta = 'Ride the Wave',
  ctaHref = '#',
  style,
}: Props) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 400,
        background: 'linear-gradient(180deg, #0d001a 0%, #1a0035 45%, #2d0060 100%)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px 80px',
        ...style,
      }}
    >
      {/* Retro sun */}
      <div style={{
        position: 'absolute', bottom: '25%', left: '50%', transform: 'translateX(-50%)',
        width: 220, height: 110,
        background: 'linear-gradient(180deg, #ff6b35 0%, #ff4da6 40%, #c837ab 100%)',
        borderRadius: '110px 110px 0 0',
        overflow: 'hidden', pointerEvents: 'none',
        boxShadow: '0 0 60px rgba(255,107,53,0.5), 0 0 120px rgba(200,55,171,0.3)',
      }}>
        {[0.25, 0.42, 0.56, 0.68, 0.79, 0.88, 0.94].map((t, i) => (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0,
            top: `${t * 100}%`, height: '5px',
            background: 'linear-gradient(180deg, #1a0035, transparent)',
            opacity: 1 - i * 0.07,
          }} />
        ))}
      </div>

      {/* Perspective grid floor */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '200%', height: '40%', pointerEvents: 'none',
        background: 'transparent',
        borderTop: '1px solid rgba(255,107,200,0.5)',
        overflow: 'hidden',
      }}>
        {/* Horizontal lines */}
        {[8, 18, 30, 44, 62, 85].map((t, i) => (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0, top: `${t}%`,
            height: 1, background: `rgba(255,107,200,${0.5 - i * 0.06})`,
          }} />
        ))}
        {/* Vertical lines with perspective */}
        {[-3, -2.2, -1.5, -0.8, -0.2, 0.2, 0.8, 1.5, 2.2, 3].map((offset, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `calc(50% + ${offset * 10}%)`,
            width: 1,
            background: `rgba(255,107,200,${0.4 - Math.abs(offset) * 0.08})`,
            transform: `skewX(${offset * 12}deg)`,
          }} />
        ))}
      </div>

      {/* Chrome text shadow layer */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(255,100,200,0.08) 0%, transparent 70%)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 680 }}>
        <div style={{
          fontSize: '11px', fontWeight: 800, letterSpacing: '0.22em', color: '#ff6bff',
          textTransform: 'uppercase', marginBottom: 16,
          textShadow: '0 0 10px rgba(255,107,255,0.8)',
          animation: 'bp-fade-in 0.6s ease both',
        }}>
          ◈ SYNTHWAVE ◈
        </div>
        <h1 style={{
          fontSize: '64px', fontWeight: 900, lineHeight: 1,
          margin: '0 0 6px',
          background: 'linear-gradient(180deg, #ffffff 0%, #ff9de2 40%, #ff4da6 80%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          textShadow: 'none',
          letterSpacing: '-0.02em',
          animation: 'bp-fade-up 0.7s ease 0.15s both',
        }}>
          {heading}
        </h1>
        <div style={{
          fontSize: '14px', fontWeight: 800, letterSpacing: '0.3em', color: '#c837ab',
          textTransform: 'uppercase', marginBottom: 24,
          textShadow: '0 0 15px rgba(200,55,171,0.7)',
          animation: 'bp-fade-up 0.6s ease 0.2s both',
        }}>
          2 0 8 5
        </div>
        <p style={{
          color: 'rgba(255,200,255,0.65)', fontSize: '17px', lineHeight: 1.7,
          margin: '0 0 36px',
          animation: 'bp-fade-up 0.7s ease 0.35s both',
        }}>
          {subtext}
        </p>
        <a href={ctaHref} style={{
          display: 'inline-block', padding: '14px 40px', borderRadius: 4,
          background: 'transparent',
          border: '2px solid #ff4da6',
          color: '#ff4da6', textDecoration: 'none', fontWeight: 800, fontSize: '14px',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          boxShadow: '0 0 20px rgba(255,77,166,0.4), inset 0 0 20px rgba(255,77,166,0.05)',
          textShadow: '0 0 10px rgba(255,77,166,0.6)',
          animation: 'bp-fade-up 0.7s ease 0.5s both',
        }}>
          {cta}
        </a>
      </div>
    </div>
  )
}
