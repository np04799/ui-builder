import type {
  BuilderElement,
  BuilderSection,
  BuilderRow,
  BuilderColumn,
  BuilderMode,
  Breakpoint,
} from './builder.types'

// ─────────────────────────────────────────────────────────────────────────────
// Normalized store-layer node types
//
// The export-layer types (BuilderSection, BuilderRow, BuilderColumn) embed
// children as arrays. The store-layer replaces those with ordered ID arrays
// and adds upward parent references — enabling O(1) lookup and cheap drag-drop
// reordering without deep tree traversal.
//
// Store → export conversion happens in toProject() by stripping store-only
// fields and reconstructing the nested tree.
// ─────────────────────────────────────────────────────────────────────────────

/** Section node: rows replaced by ordered row ID array */
export type SectionNode = Omit<BuilderSection, 'rows'> & {
  rowIds: string[]
}

/** Row node: columns replaced by ordered column ID array + parent section ref */
export type RowNode = Omit<BuilderRow, 'columns'> & {
  columnIds: string[]
  sectionId: string
}

/** Column node: elements replaced by ordered element ID array + parent row ref */
export type ColumnNode = Omit<BuilderColumn, 'elements'> & {
  elementIds: string[]
  rowId: string
}

/** Element node: leaf node, adds parent column ref for O(1) delete/move */
export type ElementNode = BuilderElement & {
  columnId: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Project metadata
// Separated from the layout tree so the tree can be reset without losing meta.
// ─────────────────────────────────────────────────────────────────────────────

export type OutputPlatform = 'react' | 'angular' | 'vue' | 'html'

export interface ProjectBranding {
  primaryColor: string
  fontFamily: string
}

export interface BuilderProjectMeta {
  id: string
  name: string
  createdAt: string
  logoDataUrl?: string
  branding?: ProjectBranding
  platform?: OutputPlatform
  /** Canvas layout mode — flex-flow (document flow) or fixed-grid (snap grid) */
  canvasLayout?: 'flex-flow' | 'fixed-grid'
  /**
   * Locked stable version of the UI framework at project-creation time.
   * Written into package.json at export. e.g. "5.3.3" for Bootstrap.
   * Resolved by lib/versionRegistry.ts during project init.
   */
  frameworkVersion?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Store state shape (data only — actions defined separately in store file)
// ─────────────────────────────────────────────────────────────────────────────

/** Snapshot of layout-only state for undo/redo */
export interface LayoutSnapshot {
  sections: Record<string, SectionNode>
  rows: Record<string, RowNode>
  columns: Record<string, ColumnNode>
  elements: Record<string, ElementNode>
  sectionOrder: string[]
}

export interface BuilderStoreState {
  /** Normalized entity maps — O(1) access by ID */
  sections: Record<string, SectionNode>
  rows: Record<string, RowNode>
  columns: Record<string, ColumnNode>
  elements: Record<string, ElementNode>

  /** Top-level section ordering */
  sectionOrder: string[]

  /** Undo/redo history stacks (layout snapshots only) */
  _history: LayoutSnapshot[]
  _future: LayoutSnapshot[]

  /** Project metadata — null until initProject() is called */
  projectMeta: BuilderProjectMeta | null

  /** Active builder mode — controls layout/export/styling engine */
  mode: BuilderMode

  /** Active responsive preview breakpoint */
  responsiveMode: Breakpoint

  /** ID of the currently selected node (any level) */
  selectedId: string | null

  /** ID of the element currently in inline-edit mode (null when not editing) */
  editingId: string | null

  /** Drag-and-drop ephemeral state — null when no drag is active */
  dragState: DragState | null

  /** Canvas max-width: '100%' = full width, or a px value like '1200px' */
  canvasWidth: string

  /** Project name, editable from settings */
  projectName: string

  /** Panel visibility — can be hidden for distraction-free canvas editing */
  leftPanelVisible: boolean
  rightPanelVisible: boolean

  /** Canvas zoom level: 1 = 100%, 0.5 = 50%, 1.5 = 150%, etc. */
  canvasZoom: number

  /** Copy/paste clipboard — serialized node payload, null when empty */
  clipboard: ClipboardPayload | null

  /** When true, the canvas renders the KPI Dashboard instead of the Section/Row/Col builder */
  isDashboardMode: boolean
}

export type ClipboardPayload =
  | { kind: 'element'; node: ElementNode }
  | { kind: 'column'; node: ColumnNode; elements: ElementNode[] }
  | { kind: 'row'; node: RowNode; columns: ColumnNode[]; elements: ElementNode[] }
  | { kind: 'section'; node: SectionNode; rows: RowNode[]; columns: ColumnNode[]; elements: ElementNode[] }

export interface DragState {
  /** Element being dragged */
  elementId: string
  /** Column the drag started in */
  sourceColumnId: string
}
