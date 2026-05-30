import { prisma } from '../../lib/prisma'
import { vendedores } from '../../lib/mock-data'
import { NextRequest, NextResponse } from 'next/server'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSellerIdFromProduct(product_id: number): number | null {
  const seller = vendedores.find(v =>
    v.productos.some(p => p.id === product_id)
  )
  return seller?.id ?? null
}

async function getOrCreateBuyer(buyer_id: number) {
  const existing = await prisma.buyer.findUnique({ where: { id: buyer_id } })

  if (existing) {
    if (existing.estado === 'eliminado') throw new Error('CUENTA_ELIMINADA')
    if (existing.estado === 'suspendido') throw new Error('CUENTA_SUSPENDIDA')
    return existing
  }

  return prisma.buyer.upsert({
    where: { id: buyer_id },
    update: {},
    create: {
      id: buyer_id,
      clerk_user_id: `temp_${buyer_id}`,
      nombre: 'Usuario de prueba',
      email: `prueba_${buyer_id}@brotes.com`
    }
  })
}

// ── GET /api/cart?buyer_id=X ──────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const buyer_id = request.nextUrl.searchParams.get('buyer_id')

  if (!buyer_id || isNaN(Number(buyer_id))) {
    return NextResponse.json(
      { error: 'buyer_id es requerido y debe ser un número' },
      { status: 400 }
    )
  }

  const cart = await prisma.cart.findFirst({
    where: { buyer_id: Number(buyer_id), estado: 'active' },
    include: { items: true }
  })

  return NextResponse.json(cart)
}

// ── POST /api/cart ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)

  if (!body) {
    return NextResponse.json(
      { error: 'El cuerpo de la request es inválido' },
      { status: 400 }
    )
  }

  const { buyer_id, product_id, precio_unitario, cantidad, seller_id } = body

  // ── Validaciones ──────────────────────────────────────────────────────────
  if (!buyer_id || isNaN(Number(buyer_id))) {
    return NextResponse.json(
      { error: 'buyer_id es requerido y debe ser un número' },
      { status: 400 }
    )
  }
  if (!product_id || isNaN(Number(product_id))) {
    return NextResponse.json(
      { error: 'product_id es requerido y debe ser un número' },
      { status: 400 }
    )
  }
  if (!precio_unitario || isNaN(Number(precio_unitario)) || Number(precio_unitario) <= 0) {
    return NextResponse.json(
      { error: 'precio_unitario es requerido y debe ser mayor a 0' },
      { status: 400 }
    )
  }
  if (!cantidad || isNaN(Number(cantidad)) || Number(cantidad) < 1) {
    return NextResponse.json(
      { error: 'cantidad es requerida y debe ser al menos 1' },
      { status: 400 }
    )
  }
  if (!seller_id || isNaN(Number(seller_id))) {
    return NextResponse.json(
      { error: 'seller_id es requerido y debe ser un número' },
      { status: 400 }
    )
  }

  // ── Validar que el producto existe ────────────────────────────────────────
  const productoExiste = vendedores
    .flatMap(v => v.productos)
    .some(p => p.id === Number(product_id))

  if (!productoExiste) {
    return NextResponse.json({ error: 'El producto no existe' }, { status: 404 })
  }

  // ── Validar que el seller_id corresponde al producto ─────────────────────
  const sellerRealId = getSellerIdFromProduct(Number(product_id))
  if (sellerRealId !== Number(seller_id)) {
    return NextResponse.json(
      { error: 'El seller_id no corresponde al producto indicado' },
      { status: 409 }
    )
  }

  // ── Validar estado del buyer ──────────────────────────────────────────────
  try {
    await getOrCreateBuyer(Number(buyer_id))
  } catch (err: any) {
    if (err.message === 'CUENTA_ELIMINADA') {
      return NextResponse.json(
        { error: 'Tu cuenta fue eliminada. No podés realizar compras.' },
        { status: 403 }
      )
    }
    if (err.message === 'CUENTA_SUSPENDIDA') {
      return NextResponse.json(
        { error: 'Tu cuenta está suspendida. Contactá al soporte para reactivarla.' },
        { status: 403 }
      )
    }
    throw err
  }

  const sellerIdNumber = Number(seller_id)

  // ── Obtener o crear el carrito del buyer ──────────────────────────────────
  // El schema tiene @@unique en buyer_id: hay exactamente 1 carrito por buyer.
  // Si existe (en cualquier estado), lo reactivamos y limpiamos si hace falta.
  // Si no existe, lo creamos.
  let cart = await prisma.cart.findUnique({
    where: { buyer_id: Number(buyer_id) },
    include: { items: true }
  })

  if (cart) {
    if (cart.estado === 'active') {
      // ── Carrito activo: validar que el seller coincide ──────────────────
      if (cart.items.length > 0) {
        const currentSellerId = cart.seller_id ?? getSellerIdFromProduct(cart.items[0].product_id)

        if (currentSellerId !== null && currentSellerId !== sellerIdNumber) {
          return NextResponse.json(
            { error: 'Ya tenés productos de otro vendedor en el carrito' },
            { status: 409 }
          )
        }
      }

      // Actualizar seller_id si estaba vacío
      if (cart.seller_id !== sellerIdNumber) {
        cart = await prisma.cart.update({
          where: { id: cart.id },
          data: { seller_id: sellerIdNumber },
          include: { items: true }
        })
      }
    } else {
      // ── Carrito checked_out o abandoned: reactivar limpio ───────────────
      // Los items ya fueron eliminados por /api/orders al confirmar la compra,
      // pero por seguridad hacemos deleteMany antes de reactivar.
      await prisma.cartItem.deleteMany({ where: { cart_id: cart.id } })

      cart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          estado: 'active',
          seller_id: sellerIdNumber
        },
        include: { items: true }
      })
    }
  } else {
    // ── No existe carrito: crear uno nuevo ─────────────────────────────────
    cart = await prisma.cart.create({
      data: {
        buyer_id: Number(buyer_id),
        seller_id: sellerIdNumber,
        estado: 'active'
      },
      include: { items: true }
    })
  }

  // ── Agregar o incrementar el item ─────────────────────────────────────────
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

// ── PATCH /api/cart ───────────────────────────────────────────────────────────

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null)

  if (!body) {
    return NextResponse.json(
      { error: 'El cuerpo de la request es inválido' },
      { status: 400 }
    )
  }

  const { cart_item_id, cantidad } = body

  if (!cart_item_id || isNaN(Number(cart_item_id))) {
    return NextResponse.json(
      { error: 'cart_item_id es requerido y debe ser un número' },
      { status: 400 }
    )
  }
  if (typeof cantidad !== 'number' || cantidad < 0) {
    return NextResponse.json(
      { error: 'cantidad debe ser un número mayor o igual a 0' },
      { status: 400 }
    )
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: Number(cart_item_id) }
  })

  if (!item) {
    return NextResponse.json(
      { error: 'Item de carrito no encontrado' },
      { status: 404 }
    )
  }

  if (cantidad === 0) {
    await prisma.cartItem.delete({ where: { id: item.id } })
    return NextResponse.json({ success: true })
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { cantidad: Number(cantidad) }
  })

  return NextResponse.json({ success: true })
}

// ── DELETE /api/cart?cart_id=X ────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  const cart_id = request.nextUrl.searchParams.get('cart_id')

  if (!cart_id || isNaN(Number(cart_id))) {
    return NextResponse.json(
      { error: 'cart_id es requerido y debe ser un número' },
      { status: 400 }
    )
  }

  const cart = await prisma.cart.findUnique({
    where: { id: Number(cart_id) }
  })

  if (!cart) {
    return NextResponse.json({ error: 'Carrito no encontrado' }, { status: 404 })
  }

  await prisma.cartItem.deleteMany({ where: { cart_id: Number(cart_id) } })
  await prisma.cart.update({
    where: { id: Number(cart_id) },
    data: { estado: 'abandoned' }
  })

  return NextResponse.json({ success: true })
}