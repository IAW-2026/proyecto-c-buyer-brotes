import { prisma } from '../../lib/prisma'
import { getBuyerFromClerk } from '../../lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  const buyer = await getBuyerFromClerk()

  if (!buyer) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const { direccion } = body

  if (typeof direccion !== 'string' || !direccion.trim()) {
    return NextResponse.json({ error: 'La dirección no puede estar vacía' }, { status: 400 })
  }

  const updated = await prisma.buyer.update({
    where: { id: buyer.id },
    data: { direccion: direccion.trim() }
  })

  return NextResponse.json({ success: true, direccion: updated.direccion })
}