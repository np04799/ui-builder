/**
 * BuilderPro store — example usage
 *
 * Demonstrates the full add flow: Section → Row → Column → Element.
 * All actions are called via useBuilderStore.getState() — no React required.
 *
 * To run (Node 18+, after compiling):
 *   npx ts-node --esm store/builder.example.ts
 *
 * Or import into any client component and call exampleUsage() in useEffect.
 */

import { useBuilderStore } from './builder.store'
import {
  selectOrderedSections,
  selectSectionRows,
  selectRowColumns,
  selectColumnElements,
  selectElementCount,
} from './builder.selectors'

export function exampleUsage(): void {
  const store = useBuilderStore.getState()

  // ── 1. Initialize project ─────────────────────────────────────────────────
  store.initProject('My Website', 'custom')

  // ── 2. Add a section ──────────────────────────────────────────────────────
  const sectionId = store.addSection()
  console.log('[section]', sectionId)

  // ── 3. Add a row inside the section ──────────────────────────────────────
  const rowId = store.addRow(sectionId)
  console.log('[row]', rowId)

  // ── 4. Add columns inside the row ─────────────────────────────────────────
  const col1Id = store.addColumn(rowId, { desktop: 8, tablet: 12, mobile: 12 })
  const col2Id = store.addColumn(rowId, { desktop: 4, tablet: 12, mobile: 12 })
  console.log('[columns]', col1Id, col2Id)

  // ── 5. Add elements inside columns ────────────────────────────────────────
  const headingId = store.addElement(col1Id, {
    type: 'heading',
    level: 'h1',
    text: 'Hello, BuilderPro',
  })

  const paragraphId = store.addElement(col1Id, {
    type: 'paragraph',
    text: 'Build responsive websites visually.',
  })

  const buttonId = store.addElement(col2Id, {
    type: 'button',
    text: 'Get Started',
    href: '/builder',
    variant: 'primary',
  })

  console.log('[elements]', headingId, paragraphId, buttonId)

  // ── 6. Read state via selectors ───────────────────────────────────────────
  const state = useBuilderStore.getState()

  const sections = selectOrderedSections(state)
  const rows = selectSectionRows(sectionId)(state)
  const columns = selectRowColumns(rowId)(state)
  const col1Elements = selectColumnElements(col1Id)(state)
  const totalElements = selectElementCount(state)

  console.log('[sections]', sections.length)           // 1
  console.log('[rows in section]', rows.length)        // 1
  console.log('[columns in row]', columns.length)      // 2
  console.log('[elements in col1]', col1Elements.length) // 2 (heading + paragraph)
  console.log('[total elements]', totalElements)       // 3

  // ── 7. Update an element ──────────────────────────────────────────────────
  store.updateElement(headingId, {
    content: { type: 'heading', level: 'h2', text: 'Updated Heading' },
    styles: { textAlign: 'center', color: '#4f46e5' },
  })

  // Re-read state after mutation — updateElement produces a new state object
  const updated = useBuilderStore.getState().elements[headingId]
  console.log('[updated heading]', updated?.content)

  // ── 8. Export as nested project tree ─────────────────────────────────────
  const project = store.toProject()
  console.log('[project]', JSON.stringify(project, null, 2))

  // ── 9. Delete an element ──────────────────────────────────────────────────
  store.deleteElement(buttonId)
  console.log('[elements after delete]', selectElementCount(useBuilderStore.getState())) // 2
}
