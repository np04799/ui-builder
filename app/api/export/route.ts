import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import { buildProject } from '@/engine/export/builder.export'
import { generateHTML, generateCSS } from '@/engine/export/html.generator'
import { generateReactProject } from '@/engine/export/react.generator'
import { generateVueProject } from '@/engine/export/vue.generator'
import { generateAngularProject } from '@/engine/export/angular.generator'
import type { BuilderStoreState } from '@/types/store.types'
import type { Lang } from '@/engine/export/react.generator'

export const runtime = 'nodejs'

type ExportFormat = 'html' | 'css' | 'zip' | 'component-zip'
type ComponentTarget = 'react' | 'vue' | 'angular'

interface ExportBody {
  state: BuilderStoreState
  format: ExportFormat
  target?: ComponentTarget
  componentNames?: string[]
  lang?: Lang
  frameworkVersion?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ExportBody
    if (!body.state || !body.format) {
      return NextResponse.json({ error: 'Missing state or format' }, { status: 400 })
    }

    const project = buildProject(body.state)
    if (!project) {
      return NextResponse.json({ error: 'No project initialized' }, { status: 422 })
    }

    const filename = project.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'export'

    if (body.format === 'html' || body.format === 'css' || body.format === 'zip') {
      const html = generateHTML(project)
      const css  = generateCSS(project)

      if (body.format === 'html') {
        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}.html"`,
          },
        })
      }

      if (body.format === 'css') {
        return new NextResponse(css, {
          headers: {
            'Content-Type': 'text/css; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}.css"`,
          },
        })
      }

      if (body.format === 'zip') {
        const zip = new JSZip()
        zip.file('index.html', html)
        zip.file('styles.css', css)
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
    }

    if (body.format === 'component-zip') {
      const {
        target,
        componentNames = project.sections.map((_, i) => `Section${i + 1}`),
        lang = 'typescript',
        frameworkVersion = project.frameworkVersion ?? '',
      } = body

      if (!target) {
        return NextResponse.json({ error: 'Missing target for component-zip' }, { status: 400 })
      }

      if (project.mode === 'custom') {
        return NextResponse.json(
          { error: 'Component export is not available for Custom mode. Use HTML/CSS export instead.' },
          { status: 422 },
        )
      }

      let fileMap: Record<string, string>

      if (target === 'react') {
        fileMap = generateReactProject({
          project,
          componentNames,
          lang,
          frameworkVersion,
          branding: body.state.projectMeta?.branding,
        })
      } else if (target === 'vue') {
        fileMap = generateVueProject({
          project,
          componentNames,
          lang,
          frameworkVersion,
          branding: body.state.projectMeta?.branding,
        })
      } else if (target === 'angular') {
        fileMap = generateAngularProject({
          project,
          componentNames,
          frameworkVersion,
          branding: body.state.projectMeta?.branding,
        })
      } else {
        return NextResponse.json({ error: 'Invalid target' }, { status: 400 })
      }

      const zip = new JSZip()
      for (const [path, content] of Object.entries(fileMap)) {
        zip.file(path, content)
      }
      const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
      const zipName = `${filename}-${target}.zip`
      return new NextResponse(buffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${zipName}"`,
          'Content-Length': String(buffer.byteLength),
        },
      })
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
  } catch (err) {
    console.error('[export] error:', err)
    return NextResponse.json(
      { error: 'Export failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
