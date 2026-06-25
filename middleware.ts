import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/explorar(.*)',
  '/vendedores(.*)',
  '/foro(.*)',
  '/sign-in(.*)',        
  '/sign-up(.*)',
  '/api/(.*)',  
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