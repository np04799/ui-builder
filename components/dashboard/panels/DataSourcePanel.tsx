'use client'

import { useState, useRef } from 'react'
import { useDashboardStore } from '@/store/dashboard.store'
import { parseCSV, parseJSONFile, parseJSONString, fetchAPISource } from '@/utils/dataParser'
import type { DashboardDataSource, DashboardWidget } from '@/types/dashboard.types'

type SourceTab = 'csv' | 'json' | 'api'

const REFRESH_OPTIONS = [
  { label: 'Off', value: 0 },
  { label: '30 seconds', value: 30_000 },
  { label: '1 minute', value: 60_000 },
  { label: '5 minutes', value: 300_000 },
]

interface Props {
  widget: DashboardWidget
}

export default function DataSourcePanel({ widget }: Props) {
  const addDataSource = useDashboardStore((s) => s.addDataSource)
  const updateWidget = useDashboardStore((s) => s.updateWidget)
  const dataSources = useDashboardStore((s) => s.dataSources)

  const [tab, setTab] = useState<SourceTab>('csv')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<DashboardDataSource | null>(null)

  // CSV
  const csvRef = useRef<HTMLInputElement>(null)

  // JSON
  const jsonRef = useRef<HTMLInputElement>(null)
  const [jsonText, setJsonText] = useState('')

  // API
  const [apiUrl, setApiUrl] = useState('')
  const [apiHeaders, setApiHeaders] = useState<{ key: string; value: string }[]>([])
  const [refreshInterval, setRefreshInterval] = useState(0)

  const existingSource = widget.dataSourceId
    ? dataSources.find((d) => d.id === widget.dataSourceId)
    : dataSources[0]

  async function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true); setError(null)
    try {
      const src = await parseCSV(file)
      setPreview(src)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleJSONFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true); setError(null)
    try {
      const src = await parseJSONFile(file)
      setPreview(src)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  function handleJSONText() {
    setError(null)
    try {
      const src = parseJSONString(jsonText)
      setPreview(src)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function handleAPIFetch() {
    if (!apiUrl.trim()) return
    setLoading(true); setError(null)
    try {
      const headers = Object.fromEntries(
        apiHeaders.filter((h) => h.key.trim()).map((h) => [h.key, h.value])
      )
      const src = await fetchAPISource(apiUrl.trim(), headers)
      setPreview({ ...src, refreshInterval })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  function handleUseData() {
    if (!preview) return
    addDataSource(preview)
    updateWidget(widget.id, { dataSourceId: preview.id })
    setPreview(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Connected source info */}
      {existingSource && (
        <div style={{
          padding: '8px 12px', borderRadius: 8,
          backgroundColor: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: '0.875rem' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#065f46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {existingSource.name}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
              {existingSource.rows.length} rows · {existingSource.columns.length} columns
            </div>
          </div>
          <button
            onClick={() => updateWidget(widget.id, { dataSourceId: null })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '0.75rem' }}
          >
            Change
          </button>
        </div>
      )}

      {/* Source type tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
        {(['csv', 'json', 'api'] as SourceTab[]).map((t) => (
          <button key={t} onClick={() => { setTab(t); setError(null); setPreview(null) }}
            style={{
              flex: 1, padding: '6px 0', border: 'none', backgroundColor: 'transparent',
              borderBottom: tab === t ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: tab === t ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: tab === t ? 700 : 400, fontSize: '0.75rem', cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: -1,
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CSV Tab */}
      {tab === 'csv' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input ref={csvRef} type="file" accept=".csv" onChange={handleCSV} style={{ display: 'none' }} />
          <button onClick={() => csvRef.current?.click()} style={uploadBtnStyle}>
            <i className="bi bi-upload" style={{ marginRight: 6 }} />
            {loading ? 'Parsing…' : 'Upload CSV file'}
          </button>
          <p style={hintStyle}>First row = column headers. Numeric values auto-detected.</p>
        </div>
      )}

      {/* JSON Tab */}
      {tab === 'json' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input ref={jsonRef} type="file" accept=".json" onChange={handleJSONFile} style={{ display: 'none' }} />
          <button onClick={() => jsonRef.current?.click()} style={uploadBtnStyle}>
            <i className="bi bi-upload" style={{ marginRight: 6 }} />
            Upload JSON file
          </button>
          <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>— or paste JSON —</div>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder={'[\n  {"month": "Jan", "sales": 1200},\n  {"month": "Feb", "sales": 1500}\n]'}
            rows={5}
            style={{
              width: '100%', borderRadius: 6, border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)',
              fontSize: '0.72rem', padding: '8px', fontFamily: 'monospace',
              resize: 'vertical', boxSizing: 'border-box', outline: 'none',
            }}
          />
          <button onClick={handleJSONText} disabled={!jsonText.trim()} style={{ ...uploadBtnStyle, opacity: jsonText.trim() ? 1 : 0.5 }}>
            Parse JSON
          </button>
        </div>
      )}

      {/* API Tab */}
      {tab === 'api' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label style={labelStyle}>Endpoint URL</label>
            <input
              value={apiUrl} onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.example.com/data"
              style={inputStyle}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <label style={labelStyle}>Headers (optional)</label>
              <button
                onClick={() => setApiHeaders([...apiHeaders, { key: '', value: '' }])}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '0.7rem' }}
              >
                + Add
              </button>
            </div>
            {apiHeaders.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                <input
                  value={h.key} onChange={(e) => { const arr = [...apiHeaders]; arr[i].key = e.target.value; setApiHeaders(arr) }}
                  placeholder="Key" style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  value={h.value} onChange={(e) => { const arr = [...apiHeaders]; arr[i].value = e.target.value; setApiHeaders(arr) }}
                  placeholder="Value" style={{ ...inputStyle, flex: 2 }}
                />
                <button onClick={() => setApiHeaders(apiHeaders.filter((_, j) => j !== i))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.8rem' }}>×</button>
              </div>
            ))}
          </div>
          <div>
            <label style={labelStyle}>Auto-refresh</label>
            <select value={refreshInterval} onChange={(e) => setRefreshInterval(Number(e.target.value))} style={inputStyle}>
              {REFRESH_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <button onClick={handleAPIFetch} disabled={!apiUrl.trim() || loading} style={{ ...uploadBtnStyle, opacity: apiUrl.trim() ? 1 : 0.5 }}>
            <i className="bi bi-cloud-download" style={{ marginRight: 6 }} />
            {loading ? 'Fetching…' : 'Fetch Data'}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '8px 12px', borderRadius: 6, backgroundColor: '#fef2f2', border: '1px solid #fca5a5', fontSize: '0.75rem', color: '#dc2626' }}>
          <i className="bi bi-exclamation-triangle" style={{ marginRight: 6 }} />
          {error}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ padding: '6px 10px', borderRadius: 6, backgroundColor: 'rgba(99,102,241,0.08)', fontSize: '0.75rem', color: 'var(--color-primary)' }}>
            ✓ {preview.rows.length} rows · {preview.columns.length} columns detected
          </div>
          <PreviewTable rows={preview.rows.slice(0, 4)} columns={preview.columns.map((c) => c.name)} />
          <button onClick={handleUseData} style={{ ...uploadBtnStyle, backgroundColor: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)', fontWeight: 700 }}>
            Use this data →
          </button>
        </div>
      )}
    </div>
  )
}

function PreviewTable({ rows, columns }: { rows: Record<string, unknown>[]; columns: string[] }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 6, border: '1px solid var(--color-border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} style={{ padding: '4px 8px', borderBottom: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-selected)', color: 'var(--color-text-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c} style={{ padding: '3px 8px', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {String(row[c] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const uploadBtnStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: 6,
  border: '1px dashed var(--color-border)',
  backgroundColor: 'transparent', color: 'var(--color-text-secondary)',
  cursor: 'pointer', fontSize: '0.8rem', textAlign: 'center',
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '6px 8px', borderRadius: 6,
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)',
  fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.7rem', fontWeight: 600,
  color: 'var(--color-text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em',
}
const hintStyle: React.CSSProperties = { fontSize: '0.7rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }
