'use client'

import type { ChartDataset } from '@/types/builder.types'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'

interface Props {
  labels: string[]
  datasets: ChartDataset[]
  onLabelsChange: (labels: string[]) => void
  onDatasetsChange: (datasets: ChartDataset[]) => void
  /** When false, only one dataset is shown (pie/donut/polar) */
  multiDataset?: boolean
}

export default function ChartDatasetEditor({
  labels,
  datasets,
  onLabelsChange,
  onDatasetsChange,
  multiDataset = true,
}: Props) {
  function patchDataset(idx: number, patch: Partial<ChartDataset>) {
    onDatasetsChange(datasets.map((ds, i) => i === idx ? { ...ds, ...patch } : ds))
  }

  function patchDataPoint(dsIdx: number, ptIdx: number, val: string) {
    const n = parseFloat(val)
    const next = datasets.map((ds, i) => {
      if (i !== dsIdx) return ds
      const data = [...ds.data]
      data[ptIdx] = isNaN(n) ? 0 : n
      return { ...ds, data }
    })
    onDatasetsChange(next)
  }

  function patchLabel(idx: number, val: string) {
    const next = [...labels]
    next[idx] = val
    onLabelsChange(next)
  }

  function addLabel() {
    const newLabel = `Label ${labels.length + 1}`
    onLabelsChange([...labels, newLabel])
    onDatasetsChange(datasets.map((ds) => ({ ...ds, data: [...ds.data, 0] })))
  }

  function removeLabel(idx: number) {
    if (labels.length <= 1) return
    onLabelsChange(labels.filter((_, i) => i !== idx))
    onDatasetsChange(datasets.map((ds) => ({ ...ds, data: ds.data.filter((_, i) => i !== idx) })))
  }

  function addDataset() {
    onDatasetsChange([...datasets, { label: `Series ${datasets.length + 1}`, data: labels.map(() => 0) }])
  }

  function removeDataset(idx: number) {
    if (datasets.length <= 1) return
    onDatasetsChange(datasets.filter((_, i) => i !== idx))
  }

  return (
    <>
      {/* Labels */}
      <PropGroup label="Labels / Categories">
        {labels.map((lbl, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
            <div style={{ flex: 1 }}>
              <TextInput value={lbl} onChange={(v) => patchLabel(i, v)} placeholder={`Label ${i + 1}`} />
            </div>
            <button
              onClick={() => removeLabel(i)}
              disabled={labels.length <= 1}
              style={removeBtnStyle(labels.length <= 1)}
            >✕</button>
          </div>
        ))}
        <button onClick={addLabel} style={addBtnStyle}>+ Add label</button>
      </PropGroup>

      {/* Datasets */}
      {datasets.map((ds, dsIdx) => (
        <PropGroup key={dsIdx} label={multiDataset ? `Series: ${ds.label}` : 'Data values'} defaultOpen={dsIdx === 0}>
          {multiDataset && (
            <>
              <PropRow label="Name" stack>
                <TextInput value={ds.label} onChange={(v) => patchDataset(dsIdx, { label: v })} />
              </PropRow>
              <PropRow label="Color">
                <ColorSwatch value={ds.color ?? ''} onChange={(v) => patchDataset(dsIdx, { color: v })} />
              </PropRow>
            </>
          )}
          {labels.map((lbl, ptIdx) => (
            <PropRow key={ptIdx} label={lbl} stack>
              <TextInput
                value={String(ds.data[ptIdx] ?? 0)}
                onChange={(v) => patchDataPoint(dsIdx, ptIdx, v)}
                placeholder="0"
              />
            </PropRow>
          ))}
          {multiDataset && datasets.length > 1 && (
            <button onClick={() => removeDataset(dsIdx)} style={{ ...removeBtnStyle(false), marginTop: 6, width: '100%' }}>
              Remove series
            </button>
          )}
        </PropGroup>
      ))}

      {multiDataset && (
        <div style={{ padding: '4px 16px 8px' }}>
          <button onClick={addDataset} style={addBtnStyle}>+ Add series</button>
        </div>
      )}
    </>
  )
}

function removeBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '3px 7px', fontSize: '0.7rem',
    border: '1px solid #fca5a5', borderRadius: 4,
    background: 'none', color: '#ef4444',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, flexShrink: 0,
  }
}

const addBtnStyle: React.CSSProperties = {
  width: '100%', padding: '6px',
  fontSize: '0.8rem', border: '1px dashed #d1d5db',
  borderRadius: 6, background: 'none',
  color: '#6b7280', cursor: 'pointer', marginTop: 4,
}
