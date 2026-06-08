'use client'

import { memo } from 'react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { PolarArea } from 'react-chartjs-2'
import ChartWrapper from './ChartWrapper'
import type { ChartDataset } from '@/types/builder.types'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

const PALETTE = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']

interface Props {
  title?: string
  labels?: string[]
  datasets?: ChartDataset[]
  showLegend?: boolean
  style?: React.CSSProperties
}

function PolarChartElement({
  title,
  labels = [],
  datasets = [],
  showLegend = true,
  style,
}: Props) {
  const firstDs = datasets[0]

  const data = {
    labels,
    datasets: [{
      data: firstDs?.data ?? [],
      backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length] + 'bb'),
      borderColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
      borderWidth: 1.5,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'right' as const,
        labels: { boxWidth: 12, font: { size: 11 } },
      },
    },
    scales: {
      r: { ticks: { font: { size: 10 } } },
    },
  }

  return (
    <ChartWrapper title={title} style={style}>
      <PolarArea data={data} options={options} />
    </ChartWrapper>
  )
}

export default memo(PolarChartElement)
