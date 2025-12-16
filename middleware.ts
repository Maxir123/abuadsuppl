// middleware.ts

import NextAuth from 'next-auth'
import authConfig from './auth.config'

// 1. Get the handler function from NextAuth
const { auth } = NextAuth(authConfig)

// 2. Export it as a named export 'middleware' (as required by Next.js)
export const middleware = auth

export const config = {
  // ... your config remains the same
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
