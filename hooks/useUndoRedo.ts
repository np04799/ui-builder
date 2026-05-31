'use client'

import { useEffect } from 'react'
import { useBuilderStore } from '@/store/builder.store'

export function useUndoRedo() {
  const undo = useBuilderStore((s) => s.undo)
  const redo = useBuilderStore((s) => s.redo)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey
      if (!ctrl) return

      // Don't intercept when typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return

      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault()
        redo()
      } else if (e.key === 'c') {
        const store = useBuilderStore.getState()
        if (!store.selectedId) return
        e.preventDefault()
        store.copySelected()
      } else if (e.key === 'v') {
        const store = useBuilderStore.getState()
        if (!store.clipboard) return
        e.preventDefault()
        store.pasteClipboard()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])
}
