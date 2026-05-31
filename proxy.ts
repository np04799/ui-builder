import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE = 'bp_auth'
const LOGIN_PATH = '/login'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow the login page and its API route through
  if (pathname === LOGIN_PATH || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

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
