import type { NodeType } from '@/hooks/useSelectedNodeType'
import type { ComponentType } from 'react'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PasteIcon,
  DuplicateIcon,
  TrashIcon,
  SpacingIcon,
  AlignmentIcon,
  SettingsIcon,
} from '@/components/builder/icons'
import { useBuilderStore } from '@/store/builder.store'

export interface ToolbarAction {
  id: string
  label: string
  icon: ComponentType
  /** Which node types show this action. Omit to show for all. */
  nodeTypes?: NodeType[]
  /** Visual group — separators are drawn between groups */
  group: 'nav' | 'quick' | 'style'
  /** true = render with danger color */
  danger?: boolean
  handler: (id: string) => void
}

function getStore() {
  return useBuilderStore.getState()
}

/** Scroll the right properties panel body to top */
function focusPropertiesPanel() {
  const panel = document.querySelector('[data-properties-body]') as HTMLElement | null
  if (panel) {
    panel.scrollTo({ top: 0, behavior: 'smooth' })
    // brief flash to draw user's eye
    panel.style.transition = 'box-shadow 150ms'
    panel.style.boxShadow = 'inset 0 0 0 2px var(--color-primary)'
    setTimeout(() => { panel.style.boxShadow = '' }, 600)
  }
}

export const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    id: 'move-left',
    label: 'Move left',
    icon: ChevronLeftIcon,
    group: 'nav',
    nodeTypes: ['column'],
    handler: (id) => {
      getStore().reorderColumn(id, 'left')
    },
  },
  {
    id: 'move-right',
    label: 'Move right',
    icon: ChevronRightIcon,
    group: 'nav',
    nodeTypes: ['column'],
    handler: (id) => {
      getStore().reorderColumn(id, 'right')
    },
  },
  {
    id: 'move-up',
    label: 'Move up',
    icon: ChevronUpIcon,
    group: 'nav',
    nodeTypes: ['element', 'row', 'section'],
    handler: (id) => {
      const store = getStore()
      if (store.elements[id]) {
        const el = store.elements[id]
        const col = store.columns[el.columnId]
        if (!col) return
        const idx = col.elementIds.indexOf(id)
        if (idx > 0) store.reorderElements(el.columnId, idx, idx - 1)
      } else if (store.rows[id]) {
        store.reorderRow(id, 'up')
      } else if (store.sections[id]) {
        store.reorderSection(id, 'up')
      }
    },
  },
  {
    id: 'move-down',
    label: 'Move down',
    icon: ChevronDownIcon,
    group: 'nav',
    nodeTypes: ['element', 'row', 'section'],
    handler: (id) => {
      const store = getStore()
      if (store.elements[id]) {
        const el = store.elements[id]
        const col = store.columns[el.columnId]
        if (!col) return
        const idx = col.elementIds.indexOf(id)
        if (idx < col.elementIds.length - 1) store.reorderElements(el.columnId, idx, idx + 1)
      } else if (store.rows[id]) {
        store.reorderRow(id, 'down')
      } else if (store.sections[id]) {
        store.reorderSection(id, 'down')
      }
    },
  },
  {
    id: 'copy',
    label: 'Copy (Ctrl+C)',
    icon: CopyIcon,
    group: 'quick',
    handler: (_id) => {
      getStore().copySelected()
    },
  },
  {
    id: 'paste',
    label: 'Paste (Ctrl+V)',
    icon: PasteIcon,
    group: 'quick',
    handler: (_id) => {
      getStore().pasteClipboard()
    },
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    icon: DuplicateIcon,
    group: 'quick',
    handler: (id) => {
      const store = getStore()
      if (store.elements[id]) {
        store.duplicateElement(id)
      } else if (store.columns[id]) {
        store.duplicateColumn(id)
      } else if (store.rows[id]) {
        store.duplicateRow(id)
      } else if (store.sections[id]) {
        store.duplicateSection(id)
      }
    },
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: TrashIcon,
    group: 'quick',
    danger: true,
    handler: (id) => {
      const store = getStore()
      if (store.elements[id]) {
        store.deleteElement(id)
      } else if (store.columns[id]) {
        store.deleteColumn(id)
      } else if (store.rows[id]) {
        store.deleteRow(id)
      } else if (store.sections[id]) {
        store.deleteSection(id)
      }
    },
  },
  {
    id: 'spacing',
    label: 'Spacing — open properties panel',
    icon: SpacingIcon,
    group: 'style',
    nodeTypes: ['section', 'row', 'column'],
    handler: (_id) => {
      focusPropertiesPanel()
    },
  },
  {
    id: 'alignment',
    label: 'Alignment',
    icon: AlignmentIcon,
    group: 'style',
    // handled specially in FloatingToolbar — opens inline popover
    handler: (_id) => {},
  },
  {
    id: 'settings',
    label: 'Settings — open properties panel',
    icon: SettingsIcon,
    group: 'style',
    handler: (_id) => {
      focusPropertiesPanel()
    },
  },
]

export const ACTION_GROUPS: ToolbarAction['group'][] = ['nav', 'quick', 'style']
