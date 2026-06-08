'use client'

import { createContext, useContext } from 'react'
import type { BuilderStoreState } from '@/types/store.types'

/**
 * Populated only in preview mode (/preview page).
 * When present, DrawerElement renders its content column directly from
 * serialized state instead of using the Zustand-backed ColumnRenderer.
 */
export const PreviewStateContext = createContext<BuilderStoreState | null>(null)

export function usePreviewState() {
  return useContext(PreviewStateContext)
}
