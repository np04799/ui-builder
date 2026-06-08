'use client'

import { memo } from 'react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import ChartWrapper from './ChartWrapper'
import type { ChartDataset } from '@/types/builder.types'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const PALETTE = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6']

interface Props {
  title?: string
  labels?: string[]
  datasets?: ChartDataset[]
  showLegend?: boolean
  style?: React.CSSProperties
}

function RadarChartElement({
  title,
  labels = [],
  datasets = [],
  showLegend = true,
  style,
}: Props) {
  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color ?? PALETTE[i % PALETTE.length],
      backgroundColor: (ds.color ?? PALETTE[i % PALETTE.length]) + '33',
      borderWidth: 2,
      pointRadius: 3,
    })),
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: showLegend && datasets.length > 1 },
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: { font: { size: 10 }, stepSize: 20 },
        pointLabels: { font: { size: 11 } },
      },
    },
  }

  return (
    <ChartWrapper title={title} style={style}>
      <Radar data={data} options={options} />
    </ChartWrapper>
  )
}

export default memo(RadarChartElement)
