'use client'

import { useFramework } from '@/hooks/useFramework'

interface Props {
  heading?: string
  paragraph?: string
  cta?: { text: string; href: string }
  ctaSecondary?: { text: string; href: string }
  badge?: string
  backgroundImage?: string
  layoutVariant?: 'centered' | 'split-left' | 'split-right' | 'gradient-dark' | 'minimal'
  textAlign?: 'left' | 'center' | 'right'
  style?: React.CSSProperties
}

// ─── Shared CTA buttons ───────────────────────────────────────────────────────

function PrimaryBtn({ text, href, dark }: { text: string; href: string; dark?: boolean }) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '13px 28px',
        borderRadius: 8,
        backgroundColor: dark ? '#fff' : 'var(--color-primary)',
        color: dark ? '#0f172a' : '#fff',
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: '0.9375rem',
        transition: 'opacity 150ms',
        flexShrink: 0,
        letterSpacing: '-0.01em',
      }}
    >
      {text}
    </a>
  )
}

function SecondaryBtn({ text, href, dark }: { text: string; href: string; dark?: boolean }) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '13px 28px',
        borderRadius: 8,
        backgroundColor: 'transparent',
        color: dark ? 'rgba(255,255,255,0.85)' : 'var(--color-text-primary)',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '0.9375rem',
        border: dark ? '1.5px solid rgba(255,255,255,0.3)' : '1.5px solid var(--color-border)',
        transition: 'opacity 150ms',
        flexShrink: 0,
        letterSpacing: '-0.01em',
      }}
    >
      {text}
    </a>
  )
}

function Badge({ text }: { text: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: 999,
      fontSize: '0.75rem',
      fontWeight: 600,
      backgroundColor: 'var(--color-selected, rgba(79,70,229,0.1))',
      color: 'var(--color-primary, #4f46e5)',
      letterSpacing: '0.02em',
      marginBottom: 4,
    }}>
      {text}
    </span>
  )
}

// ─── Placeholder image panel (used when no backgroundImage supplied) ──────────

function ImagePanel({ src, alt = 'Hero image' }: { src?: string; alt?: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 12 }}
      />
    )
  }
  return (
    <div style={{
      width: '100%',
      minHeight: 240,
      borderRadius: 12,
      background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 8,
    }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.4 }}>
        <rect width="48" height="48" rx="12" fill="#6366f1" />
        <path d="M14 34l8-10 6 7 4-5 6 8H14z" fill="white" opacity="0.8" />
        <circle cx="32" cy="18" r="4" fill="white" opacity="0.8" />
      </svg>
      <span style={{ fontSize: '0.75rem', color: '#6366f1', opacity: 0.6, fontWeight: 500 }}>Add image in properties</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout 1 — Centered (default)
// ─────────────────────────────────────────────────────────────────────────────

function LayoutCentered({ heading, paragraph, cta, ctaSecondary, badge, backgroundImage, style }: Props) {
  const hasBg = !!backgroundImage
  return (
    <div style={{
      width: '100%',
      minHeight: 400,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '72px 24px',
      gap: 24,
      backgroundImage: hasBg ? `url(${backgroundImage})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: hasBg ? undefined : '#f0f4ff',
      position: 'relative',
      ...style,
    }}>
      {hasBg && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
      )}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {badge && <Badge text={badge} />}
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, margin: 0, color: hasBg ? '#fff' : 'var(--color-text-primary)', lineHeight: 1.15, letterSpacing: '-0.03em', maxWidth: 720 }}>
          {heading}
        </h1>
        <p style={{ fontSize: '1.125rem', color: hasBg ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)', margin: 0, maxWidth: 560, lineHeight: 1.65 }}>
          {paragraph}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {cta && <PrimaryBtn text={cta.text} href={cta.href} dark={hasBg} />}
          {ctaSecondary && <SecondaryBtn text={ctaSecondary.text} href={ctaSecondary.href} dark={hasBg} />}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout 2 — Split Left (text left, image right)
// ─────────────────────────────────────────────────────────────────────────────

function LayoutSplitLeft({ heading, paragraph, cta, ctaSecondary, badge, backgroundImage, style }: Props) {
  return (
    <div style={{
      width: '100%',
      minHeight: 400,
      display: 'flex',
      alignItems: 'stretch',
      gap: 0,
      overflow: 'hidden',
      backgroundColor: '#fff',
      ...style,
    }}>
      {/* Text half */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '56px 48px 56px 40px',
        gap: 20,
        backgroundColor: 'inherit',
      }}>
        {badge && <Badge text={badge} />}
        <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)', lineHeight: 1.18, letterSpacing: '-0.03em' }}>
          {heading}
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: 480, lineHeight: 1.65 }}>
          {paragraph}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {cta && <PrimaryBtn text={cta.text} href={cta.href} />}
          {ctaSecondary && <SecondaryBtn text={ctaSecondary.text} href={ctaSecondary.href} />}
        </div>
      </div>

      {/* Image half */}
      <div style={{ flex: '0 0 50%', minHeight: 320, overflow: 'hidden' }}>
        <ImagePanel src={backgroundImage} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout 3 — Split Right (image left, text right)
// ─────────────────────────────────────────────────────────────────────────────

function LayoutSplitRight({ heading, paragraph, cta, ctaSecondary, badge, backgroundImage, style }: Props) {
  return (
    <div style={{
      width: '100%',
      minHeight: 400,
      display: 'flex',
      alignItems: 'stretch',
      overflow: 'hidden',
      backgroundColor: '#f8fafc',
      ...style,
    }}>
      {/* Image half */}
      <div style={{ flex: '0 0 50%', minHeight: 320, overflow: 'hidden' }}>
        <ImagePanel src={backgroundImage} />
      </div>

      {/* Text half */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '56px 40px 56px 48px',
        gap: 20,
      }}>
        {badge && <Badge text={badge} />}
        <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)', lineHeight: 1.18, letterSpacing: '-0.03em' }}>
          {heading}
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: 480, lineHeight: 1.65 }}>
          {paragraph}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {cta && <PrimaryBtn text={cta.text} href={cta.href} />}
          {ctaSecondary && <SecondaryBtn text={ctaSecondary.text} href={ctaSecondary.href} />}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout 4 — Gradient Dark
// ─────────────────────────────────────────────────────────────────────────────

function LayoutGradientDark({ heading, paragraph, cta, ctaSecondary, badge, style }: Props) {
  return (
    <div style={{
      width: '100%',
      minHeight: 440,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '80px 24px',
      gap: 24,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Decorative glow blobs */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {badge && (
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 14px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)', letterSpacing: '0.04em' }}>
            {badge}
          </span>
        )}
        <h1 style={{ fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)', fontWeight: 800, margin: 0, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.04em', maxWidth: 760 }}>
          {heading}
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: 540, lineHeight: 1.65 }}>
          {paragraph}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {cta && <PrimaryBtn text={cta.text} href={cta.href} dark />}
          {ctaSecondary && <SecondaryBtn text={ctaSecondary.text} href={ctaSecondary.href} dark />}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout 5 — Minimal (clean white, left-aligned, badge above)
// ─────────────────────────────────────────────────────────────────────────────

function LayoutMinimal({ heading, paragraph, cta, ctaSecondary, badge, style }: Props) {
  return (
    <div style={{
      width: '100%',
      minHeight: 320,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '64px 40px',
      gap: 20,
      backgroundColor: '#fff',
      borderLeft: '4px solid var(--color-primary, #4f46e5)',
      ...style,
    }}>
      {badge && <Badge text={badge} />}
      <h1 style={{ fontSize: 'clamp(1.875rem, 4vw, 3rem)', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)', lineHeight: 1.15, letterSpacing: '-0.03em', maxWidth: 680 }}>
        {heading}
      </h1>
      <p style={{ fontSize: '1.0625rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: 520, lineHeight: 1.7 }}>
        {paragraph}
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {cta && <PrimaryBtn text={cta.text} href={cta.href} />}
        {ctaSecondary && (
          <a href={ctaSecondary.href} style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {ctaSecondary.text}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 7h8M8 4l3 3-3 3" /></svg>
          </a>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main HeroElement
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroElement({
  heading = 'Welcome to Our Site',
  paragraph = 'Build something amazing with BuilderPro.',
  cta = { text: 'Get Started', href: '#' },
  ctaSecondary,
  badge,
  backgroundImage,
  layoutVariant = 'centered',
  style,
}: Props) {
  const framework = useFramework()

  // ─── Bootstrap ────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    const isSplit = layoutVariant === 'split-left' || layoutVariant === 'split-right'
    const isDark = layoutVariant === 'gradient-dark'
    // For split/gradient-dark/minimal — don't let preset backgroundColor bleed onto layout bg
    const { backgroundColor: _presetBg, color: _presetColor, ...styleRest } = style ?? {}
    const heroBg = isDark ? '#0f172a' : (layoutVariant === 'centered' && (_presetBg ?? backgroundImage)) ? (_presetBg ?? undefined) : layoutVariant === 'centered' ? '#e9ecef' : undefined
    const heroColor = isDark ? '#fff' : undefined

    if (isSplit) {
      const textFirst = layoutVariant === 'split-left'
      const textPanel = (
        <div style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', gap: 16, backgroundColor: '#fff' }}>
          {badge && <span className="badge bg-primary mb-1 align-self-start">{badge}</span>}
          <h1 className="display-6 fw-bold" style={{ margin: 0 }}>{heading}</h1>
          <p className="fs-5" style={{ margin: 0, color: 'rgba(0,0,0,0.6)' }}>{paragraph}</p>
          <div className="d-flex gap-2 flex-wrap">
            <a href={cta.href} className="btn btn-primary btn-lg">{cta.text}</a>
            {ctaSecondary && <a href={ctaSecondary.href} className="btn btn-outline-secondary btn-lg">{ctaSecondary.text}</a>}
          </div>
        </div>
      )
      const imgPanel = (
        <div style={{ flex: '0 0 50%', minHeight: 280, backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      )
      return (
        <div style={{ width: '100%', minHeight: 320, display: 'flex', alignItems: 'stretch' }}>
          {textFirst ? textPanel : imgPanel}
          {textFirst ? imgPanel : textPanel}
        </div>
      )
    }
    return (
      <div
        style={{
          width: '100%',
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : isDark ? 'linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)' : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: heroBg,
          color: heroColor,
          minHeight: layoutVariant === 'minimal' ? 240 : 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: layoutVariant === 'minimal' ? 'flex-start' : 'center',
          justifyContent: 'center',
          padding: layoutVariant === 'minimal' ? '56px 48px' : '80px 24px',
          textAlign: layoutVariant === 'minimal' ? 'left' : 'center',
          borderLeft: layoutVariant === 'minimal' ? '4px solid var(--color-primary,#4f46e5)' : undefined,
          ...(layoutVariant === 'centered' ? styleRest : {}),
        }}
      >
        {badge && <span className="badge bg-primary mb-3" style={{ alignSelf: layoutVariant === 'minimal' ? 'flex-start' : undefined }}>{badge}</span>}
        <h1 className="display-5 fw-bold" style={{ color: heroColor, maxWidth: 760 }}>{heading}</h1>
        <p className="fs-5" style={{ color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.6)', maxWidth: 560 }}>{paragraph}</p>
        <div className="d-flex gap-2 flex-wrap" style={{ justifyContent: layoutVariant === 'minimal' ? 'flex-start' : 'center' }}>
          <a href={cta.href} className={isDark ? 'btn btn-light btn-lg' : 'btn btn-primary btn-lg'}>{cta.text}</a>
          {ctaSecondary && <a href={ctaSecondary.href} className={isDark ? 'btn btn-outline-light btn-lg' : 'btn btn-outline-secondary btn-lg'}>{ctaSecondary.text}</a>}
        </div>
      </div>
    )
  }

  // ─── MUI ──────────────────────────────────────────────────────────────────
  if (framework === 'mui') {
    const isSplitMui = layoutVariant === 'split-left' || layoutVariant === 'split-right'
    const isDarkMui = layoutVariant === 'gradient-dark'
    const { backgroundColor: _muiPresetBg, color: _muiPresetColor, ...muiStyleRest } = style ?? {}

    if (isSplitMui) {
      const textFirst = layoutVariant === 'split-left'
      const textPanel = (
        <div style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', gap: 16, backgroundColor: '#fff' }}>
          {badge && <span className="MuiChip-root MuiChip-filled" style={{ marginBottom: 8, alignSelf: 'flex-start' }}>{badge}</span>}
          <p className="MuiTypography-root MuiTypography-h4 MuiTypography-gutterBottom" style={{ fontWeight: 700 }}>{heading}</p>
          <p className="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary">{paragraph}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <a href={cta.href} className="MuiButton-root MuiButton-contained">{cta.text}</a>
            {ctaSecondary && <a href={ctaSecondary.href} className="MuiButton-root MuiButton-outlined">{ctaSecondary.text}</a>}
          </div>
        </div>
      )
      const imgPanel = (
        <div style={{ flex: '0 0 50%', minHeight: 280, backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      )
      return (
        <div className="mui-root" style={{ width: '100%', minHeight: 320, display: 'flex', alignItems: 'stretch' }}>
          {textFirst ? textPanel : imgPanel}
          {textFirst ? imgPanel : textPanel}
        </div>
      )
    }

    // Non-split: centered, gradient-dark, minimal
    const muiHeroBg = isDarkMui ? '#0f172a' : (_muiPresetBg ?? undefined)
    const muiHeroColor = isDarkMui ? '#fff' : undefined
    return (
      <div
        className="mui-root mui-hero"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : isDarkMui ? 'linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)' : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: muiHeroBg,
          color: muiHeroColor,
          alignItems: layoutVariant === 'minimal' ? 'flex-start' : 'center',
          textAlign: layoutVariant === 'minimal' ? 'left' : 'center',
          padding: layoutVariant === 'minimal' ? '56px 48px' : '80px 24px',
          borderLeft: layoutVariant === 'minimal' ? '4px solid var(--color-primary,#4f46e5)' : undefined,
          ...muiStyleRest,
        }}
      >
        {badge && <span className="MuiChip-root MuiChip-filled" style={{ marginBottom: 12, backgroundColor: isDarkMui ? 'rgba(99,102,241,0.25)' : undefined, color: isDarkMui ? '#a5b4fc' : undefined }}>{badge}</span>}
        <p className="MuiTypography-root MuiTypography-h3 MuiTypography-gutterBottom" style={{ fontWeight: 700, color: isDarkMui ? '#fff' : 'rgba(0,0,0,0.87)' }}>{heading}</p>
        <p className="MuiTypography-root MuiTypography-body1" style={{ maxWidth: 560, color: isDarkMui ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.54)' }}>{paragraph}</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap', justifyContent: layoutVariant === 'minimal' ? 'flex-start' : 'center' }}>
          <a href={cta.href} className="MuiButton-root MuiButton-contained" style={{ backgroundColor: isDarkMui ? '#fff' : undefined, color: isDarkMui ? '#0f172a' : undefined }}>{cta.text}</a>
          {ctaSecondary && <a href={ctaSecondary.href} className="MuiButton-root MuiButton-outlined" style={{ borderColor: isDarkMui ? 'rgba(255,255,255,0.4)' : undefined, color: isDarkMui ? 'rgba(255,255,255,0.9)' : undefined }}>{ctaSecondary.text}</a>}
        </div>
      </div>
    )
  }

  // ─── Tailwind ─────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    const isSplitTw = layoutVariant === 'split-left' || layoutVariant === 'split-right'
    const isDarkTw = layoutVariant === 'gradient-dark'
    const { backgroundColor: _twPresetBg, color: _twPresetColor, ...twStyleRest } = style ?? {}

    if (isSplitTw) {
      const textFirst = layoutVariant === 'split-left'
      const textPanel = (
        <div className="flex flex-col justify-center gap-4 bg-white" style={{ flex: '0 0 50%', padding: '48px 40px' }}>
          {badge && <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 self-start">{badge}</span>}
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight" style={{ margin: 0 }}>{heading}</h1>
          <p className="text-lg text-gray-500" style={{ margin: 0 }}>{paragraph}</p>
          <div className="flex gap-3 flex-wrap">
            <a href={cta.href} className="inline-block px-7 py-3 rounded-lg bg-indigo-600 text-white font-semibold">{cta.text}</a>
            {ctaSecondary && <a href={ctaSecondary.href} className="inline-block px-7 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold">{ctaSecondary.text}</a>}
          </div>
        </div>
      )
      const imgPanel = (
        <div style={{ flex: '0 0 50%', minHeight: 280, backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      )
      return (
        <div className="w-full flex" style={{ minHeight: 320 }}>
          {textFirst ? textPanel : imgPanel}
          {textFirst ? imgPanel : textPanel}
        </div>
      )
    }

    // Use preset backgroundColor only for centered; dark/minimal own their backgrounds
    const twPresetBg = layoutVariant === 'centered' ? (_twPresetBg ?? undefined) : undefined
    const twBgClass = isDarkTw ? 'bg-gray-900' : (!twPresetBg && !backgroundImage) ? (layoutVariant === 'centered' ? 'bg-indigo-50' : 'bg-white') : ''
    const twText = isDarkTw ? 'text-white' : 'text-gray-900'
    const twSub = isDarkTw ? 'text-gray-400' : 'text-gray-500'
    const twAlign = layoutVariant === 'minimal' ? 'items-start text-left' : 'items-center text-center'
    const twPad = layoutVariant === 'minimal' ? 'px-12 py-14' : 'px-6 py-20'
    return (
      <div
        className={`w-full flex flex-col justify-center gap-5 ${twBgClass} ${twAlign} ${twPad}`}
        style={{
          minHeight: layoutVariant === 'minimal' ? 240 : 320,
          backgroundColor: twPresetBg,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : isDarkTw ? 'linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)' : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderLeft: layoutVariant === 'minimal' ? '4px solid #4f46e5' : undefined,
          ...twStyleRest,
        }}
      >
        {badge && <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 self-start">{badge}</span>}
        <h1 className={`text-4xl font-extrabold leading-tight ${twText}`}>{heading}</h1>
        <p className={`text-lg max-w-lg ${twSub}`}>{paragraph}</p>
        <div className="flex gap-3 flex-wrap" style={{ justifyContent: layoutVariant === 'minimal' ? 'flex-start' : 'center' }}>
          <a href={cta.href} className={isDarkTw ? 'inline-block px-7 py-3 rounded-lg bg-white text-gray-900 font-semibold' : 'inline-block px-7 py-3 rounded-lg bg-indigo-600 text-white font-semibold'}>{cta.text}</a>
          {ctaSecondary && <a href={ctaSecondary.href} className={isDarkTw ? 'inline-block px-7 py-3 rounded-lg border border-white border-opacity-40 text-white font-semibold' : 'inline-block px-7 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold'}>{ctaSecondary.text}</a>}
        </div>
      </div>
    )
  }

  // ─── Custom — route to layout variant ─────────────────────────────────────
  // Strip backgroundColor from style for layouts that own their own background.
  // Otherwise a preset's bg color stored in element.styles would override the
  // gradient / split / minimal backgrounds defined in each layout component.
  const { backgroundColor: _bg, ...styleWithoutBg } = style ?? {}
  const propsNoBg = { heading, paragraph, cta, ctaSecondary, badge, backgroundImage, style: styleWithoutBg }
  const propsWithBg = { heading, paragraph, cta, ctaSecondary, badge, backgroundImage, style }

  if (layoutVariant === 'split-left') return <LayoutSplitLeft {...propsNoBg} />
  if (layoutVariant === 'split-right') return <LayoutSplitRight {...propsNoBg} />
  if (layoutVariant === 'gradient-dark') return <LayoutGradientDark {...propsNoBg} />
  if (layoutVariant === 'minimal') return <LayoutMinimal {...propsNoBg} />
  return <LayoutCentered {...propsWithBg} />
}
