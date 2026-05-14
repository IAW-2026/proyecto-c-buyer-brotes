import { prisma } from '../../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { payment_id, buyer_id } = body

  const order = await prisma.order.findFirst({
    where: {
      buyer_id: Number(buyer_id),
      estado: 'pendiente'
    }
  })

  if (!order) {
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      estado: 'confirmada',
      payment_id: Number(payment_id)
    }
  })

  return NextResponse.json({
    acknowledged: true,
    payment_id,
    buyer_id
  }, { status: 201 })
}