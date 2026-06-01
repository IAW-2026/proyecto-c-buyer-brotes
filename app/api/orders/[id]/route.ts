import { prisma } from '../../../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const SERVICE_API_KEY = process.env.BUYER_SERVICE_API_KEY

type Props = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Props) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
  if (apiKey !== SERVICE_API_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { items: true }
  })

  if (!order) {
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
  }

  return NextResponse.json({
    id: order.id,
    buyer_id: order.buyer_id,
    seller_id: order.seller_id,
    status: order.estado,
    total: {
      amount: Number(order.total),
      currency: 'ARS'
    },
    payment_id: order.payment_id,
    items: order.items.map(i => ({
      product_id: i.product_id,
      product_name: i.product_name_snapshot,
      unit_price: Number(i.unit_price_snapshot),
      quantity: i.cantidad,
      subtotal: Number(i.unit_price_snapshot) * i.cantidad
    })),
    created_at: order.created_at.toISOString()
  })
}