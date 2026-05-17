import { prisma } from '../../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
  if (apiKey !== process.env.SERVICE_API_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { payment_id, buyer_id } = body

  const order = await prisma.order.findFirst({
    where: {
      buyer_id: Number(buyer_id),
      estado: 'pendiente'
    }
  })

  if (!order) {
    return NextResponse.json({ error: 'Orden pendiente no encontrada' }, { status: 404 })
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { estado: 'caducada' }
  })

  return NextResponse.json({
    acknowledged: true,
    payment_id,
    buyer_id
  }, { status: 201 })
}