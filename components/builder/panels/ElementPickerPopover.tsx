'use client'

import { useEffect, useRef } from 'react'

const PICKER_GROUPS = [
  {
    label: 'Layout',
    items: [
      { label: 'Row', type: 'row-layout', icon: '⊟' },
      { label: 'Column', type: 'column-layout', icon: '⊞' },
    ],
  },
  {
    label: 'Sections',
    items: [
      { label: 'Hero', type: 'hero', icon: '🦸' },
      { label: 'Navbar', type: 'navbar', icon: '☰' },
      { label: 'Card', type: 'card', icon: '🃏' },
      { label: 'Footer', type: 'footer', icon: '📄' },
    ],
  },
  {
    label: 'Typography',
    items: [
      { label: 'Heading', type: 'heading', icon: 'H' },
      { label: 'Paragraph', type: 'paragraph', icon: 'P' },
      { label: 'List', type: 'list', icon: '≡' },
      { label: 'Link', type: 'link', icon: '🔗' },
      { label: 'Quote', type: 'blockquote', icon: '❝' },
    ],
  },
  {
    label: 'Basic',
    items: [
      { label: 'Button', type: 'button', icon: '▶' },
      { label: 'Image', type: 'image', icon: '🖼' },
      { label: 'Icon', type: 'icon', icon: '★' },
      { label: 'Divider', type: 'divider', icon: '—' },
      { label: 'Spacer', type: 'spacer', icon: '↕' },
    ],
  },
  {
    label: 'Media',
    items: [
      { label: 'Video', type: 'video', icon: '▶︎' },
      { label: 'Gallery', type: 'gallery', icon: '⊞' },
      { label: 'Embed', type: 'embed', icon: '</>' },
      { label: 'Map', type: 'map', icon: '📍' },
    ],
  },
  {
    label: 'Form',
    items: [
      { label: 'Form', type: 'form', icon: '📋' },
      { label: 'Input', type: 'input', icon: '▭' },
      { label: 'Email', type: 'email', icon: '✉' },
      { label: 'Textarea', type: 'textarea', icon: '▤' },
      { label: 'Select', type: 'select', icon: '⌄' },
      { label: 'Checkbox', type: 'checkbox', icon: '☑' },
      { label: 'Radio', type: 'radio', icon: '⊙' },
    ],
  },
]

interface Props {
  onSelect: (elementType: string) => void
  onClose: () => void
}

export default function ElementPickerPopover({ onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: 6,
        zIndex: 1000,
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        padding: '8px 8px 12px',
        width: 240,
        maxHeight: 400,
        overflowY: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          padding: '4px 8px 8px',
        }}
      >
        Add Element
      </div>

      {PICKER_GROUPS.map((group) => (
        <div key={group.label}>
          <div
            style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '6px 8px 4px',
            }}
          >
            {group.label}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
            {group.items.map((item) => (
              <button
                key={item.type}
                onClick={() => onSelect(item.type)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: '7px 2px',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  cursor: 'pointer',
                  minHeight: 48,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)'
                  e.currentTarget.style.backgroundColor = 'var(--color-selected)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.backgroundColor = 'var(--color-bg)'
                }}
              >
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: '0.5625rem', color: 'var(--color-text-secondary)', fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
