'use client'

import { useDashboardStore } from '@/store/dashboard.store'
import DataSourcePanel from './panels/DataSourcePanel'
import DataBindingPanel from './panels/DataBindingPanel'
import ChartConfigPanel from './panels/ChartConfigPanel'

const TABS = [
  { id: 'config', label: 'Config', icon: 'bi-sliders' },
  { id: 'data',   label: 'Data',   icon: 'bi-database' },
  { id: 'style',  label: 'Style',  icon: 'bi-palette' },
] as const

type Tab = typeof TABS[number]['id']

export default function DashboardPropertiesPanel() {
  const selectedId = useDashboardStore((s) => s.selectedWidgetId)
  const widgets = useDashboardStore((s) => s.widgets)
  const activeTab = useDashboardStore((s) => s.activeRightTab) as Tab
  const setTab = useDashboardStore((s) => s.setActiveRightTab)
  const updateWidget = useDashboardStore((s) => s.updateWidget)

  const widget = widgets.find((w) => w.id === selectedId)

  if (!widget) {
    return (
      <div style={{
        padding: 20, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: 10, textAlign: 'center',
        color: 'var(--color-text-secondary)',
      }}>
        <i className="bi bi-cursor" style={{ fontSize: '1.5rem', opacity: 0.4 }} />
        <p style={{ margin: 0, fontSize: '0.8rem' }}>Select a widget to edit its properties</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Widget title */}
      <div style={{ padding: '10px 14px 0', flexShrink: 0 }}>
        <input
          value={widget.title}
          onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
          style={{
            width: '100%', padding: '5px 8px', borderRadius: 6,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)',
            fontSize: '0.8rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box',
          }}
        />
        <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', marginTop: 3 }}>
          {widget.type.replace('chart-', '').replace('-', ' ')}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', margin: '8px 0 0', flexShrink: 0 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '6px 4px', border: 'none', cursor: 'pointer',
              backgroundColor: 'transparent',
              borderBottom: activeTab === t.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === t.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: activeTab === t.id ? 700 : 400,
              fontSize: '0.72rem', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2, marginBottom: -1,
            }}
          >
            <i className={`bi ${t.icon}`} style={{ fontSize: '0.85rem' }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
        {activeTab === 'config' && <ChartConfigPanel widget={widget} />}

        {activeTab === 'data' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <DataSourcePanel widget={widget} />
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
              <p style={{ margin: '0 0 10px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Data Binding
              </p>
              <DataBindingPanel widget={widget} />
            </div>
          </div>
        )}

        {activeTab === 'style' && <WidgetStylePanel widget={widget} updateWidget={updateWidget} />}
      </div>
    </div>
  )
}

// ─── Style Panel ──────────────────────────────────────────────────────────────

function WidgetStylePanel({
  widget,
  updateWidget,
}: {
  widget: ReturnType<typeof useDashboardStore.getState>['widgets'][number]
  updateWidget: (id: string, p: Partial<typeof widget>) => void
}) {
  const s = widget.style

  function patch(p: Partial<typeof s>) {
    updateWidget(widget.id, { style: { ...s, ...p } })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <StyleRow label="Background">
        <input type="color" value={s.backgroundColor ?? '#ffffff'} onChange={(e) => patch({ backgroundColor: e.target.value })}
          style={{ width: 36, height: 28, borderRadius: 5, border: '1px solid var(--color-border)', cursor: 'pointer' }} />
      </StyleRow>
      <StyleRow label="Border radius">
        <Slider value={s.borderRadius ?? 12} min={0} max={24} onChange={(v) => patch({ borderRadius: v })} />
      </StyleRow>
      <StyleRow label="Padding">
        <Slider value={s.padding ?? 16} min={0} max={40} onChange={(v) => patch({ padding: v })} />
      </StyleRow>
      <StyleRow label="Show title">
        <ToggleBtn checked={s.showTitle !== false} onChange={(v) => patch({ showTitle: v })} />
      </StyleRow>
      {s.showTitle !== false && (
        <>
          <StyleRow label="Title color">
            <input type="color" value={s.titleColor ?? '#111827'} onChange={(e) => patch({ titleColor: e.target.value })}
              style={{ width: 36, height: 28, borderRadius: 5, border: '1px solid var(--color-border)', cursor: 'pointer' }} />
          </StyleRow>
          <StyleRow label="Title size">
            <Slider value={s.titleFontSize ?? 13} min={10} max={24} onChange={(v) => patch({ titleFontSize: v })} />
          </StyleRow>
        </>
      )}
    </div>
  )
}

function StyleRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{label}</span>
      {children}
    </div>
  )
}
function Slider({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: 80 }} />
      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', width: 24, textAlign: 'right' }}>{value}</span>
    </div>
  )
}
function ToggleBtn({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      width: 36, height: 20, borderRadius: 999, border: 'none', cursor: 'pointer',
      backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-border)', position: 'relative', transition: 'background 0.2s',
    }}>
      <span style={{ position: 'absolute', top: 2, left: checked ? 18 : 2, width: 16, height: 16, borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s' }} />
    </button>
  )
}
