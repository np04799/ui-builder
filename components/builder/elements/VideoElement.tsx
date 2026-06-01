'use client'

import { useFramework } from '@/hooks/useFramework'

interface Props {
  src?: string
  provider?: 'youtube' | 'vimeo'
  style?: React.CSSProperties
}

export default function VideoElement({ src, provider = 'youtube', style }: Props) {
  const framework = useFramework()

  if (!src) {
    const placeholderClass = framework === 'bootstrap'
      ? 'ratio ratio-16x9 bg-dark text-white d-flex align-items-center justify-content-center rounded'
      : framework === 'tailwind'
      ? 'w-full aspect-video bg-gray-900 flex flex-col items-center justify-content-center rounded-lg gap-2'
      : undefined

    return (
      <div
        className={placeholderClass}
        style={placeholderClass ? style : { width: '100%', aspectRatio: '16/9', backgroundColor: '#1a1a2e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 8, gap: 8, ...style }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.08)" />
          <polygon points="16,13 30,20 16,27" fill="rgba(255,255,255,0.7)" />
        </svg>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
          Set video URL in properties
        </span>
      </div>
    )
  }

  let embedSrc = src
  if (provider === 'youtube') {
    const id = src.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1]
    if (id) embedSrc = `https://www.youtube.com/embed/${id}`
  } else if (provider === 'vimeo') {
    const id = src.match(/vimeo\.com\/(\d+)/)?.[1]
    if (id) embedSrc = `https://player.vimeo.com/video/${id}`
  }

  const wrapperClass = framework === 'bootstrap' ? 'ratio ratio-16x9 rounded overflow-hidden' : framework === 'tailwind' ? 'w-full aspect-video rounded-lg overflow-hidden' : undefined

  return (
    <div className={wrapperClass} style={wrapperClass ? style : { width: '100%', aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', ...style }}>
      <iframe
        src={embedSrc}
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
