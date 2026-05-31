// ─────────────────────────────────────────────────────────────────────────────
// Typed drag-and-drop protocol
//
// All drag data flows through a single serializable payload transferred via
// dataTransfer.setData / getData so native drag events carry full context.
// ─────────────────────────────────────────────────────────────────────────────

// Use text/plain — Chrome on Windows drops custom MIME types from
// dataTransfer.types during dragover, breaking the typesHas() guard.
// We embed a discriminator in the JSON payload so drops from other sources
// (files, links) can still be rejected at decode time.
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

export type DragPayload = ElementDragPayload | PanelDragPayload | TemplateDragPayload

export function encodeDragPayload(payload: DragPayload): string {
  return JSON.stringify(payload)
}

export function decodeDragPayload(raw: string): DragPayload | null {
  try {
    const p = JSON.parse(raw) as DragPayload
    if (p.type !== 'element' && p.type !== 'panel' && p.type !== 'template') return null
    return p
  } catch {
    return null
  }
}
