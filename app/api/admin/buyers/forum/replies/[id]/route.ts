import { prisma } from '@/app/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

async function verificarAdmin() {
  const { sessionClaims } = await auth()
  const roles = (sessionClaims?.metadata as any) ?? []
  return Array.isArray(roles) ? roles.includes('admin') : roles === 'admin'
}

type Props = {
  params: Promise<{ id: string }>
}

export async function DELETE(request: NextRequest, { params }: Props) {
  if (!await verificarAdmin()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { id } = await params

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const reply = await prisma.forumReply.findUnique({ where: { id: Number(id) } })
  if (!reply) {
    return NextResponse.json({ error: 'Respuesta no encontrada' }, { status: 404 })
  }

  // Los likes se eliminan en cascada por el schema
  await prisma.forumReply.delete({ where: { id: Number(id) } })

  return NextResponse.json({ success: true })
}