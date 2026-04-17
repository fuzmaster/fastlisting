import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('authjs.session-token') ?? 
                request.cookies.get('__Secure-authjs.session-token')

  const protectedRoutes = ['/dashboard', '/brand-presets']
  const isProtected =
    protectedRoutes.some((r) => pathname.startsWith(r)) ||
    pathname.startsWith('/projects/')

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/projects/:path*', '/brand-presets'],
}
