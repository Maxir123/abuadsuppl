// middleware.ts  (project root)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth' // Your auth function

export async function middleware(req: NextRequest) {
  const session = await auth() // Get session server-side
  const { pathname } = req.nextUrl

  const protectedPaths = ['/checkout', '/account', '/admin']
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtected && !session?.user) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/checkout/:path*', '/account/:path*', '/admin/:path*'],
}
