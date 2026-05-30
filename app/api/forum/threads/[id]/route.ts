import { prisma } from '../../../../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

type Props = {
  params: Promise<{ id: string }>
}

// GET /api/forum/threads/[id]
export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const thread = await prisma.forumThread.findUnique({
    where: { id: Number(id) },
    include: {
      buyer: { select: { id: true, nombre: true } },
      replies: {
        include: {
          buyer: { select: { id: true, nombre: true } }
        },
        orderBy: { created_at: 'asc' }
      }
    }
  })

  if (!thread) {
    return NextResponse.json({ error: 'Hilo no encontrado' }, { status: 404 })
  }

  return NextResponse.json(thread)
}