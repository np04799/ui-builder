'use client'

import type { ElementNode } from '@/types/store.types'
import type { GaugeThreshold } from '@/types/builder.types'
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

export default function GaugeChartProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'chart-gauge') return null
  const { content, styles } = element

  function patch(p: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...p } })
  }

  const thresholds = content.thresholds ?? []

  function patchThreshold(idx: number, p: Partial<GaugeThreshold>) {
    patch({ thresholds: thresholds.map((t, i) => i === idx ? { ...t, ...p } : t) })
  }

  function addThreshold() {
    patch({ thresholds: [...thresholds, { value: 100, color: '#6366f1' }] })
  }

  function removeThreshold(idx: number) {
    patch({ thresholds: thresholds.filter((_, i) => i !== idx) })
  }

  return (
    <>
      <PropGroup label="Gauge Settings">
        <PropRow label="Title" stack>
          <TextInput value={content.title ?? ''} onChange={(v) => patch({ title: v })} placeholder="Chart title" />
        </PropRow>
        <PropRow label="Value" stack>
          <TextInput value={String(content.value ?? 65)} onChange={(v) => patch({ value: parseFloat(v) || 0 })} placeholder="65" />
        </PropRow>
        <PropRow label="Min" stack>
          <TextInput value={String(content.min ?? 0)} onChange={(v) => patch({ min: parseFloat(v) || 0 })} placeholder="0" />
        </PropRow>
        <PropRow label="Max" stack>
          <TextInput value={String(content.max ?? 100)} onChange={(v) => patch({ max: parseFloat(v) || 100 })} placeholder="100" />
        </PropRow>
        <PropRow label="Show label">
          <SelectInput value={content.showLabel !== false ? 'true' : 'false'} options={BOOL_OPTIONS} onChange={(v) => patch({ showLabel: v === 'true' })} />
        </PropRow>
      </PropGroup>

      <PropGroup label="Colour Thresholds">
        <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '0 0 8px', lineHeight: 1.5 }}>
          Each threshold sets the colour up to that % value.
        </p>
        {thresholds.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
            <div style={{ flex: 1 }}>
              <TextInput value={String(t.value)} onChange={(v) => patchThreshold(i, { value: parseFloat(v) || 0 })} placeholder="up to %" />
            </div>
            <ColorSwatch value={t.color} onChange={(v) => patchThreshold(i, { color: v })} />
            <button onClick={() => removeThreshold(i)} style={{ fontSize: '0.7rem', border: '1px solid #fca5a5', borderRadius: 4, background: 'none', color: '#ef4444', cursor: 'pointer', padding: '3px 6px' }}>✕</button>
          </div>
        ))}
        <button onClick={addThreshold} style={addBtnStyle}>+ Add threshold</button>
      </PropGroup>

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
