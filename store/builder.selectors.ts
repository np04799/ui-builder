import type { BuilderMode, Breakpoint } from '@/types/builder.types'
import type {
  BuilderStoreState,
  ColumnNode,
  ElementNode,
  RowNode,
  SectionNode,
} from '@/types/store.types'

// ─────────────────────────────────────────────────────────────────────────────
// Pure selector functions
//
// These are plain (state) => T functions, compatible with any Zustand-based
// subscription or external consumer (getState(), tests, scripts).
//
// USAGE IN REACT COMPONENTS — two rules:
//
// 1. Primitive selectors (return string | number | boolean | null):
//      const mode = useBuilderStore(selectMode)
//    Safe without extra wrapping — Object.is comparison handles primitives.
//
// 2. Array / object selectors (return arrays or objects):
//      // Wrong — rerenders on every state change
//      const sections = useBuilderStore(selectOrderedSections)
//
//      // Correct — use pre-wrapped hooks from hooks/useBuilderSelectors.ts
//      const sections = useOrderedSections()
//
// 3. Parameterized selectors (curried — return a selector function):
//      // Wrong — creates a new function reference every render
//      const rows = useBuilderStore(selectSectionRows(sectionId))
//
//      // Correct — use pre-wrapped hooks from hooks/useBuilderSelectors.ts
//      const rows = useSectionRows(sectionId)
//
// ─────────────────────────────────────────────────────────────────────────────

// ── Primitive selectors — safe to use directly in useBuilderStore() ───────────

export const selectMode = (s: BuilderStoreState): BuilderMode => s.mode

export const selectResponsiveMode = (s: BuilderStoreState): Breakpoint => s.responsiveMode

export const selectSelectedId = (s: BuilderStoreState): string | null => s.selectedId

export const selectSectionCount = (s: BuilderStoreState): number => s.sectionOrder.length

export const selectElementCount = (s: BuilderStoreState): number =>
  Object.keys(s.elements).length

// ── Object selectors — use useShallow at the call site or via hooks ───────────

export const selectProjectMeta = (s: BuilderStoreState) => s.projectMeta

/** All sections in display order. Use useOrderedSections() hook in components. */
export const selectOrderedSections = (s: BuilderStoreState): SectionNode[] =>
  s.sectionOrder
    .map((id) => s.sections[id])
    .filter((n): n is SectionNode => n !== undefined)

// ── Parameterized selectors — use corresponding hooks in components ────────────

export const selectSection =
  (id: string) =>
  (s: BuilderStoreState): SectionNode | undefined =>
    s.sections[id]

export const selectRow =
  (id: string) =>
  (s: BuilderStoreState): RowNode | undefined =>
    s.rows[id]

export const selectColumn =
  (id: string) =>
  (s: BuilderStoreState): ColumnNode | undefined =>
    s.columns[id]

export const selectElement =
  (id: string) =>
  (s: BuilderStoreState): ElementNode | undefined =>
    s.elements[id]

/** Ordered rows for a section. Use useSectionRows() hook in components. */
export const selectSectionRows =
  (sectionId: string) =>
  (s: BuilderStoreState): RowNode[] =>
    (s.sections[sectionId]?.rowIds ?? [])
      .map((id) => s.rows[id])
      .filter((n): n is RowNode => n !== undefined)

/** Ordered columns for a row. Use useRowColumns() hook in components. */
export const selectRowColumns =
  (rowId: string) =>
  (s: BuilderStoreState): ColumnNode[] =>
    (s.rows[rowId]?.columnIds ?? [])
      .map((id) => s.columns[id])
      .filter((n): n is ColumnNode => n !== undefined)

/** Ordered elements for a column. Use useColumnElements() hook in components. */
export const selectColumnElements =
  (columnId: string) =>
  (s: BuilderStoreState): ElementNode[] =>
    (s.columns[columnId]?.elementIds ?? [])
      .map((id) => s.elements[id])
      .filter((n): n is ElementNode => n !== undefined)
