'use client'

import { useRef } from 'react'
import type { ChartDataSource } from '@/types/builder.types'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import SelectInput from '@/components/builder/controls/SelectInput'
import TextInput from '@/components/builder/controls/TextInput'

const SOURCE_OPTIONS = [
  { label: 'JSON (inline)', value: 'json' },
  { label: 'CSV upload', value: 'csv' },
  { label: 'API endpoint', value: 'api' },
]

const METHOD_OPTIONS = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
]

interface Props {
  dataSource?: ChartDataSource
  onChange: (ds: ChartDataSource) => void
}

export default function ChartDataSourcePanel({ dataSource, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const src = dataSource ?? { sourceType: 'json' }

  function patch(patch: Partial<ChartDataSource>) {
    onChange({ ...src, ...patch })
  }

  function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      patch({ csvRaw: ev.target?.result as string })
    }
    reader.readAsText(file)
  }

  function handleJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      patch({ jsonRaw: ev.target?.result as string })
    }
    reader.readAsText(file)
  }

  return (
    <PropGroup label="Data Source">
      <PropRow label="Source type">
        <SelectInput
          value={src.sourceType}
          options={SOURCE_OPTIONS}
          onChange={(v) => patch({ sourceType: v as ChartDataSource['sourceType'] })}
        />
      </PropRow>

      {src.sourceType === 'json' && (
        <>
          <PropRow label="Upload JSON" stack>
            <input ref={fileRef} type="file" accept=".json" onChange={handleJSON} style={{ display: 'none' }} />
            <button
              onClick={() => fileRef.current?.click()}
              style={uploadBtnStyle}
            >
              {src.jsonRaw ? '✓ JSON loaded — re-upload' : '↑ Upload JSON file'}
            </button>
          </PropRow>
          {src.jsonRaw && (
            <p style={{ fontSize: '0.7rem', color: '#10b981', margin: '4px 0 0', padding: '0 4px' }}>
              JSON loaded ({src.jsonRaw.length} chars)
            </p>
          )}
          <p style={hintStyle}>
            Expected format: <code style={{ fontSize: '0.68rem' }}>{`{"labels":[],"datasets":[{"label":"","data":[]}]}`}</code>
          </p>
        </>
      )}

      {src.sourceType === 'csv' && (
        <>
          <PropRow label="Upload CSV" stack>
            <input type="file" accept=".csv" onChange={handleCSV} style={{ display: 'none' }} id="csv-upload" />
            <button
              onClick={() => document.getElementById('csv-upload')?.click()}
              style={uploadBtnStyle}
            >
              {src.csvRaw ? '✓ CSV loaded — re-upload' : '↑ Upload CSV file'}
            </button>
          </PropRow>
          {src.csvRaw && (
            <p style={{ fontSize: '0.7rem', color: '#10b981', margin: '4px 0 0', padding: '0 4px' }}>
              CSV loaded ({src.csvRaw.split('\n').length} rows)
            </p>
          )}
          <p style={hintStyle}>First row = headers (labels), subsequent rows = data values.</p>
        </>
      )}

      {src.sourceType === 'api' && (
        <>
          <PropRow label="URL" stack>
            <TextInput
              value={src.apiUrl ?? ''}
              onChange={(v) => patch({ apiUrl: v })}
              placeholder="https://api.example.com/data"
            />
          </PropRow>
          <PropRow label="Method">
            <SelectInput
              value={src.apiMethod ?? 'GET'}
              options={METHOD_OPTIONS}
              onChange={(v) => patch({ apiMethod: v as 'GET' | 'POST' })}
            />
          </PropRow>
          <div style={{ margin: '6px 4px 0', padding: '8px 10px', borderRadius: 6, backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <p style={{ fontSize: '0.7rem', color: '#92400e', margin: 0, lineHeight: 1.5 }}>
              API integration is available at runtime. In the builder, charts display sample data. The configured endpoint will be called when the published page loads.
            </p>
          </div>
        </>
      )}
    </PropGroup>
  )
}

const uploadBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '7px',
  fontSize: '0.8rem',
  border: '1px dashed #d1d5db',
  borderRadius: 6,
  background: 'none',
  color: '#6b7280',
  cursor: 'pointer',
  textAlign: 'center',
}

const hintStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: '#9ca3af',
  margin: '4px 4px 0',
  lineHeight: 1.5,
}
