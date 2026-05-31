'use client'

import { memo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import ChartWrapper from './ChartWrapper'
import type { ChartDataset } from '@/types/builder.types'

ChartJS.register(ArcElement, Tooltip, Legend)

const PALETTE = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']

interface Props {
  title?: string
  labels?: string[]
  datasets?: ChartDataset[]
  showLegend?: boolean
  cutout?: number
  style?: React.CSSProperties
}

function DonutChartElement({
  title,
  labels = [],
  datasets = [],
  showLegend = true,
  cutout = 60,
  style,
}: Props) {
  const firstDs = datasets[0]

  const data = {
    labels,
    datasets: [{
      data: firstDs?.data ?? [],
      backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length] + 'cc'),
      borderColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
      borderWidth: 1.5,
      hoverOffset: 8,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: `${cutout}%`,
    plugins: {
      legend: {
        display: showLegend,
        position: 'right' as const,
        labels: { boxWidth: 12, font: { size: 11 } },
      },
      tooltip: { intersect: true },
    },
  }

  return (
    <ChartWrapper title={title} style={style}>
      <Doughnut data={data} options={options} />
    </ChartWrapper>
  )
}

export default memo(DonutChartElement)
