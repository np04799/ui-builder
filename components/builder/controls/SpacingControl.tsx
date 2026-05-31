'use client'

import NumberInput from './NumberInput'

interface Props {
  /** CSS shorthand value like "16px 24px 16px 24px" or "16px" */
  value: string
  onChange: (value: string) => void
}

function parseSides(v: string): [string, string, string, string] {
  const parts = v.trim().split(/\s+/)
  if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]]
  if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]]
  if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]]
  return [parts[0], parts[1], parts[2], parts[3]]
}

export default function SpacingControl({ value, onChange }: Props) {
  const [top, right, bottom, left] = parseSides(value || '0px')

  function set(side: 'top' | 'right' | 'bottom' | 'left', val: string) {
    const sides = { top, right, bottom, left, [side]: val }
    onChange(`${sides.top} ${sides.right} ${sides.bottom} ${sides.left}`)
  }

  const inputStyle: React.CSSProperties = { width: '100%' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
      <div style={inputStyle}>
        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Top</div>
        <NumberInput value={top} onChange={(v) => set('top', v)} />
      </div>
      <div style={inputStyle}>
        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Right</div>
        <NumberInput value={right} onChange={(v) => set('right', v)} />
      </div>
      <div style={inputStyle}>
        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Bottom</div>
        <NumberInput value={bottom} onChange={(v) => set('bottom', v)} />
      </div>
      <div style={inputStyle}>
        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Left</div>
        <NumberInput value={left} onChange={(v) => set('left', v)} />
      </div>
    </div>
  )
}
