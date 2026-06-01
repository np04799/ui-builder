import { memo } from 'react'
import type { ObjectFit } from '@/types/builder.types'
import { useFramework } from '@/hooks/useFramework'

interface Props {
  src: string
  alt: string
  objectFit: ObjectFit
  style?: React.CSSProperties
}

const ImageElement = memo(function ImageElement({ src, alt, objectFit, style }: Props) {
  const framework = useFramework()

  if (!src) {
    const placeholderStyle: React.CSSProperties = {
      width: '100%',
      height: '160px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem',
      ...style,
    }

    if (framework === 'bootstrap') {
      return (
        <div className="bg-light border rounded d-flex align-items-center justify-content-center text-muted" style={{ height: 160, ...style }}>
          No image selected
        </div>
      )
    }
    if (framework === 'tailwind') {
      return (
        <div className="w-full bg-gray-100 border border-gray-200 rounded flex items-center justify-content-center text-gray-400 text-sm" style={{ height: 160, ...style }}>
          No image selected
        </div>
      )
    }

    return (
      <div style={{ backgroundColor: 'var(--color-border)', borderRadius: '4px', color: 'var(--color-text-secondary)', ...placeholderStyle }}>
        No image selected
      </div>
    )
  }

  if (framework === 'bootstrap') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="img-fluid d-block"
        style={{ objectFit, borderRadius: '4px', width: '100%', ...style }}
      />
    )
  }

  if (framework === 'tailwind') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="w-full block rounded"
        style={{ objectFit, ...style }}
      />
    )
  }

  // mui + custom — same img, minor class difference
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{
        width: '100%',
        height: 'auto',
        objectFit,
        borderRadius: '4px',
        display: 'block',
        ...style,
      }}
    />
  )
})

export default ImageElement
