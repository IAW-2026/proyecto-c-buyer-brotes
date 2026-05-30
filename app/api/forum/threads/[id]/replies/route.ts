import { prisma } from '../../../../../lib/prisma'
import { getBuyerFromClerk } from '../../../../../lib/auth'
import { NextRequest, NextResponse } from 'next/server'

type Props = {
  params: Promise<{ id: string }>
}

// POST /api/forum/threads/[id]/replies
export async function POST(request: NextRequest, { params }: Props) {
  const buyer = await getBuyerFromClerk()
  if (!buyer) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  if (buyer.estado === 'eliminado' || buyer.estado === 'suspendido') {
    return NextResponse.json({ error: 'Tu cuenta no puede realizar esta acción' }, { status: 403 })
  }

  const { id } = await params

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const thread = await prisma.forumThread.findUnique({ where: { id: Number(id) } })
  if (!thread) {
    return NextResponse.json({ error: 'Hilo no encontrado' }, { status: 404 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const { contenido } = body

  if (!contenido?.trim()) {
    return NextResponse.json({ error: 'El contenido es requerido' }, { status: 400 })
  }

  const reply = await prisma.forumReply.create({
    data: {
      thread_id: Number(id),
      buyer_id: buyer.id,
      contenido: contenido.trim()
    },
    include: {
      buyer: { select: { id: true, nombre: true } }
    }
  })

  return NextResponse.json(reply, { status: 201 })
}