import { prisma } from '../../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

async function getOrCreateBuyer(buyer_id: number) {
  let buyer = await prisma.buyer.findUnique({
    where: { id: buyer_id }
  })

  if (!buyer) {
    buyer = await prisma.buyer.create({
      data: {
        id: buyer_id,
        clerk_user_id: `temp_${buyer_id}`,
        nombre: 'Usuario de prueba',
        email: 'prueba@brotes.com',
      }
    })
  }

  return buyer
}

export async function GET(request: NextRequest) {
  const buyer_id = request.nextUrl.searchParams.get('buyer_id')

  if (!buyer_id) {
    return NextResponse.json({ error: 'buyer_id requerido' }, { status: 400 })
  }

  const cart = await prisma.cart.findFirst({
    where: {
      buyer_id: Number(buyer_id),
      estado: 'active'
    },
    include: { items: true }
  })

  return NextResponse.json(cart)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { buyer_id, product_id, precio_unitario, cantidad, seller_id, product_name } = body

  await getOrCreateBuyer(Number(buyer_id))

  let cart = await prisma.cart.findFirst({
    where: { buyer_id: Number(buyer_id), estado: 'active' },
    include: { items: true }
  })

  // Si tiene carrito de otro vendedor, error
  if (cart && cart.seller_id && cart.seller_id !== Number(seller_id)) {
    return NextResponse.json(
      { error: 'Ya tenés productos de otro vendedor en el carrito' },
      { status: 409 }
    )
  }

  // Si no hay carrito activo, busca uno abandonado y lo reactiva
  if (!cart) {
    const cartExistente = await prisma.cart.findFirst({
      where: { buyer_id: Number(buyer_id) }
    })

    if (cartExistente) {
      cart = await prisma.cart.update({
        where: { id: cartExistente.id },
        data: { estado: 'active', seller_id: Number(seller_id) },
        include: { items: true }
      })
    } else {
      cart = await prisma.cart.create({
        data: {
          buyer_id: Number(buyer_id),
          seller_id: Number(seller_id),
          estado: 'active'
        },
        include: { items: true }
      })
    }
  }

  const itemExistente = cart.items.find(i => i.product_id === Number(product_id))

  if (itemExistente) {
    await prisma.cartItem.update({
      where: { id: itemExistente.id },
      data: { cantidad: itemExistente.cantidad + Number(cantidad) }
    })
  } else {
    await prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        product_id: Number(product_id),
        cantidad: Number(cantidad),
        precio_unitario: Number(precio_unitario)
      }
    })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const cart_id = request.nextUrl.searchParams.get('cart_id')

  if (!cart_id) {
    return NextResponse.json({ error: 'cart_id requerido' }, { status: 400 })
  }

  await prisma.cartItem.deleteMany({
    where: { cart_id: Number(cart_id) }
  })

  await prisma.cart.update({
    where: { id: Number(cart_id) },
    data: { estado: 'abandoned' }
  })

  return NextResponse.json({ success: true })
}