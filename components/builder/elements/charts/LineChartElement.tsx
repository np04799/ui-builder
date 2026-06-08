'use client'

import { memo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import ChartWrapper from './ChartWrapper'
import type { ChartDataset } from '@/types/builder.types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const PALETTE = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6']

interface Props {
  title?: string
  labels?: string[]
  datasets?: ChartDataset[]
  showLegend?: boolean
  showGrid?: boolean
  smooth?: boolean
  style?: React.CSSProperties
}

function LineChartElement({
  title,
  labels = [],
  datasets = [],
  showLegend = true,
  showGrid = true,
  smooth = true,
  style,
}: Props) {
  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color ?? PALETTE[i % PALETTE.length],
      backgroundColor: (ds.color ?? PALETTE[i % PALETTE.length]) + '22',
      borderWidth: 2,
      tension: smooth ? 0.4 : 0,
      pointRadius: 3,
      pointHoverRadius: 6,
    })),
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: showLegend && datasets.length > 1 },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      x: { grid: { display: showGrid } },
      y: { grid: { display: showGrid } },
    },
  }

  return (
    <ChartWrapper title={title} style={style}>
      <Line data={data} options={options} />
    </ChartWrapper>
  )
}

export default memo(LineChartElement)
