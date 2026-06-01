'use client'

import { memo, useState } from 'react'
import type { ButtonVariant } from '@/types/builder.types'
import { useFramework } from '@/hooks/useFramework'

interface Props {
  triggerText?: string
  triggerVariant?: ButtonVariant
  title?: string
  body?: string
  confirmText?: string
  cancelText?: string
  style?: React.CSSProperties
}

function customTriggerStyle(variant: ButtonVariant): React.CSSProperties {
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
    case 'primary':   return { ...base, backgroundColor: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)' }
    case 'secondary': return { ...base, backgroundColor: 'var(--color-text-secondary)', color: '#fff', borderColor: 'var(--color-text-secondary)' }
    case 'outline':   return { ...base, backgroundColor: 'transparent', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }
    case 'ghost':     return { ...base, backgroundColor: 'transparent', color: 'var(--color-text-primary)', borderColor: 'transparent' }
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
  const framework = useFramework()
  const v = triggerVariant ?? 'primary'

  const triggerBtn = (() => {
    if (framework === 'bootstrap') {
      const cls = v === 'outline' ? 'btn-outline-primary' : v === 'ghost' ? 'btn-link' : v === 'secondary' ? 'btn-secondary' : 'btn-primary'
      return <button className={`btn ${cls}`} onClick={() => setOpen(true)}>{triggerText}</button>
    }
    if (framework === 'tailwind') {
      const cls = v === 'outline'
        ? 'px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md text-sm font-semibold hover:bg-indigo-50 transition-colors'
        : v === 'ghost'
        ? 'px-4 py-2 text-gray-600 rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors'
        : v === 'secondary'
        ? 'px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-semibold hover:bg-gray-700 transition-colors'
        : 'px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors'
      return <button className={`border-none cursor-pointer ${cls}`} onClick={() => setOpen(true)}>{triggerText}</button>
    }
    return <button onClick={() => setOpen(true)} style={customTriggerStyle(v)}>{triggerText}</button>
  })()

  const confirmBtn = (() => {
    if (framework === 'bootstrap') return <button className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>{confirmText}</button>
    if (framework === 'tailwind') return <button className="border-none cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors" onClick={() => setOpen(false)}>{confirmText}</button>
    return <button onClick={() => setOpen(false)} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>{confirmText}</button>
  })()

  const cancelBtn = (() => {
    if (framework === 'bootstrap') return <button className="btn btn-outline-secondary btn-sm" onClick={() => setOpen(false)}>{cancelText}</button>
    if (framework === 'tailwind') return <button className="border border-gray-300 cursor-pointer px-4 py-2 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors" onClick={() => setOpen(false)}>{cancelText}</button>
    return <button onClick={() => setOpen(false)} style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' }}>{cancelText}</button>
  })()

  return (
    <div style={{ display: 'inline-block', fontFamily: 'inherit', ...style }}>
      {triggerBtn}

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'var(--color-bg)', borderRadius: 12, padding: '28px 28px 24px', width: '100%', maxWidth: 560, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', position: 'relative' }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: 14, right: 16, border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-muted)', lineHeight: 1, padding: 4 }}
              aria-label="Close"
            >
              ✕
            </button>
            <h2 style={{ margin: '0 0 12px', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</h2>
            <p style={{ margin: '0 0 24px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{body}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              {cancelBtn}
              {confirmBtn}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(ModalElement)
