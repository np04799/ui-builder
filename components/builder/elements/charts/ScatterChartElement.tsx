'use client'

import { memo } from 'react'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Scatter } from 'react-chartjs-2'
import ChartWrapper from './ChartWrapper'
import type { ScatterDataset } from '@/types/builder.types'

ChartJS.register(LinearScale, PointElement, Tooltip, Legend)

const PALETTE = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6']

interface Props {
  title?: string
  datasets?: ScatterDataset[]
  showLegend?: boolean
  showGrid?: boolean
  style?: React.CSSProperties
}

function ScatterChartElement({
  title,
  datasets = [],
  showLegend = true,
  showGrid = true,
  style,
}: Props) {
  const data = {
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: (ds.color ?? PALETTE[i % PALETTE.length]) + 'cc',
      borderColor: ds.color ?? PALETTE[i % PALETTE.length],
      pointRadius: 6,
      pointHoverRadius: 8,
    })),
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: showLegend && datasets.length > 1 },
      tooltip: { intersect: true },
    },
    scales: {
      x: { grid: { display: showGrid }, title: { display: false } },
      y: { grid: { display: showGrid }, title: { display: false } },
    },
  }

  return (
    <ChartWrapper title={title} style={style}>
      <Scatter data={data} options={options} />
    </ChartWrapper>
  )
}

export default memo(ScatterChartElement)
