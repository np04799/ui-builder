'use client'

import { useState } from 'react'
import type { DashboardWidgetType } from '@/types/dashboard.types'

// ─── Widget definitions ───────────────────────────────────────────────────────

interface WidgetDef {
  type: DashboardWidgetType
  label: string
  desc: string
  preview: React.ReactNode
}

// ─── Mini SVG chart previews ──────────────────────────────────────────────────

const C = '#6366f1'
const C2 = '#f59e0b'
const C3 = '#10b981'
const C4 = '#3b82f6'

function BarPreview() {
  const data = [42, 58, 47, 75, 63, 55]
  const max = 75
  return (
    <svg viewBox="0 0 60 34" style={{ width: '100%', height: '100%' }}>
      {data.map((v, i) => {
        const h = (v / max) * 28
        return (
          <rect
            key={i}
            x={i * 10 + 1}
            y={30 - h}
            width={8}
            height={h}
            rx={1.5}
            fill={i === 3 ? C : `${C}99`}
          />
        )
      })}
      <line x1="0" y1="31" x2="60" y2="31" stroke="var(--color-border)" strokeWidth="0.5" />
    </svg>
  )
}

function LinePreview() {
  const pts = '2,26 12,19 22,22 32,11 42,15 58,8'
  return (
    <svg viewBox="0 0 60 34" style={{ width: '100%', height: '100%' }}>
      <polyline points={pts} fill="none" stroke={C} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.split(' ').map((p, i) => {
        const [x, y] = p.split(',')
        return <circle key={i} cx={x} cy={y} r="2" fill={C} />
      })}
    </svg>
  )
}

function AreaPreview() {
  return (
    <svg viewBox="0 0 60 34" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C} stopOpacity="0.4" />
          <stop offset="100%" stopColor={C} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points="2,32 2,26 12,19 22,22 32,11 42,15 58,8 58,32" fill="url(#ag)" />
      <polyline points="2,26 12,19 22,22 32,11 42,15 58,8" fill="none" stroke={C} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PiePreview() {
  return (
    <svg viewBox="0 0 34 34" style={{ width: '100%', height: '100%' }}>
      <circle cx="17" cy="17" r="14" fill="var(--color-border)" />
      <path d="M17 17 L17 3 A14 14 0 0 1 31 17 Z" fill={C} />
      <path d="M17 17 L31 17 A14 14 0 0 1 17 31 Z" fill={C2} />
      <path d="M17 17 L17 31 A14 14 0 0 1 5 9.7 Z" fill={C3} />
      <path d="M17 17 L5 9.7 A14 14 0 0 1 17 3 Z" fill={C4} />
    </svg>
  )
}

function DonutPreview() {
  return (
    <svg viewBox="0 0 34 34" style={{ width: '100%', height: '100%' }}>
      <circle cx="17" cy="17" r="14" fill="var(--color-border)" />
      <path d="M17 17 L17 3 A14 14 0 0 1 31 17 Z" fill={C} />
      <path d="M17 17 L31 17 A14 14 0 0 1 17 31 Z" fill={C2} />
      <path d="M17 17 L17 31 A14 14 0 0 1 5 9.7 Z" fill={C3} />
      <path d="M17 17 L5 9.7 A14 14 0 0 1 17 3 Z" fill={C4} />
      <circle cx="17" cy="17" r="7" fill="var(--color-surface)" />
    </svg>
  )
}

function GaugePreview() {
  return (
    <svg viewBox="0 0 44 28" style={{ width: '100%', height: '100%' }}>
      <path d="M4 24 A18 18 0 0 1 40 24" fill="none" stroke="var(--color-border)" strokeWidth="5" strokeLinecap="round" />
      <path d="M4 24 A18 18 0 0 1 30 7" fill="none" stroke={C} strokeWidth="5" strokeLinecap="round" />
      <line x1="22" y1="24" x2="30" y2="10" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="22" cy="24" r="2.5" fill="var(--color-text-primary)" />
    </svg>
  )
}

function KPIPreview() {
  return (
    <svg viewBox="0 0 60 34" style={{ width: '100%', height: '100%' }}>
      <text x="6" y="22" fontSize="16" fontWeight="700" fill={C} fontFamily="system-ui">6.8K</text>
      <polyline points="38,22 44,16 50,19 56,12" fill="none" stroke={C3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="54,12 58,12 58,16" fill={C3} />
    </svg>
  )
}

function TablePreview() {
  const rows = [0, 1, 2]
  return (
    <svg viewBox="0 0 60 34" style={{ width: '100%', height: '100%' }}>
      <rect x="1" y="1" width="58" height="8" rx="1.5" fill={C} opacity="0.8" />
      {rows.map((r) => (
        <g key={r}>
          <rect x="1" y={11 + r * 7} width="58" height="6" rx="1" fill={r % 2 === 0 ? 'var(--color-bg)' : 'var(--color-selected)'} />
          <rect x="4" y={13 + r * 7} width="20" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.5" />
          <rect x="30" y={13 + r * 7} width="14" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" />
        </g>
      ))}
    </svg>
  )
}

function FilterPreview() {
  return (
    <svg viewBox="0 0 60 34" style={{ width: '100%', height: '100%' }}>
      <rect x="1" y="10" width="26" height="14" rx="4" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="1" />
      <text x="6" y="21" fontSize="7" fill="var(--color-text-secondary)" fontFamily="system-ui">Category</text>
      <path d="M23 16 L26 19 L29 16" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="33" y="10" width="26" height="14" rx="4" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="1" />
      <text x="37" y="21" fontSize="7" fill="var(--color-text-secondary)" fontFamily="system-ui">Date range</text>
      <path d="M54 16 L57 19 L60 16" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// ─── Widget groups ────────────────────────────────────────────────────────────

const CHART_WIDGETS: WidgetDef[] = [
  { type: 'chart-bar',   label: 'Bar Chart',   desc: 'Compare values', preview: <BarPreview /> },
  { type: 'chart-line',  label: 'Line Chart',  desc: 'Trends over time', preview: <LinePreview /> },
  { type: 'chart-area',  label: 'Area Chart',  desc: 'Filled trend line', preview: <AreaPreview /> },
  { type: 'chart-pie',   label: 'Pie Chart',   desc: 'Part of a whole', preview: <PiePreview /> },
  { type: 'chart-donut', label: 'Donut Chart', desc: 'Pie with center', preview: <DonutPreview /> },
  { type: 'chart-gauge', label: 'Gauge',        desc: 'Single KPI meter', preview: <GaugePreview /> },
]

const DISPLAY_WIDGETS: WidgetDef[] = [
  { type: 'kpi-card',   label: 'KPI Card',   desc: 'Big number + trend', preview: <KPIPreview /> },
  { type: 'data-table', label: 'Data Table', desc: 'Sortable table', preview: <TablePreview /> },
]

const FILTER_WIDGETS: WidgetDef[] = [
  { type: 'filter-bar', label: 'Filter Bar', desc: 'Global filters', preview: <FilterPreview /> },
]

// ─── Drag ghost image ─────────────────────────────────────────────────────────

function setDragGhost(e: React.DragEvent, label: string) {
  const ghost = document.createElement('div')
  ghost.textContent = label
  ghost.style.cssText =
    'position:fixed;top:-100px;left:-100px;padding:6px 12px;border-radius:6px;' +
    'background:#6366f1;color:#fff;font-size:12px;font-weight:600;white-space:nowrap;pointer-events:none'
  document.body.appendChild(ghost)
  e.dataTransfer.setDragImage(ghost, -10, -10)
  setTimeout(() => document.body.removeChild(ghost), 0)
}

// ─── Widget card ──────────────────────────────────────────────────────────────

function WidgetCard({ def }: { def: WidgetDef }) {
  const [hov, setHov] = useState(false)
  const [dragging, setDragging] = useState(false)

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('dashWidgetType', def.type)
    e.dataTransfer.effectAllowed = 'copy'
    setDragGhost(e, def.label)
    setDragging(true)
    // Also set on window for react-grid-layout drop
    ;(window as unknown as Record<string, unknown>).__dashDroppingType = def.type
  }

  function handleDragEnd() {
    setDragging(false)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={`Drag "${def.label}" onto canvas`}
      style={{
        borderRadius: 8,
        border: `1.5px solid ${dragging ? C : hov ? C : 'var(--color-border)'}`,
        backgroundColor: hov || dragging ? 'var(--color-selected)' : 'var(--color-bg)',
        cursor: 'grab',
        overflow: 'hidden',
        transition: 'border-color 0.12s, background-color 0.12s',
        userSelect: 'none',
      }}
    >
      {/* Chart preview area */}
      <div
        style={{
          height: 54,
          padding: '6px 8px 4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: hov ? 'rgba(99,102,241,0.04)' : 'transparent',
        }}
      >
        {def.preview}
      </div>
      {/* Label */}
      <div style={{ padding: '5px 8px 6px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
          {def.label}
        </div>
        <div style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)', lineHeight: 1.3, marginTop: 1 }}>
          {def.desc}
        </div>
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({ title, widgets }: { title: string; widgets: WidgetDef[] }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ marginBottom: 4 }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer',
          color: 'var(--color-text-secondary)', fontSize: '0.65rem', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.07em',
        }}
      >
        {title}
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round"
          style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}
        >
          <path d="M2 3.5l3 3 3-3" />
        </svg>
      </button>
      {open && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: '0 10px 8px' }}>
          {widgets.map((w) => <WidgetCard key={w.type} def={w} />)}
        </div>
      )}
    </div>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export default function DashboardElementsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Hint */}
      <div style={{
        padding: '7px 12px',
        fontSize: '0.67rem',
        color: 'var(--color-text-secondary)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        flexShrink: 0,
      }}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M5.5 1v4.5H1m9 0H5.5v4.5" />
        </svg>
        Drag any widget onto the canvas
      </div>

      {/* Scrollable list */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 4 }}>
        <Section title="Charts" widgets={CHART_WIDGETS} />
        <Section title="Display" widgets={DISPLAY_WIDGETS} />
        <Section title="Filters" widgets={FILTER_WIDGETS} />
      </div>
    </div>
  )
}
