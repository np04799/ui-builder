'use client'

import { useFramework } from '@/hooks/useFramework'

interface Props { src?: string; provider?: 'youtube' | 'vimeo'; style?: React.CSSProperties }

export default function VideoElement({ src, provider = 'youtube', style }: Props) {
  const framework = useFramework()

  const placeholder = (fw: string) => {
    if (fw === 'bootstrap') return (
      <div className="ratio ratio-16x9 bg-dark rounded d-flex align-items-center justify-content-center" style={style}>
        <div className="text-center text-secondary"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.08)" /><polygon points="16,13 30,20 16,27" fill="rgba(255,255,255,0.5)" /></svg><p className="mt-2 small">Set video URL in properties</p></div>
      </div>
    )
    if (fw === 'tailwind') return (
      <div className="relative w-full bg-gray-900 rounded-xl flex flex-col items-center justify-center" style={{ aspectRatio: '16/9', ...style }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.08)" /><polygon points="16,13 30,20 16,27" fill="rgba(255,255,255,0.5)" /></svg>
        <p className="mt-2 text-sm text-gray-400">Set video URL in properties</p>
      </div>
    )
    return (
      <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#1a1a2e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 8, gap: 8, ...style }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.08)" /><polygon points="16,13 30,20 16,27" fill="rgba(255,255,255,0.7)" /></svg>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Set video URL in properties</span>
      </div>
    )
  }

  if (!src) return placeholder(framework)

  let embedSrc = src
  if (provider === 'youtube') { const id = src.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1]; if (id) embedSrc = `https://www.youtube.com/embed/${id}` }
  else if (provider === 'vimeo') { const id = src.match(/vimeo\.com\/(\d+)/)?.[1]; if (id) embedSrc = `https://player.vimeo.com/video/${id}` }

  if (framework === 'bootstrap') {
    return (
      <div className="ratio ratio-16x9 rounded overflow-hidden" style={style}>
        <iframe src={embedSrc} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    )
  }
  if (framework === 'tailwind') {
    return (
      <div className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9', ...style }}>
        <iframe src={embedSrc} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    )
  }
  // MUI / Custom — same layout
  return (
    <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', ...style }}>
      <iframe src={embedSrc} style={{ width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    </div>
  )
}
