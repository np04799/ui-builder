'use client'

/**
 * CodePreview -- BuilderPro
 * Syntax-highlighted file tabs using highlight.js (CDN, no npm needed).
 * Shows up to 3 key files from the generated FileMap.
 */

import { useState, useEffect, useRef } from 'react'

interface CodePreviewProps {
  fileMap: Record<string, string> | null
  loading: boolean
  platform: string
  lang: string
}

const MAX_LINES = 500

function pickTabs(fileMap: Record<string, string>, platform: string, lang: string): string[] {
  const ext = lang === 'typescript'
    ? (platform === 'react' ? 'tsx' : platform === 'vue' ? 'vue' : 'ts')
    : (platform === 'react' ? 'jsx' : platform === 'vue' ? 'vue' : 'js')

  const priority = [
    `src/App.${ext}`,
    'src/App.vue',
    'src/App.tsx',
    'src/App.jsx',
    'src/app/app.component.ts',
    'package.json',
    'README.md',
  ]

  const keys = Object.keys(fileMap)
  const picked: string[] = []

  for (const p of priority) {
    if (keys.includes(p) && picked.length < 3) picked.push(p)
  }

  for (const k of keys) {
    if (picked.length >= 3) break
    if (picked.includes(k)) continue
    if (k.includes('/components/') || k.includes('/app/components/')) picked.push(k)
  }

  for (const k of keys) {
    if (picked.length >= 3) break
    if (!picked.includes(k)) picked.push(k)
  }

  return picked.slice(0, 3)
}

function langForFile(filename: string): string {
  if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) return 'tsx'
  if (filename.endsWith('.ts')) return 'typescript'
  if (filename.endsWith('.vue')) return 'xml'
  if (filename.endsWith('.html')) return 'xml'
  if (filename.endsWith('.scss') || filename.endsWith('.css')) return 'css'
  if (filename.endsWith('.json')) return 'json'
  if (filename.endsWith('.md')) return 'markdown'
  return 'plaintext'
}

function shortName(path: string): string {
  return path.split('/').pop() ?? path
}

let hljsLoaded = false
let hljsPromise: Promise<void> | null = null

function loadHljs(): Promise<void> {
  if (hljsLoaded) return Promise.resolve()
  if (hljsPromise) return hljsPromise
  hljsPromise = new Promise<void>((resolve) => {
    if (!document.getElementById('hljs-css')) {
      const link = document.createElement('link')
      link.id = 'hljs-css'
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
      document.head.appendChild(link)
    }
    if (!document.getElementById('hljs-js')) {
      const script = document.createElement('script')
      script.id = 'hljs-js'
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js'
      script.onload = () => { hljsLoaded = true; resolve() }
      script.onerror = () => resolve()
      document.head.appendChild(script)
    } else {
      hljsLoaded = true
      resolve()
    }
  })
  return hljsPromise
}

type HljsWindow = Window & { hljs?: { highlightElement: (el: HTMLElement) => void } }

export function CodePreview({ fileMap, loading, platform, lang }: CodePreviewProps) {
  const tabs = fileMap ? pickTabs(fileMap, platform, lang) : []
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => { setActiveTab(0) }, [fileMap])

  useEffect(() => {
    if (!codeRef.current || !fileMap) return
    loadHljs().then(() => {
      const hljs = (window as HljsWindow).hljs
      if (!hljs || !codeRef.current) return
      codeRef.current.removeAttribute('data-highlighted')
      hljs.highlightElement(codeRef.current)
    })
  }, [fileMap, activeTab])

  function handleCopy() {
    if (!fileMap || !tabs[activeTab]) return
    navigator.clipboard.writeText(fileMap[tabs[activeTab]] ?? '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  if (!fileMap && !loading) return null

  const activeFile = fileMap && tabs[activeTab] ? tabs[activeTab] : null
  const activeContent = activeFile && fileMap ? (fileMap[activeFile] ?? '') : ''
  const lines = activeContent.split('\n')
  const truncated = lines.length > MAX_LINES
  const displayContent = truncated ? lines.slice(0, MAX_LINES).join('\n') + '\n// ...' : activeContent

  return (
    <div style={{ marginTop: 16, border: '1px solid var(--color-border)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)', padding: '0 10px', minHeight: 36,
      }}>
        <div style={{ display: 'flex' }}>
          {loading
            ? <div style={{ padding: '8px 12px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Generating preview...</div>
            : tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  style={{
                    padding: '8px 12px', border: 'none', background: 'none',
                    cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'monospace',
                    fontWeight: activeTab === i ? 600 : 400,
                    color: activeTab === i ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    borderBottom: activeTab === i ? '2px solid var(--color-primary)' : '2px solid transparent',
                    marginBottom: -1,
                  }}
                >
                  {shortName(tab)}
                </button>
              ))}
        </div>
        <button
          onClick={handleCopy}
          disabled={!activeFile || loading}
          style={{
            fontSize: '0.6875rem', padding: '4px 10px', borderRadius: 5,
            border: '1px solid var(--color-border)', background: 'none',
            cursor: activeFile ? 'pointer' : 'default',
            color: copied ? '#16a34a' : 'var(--color-text-secondary)',
            fontWeight: 600, flexShrink: 0,
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div style={{ maxHeight: 300, overflowY: 'auto', backgroundColor: '#0d1117' }}>
        {loading ? (
          <div style={{ padding: 16, fontSize: '0.75rem', color: '#8b949e', fontFamily: 'monospace' }}>
            Generating preview...
          </div>
        ) : activeFile ? (
          <>
            <pre style={{ margin: 0, padding: '12px 16px', fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto' }}>
              <code
                ref={codeRef}
                className={`language-${langForFile(activeFile)}`}
                style={{ background: 'none', padding: 0, fontSize: 'inherit' }}
              >
                {displayContent}
              </code>
            </pre>
            {truncated && (
              <div style={{ padding: '0 16px 8px', fontSize: '0.6875rem', color: '#8b949e' }}>
                Showing first {MAX_LINES} lines
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: 16, fontSize: '0.75rem', color: '#8b949e' }}>Preview unavailable</div>
        )}
      </div>
    </div>
  )
}

export default CodePreview
