import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { existsSync } from 'fs'

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
const EXT_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 415 })
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 413 })
    }

    if (!existsSync(UPLOADS_DIR)) {
      await mkdir(UPLOADS_DIR, { recursive: true })
    }

    const ext = EXT_MAP[file.type] ?? extname(file.name) ?? '.jpg'
    const filename = `${crypto.randomUUID()}${ext}`
    const dest = join(UPLOADS_DIR, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(dest, buffer)

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
