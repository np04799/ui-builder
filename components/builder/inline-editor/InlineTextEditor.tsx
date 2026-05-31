'use client'

import { useRef, useEffect, memo } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import { useInlineEdit } from '@/hooks/useInlineEdit'

interface Props {
  id: string
  text: string
  placeholder: string
  /** CSSProperties that make the contentEditable look identical to the rendered element */
  editingStyle: React.CSSProperties
  children: React.ReactNode
}

// ─────────────────────────────────────────────────────────────────────────────
// InlineTextEditor
//
// Sits inside SelectionWrapper, outside the rendered element.
//
// Display mode (not editing):
//   Renders `children` wrapped in a display:contents shell. The shell intercepts
//   click-when-selected → startEdit, and double-click → startEdit. It is
//   invisible to layout (display:contents generates no box of its own).
//
// Edit mode:
//   Replaces `children` with a contentEditable div styled to match the element.
//   Enter saves, Escape cancels, blur auto-saves. All events are stopped so
//   SelectionWrapper / canvas do not interfere while the user is typing.
// ─────────────────────────────────────────────────────────────────────────────

export default memo(function InlineTextEditor({
  id,
  text,
  placeholder,
  editingStyle,
  children,
}: Props) {
  const { isEditing, isSelected, startEdit, commitEdit, cancelEdit } =
    useInlineEdit(id)
  const setSelectedId = useBuilderStore((s) => s.setSelectedId)
  const editRef = useRef<HTMLDivElement>(null)

  // Focus + select-all when editing starts
  useEffect(() => {
    if (!isEditing || !editRef.current) return
    const el = editRef.current
    el.focus()
    const range = document.createRange()
    range.selectNodeContents(el)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }, [isEditing])

  if (isEditing) {
    return (
      <div
        ref={editRef}
        contentEditable
        suppressContentEditableWarning
        data-editing-id={id}
        style={{
          ...editingStyle,
          outline: 'none',
          cursor: 'text',
          minWidth: '1px',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            commitEdit(editRef.current?.innerText ?? '')
          }
          if (e.key === 'Escape') {
            e.preventDefault()
            cancelEdit()
          }
        }}
        onBlur={() => {
          commitEdit(editRef.current?.innerText ?? '')
        }}
        // Prevent canvas / SelectionWrapper handlers from firing during editing
        onClick={(e) => e.stopPropagation()}
        onMouseOver={(e) => e.stopPropagation()}
        onMouseOut={(e) => e.stopPropagation()}
      />
    )
  }

  return (
    <div
      style={{ display: 'contents' }}
      onClick={(e) => {
        if (!isSelected) return
        e.stopPropagation()
        startEdit()
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        // Ensure the element is selected in the store before activating edit mode
        setSelectedId(id)
        startEdit()
      }}
    >
      {children}
    </div>
  )
})
