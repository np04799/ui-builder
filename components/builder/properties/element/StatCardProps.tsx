'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'

interface Props { element: ElementNode }

const PRESETS = [
  { label: 'Minimal (border)', value: 'minimal' },
  { label: 'Bordered (accent left)', value: 'bordered' },
  { label: 'Filled (solid bg)', value: 'filled' },
  { label: 'Gradient', value: 'gradient' },
]

export default function StatCardProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  if (element.content.type !== 'stat-card') return null
  const { content } = element
  function patch(p: Partial<typeof content>) { updateElement(element.id, { content: { ...content, ...p } }) }

  return (
    <>
      <PropGroup label="Preset">
        <PropRow label="Style">
          <SelectInput value={content.preset ?? 'minimal'} options={PRESETS} onChange={(v) => patch({ preset: v as typeof content.preset })} />
        </PropRow>
      </PropGroup>
      <PropGroup label="Content">
        <PropRow label="Label" stack><TextInput value={content.label ?? ''} onChange={(v) => patch({ label: v })} placeholder="Total Users" /></PropRow>
        <PropRow label="Value" stack><TextInput value={content.value ?? ''} onChange={(v) => patch({ value: v })} placeholder="24,521" /></PropRow>
        <PropRow label="Subtext" stack><TextInput value={content.subtext ?? ''} onChange={(v) => patch({ subtext: v })} placeholder="vs last month" /></PropRow>
        <PropRow label="Icon" stack><TextInput value={content.icon ?? ''} onChange={(v) => patch({ icon: v })} placeholder="👥 or leave blank" /></PropRow>
      </PropGroup>
      <PropGroup label="Trend">
        <PropRow label="Direction">
          <SelectInput value={content.trend ?? 'neutral'} options={[{ label: 'Up ↑', value: 'up' }, { label: 'Down ↓', value: 'down' }, { label: 'Neutral →', value: 'neutral' }]} onChange={(v) => patch({ trend: v as typeof content.trend })} />
        </PropRow>
        <PropRow label="Value" stack><TextInput value={content.trendValue ?? ''} onChange={(v) => patch({ trendValue: v })} placeholder="12.5%" /></PropRow>
      </PropGroup>
      <PropGroup label="Colors">
        <PropRow label="Accent"><ColorSwatch value={content.accentColor ?? '#4f46e5'} onChange={(v) => patch({ accentColor: v })} /></PropRow>
        <PropRow label="Icon bg"><ColorSwatch value={content.iconBg ?? '#ede9fe'} onChange={(v) => patch({ iconBg: v })} /></PropRow>
      </PropGroup>
    </>
  )
}
