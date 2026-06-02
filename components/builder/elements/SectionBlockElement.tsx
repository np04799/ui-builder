'use client'

import { memo, createElement } from 'react'
import { useFramework } from '@/hooks/useFramework'

type Preset = 'plain' | 'card' | 'hero' | 'feature' | 'cta'
type Tag = 'section' | 'article' | 'aside' | 'main' | 'header' | 'footer' | 'div'

interface Props {
  preset?: Preset
  tag?: Tag
  heading?: string
  subtitle?: string
  content?: string
  bg?: string
  textColor?: string
  paddingY?: number
  paddingX?: number
  maxWidth?: string
  align?: 'left' | 'center' | 'right'
  showBorder?: boolean
  style?: React.CSSProperties
}

const PRESET_STYLES: Record<Preset, { bg: string; textColor: string; padY: number; padX: number; align: 'left' | 'center'; border: boolean; cardLike: boolean }> = {
  plain: { bg: 'transparent', textColor: 'inherit', padY: 32, padX: 24, align: 'left', border: false, cardLike: false },
  card: { bg: '#ffffff', textColor: '#0f172a', padY: 24, padX: 24, align: 'left', border: true, cardLike: true },
  hero: { bg: 'linear-gradient(135deg, #4f46e5, #06b6d4)', textColor: '#ffffff', padY: 64, padX: 32, align: 'center', border: false, cardLike: false },
  feature: { bg: '#f8fafc', textColor: '#0f172a', padY: 48, padX: 24, align: 'center', border: false, cardLike: false },
  cta: { bg: '#0f172a', textColor: '#ffffff', padY: 56, padX: 32, align: 'center', border: false, cardLike: false },
}

const SectionBlockElement = memo(function SectionBlockElement({
  preset = 'plain',
  tag = 'section',
  heading = 'Section heading',
  subtitle,
  content,
  bg,
  textColor,
  paddingY,
  paddingX,
  maxWidth = '1200px',
  align,
  showBorder,
  style,
}: Props) {
  const framework = useFramework()
  const ps = PRESET_STYLES[preset] ?? PRESET_STYLES.plain
  const resolvedBg = bg ?? ps.bg
  const resolvedColor = textColor ?? ps.textColor
  const resolvedPadY = paddingY ?? ps.padY
  const resolvedPadX = paddingX ?? ps.padX
  const resolvedAlign = align ?? ps.align
  const resolvedBorder = showBorder ?? ps.border

  const innerStyle: React.CSSProperties = {
    maxWidth,
    margin: '0 auto',
    textAlign: resolvedAlign,
  }

  const wrapperStyle: React.CSSProperties = {
    background: resolvedBg,
    color: resolvedColor,
    paddingTop: resolvedPadY,
    paddingBottom: resolvedPadY,
    paddingLeft: resolvedPadX,
    paddingRight: resolvedPadX,
    border: resolvedBorder ? '1px solid rgba(0,0,0,0.08)' : 'none',
    borderRadius: ps.cardLike ? 12 : 0,
    boxShadow: ps.cardLike ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
    width: '100%',
    boxSizing: 'border-box',
    ...style,
  }

  const inner = (
    <div style={innerStyle}>
      {heading && (
        framework === 'bootstrap'
          ? <h2 className="fw-bold mb-2">{heading}</h2>
          : framework === 'tailwind'
            ? <h2 className="text-2xl font-bold mb-2 m-0">{heading}</h2>
            : <h2 style={{ margin: '0 0 8px', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.2 }}>{heading}</h2>
      )}
      {subtitle && (
        framework === 'bootstrap'
          ? <p className="lead mb-3" style={{ opacity: 0.85 }}>{subtitle}</p>
          : framework === 'tailwind'
            ? <p className="text-lg mb-3 m-0" style={{ opacity: 0.85 }}>{subtitle}</p>
            : <p style={{ margin: '0 0 12px', fontSize: '1.125rem', opacity: 0.85 }}>{subtitle}</p>
      )}
      {content && (
        framework === 'bootstrap'
          ? <p className="mb-0" style={{ opacity: 0.9, lineHeight: 1.6 }}>{content}</p>
          : framework === 'tailwind'
            ? <p className="m-0" style={{ opacity: 0.9, lineHeight: 1.6 }}>{content}</p>
            : <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.6 }}>{content}</p>
      )}
    </div>
  )

  return createElement(tag, { style: wrapperStyle }, inner)
})

export default SectionBlockElement
