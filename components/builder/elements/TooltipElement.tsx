'use client'

import { memo } from 'react'
import { useFramework } from '@/hooks/useFramework'

interface Props {
  label?: string
  tip?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  triggerStyle?: 'underline' | 'icon' | 'button'
  style?: React.CSSProperties
}

/**
 * CSS-only tooltip — no JS state needed.
 * Uses :hover on the wrapper via a <style> tag with a unique class approach,
 * but since we can't inject class-based CSS easily inline, we use a wrapper
 * with a data attribute and a global <style> injected once.
 */
function TooltipElement({
  label = 'Hover me',
  tip = 'Tooltip text',
  position = 'top',
  triggerStyle = 'underline',
  style,
}: Props) {
  const framework = useFramework()
  // Compute bubble placement offsets
  const bubbleStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: '#1f2937',
      color: '#fff',
      fontSize: '0.78rem',
      padding: '6px 10px',
      borderRadius: 6,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      opacity: 0,
      transition: 'opacity 150ms',
      zIndex: 100,
      maxWidth: 240,
      lineHeight: 1.4,
    }
    if (position === 'top')    return { ...base, bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }
    if (position === 'bottom') return { ...base, top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }
    if (position === 'left')   return { ...base, right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }
    /* right */                return { ...base, left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }
  })()

  const triggerEl = (() => {
    if (triggerStyle === 'icon') {
      if (framework === 'bootstrap') {
        return <span className="badge rounded-pill bg-secondary" style={{ cursor: 'default', fontSize: '0.7rem' }}>i</span>
      }
      if (framework === 'tailwind') {
        return <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 text-gray-500 text-xs font-bold cursor-default select-none">i</span>
      }
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', border: '1.5px solid #6b7280', color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, cursor: 'default', userSelect: 'none' }}>i</span>
      )
    }
    if (triggerStyle === 'button') {
      if (framework === 'bootstrap') {
        return <button className="btn btn-primary btn-sm">{label}</button>
      }
      if (framework === 'tailwind') {
        return <button className="border-none cursor-pointer px-3.5 py-1.5 bg-indigo-600 text-white rounded text-sm font-semibold">{label}</button>
      }
      return (
        <button style={{ padding: '6px 14px', border: 'none', borderRadius: 6, backgroundColor: 'var(--color-primary)', color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>{label}</button>
      )
    }
    // underline (default)
    if (framework === 'bootstrap') {
      return <span className="text-decoration-underline text-muted" style={{ cursor: 'default', textDecorationStyle: 'dotted' }}>{label}</span>
    }
    if (framework === 'tailwind') {
      return <span className="border-b border-dotted border-gray-400 cursor-default text-gray-700 text-sm">{label}</span>
    }
    return (
      <span style={{ borderBottom: '1.5px dotted var(--color-text-secondary)', cursor: 'default', color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{label}</span>
    )
  })()

  return (
    <div style={{ display: 'inline-block', fontFamily: 'inherit', ...style }}>
      {/*
       * We use a simple inline approach: wrap trigger + bubble in a relative
       * div, then use React's onMouseEnter/onMouseLeave to toggle opacity.
       * This is simpler than injecting CSS classes and works perfectly in React.
       */}
      <TooltipWrapper bubbleStyle={bubbleStyle} tip={tip}>
        {triggerEl}
      </TooltipWrapper>
    </div>
  )
}

interface WrapperProps {
  bubbleStyle: React.CSSProperties
  tip: string
  children: React.ReactNode
}

function TooltipWrapper({ bubbleStyle, tip, children }: WrapperProps) {
  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={(e) => {
        const bubble = e.currentTarget.querySelector<HTMLElement>('[data-tooltip-bubble]')
        if (bubble) bubble.style.opacity = '1'
      }}
      onMouseLeave={(e) => {
        const bubble = e.currentTarget.querySelector<HTMLElement>('[data-tooltip-bubble]')
        if (bubble) bubble.style.opacity = '0'
      }}
    >
      {children}
      <div data-tooltip-bubble="" style={bubbleStyle}>
        {tip}
      </div>
    </div>
  )
}

export default memo(TooltipElement)
