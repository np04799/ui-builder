'use client'

import { useState } from 'react'
import { useOrderedSections } from '@/hooks/useBuilderSelectors'
import { useBuilderStore } from '@/store/builder.store'
import SectionRenderer from './SectionRenderer'
import { DND_TYPE, decodeDragPayload } from '@/components/builder/dnd/dragTypes'
import { defaultContentForType } from '@/lib/elementDefaults'
import { TEMPLATES, materializeTemplate } from '@/lib/templates'

function AddSectionButton({ afterSectionId }: { afterSectionId: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 0',
        opacity: 0,
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0' }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          useBuilderStore.getState().addSection(afterSectionId)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          height: 28,
          padding: '0 14px',
          borderRadius: 6,
          border: '1px dashed var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-secondary)',
          fontSize: '0.75rem',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M5 1v8M1 5h8" />
        </svg>
        Add Section
      </button>
    </div>
  )
}

// ─── Empty state illustration ─────────────────────────────────────────────────

function EmptyState() {

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        padding: '48px 32px',
        textAlign: 'center',
      }}
    >
      {/* Illustration */}
      <div style={{ marginBottom: 28, position: 'relative', width: 280, height: 180 }}>
        <svg width="280" height="180" viewBox="0 0 280 180" fill="none">
          {/* Background card */}
          <rect x="40" y="20" width="200" height="140" rx="12" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />

          {/* Header bar */}
          <rect x="40" y="20" width="200" height="36" rx="12" fill="#C7D2FE" />
          <rect x="40" y="44" width="200" height="12" fill="#C7D2FE" />

          {/* Three dots */}
          <circle cx="60" cy="38" r="4" fill="#A5B4FC" />
          <circle cx="75" cy="38" r="4" fill="#A5B4FC" />
          <circle cx="90" cy="38" r="4" fill="#A5B4FC" />

          {/* Content area placeholder lines */}
          <rect x="60" y="70" width="80" height="8" rx="4" fill="#DDD6FE" />
          <rect x="60" y="84" width="60" height="6" rx="3" fill="#E0E7FF" />
          <rect x="60" y="97" width="70" height="6" rx="3" fill="#E0E7FF" />

          {/* Image placeholder */}
          <rect x="160" y="66" width="60" height="60" rx="8" fill="#DDD6FE" />
          <circle cx="178" cy="84" r="7" fill="#C4B5FD" />
          <path d="M160 110 l20-16 10 10 12-8 18 14" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Floating sparkle decorations */}
          <path d="M22 50 l2-6 2 6-6-2 6 2z" fill="#A5B4FC" opacity="0.7" />
          <path d="M248 30 l2-5 2 5-5-2 5 2z" fill="#818CF8" opacity="0.6" />
          <path d="M260 100 l1.5-4.5 1.5 4.5-4.5-1.5 4.5 1.5z" fill="#A5B4FC" opacity="0.5" />
          <path d="M18 120 l1.5-4 1.5 4-4-1.5 4 1.5z" fill="#C4B5FD" opacity="0.6" />

          {/* Arrow cursor */}
          <g transform="translate(148, 140)">
            <path d="M0 0 L0 14 L4 10 L7 16 L9 15 L6 9 L11 9 Z" fill="#6366F1" opacity="0.8" />
          </g>
        </svg>
      </div>

      {/* Heading */}
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: 0,
          letterSpacing: '-0.02em',
        }}
      >
        Start building your page
      </h2>

      {/* Subtitle */}
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
          margin: '10px 0 0',
          lineHeight: 1.6,
          maxWidth: 300,
        }}
      >
        Your canvas is empty. Drag elements from the left panel and drop them here to get started.
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 28 }}>
        <button
          onClick={() => useBuilderStore.getState().addSection()}
          style={{
            height: 40,
            padding: '0 20px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 1v12M1 7h12" />
          </svg>
          Add Section
        </button>

        <button
          style={{
            height: 40,
            padding: '0 20px',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text-primary)',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="1" width="12" height="12" rx="2" />
            <path d="M1 5h12M6 5v7" />
          </svg>
          Browse Templates
        </button>
      </div>

      {/* Or + tutorial link */}
      <p style={{ margin: '20px 0 0', color: 'var(--color-muted)', fontSize: '0.8125rem' }}>
        or
      </p>
      <button
        style={{
          marginTop: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-primary)',
          fontSize: '0.875rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 8px',
          borderRadius: 6,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="6.5" />
          <path d="M6 6c0-1.1.9-2 2-2s2 .9 2 2-.9 1.6-2 2v1" />
          <circle cx="8" cy="12" r="0.6" fill="currentColor" stroke="none" />
        </svg>
        Watch Quick Tutorial
      </button>
    </div>
  )
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

export default function Canvas() {
  const sections = useOrderedSections()
  const setSelectedId = useBuilderStore((s) => s.setSelectedId)
  const quickAddElement = useBuilderStore((s) => s.quickAddElement)
  const addDrawerLayout = useBuilderStore((s) => s.addDrawerLayout)
  const insertTemplate = useBuilderStore((s) => s.insertTemplate)
  const moveSectionToIndex = useBuilderStore((s) => s.moveSectionToIndex)
  const canvasWidth = useBuilderStore((s) => s.canvasWidth)
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null)

  function handleCanvasDrop(e: React.DragEvent) {
    e.preventDefault()
    const raw = e.dataTransfer.getData(DND_TYPE)
    const payload = decodeDragPayload(raw)
    if (!payload) return

    if (payload.type === 'panel') {
      const content = defaultContentForType(payload.elementType)
      if (content) {
        if (content.type === 'drawer') {
          addDrawerLayout(content)
        } else {
          quickAddElement(content)
        }
      }
    } else if (payload.type === 'template') {
      const tpl = TEMPLATES.find((t) => t.id === payload.templateId)
      if (tpl) insertTemplate(materializeTemplate(tpl.section))
    }
    // Section drag handled by individual drop zones below
    setDragOverSectionId(null)
  }

  const isFullWidth = canvasWidth === '100%'

  const content = sections.length === 0 ? (
    <EmptyState />
  ) : (
    <>
      {sections.map((section, index) => (
        <div key={section.id}>
          {/* Drop zone above section for reorder */}
          <div
            style={{
              height: dragOverSectionId === `above-${section.id}` ? 48 : 4,
              backgroundColor: dragOverSectionId === `above-${section.id}`
                ? 'color-mix(in srgb, var(--color-primary) 15%, transparent)'
                : 'transparent',
              border: dragOverSectionId === `above-${section.id}`
                ? '2px dashed var(--color-primary)'
                : '2px dashed transparent',
              borderRadius: 6,
              transition: 'all 120ms ease',
              margin: '2px 0',
            }}
            onDragOver={(e) => {
              const raw = e.dataTransfer.getData(DND_TYPE)
              if (!raw) { e.preventDefault(); setDragOverSectionId(`above-${section.id}`); return }
              const payload = decodeDragPayload(raw)
              if (payload?.type !== 'section') return
              e.preventDefault()
              setDragOverSectionId(`above-${section.id}`)
            }}
            onDragLeave={() => setDragOverSectionId(null)}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragOverSectionId(null)
              const raw = e.dataTransfer.getData(DND_TYPE)
              const payload = decodeDragPayload(raw)
              if (payload?.type !== 'section') return
              // Move dragged section to position `index` (before this section)
              moveSectionToIndex(payload.sectionId, index)
            }}
          />
          <SectionRenderer id={section.id} />
          <AddSectionButton afterSectionId={section.id} />
        </div>
      ))}
    </>
  )

  return (
    <main
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: isFullWidth ? 'var(--color-bg)' : '#e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isFullWidth ? 'stretch' : 'center',
        padding: isFullWidth ? 0 : '24px 0',
      }}
      onClick={() => setSelectedId(null)}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy' }}
      onDrop={handleCanvasDrop}
    >
      {isFullWidth ? content : (
        <div style={{
          width: canvasWidth,
          maxWidth: '100%',
          minHeight: 'calc(100vh - 48px)',
          backgroundColor: 'var(--color-bg)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
          borderRadius: 8,
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {content}
        </div>
      )}
    </main>
  )
}
