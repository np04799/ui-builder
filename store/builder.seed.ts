import { createSection, createRow, createColumn, createElement } from '@/lib/builder.helpers'
import type { BuilderMode } from '@/types/builder.types'
import type { BuilderStoreState } from '@/types/store.types'
import { useBuilderStore } from './builder.store'

// ─────────────────────────────────────────────────────────────────────────────
// Dummy state factory
//
// Produces a minimal but realistic BuilderStoreState representing:
//   Section
//     Row
//       Column (span 8/12/12) → Heading, Paragraph
//       Column (span 4/12/12) → Button
//
// Used for development, example scripts, and future Storybook stories.
// ─────────────────────────────────────────────────────────────────────────────

export function createDummyState(mode: BuilderMode = 'custom'): BuilderStoreState {
  const section = createSection()
  const row = createRow(section.id)
  const col1 = createColumn(row.id, { desktop: 8, tablet: 12, mobile: 12 })
  const col2 = createColumn(row.id, { desktop: 4, tablet: 12, mobile: 12 })

  const heading = createElement(col1.id, {
    type: 'heading',
    level: 'h1',
    text: 'Welcome to BuilderPro',
  })
  const paragraph = createElement(col1.id, {
    type: 'paragraph',
    text: 'Build responsive websites visually — no code required.',
  })
  const button = createElement(col2.id, {
    type: 'button',
    text: 'Get Started',
    href: '/builder',
    variant: 'primary',
  })

  // Wire ordered ID arrays (factories set parent refs; we set child ordering here)
  section.rowIds = [row.id]
  row.columnIds = [col1.id, col2.id]
  col1.elementIds = [heading.id, paragraph.id]
  col2.elementIds = [button.id]

  return {
    sections: { [section.id]: section },
    rows: { [row.id]: row },
    columns: { [col1.id]: col1, [col2.id]: col2 },
    elements: {
      [heading.id]: heading,
      [paragraph.id]: paragraph,
      [button.id]: button,
    },
    sectionOrder: [section.id],
    projectMeta: {
      id: crypto.randomUUID(),
      name: 'Demo Project',
      createdAt: new Date().toISOString(),
    },
    mode,
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
    isDashboardMode: false,
  }
}

/** Replace the current store state with the dummy state. */
export function loadDummyState(mode: BuilderMode = 'custom'): void {
  useBuilderStore.setState(createDummyState(mode))
}
