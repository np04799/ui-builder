/**
 * POST /api/export
 *
 * Body: { state: BuilderStoreState, format: 'html' | 'css' | 'zip' }
 *
 * Returns:
 * - html  → text/html
 * - css   → text/css
 * - zip   → application/zip  (index.html + styles.css bundled)
 */

import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import { buildProject } from '@/engine/export/builder.export'
import { generateHTML, generateCSS } from '@/engine/export/html.generator'
import type { BuilderStoreState } from '@/types/store.types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      state: BuilderStoreState
      format: 'html' | 'css' | 'zip'
    }

    if (!body.state || !body.format) {
      return NextResponse.json({ error: 'Missing state or format' }, { status: 400 })
    }

    const project = buildProject(body.state)
    if (!project) {
      return NextResponse.json({ error: 'No project initialized' }, { status: 422 })
    }

    const html = generateHTML(project)
    const css = generateCSS(project)
    const filename = project.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'export'

    switch (body.format) {
      case 'html':
        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}.html"`,
          },
        })

      case 'css':
        return new NextResponse(css, {
          headers: {
            'Content-Type': 'text/css; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}.css"`,
          },
        })

      case 'zip': {
        const zip = new JSZip()
        zip.file('index.html', html)
        zip.file('styles.css', css)

        // Placeholder assets folder per EXPORT_RULES.md
        zip.folder('assets')

        const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })

        return new NextResponse(buffer as unknown as BodyInit, {
          headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${filename}.zip"`,
            'Content-Length': String(buffer.byteLength),
          },
        })
      }

      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }
  } catch (err) {
    console.error('[export] error:', err)
    return NextResponse.json(
      { error: 'Export failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
