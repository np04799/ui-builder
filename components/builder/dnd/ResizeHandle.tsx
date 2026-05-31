'use client'

import { useRef, useCallback } from 'react'

type Direction = 'bottom' | 'right' | 'corner'

interface Props {
  direction: Direction
  nodeId: string
  /** Called with the final { width?, height? } in px */
  onResize: (size: { width?: number; height?: number }) => void
  /** Element to measure during drag — defaults to parentElement */
  targetRef?: React.RefObject<HTMLElement | null>
}

const CURSOR: Record<Direction, string> = {
  bottom: 'row-resize',
  right:  'col-resize',
  corner: 'nwse-resize',
}

const SIZE = 10 // hit-area px

export default function ResizeHandle({ direction, onResize, targetRef }: Props) {
  const handleRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const startY = useRef(0)
  const startW = useRef(0)
  const startH = useRef(0)
  const rafId  = useRef(0)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const target = targetRef?.current ?? (handleRef.current?.parentElement as HTMLElement | null)
    if (!target) return

    const rect = target.getBoundingClientRect()
    startX.current = e.clientX
    startY.current = e.clientY
    startW.current = rect.width
    startH.current = rect.height

    document.body.style.cursor = CURSOR[direction]
    document.body.style.userSelect = 'none'

    function onMouseMove(ev: MouseEvent) {
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        const dx = ev.clientX - startX.current
        const dy = ev.clientY - startY.current
        const newW = Math.max(40,  startW.current + dx)
        const newH = Math.max(20,  startH.current + dy)

        if (!target) return
        if (direction === 'bottom' || direction === 'corner') {
          target.style.minHeight = `${newH}px`
          target.style.height    = `${newH}px`
        }
        if (direction === 'right' || direction === 'corner') {
          target.style.width    = `${newW}px`
          target.style.maxWidth = `${newW}px`
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
      const finalW = Math.max(40, startW.current + dx)
      const finalH = Math.max(20, startH.current + dy)

      const size: { width?: number; height?: number } = {}
      if (direction === 'bottom' || direction === 'corner') size.height = Math.round(finalH)
      if (direction === 'right'  || direction === 'corner') size.width  = Math.round(finalW)
      onResize(size)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [direction, onResize, targetRef])

  const style: React.CSSProperties = {
    position: 'absolute',
    zIndex: 20,
    ...(direction === 'bottom' ? {
      bottom: -SIZE / 2,
      left: '10%',
      width: '80%',
      height: SIZE,
      cursor: 'row-resize',
    } : direction === 'right' ? {
      right: -SIZE / 2,
      top: '10%',
      width: SIZE,
      height: '80%',
      cursor: 'col-resize',
    } : /* corner */ {
      bottom: -SIZE / 2,
      right: -SIZE / 2,
      width: SIZE + 4,
      height: SIZE + 4,
      cursor: 'nwse-resize',
    }),
  }

  const pipStyle: React.CSSProperties = direction === 'corner' ? {
    width: '100%',
    height: '100%',
    borderRadius: 2,
    background: 'var(--color-primary)',
    opacity: 0,
    transition: 'opacity 120ms',
  } : direction === 'bottom' ? {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 32,
    height: 4,
    borderRadius: 2,
    background: 'var(--color-primary)',
    opacity: 0,
    transition: 'opacity 120ms',
  } : {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 4,
    height: 32,
    borderRadius: 2,
    background: 'var(--color-primary)',
    opacity: 0,
    transition: 'opacity 120ms',
  }

  return (
    <div
      ref={handleRef}
      onMouseDown={onMouseDown}
      data-resize-handle={direction}
      style={style}
    >
      <div data-resize-pip style={pipStyle} />
      <style>{`
        [data-resize-handle]:hover [data-resize-pip] { opacity: 1 !important; }
      `}</style>
    </div>
  )
}
