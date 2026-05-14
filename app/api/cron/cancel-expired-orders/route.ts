import { prisma } from '../../../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const unaHoraAtras = new Date(Date.now() - 1 * 60 * 1000)

  const ordenesCaducadas = await prisma.order.findMany({
    where: {
      estado: 'pendiente',
      created_at: { lt: unaHoraAtras }
    }
  })

  for (const order of ordenesCaducadas) {
    await prisma.order.update({
      where: { id: order.id },
      data: { estado: 'caducada' }
    })

    const cart = await prisma.cart.findFirst({
      where: { buyer_id: order.buyer_id }
    })

    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cart_id: cart.id } })
      await prisma.cart.update({
        where: { id: cart.id },
        data: { estado: 'abandoned' }
      })
    }
  }

  return NextResponse.json({
    success: true,
    canceladas: ordenesCaducadas.length
  })
}