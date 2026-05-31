import { memo } from 'react'
import type { ObjectFit } from '@/types/builder.types'

interface Props {
  src: string
  alt: string
  objectFit: ObjectFit
  style?: React.CSSProperties
}

const ImageElement = memo(function ImageElement({ src, alt, objectFit, style }: Props) {
  if (!src) {
    return (
      <div
        style={{
          width: '100%',
          height: '160px',
          backgroundColor: 'var(--color-border)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.875rem',
          ...style,
        }}
      >
        No image selected
      </div>
    )
  }

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
