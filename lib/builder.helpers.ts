import type { Breakpoint, ElementContent, StyleMap, ResponsiveStyles } from '@/types/builder.types'
import type { ColumnNode, ElementNode, RowNode, SectionNode } from '@/types/store.types'

// ─────────────────────────────────────────────────────────────────────────────
// Internal utilities
// ─────────────────────────────────────────────────────────────────────────────

const uid = (): string => crypto.randomUUID()
const emptyStyles = (): StyleMap => ({})
const emptyResponsive = (): ResponsiveStyles => ({})

/**
 * Default responsive overrides applied to every new element by type.
 * Desktop is the base (no override needed). Tablet/mobile scale down
 * font sizes, tighten padding, and stack layout where appropriate.
 */
function defaultResponsiveForType(content: ElementContent): ResponsiveStyles {
  switch (content.type) {

    // ── Typography ─────────────────────────────────────────────────────────────
    case 'heading': {
      // Scale down per heading level — h1 needs the biggest drop
      const tabletSize: Record<string, string> = {
        h1: '2rem', h2: '1.625rem', h3: '1.25rem', h4: '1.125rem', h5: '1rem', h6: '0.875rem',
      }
      const mobileSize: Record<string, string> = {
        h1: '1.625rem', h2: '1.375rem', h3: '1.125rem', h4: '1rem', h5: '0.9375rem', h6: '0.875rem',
      }
      return {
        tablet: { fontSize: tabletSize[content.level] ?? '1.5rem' },
        mobile: { fontSize: mobileSize[content.level] ?? '1.25rem', lineHeight: '1.3' },
      }
    }

    case 'paragraph':
      return {
        tablet: { fontSize: '15px', lineHeight: '1.7' },
        mobile: { fontSize: '14px', lineHeight: '1.65' },
      }

    // ── Interactive ────────────────────────────────────────────────────────────
    case 'button':
      // Keep auto width — full-width is a layout decision, not a default
      return {
        tablet: { fontSize: '14px' },
        mobile: { fontSize: '14px', padding: '10px 20px' },
      }

    // ── Media ──────────────────────────────────────────────────────────────────
    case 'image':
      return {
        tablet: { width: '100%', height: 'auto' },
        mobile: { width: '100%', height: 'auto' },
      }

    case 'video':
      return {
        tablet: { width: '100%' },
        mobile: { width: '100%' },
      }

    // ── Structural blocks ──────────────────────────────────────────────────────
    case 'hero':
      return {
        tablet: { padding: '60px 32px', minHeight: '260px' },
        mobile: { padding: '40px 16px', minHeight: '220px' },
      }

    case 'card':
      return {
        tablet: { width: '100%' },
        mobile: { width: '100%', padding: '12px' },
      }

    case 'navbar':
      // NavbarElement handles its own mobile collapse internally
      return {}

    case 'footer':
      return {
        mobile: { padding: '24px 16px' },
      }

    // ── Form ───────────────────────────────────────────────────────────────────
    case 'form':
      return {
        tablet: { width: '100%' },
        mobile: { width: '100%', padding: '0' },
      }

    // ── Interactive components ─────────────────────────────────────────────────
    case 'tabs':
      return {
        tablet: { fontSize: '14px' },
        mobile: { fontSize: '13px' },
      }

    case 'accordion':
      return {
        tablet: { fontSize: '15px' },
        mobile: { fontSize: '14px' },
      }

    case 'modal':
      return {
        mobile: { width: '92vw', maxWidth: '92vw' },
      }

    case 'carousel':
      return {
        tablet: { width: '100%' },
        mobile: { width: '100%' },
      }

    case 'tooltip':
      return {}

    // ── Simple layout ──────────────────────────────────────────────────────────
    case 'divider':
      return {}

    case 'spacer':
      // Halve the spacer height on mobile so it doesn't eat vertical space
      return {
        mobile: { height: '20px' },
      }

    case 'icon':
      return {
        mobile: { fontSize: '20px' },
      }

    case 'hamburger-menu':
      return {}

    // ── Charts — fluid width, internal height management ───────────────────────
    case 'chart-bar':
    case 'chart-line':
    case 'chart-area':
    case 'chart-pie':
    case 'chart-donut':
    case 'chart-radar':
    case 'chart-polar':
    case 'chart-scatter':
    case 'chart-gauge':
      return {
        tablet: { width: '100%' },
        mobile: { width: '100%' },
      }

    // ── Animated banners — manage their own internal layout ────────────────────
    case 'banner-3d':
    case 'banner-morph':
    case 'banner-ticker':
    case 'banner-split':
    case 'banner-glass':
    case 'banner-neon':
    case 'banner-aurora':
    case 'banner-retro':
    case 'banner-particle':
      return {}

    default:
      return {}
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Node factories
// Each factory creates a minimal valid node. Callers set styles/content later
// via store actions (updateElement, etc.).
// ─────────────────────────────────────────────────────────────────────────────

export function createSection(): SectionNode {
  return {
    id: uid(),
    rowIds: [],
    styles: { maxWidth: '1200px', alignItems: 'center', paddingTop: '20px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' },
    responsive: emptyResponsive(),
  }
}

export function createRow(sectionId: string): RowNode {
  return {
    id: uid(),
    sectionId,
    columnIds: [],
    styles: emptyStyles(),
    responsive: emptyResponsive(),
  }
}

export function createColumn(
  rowId: string,
  span?: Partial<Record<Breakpoint, number>>
): ColumnNode {
  return {
    id: uid(),
    rowId,
    elementIds: [],
    styles: emptyStyles(),
    responsive: emptyResponsive(),
    ...(span !== undefined ? { span } : {}),
  }
}

export function createElement(columnId: string, content: ElementContent): ElementNode {
  return {
    id: uid(),
    columnId,
    content,
    styles: emptyStyles(),
    responsive: defaultResponsiveForType(content),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Style helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Merge base styles with a single breakpoint's responsive overrides.
 * Used by the canvas renderer and export engine to resolve final styles.
 */
export function resolveStyles(
  base: StyleMap,
  responsive: ResponsiveStyles,
  breakpoint: Breakpoint
): StyleMap {
  const override = responsive[breakpoint]
  if (!override) return base
  return { ...base, ...override }
}

/**
 * Ordered breakpoint list — used by the export engine when iterating
 * from largest to smallest to emit media queries correctly.
 */
export const BREAKPOINTS: readonly Breakpoint[] = ['desktop', 'tablet', 'mobile'] as const
