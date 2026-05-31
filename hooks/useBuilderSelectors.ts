'use client'

import { useShallow } from 'zustand/react/shallow'
import { useBuilderStore } from '@/store/builder.store'
import {
  selectColumn,
  selectColumnElements,
  selectElement,
  selectElementCount,
  selectMode,
  selectOrderedSections,
  selectProjectMeta,
  selectResponsiveMode,
  selectRow,
  selectRowColumns,
  selectSection,
  selectSectionCount,
  selectSectionRows,
  selectSelectedId,
} from '@/store/builder.selectors'
import type { BuilderStoreState } from '@/types/store.types'

// ─────────────────────────────────────────────────────────────────────────────
// Memoized selector hooks
//
// These wrap the raw selectors with the correct Zustand subscription pattern:
//
// - Primitive-returning selectors: subscribed directly (Object.is is correct)
// - Array/object-returning selectors: wrapped with useShallow so the component
//   only rerenders when the contents change, not on every store update
// - Parameterized selectors: the closure captures the current parameter value;
//   useShallow handles equality so no useCallback is needed at the call site
//
// Always use these hooks in React components rather than calling
// useBuilderStore(selectSectionRows(id)) directly.
// ─────────────────────────────────────────────────────────────────────────────

// ── Primitives ────────────────────────────────────────────────────────────────

export const useMode = () => useBuilderStore(selectMode)

export const useResponsiveMode = () => useBuilderStore(selectResponsiveMode)

export const useSelectedId = () => useBuilderStore(selectSelectedId)

export const useSectionCount = () => useBuilderStore(selectSectionCount)

export const useElementCount = () => useBuilderStore(selectElementCount)

// ── Objects ───────────────────────────────────────────────────────────────────

export const useProjectMeta = () => useBuilderStore(useShallow(selectProjectMeta))

// ── Arrays ────────────────────────────────────────────────────────────────────

export const useOrderedSections = () => useBuilderStore(useShallow(selectOrderedSections))

// ── Parameterized — single node lookups ───────────────────────────────────────

export const useSection = (id: string) =>
  useBuilderStore(useShallow((s: BuilderStoreState) => selectSection(id)(s)))

export const useRow = (id: string) =>
  useBuilderStore(useShallow((s: BuilderStoreState) => selectRow(id)(s)))

export const useColumn = (id: string) =>
  useBuilderStore(useShallow((s: BuilderStoreState) => selectColumn(id)(s)))

export const useElement = (id: string) =>
  useBuilderStore(useShallow((s: BuilderStoreState) => selectElement(id)(s)))

// ── Parameterized — child arrays ──────────────────────────────────────────────

export const useSectionRows = (sectionId: string) =>
  useBuilderStore(useShallow((s: BuilderStoreState) => selectSectionRows(sectionId)(s)))

export const useRowColumns = (rowId: string) =>
  useBuilderStore(useShallow((s: BuilderStoreState) => selectRowColumns(rowId)(s)))

export const useColumnElements = (columnId: string) =>
  useBuilderStore(useShallow((s: BuilderStoreState) => selectColumnElements(columnId)(s)))
