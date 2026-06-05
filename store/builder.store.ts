import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type {
  Breakpoint,
  BuilderMode,
  BuilderProject,
  ElementContent,
  ResponsiveStyles,
  StyleMap,
} from '@/types/builder.types'
import type {
  BuilderStoreState,
  ClipboardPayload,
  ColumnNode,
  DragState,
  ElementNode,
  LayoutSnapshot,
  OutputPlatform,
  ProjectBranding,
  RowNode,
  SectionNode,
} from '@/types/store.types'
import {
  createColumn,
  createElement,
  createRow,
  createSection,
} from '@/lib/builder.helpers'
import { buildProject } from '@/engine/export/builder.export'
import { saveProjectToFirestore } from '@/lib/firebase'
import { useAuthStore } from '@/store/auth.store'

// ─────────────────────────────────────────────────────────────────────────────
// Empty state factory
//
// Returns fresh object references every call — prevents shared-reference bugs
// when Object.assign is used inside Immer's set() during initProject().
// ─────────────────────────────────────────────────────────────────────────────

const MAX_HISTORY = 50

const createEmptyState = (): BuilderStoreState => ({
  sections: {},
  rows: {},
  columns: {},
  elements: {},
  sectionOrder: [],
  projectMeta: null,
  mode: 'custom',
  responsiveMode: 'desktop',
  selectedId: null,
  editingId: null,
  dragState: null,
  canvasWidth: '100%',
  projectName: 'My Project',
  leftPanelVisible: true,
  rightPanelVisible: true,
  canvasZoom: 1,
  clipboard: null,
  _history: [],
  _future: [],
})

function captureLayout(state: BuilderStoreState): LayoutSnapshot {
  return {
    sections: JSON.parse(JSON.stringify(state.sections)),
    rows: JSON.parse(JSON.stringify(state.rows)),
    columns: JSON.parse(JSON.stringify(state.columns)),
    elements: JSON.parse(JSON.stringify(state.elements)),
    sectionOrder: [...state.sectionOrder],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Action interface
// ─────────────────────────────────────────────────────────────────────────────

interface BuilderActions {
  // ── History ───────────────────────────────────────────────────────────────
  /** Snapshot current layout into history before a mutation. Called internally. */
  pushHistory: () => void
  undo: () => void
  redo: () => void

  // ── Project ──────────────────────────────────────────────────────────────
  /** Initialize a new project, resetting all layout state */
  initProject: (name: string, mode: BuilderMode) => void
  setMode: (mode: BuilderMode) => void
  setBranding: (branding: ProjectBranding) => void
  setLogo: (logoDataUrl: string) => void
  removeLogo: () => void
  setPlatform: (platform: OutputPlatform) => void
  setProjectMetaName: (name: string) => void

  // ── UI state ─────────────────────────────────────────────────────────────
  setResponsiveMode: (mode: Breakpoint) => void
  setSelectedId: (id: string | null) => void
  setEditingId: (id: string | null) => void
  setDragState: (state: DragState | null) => void
  /**
   * Reorder elements within a single column.
   * fromIndex and toIndex are positions in column.elementIds.
   */
  reorderElements: (columnId: string, fromIndex: number, toIndex: number) => void
  /**
   * Move an element from one column to another, inserting at toIndex.
   * Safe to call with sourceColumnId === destColumnId (delegates to reorderElements).
   * Guarantees no duplicate IDs and no orphaned elements.
   */
  /** Move a column from one row to another row at a target index. */
  moveColumnToRow: (columnId: string, destRowId: string, toIndex: number) => void
  /** Move a row from one section to another section at a target index. */
  moveRowToSection: (rowId: string, destSectionId: string, toIndex: number) => void
  /** Move a section to a specific index in sectionOrder. */
  moveSectionToIndex: (sectionId: string, toIndex: number) => void
  /** Move an element to a specific column at a target index. */
  moveElement: (
    elementId: string,
    sourceColumnId: string,
    destColumnId: string,
    toIndex: number,
  ) => void
  /** Move a column left or right within its parent row. */
  reorderColumn: (columnId: string, direction: 'left' | 'right') => void
  /** Move a row up or down within its parent section. */
  reorderRow: (rowId: string, direction: 'up' | 'down') => void
  /** Move a section up or down in sectionOrder. */
  reorderSection: (sectionId: string, direction: 'up' | 'down') => void
  /** Duplicate an element, inserting the copy directly after the original. */
  duplicateElement: (elementId: string) => void
  /** Duplicate a column (with all its elements), inserting after the original. */
  duplicateColumn: (columnId: string) => void
  /** Duplicate a row (with all its columns + elements), inserting after the original. */
  duplicateRow: (rowId: string) => void
  /** Duplicate a section (with all its rows/columns/elements), inserting after the original. */
  duplicateSection: (sectionId: string) => void

  // ── Structure mutations ───────────────────────────────────────────────────
  /**
   * Add a section. Pass afterSectionId to insert after it; omit to append.
   * If afterSectionId is provided but not found, falls back to append.
   */
  addSection: (afterSectionId?: string) => string
  addRow: (sectionId: string) => string
  addColumn: (rowId: string, span?: Partial<Record<Breakpoint, number>>) => string
  addElement: (columnId: string, content: ElementContent) => string
  /** Insert a new 2-column row into the same section, immediately after the row containing columnId */
  addRowAfterColumn: (columnId: string) => string
  /** Append a new empty column to the row containing columnId */
  addColumnToSameRow: (columnId: string) => string

  // ── Element updates ───────────────────────────────────────────────────────
  /**
   * Patch an element. All fields replace (not merge) their counterparts.
   * Callers spread existing state when a partial update is needed:
   *   updateElement(id, { styles: { ...el.styles, color: 'red' } })
   */
  updateElement: (
    elementId: string,
    patch: {
      styles?: StyleMap
      responsive?: ResponsiveStyles
      classNames?: string
      content?: ElementContent
      htmlId?: string
      name?: string
    }
  ) => void

  // ── Cascade deletes ───────────────────────────────────────────────────────
  deleteElement: (elementId: string) => void
  deleteColumn: (columnId: string) => void
  deleteRow: (rowId: string) => void
  deleteSection: (sectionId: string) => void

  updateSection: (sectionId: string, patch: { styles?: Record<string, string>; responsive?: ResponsiveStyles; classNames?: string; htmlId?: string; name?: string }) => void
  updateRow: (rowId: string, patch: { styles?: Record<string, string>; responsive?: ResponsiveStyles; classNames?: string; htmlId?: string; name?: string }) => void
  updateColumn: (columnId: string, patch: {
    styles?: Record<string, string>
    span?: Partial<Record<Breakpoint, number>>
    responsive?: ResponsiveStyles
    classNames?: string
    htmlId?: string
    name?: string
    direction?: 'vertical' | 'horizontal' | 'grid'
    gridColumns?: number
    childGap?: string
  }) => void
  /**
   * Resize two adjacent columns atomically. leftPercent is the new left column
   * width as a percentage (0–100). The right column takes the remainder.
   * Both columns must belong to the same row.
   */
  resizeColumns: (leftColumnId: string, rightColumnId: string, leftPercent: number) => void

  setCanvasWidth: (width: string) => void
  setProjectName: (name: string) => void
  resetCanvas: () => void
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  setCanvasZoom: (zoom: number) => void
  /** Copy the currently selected node into the internal clipboard */
  copySelected: () => void
  /** Paste clipboard contents after the currently selected node (or at end) */
  pasteClipboard: () => void

  insertTemplate: (payload: {
    section: SectionNode
    rows: RowNode[]
    columns: ColumnNode[]
    elements: ElementNode[]
  }) => void

  /**
   * Add an element, auto-creating a section+row+column if the canvas is empty.
   * Selects the new element after insertion.
   */
  quickAddElement: (content: ElementContent) => void

  /**
   * Add a drawer as a full-height app-shell layout:
   * Creates a full app-shell: sticky top header + sidebar drawer + content area.
   */
  addDrawerLayout: (content: ElementContent) => void

  // ── Export ────────────────────────────────────────────────────────────────
  /**
   * Reconstruct the nested project tree for save/export.
   * Delegates to engine/export/builder.export.ts — store is not the source of
   * export logic, only the source of state.
   */
  toProject: () => BuilderProject | null

  // ── Persistence ──────────────────────────────────────────────────────────
  /** Save current project to localStorage. Returns the storage key used. */
  saveProject: () => string | null
  /** Load a project by key from localStorage. Returns true on success. */
  loadProject: (key: string) => boolean
  /** List all saved project keys + metadata from localStorage. */
  listSavedProjects: () => { key: string; name: string; updatedAt: string; mode: string }[]
  /** Delete a saved project from localStorage. */
  deleteSavedProject: (key: string) => void

  // ── Internal lookups (prefer selectors file for React components) ─────────
  getSection: (id: string) => SectionNode | undefined
  getRow: (id: string) => RowNode | undefined
  getColumn: (id: string) => ColumnNode | undefined
  getElement: (id: string) => ElementNode | undefined
}

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

export const useBuilderStore = create<BuilderStoreState & BuilderActions>()(
  immer((set, get) => ({
    ...createEmptyState(),

    // ── History ───────────────────────────────────────────────────────────────

    pushHistory() {
      set((state) => {
        const snap = captureLayout(state)
        state._history.push(snap)
        if (state._history.length > MAX_HISTORY) state._history.shift()
        state._future = []
      })
    },

    undo() {
      set((state) => {
        const snap = state._history.pop()
        if (!snap) return
        state._future.push(captureLayout(state))
        state.sections = snap.sections
        state.rows = snap.rows
        state.columns = snap.columns
        state.elements = snap.elements
        state.sectionOrder = snap.sectionOrder
        state.selectedId = null
      })
    },

    redo() {
      set((state) => {
        const snap = state._future.pop()
        if (!snap) return
        state._history.push(captureLayout(state))
        state.sections = snap.sections
        state.rows = snap.rows
        state.columns = snap.columns
        state.elements = snap.elements
        state.sectionOrder = snap.sectionOrder
        state.selectedId = null
      })
    },

    // ── Project ──────────────────────────────────────────────────────────────

    initProject(name, mode) {
      set((state) => {
        Object.assign(state, createEmptyState())
        state.mode = mode
        state.projectMeta = {
          id: crypto.randomUUID(),
          name,
          createdAt: new Date().toISOString(),
        }
      })
    },

    setMode(mode) {
      set((state) => {
        state.mode = mode
      })
    },

    setBranding(branding) {
      set((state) => {
        if (!state.projectMeta) return
        state.projectMeta.branding = branding
      })
    },

    setLogo(logoDataUrl) {
      set((state) => {
        if (!state.projectMeta) return
        state.projectMeta.logoDataUrl = logoDataUrl
      })
    },

    removeLogo() {
      set((state) => {
        if (!state.projectMeta) return
        delete state.projectMeta.logoDataUrl
      })
    },

    setPlatform(platform) {
      set((state) => {
        if (!state.projectMeta) return
        state.projectMeta.platform = platform
      })
    },

    setProjectMetaName(name) {
      set((state) => {
        if (!state.projectMeta) return
        state.projectMeta.name = name
      })
    },

    // ── UI state ─────────────────────────────────────────────────────────────

    setResponsiveMode(responsiveMode) {
      set((state) => {
        state.responsiveMode = responsiveMode
      })
    },

    setSelectedId(selectedId) {
      set((state) => {
        state.selectedId = selectedId
        if (selectedId === null) state.editingId = null
      })
    },

    setEditingId(editingId) {
      set((state) => {
        state.editingId = editingId
      })
    },

    setDragState(dragState) {
      set((state) => {
        state.dragState = dragState
      })
    },

    reorderElements(columnId, fromIndex, toIndex) {
      if (fromIndex === toIndex) return
      get().pushHistory()
      set((state) => {
        const col = state.columns[columnId]
        if (!col) return
        const ids = [...col.elementIds]
        const [moved] = ids.splice(fromIndex, 1)
        ids.splice(toIndex, 0, moved)
        col.elementIds = ids
      })
    },

    moveColumnToRow(columnId, destRowId, toIndex) {
      get().pushHistory()
      set((state) => {
        const col = state.columns[columnId]
        if (!col) return
        const srcRow = state.rows[col.rowId]
        const dstRow = state.rows[destRowId]
        if (!srcRow || !dstRow) return
        const sameRow = srcRow.id === dstRow.id
        // Remove from source
        srcRow.columnIds = srcRow.columnIds.filter((id) => id !== columnId)
        // Update parent ref
        col.rowId = destRowId
        // Insert
        const clamped = Math.min(toIndex, dstRow.columnIds.length)
        dstRow.columnIds.splice(clamped, 0, columnId)
        // Redistribute spans across both rows if they differ
        const redistribute = (rowId: string) => {
          const r = state.rows[rowId]
          if (!r) return
          const cs = r.columnIds
          const count = cs.length
          if (count > 0) {
            const base = Math.max(1, Math.floor(12 / count))
            const rem = 12 - base * count
            cs.forEach((cid, idx) => {
              const c = state.columns[cid]
              if (!c) return
              const span = base + (idx < rem ? 1 : 0)
              c.span = { desktop: span, tablet: count <= 2 ? span : 6, mobile: 12 }
            })
          }
        }
        redistribute(destRowId)
        if (!sameRow) redistribute(srcRow.id)
      })
    },

    moveRowToSection(rowId, destSectionId, toIndex) {
      get().pushHistory()
      set((state) => {
        const row = state.rows[rowId]
        if (!row) return
        const srcSection = state.sections[row.sectionId]
        const dstSection = state.sections[destSectionId]
        if (!srcSection || !dstSection) return
        // Remove from source
        srcSection.rowIds = srcSection.rowIds.filter((id) => id !== rowId)
        // Update parent ref
        row.sectionId = destSectionId
        // Insert
        const clamped = Math.min(toIndex, dstSection.rowIds.length)
        dstSection.rowIds.splice(clamped, 0, rowId)
      })
    },

    moveSectionToIndex(sectionId, toIndex) {
      get().pushHistory()
      set((state) => {
        const ids = state.sectionOrder
        const fromIdx = ids.indexOf(sectionId)
        if (fromIdx === -1) return
        ids.splice(fromIdx, 1)
        const clamped = Math.min(toIndex, ids.length)
        ids.splice(clamped, 0, sectionId)
      })
    },

    moveElement(elementId, sourceColumnId, destColumnId, toIndex) {
      get().pushHistory()
      // Same column — delegate to reorder
      if (sourceColumnId === destColumnId) {
        const sourceIndex = useBuilderStore
          .getState()
          .columns[sourceColumnId]?.elementIds.indexOf(elementId) ?? -1
        if (sourceIndex === -1) return
        get().reorderElements(sourceColumnId, sourceIndex, toIndex)
        return
      }

      set((state) => {
        const srcCol = state.columns[sourceColumnId]
        const dstCol = state.columns[destColumnId]
        const el = state.elements[elementId]
        if (!srcCol || !dstCol || !el) return

        // Remove from source
        srcCol.elementIds = srcCol.elementIds.filter((id) => id !== elementId)

        // Update element's parent reference
        el.columnId = destColumnId

        // Insert into destination at the requested slot
        const clampedIndex = Math.min(toIndex, dstCol.elementIds.length)
        dstCol.elementIds.splice(clampedIndex, 0, elementId)
      })
    },

    reorderColumn(columnId, direction) {
      get().pushHistory()
      set((state) => {
        const col = state.columns[columnId]
        if (!col) return
        const row = state.rows[col.rowId]
        if (!row) return
        const ids = row.columnIds
        const idx = ids.indexOf(columnId)
        if (idx === -1) return
        const swapIdx = direction === 'left' ? idx - 1 : idx + 1
        if (swapIdx < 0 || swapIdx >= ids.length) return
        ;[ids[idx], ids[swapIdx]] = [ids[swapIdx], ids[idx]]
      })
    },

    reorderRow(rowId, direction) {
      get().pushHistory()
      set((state) => {
        const row = state.rows[rowId]
        if (!row) return
        const section = state.sections[row.sectionId]
        if (!section) return
        const ids = section.rowIds
        const idx = ids.indexOf(rowId)
        if (idx === -1) return
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1
        if (swapIdx < 0 || swapIdx >= ids.length) return
        ;[ids[idx], ids[swapIdx]] = [ids[swapIdx], ids[idx]]
      })
    },

    reorderSection(sectionId, direction) {
      get().pushHistory()
      set((state) => {
        const ids = state.sectionOrder
        const idx = ids.indexOf(sectionId)
        if (idx === -1) return
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1
        if (swapIdx < 0 || swapIdx >= ids.length) return
        ;[ids[idx], ids[swapIdx]] = [ids[swapIdx], ids[idx]]
      })
    },

    duplicateElement(elementId) {
      get().pushHistory()
      const existing = useBuilderStore.getState().elements[elementId]
      if (!existing) return
      const copy = {
        ...existing,
        id: crypto.randomUUID(),
        styles: { ...existing.styles },
        content: { ...existing.content } as typeof existing.content,
      }
      set((state) => {
        const col = state.columns[existing.columnId]
        if (!col) return
        const idx = col.elementIds.indexOf(elementId)
        state.elements[copy.id] = copy
        col.elementIds.splice(idx + 1, 0, copy.id)
      })
    },

    duplicateColumn(columnId) {
      get().pushHistory()
      const state = useBuilderStore.getState()
      const existing = state.columns[columnId]
      if (!existing) return
      const row = state.rows[existing.rowId]
      if (!row) return

      // Deep-copy the column and all its elements
      const newColId = crypto.randomUUID()
      const newElementIds: string[] = []
      const newElements: typeof state.elements = {}
      for (const elemId of existing.elementIds) {
        const elem = state.elements[elemId]
        if (!elem) continue
        const newElemId = crypto.randomUUID()
        newElements[newElemId] = {
          ...elem,
          id: newElemId,
          columnId: newColId,
          styles: { ...elem.styles },
          content: { ...elem.content } as typeof elem.content,
        }
        newElementIds.push(newElemId)
      }

      set((s) => {
        // Register new elements
        for (const [id, el] of Object.entries(newElements)) s.elements[id] = el
        // Register new column
        s.columns[newColId] = {
          ...existing,
          id: newColId,
          elementIds: newElementIds,
          styles: { ...existing.styles },
        }
        // Insert after the original in the row
        const idx = s.rows[existing.rowId]?.columnIds.indexOf(columnId) ?? -1
        if (idx !== -1) {
          s.rows[existing.rowId].columnIds.splice(idx + 1, 0, newColId)
        }
      })
    },

    duplicateRow(rowId) {
      get().pushHistory()
      const state = useBuilderStore.getState()
      const existing = state.rows[rowId]
      if (!existing) return
      const section = state.sections[existing.sectionId]
      if (!section) return

      const newRowId = crypto.randomUUID()
      const newColumnIds: string[] = []

      set((s) => {
        for (const colId of existing.columnIds) {
          const col = s.columns[colId]
          if (!col) continue
          const newColId = crypto.randomUUID()
          const newElemIds: string[] = []
          for (const elemId of col.elementIds) {
            const elem = s.elements[elemId]
            if (!elem) continue
            const newElemId = crypto.randomUUID()
            s.elements[newElemId] = {
              ...elem,
              id: newElemId,
              columnId: newColId,
              styles: { ...elem.styles },
              content: { ...elem.content } as typeof elem.content,
            }
            newElemIds.push(newElemId)
          }
          s.columns[newColId] = { ...col, id: newColId, rowId: newRowId, elementIds: newElemIds, styles: { ...col.styles } }
          newColumnIds.push(newColId)
        }
        s.rows[newRowId] = { ...existing, id: newRowId, columnIds: newColumnIds, styles: { ...existing.styles } }
        const idx = s.sections[existing.sectionId]?.rowIds.indexOf(rowId) ?? -1
        if (idx !== -1) s.sections[existing.sectionId].rowIds.splice(idx + 1, 0, newRowId)
      })
    },

    duplicateSection(sectionId) {
      get().pushHistory()
      const state = useBuilderStore.getState()
      const existing = state.sections[sectionId]
      if (!existing) return

      const newSectionId = crypto.randomUUID()
      const newRowIds: string[] = []

      set((s) => {
        for (const rowId of existing.rowIds) {
          const row = s.rows[rowId]
          if (!row) continue
          const newRowId = crypto.randomUUID()
          const newColIds: string[] = []
          for (const colId of row.columnIds) {
            const col = s.columns[colId]
            if (!col) continue
            const newColId = crypto.randomUUID()
            const newElemIds: string[] = []
            for (const elemId of col.elementIds) {
              const elem = s.elements[elemId]
              if (!elem) continue
              const newElemId = crypto.randomUUID()
              s.elements[newElemId] = {
                ...elem,
                id: newElemId,
                columnId: newColId,
                styles: { ...elem.styles },
                content: { ...elem.content } as typeof elem.content,
              }
              newElemIds.push(newElemId)
            }
            s.columns[newColId] = { ...col, id: newColId, rowId: newRowId, elementIds: newElemIds, styles: { ...col.styles } }
            newColIds.push(newColId)
          }
          s.rows[newRowId] = { ...row, id: newRowId, sectionId: newSectionId, columnIds: newColIds, styles: { ...row.styles } }
          newRowIds.push(newRowId)
        }
        s.sections[newSectionId] = { ...existing, id: newSectionId, rowIds: newRowIds, styles: { ...existing.styles } }
        const idx = s.sectionOrder.indexOf(sectionId)
        if (idx !== -1) s.sectionOrder.splice(idx + 1, 0, newSectionId)
      })
    },

    // ── Structure mutations ───────────────────────────────────────────────────

    addSection(afterSectionId) {
      get().pushHistory()
      const section = createSection()
      // Auto-create a row + column so the section immediately accepts drops
      const row = createRow(section.id)
      const column = createColumn(row.id)
      section.rowIds = [row.id]
      row.columnIds = [column.id]
      set((state) => {
        state.sections[section.id] = section
        state.rows[row.id] = row
        state.columns[column.id] = column
        if (afterSectionId !== undefined) {
          const idx = state.sectionOrder.indexOf(afterSectionId)
          if (idx !== -1) {
            state.sectionOrder.splice(idx + 1, 0, section.id)
          } else {
            state.sectionOrder.push(section.id)
          }
        } else {
          state.sectionOrder.push(section.id)
        }
      })
      return section.id
    },

    addRow(sectionId) {
      get().pushHistory()
      const row = createRow(sectionId)
      set((state) => {
        if (state.sections[sectionId] === undefined) return
        state.rows[row.id] = row
        state.sections[sectionId].rowIds.push(row.id)
      })
      return row.id
    },

    addColumn(rowId, span) {
      get().pushHistory()
      const column = createColumn(rowId, span)
      set((state) => {
        if (state.rows[rowId] === undefined) return
        state.columns[column.id] = column
        state.rows[rowId].columnIds.push(column.id)
        // Auto-distribute spans evenly across all columns in this row (12-col grid)
        const cols = state.rows[rowId].columnIds
        const count = cols.length
        if (count > 0) {
          const baseSpan = Math.max(1, Math.floor(12 / count))
          const remainder = 12 - baseSpan * count
          cols.forEach((cid, idx) => {
            const c = state.columns[cid]
            if (!c) return
            const thisSpan = baseSpan + (idx < remainder ? 1 : 0)
            c.span = { desktop: thisSpan, tablet: count <= 2 ? thisSpan : 6, mobile: 12 }
          })
        }
      })
      return column.id
    },

    addElement(columnId, content) {
      get().pushHistory()
      const element = createElement(columnId, content)
      set((state) => {
        if (state.columns[columnId] === undefined) return
        state.elements[element.id] = element
        state.columns[columnId].elementIds.push(element.id)
      })
      return element.id
    },

    addRowAfterColumn(columnId) {
      get().pushHistory()
      const existingCol = get().columns[columnId]
      if (!existingCol) return ''
      const existingRow = get().rows[existingCol.rowId]
      if (!existingRow) return ''
      const sectionId = existingRow.sectionId
      const row = createRow(sectionId)
      const col1 = createColumn(row.id)
      const col2 = createColumn(row.id)
      row.columnIds = [col1.id, col2.id]
      set((state) => {
        if (!state.sections[sectionId]) return
        state.rows[row.id] = row
        state.columns[col1.id] = col1
        state.columns[col2.id] = col2
        const rowIds = state.sections[sectionId].rowIds
        const idx = rowIds.indexOf(existingRow.id)
        rowIds.splice(idx === -1 ? rowIds.length : idx + 1, 0, row.id)
        state.selectedId = row.id
      })
      return row.id
    },

    addColumnToSameRow(columnId) {
      get().pushHistory()
      const existingCol = get().columns[columnId]
      if (!existingCol) return ''
      const rowId = existingCol.rowId
      const col = createColumn(rowId)
      set((state) => {
        if (!state.rows[rowId]) return
        state.columns[col.id] = col
        state.rows[rowId].columnIds.push(col.id)
        state.selectedId = col.id
        // Auto-distribute spans
        const cols = state.rows[rowId].columnIds
        const count = cols.length
        if (count > 0) {
          const baseSpan = Math.max(1, Math.floor(12 / count))
          const remainder = 12 - baseSpan * count
          cols.forEach((cid, idx) => {
            const c = state.columns[cid]
            if (!c) return
            const thisSpan = baseSpan + (idx < remainder ? 1 : 0)
            c.span = { desktop: thisSpan, tablet: count <= 2 ? thisSpan : 6, mobile: 12 }
          })
        }
      })
      return col.id
    },

    // ── Element updates ───────────────────────────────────────────────────────

    updateElement(elementId, patch) {
      get().pushHistory()
      set((state) => {
        const el = state.elements[elementId]
        if (el === undefined) return
        if (patch.styles !== undefined) {
          // Merge styles — same pattern as updateSection — prevents accidental style wipe
          el.styles = { ...el.styles, ...patch.styles }
        }
        if (patch.responsive !== undefined) el.responsive = patch.responsive
        if (patch.classNames !== undefined) el.classNames = patch.classNames
        if (patch.content !== undefined) el.content = patch.content
        if (patch.htmlId !== undefined) el.htmlId = patch.htmlId
        if (patch.name !== undefined) el.name = patch.name
      })
    },

    updateSection(sectionId, patch) {
      get().pushHistory()
      set((state) => {
        const s = state.sections[sectionId]
        if (!s) return
        if (patch.styles !== undefined) {
          const merged = { ...s.styles, ...patch.styles }
          for (const k of Object.keys(merged)) {
            if (merged[k] === undefined) delete merged[k]
          }
          s.styles = merged
        }
        if (patch.responsive !== undefined) s.responsive = patch.responsive
        if (patch.classNames !== undefined) s.classNames = patch.classNames
        if (patch.htmlId !== undefined) s.htmlId = patch.htmlId
        if (patch.name !== undefined) s.name = patch.name
      })
    },

    updateRow(rowId, patch) {
      get().pushHistory()
      set((state) => {
        const r = state.rows[rowId]
        if (!r) return
        if (patch.styles !== undefined) r.styles = { ...r.styles, ...patch.styles }
        if (patch.responsive !== undefined) r.responsive = patch.responsive
        if (patch.classNames !== undefined) r.classNames = patch.classNames
        if (patch.htmlId !== undefined) r.htmlId = patch.htmlId
        if (patch.name !== undefined) r.name = patch.name
      })
    },

    updateColumn(columnId, patch) {
      get().pushHistory()
      set((state) => {
        const col = state.columns[columnId]
        if (!col) return
        if (patch.styles !== undefined) col.styles = { ...col.styles, ...patch.styles }
        if (patch.span !== undefined) col.span = { ...col.span, ...patch.span }
        if (patch.responsive !== undefined) col.responsive = patch.responsive
        if (patch.classNames !== undefined) col.classNames = patch.classNames
        if (patch.htmlId !== undefined) col.htmlId = patch.htmlId
        if (patch.name !== undefined) col.name = patch.name
        if (patch.direction !== undefined) col.direction = patch.direction
        if (patch.gridColumns !== undefined) col.gridColumns = patch.gridColumns
        if (patch.childGap !== undefined) col.childGap = patch.childGap
      })
    },

    resizeColumns(leftColumnId, rightColumnId, leftPercent) {
      get().pushHistory()
      set((state) => {
        const left = state.columns[leftColumnId]
        const right = state.columns[rightColumnId]
        if (!left || !right) return

        // Clamp to 1-col minimum on each side (~8.33%)
        const clamped = Math.min(Math.max(leftPercent, 8.34), 91.66)
        // Snap to nearest 1/12 grid step
        const snap = (pct: number) => Math.round((pct / 100) * 12) / 12 * 100
        const leftSnapped = snap(clamped)
        const rightSnapped = 100 - leftSnapped

        const toSpan = (pct: number) => Math.max(1, Math.min(12, Math.round((pct / 100) * 12)))
        const leftSpan = toSpan(leftSnapped)
        const rightSpan = 12 - leftSpan

        // Desktop: use the dragged values
        left.styles = { ...left.styles, flexBasis: `${leftSnapped.toFixed(4)}%`, flexGrow: '0', flexShrink: '0' }
        right.styles = { ...right.styles, flexBasis: `${rightSnapped.toFixed(4)}%`, flexGrow: '0', flexShrink: '0' }
        left.span = { ...left.span, desktop: leftSpan }
        right.span = { ...right.span, desktop: rightSpan }

        // Tablet: each column ≥ 6 (at least half width)
        const tabletLeft = leftSpan <= 4 ? 6 : leftSpan >= 8 ? 12 : 6
        const tabletRight = 12 - tabletLeft
        const tabletLeftPct = (tabletLeft / 12 * 100).toFixed(4)
        const tabletRightPct = (tabletRight / 12 * 100).toFixed(4)
        left.span = { ...left.span, tablet: tabletLeft }
        right.span = { ...right.span, tablet: tabletRight }
        left.responsive = {
          ...left.responsive,
          tablet: { ...left.responsive?.tablet, flexBasis: `${tabletLeftPct}%`, flexGrow: '0', flexShrink: '0' },
          mobile: { ...left.responsive?.mobile, flexBasis: '100%', flexGrow: '0', flexShrink: '0' },
        }
        right.responsive = {
          ...right.responsive,
          tablet: { ...right.responsive?.tablet, flexBasis: `${tabletRightPct}%`, flexGrow: '0', flexShrink: '0' },
          mobile: { ...right.responsive?.mobile, flexBasis: '100%', flexGrow: '0', flexShrink: '0' },
        }
      })
    },

    setCanvasWidth(width) {
      set((state) => { state.canvasWidth = width })
    },

    setProjectName(name) {
      set((state) => { state.projectName = name })
    },

    toggleLeftPanel() {
      set((state) => { state.leftPanelVisible = !state.leftPanelVisible })
    },

    toggleRightPanel() {
      set((state) => { state.rightPanelVisible = !state.rightPanelVisible })
    },

    setCanvasZoom(zoom) {
      set((state) => { state.canvasZoom = Math.min(2, Math.max(0.25, zoom)) })
    },

    copySelected() {
      const state = get()
      const id = state.selectedId
      if (!id) return

      let payload: ClipboardPayload | null = null

      if (state.elements[id]) {
        payload = {
          kind: 'element',
          node: JSON.parse(JSON.stringify(state.elements[id])),
        }
      } else if (state.columns[id]) {
        const col = state.columns[id]
        payload = {
          kind: 'column',
          node: JSON.parse(JSON.stringify(col)),
          elements: col.elementIds.map((eid) => JSON.parse(JSON.stringify(state.elements[eid]))).filter(Boolean),
        }
      } else if (state.rows[id]) {
        const row = state.rows[id]
        const cols: ColumnNode[] = row.columnIds.map((cid) => state.columns[cid]).filter(Boolean).map((c) => JSON.parse(JSON.stringify(c)))
        const elems: ElementNode[] = cols.flatMap((c) => c.elementIds.map((eid) => state.elements[eid]).filter(Boolean).map((e) => JSON.parse(JSON.stringify(e))))
        payload = { kind: 'row', node: JSON.parse(JSON.stringify(row)), columns: cols, elements: elems }
      } else if (state.sections[id]) {
        const sec = state.sections[id]
        const rows: RowNode[] = sec.rowIds.map((rid) => state.rows[rid]).filter(Boolean).map((r) => JSON.parse(JSON.stringify(r)))
        const cols: ColumnNode[] = rows.flatMap((r) => r.columnIds.map((cid) => state.columns[cid]).filter(Boolean).map((c) => JSON.parse(JSON.stringify(c))))
        const elems: ElementNode[] = cols.flatMap((c) => c.elementIds.map((eid) => state.elements[eid]).filter(Boolean).map((e) => JSON.parse(JSON.stringify(e))))
        payload = { kind: 'section', node: JSON.parse(JSON.stringify(sec)), rows, columns: cols, elements: elems }
      }

      if (payload) set((s) => { s.clipboard = payload })
    },

    pasteClipboard() {
      const state = get()
      const cb = state.clipboard
      if (!cb) return
      get().pushHistory()

      set((s) => {
        const selectedId = s.selectedId

        if (cb.kind === 'element') {
          // Paste into the same column as the selected element, or first available column
          let targetColumnId: string | null = null
          let insertAfterIdx = -1

          if (selectedId && s.elements[selectedId]) {
            targetColumnId = s.elements[selectedId].columnId
            insertAfterIdx = s.columns[targetColumnId]?.elementIds.indexOf(selectedId) ?? -1
          } else if (selectedId && s.columns[selectedId]) {
            targetColumnId = selectedId
          } else {
            const firstCol = Object.keys(s.columns)[0]
            if (firstCol) targetColumnId = firstCol
          }

          if (!targetColumnId || !s.columns[targetColumnId]) return
          const newId = crypto.randomUUID()
          s.elements[newId] = { ...cb.node, id: newId, columnId: targetColumnId }
          const col = s.columns[targetColumnId]
          col.elementIds.splice(insertAfterIdx + 1, 0, newId)
          s.selectedId = newId

        } else if (cb.kind === 'column') {
          // Paste into the same row as the selected column, or append to first row
          let targetRowId: string | null = null
          let insertAfterIdx = -1

          if (selectedId && s.columns[selectedId]) {
            targetRowId = s.columns[selectedId].rowId
            insertAfterIdx = s.rows[targetRowId]?.columnIds.indexOf(selectedId) ?? -1
          } else if (selectedId && s.rows[selectedId]) {
            targetRowId = selectedId
          } else {
            const firstRow = Object.keys(s.rows)[0]
            if (firstRow) targetRowId = firstRow
          }

          if (!targetRowId || !s.rows[targetRowId]) return

          // Remap all IDs
          const newColId = crypto.randomUUID()
          const idMap = new Map<string, string>()
          for (const elem of cb.elements) idMap.set(elem.id, crypto.randomUUID())

          const newElemIds: string[] = []
          for (const elem of cb.elements) {
            const newElemId = idMap.get(elem.id)!
            s.elements[newElemId] = { ...elem, id: newElemId, columnId: newColId }
            newElemIds.push(newElemId)
          }
          s.columns[newColId] = { ...cb.node, id: newColId, rowId: targetRowId, elementIds: newElemIds }
          s.rows[targetRowId].columnIds.splice(insertAfterIdx + 1, 0, newColId)
          s.selectedId = newColId

        } else if (cb.kind === 'row') {
          // Paste into the same section as the selected row, or first section
          let targetSectionId: string | null = null
          let insertAfterIdx = -1

          if (selectedId && s.rows[selectedId]) {
            targetSectionId = s.rows[selectedId].sectionId
            insertAfterIdx = s.sections[targetSectionId]?.rowIds.indexOf(selectedId) ?? -1
          } else if (selectedId && s.sections[selectedId]) {
            targetSectionId = selectedId
          } else {
            targetSectionId = s.sectionOrder[0] ?? null
          }

          if (!targetSectionId || !s.sections[targetSectionId]) return

          const newRowId = crypto.randomUUID()
          const colIdMap = new Map<string, string>()
          for (const col of cb.columns) colIdMap.set(col.id, crypto.randomUUID())
          const elemIdMap = new Map<string, string>()
          for (const elem of cb.elements) elemIdMap.set(elem.id, crypto.randomUUID())

          for (const elem of cb.elements) {
            const newElemId = elemIdMap.get(elem.id)!
            const newColId = colIdMap.get(elem.columnId)!
            s.elements[newElemId] = { ...elem, id: newElemId, columnId: newColId }
          }

          const newColIds: string[] = []
          for (const col of cb.columns) {
            const newColId = colIdMap.get(col.id)!
            const newElemIds = col.elementIds.map((eid) => elemIdMap.get(eid)).filter(Boolean) as string[]
            s.columns[newColId] = { ...col, id: newColId, rowId: newRowId, elementIds: newElemIds }
            newColIds.push(newColId)
          }

          s.rows[newRowId] = { ...cb.node, id: newRowId, sectionId: targetSectionId, columnIds: newColIds }
          s.sections[targetSectionId].rowIds.splice(insertAfterIdx + 1, 0, newRowId)
          s.selectedId = newRowId

        } else if (cb.kind === 'section') {
          // Paste after the selected section, or at end
          let insertAfterIdx = s.sectionOrder.length - 1
          if (selectedId && s.sections[selectedId]) {
            insertAfterIdx = s.sectionOrder.indexOf(selectedId)
          }

          const newSecId = crypto.randomUUID()
          const rowIdMap = new Map<string, string>()
          for (const row of cb.rows) rowIdMap.set(row.id, crypto.randomUUID())
          const colIdMap = new Map<string, string>()
          for (const col of cb.columns) colIdMap.set(col.id, crypto.randomUUID())
          const elemIdMap = new Map<string, string>()
          for (const elem of cb.elements) elemIdMap.set(elem.id, crypto.randomUUID())

          for (const elem of cb.elements) {
            const newElemId = elemIdMap.get(elem.id)!
            const newColId = colIdMap.get(elem.columnId)!
            s.elements[newElemId] = { ...elem, id: newElemId, columnId: newColId }
          }

          for (const col of cb.columns) {
            const newColId = colIdMap.get(col.id)!
            const newRowId = rowIdMap.get(col.rowId)!
            const newElemIds = col.elementIds.map((eid) => elemIdMap.get(eid)).filter(Boolean) as string[]
            s.columns[newColId] = { ...col, id: newColId, rowId: newRowId, elementIds: newElemIds }
          }

          const newRowIds: string[] = []
          for (const row of cb.rows) {
            const newRowId = rowIdMap.get(row.id)!
            const newColIds = row.columnIds.map((cid) => colIdMap.get(cid)).filter(Boolean) as string[]
            s.rows[newRowId] = { ...row, id: newRowId, sectionId: newSecId, columnIds: newColIds }
            newRowIds.push(newRowId)
          }

          s.sections[newSecId] = { ...cb.node, id: newSecId, rowIds: newRowIds }
          s.sectionOrder.splice(insertAfterIdx + 1, 0, newSecId)
          s.selectedId = newSecId
        }
      })
    },

    resetCanvas() {
      set((state) => {
        const preserved = {
          canvasWidth: state.canvasWidth,
          projectName: state.projectName,
          leftPanelVisible: state.leftPanelVisible,
          rightPanelVisible: state.rightPanelVisible,
          canvasZoom: state.canvasZoom,
        }
        Object.assign(state, createEmptyState())
        state.canvasWidth = preserved.canvasWidth
        state.projectName = preserved.projectName
        state.leftPanelVisible = preserved.leftPanelVisible
        state.rightPanelVisible = preserved.rightPanelVisible
        state.canvasZoom = preserved.canvasZoom
      })
    },

    // ── Cascade deletes ───────────────────────────────────────────────────────

    deleteElement(elementId) {
      get().pushHistory()
      set((state) => {
        const el = state.elements[elementId]
        if (el === undefined) return
        const col = state.columns[el.columnId]
        if (col !== undefined) {
          col.elementIds = col.elementIds.filter((id) => id !== elementId)
        }
        delete state.elements[elementId]
        if (state.selectedId === elementId) state.selectedId = null
      })
    },

    deleteColumn(columnId) {
      get().pushHistory()
      set((state) => {
        const col = state.columns[columnId]
        if (col === undefined) return
        const rowId = col.rowId
        for (const elemId of col.elementIds) delete state.elements[elemId]
        const row = state.rows[rowId]
        if (row !== undefined) {
          row.columnIds = row.columnIds.filter((id) => id !== columnId)
        }
        delete state.columns[columnId]
        if (state.selectedId === columnId) state.selectedId = null
        // Redistribute spans across remaining columns
        if (row !== undefined) {
          const cols = row.columnIds
          const count = cols.length
          if (count > 0) {
            const baseSpan = Math.max(1, Math.floor(12 / count))
            const remainder = 12 - baseSpan * count
            cols.forEach((cid, idx) => {
              const c = state.columns[cid]
              if (!c) return
              const thisSpan = baseSpan + (idx < remainder ? 1 : 0)
              c.span = { desktop: thisSpan, tablet: count <= 2 ? thisSpan : 6, mobile: 12 }
            })
          }
        }
      })
    },

    deleteRow(rowId) {
      get().pushHistory()
      set((state) => {
        const row = state.rows[rowId]
        if (row === undefined) return
        for (const colId of row.columnIds) {
          const col = state.columns[colId]
          if (col !== undefined) {
            for (const elemId of col.elementIds) delete state.elements[elemId]
          }
          delete state.columns[colId]
        }
        const section = state.sections[row.sectionId]
        if (section !== undefined) {
          section.rowIds = section.rowIds.filter((id) => id !== rowId)
        }
        delete state.rows[rowId]
        if (state.selectedId === rowId) state.selectedId = null
      })
    },

    deleteSection(sectionId) {
      get().pushHistory()
      set((state) => {
        const section = state.sections[sectionId]
        if (section === undefined) return
        for (const rowId of section.rowIds) {
          const row = state.rows[rowId]
          if (row !== undefined) {
            for (const colId of row.columnIds) {
              const col = state.columns[colId]
              if (col !== undefined) {
                for (const elemId of col.elementIds) delete state.elements[elemId]
              }
              delete state.columns[colId]
            }
          }
          delete state.rows[rowId]
        }
        state.sectionOrder = state.sectionOrder.filter((id) => id !== sectionId)
        delete state.sections[sectionId]
        if (state.selectedId === sectionId) state.selectedId = null
      })
    },

    insertTemplate({ section, rows, columns, elements }) {
      get().pushHistory()
      set((state) => {
        state.sections[section.id] = section
        for (const row of rows) state.rows[row.id] = row
        for (const col of columns) state.columns[col.id] = col
        for (const el of elements) state.elements[el.id] = el
        state.sectionOrder.push(section.id)
        state.selectedId = section.id
      })
    },

    quickAddElement(content) {
      get().pushHistory()
      set((state) => {
        // Find the last column in the last section, or create structure from scratch
        let columnId: string | null = null
        const lastSectionId = state.sectionOrder[state.sectionOrder.length - 1]
        if (lastSectionId) {
          const section = state.sections[lastSectionId]
          const lastRowId = section?.rowIds[section.rowIds.length - 1]
          if (lastRowId) {
            const row = state.rows[lastRowId]
            columnId = row?.columnIds[row.columnIds.length - 1] ?? null
          }
        }

        if (!columnId) {
          // No structure — build section + row + column
          const section = createSection()
          const row = createRow(section.id)
          const column = createColumn(row.id)
          section.rowIds = [row.id]
          row.columnIds = [column.id]
          state.sections[section.id] = section
          state.rows[row.id] = row
          state.columns[column.id] = column
          state.sectionOrder.push(section.id)
          columnId = column.id
        }

        const element = createElement(columnId, content)

        // For section-block / div-container: create a managed child column
        // so users can drag elements directly into the container
        if (content.type === 'section-block' || content.type === 'div-container') {
          // Find the row that owns this column
          const rowId = Object.values(state.rows).find(r => r.columnIds.includes(columnId))?.id ?? ''
          const managedCol = createColumn(rowId)
          managedCol.managedBy = element.id  // owned by this element
          managedCol.styles = { minHeight: '60px', width: '100%' }
          state.columns[managedCol.id] = managedCol
          ;(element.content as Record<string, unknown>).contentColumnId = managedCol.id
        }

        state.elements[element.id] = element
        state.columns[columnId].elementIds.push(element.id)
        state.selectedId = element.id
      })
    },

    addDrawerLayout(content) {
      get().pushHistory()
      set((state) => {
        // Section fills full viewport, no padding/maxWidth constraints.
        const section = createSection()
        section.styles = { padding: '0', margin: '0', maxWidth: 'none', height: '100vh' }

        // Single row stretches to fill the section height.
        const row = createRow(section.id)
        row.styles = { width: '100%', height: '100%', alignItems: 'stretch' }
        row.locked = true // prevent accidental extra columns via the + button

        // Col 1: holds the DrawerElement (app-shell owner: top header + sidebar)
        const drawerCol = createColumn(row.id)
        drawerCol.styles = { padding: '0', display: 'flex', flexDirection: 'column', minWidth: '0', height: '100%' }

        // Col 2: free content column rendered inside the drawer's right panel.
        // managedBy marks it as internally owned — row-level renderers skip it.
        const contentCol = createColumn(row.id)
        contentCol.styles = { flex: '1', padding: '0', minWidth: '0', height: '100%' }
        contentCol.managedBy = 'drawer'

        // Wire contentColumnId into the drawer element content
        const drawerContent = content.type === 'drawer'
          ? { ...content, contentColumnId: contentCol.id }
          : content
        const drawerEl = createElement(drawerCol.id, drawerContent)

        section.rowIds = [row.id]
        row.columnIds = [drawerCol.id, contentCol.id]
        drawerCol.elementIds = [drawerEl.id]

        state.sections[section.id] = section
        state.rows[row.id] = row
        state.columns[drawerCol.id] = drawerCol
        state.columns[contentCol.id] = contentCol
        state.elements[drawerEl.id] = drawerEl
        state.sectionOrder.push(section.id)
        state.selectedId = drawerEl.id
      })
    },

    // ── Export ────────────────────────────────────────────────────────────────

    // ── Persistence ──────────────────────────────────────────────────────────

    saveProject() {
      const state = get()
      if (!state.projectMeta) return null
      const key = `bp_project_${state.projectMeta.id}`
      const payload = {
        sections: state.sections,
        rows: state.rows,
        columns: state.columns,
        elements: state.elements,
        sectionOrder: state.sectionOrder,
        projectMeta: { ...state.projectMeta, updatedAt: new Date().toISOString() },
        mode: state.mode,
        canvasWidth: state.canvasWidth,
      }
      // Try Firestore first if user is logged in
      const user = typeof window !== 'undefined' ? useAuthStore.getState().user : null
      if (user) {
        saveProjectToFirestore(user.uid, state.projectMeta.id, payload).catch(console.error)
      }
      // Always also save to localStorage as offline fallback
      try {
        localStorage.setItem(key, JSON.stringify(payload))
        const indexRaw = localStorage.getItem('bp_project_index') ?? '[]'
        const index: { key: string; name: string; updatedAt: string; mode: string }[] = JSON.parse(indexRaw)
        const entry = { key, name: state.projectMeta.name, updatedAt: payload.projectMeta.updatedAt ?? new Date().toISOString(), mode: state.mode }
        const existing = index.findIndex((i) => i.key === key)
        if (existing >= 0) index[existing] = entry
        else index.push(entry)
        localStorage.setItem('bp_project_index', JSON.stringify(index))
        return key
      } catch {
        return null
      }
    },

    loadProject(key) {
      try {
        const raw = localStorage.getItem(key)
        if (!raw) return false
        const payload = JSON.parse(raw)
        set((state) => {
          Object.assign(state, createEmptyState())
          state.sections = payload.sections ?? {}
          state.rows = payload.rows ?? {}
          state.columns = payload.columns ?? {}
          state.elements = payload.elements ?? {}
          state.sectionOrder = payload.sectionOrder ?? []
          state.projectMeta = payload.projectMeta ?? null
          state.mode = payload.mode ?? 'custom'
          state.canvasWidth = payload.canvasWidth ?? '100%'
        })
        return true
      } catch {
        return false
      }
    },

    listSavedProjects() {
      try {
        const raw = localStorage.getItem('bp_project_index') ?? '[]'
        return JSON.parse(raw)
      } catch {
        return []
      }
    },

    deleteSavedProject(key) {
      try {
        localStorage.removeItem(key)
        const raw = localStorage.getItem('bp_project_index') ?? '[]'
        const index = (JSON.parse(raw) as { key: string }[]).filter((i) => i.key !== key)
        localStorage.setItem('bp_project_index', JSON.stringify(index))
      } catch { /* ignore */ }
    },

    toProject() {
      return buildProject(get())
    },

    // ── Internal lookups ──────────────────────────────────────────────────────

    getSection: (id) => get().sections[id],
    getRow: (id) => get().rows[id],
    getColumn: (id) => get().columns[id],
    getElement: (id) => get().elements[id],
  }))
)
