'use client'

import { useSelectedId } from '@/hooks/useBuilderSelectors'
import { useSelectedNodeType } from '@/hooks/useSelectedNodeType'
import { useBuilderStore } from '@/store/builder.store'

export default function Breadcrumb() {
  const selectedId = useSelectedId()
  const nodeType = useSelectedNodeType()
  const elements = useBuilderStore((s) => s.elements)

  const trail: string[] = ['Body']

  if (selectedId && nodeType) {
    if (nodeType === 'section') {
      trail.push('Section')
    } else if (nodeType === 'row') {
      trail.push('Section', 'Container')
    } else if (nodeType === 'column') {
      trail.push('Section', 'Container', 'Column')
    } else if (nodeType === 'element') {
      const el = elements[selectedId]
      trail.push('Section', 'Container', 'Column')
      if (el?.content?.type) {
        trail.push(el.content.type.charAt(0).toUpperCase() + el.content.type.slice(1))
      }
    }
  } else {
    trail.push('Section', 'Container')
  }

  return (
    <div
      style={{
        height: 32,
        flexShrink: 0,
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="var(--color-text-secondary)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: 8, flexShrink: 0 }}
      >
        <path d="M7 1L1 4l6 3 6-3-6-3z" />
        <path d="M1 7l6 3 6-3" />
        <path d="M1 10l6 3 6-3" />
      </svg>

      {trail.map((crumb, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
          {i > 0 && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ margin: '0 4px' }}
            >
              <path d="M3 2l4 3-4 3" />
            </svg>
          )}
          <span
            style={{
              fontSize: '0.75rem',
              color: i === trail.length - 1 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontWeight: i === trail.length - 1 ? 500 : 400,
              cursor: 'pointer',
            }}
          >
            {crumb}
          </span>
        </span>
      ))}
    </div>
  )
}
