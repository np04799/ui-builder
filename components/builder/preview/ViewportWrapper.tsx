'use client'

import { memo } from 'react'
import { useResponsiveMode } from '@/hooks/useBuilderSelectors'
import Canvas from '@/components/builder/renderers/Canvas'

// ─── Viewport configs per breakpoint ─────────────────────────────────────────
//
// maxWidth matches the design system breakpoints in builder.types.ts:
//   desktop: 1440px canvas max, artboard capped at 1200
//   tablet:  768px
//   mobile:  390px
//
// The artboard shrinks to the viewport width so renderers see the same
// constrained layout future responsive styles will target.

// Desktop uses a fixed artboard width so section max-width centering is visible.
// Tablet/mobile use exact pixel widths to simulate those viewports accurately.
const VIEWPORT: Record<string, { width: number | string; borderRadius: number }> = {
  desktop: { width: 1440, borderRadius: 4 },
  tablet: { width: 768, borderRadius: 8 },
  mobile: { width: 390, borderRadius: 12 },
}

export default memo(function ViewportWrapper() {
  const mode = useResponsiveMode()
  const { width, borderRadius } = VIEWPORT[mode] ?? VIEWPORT.desktop

  return (
    <div
      data-artboard
      data-viewport={mode}
      style={{
        width,
        minWidth: width,
        minHeight: 'calc(100vh - 48px - 64px)',
        backgroundColor: 'var(--color-bg)',
        borderRadius,
        boxShadow:
          mode === 'desktop'
            ? '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)'
            : '0 2px 8px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.10)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Canvas />
    </div>
  )
})
