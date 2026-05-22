import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/explorar(.*)',
  '/vendedores(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/weather',
  '/api/plantas/consejos',
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
    // Excluir archivos estáticos, imágenes y recursos del build de Next.js
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp|.*\\.ico|.*\\.css|.*\\.js).*)',
    // Siempre correr en rutas de API
    '/(api|trpc)(.*)',
  ],
}