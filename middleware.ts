// middleware.ts (root of project or src/ if you're using src/)
import { NextResponse } from 'next/server'

export function middleware() {
  // simple pass-through
  return NextResponse.next()
}

// optional: restrict which paths run the middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
