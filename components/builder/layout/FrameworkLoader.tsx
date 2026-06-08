'use client'

import { useEffect } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import type { BuilderMode } from '@/types/builder.types'

// Minimal MUI-like CSS for canvas preview (full MUI requires npm install)
const MUI_CSS = `
/* MUI-like reset & typography */
.mui-root * { box-sizing: border-box; }
.mui-root { font-family: 'Roboto', sans-serif; color: rgba(0,0,0,0.87); }

/* Elevation helpers */
.mui-elevation1 { box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12); }
.mui-elevation2 { box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12); }
.mui-elevation4 { box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12); }

/* Button */
.MuiButton-root {
  display: inline-flex; align-items: center; justify-content: center;
  position: relative; box-sizing: border-box; cursor: pointer;
  user-select: none; vertical-align: middle; text-decoration: none;
  font-family: 'Roboto', sans-serif; font-weight: 500; font-size: 0.875rem;
  letter-spacing: 0.02857em; text-transform: uppercase;
  min-width: 64px; padding: 6px 16px; border-radius: 4px;
  transition: background-color 250ms cubic-bezier(0.4,0,0.2,1), box-shadow 250ms, border-color 250ms;
  outline: none; border: none;
}
.MuiButton-root:hover { filter: brightness(0.92); }
.MuiButton-root:active { filter: brightness(0.85); }
.MuiButton-contained { background-color: var(--color-primary); color: #fff; box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12); }
.MuiButton-contained:hover { box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12); }
.MuiButton-outlined { background-color: transparent; color: var(--color-primary); border: 1px solid var(--color-primary) !important; }
.MuiButton-text { background-color: transparent; color: var(--color-primary); padding: 6px 8px; }
.MuiButton-colorInherit { background-color: rgba(0,0,0,0.08); color: rgba(0,0,0,0.87); border-color: rgba(0,0,0,0.23) !important; }

/* Card */
.MuiCard-root {
  background-color: #fff; color: rgba(0,0,0,0.87); border-radius: 4px; overflow: hidden;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
}
.MuiCardMedia-root { display: block; width: 100%; }
.MuiCardContent-root { padding: 16px; }
.MuiCardContent-root:last-child { padding-bottom: 24px; }
.MuiCardActions-root { display: flex; align-items: center; padding: 8px; }

/* Typography */
.MuiTypography-h1 { font-size: 6rem; font-weight: 300; letter-spacing: -0.01562em; line-height: 1.167; }
.MuiTypography-h2 { font-size: 3.75rem; font-weight: 300; letter-spacing: -0.00833em; line-height: 1.2; }
.MuiTypography-h3 { font-size: 3rem; font-weight: 400; letter-spacing: 0; line-height: 1.167; }
.MuiTypography-h4 { font-size: 2.125rem; font-weight: 400; letter-spacing: 0.00735em; line-height: 1.235; }
.MuiTypography-h5 { font-size: 1.5rem; font-weight: 400; letter-spacing: 0; line-height: 1.334; }
.MuiTypography-h6 { font-size: 1.25rem; font-weight: 500; letter-spacing: 0.0075em; line-height: 1.6; }
.MuiTypography-body1 { font-size: 1rem; font-weight: 400; letter-spacing: 0.00938em; line-height: 1.5; }
.MuiTypography-body2 { font-size: 0.875rem; font-weight: 400; letter-spacing: 0.01071em; line-height: 1.43; }
.MuiTypography-root { margin: 0; font-family: 'Roboto', sans-serif; color: rgba(0,0,0,0.87); }
.MuiTypography-gutterBottom { margin-bottom: 0.35em; }
.MuiTypography-colorTextSecondary { color: rgba(0,0,0,0.54); }

/* AppBar / Navbar */
.MuiAppBar-root {
  display: flex; flex-direction: column; width: 100%; box-sizing: border-box;
  flex-shrink: 0; position: static; z-index: 1100;
  background-color: var(--color-primary); color: #fff;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
}
.MuiToolbar-root {
  display: flex; position: relative; align-items: center;
  padding-left: 16px; padding-right: 16px; min-height: 64px;
}
.MuiToolbar-root a { color: inherit; text-decoration: none; }

/* Paper */
.MuiPaper-root { background-color: #fff; color: rgba(0,0,0,0.87); }
.MuiPaper-rounded { border-radius: 4px; }
.MuiPaper-outlined { border: 1px solid rgba(0,0,0,0.12); }

/* Hero section (custom MUI-like) */
.mui-hero {
  width: 100%; min-height: 320px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  padding: 80px 24px; gap: 24px;
  background-color: #fafafa;
}

/* Form */
.MuiTextField-root { width: 100%; }
.MuiInputBase-root {
  font-family: 'Roboto', sans-serif; font-weight: 400; font-size: 1rem; letter-spacing: 0.00938em;
  color: rgba(0,0,0,0.87); box-sizing: border-box; cursor: text; align-items: center;
  display: inline-flex; position: relative; border-radius: 4px;
}
.MuiOutlinedInput-root {
  border: 1px solid rgba(0,0,0,0.23); border-radius: 4px; width: 100%;
}
.MuiOutlinedInput-root:hover { border-color: rgba(0,0,0,0.87); }
.MuiOutlinedInput-root:focus-within { border-color: var(--color-primary); border-width: 2px; }
.MuiOutlinedInput-input {
  padding: 16.5px 14px; box-sizing: border-box; font: inherit;
  color: currentColor; border: none; background: none; outline: none; width: 100%;
}
.MuiInputLabel-root {
  display: block; font-family: 'Roboto', sans-serif; font-weight: 400; font-size: 1rem;
  letter-spacing: 0.00938em; color: rgba(0,0,0,0.6); margin-bottom: 4px;
}

/* List / Drawer nav */
.MuiList-root { list-style: none; margin: 0; padding: 8px 0; }
.MuiListItem-root { display: flex; box-sizing: border-box; }
.MuiListItemButton-root {
  display: flex; align-items: center; width: 100%; cursor: pointer;
  text-decoration: none; outline: none; padding: 8px 16px; border-radius: 0;
  font-family: 'Roboto', sans-serif; font-size: 0.875rem; font-weight: 400;
  color: rgba(0,0,0,0.87); background: transparent; border: none;
  transition: background-color 150ms cubic-bezier(0.4,0,0.2,1);
}
.MuiListItemButton-root:hover { background-color: rgba(0,0,0,0.04); }
.MuiListItemIcon-root {
  display: inline-flex; min-width: 40px; flex-shrink: 0; color: rgba(0,0,0,0.54);
}
.MuiListItemText-root { flex: 1 1 auto; min-width: 0; }
.MuiDivider-root { border: none; border-top: 1px solid rgba(0,0,0,0.12); margin: 0; }
`

const CDN_URLS: Partial<Record<BuilderMode, string>> = {
  bootstrap: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  tailwind: 'https://cdn.tailwindcss.com',
}

const JS_CDN_URLS: Partial<Record<BuilderMode, string>> = {
  bootstrap: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
}

const INLINE_CSS: Partial<Record<BuilderMode, string>> = {
  mui: MUI_CSS,
}

export function applyFrameworkCSS(mode: BuilderMode) {
  const linkId = 'bp-framework-cdn'
  const styleId = 'bp-framework-inline'
  const jsId = 'bp-framework-js'
  const iconsId = 'bp-bootstrap-icons'

  document.getElementById(linkId)?.remove()
  document.getElementById(styleId)?.remove()
  document.getElementById(jsId)?.remove()

  // Bootstrap Icons — always load (Icon element uses these regardless of framework)
  if (!document.getElementById(iconsId)) {
    const iconLink = document.createElement('link')
    iconLink.id = iconsId
    iconLink.rel = 'stylesheet'
    iconLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css'
    document.head.appendChild(iconLink)
  }

  const cdnUrl = CDN_URLS[mode]
  if (cdnUrl) {
    if (mode === 'tailwind') {
      const script = document.createElement('script')
      script.id = linkId
      script.src = cdnUrl
      document.head.appendChild(script)
    } else {
      const link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      link.href = cdnUrl
      document.head.appendChild(link)
    }
  }

  const jsUrl = JS_CDN_URLS[mode]
  if (jsUrl) {
    const script = document.createElement('script')
    script.id = jsId
    script.src = jsUrl
    script.defer = true
    document.head.appendChild(script)
  }

  const inlineCss = INLINE_CSS[mode]
  if (inlineCss) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = inlineCss
    document.head.appendChild(style)
  }

  return () => {
    document.getElementById(linkId)?.remove()
    document.getElementById(styleId)?.remove()
    document.getElementById(jsId)?.remove()
  }
}

export default function FrameworkLoader() {
  const mode = useBuilderStore((s) => s.mode)

  useEffect(() => applyFrameworkCSS(mode), [mode])

  return null
}
