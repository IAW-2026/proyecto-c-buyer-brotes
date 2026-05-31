import { prisma } from '../../../../lib/prisma'
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

export async function PATCH(request: NextRequest, { params }: Props) {
  if (!await verificarAdmin()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { accion, motivo } = body

  const buyer = await prisma.buyer.findUnique({ where: { id: Number(id) } })
  if (!buyer) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  if (accion === 'suspender') {
    await prisma.buyer.update({
      where: { id: Number(id) },
      data: { estado: 'suspendido' }
    })

    await prisma.accountNotification.create({
      data: {
        buyer_id: Number(id),
        tipo: 'suspendido',
        titulo: 'Tu cuenta fue suspendida',
        mensaje: 'Un administrador suspendió tu cuenta temporalmente. No podés realizar compras ni publicar en el foro hasta que sea reactivada. Si creés que es un error, contactá al soporte.'
      }
    })

    return NextResponse.json({ success: true, estado: 'suspendido' })
  }

  if (accion === 'reactivar') {
    await prisma.buyer.update({
      where: { id: Number(id) },
      data: { estado: 'activo' }
    })

    await prisma.accountNotification.create({
      data: {
        buyer_id: Number(id),
        tipo: 'reactivado',
        titulo: 'Tu cuenta fue reactivada',
        mensaje: 'Tu cuenta fue reactivada por un administrador. Ya podés volver a realizar compras y participar en el foro normalmente.'
      }
    })

    return NextResponse.json({ success: true, estado: 'activo' })
  }

  if (accion === 'eliminar') {
    if (!motivo) {
      return NextResponse.json(
        { error: 'Se requiere una justificación para eliminar' },
        { status: 400 }
      )
    }

    await prisma.buyer.update({
      where: { id: Number(id) },
      data: {
        estado: 'eliminado',
        deleted_at: new Date(),
        delete_reason: motivo
      }
    })

    await prisma.accountNotification.create({
      data: {
        buyer_id: Number(id),
        tipo: 'eliminado',
        titulo: 'Tu cuenta fue eliminada',
        mensaje: `Tu cuenta fue eliminada por un administrador. Motivo: ${motivo}`
      }
    })

    return NextResponse.json({ success: true, estado: 'eliminado' })
  }

  return NextResponse.json({ error: 'Acción inválida' }, { status: 400 })
}