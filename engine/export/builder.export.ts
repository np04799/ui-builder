import type { BuilderProject } from '@/types/builder.types'
import type { BuilderStoreState } from '@/types/store.types'

export function buildProject(state: BuilderStoreState): BuilderProject | null {
  const { projectMeta, mode, sections, rows, columns, elements, sectionOrder } = state
  if (projectMeta === null) return null

  return {
    id: projectMeta.id,
    name: projectMeta.name,
    mode,
    createdAt: projectMeta.createdAt,
    updatedAt: new Date().toISOString(),
    ...(projectMeta.frameworkVersion ? { frameworkVersion: projectMeta.frameworkVersion } : {}),
    sections: sectionOrder.map((sectionId) => {
      const { rowIds, ...sectionBase } = sections[sectionId]
      return {
        ...sectionBase,
        rows: rowIds.map((rowId) => {
          const { columnIds, sectionId: _s, ...rowBase } = rows[rowId]
          return {
            ...rowBase,
            columns: columnIds.map((columnId) => {
              const { elementIds, rowId: _r, ...colBase } = columns[columnId]
              return {
                ...colBase,
                elements: elementIds.map((elemId) => {
                  const { columnId: _c, ...elemBase } = elements[elemId]
                  return elemBase
                }),
              }
            }),
          }
        }),
      }
    }),
  } satisfies BuilderProject
}
