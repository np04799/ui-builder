import { NextResponse } from 'next/server'

const PASSWORD = process.env.PREVIEW_PASSWORD ?? 'nui3'

export async function POST(request: Request) {
  const { password } = await request.json()

  if (password !== PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('bp_auth', 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return res
}
