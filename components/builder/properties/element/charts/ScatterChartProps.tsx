'use client'

import type { ElementNode } from '@/types/store.types'
import type { ScatterDataset } from '@/types/builder.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'
import ChartDataSourcePanel from './ChartDataSourcePanel'

const BOOL_OPTIONS = [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]

interface Props { element: ElementNode }

export default function ScatterChartProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'chart-scatter') return null
  const { content, styles } = element

  function patch(p: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...p } })
  }

  function patchDataset(idx: number, p: Partial<ScatterDataset>) {
    const datasets = content.datasets.map((ds, i) => i === idx ? { ...ds, ...p } : ds)
    patch({ datasets })
  }

  function patchPoint(dsIdx: number, ptIdx: number, axis: 'x' | 'y', val: string) {
    const n = parseFloat(val)
    const datasets = content.datasets.map((ds, i) => {
      if (i !== dsIdx) return ds
      const data = ds.data.map((pt, j) => j === ptIdx ? { ...pt, [axis]: isNaN(n) ? 0 : n } : pt)
      return { ...ds, data }
    })
    patch({ datasets })
  }

  function addPoint(dsIdx: number) {
    const datasets = content.datasets.map((ds, i) => i === dsIdx ? { ...ds, data: [...ds.data, { x: 0, y: 0 }] } : ds)
    patch({ datasets })
  }

  function removePoint(dsIdx: number, ptIdx: number) {
    const datasets = content.datasets.map((ds, i) => i === dsIdx ? { ...ds, data: ds.data.filter((_, j) => j !== ptIdx) } : ds)
    patch({ datasets })
  }

  function addSeries() {
    patch({ datasets: [...content.datasets, { label: `Series ${content.datasets.length + 1}`, data: [{ x: 0, y: 0 }] }] })
  }

  return (
    <>
      <PropGroup label="Chart Settings">
        <PropRow label="Title" stack>
          <TextInput value={content.title ?? ''} onChange={(v) => patch({ title: v })} placeholder="Chart title" />
        </PropRow>
        <PropRow label="Show legend">
          <SelectInput value={content.showLegend !== false ? 'true' : 'false'} options={BOOL_OPTIONS} onChange={(v) => patch({ showLegend: v === 'true' })} />
        </PropRow>
        <PropRow label="Show grid">
          <SelectInput value={content.showGrid !== false ? 'true' : 'false'} options={BOOL_OPTIONS} onChange={(v) => patch({ showGrid: v === 'true' })} />
        </PropRow>
      </PropGroup>

      {content.datasets.map((ds, dsIdx) => (
        <PropGroup key={dsIdx} label={`Series: ${ds.label}`} defaultOpen={dsIdx === 0}>
          <PropRow label="Name" stack>
            <TextInput value={ds.label} onChange={(v) => patchDataset(dsIdx, { label: v })} />
          </PropRow>
          <PropRow label="Color">
            <ColorSwatch value={ds.color ?? ''} onChange={(v) => patchDataset(dsIdx, { color: v })} />
          </PropRow>
          {ds.data.map((pt, ptIdx) => (
            <div key={ptIdx} style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '0.7rem', color: '#9ca3af', minWidth: 20 }}>#{ptIdx + 1}</span>
              <TextInput value={String(pt.x)} onChange={(v) => patchPoint(dsIdx, ptIdx, 'x', v)} placeholder="x" />
              <TextInput value={String(pt.y)} onChange={(v) => patchPoint(dsIdx, ptIdx, 'y', v)} placeholder="y" />
              <button onClick={() => removePoint(dsIdx, ptIdx)} style={{ fontSize: '0.7rem', border: '1px solid #fca5a5', borderRadius: 4, background: 'none', color: '#ef4444', cursor: 'pointer', padding: '3px 6px' }}>✕</button>
            </div>
          ))}
          <button onClick={() => addPoint(dsIdx)} style={addBtnStyle}>+ Add point</button>
        </PropGroup>
      ))}

      <div style={{ padding: '4px 16px 8px' }}>
        <button onClick={addSeries} style={addBtnStyle}>+ Add series</button>
      </div>

      <ChartDataSourcePanel dataSource={content.dataSource} onChange={(ds) => patch({ dataSource: ds })} />
      <CustomCSSField styles={styles} knownKeys={[]} onChange={(s) => updateElement(element.id, { styles: s })} />
    </>
  )
}

const addBtnStyle: React.CSSProperties = {
  width: '100%', padding: '6px', fontSize: '0.8rem',
  border: '1px dashed #d1d5db', borderRadius: 6,
  background: 'none', color: '#6b7280', cursor: 'pointer', marginTop: 4,
}
