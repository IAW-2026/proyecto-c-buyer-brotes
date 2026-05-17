import { prisma } from '../../../../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

type Props = {
  params: Promise<{ id: string }>
}

const estadosValidos = ['confirmada', 'en_preparacion', 'listo', 'entregada', 'caducada']

export async function POST(request: NextRequest, { params }: Props) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
  if (apiKey !== process.env.SERVICE_API_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { status } = body

  if (!estadosValidos.includes(status)) {
    return NextResponse.json(
      { error: `Estado inválido. Estados válidos: ${estadosValidos.join(', ')}` },
      { status: 400 }
    )
  }

  const order = await prisma.order.findUnique({
    where: { id: Number(id) }
  })

  if (!order) {
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
  }

  await prisma.order.update({
    where: { id: Number(id) },
    data: { estado: status }
  })

  return NextResponse.json({
    acknowledged: true,
    order_id: id,
    status
  }, { status: 200 })
}