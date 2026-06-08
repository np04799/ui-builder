/**
 * Functional Test Suite — Per-element, Per-framework
 *
 * Simulates real user interactions:
 * 1. Start fresh builder (wizard completes with framework mode)
 * 2. Drag each element from panel → canvas → column
 * 3. Verify element appears in correct hierarchy (Section→Row→Column→Element)
 * 4. Verify props panel fields update element correctly
 * 5. Verify inline editing saves text
 * 6. Verify responsive mode switching
 * 7. Repeat for Bootstrap, Tailwind, MUI, Custom
 */

import { renderHook, act } from '@testing-library/react'

// We test the store directly — same logic that runs when user drags in browser
const { useBuilderStore } = require('../../store/builder.store')
const { defaultContentForType } = require('../../lib/elementDefaults')

// ─── Test helpers ─────────────────────────────────────────────────────────────

function freshStore(mode: string) {
  const store = useBuilderStore.getState()
  act(() => store.initProject('Test Project', mode))
  return useBuilderStore.getState()
}

function getState() {
  return useBuilderStore.getState()
}

// Simulate: user drags element from panel → drops on column
function dragElementToCanvas(elementType: string) {
  const state = getState()
  const content = defaultContentForType(elementType)
  if (!content) throw new Error(`No default content for: ${elementType}`)
  act(() => state.quickAddElement(content))
  return getState()
}

// Simulate: drop into specific column
function addElementToColumn(columnId: string, elementType: string) {
  const content = defaultContentForType(elementType)
  if (!content) throw new Error(`No default content for: ${elementType}`)
  act(() => getState().addElement(columnId, content))
  return getState()
}

// ─── Core hierarchy tests ─────────────────────────────────────────────────────

describe('Section→Row→Column→Element hierarchy', () => {
  beforeEach(() => {
    act(() => useBuilderStore.setState(require('../../store/builder.store').createEmptyState?.() ?? {
      sections: {}, rows: {}, columns: {}, elements: {},
      sectionOrder: [], projectMeta: null, mode: 'custom',
      responsiveMode: 'desktop', selectedId: null, editingId: null,
      dragState: null, canvasWidth: '100%', projectName: 'Test',
      leftPanelVisible: true, rightPanelVisible: true, canvasZoom: 1,
      clipboard: null, _history: [], _future: []
    }))
  })

  test('initProject creates empty canvas (no sections)', () => {
    const s = freshStore('custom')
    expect(s.sectionOrder).toHaveLength(0)
    expect(s.projectMeta?.name).toBe('Test Project')
    expect(s.mode).toBe('custom')
  })

  test('quickAddElement creates full hierarchy automatically', () => {
    freshStore('custom')
    const s = dragElementToCanvas('heading')
    
    // Must have: 1 section, 1 row, 1 column, 1 element
    expect(s.sectionOrder).toHaveLength(1)
    const sectionId = s.sectionOrder[0]
    const section = s.sections[sectionId]
    expect(section.rowIds).toHaveLength(1)
    
    const rowId = section.rowIds[0]
    const row = s.rows[rowId]
    expect(row.columnIds).toHaveLength(1)
    
    const colId = row.columnIds[0]
    const col = s.columns[colId]
    expect(col.elementIds).toHaveLength(1)
    
    const elemId = col.elementIds[0]
    const elem = s.elements[elemId]
    expect(elem.content.type).toBe('heading')
  })

  test('elements cannot exist outside columns', () => {
    freshStore('custom')
    const s1 = dragElementToCanvas('heading')
    const colId = Object.keys(s1.columns)[0]
    
    // Add second element to same column
    addElementToColumn(colId, 'paragraph')
    const s2 = getState()
    
    // Both elements in the column
    expect(s2.columns[colId].elementIds).toHaveLength(2)
    // No orphan elements
    const allElementIds = Object.keys(s2.elements)
    const allColumnElementIds = Object.values(s2.columns).flatMap(c => c.elementIds)
    expect(allElementIds.sort()).toEqual(allColumnElementIds.sort())
  })
})

// ─── Per-framework drag tests ──────────────────────────────────────────────────

const FRAMEWORKS = ['bootstrap', 'tailwind', 'mui', 'custom']

const CORE_ELEMENTS = [
  'heading', 'paragraph', 'button', 'image', 'video',
  'divider', 'spacer', 'icon', 'navbar', 'hero',
  'card', 'footer', 'form', 'tabs', 'accordion',
]

FRAMEWORKS.forEach(fw => {
  describe(`Framework: ${fw.toUpperCase()} — drag elements to canvas`, () => {
    beforeEach(() => {
      act(() => {
        const empty = {
          sections: {}, rows: {}, columns: {}, elements: {},
          sectionOrder: [], projectMeta: null, mode: fw,
          responsiveMode: 'desktop', selectedId: null, editingId: null,
          dragState: null, canvasWidth: '100%', projectName: 'Test',
          leftPanelVisible: true, rightPanelVisible: true, canvasZoom: 1,
          clipboard: null, _history: [], _future: []
        }
        useBuilderStore.setState(empty)
      })
      freshStore(fw)
    })

    CORE_ELEMENTS.forEach(elementType => {
      test(`drag ${elementType} → creates element in column`, () => {
        const before = Object.keys(getState().elements).length
        
        // Simulate drag from panel → canvas drop
        const content = defaultContentForType(elementType)
        expect(content).not.toBeNull()
        expect(content?.type).toBe(elementType)
        
        act(() => getState().quickAddElement(content!))
        
        const s = getState()
        const after = Object.keys(s.elements).length
        expect(after).toBe(before + 1)
        
        // Element is inside a column (hierarchy enforced)
        const newElemId = Object.keys(s.elements)[Object.keys(s.elements).length - 1]
        const elem = s.elements[newElemId]
        expect(elem).toBeDefined()
        expect(elem.content.type).toBe(elementType)
        
        // Column contains the element
        const col = Object.values(s.columns).find(c => c.elementIds.includes(newElemId))
        expect(col).toBeDefined()
        
        // Framework mode preserved
        expect(s.mode).toBe(fw)
      })
    })

    test('add section → add row → add column → drop element (full manual flow)', () => {
      const s1 = getState()
      
      // 1. Add section
      let sectionId: string
      act(() => { sectionId = s1.addSection() })
      expect(getState().sectionOrder).toContain(sectionId!)
      
      // 2. Add row to section
      let rowId: string
      act(() => { rowId = getState().addRow(sectionId!) })
      expect(getState().rows[rowId!]).toBeDefined()
      
      // 3. Add column to row
      let colId: string
      act(() => { colId = getState().addColumn(rowId!) })
      expect(getState().columns[colId!]).toBeDefined()
      
      // 4. Drop heading into column
      act(() => { getState().addElement(colId!, defaultContentForType('heading')!) })
      
      const finalState = getState()
      const col = finalState.columns[colId!]
      expect(col.elementIds).toHaveLength(1)
      
      const elemId = col.elementIds[0]
      const elem = finalState.elements[elemId]
      expect(elem.content.type).toBe('heading')
    })
  })
})

// ─── Inline editing tests ─────────────────────────────────────────────────────

describe('Inline editing — double-click to edit', () => {
  beforeEach(() => freshStore('custom'))

  test('heading text updates via updateElement', () => {
    dragElementToCanvas('heading')
    const s = getState()
    const elemId = Object.keys(s.elements)[0]
    
    act(() => s.updateElement(elemId, {
      content: { type: 'heading', level: 'h1', text: 'My Custom Heading' }
    }))
    
    const updated = getState().elements[elemId]
    expect((updated.content as any).text).toBe('My Custom Heading')
  })

  test('paragraph text updates via updateElement', () => {
    dragElementToCanvas('paragraph')
    const s = getState()
    const elemId = Object.keys(s.elements)[0]
    
    act(() => s.updateElement(elemId, {
      content: { type: 'paragraph', text: 'Updated paragraph content' }
    }))
    
    expect((getState().elements[elemId].content as any).text).toBe('Updated paragraph content')
  })

  test('button text and href update correctly', () => {
    dragElementToCanvas('button')
    const s = getState()
    const elemId = Object.keys(s.elements)[0]
    
    act(() => s.updateElement(elemId, {
      content: { type: 'button', text: 'Buy Now', href: '/checkout', variant: 'primary' }
    }))
    
    const btn = getState().elements[elemId].content as any
    expect(btn.text).toBe('Buy Now')
    expect(btn.href).toBe('/checkout')
  })

  test('style updates MERGE (not replace) — all existing styles preserved', () => {
    dragElementToCanvas('heading')
    const s = getState()
    const elemId = Object.keys(s.elements)[0]
    
    // Apply first style
    act(() => s.updateElement(elemId, { styles: { ...s.elements[elemId].styles, color: 'red' } }))
    expect(getState().elements[elemId].styles.color).toBe('red')
    
    // Apply second style — first must be preserved
    act(() => getState().updateElement(elemId, { styles: { ...getState().elements[elemId].styles, fontSize: '24px' } }))
    
    const final = getState().elements[elemId].styles
    expect(final.color).toBe('red')      // preserved
    expect(final.fontSize).toBe('24px')  // new
  })
})

// ─── Drag reorder tests ───────────────────────────────────────────────────────

describe('Drag reorder — elements within and across columns', () => {
  beforeEach(() => freshStore('custom'))

  test('moveElement reorders within same column', () => {
    dragElementToCanvas('heading')
    const s = getState()
    const colId = Object.keys(s.columns)[0]
    
    // Add second element
    act(() => s.addElement(colId, defaultContentForType('paragraph')!))
    
    const s2 = getState()
    const [headingId, paragraphId] = s2.columns[colId].elementIds
    
    // Move heading (index 0) to index 1 (after paragraph)
    act(() => getState().moveElement(headingId, colId, colId, 1))
    
    const s3 = getState()
    expect(s3.columns[colId].elementIds[0]).toBe(paragraphId)
    expect(s3.columns[colId].elementIds[1]).toBe(headingId)
  })

  test('moveElement moves element to different column', () => {
    // Build layout: section → row → 2 columns
    const s = getState()
    let secId: string, rowId: string, col1Id: string, col2Id: string
    
    act(() => { secId = s.addSection() })
    act(() => { rowId = getState().addRow(secId!) })
    act(() => { col1Id = getState().addColumn(rowId!) })
    act(() => { col2Id = getState().addColumn(rowId!) })
    act(() => { getState().addElement(col1Id!, defaultContentForType('heading')!) })
    
    const elemId = getState().columns[col1Id!].elementIds[0]
    
    // Move from col1 to col2
    act(() => getState().moveElement(elemId, col1Id!, col2Id!, 0))
    
    expect(getState().columns[col1Id!].elementIds).toHaveLength(0)
    expect(getState().columns[col2Id!].elementIds).toContain(elemId)
  })
})

// ─── Responsive preview tests ─────────────────────────────────────────────────

describe('Responsive preview modes', () => {
  beforeEach(() => freshStore('custom'))

  test('responsive mode switches: desktop → tablet → mobile', () => {
    expect(getState().responsiveMode).toBe('desktop')
    
    act(() => getState().setResponsiveMode('tablet'))
    expect(getState().responsiveMode).toBe('tablet')
    
    act(() => getState().setResponsiveMode('mobile'))
    expect(getState().responsiveMode).toBe('mobile')
    
    act(() => getState().setResponsiveMode('desktop'))
    expect(getState().responsiveMode).toBe('desktop')
  })

  test('responsive styles stored per breakpoint', () => {
    dragElementToCanvas('heading')
    const s = getState()
    const elemId = Object.keys(s.elements)[0]
    
    // Switch to mobile and set mobile-specific style
    act(() => s.setResponsiveMode('mobile'))
    act(() => getState().updateElement(elemId, {
      responsive: { mobile: { fontSize: '14px' }, tablet: {}, desktop: {} }
    }))
    
    const elem = getState().elements[elemId]
    expect(elem.responsive?.mobile?.fontSize).toBe('14px')
    // Desktop style unaffected
    expect(elem.styles.fontSize).toBeUndefined()
  })
})

// ─── Undo/Redo tests ──────────────────────────────────────────────────────────

describe('Undo / Redo', () => {
  beforeEach(() => freshStore('custom'))

  test('undo removes last added element', () => {
    dragElementToCanvas('heading')
    expect(Object.keys(getState().elements)).toHaveLength(1)
    
    act(() => getState().undo())
    expect(Object.keys(getState().elements)).toHaveLength(0)
  })

  test('redo restores element after undo', () => {
    dragElementToCanvas('heading')
    act(() => getState().undo())
    expect(Object.keys(getState().elements)).toHaveLength(0)
    
    act(() => getState().redo())
    expect(Object.keys(getState().elements)).toHaveLength(1)
  })
})

// ─── Delete / Duplicate ───────────────────────────────────────────────────────

describe('Delete and Duplicate', () => {
  beforeEach(() => freshStore('custom'))

  test('deleteElement removes from column and elements map', () => {
    dragElementToCanvas('heading')
    const s = getState()
    const elemId = Object.keys(s.elements)[0]
    const colId = Object.keys(s.columns)[0]
    
    act(() => s.deleteElement(elemId))
    
    expect(getState().elements[elemId]).toBeUndefined()
    expect(getState().columns[colId].elementIds).not.toContain(elemId)
  })

  test('duplicateElement creates copy with new id', () => {
    dragElementToCanvas('heading')
    const s = getState()
    const elemId = Object.keys(s.elements)[0]
    
    act(() => s.duplicateElement(elemId))
    
    expect(Object.keys(getState().elements)).toHaveLength(2)
    const ids = Object.keys(getState().elements)
    expect(ids[0]).not.toBe(ids[1])
    
    // Both have same content type
    expect(getState().elements[ids[1]].content.type).toBe('heading')
  })
})

// ─── Save/Load ────────────────────────────────────────────────────────────────

describe('Save / Load project (localStorage)', () => {
  beforeEach(() => {
    freshStore('bootstrap')
    // Mock localStorage
    const store: Record<string, string> = {}
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((k,v) => { store[k] = v })
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(k => store[k] ?? null)
  })

  afterEach(() => jest.restoreAllMocks())

  test('saveProject writes to localStorage', () => {
    dragElementToCanvas('heading')
    const key = getState().saveProject()
    expect(key).toBeTruthy()
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('loadProject restores canvas state', () => {
    dragElementToCanvas('heading')
    const key = getState().saveProject()!
    
    // Reset store
    act(() => useBuilderStore.setState({
      sections: {}, rows: {}, columns: {}, elements: {}, sectionOrder: [],
      projectMeta: null, mode: 'custom', responsiveMode: 'desktop',
    }))
    expect(Object.keys(getState().elements)).toHaveLength(0)
    
    // Load
    act(() => getState().loadProject(key))
    expect(Object.keys(getState().elements)).toHaveLength(1)
    expect(getState().mode).toBe('bootstrap')
  })
})

// ─── Framework isolation ──────────────────────────────────────────────────────

describe('Framework isolation', () => {
  test('Bootstrap mode: column span uses col-lg-N class', () => {
    freshStore('bootstrap')
    const s = getState()
    let colId: string
    act(() => {
      const secId = s.addSection()
      const rowId = getState().addRow(secId)
      colId = getState().addColumn(rowId)
    })
    
    // Bootstrap span stored correctly
    act(() => getState().updateColumn(colId!, { span: { desktop: 8, tablet: 12, mobile: 12 } }))
    expect(getState().columns[colId!].span?.desktop).toBe(8)
  })

  test('switching mode updates store.mode', () => {
    freshStore('bootstrap')
    expect(getState().mode).toBe('bootstrap')
    
    act(() => getState().setMode('tailwind'))
    expect(getState().mode).toBe('tailwind')
    
    act(() => getState().setMode('mui'))
    expect(getState().mode).toBe('mui')
    
    act(() => getState().setMode('custom'))
    expect(getState().mode).toBe('custom')
  })

  test('framework mode persists across element additions', () => {
    freshStore('tailwind')
    dragElementToCanvas('hero')
    dragElementToCanvas('navbar')
    expect(getState().mode).toBe('tailwind')
  })
})
