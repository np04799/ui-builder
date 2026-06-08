'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'
import ChartDatasetEditor from './ChartDatasetEditor'
import ChartDataSourcePanel from './ChartDataSourcePanel'

const BOOL_OPTIONS = [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]

interface Props { element: ElementNode }

export default function AreaChartProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'chart-area') return null
  const { content, styles } = element

  function patch(p: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...p } })
  }

  return (
    <>
      <PropGroup label="Chart Settings">
        <PropRow label="Title" stack>
          <TextInput value={content.title ?? ''} onChange={(v) => patch({ title: v })} placeholder="Chart title" />
        </PropRow>
        <PropRow label="Smooth curve">
          <SelectInput value={content.smooth !== false ? 'true' : 'false'} options={BOOL_OPTIONS} onChange={(v) => patch({ smooth: v === 'true' })} />
        </PropRow>
        <PropRow label="Show legend">
          <SelectInput value={content.showLegend !== false ? 'true' : 'false'} options={BOOL_OPTIONS} onChange={(v) => patch({ showLegend: v === 'true' })} />
        </PropRow>
        <PropRow label="Show grid">
          <SelectInput value={content.showGrid !== false ? 'true' : 'false'} options={BOOL_OPTIONS} onChange={(v) => patch({ showGrid: v === 'true' })} />
        </PropRow>
      </PropGroup>

      <ChartDatasetEditor
        labels={content.labels}
        datasets={content.datasets}
        onLabelsChange={(labels) => patch({ labels })}
        onDatasetsChange={(datasets) => patch({ datasets })}
        multiDataset
      />

      <ChartDataSourcePanel dataSource={content.dataSource} onChange={(ds) => patch({ dataSource: ds })} />
      <CustomCSSField styles={styles} knownKeys={[]} onChange={(s) => updateElement(element.id, { styles: s })} />
    </>
  )
}
