// ─────────────────────────────────────────────────────────────────────────────
// Typed drag-and-drop protocol
// ─────────────────────────────────────────────────────────────────────────────

// Use text/plain — Chrome on Windows drops custom MIME types from
// dataTransfer.types during dragover, breaking the typesHas() guard.
export const DND_TYPE = 'text/plain'

export interface ElementDragPayload {
  type: 'element'
  elementId: string
  sourceColumnId: string
  sourceIndex: number
}

export interface PanelDragPayload {
  type: 'panel'
  elementType: string
}

export interface TemplateDragPayload {
  type: 'template'
  templateId: string
}

export interface SectionDragPayload {
  type: 'section'
  sectionId: string
}

export type DragPayload =
  | ElementDragPayload
  | PanelDragPayload
  | TemplateDragPayload
  | SectionDragPayload

export function encodeDragPayload(payload: DragPayload): string {
  return JSON.stringify(payload)
}

export function decodeDragPayload(raw: string): DragPayload | null {
  try {
    const p = JSON.parse(raw) as DragPayload
    if (
      p.type !== 'element' &&
      p.type !== 'panel' &&
      p.type !== 'template' &&
      p.type !== 'section'
    ) return null
    return p
  } catch {
    return null
  }
}
