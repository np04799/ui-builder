'use client'

import { memo, useState, useId } from 'react'
import type { ButtonVariant } from '@/types/builder.types'
import { useFramework } from '@/hooks/useFramework'
import { usePreviewState } from '@/components/builder/elements/PreviewStateContext'

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
  const isPreview = usePreviewState() !== null
  const [open, setOpen] = useState(false)
  // In builder mode, the trigger never opens the modal; instead we show a preview tile
  const handleOpen = isPreview ? () => setOpen(true) : () => {}

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (framework === 'bootstrap') {
    const btnClass = triggerVariant === 'outline' ? 'btn btn-outline-primary' : triggerVariant === 'secondary' ? 'btn btn-secondary' : triggerVariant === 'ghost' ? 'btn btn-link' : 'btn btn-primary'
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 8, ...style }}>
        <button type="button" className={btnClass} onClick={handleOpen} style={{ alignSelf: 'flex-start' }}>{triggerText}</button>
        {/* Builder-mode inline preview so user can see / edit the modal content */}
        {!isPreview && (
          <div className="card" style={{ maxWidth: 420, marginTop: 4, opacity: 0.95 }}>
            <div className="card-header d-flex align-items-center justify-content-between py-2 px-3" style={{ fontSize: '0.7rem' }}>
              <span className="text-body-secondary fw-semibold text-uppercase">Modal preview</span>
              <span className="badge text-bg-light text-body-secondary">Builder only</span>
            </div>
            <div className="card-body p-3">
              <h6 className="fw-bold mb-2">{title}</h6>
              <p className="small text-body-secondary mb-3">{body}</p>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-sm btn-secondary" disabled>{cancelText}</button>
                <button type="button" className="btn btn-sm btn-primary" disabled>{confirmText}</button>
              </div>
            </div>
          </div>
        )}
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
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 8, ...style }}>
        <button className={btnClass} onClick={handleOpen}>{triggerText}</button>
        {!isPreview && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm" style={{ maxWidth: 420 }}>
            <div className="flex items-center justify-between border-b border-gray-200 px-3 py-1.5">
              <span className="text-[0.65rem] font-semibold text-gray-500 uppercase">Modal preview</span>
              <span className="text-[0.65rem] bg-gray-100 text-gray-600 rounded px-1.5 py-0.5">Builder only</span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-xs text-gray-500 mb-3">{body}</p>
              <div className="flex justify-end gap-2">
                <button disabled className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-500 opacity-60">{cancelText}</button>
                <button disabled className="px-3 py-1 text-xs bg-indigo-600 text-white rounded opacity-60">{confirmText}</button>
              </div>
            </div>
          </div>
        )}
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

  // ── MUI ───────────────────────────────────────────────────────────────────
  if (framework === 'mui') {
    const muiTriggerStyle: React.CSSProperties = triggerVariant === 'outline'
      ? { ...triggerStyle(), fontFamily: 'Roboto,sans-serif', textTransform: 'uppercase', letterSpacing: '0.02857em', fontSize: '0.875rem' }
      : { ...triggerStyle(), fontFamily: 'Roboto,sans-serif', textTransform: 'uppercase', letterSpacing: '0.02857em', fontSize: '0.875rem' }
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 8, fontFamily: 'Roboto, sans-serif', ...style }}>
        <button onClick={handleOpen} className={`MuiButton-root MuiButton-${triggerVariant === 'primary' ? 'contained' : triggerVariant === 'outline' ? 'outlined' : 'text'}`} style={{ alignSelf: 'flex-start' }}>{triggerText}</button>
        {open && isPreview && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1300 }} />
            <div className="MuiPaper-root MuiPaper-elevation24" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 1400, backgroundColor: '#fff', borderRadius: 4, minWidth: 400, maxWidth: '90vw', boxShadow: '0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12)' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(0,0,0,0.12)' }}><h2 className="MuiTypography-root MuiTypography-h6" style={{ margin: 0 }}>{title}</h2></div>
              <div style={{ padding: '20px 24px' }}><p className="MuiTypography-root MuiTypography-body1" style={{ margin: 0 }}>{body}</p></div>
              <div style={{ padding: '8px 8px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button onClick={() => setOpen(false)} className="MuiButton-root MuiButton-text">{cancelText}</button>
                <button onClick={() => setOpen(false)} className="MuiButton-root MuiButton-contained">{confirmText}</button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 8, fontFamily: 'inherit', ...style }}>
      <button onClick={handleOpen} style={{ ...triggerStyle(), alignSelf: 'flex-start' }}>{triggerText}</button>
      {!isPreview && (
        <div style={{ maxWidth: 420, backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Modal preview</span>
            <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-secondary)', borderRadius: 4, padding: '1px 6px' }}>Builder only</span>
          </div>
          <div style={{ padding: 12 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</h3>
            <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{body}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button disabled style={{ padding: '4px 10px', fontSize: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 4, background: 'transparent', color: 'var(--color-text-secondary)', opacity: 0.6 }}>{cancelText}</button>
              <button disabled style={{ padding: '4px 10px', fontSize: '0.75rem', border: 'none', borderRadius: 4, background: 'var(--color-primary)', color: '#fff', opacity: 0.6 }}>{confirmText}</button>
            </div>
          </div>
        </div>
      )}
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
