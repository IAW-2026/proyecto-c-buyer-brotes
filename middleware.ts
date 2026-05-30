import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/explorar(.*)',
  '/vendedores(.*)',
  '/foro(.*)',                        // ← NUEVO: el foro es público (lectura sin login)
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/weather',
  '/api/plantas/consejos',
  '/api/forum/threads',               // ← NUEVO: GET de hilos sin login
  '/api/forum/threads/(.*)',          // ← NUEVO: GET de hilo individual sin login
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
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp|.*\\.ico|.*\\.css|.*\\.js).*)',
    '/(api|trpc)(.*)',
  ],
}