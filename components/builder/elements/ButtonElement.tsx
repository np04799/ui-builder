import { memo } from 'react'
import type { ButtonVariant } from '@/types/builder.types'
import { useFramework } from '@/hooks/useFramework'

interface Props {
  text: string
  href: string
  variant: ButtonVariant
  target?: '_blank' | '_self'
  style?: React.CSSProperties
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

const BS_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  outline: 'btn btn-outline-primary',
  ghost: 'btn btn-link',
}

// ─── MUI ─────────────────────────────────────────────────────────────────────

const MUI_CLASS: Record<ButtonVariant, string> = {
  primary: 'MuiButton-root MuiButton-contained',
  secondary: 'MuiButton-root MuiButton-colorInherit',
  outline: 'MuiButton-root MuiButton-outlined',
  ghost: 'MuiButton-root MuiButton-text',
}

// ─── Tailwind ─────────────────────────────────────────────────────────────────

const TW_CLASS: Record<ButtonVariant, string> = {
  primary: 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors',
  secondary: 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors',
  outline: 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors',
  ghost: 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 transition-colors',
}

// ─── Custom (original) ────────────────────────────────────────────────────────

const VARIANT_STYLE: Record<ButtonVariant, React.CSSProperties> = {
  primary: { backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none' },
  secondary: { backgroundColor: 'var(--color-secondary)', color: '#fff', border: 'none' },
  outline: { backgroundColor: 'transparent', color: 'var(--color-primary)', border: '1.5px solid var(--color-primary)' },
  ghost: { backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: 'none' },
}

const ButtonElement = memo(function ButtonElement({ text, href, variant, target, style }: Props) {
  const framework = useFramework()

  const commonProps = {
    href: href || '#',
    target: target ?? '_self',
    rel: target === '_blank' ? 'noopener noreferrer' : undefined,
  }

  if (framework === 'bootstrap') {
    return (
      <a {...commonProps} className={BS_CLASS[variant]} style={style}>
        {text || 'Click Here'}
      </a>
    )
  }

  if (framework === 'mui') {
    return (
      <a {...commonProps} className={`mui-root ${MUI_CLASS[variant]}`} style={style}>
        {text || 'Click Here'}
      </a>
    )
  }

  if (framework === 'tailwind') {
    return (
      <a {...commonProps} className={TW_CLASS[variant]} style={style}>
        {text || 'Click Here'}
      </a>
    )
  }

  // custom
  return (
    <a
      {...commonProps}
      style={{
        display: 'inline-block',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: 500,
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'opacity var(--duration-hover)',
        ...VARIANT_STYLE[variant],
        ...style,
      }}
    >
      {text || 'Click Here'}
    </a>
  )
})

export default ButtonElement
