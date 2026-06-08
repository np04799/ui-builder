'use client'

interface Props {
  heading?: string
  subtext?: string
  cta?: string
  ctaHref?: string
  ctaSecondary?: string
  stats?: { value: string; label: string }[]
  style?: React.CSSProperties
}

const DEFAULT_STATS = [
  { value: '50K+', label: 'Active users' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '2.4s', label: 'Avg load time' },
]

export default function BannerSplitElement({
  heading = 'Ship Beautiful Products, Faster',
  subtext = 'The visual builder that replaces your whole frontend workflow — from wireframe to production in hours.',
  cta = 'Start building free',
  ctaHref = '#',
  ctaSecondary = 'Watch demo',
  stats = DEFAULT_STATS,
  style,
}: Props) {
  return (
    <div style={{
      display: 'flex', width: '100%', minHeight: 420,
      background: 'linear-gradient(160deg, #f8faff 0%, #eef2ff 100%)',
      overflow: 'hidden',
      position: 'relative',
      ...style,
    }}>
      {/* Left — copy */}
      <div style={{
        flex: '0 0 52%', padding: '72px 56px',
        display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'center',
        position: 'relative', zIndex: 1,
      }}>
        <h1 style={{
          fontSize: '46px', fontWeight: 900, lineHeight: 1.1,
          color: 'var(--color-text-primary)', margin: 0, letterSpacing: '-0.025em',
          animation: 'bp-slide-right 0.8s ease both',
        }}>
          {heading}
        </h1>

        <p style={{
          fontSize: '17px', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0,
          animation: 'bp-slide-right 0.8s ease 0.15s both',
        }}>
          {subtext}
        </p>

        {/* CTA row */}
        <div style={{
          display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
          animation: 'bp-fade-up 0.7s ease 0.3s both',
        }}>
          <a href={ctaHref} style={{
            display: 'inline-block', padding: '13px 28px', borderRadius: 10,
            background: 'var(--color-primary)', color: '#fff',
            textDecoration: 'none', fontWeight: 700, fontSize: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}>
            {cta}
          </a>
          <a href="#" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '15px',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: '50%',
              background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              fontSize: '12px',
            }}>▶</span>
            {ctaSecondary}
          </a>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 32, paddingTop: 16,
          borderTop: '1px solid var(--color-border)',
          animation: 'bp-fade-in 1s ease 0.5s both',
        }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — 3D card stack visual */}
      <div style={{
        flex: '0 0 48%', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background accent */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          animation: 'bp-float-slow 10s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Card stack - 3D perspective */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          {/* Back card */}
          <div style={{
            position: 'absolute',
            width: 240, height: 150,
            background: 'linear-gradient(135deg, #c7d2fe, #e0e7ff)',
            borderRadius: 16,
            transform: 'perspective(800px) rotateX(12deg) rotateY(-20deg) translateZ(-30px) translate(-20px, 20px)',
            boxShadow: '0 20px 60px rgba(99,102,241,0.15)',
            animation: 'bp-float 8s ease-in-out infinite 2s',
          }} />
          {/* Middle card */}
          <div style={{
            position: 'absolute',
            width: 240, height: 150,
            background: 'linear-gradient(135deg, #ddd6fe, #c7d2fe)',
            borderRadius: 16,
            transform: 'perspective(800px) rotateX(10deg) rotateY(-16deg) translateZ(-15px) translate(-10px, 10px)',
            boxShadow: '0 20px 50px rgba(99,102,241,0.2)',
            animation: 'bp-float 7s ease-in-out infinite 1s',
          }} />
          {/* Front card */}
          <div style={{
            position: 'relative',
            width: 240, height: 150,
            background: 'linear-gradient(135deg, var(--color-primary), #7c3aed)',
            borderRadius: 16,
            transform: 'perspective(800px) rotateX(8deg) rotateY(-12deg)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            animation: 'bp-float 6s ease-in-out infinite',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            padding: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 24, borderRadius: 4, background: 'rgba(255,255,255,0.2)' }} />
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />)}
              </div>
            </div>
            <div>
              <div style={{ height: 5, width: 80, background: 'rgba(255,255,255,0.5)', borderRadius: 3, marginBottom: 6 }} />
              <div style={{ height: 4, width: 120, background: 'rgba(255,255,255,0.3)', borderRadius: 3 }} />
            </div>
          </div>
        </div>

        {/* Floating mini badges */}
        <div style={{
          position: 'absolute', top: '22%', right: '12%',
          padding: '8px 14px', borderRadius: 30,
          background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          fontSize: '12px', fontWeight: 600, color: '#16a34a',
          display: 'flex', alignItems: 'center', gap: 6,
          animation: 'bp-bounce-in 0.6s ease 0.8s both, bp-float 5s ease-in-out 1.5s infinite',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          Deploy success
        </div>
        <div style={{
          position: 'absolute', bottom: '24%', left: '8%',
          padding: '8px 14px', borderRadius: 30,
          background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)',
          animation: 'bp-bounce-in 0.6s ease 1.1s both, bp-float 7s ease-in-out 2s infinite',
          whiteSpace: 'nowrap',
        }}>
          ✦ 10× faster
        </div>
      </div>
    </div>
  )
}
