import { prisma } from '../../lib/prisma'
import { vendedores } from '../../lib/mock-data'
import { NextRequest, NextResponse } from 'next/server'

function getSellerIdFromProduct(product_id: number) {
  const seller = vendedores.find((vendedor) =>
    vendedor.productos.some((producto) => producto.id === Number(product_id))
  )
  return seller?.id ?? null
}

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

  if (!cart) {
    cart = await prisma.cart.findFirst({
      where: { buyer_id: Number(buyer_id) },
      include: { items: true }
    })
  }

  const sellerIdNumber = Number(seller_id)

  if (cart) {
    if (cart.items.length === 0) {
      if (cart.seller_id !== sellerIdNumber) {
        cart = await prisma.cart.update({
          where: { id: cart.id },
          data: { seller_id: sellerIdNumber },
          include: { items: true }
        })
      }
    } else {
      let currentSellerId = cart.seller_id

      if (!currentSellerId) {
        const inferredSellerIds = Array.from(
          new Set(
            cart.items
              .map((item) => getSellerIdFromProduct(item.product_id))
              .filter((id): id is number => id !== null)
          )
        )

        if (inferredSellerIds.length !== 1) {
          return NextResponse.json(
            { error: 'El carrito contiene productos de vendedores distintos. Vacialo antes de agregar nuevos productos.' },
            { status: 409 }
          )
        }

        currentSellerId = inferredSellerIds[0]
        await prisma.cart.update({
          where: { id: cart.id },
          data: { seller_id: currentSellerId }
        })
      }

      if (currentSellerId !== sellerIdNumber) {
        return NextResponse.json(
          { error: 'Ya tenés productos de otro vendedor en el carrito' },
          { status: 409 }
        )
      }
    }

    if (cart.estado !== 'active') {
      cart = await prisma.cart.update({
        where: { id: cart.id },
        data: { estado: 'active' },
        include: { items: true }
      })
    }
  }

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        buyer_id: Number(buyer_id),
        seller_id: sellerIdNumber,
        estado: 'active'
      },
      include: { items: true }
    })
  }

  const itemExistente = cart.items.find(i => i.product_id === Number(product_id))

  if (itemExistente) {
    await prisma.cartItem.update({
      where: { id: itemExistente.id },
      data: {
        cantidad: itemExistente.cantidad + Number(cantidad)
      }
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

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { cart_item_id, cantidad } = body

  if (!cart_item_id || typeof cantidad !== 'number' || cantidad < 0) {
    return NextResponse.json(
      { error: 'cart_item_id y cantidad válidos son requeridos' },
      { status: 400 }
    )
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: Number(cart_item_id) }
  })

  if (!item) {
    return NextResponse.json({ error: 'Item de carrito no encontrado' }, { status: 404 })
  }

  if (cantidad === 0) {
    await prisma.cartItem.delete({
      where: { id: item.id }
    })
    return NextResponse.json({ success: true })
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { cantidad: Number(cantidad) }
  })

  return NextResponse.json({ success: true })
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