import { prisma } from '../../../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

type Props = {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: Props) {
  console.log('[payment-confirm] POST recibido')

  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
  if (apiKey !== process.env.BUYER_SERVICE_API_KEY) {
    console.warn('[payment-confirm] API key inválida')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id: payment_id } = await params
  const body = await request.json()
  const { buyer_id } = body

  console.log('[payment-confirm] payment_id:', payment_id, '| buyer_id:', buyer_id)

  const order = await prisma.order.findFirst({
    where: {
      buyer_id: Number(buyer_id),
      estado: 'pendiente'
    }
  })

  if (!order) {
    console.warn('[payment-confirm] No se encontró orden pendiente para buyer_id:', buyer_id)
    return NextResponse.json({ error: 'Orden pendiente no encontrada' }, { status: 404 })
  }

  console.log('[payment-confirm] Orden encontrada:', order.id, '| actualizando a confirmada...')

  await prisma.order.update({
    where: { id: order.id },
    data: {
      estado: 'confirmada',
      payment_id: Number(payment_id)
    }
  })

  const responseBody = { acknowledged: true, payment_id, buyer_id }
  console.log('[payment-confirm] Respuesta:', JSON.stringify(responseBody))

  return NextResponse.json(responseBody, { status: 201 })
}