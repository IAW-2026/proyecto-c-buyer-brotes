import { prisma } from '../../lib/prisma'
import { procesarPago } from '../../lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { buyer_id, cart_id } = body

  const cart = await prisma.cart.findUnique({
    where: { id: Number(cart_id) },
    include: { items: true }
  })

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: 'Carrito vacío o no encontrado' }, { status: 400 })
  }

  if (!cart.seller_id) {
    return NextResponse.json({ error: 'El carrito no tiene vendedor asignado' }, { status: 400 })
  }

  const total = cart.items.reduce((acc, item) => {
    return acc + Number(item.precio_unitario) * item.cantidad
  }, 0)

  const order = await prisma.order.create({
    data: {
      buyer_id: Number(buyer_id),
      seller_id: cart.seller_id,
      total,
      estado: 'pendiente',
      items: {
        create: cart.items.map(item => ({
          product_id: item.product_id,
          product_name_snapshot: `Producto #${item.product_id}`,
          unit_price_snapshot: item.precio_unitario,
          cantidad: item.cantidad
        }))
      }
    },
    include: { items: true }
  })

  const pago = await procesarPago(order.id, total)

  if (pago.status !== 'approved') {
    await prisma.order.update({
      where: { id: order.id },
      data: { estado: 'caducada' }
    })
    return NextResponse.json({ error: 'El pago fue rechazado' }, { status: 402 })
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { estado: 'confirmada', payment_id: pago.id }
  })

  await prisma.cartItem.deleteMany({ where: { cart_id: cart.id } })
  await prisma.cart.update({
    where: { id: cart.id },
    data: { estado: 'checked_out' }
  })

  return NextResponse.json({ success: true, order_id: order.id }, { status: 201 })
}

// Expuesto para Payments App — requiere SERVICE_API_KEY
export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
  if (apiKey !== process.env.SERVICE_API_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id requerido' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { items: true }
  })

  if (!order) {
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
  }

  return NextResponse.json({
    id: order.id,
    buyer_id: order.buyer_id,
    seller_id: order.seller_id,
    status: order.estado,
    total: {
      amount: Number(order.total),
      currency: 'ARS'
    },
    payment_id: order.payment_id,
    items: order.items.map(item => ({
      product_id: item.product_id,
      product_name: item.product_name_snapshot,
      unit_price: Number(item.unit_price_snapshot),
      quantity: item.cantidad,
      subtotal: Number(item.unit_price_snapshot) * item.cantidad
    })),
    created_at: order.created_at
  })
}