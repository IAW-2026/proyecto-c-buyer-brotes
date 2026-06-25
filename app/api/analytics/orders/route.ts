import { prisma } from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const SERVICE_API_KEY = process.env.BUYER_SERVICE_API_KEY

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
  if (apiKey !== SERVICE_API_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const [distribucion, ordersRecientes, ordersMeses] = await Promise.all([
    prisma.order.groupBy({
      by: ['estado'],
      _count: { estado: true }
    }),
    prisma.order.findMany({
      orderBy: { created_at: 'desc' },
      take: 50,
      include: {
        buyer: { select: { id: true, nombre: true, email: true } },
        items: true
      }
    }),
    prisma.order.findMany({
      where: { created_at: { gte: sixMonthsAgo } },
      select: { created_at: true, estado: true },
      orderBy: { created_at: 'asc' }
    })
  ])

  const monthlyMap: Record<string, Record<string, number>> = {}
  for (const o of ordersMeses) {
    const mes = o.created_at.toISOString().slice(0, 7)
    if (!monthlyMap[mes]) monthlyMap[mes] = {}
    monthlyMap[mes][o.estado] = (monthlyMap[mes][o.estado] ?? 0) + 1
  }

  const pedidosPorMes = Object.entries(monthlyMap).map(([mes, data]) => ({
    mes,
    ...data
  }))

  const distribucionEstadosPedidos = distribucion.map(d => ({
    estado: d.estado,
    cantidad: d._count.estado
  }))

  const ultimosPedidos = ordersRecientes.map(o => ({
    id: o.id,
    buyer_id: o.buyer_id,
    buyer_nombre: o.buyer?.nombre ?? 'Sin nombre',
    buyer_email: o.buyer?.email ?? '',
    seller_id: o.seller_id,
    total: Number(o.total),
    estado: o.estado,
    payment_id: o.payment_id,
    items_count: o.items.length,
    items: o.items.map(i => ({
      product_id: i.product_id,
      product_name: i.product_name_snapshot,
      unit_price: Number(i.unit_price_snapshot),
      cantidad: i.cantidad
    })),
    created_at: o.created_at.toISOString()
  }))

  return NextResponse.json({
    pedidosPorMes,
    distribucionEstadosPedidos,
    ultimosPedidos
  })
}
