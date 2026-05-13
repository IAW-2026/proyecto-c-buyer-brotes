import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/explorar(.*)',
  '/vendedores(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/approved-payment',
  '/api/rejected-payment',
  '/api/orders/:id/status-update',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }

  const response = NextResponse.next()
  response.headers.set('x-pathname', request.nextUrl.pathname)
  return response
})

export const config = {
  matcher: ['/((?!_next|api/health|favicon.ico).*)']
}