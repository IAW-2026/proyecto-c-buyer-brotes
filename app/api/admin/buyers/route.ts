import { prisma } from '../../../lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

async function verificarAdmin() {
  const { sessionClaims } = await auth()
  const roles = (sessionClaims?.metadata as any) ?? []
  return Array.isArray(roles) ? roles.includes('admin') : roles === 'admin'
}

export async function GET(request: NextRequest) {
  if (!await verificarAdmin()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const query = request.nextUrl.searchParams.get('q') ?? ''

  const buyers = await prisma.buyer.findMany({
    where: query ? {
      OR: [
        { nombre: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } }
      ]
    } : {},
    include: { orders: true },
    orderBy: { id: 'desc' }
  })

  return NextResponse.json(buyers)
}