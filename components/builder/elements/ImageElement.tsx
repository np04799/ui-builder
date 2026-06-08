import { memo } from 'react'
import type { ObjectFit } from '@/types/builder.types'
import { useFramework } from '@/hooks/useFramework'

interface Props { src: string; alt: string; objectFit: ObjectFit; style?: React.CSSProperties }

const ImageElement = memo(function ImageElement({ src, alt, objectFit, style }: Props) {
  const framework = useFramework()

  if (!src) {
    const placeholder = (
      <div style={{ width: '100%', height: 160, backgroundColor: 'var(--color-border)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem', ...style }}>
        No image selected
      </div>
    )
    if (framework === 'bootstrap') return <div className="bg-light rounded d-flex align-items-center justify-content-center text-secondary small" style={{ width: '100%', height: 160, ...style }}>No image selected</div>
    if (framework === 'tailwind') return <div className="w-full bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm" style={{ height: 160, ...style }}>No image selected</div>
    return placeholder
  }

  if (framework === 'bootstrap') {
    return <img src={src} alt={alt} className="img-fluid rounded" style={{ objectFit, width: '100%', display: 'block', ...style }} />
  }
  if (framework === 'tailwind') {
    return <img src={src} alt={alt} className="w-full h-auto rounded" style={{ objectFit, display: 'block', ...style }} />
  }
  // eslint-disable-next-line @next/next/no-img-element
  if (framework === 'mui') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className="MuiCardMedia-root" style={{ objectFit, width: '100%', display: 'block', borderRadius: 4, ...style }} />
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} style={{ width: '100%', height: 'auto', objectFit, borderRadius: 4, display: 'block', ...style }} />
})

export default ImageElement
