'use client'

import { useRef, useCallback } from 'react'

type Direction = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

interface Props {
  direction: Direction
  nodeId: string
  onResize: (size: { width?: number; height?: number }) => void
  targetRef?: React.RefObject<HTMLElement | null>
}

const CURSORS: Record<Direction, string> = {
  n: 'n-resize', s: 's-resize',
  e: 'e-resize', w: 'w-resize',
  ne: 'ne-resize', nw: 'nw-resize',
  se: 'se-resize', sw: 'sw-resize',
}

// Visual pip size and hit area
const PIP = 8

export default function ResizeHandle({ direction, onResize, targetRef }: Props) {
  const handleRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const startY = useRef(0)
  const startW = useRef(0)
  const startH = useRef(0)
  const startTop = useRef(0)
  const startLeft = useRef(0)
  const rafId = useRef(0)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const target = targetRef?.current ?? handleRef.current?.parentElement as HTMLElement | null
    if (!target) return

    const rect = target.getBoundingClientRect()
    startX.current = e.clientX
    startY.current = e.clientY
    startW.current = rect.width
    startH.current = rect.height
    startTop.current = rect.top
    startLeft.current = rect.left

    document.body.style.cursor = CURSORS[direction]
    document.body.style.userSelect = 'none'

    function onMouseMove(ev: MouseEvent) {
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        if (!target) return
        const dx = ev.clientX - startX.current
        const dy = ev.clientY - startY.current

        // Width changes: e/ne/se grow right, w/nw/sw grow left (inverted)
        if (direction.includes('e')) {
          const w = Math.max(40, startW.current + dx)
          target.style.width = `${w}px`
          target.style.maxWidth = `${w}px`
        }
        if (direction.includes('w')) {
          const w = Math.max(40, startW.current - dx)
          target.style.width = `${w}px`
          target.style.maxWidth = `${w}px`
        }
        // Height changes: s/se/sw grow down, n/ne/nw grow up (inverted)
        if (direction.includes('s')) {
          const h = Math.max(20, startH.current + dy)
          target.style.height = `${h}px`
          target.style.minHeight = `${h}px`
        }
        if (direction === 'n' || direction === 'ne' || direction === 'nw') {
          const h = Math.max(20, startH.current - dy)
          target.style.height = `${h}px`
          target.style.minHeight = `${h}px`
        }
      })
    }

    function onMouseUp(ev: MouseEvent) {
      cancelAnimationFrame(rafId.current)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)

      const dx = ev.clientX - startX.current
      const dy = ev.clientY - startY.current
      const size: { width?: number; height?: number } = {}

      if (direction.includes('e')) size.width  = Math.round(Math.max(40, startW.current + dx))
      if (direction.includes('w')) size.width  = Math.round(Math.max(40, startW.current - dx))
      if (direction.includes('s')) size.height = Math.round(Math.max(20, startH.current + dy))
      if (direction === 'n' || direction === 'ne' || direction === 'nw') {
        size.height = Math.round(Math.max(20, startH.current - dy))
      }

      onResize(size)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [direction, onResize, targetRef])

  // Position each handle at the correct edge/corner
  const isN  = direction === 'n'
  const isS  = direction === 's'
  const isE  = direction === 'e'
  const isW  = direction === 'w'
  const isNE = direction === 'ne'
  const isNW = direction === 'nw'
  const isSE = direction === 'se'
  const isSW = direction === 'sw'

  const pos: React.CSSProperties = {
    position: 'absolute',
    zIndex: 30,
    width: PIP + 4,
    height: PIP + 4,
    ...(isNW ? { top: -PIP/2 - 2, left: -PIP/2 - 2 } :
        isN  ? { top: -PIP/2 - 2, left: '50%', transform: 'translateX(-50%)' } :
        isNE ? { top: -PIP/2 - 2, right: -PIP/2 - 2 } :
        isE  ? { right: -PIP/2 - 2, top: '50%', transform: 'translateY(-50%)' } :
        isSE ? { bottom: -PIP/2 - 2, right: -PIP/2 - 2 } :
        isS  ? { bottom: -PIP/2 - 2, left: '50%', transform: 'translateX(-50%)' } :
        isSW ? { bottom: -PIP/2 - 2, left: -PIP/2 - 2 } :
        /* W */{ left: -PIP/2 - 2, top: '50%', transform: 'translateY(-50%)' }),
    cursor: CURSORS[direction],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <div
      ref={handleRef}
      onMouseDown={onMouseDown}
      data-resize-handle={direction}
      style={pos}
    >
      <div style={{
        width: PIP,
        height: PIP,
        borderRadius: 2,
        backgroundColor: '#fff',
        border: '2px solid var(--color-primary)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        transition: 'transform 100ms',
      }} />
    </div>
  )
}
