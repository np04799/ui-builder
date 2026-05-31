'use client'

import { useEffect } from 'react'
import { useBuilderStore } from '@/store/builder.store'

// Maps fontFamily values stored in wizard to the CSS variable names defined in app/layout.tsx
const FONT_VAR_MAP: Record<string, string> = {
  'Inter, sans-serif': 'var(--font-inter)',
  'Roboto, sans-serif': 'var(--font-roboto)',
  '"Playfair Display", serif': 'var(--font-playfair)',
  'Montserrat, sans-serif': 'var(--font-montserrat)',
  '"Space Grotesk", sans-serif': 'var(--font-space-grotesk)',
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

export default function BrandingApplicator() {
  const branding = useBuilderStore((s) => s.projectMeta?.branding)

  useEffect(() => {
    const root = document.documentElement

    if (!branding) return

    const { primaryColor, fontFamily } = branding

    // Update primary color + derived interaction token
    root.style.setProperty('--color-primary', primaryColor)
    root.style.setProperty('--color-selected', `rgba(${hexToRgb(primaryColor)}, 0.08)`)

    // Update font — use CSS variable if we have a mapping, otherwise fall back to raw value
    const fontVar = FONT_VAR_MAP[fontFamily]
    const resolvedFont = fontVar
      ? `${fontVar}, ${fontFamily}`
      : fontFamily
    root.style.setProperty('--font-sans', resolvedFont)

    return () => {
      // Reset to CSS defaults on unmount (e.g., if project is cleared)
      root.style.removeProperty('--color-primary')
      root.style.removeProperty('--color-selected')
      root.style.removeProperty('--font-sans')
    }
  }, [branding])

  return null
}
