import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '../lib/prisma'
import AdminPanel from './AdminPanel'

type Props = {
  searchParams: Promise<{ q?: string; tab?: string }>
}

export default async function AdminPage({ searchParams }: Props) {
  const { sessionClaims } = await auth()
  const roles = (sessionClaims?.metadata as any) ?? []
  const esAdmin = Array.isArray(roles) ? roles.includes('admin') : roles === 'admin'

  if (!esAdmin) redirect('/')

  const { q = '', tab = 'usuarios' } = await searchParams

  const [buyersRaw, totalOrdenes, ordenesPorEstado, ingresoRaw, ordenesRecientesRaw] =
    await Promise.all([
      prisma.buyer.findMany({
        where: q
          ? {
              OR: [
                { nombre: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } }
              ]
            }
          : {},
        include: { orders: true },
        orderBy: { id: 'desc' }
      }),

      prisma.order.count(),

      prisma.order.groupBy({
        by: ['estado'],
        _count: { estado: true }
      }),

      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          estado: { in: ['confirmada', 'en_preparacion', 'listo', 'entregada'] }
        }
      }),

      prisma.order.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          buyer: { select: { nombre: true, email: true } },
          items: { select: { id: true } }
        }
      })
    ])

  const buyers = buyersRaw.map(buyer => ({
    ...buyer,
    nombre: buyer.nombre ?? null,
    created_at: buyer.created_at.toISOString(),
    deleted_at: buyer.deleted_at?.toISOString() ?? null,
    orders: buyer.orders.map(order => ({
      ...order,
      total: Number(order.total),
      created_at: order.created_at.toISOString()
    }))
  }))

  const reporte = {
    totalOrdenes,
    ordenesPorEstado,
    ingresoTotal: Number(ingresoRaw._sum.total ?? 0),
    ordenesRecientes: ordenesRecientesRaw.map(o => ({
      id: o.id,
      buyer_nombre: o.buyer?.nombre ?? 'Sin nombre',
      buyer_email: o.buyer?.email ?? '',
      seller_id: o.seller_id,
      total: Number(o.total),
      estado: o.estado,
      items_count: o.items.length,
      created_at: o.created_at.toISOString()
    }))
  }

  return (
    <AdminPanel
      buyersIniciales={buyers}
      reporte={reporte}
      initialQuery={q}
      initialTab={tab as 'usuarios' | 'reporte'}
    />
  )
}