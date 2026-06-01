'use client'

import { memo, useState, useEffect, useCallback, useId } from 'react'
import { useFramework } from '@/hooks/useFramework'

interface Slide { id: string; image: string; heading?: string; caption?: string }

interface Props {
  slides?: Slide[]
  autoplay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
  aspectRatio?: '16/9' | '4/3' | '1/1'
  style?: React.CSSProperties
}

function aspectPadding(r: string) { return r === '4/3' ? '75%' : r === '1/1' ? '100%' : '56.25%' }

function CarouselElement({ slides = [], autoplay = false, interval = 4, showDots = true, showArrows = true, aspectRatio = '16/9', style }: Props) {
  const uid = useId().replace(/:/g, '')
  const framework = useFramework()
  const [current, setCurrent] = useState(0)
  const count = slides.length
  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count])
  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count])

  useEffect(() => {
    if (!autoplay || count < 2) return
    const id = setInterval(next, (interval ?? 4) * 1000)
    return () => clearInterval(id)
  }, [autoplay, interval, count, next])

  if (count === 0) {
    return (
      <div style={{ width: '100%', paddingTop: aspectPadding(aspectRatio ?? '16/9'), backgroundColor: '#e5e7eb', borderRadius: 10, position: 'relative', overflow: 'hidden', ...style }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>No slides added</div>
      </div>
    )
  }

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    return (
      <div id={`carousel-${uid}`} className="carousel slide" data-bs-ride={autoplay ? 'carousel' : undefined} data-bs-interval={autoplay ? interval * 1000 : undefined} style={style}>
        {showDots && count > 1 && (
          <div className="carousel-indicators">
            {slides.map((_, idx) => (
              <button key={idx} type="button" onClick={() => setCurrent(idx)} className={idx === current ? 'active' : ''} aria-current={idx === current} aria-label={`Slide ${idx + 1}`} />
            ))}
          </div>
        )}
        <div className="carousel-inner" style={{ aspectRatio: aspectRatio?.replace('/', '/') }}>
          {slides.map((slide, idx) => (
            <div key={slide.id} className={`carousel-item${idx === current ? ' active' : ''}`}>
              {slide.image
                ? <img src={slide.image} className="d-block w-100" alt={slide.heading ?? `Slide ${idx + 1}`} style={{ objectFit: 'cover', aspectRatio: aspectRatio?.replace('/', '/') }} />
                : <div className="d-flex align-items-center justify-content-center bg-secondary text-white" style={{ aspectRatio: aspectRatio?.replace('/', '/') }}>
                    <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="4" /><circle cx="14" cy="14" r="4" /><path d="M4 28l8-8 6 6 5-5 13 13" /></svg>
                  </div>
              }
              {(slide.heading || slide.caption) && (
                <div className="carousel-caption d-none d-md-block">
                  {slide.heading && <h5>{slide.heading}</h5>}
                  {slide.caption && <p>{slide.caption}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
        {showArrows && count > 1 && (
          <>
            <button className="carousel-control-prev" type="button" onClick={prev}><span className="carousel-control-prev-icon" /><span className="visually-hidden">Previous</span></button>
            <button className="carousel-control-next" type="button" onClick={next}><span className="carousel-control-next-icon" /><span className="visually-hidden">Next</span></button>
          </>
        )}
      </div>
    )
  }

  // ── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    const slide = slides[current]
    return (
      <div className="relative w-full overflow-hidden rounded-xl" style={style}>
        <div className="relative w-full" style={{ paddingTop: aspectPadding(aspectRatio ?? '16/9') }}>
          {slide.image
            ? <img src={slide.image} alt={slide.heading ?? ''} className="absolute inset-0 w-full h-full object-cover" />
            : <div className="absolute inset-0 bg-gray-700 flex items-center justify-center"><svg width="48" height="48" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="4" /><circle cx="14" cy="14" r="4" /><path d="M4 28l8-8 6 6 5-5 13 13" /></svg></div>
          }
          {(slide.heading || slide.caption) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-4 pt-8">
              {slide.heading && <p className="font-bold text-white mb-1">{slide.heading}</p>}
              {slide.caption && <p className="text-sm text-white/80 m-0">{slide.caption}</p>}
            </div>
          )}
          {showArrows && count > 1 && (
            <>
              <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow"><svg width="16" height="16" fill="none" stroke="#374151" strokeWidth="2"><path d="M10 4L6 8l4 4" /></svg></button>
              <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow"><svg width="16" height="16" fill="none" stroke="#374151" strokeWidth="2"><path d="M6 4l4 4-4 4" /></svg></button>
            </>
          )}
        </div>
        {showDots && count > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {slides.map((_, idx) => <button key={idx} onClick={() => setCurrent(idx)} className={`h-2 rounded-full transition-all ${idx === current ? 'bg-indigo-600 w-5' : 'bg-gray-300 w-2'}`} />)}
          </div>
        )}
      </div>
    )
  }

  // ── Custom / MUI ───────────────────────────────────────────────────────────
  const slide = slides[current]
  return (
    <div style={{ position: 'relative', width: '100%', fontFamily: 'inherit', ...style }}>
      <div style={{ position: 'relative', width: '100%', paddingTop: aspectPadding(aspectRatio ?? '16/9'), borderRadius: 10, overflow: 'hidden', backgroundColor: '#1f2937' }}>
        {slide.image
          ? <img src={slide.image} alt={slide.heading ?? ''} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#374151' }}><svg width="48" height="48" fill="none" stroke="#6b7280" strokeWidth="1.5" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="4" /><circle cx="14" cy="14" r="4" /><path d="M4 28l8-8 6 6 5-5 13 13" /></svg></div>
        }
        {(slide.heading || slide.caption) && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.65))', padding: '32px 20px 16px' }}>
            {slide.heading && <p style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{slide.heading}</p>}
            {slide.caption && <p style={{ margin: 0, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)' }}>{slide.caption}</p>}
          </div>
        )}
        {showArrows && count > 1 && (
          <>
            <button onClick={prev} aria-label="Previous" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255,255,255,0.85)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="16" height="16" fill="none" stroke="#374151" strokeWidth="2"><path d="M10 4L6 8l4 4" /></svg></button>
            <button onClick={next} aria-label="Next" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255,255,255,0.85)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="16" height="16" fill="none" stroke="#374151" strokeWidth="2"><path d="M6 4l4 4-4 4" /></svg></button>
          </>
        )}
      </div>
      {showDots && count > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
          {slides.map((_, idx) => <button key={idx} onClick={() => setCurrent(idx)} style={{ width: idx === current ? 20 : 8, height: 8, borderRadius: 999, border: 'none', cursor: 'pointer', backgroundColor: idx === current ? 'var(--color-primary)' : 'var(--color-border)', padding: 0, transition: 'width 200ms, background-color 200ms' }} />)}
        </div>
      )}
    </div>
  )
}

export default memo(CarouselElement)
