'use client'

import { useEffect, useState } from 'react'
import { renderElement } from '@/components/builder/elements/registry'
import { PreviewStateContext } from '@/components/builder/elements/PreviewStateContext'
import { applyFrameworkCSS } from '@/components/builder/layout/FrameworkLoader'
import type { BuilderStoreState } from '@/types/store.types'

export const PREVIEW_STORAGE_KEY = 'builderpro_preview_state'

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

export default function PreviewPage() {
  const [state, setState] = useState<BuilderStoreState | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PREVIEW_STORAGE_KEY)
      if (raw) setState(JSON.parse(raw) as BuilderStoreState)
    } catch {
      // ignore parse errors
    }
  }, [])

  // Apply framework CSS whenever state changes
  useEffect(() => {
    if (!state) return
    return applyFrameworkCSS(state.mode)
  }, [state?.mode])

  // Apply branding CSS vars from serialized project meta
  useEffect(() => {
    if (!state?.projectMeta?.branding) return
    const { primaryColor, fontFamily } = state.projectMeta.branding
    const root = document.documentElement
    root.style.setProperty('--color-primary', primaryColor)
    root.style.setProperty('--color-selected', `rgba(${hexToRgb(primaryColor)}, 0.08)`)
    root.style.setProperty('--font-sans', fontFamily)
    return () => {
      root.style.removeProperty('--color-primary')
      root.style.removeProperty('--color-selected')
      root.style.removeProperty('--font-sans')
    }
  }, [state?.projectMeta?.branding])

  if (!state) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: '#888', fontFamily: 'sans-serif' }}>
        No preview data. Open this page from BuilderPro using the Preview button.
      </div>
    )
  }

  const { sectionOrder, sections, rows, columns, elements } = state

  return (
    <PreviewStateContext.Provider value={state}>
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#fff' }}>
      {sectionOrder.map((sectionId) => {
        const section = sections[sectionId]
        if (!section) return null

        // Mirror the builder's two-tier section rendering:
        // Outer = full-width background shell, Inner = constrained content with padding.
        const sectionStyles = section.styles as Record<string, string>
        const isFullBleed = sectionStyles.maxWidth === 'none'

        // Align inner content wrapper (same logic as SectionRenderer)
        const align = sectionStyles.alignItems ?? 'center'
        const innerMargin =
          align === 'flex-end' ? '0 0 0 auto'
          : align === 'flex-start' ? '0 auto 0 0'
          : '0 auto'

        const outerStyle: React.CSSProperties = {
          position: 'relative',
          width: '100%',
          ...(sectionStyles.height ? { height: sectionStyles.height } : {}),
          ...(isFullBleed ? { display: 'flex', flexDirection: 'column', overflow: 'hidden' } : {}),
          backgroundColor: sectionStyles.backgroundColor ?? 'transparent',
          backgroundImage: sectionStyles.backgroundImage,
          backgroundSize: sectionStyles.backgroundSize ?? 'cover',
          backgroundPosition: sectionStyles.backgroundPosition ?? 'center',
          backgroundRepeat: sectionStyles.backgroundRepeat ?? 'no-repeat',
          boxSizing: 'border-box',
        }

        const innerStyle: React.CSSProperties = {
          width: '100%',
          maxWidth: sectionStyles.maxWidth ?? '1200px',
          margin: innerMargin,
          paddingTop: sectionStyles.paddingTop ?? '20px',
          paddingBottom: sectionStyles.paddingBottom ?? '20px',
          paddingLeft: sectionStyles.paddingLeft ?? '20px',
          paddingRight: sectionStyles.paddingRight ?? '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxSizing: 'border-box',
        }

        return (
          <section key={sectionId} style={outerStyle}>
            <div style={isFullBleed ? { flex: 1, display: 'flex', flexDirection: 'column' } : innerStyle}>
              {section.rowIds.map((rowId) => {
                const row = rows[rowId]
                if (!row) return null
                return (
                  <div
                    key={rowId}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: row.gap?.desktop ?? '16px',
                      width: '100%',
                      ...(row.styles as React.CSSProperties),
                    }}
                  >
                    {row.columnIds.map((columnId) => {
                      const column = columns[columnId]
                      if (!column) return null
                      if (column.managedBy) return null
                      return (
                        <div
                          key={columnId}
                          style={{
                            flex: 1,
                            minWidth: 0,
                            ...(column.styles as React.CSSProperties),
                          }}
                        >
                          {column.elementIds.map((elementId) => {
                            const element = elements[elementId]
                            if (!element) return null
                            const rendered = renderElement(
                              element.content,
                              element.styles as React.CSSProperties,
                            )
                            const noMargin = ['navbar', 'footer', 'hero', 'banner-3d', 'banner-morph', 'banner-ticker', 'banner-split', 'banner-glass', 'banner-neon', 'banner-aurora', 'banner-retro', 'banner-particle'].includes(element.content.type)
                            return (
                              <div key={elementId} style={noMargin ? undefined : { marginBottom: 12 }}>
                                {rendered ?? (
                                  <div style={{ color: '#aaa', fontSize: 12 }}>
                                    {element.content.type}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
    </PreviewStateContext.Provider>
  )
}
