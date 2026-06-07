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
      // Primary: builder sets state in sessionStorage
      const raw = sessionStorage.getItem(PREVIEW_STORAGE_KEY)
      if (raw) {
        setState(JSON.parse(raw) as BuilderStoreState)
        return
      }
      // Fallback: Inspiration section sets state in localStorage (cross-tab bridge)
      const inspirationRaw = localStorage.getItem('builderpro_inspiration_preview')
      if (inspirationRaw) {
        setState(JSON.parse(inspirationRaw) as BuilderStoreState)
        localStorage.removeItem('builderpro_inspiration_preview')
      }
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
                    // Skip columns managed by parent elements — they are rendered
                    // inline inside their owner element (section-block, div-container, drawer)
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
                          const content = element.content as Record<string, unknown>
                          const contentColId = content.contentColumnId as string | undefined
                          const rendered = renderElement(
                            element.content,
                            element.styles as React.CSSProperties,
                          )
                          // Render children of managed columns (section-block / div-container)
                          const managedCol = contentColId ? columns[contentColId] : null
                          return (
                            <div key={elementId} style={{ marginBottom: 12 }}>
                              {rendered ?? <div style={{ color: '#aaa', fontSize: 12 }}>{element.content.type}</div>}
                              {managedCol && managedCol.elementIds.length > 0 && (
                                <div style={{ padding: '8px 0' }}>
                                  {managedCol.elementIds.map((cid) => {
                                    const cel = elements[cid]
                                    if (!cel) return null
                                    const cr = renderElement(cel.content, cel.styles as React.CSSProperties)
                                    return <div key={cid} style={{ marginBottom: 8 }}>{cr}</div>
                                  })}
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
