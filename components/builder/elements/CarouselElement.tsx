'use client'

import { memo, useState, useEffect, useCallback } from 'react'
import { useFramework } from '@/hooks/useFramework'

interface Slide {
  id: string
  image: string
  heading?: string
  caption?: string
}

interface Props {
  slides?: Slide[]
  autoplay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
  aspectRatio?: '16/9' | '4/3' | '1/1'
  style?: React.CSSProperties
}

function aspectPadding(ratio: string): string {
  if (ratio === '4/3') return '75%'
  if (ratio === '1/1') return '100%'
  return '56.25%' // 16/9
}

function CarouselElement({
  slides = [],
  autoplay = false,
  interval = 4,
  showDots = true,
  showArrows = true,
  aspectRatio = '16/9',
  style,
}: Props) {
  const [current, setCurrent] = useState(0)
  const framework = useFramework()
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
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: aspectPadding(aspectRatio ?? '16/9'),
          backgroundColor: '#e5e7eb',
          borderRadius: 10,
          overflow: 'hidden',
          ...style,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
            fontSize: '0.875rem',
          }}
        >
          No slides added
        </div>
      </div>
    )
  }

  const slide = slides[current]

  // Bootstrap/Tailwind: add framework wrapper class
  const outerClass = framework === 'bootstrap' ? 'position-relative w-100' : framework === 'tailwind' ? 'relative w-full' : undefined

  return (
    <div className={outerClass} style={{ position: 'relative', width: '100%', fontFamily: 'inherit', ...style }}>
      {/* Track */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: aspectPadding(aspectRatio ?? '16/9'),
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: '#1f2937',
        }}
      >
        {slide.image ? (
          <img
            src={slide.image}
            alt={slide.heading ?? ''}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'opacity 400ms ease',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#374151',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" stroke="#6b7280" strokeWidth="1.5">
              <rect x="4" y="4" width="32" height="32" rx="4" />
              <circle cx="14" cy="14" r="4" />
              <path d="M4 28l8-8 6 6 5-5 13 13" />
            </svg>
          </div>
        )}

        {/* Caption overlay */}
        {(slide.heading || slide.caption) && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
              padding: '32px 20px 16px',
            }}
          >
            {slide.heading && (
              <p style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                {slide.heading}
              </p>
            )}
            {slide.caption && (
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)' }}>
                {slide.caption}
              </p>
            )}
          </div>
        )}

        {/* Arrows */}
        {showArrows && count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.85)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
                <path d="M10 4L6 8l4 4" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.85)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
                <path d="M6 4l4 4-4 4" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {showDots && count > 1 && (
        <div
          className={framework === 'tailwind' ? 'flex justify-center gap-1.5 mt-2.5' : undefined}
          style={framework === 'tailwind' ? undefined : { display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={framework === 'bootstrap' ? `btn btn-sm p-0 rounded-pill${idx === current ? ' bg-primary' : ' bg-secondary opacity-50'}` : undefined}
              style={{
                width: idx === current ? 20 : 8,
                height: 8,
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: framework === 'bootstrap' ? undefined : idx === current ? 'var(--color-primary)' : 'var(--color-border)',
                padding: 0,
                transition: 'width 200ms, background-color 200ms',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default memo(CarouselElement)
