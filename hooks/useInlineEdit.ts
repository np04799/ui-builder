'use client'

import { useState, useEffect } from 'react'
import { useBuilderStore } from '@/store/builder.store'

interface UseInlineEditResult {
  isEditing: boolean
  isSelected: boolean
  startEdit: () => void
  commitEdit: (rawText: string) => void
  cancelEdit: () => void
}

export function useInlineEdit(elementId: string): UseInlineEditResult {
  const [isEditing, setIsEditing] = useState(false)
  const isSelected = useBuilderStore((s) => s.selectedId === elementId)
  const element = useBuilderStore((s) => s.elements[elementId])
  const updateElement = useBuilderStore((s) => s.updateElement)
  const setEditingId = useBuilderStore((s) => s.setEditingId)

  // Safety exit: if the element is deselected externally while editing, exit cleanly.
  // onBlur handles the normal case (auto-save); this covers programmatic deselects.
  useEffect(() => {
    if (!isSelected && isEditing) {
      setIsEditing(false)
      setEditingId(null)
    }
  }, [isSelected, isEditing, setEditingId])

  const startEdit = () => {
    setIsEditing(true)
    setEditingId(elementId)
  }

  const commitEdit = (rawText: string) => {
    if (!isEditing) return
    setIsEditing(false)
    setEditingId(null)
    const trimmed = rawText.trim()
    if (!trimmed || !element) return
    const content = element.content
    if (
      content.type === 'heading' ||
      content.type === 'paragraph' ||
      content.type === 'button'
    ) {
      updateElement(elementId, { content: { ...content, text: trimmed } })
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditingId(null)
  }

  return { isEditing, isSelected, startEdit, commitEdit, cancelEdit }
}
