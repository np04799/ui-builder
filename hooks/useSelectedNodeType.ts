'use client'

import { useBuilderStore } from '@/store/builder.store'

export type NodeType = 'section' | 'row' | 'column' | 'element'

export function useSelectedNodeType(): NodeType | null {
  return useBuilderStore((s) => {
    const id = s.selectedId
    if (!id) return null
    if (s.sections[id]) return 'section'
    if (s.rows[id]) return 'row'
    if (s.columns[id]) return 'column'
    if (s.elements[id]) return 'element'
    return null
  })
}
