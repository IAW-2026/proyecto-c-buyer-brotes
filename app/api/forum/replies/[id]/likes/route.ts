import { prisma } from '../../../../../lib/prisma'
import { getBuyerFromClerk } from '../../../../../lib/auth'
import { NextRequest, NextResponse } from 'next/server'

type Props = {
  params: Promise<{ id: string }>
}

// POST /api/forum/replies/[id]/likes → toggle like
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

  const reply = await prisma.forumReply.findUnique({ where: { id: Number(id) } })
  if (!reply) {
    return NextResponse.json({ error: 'Respuesta no encontrada' }, { status: 404 })
  }

  // Verificar si ya tiene like
  const existing = await prisma.forumReplyLike.findUnique({
    where: {
      reply_id_buyer_id: {
        reply_id: Number(id),
        buyer_id: buyer.id
      }
    }
  })

  if (existing) {
    // Quitar like
    await prisma.forumReplyLike.delete({ where: { id: existing.id } })
    const count = await prisma.forumReplyLike.count({ where: { reply_id: Number(id) } })
    return NextResponse.json({ liked: false, count })
  } else {
    // Dar like
    await prisma.forumReplyLike.create({
      data: {
        reply_id: Number(id),
        buyer_id: buyer.id
      }
    })
    const count = await prisma.forumReplyLike.count({ where: { reply_id: Number(id) } })
    return NextResponse.json({ liked: true, count })
  }
}