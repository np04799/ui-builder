'use client'

import { useFramework } from '@/hooks/useFramework'

interface Props {
  heading?: string
  paragraph?: string
  cta?: { text: string; href: string }
  backgroundImage?: string
  style?: React.CSSProperties
}

export default function HeroElement({
  heading = 'Welcome to Our Site',
  paragraph = 'Build something amazing with BuilderPro.',
  cta = { text: 'Get Started', href: '#' },
  backgroundImage,
  style,
}: Props) {
  const framework = useFramework()

  // ─── Bootstrap ────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    return (
      <div
        className="p-5 mb-0 text-center"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: backgroundImage ? undefined : '#e9ecef',
          minHeight: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        <div className="container py-5">
          <h1 className="display-5 fw-bold">{heading}</h1>
          <p className="col-md-8 mx-auto fs-5 text-muted">{paragraph}</p>
          <a href={cta.href} className="btn btn-primary btn-lg">{cta.text}</a>
        </div>
      </div>
    )
  }

  // ─── MUI ──────────────────────────────────────────────────────────────────
  if (framework === 'mui') {
    return (
      <div
        className="mui-root mui-hero"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...style,
        }}
      >
        <p className="MuiTypography-root MuiTypography-h3 MuiTypography-gutterBottom" style={{ fontWeight: 700 }}>
          {heading}
        </p>
        <p className="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary" style={{ maxWidth: 560 }}>
          {paragraph}
        </p>
        <a href={cta.href} className="MuiButton-root MuiButton-contained" style={{ marginTop: 8 }}>
          {cta.text}
        </a>
      </div>
    )
  }

  // ─── Tailwind ─────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    return (
      <div
        className="w-full flex flex-col items-center justify-center text-center px-6 py-20 gap-5 rounded-lg"
        style={{
          minHeight: 320,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: backgroundImage ? undefined : '#eef2ff',
          ...style,
        }}
      >
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{heading}</h1>
        <p className="text-lg text-gray-500 max-w-lg">{paragraph}</p>
        <a href={cta.href} className="inline-block px-7 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-700 transition-colors">
          {cta.text}
        </a>
      </div>
    )
  }

  // ─── Custom ───────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: '100%',
        minHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 24px',
        gap: 20,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: backgroundImage ? undefined : '#f0f4ff',
        borderRadius: 8,
        ...style,
      }}
    >
      <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
        {heading}
      </h1>
      <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: 560 }}>
        {paragraph}
      </p>
      <a
        href={cta.href}
        style={{
          display: 'inline-block',
          padding: '12px 28px',
          borderRadius: 8,
          backgroundColor: 'var(--color-primary)',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.9375rem',
        }}
      >
        {cta.text}
      </a>
    </div>
  )
}
