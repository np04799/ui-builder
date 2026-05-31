'use client'

import { memo, useState } from 'react'
import type { ButtonVariant } from '@/types/builder.types'

interface Props {
  triggerText?: string
  triggerVariant?: ButtonVariant
  title?: string
  body?: string
  confirmText?: string
  cancelText?: string
  style?: React.CSSProperties
}

function triggerBtnStyle(variant: ButtonVariant): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: '9px 20px',
    borderRadius: 7,
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    border: '1.5px solid transparent',
    transition: 'opacity 150ms',
  }
  switch (variant) {
    case 'primary':
      return { ...base, backgroundColor: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)' }
    case 'secondary':
      return { ...base, backgroundColor: 'var(--color-text-secondary)', color: '#fff', borderColor: 'var(--color-text-secondary)' }
    case 'outline':
      return { ...base, backgroundColor: 'transparent', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }
    case 'ghost':
      return { ...base, backgroundColor: 'transparent', color: 'var(--color-text-primary)', borderColor: 'transparent' }
  }
}

function ModalElement({
  triggerText = 'Open Modal',
  triggerVariant = 'primary',
  title = 'Modal Title',
  body = 'Modal body content.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  style,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: 'inline-block', fontFamily: 'inherit', ...style }}>
      <button onClick={() => setOpen(true)} style={triggerBtnStyle(triggerVariant ?? 'primary')}>
        {triggerText}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            {/* Modal panel — stop propagation so clicking inside doesn't close */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--color-bg)',
                borderRadius: 12,
                padding: '28px 28px 24px',
                width: '100%',
                maxWidth: 560,
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                position: 'relative',
              }}
            >
              {/* Close X */}
              <button
                onClick={() => setOpen(false)}
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 16,
                  border: 'none',
                  background: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: 'var(--color-muted)',
                  lineHeight: 1,
                  padding: 4,
                }}
                aria-label="Close"
              >
                ✕
              </button>

              <h2 style={{ margin: '0 0 12px', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {title}
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {body}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 6,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 6,
                    border: 'none',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default memo(ModalElement)
