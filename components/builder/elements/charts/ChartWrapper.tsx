'use client'

import React from 'react'

interface Props {
  title?: string
  height?: number
  children: React.ReactNode
  style?: React.CSSProperties
}

/** Shared container: optional title + fixed-height chart area */
export default function ChartWrapper({ title, height = 240, children, style }: Props) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '16px 16px 12px',
        fontFamily: 'inherit',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {title && (
        <p style={{ margin: '0 0 12px', fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>
          {title}
        </p>
      )}
      <div style={{ position: 'relative', height }}>
        {children}
      </div>
    </div>
  )
}
