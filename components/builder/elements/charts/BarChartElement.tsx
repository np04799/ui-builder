'use client'

import { memo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import ChartWrapper from './ChartWrapper'
import type { ChartDataset } from '@/types/builder.types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const PALETTE = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6']

interface Props {
  title?: string
  orientation?: 'vertical' | 'horizontal'
  labels?: string[]
  datasets?: ChartDataset[]
  showLegend?: boolean
  showGrid?: boolean
  style?: React.CSSProperties
}

function BarChartElement({
  title,
  orientation = 'vertical',
  labels = [],
  datasets = [],
  showLegend = true,
  showGrid = true,
  style,
}: Props) {
  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: ds.color ?? PALETTE[i % PALETTE.length] + 'cc',
      borderColor: ds.color ?? PALETTE[i % PALETTE.length],
      borderWidth: 1.5,
      borderRadius: 4,
    })),
  }

  const options = {
    indexAxis: (orientation === 'horizontal' ? 'y' : 'x') as 'x' | 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: showLegend && datasets.length > 1 },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      x: { grid: { display: showGrid && orientation === 'horizontal' } },
      y: { grid: { display: showGrid && orientation === 'vertical' } },
    },
  }

  return (
    <ChartWrapper title={title} style={style}>
      <Bar data={data} options={options} />
    </ChartWrapper>
  )
}

export default memo(BarChartElement)
