'use client'

import { useRef, useState } from 'react'
import TextInput from './TextInput'

interface Props {
  src: string
  onChange: (url: string) => void
  /** Show a URL text field below the upload zone (default true) */
  showUrlInput?: boolean
}

export default function ImageUpload({ src, onChange, showUrlInput = true }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasSrc = Boolean(src)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Upload failed')
      onChange(json.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Preview / drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          position: 'relative',
          width: '100%',
          height: hasSrc ? 120 : 80,
          borderRadius: 8,
          border: '2px dashed var(--color-border)',
          backgroundColor: 'var(--color-bg)',
          overflow: 'hidden',
          cursor: uploading ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.15s',
        }}
      >
        {hasSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', pointerEvents: 'none' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>
              {uploading ? 'Uploading…' : 'Click or drag image here'}
            </span>
          </div>
        )}

        {uploading && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M14 3a11 11 0 1 1-7.78 3.22">
                <animateTransform attributeName="transform" type="rotate" from="0 14 14" to="360 14 14" dur="0.7s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>
        )}

        {hasSrc && !uploading && (
          <div
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(0,0,0,0.4)'
              const span = e.currentTarget.querySelector('span')
              if (span) span.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(0,0,0,0)'
              const span = e.currentTarget.querySelector('span')
              if (span) span.style.opacity = '0'
            }}
          >
            <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600, opacity: 0, transition: 'opacity 0.15s' }}>Replace image</span>
          </div>
        )}
      </div>

      {/* Action row */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            flex: 1,
            height: 30,
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: uploading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {hasSrc ? 'Replace' : 'Upload image'}
        </button>

        {hasSrc && (
          <button
            onClick={() => onChange('')}
            title="Remove image"
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)', marginTop: -4 }}>{error}</span>
      )}

      {/* URL text input — paste or type a URL directly */}
      {showUrlInput && (
        <TextInput
          value={src}
          onChange={onChange}
          placeholder="https://… or paste URL"
        />
      )}

      {/* Current URL read-only display when no url input shown */}
      {!showUrlInput && hasSrc && (
        <div
          title={src}
          style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '2px 0' }}
        >
          {src}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        style={{ display: 'none' }}
        onChange={onInputChange}
      />
    </div>
  )
}
