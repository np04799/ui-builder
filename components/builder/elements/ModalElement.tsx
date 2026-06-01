'use client'

import { memo, useState, useId } from 'react'
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

function ModalElement({ triggerText = 'Open Modal', triggerVariant = 'primary', title = 'Modal Title', body = 'Modal body content.', confirmText = 'Confirm', cancelText = 'Cancel', style }: Props) {
  const uid = useId().replace(/:/g, '')
  const framework = useFramework()
  const [open, setOpen] = useState(false)

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    const btnClass = triggerVariant === 'outline' ? 'btn btn-outline-primary' : triggerVariant === 'secondary' ? 'btn btn-secondary' : triggerVariant === 'ghost' ? 'btn btn-link' : 'btn btn-primary'
    return (
      <div style={{ display: 'inline-block', ...style }}>
        <button type="button" className={btnClass} onClick={() => setOpen(true)}>{triggerText}</button>
        {open && (
          <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={() => setOpen(false)} />
            <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true" style={{ zIndex: 1050 }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <button type="button" className="btn-close" onClick={() => setOpen(false)} aria-label="Close" />
                  </div>
                  <div className="modal-body"><p className="mb-0">{body}</p></div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>{cancelText}</button>
                    <button type="button" className="btn btn-primary" onClick={() => setOpen(false)}>{confirmText}</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // ── Tailwind ───────────────────────────────────────────────────────────────
  if (framework === 'tailwind') {
    const btnClass = triggerVariant === 'outline'
      ? 'inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
      : 'inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700'
    return (
      <div style={{ display: 'inline-block', ...style }}>
        <button className={btnClass} onClick={() => setOpen(true)}>{triggerText}</button>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">{title}</h3>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
              </div>
              <p className="text-sm text-gray-600 mb-5">{body}</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">{cancelText}</button>
                <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{confirmText}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Custom / MUI ───────────────────────────────────────────────────────────
  function triggerStyle(): React.CSSProperties {
    const base: React.CSSProperties = { padding: '9px 20px', borderRadius: 7, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', border: '1.5px solid transparent', transition: 'opacity 150ms' }
    if (triggerVariant === 'primary') return { ...base, backgroundColor: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)' }
    if (triggerVariant === 'secondary') return { ...base, backgroundColor: 'var(--color-secondary)', color: '#fff' }
    if (triggerVariant === 'outline') return { ...base, backgroundColor: 'transparent', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }
    return { ...base, backgroundColor: 'transparent', color: 'var(--color-text-primary)' }
  }

  return (
    <div style={{ display: 'inline-block', fontFamily: 'inherit', ...style }}>
      <button onClick={() => setOpen(true)} style={triggerStyle()}>{triggerText}</button>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'var(--color-bg)', borderRadius: 12, padding: '28px 28px 24px', width: '100%', maxWidth: 560, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 14, right: 16, border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-text-secondary)' }} aria-label="Close">✕</button>
            <h2 style={{ margin: '0 0 12px', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</h2>
            <p style={{ margin: '0 0 24px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{body}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setOpen(false)} style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' }}>{cancelText}</button>
              <button onClick={() => setOpen(false)} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>{confirmText}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(ModalElement)
