'use client'

import type { FormField, FormStylePreset } from '@/types/builder.types'
import { useFramework } from '@/hooks/useFramework'

interface Props {
  fields: FormField[]
  submitLabel?: string
  formStyle?: FormStylePreset
  style?: React.CSSProperties
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const FORM_CSS = `

/* ════════════════════════════════════════════════
   1. CLEAN SAAS  — rounded pill inputs, glow focus,
      shimmer-sweep submit button
════════════════════════════════════════════════ */
.bp-saas { --acc: #6366f1; }
.bp-saas .bp-field-wrap { position: relative; }
.bp-saas .bp-field-icon {
  position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
  color: #94a3b8; pointer-events: none; display: flex; align-items: center;
  transition: color 200ms;
}
.bp-saas .bp-field-icon.textarea-icon { top: 14px; transform: none; }
.bp-saas input, .bp-saas textarea, .bp-saas select {
  width: 100%; box-sizing: border-box; font-family: inherit;
  background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
  padding: 12px 14px 12px 40px; font-size: 0.9rem; color: #0f172a;
  transition: border-color 220ms, box-shadow 220ms, background 220ms; outline: none;
}
.bp-saas textarea { padding-top: 12px; resize: vertical; }
.bp-saas select { padding-left: 40px; }
.bp-saas input:focus, .bp-saas textarea:focus, .bp-saas select:focus {
  border-color: #6366f1; background: #fafaff;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.13), 0 2px 8px rgba(99,102,241,0.08);
}
.bp-saas .bp-field-wrap:focus-within .bp-field-icon { color: #6366f1; }

.bp-saas .bp-btn {
  position: relative; overflow: hidden;
  padding: 13px 32px; background: #6366f1; color: #fff;
  border: none; border-radius: 12px; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; font-family: inherit; letter-spacing: 0.01em;
  box-shadow: 0 4px 14px rgba(99,102,241,0.35);
  transition: transform 180ms ease, box-shadow 180ms ease;
  display: inline-flex; align-items: center; gap: 8px;
}
.bp-saas .bp-btn::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.28) 50%, transparent 60%);
  transform: translateX(-100%); transition: transform 600ms ease;
}
.bp-saas .bp-btn:hover::before { transform: translateX(100%); }
.bp-saas .bp-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.45); }
.bp-saas .bp-btn:active { transform: translateY(0); }
.bp-saas .bp-btn .btn-arrow {
  transition: transform 240ms ease;
}
.bp-saas .bp-btn:hover .btn-arrow { transform: translateX(4px); }


/* ════════════════════════════════════════════════
   2. NEON DARK  — deep dark card, neon-glow inputs,
      pulsing ring submit
════════════════════════════════════════════════ */
.bp-neon { --acc: #a78bfa; }
.bp-neon .bp-field-wrap { position: relative; }
.bp-neon .bp-field-icon {
  position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
  color: #6b7280; pointer-events: none; display: flex; align-items: center;
  transition: color 200ms;
}
.bp-neon .bp-field-icon.textarea-icon { top: 14px; transform: none; }
.bp-neon input, .bp-neon textarea, .bp-neon select {
  width: 100%; box-sizing: border-box; font-family: inherit;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 12px 14px 12px 40px; font-size: 0.9rem; color: #f1f5f9;
  transition: border-color 220ms, box-shadow 220ms; outline: none;
}
.bp-neon input::placeholder, .bp-neon textarea::placeholder { color: rgba(255,255,255,0.25); }
.bp-neon textarea { padding-top: 12px; resize: vertical; }
.bp-neon select { padding-left: 40px; color: #f1f5f9; background: rgba(255,255,255,0.06); }
.bp-neon input:focus, .bp-neon textarea:focus, .bp-neon select:focus {
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(167,139,250,0.18), 0 0 16px rgba(167,139,250,0.12);
}
.bp-neon .bp-field-wrap:focus-within .bp-field-icon { color: #a78bfa; }

@keyframes bp-pulse-ring {
  0%   { box-shadow: 0 0 0 0 rgba(167,139,250,0.6); }
  70%  { box-shadow: 0 0 0 10px rgba(167,139,250,0); }
  100% { box-shadow: 0 0 0 0 rgba(167,139,250,0); }
}
.bp-neon .bp-btn {
  position: relative;
  padding: 13px 32px; background: linear-gradient(135deg,#7c3aed,#a78bfa);
  color: #fff; border: none; border-radius: 10px;
  font-size: 0.9rem; font-weight: 700; cursor: pointer; font-family: inherit;
  box-shadow: 0 4px 20px rgba(124,58,237,0.45);
  transition: transform 180ms, box-shadow 180ms;
  display: inline-flex; align-items: center; gap: 8px;
}
.bp-neon .bp-btn:hover { animation: bp-pulse-ring 1s ease-out infinite; transform: translateY(-1px); }
.bp-neon .bp-btn:active { transform: scale(0.97); }


/* ════════════════════════════════════════════════
   3. GLASS AURORA  — aurora gradient backdrop,
      frosted inputs, slide-right button
════════════════════════════════════════════════ */
.bp-aurora .bp-field-wrap { position: relative; }
.bp-aurora .bp-field-icon {
  position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
  color: rgba(255,255,255,0.45); pointer-events: none; display: flex; align-items: center;
  transition: color 200ms;
}
.bp-aurora .bp-field-icon.textarea-icon { top: 14px; transform: none; }
.bp-aurora input, .bp-aurora textarea, .bp-aurora select {
  width: 100%; box-sizing: border-box; font-family: inherit;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  border-radius: 14px; padding: 13px 14px 13px 40px; font-size: 0.9rem; color: #fff;
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  transition: border-color 220ms, background 220ms, box-shadow 220ms; outline: none;
}
.bp-aurora input::placeholder, .bp-aurora textarea::placeholder { color: rgba(255,255,255,0.35); }
.bp-aurora textarea { padding-top: 12px; resize: vertical; }
.bp-aurora select { padding-left: 40px; }
.bp-aurora input:focus, .bp-aurora textarea:focus, .bp-aurora select:focus {
  background: rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.5);
  box-shadow: 0 0 0 4px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2);
}
.bp-aurora .bp-field-wrap:focus-within .bp-field-icon { color: rgba(255,255,255,0.85); }

.bp-aurora .bp-btn {
  position: relative; overflow: hidden;
  padding: 14px 36px; background: rgba(255,255,255,0.92); color: #4f46e5;
  border: none; border-radius: 14px; font-size: 0.9rem; font-weight: 700;
  cursor: pointer; font-family: inherit; letter-spacing: 0.01em;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  transition: transform 200ms, box-shadow 200ms;
  display: inline-flex; align-items: center; gap: 8px;
}
.bp-aurora .bp-btn:hover { transform: translateX(4px) translateY(-1px); box-shadow: 0 12px 40px rgba(0,0,0,0.25); }
.bp-aurora .bp-btn:active { transform: scale(0.97); }
.bp-aurora .bp-btn .btn-arrow { transition: transform 240ms ease; }
.bp-aurora .bp-btn:hover .btn-arrow { transform: translateX(6px); }


/* ════════════════════════════════════════════════
   4. FLOATING LABEL  — filled trough + animated
      label, gradient underline, magnetic button
════════════════════════════════════════════════ */
.bp-float-wrap { position: relative; }
.bp-float-wrap input, .bp-float-wrap textarea, .bp-float-wrap select {
  width: 100%; box-sizing: border-box; font-family: inherit;
  background: #f1f5f9; border: none;
  border-bottom: 2px solid #cbd5e1;
  border-radius: 10px 10px 0 0; padding: 22px 14px 9px; font-size: 0.9375rem; color: #0f172a;
  transition: border-color 220ms, background 220ms; outline: none;
}
.bp-float-wrap textarea { resize: vertical; }
.bp-float-wrap input:focus, .bp-float-wrap textarea:focus, .bp-float-wrap select:focus {
  background: #e8edf5; border-color: #6366f1;
}
.bp-float-label {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  font-size: 0.9375rem; color: #94a3b8; pointer-events: none;
  transition: all 170ms cubic-bezier(0.4,0,0.2,1);
}
.bp-float-wrap textarea ~ .bp-float-label { top: 17px; transform: none; }
.bp-float-wrap input:not(:placeholder-shown) ~ .bp-float-label,
.bp-float-wrap input:focus ~ .bp-float-label,
.bp-float-wrap textarea:not(:placeholder-shown) ~ .bp-float-label,
.bp-float-wrap textarea:focus ~ .bp-float-label,
.bp-float-wrap select:focus ~ .bp-float-label {
  top: 7px; transform: none; font-size: 0.6875rem; color: #6366f1; font-weight: 700; letter-spacing: 0.05em;
}

.bp-floating .bp-btn {
  position: relative; overflow: hidden;
  padding: 13px 32px; background: linear-gradient(90deg,#6366f1,#8b5cf6,#6366f1);
  background-size: 200% auto; color: #fff;
  border: none; border-radius: 10px; font-size: 0.9rem; font-weight: 700;
  cursor: pointer; font-family: inherit;
  box-shadow: 0 4px 16px rgba(99,102,241,0.38);
  transition: background-position 400ms ease, transform 180ms, box-shadow 180ms;
  display: inline-flex; align-items: center; gap: 8px;
}
.bp-floating .bp-btn:hover {
  background-position: right center;
  transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.5);
}
.bp-floating .bp-btn:active { transform: scale(0.97); }
.bp-floating .bp-btn .btn-arrow { transition: transform 240ms ease; }
.bp-floating .bp-btn:hover .btn-arrow { transform: translateX(4px); }


/* ════════════════════════════════════════════════
   5. NEUMORPHIC  — soft-UI raised inputs,
      pressed-in focus, soft 3D button
════════════════════════════════════════════════ */
.bp-neu { --bg: #e8edf2; }
.bp-neu .bp-field-wrap { position: relative; }
.bp-neu .bp-field-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: #94a3b8; pointer-events: none; display: flex; align-items: center;
  transition: color 200ms;
}
.bp-neu .bp-field-icon.textarea-icon { top: 14px; transform: none; }
.bp-neu input, .bp-neu textarea, .bp-neu select {
  width: 100%; box-sizing: border-box; font-family: inherit;
  background: #e8edf2;
  border: none; border-radius: 12px;
  box-shadow: 6px 6px 12px #c8cdd2, -6px -6px 12px #ffffff;
  padding: 13px 14px 13px 42px; font-size: 0.9rem; color: #374151;
  transition: box-shadow 220ms; outline: none;
}
.bp-neu textarea { padding-top: 12px; resize: vertical; }
.bp-neu input:focus, .bp-neu textarea:focus, .bp-neu select:focus {
  box-shadow: inset 4px 4px 8px #c8cdd2, inset -4px -4px 8px #ffffff;
}
.bp-neu .bp-field-wrap:focus-within .bp-field-icon { color: #6366f1; }

.bp-neu .bp-btn {
  padding: 13px 30px; background: #e8edf2; color: #4f46e5;
  border: none; border-radius: 12px; font-size: 0.9rem; font-weight: 700;
  cursor: pointer; font-family: inherit;
  box-shadow: 5px 5px 10px #c8cdd2, -5px -5px 10px #ffffff;
  transition: box-shadow 180ms, transform 180ms;
  display: inline-flex; align-items: center; gap: 8px;
}
.bp-neu .bp-btn:hover {
  box-shadow: 8px 8px 16px #c0c5ca, -8px -8px 16px #ffffff;
  transform: translateY(-1px);
}
.bp-neu .bp-btn:active {
  box-shadow: inset 3px 3px 6px #c0c5ca, inset -3px -3px 6px #ffffff;
  transform: translateY(0);
}


/* ════════════════════════════════════════════════
   6. EDITORIAL BOLD  — high-contrast mono, thick
      bottom border, uppercase labels, fill-reveal
      button animation
════════════════════════════════════════════════ */
.bp-editorial .bp-field-wrap { position: relative; }
.bp-editorial .bp-field-icon {
  position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  color: #9ca3af; pointer-events: none; display: flex; align-items: center;
  transition: color 200ms;
}
.bp-editorial .bp-field-icon.textarea-icon { top: 10px; transform: none; }
.bp-editorial input, .bp-editorial textarea, .bp-editorial select {
  width: 100%; box-sizing: border-box; font-family: inherit;
  background: transparent; border: none; border-bottom: 2.5px solid #d1d5db;
  border-radius: 0; padding: 11px 0 11px 26px; font-size: 1rem; color: #111827;
  transition: border-color 220ms; outline: none;
}
.bp-editorial textarea { padding-top: 10px; resize: vertical; }
.bp-editorial input:focus, .bp-editorial textarea:focus, .bp-editorial select:focus {
  border-color: #111827;
}
.bp-editorial .bp-field-wrap:focus-within .bp-field-icon { color: #111827; }

.bp-editorial .bp-btn {
  position: relative; overflow: hidden;
  padding: 14px 36px; background: transparent; color: #111827;
  border: 2.5px solid #111827; border-radius: 0; font-size: 0.875rem; font-weight: 800;
  letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; font-family: inherit;
  transition: color 300ms;
  display: inline-flex; align-items: center; gap: 10px;
  z-index: 0;
}
.bp-editorial .bp-btn::after {
  content: ''; position: absolute; inset: 0; background: #111827;
  transform: translateY(101%); transition: transform 300ms cubic-bezier(0.4,0,0.2,1);
  z-index: -1;
}
.bp-editorial .bp-btn:hover::after { transform: translateY(0); }
.bp-editorial .bp-btn:hover { color: #fff; }
.bp-editorial .bp-btn .btn-arrow { transition: transform 300ms ease; }
.bp-editorial .bp-btn:hover .btn-arrow { transform: translateX(6px); }

`

// ─── Icons ────────────────────────────────────────────────────────────────────

function FieldIcon({ type }: { type: string }) {
  if (type === 'email') return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="13" height="9" rx="2" />
      <path d="M1 5l6.5 4.5L14 5" />
    </svg>
  )
  if (type === 'textarea') return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h11M2 7.5h8M2 11h5" />
    </svg>
  )
  if (type === 'select') return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6l3.5 3.5L11 6" />
    </svg>
  )
  // text / default
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h9M3 7.5h9M3 11h5" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg className="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

// ─── Field renderers ──────────────────────────────────────────────────────────

function BasicField({ field, hasIcon, isEditorial }: { field: FormField; hasIcon: boolean; isEditorial?: boolean }) {
  const iconCls = `bp-field-icon${field.type === 'textarea' ? ' textarea-icon' : ''}`

  if (field.type === 'checkbox') return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <input type="checkbox" style={{ width: 17, height: 17, accentColor: '#6366f1', flexShrink: 0, borderRadius: 4 }} />
      <span style={{ fontSize: '0.875rem' }}>{field.placeholder ?? field.label}</span>
    </label>
  )
  if (field.type === 'radio') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {(field.options ?? ['Option A', 'Option B']).map((o) => (
        <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
          <input type="radio" name={field.id} style={{ accentColor: '#6366f1' }} />
          <span style={{ fontSize: '0.875rem' }}>{o}</span>
        </label>
      ))}
    </div>
  )

  const noIcon = !hasIcon || isEditorial
  const pl = noIcon ? undefined : undefined // padding handled by CSS

  if (field.type === 'textarea') return (
    <div className="bp-field-wrap">
      {hasIcon && <span className={iconCls}><FieldIcon type="textarea" /></span>}
      <textarea placeholder={field.placeholder} rows={3} style={isEditorial ? { paddingLeft: hasIcon ? '26px' : '0' } : undefined} />
    </div>
  )
  if (field.type === 'select') return (
    <div className="bp-field-wrap">
      {hasIcon && <span className={iconCls}><FieldIcon type="select" /></span>}
      <select style={isEditorial ? { paddingLeft: hasIcon ? '26px' : '0' } : undefined}>
        {(field.options ?? ['Option 1', 'Option 2', 'Option 3']).map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
  return (
    <div className="bp-field-wrap">
      {hasIcon && <span className={iconCls}><FieldIcon type={field.type} /></span>}
      <input
        type={field.type === 'email' ? 'email' : 'text'}
        placeholder={field.placeholder}
        style={isEditorial ? { paddingLeft: hasIcon ? '26px' : '0' } : undefined}
      />
    </div>
  )
}

function FloatingField({ field }: { field: FormField }) {
  if (field.type === 'checkbox' || field.type === 'radio') {
    return <BasicField field={field} hasIcon={false} />
  }
  if (field.type === 'select') return (
    <div className="bp-float-wrap">
      <select>
        {(field.options ?? ['Option 1', 'Option 2', 'Option 3']).map((o) => <option key={o}>{o}</option>)}
      </select>
      <span className="bp-float-label">{field.label}{field.required && ' *'}</span>
    </div>
  )
  const Tag = field.type === 'textarea' ? 'textarea' : 'input'
  return (
    <div className="bp-float-wrap">
      <Tag
        type={field.type === 'textarea' ? undefined : field.type === 'email' ? 'email' : 'text'}
        placeholder=" "
        rows={field.type === 'textarea' ? 3 : undefined}
      />
      <span className="bp-float-label">{field.label}{field.required && ' *'}</span>
    </div>
  )
}

// ─── Preset configs ───────────────────────────────────────────────────────────

type PresetConfig = {
  cls: string
  formStyle: React.CSSProperties
  labelStyle: React.CSSProperties
  btnText?: string
  hasIcon: boolean
  isFloating?: boolean
  isEditorial?: boolean
  showLabel?: (f: FormField) => boolean
}

function getConfig(preset: FormStylePreset): PresetConfig {
  switch (preset) {

    case 'flat': // → Neon Dark
      return {
        cls: 'bp-neon',
        formStyle: {
          background: 'linear-gradient(160deg, #0f0f1a 0%, #1a1033 100%)',
          borderRadius: '20px',
          padding: '36px 32px',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        },
        labelStyle: {
          fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8',
          letterSpacing: '0.07em', textTransform: 'uppercase',
        },
        hasIcon: true,
      }

    case 'card': // → Glass Aurora
      return {
        cls: 'bp-aurora',
        formStyle: {
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 40%, #0ea5e9 100%)',
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: '0 20px 60px rgba(79,70,229,0.35)',
        },
        labelStyle: {
          fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        },
        hasIcon: true,
      }

    case 'floating': // → Floating Label
      return {
        cls: 'bp-floating',
        formStyle: {},
        labelStyle: { display: 'none' } as React.CSSProperties,
        hasIcon: false,
        isFloating: true,
        showLabel: () => false,
      }

    case 'minimal': // → Neumorphic
      return {
        cls: 'bp-neu',
        formStyle: {
          background: '#e8edf2',
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: '12px 12px 24px #c8cdd2, -12px -12px 24px #ffffff',
        },
        labelStyle: {
          fontSize: '0.8125rem', fontWeight: 600, color: '#6b7280',
        },
        hasIcon: true,
      }

    case 'glass': // → Editorial Bold
      return {
        cls: 'bp-editorial',
        formStyle: {},
        labelStyle: {
          fontSize: '0.6875rem', fontWeight: 800, color: '#6b7280',
          letterSpacing: '0.12em', textTransform: 'uppercase',
        },
        hasIcon: true,
        isEditorial: true,
      }

    default: // 'default' → Clean SaaS
      return {
        cls: 'bp-saas',
        formStyle: {},
        labelStyle: {
          fontSize: '0.8125rem', fontWeight: 500, color: '#475569',
        },
        hasIcon: true,
      }
  }
}

// ─── Submit button ────────────────────────────────────────────────────────────

function SubmitButton({ label, cls }: { label: string; cls: string }) {
  return (
    <button type="submit" className="bp-btn">
      {label}
      <ArrowIcon />
    </button>
  )
}

// ─── Framework-native form renderers ─────────────────────────────────────────

function BootstrapForm({ fields, submitLabel, style }: { fields: FormField[]; submitLabel: string; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <form onSubmit={(e) => e.preventDefault()}>
        {fields.map((field) => (
          <div key={field.id} className="mb-3">
            {field.type !== 'checkbox' && (
              <label className="form-label fw-medium">
                {field.label}{field.required && <span className="text-danger ms-1">*</span>}
              </label>
            )}
            {field.type === 'textarea' ? (
              <textarea className="form-control" placeholder={field.placeholder} rows={3} />
            ) : field.type === 'select' ? (
              <select className="form-select">
                {(field.options ?? ['Option 1', 'Option 2']).map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : field.type === 'checkbox' ? (
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id={field.id} />
                <label className="form-check-label" htmlFor={field.id}>{field.label}</label>
              </div>
            ) : (
              <input type={field.type === 'email' ? 'email' : 'text'} className="form-control" placeholder={field.placeholder} />
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
      </form>
    </div>
  )
}

function MuiForm({ fields, submitLabel, style }: { fields: FormField[]; submitLabel: string; style?: React.CSSProperties }) {
  return (
    <div className="mui-root" style={style}>
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {fields.map((field) => (
          <div key={field.id}>
            {field.type !== 'checkbox' && (
              <label className="MuiInputLabel-root">
                {field.label}{field.required && <span style={{ color: '#f44336', marginLeft: 3 }}>*</span>}
              </label>
            )}
            <div className="MuiTextField-root">
              <div className="MuiInputBase-root MuiOutlinedInput-root">
                {field.type === 'textarea' ? (
                  <textarea className="MuiOutlinedInput-input" placeholder={field.placeholder} rows={3} style={{ resize: 'vertical' }} />
                ) : field.type === 'select' ? (
                  <select className="MuiOutlinedInput-input">
                    {(field.options ?? ['Option 1', 'Option 2']).map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="checkbox" style={{ accentColor: 'var(--color-primary)', width: 18, height: 18 }} />
                    <span className="MuiTypography-root MuiTypography-body1">{field.label}</span>
                  </label>
                ) : (
                  <input type={field.type === 'email' ? 'email' : 'text'} className="MuiOutlinedInput-input" placeholder={field.placeholder} />
                )}
              </div>
            </div>
          </div>
        ))}
        <button type="submit" className="MuiButton-root MuiButton-contained" style={{ alignSelf: 'flex-start' }}>{submitLabel}</button>
      </form>
    </div>
  )
}

function TailwindForm({ fields, submitLabel, style }: { fields: FormField[]; submitLabel: string; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
        {fields.map((field) => (
          <div key={field.id} className="flex flex-col gap-1.5">
            {field.type !== 'checkbox' && (
              <label className="text-sm font-medium text-gray-700">
                {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {field.type === 'textarea' ? (
              <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-y" placeholder={field.placeholder} rows={3} />
            ) : field.type === 'select' ? (
              <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 outline-none">
                {(field.options ?? ['Option 1', 'Option 2']).map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : field.type === 'checkbox' ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-indigo-600" />
                <span className="text-sm text-gray-700">{field.label}</span>
              </label>
            ) : (
              <input type={field.type === 'email' ? 'email' : 'text'} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder={field.placeholder} />
            )}
          </div>
        ))}
        <button type="submit" className="self-start inline-flex items-center px-5 py-2.5 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">{submitLabel}</button>
      </form>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FormElement({ fields = [], submitLabel = 'Submit', formStyle = 'default', style }: Props) {
  const framework = useFramework()
  const cfg = getConfig(formStyle)

  if (framework === 'bootstrap') return <BootstrapForm fields={fields} submitLabel={submitLabel} style={style} />
  if (framework === 'mui') return <MuiForm fields={fields} submitLabel={submitLabel} style={style} />
  if (framework === 'tailwind') return <TailwindForm fields={fields} submitLabel={submitLabel} style={style} />

  return (
    <>
      <style>{FORM_CSS}</style>
      <div className={cfg.cls} style={{ ...cfg.formStyle, ...style }}>
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          onSubmit={(e) => e.preventDefault()}
        >
          {fields.map((field) => {
            const showLabel = cfg.showLabel ? cfg.showLabel(field) : field.type !== 'checkbox'
            return (
              <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {showLabel && (
                  <label style={cfg.labelStyle}>
                    {field.label}
                    {field.required && <span style={{ color: '#f87171', marginLeft: 3 }}>*</span>}
                  </label>
                )}
                {cfg.isFloating
                  ? <FloatingField field={field} />
                  : <BasicField field={field} hasIcon={cfg.hasIcon} isEditorial={cfg.isEditorial} />
                }
              </div>
            )
          })}

          <div style={{ paddingTop: 4 }}>
            <SubmitButton label={submitLabel} cls={cfg.cls} />
          </div>
        </form>
      </div>
    </>
  )
}
