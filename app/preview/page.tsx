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

  const { sectionOrder, sections, rows, columns, elements, canvasWidth } = state
  const isConstrained = canvasWidth && canvasWidth !== '100%'

  return (
    <PreviewStateContext.Provider value={state}>
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#fff' }}>
      {sectionOrder.map((sectionId) => {
        const section = sections[sectionId]
        if (!section) return null
        return (
          <section
            key={sectionId}
            style={{
              width: '100%',
              padding: '40px 24px',
              boxSizing: 'border-box',
              ...(section.styles as React.CSSProperties),
            }}
          >
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
                    ...(isConstrained ? { maxWidth: canvasWidth, margin: '0' } : {}),
                    ...(row.styles as React.CSSProperties),
                  }}
                >
                  {row.columnIds.map((columnId) => {
                    const column = columns[columnId]
                    if (!column) return null
                    // Skip columns managed internally by a parent element (e.g. drawer content col)
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
                          return (
                            <div key={elementId} style={{ marginBottom: 12 }}>
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
          </section>
        )
      })}
    </div>
    </PreviewStateContext.Provider>
  )
}
