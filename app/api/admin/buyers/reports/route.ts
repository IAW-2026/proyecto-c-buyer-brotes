import { prisma } from '@/app/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

async function verificarAdmin() {
  const { sessionClaims } = await auth()
  const roles = (sessionClaims?.metadata as any) ?? []
  return Array.isArray(roles) ? roles.includes('admin') : roles === 'admin'
}

export async function GET() {
  if (!await verificarAdmin()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const [
    totalOrdenes,
    ordenesPorEstado,
    ordenesRecientes,
    ingresoTotal
  ] = await Promise.all([
    prisma.order.count(),

    prisma.order.groupBy({
      by: ['estado'],
      _count: { estado: true }
    }),

    prisma.order.findMany({
      orderBy: { created_at: 'desc' },
      take: 20,
      include: {
        buyer: { select: { nombre: true, email: true } },
        items: true
      }
    }),

    prisma.order.aggregate({
      _sum: { total: true },
      where: { estado: { in: ['confirmada', 'en_preparacion', 'listo', 'entregada'] } }
    })
  ])

  return NextResponse.json({
    totalOrdenes,
    ordenesPorEstado,
    ingresoTotal: Number(ingresoTotal._sum.total ?? 0),
    ordenesRecientes: ordenesRecientes.map(o => ({
      id: o.id,
      buyer_nombre: o.buyer?.nombre ?? 'Sin nombre',
      buyer_email: o.buyer?.email ?? '',
      seller_id: o.seller_id,
      total: Number(o.total),
      estado: o.estado,
      items_count: o.items.length,
      created_at: o.created_at.toISOString()
    }))
  })
}