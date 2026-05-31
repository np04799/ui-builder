'use client'

import type { ElementNode } from '@/types/store.types'
import type { NavItem } from '@/types/builder.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'

interface Props { element: ElementNode }

export default function FooterProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'footer') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchLink(id: string, patch: Partial<NavItem>) {
    const links = content.links.map((l) => l.id === id ? { ...l, ...patch } : l)
    patchContent({ links })
  }

  function addLink() {
    patchContent({ links: [...content.links, { id: crypto.randomUUID(), label: 'New Link', href: '#' }] })
  }

  function removeLink(id: string) {
    patchContent({ links: content.links.filter((l) => l.id !== id) })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  return (
    <>
      <PropGroup label="Content">
        <PropRow label="Copyright" stack>
          <TextInput
            value={content.copyright}
            onChange={(v) => patchContent({ copyright: v })}
            placeholder="© 2024 Company"
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Links">
        {content.links.map((link, i) => (
          <div
            key={link.id}
            style={{
              borderTop: i > 0 ? '1px solid var(--color-border)' : undefined,
              paddingTop: i > 0 ? 8 : 0,
              marginTop: i > 0 ? 8 : 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Link {i + 1}</span>
              <button
                onClick={() => removeLink(link.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.7rem', padding: '2px 4px' }}
              >✕</button>
            </div>
            <PropRow label="Label" stack>
              <TextInput value={link.label} onChange={(v) => patchLink(link.id, { label: v })} />
            </PropRow>
            <PropRow label="URL" stack>
              <TextInput value={link.href} onChange={(v) => patchLink(link.id, { href: v })} placeholder="#" />
            </PropRow>
          </div>
        ))}
        <button
          onClick={addLink}
          style={{ marginTop: 10, width: '100%', height: 30, border: '1px dashed var(--color-border)', borderRadius: 4, backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '0.75rem', cursor: 'pointer' }}
        >
          + Add link
        </button>
      </PropGroup>

      <PropGroup label="Style">
        <PropRow label="Bg color">
          <ColorSwatch value={styles.backgroundColor ?? ''} onChange={(v) => patchStyle('backgroundColor', v)} />
        </PropRow>
        <PropRow label="Text color">
          <ColorSwatch value={styles.color ?? ''} onChange={(v) => patchStyle('color', v)} />
        </PropRow>
      </PropGroup>

      <PropGroup label="Spacing">
        <PropRow label="Padding" stack>
          <SpacingControl value={styles.padding ?? '0px'} onChange={(v) => patchStyle('padding', v)} />
        </PropRow>
      </PropGroup>

      <CustomCSSField
        styles={styles}
        knownKeys={['backgroundColor', 'color', 'padding']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
