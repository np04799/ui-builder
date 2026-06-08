import type { ElementContent, HeadingLevel, ButtonVariant, StyleMap } from '@/types/builder.types'

// Mirrors the visual constants from HeadingElement / ButtonElement so the
// contentEditable div matches the rendered element's appearance during editing.

const HEADING_SIZE: Record<HeadingLevel, string> = {
  h1: '2rem', h2: '1.5rem', h3: '1.25rem', h4: '1.125rem', h5: '1rem', h6: '0.875rem',
}

const HEADING_WEIGHT: Record<HeadingLevel, number> = {
  h1: 700, h2: 700, h3: 600, h4: 600, h5: 600, h6: 600,
}

const BUTTON_VARIANT_STYLE: Record<ButtonVariant, React.CSSProperties> = {
  primary: { backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none' },
  secondary: { backgroundColor: 'var(--color-secondary)', color: '#fff', border: 'none' },
  outline: { backgroundColor: 'transparent', color: 'var(--color-primary)', border: '1.5px solid var(--color-primary)' },
  ghost: { backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: 'none' },
}

export type EditableContent =
  | Extract<ElementContent, { type: 'heading' }>
  | Extract<ElementContent, { type: 'paragraph' }>
  | Extract<ElementContent, { type: 'button' }>

export function isEditable(content: ElementContent): content is EditableContent {
  return (
    content.type === 'heading' ||
    content.type === 'paragraph' ||
    content.type === 'button'
  )
}

export function getPlaceholder(content: EditableContent): string {
  switch (content.type) {
    case 'heading': return 'Your Heading Here'
    case 'paragraph': return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    case 'button': return 'Click Here'
  }
}

/** Returns CSS properties for the contentEditable div that match the element's visual style. */
export function getEditingStyle(
  content: EditableContent,
  styles: StyleMap,
): React.CSSProperties {
  const userStyles = styles as React.CSSProperties
  switch (content.type) {
    case 'heading':
      return {
        margin: 0,
        lineHeight: 1.3,
        fontSize: HEADING_SIZE[content.level],
        fontWeight: HEADING_WEIGHT[content.level],
        color: 'var(--color-text-primary)',
        ...userStyles,
      }
    case 'paragraph':
      return {
        margin: 0,
        fontSize: '1rem',
        lineHeight: 1.7,
        color: 'var(--color-text-secondary)',
        ...userStyles,
      }
    case 'button':
      return {
        display: 'inline-block',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: 500,
        textDecoration: 'none',
        ...BUTTON_VARIANT_STYLE[content.variant],
        ...userStyles,
      }
  }
}
