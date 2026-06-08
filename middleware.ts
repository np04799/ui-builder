import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE = 'bp_auth'
const LOGIN_PATH = '/login'

// When Firebase env vars are not set, skip auth entirely — open access
const FIREBASE_CONFIGURED = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow static assets, API routes, login page
  if (
    pathname === LOGIN_PATH ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/')
  ) {
    return NextResponse.next()
  }

  // If Firebase not configured, allow everything — no auth gate
  if (!FIREBASE_CONFIGURED) {
    return NextResponse.next()
  }

  // Firebase configured: require bp_auth cookie
  const auth = request.cookies.get(COOKIE)?.value
  if (auth === 'ok') {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = LOGIN_PATH
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\.png$|.*\.svg$).*)'],
}
