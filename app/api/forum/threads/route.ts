import { prisma } from '../../../lib/prisma'
import { getBuyerFromClerk } from '../../../lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/forum/threads?q=monstera&tag=suculentas
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? ''
  const tag = request.nextUrl.searchParams.get('tag') ?? ''

  const threads = await prisma.forumThread.findMany({
    where: {
      ...(q && {
        OR: [
          { titulo: { contains: q, mode: 'insensitive' } },
          { contenido: { contains: q, mode: 'insensitive' } },
        ]
      }),
      ...(tag && { planta_tag: { equals: tag, mode: 'insensitive' } })
    },
    include: {
      buyer: { select: { id: true, nombre: true } },
      _count: { select: { replies: true } }
    },
    orderBy: { created_at: 'desc' }
  })

  return NextResponse.json(threads)
}

// POST /api/forum/threads
export async function POST(request: NextRequest) {
  const buyer = await getBuyerFromClerk()
  if (!buyer) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  if (buyer.estado === 'eliminado' || buyer.estado === 'suspendido') {
    return NextResponse.json({ error: 'Tu cuenta no puede realizar esta acción' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const { titulo, contenido, planta_tag } = body

  if (!titulo?.trim()) {
    return NextResponse.json({ error: 'El título es requerido' }, { status: 400 })
  }
  if (!contenido?.trim()) {
    return NextResponse.json({ error: 'El contenido es requerido' }, { status: 400 })
  }

  const thread = await prisma.forumThread.create({
    data: {
      buyer_id: buyer.id,
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      planta_tag: planta_tag?.trim() || null
    },
    include: {
      buyer: { select: { id: true, nombre: true } },
      _count: { select: { replies: true } }
    }
  })

  return NextResponse.json(thread, { status: 201 })
}