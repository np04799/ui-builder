'use client'

import { useDashboardStore } from '@/store/dashboard.store'
import type { DashboardWidget } from '@/types/dashboard.types'

interface Props {
  widget: DashboardWidget
}

const DEFAULT_PALETTE = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#f97316', '#06b6d4']

export default function ChartConfigPanel({ widget }: Props) {
  const updateWidget = useDashboardStore((s) => s.updateWidget)

  function patchChart(patch: Partial<DashboardWidget['chartConfig']>) {
    updateWidget(widget.id, { chartConfig: { ...widget.chartConfig, ...patch } })
  }
  function patchKPI(patch: Partial<NonNullable<DashboardWidget['kpiConfig']>>) {
    updateWidget(widget.id, { kpiConfig: { ...(widget.kpiConfig ?? {}), ...patch } })
  }
  function patchTable(patch: Partial<NonNullable<DashboardWidget['tableConfig']>>) {
    updateWidget(widget.id, { tableConfig: { ...(widget.tableConfig ?? {}), ...patch } })
  }

  const cfg = widget.chartConfig
  const kpi = widget.kpiConfig ?? {}
  const tbl = widget.tableConfig ?? {}
  const isBar = widget.type === 'chart-bar'
  const isLine = widget.type === 'chart-line' || widget.type === 'chart-area'
  const isChart = widget.type.startsWith('chart-') && widget.type !== 'chart-gauge'
  const isGauge = widget.type === 'chart-gauge'
  const isKPI = widget.type === 'kpi-card'
  const isTable = widget.type === 'data-table'

  const colors = cfg.colors ?? DEFAULT_PALETTE

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Chart options ── */}
      {isChart && (
        <>
          {isBar && (
            <Row label="Orientation">
              <SegControl
                value={cfg.orientation ?? 'vertical'}
                options={[{ value: 'vertical', label: '↕ Vertical' }, { value: 'horizontal', label: '↔ Horizontal' }]}
                onChange={(v) => patchChart({ orientation: v as 'vertical' | 'horizontal' })}
              />
            </Row>
          )}
          {(isBar || widget.type === 'chart-area') && (
            <Row label="Stacked">
              <Toggle checked={cfg.stacked ?? false} onChange={(v) => patchChart({ stacked: v })} />
            </Row>
          )}
          {isLine && (
            <Row label="Smooth curves">
              <Toggle checked={cfg.smooth ?? false} onChange={(v) => patchChart({ smooth: v })} />
            </Row>
          )}
          <Row label="Show legend">
            <Toggle checked={cfg.showLegend ?? true} onChange={(v) => patchChart({ showLegend: v })} />
          </Row>
          <Row label="Show grid">
            <Toggle checked={cfg.showGrid ?? true} onChange={(v) => patchChart({ showGrid: v })} />
          </Row>
          <div>
            <label style={labelStyle}>Colors</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {colors.slice(0, 8).map((c, i) => (
                <label key={i} title={c} style={{ position: 'relative', cursor: 'pointer' }}>
                  <span style={{ display: 'block', width: 22, height: 22, borderRadius: 4, backgroundColor: c, border: '2px solid transparent', outline: '1px solid rgba(0,0,0,0.1)' }} />
                  <input
                    type="color" value={c}
                    onChange={(e) => {
                      const arr = [...colors]; arr[i] = e.target.value
                      patchChart({ colors: arr })
                    }}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Gauge options ── */}
      {isGauge && (
        <>
          <Row label="Min value">
            <NumInput value={cfg.gaugeMin ?? 0} onChange={(v) => patchChart({ gaugeMin: v })} />
          </Row>
          <Row label="Max value">
            <NumInput value={cfg.gaugeMax ?? 100} onChange={(v) => patchChart({ gaugeMax: v })} />
          </Row>
        </>
      )}

      {/* ── KPI Card options ── */}
      {isKPI && (
        <>
          <Row label="Value format">
            <SegControl
              value={kpi.valueFormat ?? 'number'}
              options={[{ value: 'number', label: '# Num' }, { value: 'currency', label: '$ $$$' }, { value: 'percent', label: '% Pct' }]}
              onChange={(v) => patchKPI({ valueFormat: v as 'number' | 'currency' | 'percent' })}
            />
          </Row>
          {kpi.valueFormat === 'currency' && (
            <Row label="Currency symbol">
              <TextInp value={kpi.currencySymbol ?? '$'} onChange={(v) => patchKPI({ currencySymbol: v })} placeholder="$" />
            </Row>
          )}
          <Row label="Icon class">
            <TextInp value={kpi.icon ?? ''} onChange={(v) => patchKPI({ icon: v })} placeholder="bi-graph-up-arrow" />
          </Row>
          <Row label="Icon background">
            <input type="color" value={kpi.iconBg ?? '#ede9fe'} onChange={(e) => patchKPI({ iconBg: e.target.value })} style={{ width: 36, height: 28, borderRadius: 5, border: '1px solid var(--color-border)', cursor: 'pointer' }} />
          </Row>
          <Row label="Accent color">
            <input type="color" value={kpi.accentColor ?? '#6366f1'} onChange={(e) => patchKPI({ accentColor: e.target.value })} style={{ width: 36, height: 28, borderRadius: 5, border: '1px solid var(--color-border)', cursor: 'pointer' }} />
          </Row>
          <Row label="Static label">
            <TextInp value={kpi.staticLabel ?? ''} onChange={(v) => patchKPI({ staticLabel: v })} placeholder="Leave empty to use data" />
          </Row>
        </>
      )}

      {/* ── Data Table options ── */}
      {isTable && (
        <>
          <Row label="Rows per page">
            <SegControl
              value={String(tbl.pageSize ?? 10)}
              options={[{ value: '10', label: '10' }, { value: '25', label: '25' }, { value: '50', label: '50' }]}
              onChange={(v) => patchTable({ pageSize: Number(v) })}
            />
          </Row>
          <Row label="Striped rows">
            <Toggle checked={tbl.striped ?? true} onChange={(v) => patchTable({ striped: v })} />
          </Row>
          <Row label="Column filters">
            <Toggle checked={tbl.showColumnFilters ?? true} onChange={(v) => patchTable({ showColumnFilters: v })} />
          </Row>
          <Row label="Density">
            <SegControl
              value={tbl.density ?? 'normal'}
              options={[{ value: 'compact', label: 'Compact' }, { value: 'normal', label: 'Normal' }, { value: 'comfortable', label: 'Loose' }]}
              onChange={(v) => patchTable({ density: v as 'compact' | 'normal' | 'comfortable' })}
            />
          </Row>
        </>
      )}
    </div>
  )
}

// ─── Micro controls ───────────────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', flexShrink: 0 }}>{label}</span>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 36, height: 20, borderRadius: 999, border: 'none', cursor: 'pointer',
        backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-border)',
        position: 'relative', transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2, width: 16, height: 16,
        borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s',
      }} />
    </button>
  )
}

function SegControl({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          padding: '3px 8px', border: 'none', cursor: 'pointer', fontSize: '0.72rem',
          backgroundColor: value === o.value ? 'var(--color-primary)' : 'var(--color-bg)',
          color: value === o.value ? '#fff' : 'var(--color-text-secondary)',
          fontWeight: value === o.value ? 700 : 400,
        }}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function NumInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: 70, ...inputStyle }} />
}
function TextInp({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ width: 140, ...inputStyle }} />
}

const inputStyle: React.CSSProperties = {
  padding: '4px 7px', borderRadius: 5, border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)', fontSize: '0.78rem', outline: 'none',
}
const labelStyle: React.CSSProperties = { fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }
