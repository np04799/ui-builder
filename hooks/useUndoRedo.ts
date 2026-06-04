'use client'

import { useEffect } from 'react'
import { useBuilderStore } from '@/store/builder.store'

export function useUndoRedo() {
  const undo = useBuilderStore((s) => s.undo)
  const redo = useBuilderStore((s) => s.redo)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept when typing in an input/textarea/contentEditable
      const target = e.target as HTMLElement
      const tag = target?.tagName
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable

      const ctrl = e.ctrlKey || e.metaKey

      // ── Delete / Backspace (no modifier needed) ───────────────────────────
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTyping) {
        const store = useBuilderStore.getState()
        if (!store.selectedId) return
        e.preventDefault()
        const id = store.selectedId
        if (store.elements[id])       store.deleteElement(id)
        else if (store.columns[id])   store.deleteColumn(id)
        else if (store.rows[id])      store.deleteRow(id)
        else if (store.sections[id])  store.deleteSection(id)
        return
      }

      if (!ctrl) return
      if (isTyping) return

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
      } else if (e.key === 'd') {
        const store = useBuilderStore.getState()
        if (!store.selectedId) return
        e.preventDefault()
        const id = store.selectedId
        if (store.elements[id])       store.duplicateElement(id)
        else if (store.columns[id])   store.duplicateColumn(id)
        else if (store.rows[id])      store.duplicateRow(id)
        else if (store.sections[id])  store.duplicateSection(id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])
}
