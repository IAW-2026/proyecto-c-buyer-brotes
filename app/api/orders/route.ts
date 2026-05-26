import { prisma } from '../../lib/prisma'
import { getProductoById } from '../../lib/api'
import { NextRequest, NextResponse } from 'next/server'

// ── Helpers de integración inter-servicios ────────────────────────────────────

const SELLER_APP_URL = process.env.SELLER_APP_URL
const PAYMENTS_APP_URL = process.env.PAYMENTS_APP_URL
const SERVICE_API_KEY = process.env.BUYER_SERVICE_API_KEY

/**
 * POST /api/stock-reservations en Seller App
 * Reserva el stock antes de procesar el pago.
 * Si SELLER_APP_URL no está configurada, se omite (modo desarrollo).
 */
async function reservarStock(params: {
  buyer_id: number
  seller_id: number
  items: { product_id: number; cantidad: number }[]
}): Promise<{ ok: boolean; reservation_id?: string; error?: string }> {
  if (!SELLER_APP_URL) {
    // Modo desarrollo: sin Seller App disponible, se omite la reserva
    console.warn('[orders] SELLER_APP_URL no configurada, omitiendo reserva de stock')
    return { ok: true, reservation_id: 'dev_mock' }
  }

  try {
    const res = await fetch(`${SELLER_APP_URL}/api/stock-reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_API_KEY}`
      },
      body: JSON.stringify({
        buyer_id: params.buyer_id,
        seller_id: params.seller_id,
        items: params.items.map(i => ({
          product_id: i.product_id,
          quantity: i.cantidad
        }))
      }),
      signal: AbortSignal.timeout(8000)
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      // 409 = sin stock, 404 = producto inexistente, etc.
      return {
        ok: false,
        error: data?.message ?? data?.error ?? 'Producto no disponible'
      }
    }

    const data = await res.json()
    return { ok: true, reservation_id: data.reservation_id }
  } catch (err: any) {
    if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
      return { ok: false, error: 'El servicio de stock no respondió. Intentá de nuevo.' }
    }
    return { ok: false, error: 'No se pudo verificar el stock. Intentá de nuevo.' }
  }
}

/**
 * POST /api/payments en Payments App
 * Inicia el procesamiento del pago.
 * Retorna:
 *   - { ok: true, payment_id } si Payments App respondió
 *   - { ok: false, timeout: true } si no respondió (orden queda pendiente)
 *   - { ok: false, error } si hubo un error claro
 */
async function iniciarPago(params: {
  order_id: number
  buyer_id: number
  seller_id: number
  total: number
  reservation_id: string
}): Promise<{ ok: boolean; timeout?: boolean; payment_id?: number; error?: string }> {
  if (!PAYMENTS_APP_URL) {
    // Modo desarrollo: sin Payments App disponible, simulamos aprobación
    console.warn('[orders] PAYMENTS_APP_URL no configurada, simulando pago aprobado')
    return { ok: true, payment_id: -1 }
  }

  try {
    const res = await fetch(`${PAYMENTS_APP_URL}/api/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_API_KEY}`
      },
      body: JSON.stringify({
        order_id: params.order_id,
        buyer_id: params.buyer_id,
        seller_id: params.seller_id,
        amount: params.total,
        currency: 'ARS',
        reservation_id: params.reservation_id
      }),
      signal: AbortSignal.timeout(10000)
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return { ok: false, error: data?.error ?? 'Error al procesar el pago' }
    }

    const data = await res.json()
    return { ok: true, payment_id: data.payment_id }
  } catch (err: any) {
    if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
      // Payments App no respondió — la orden queda pendiente
      // El callback /api/approved-payment o /api/rejected-payment llegará después
      return { ok: false, timeout: true }
    }
    return { ok: false, error: 'No se pudo conectar con el servicio de pagos. Intentá de nuevo.' }
  }
}

// ── POST /api/orders ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { buyer_id, cart_id } = body

  if (!buyer_id || !cart_id) {
    return NextResponse.json(
      { error: 'buyer_id y cart_id son requeridos' },
      { status: 400 }
    )
  }

  // ── 1. Validar buyer y dirección ──────────────────────────────────────────
  const buyer = await prisma.buyer.findUnique({
    where: { id: Number(buyer_id) }
  })

  if (!buyer) {
    return NextResponse.json({ error: 'Comprador no encontrado' }, { status: 404 })
  }

  if (!buyer.direccion?.trim()) {
    return NextResponse.json(
      { error: 'Necesitás completar tu dirección de entrega en tu perfil antes de realizar una compra.' },
      { status: 403 }
    )
  }

  // ── 2. Validar carrito ────────────────────────────────────────────────────
  const cart = await prisma.cart.findUnique({
    where: { id: Number(cart_id) },
    include: { items: true }
  })

  if (!cart) {
    return NextResponse.json({ error: 'Carrito no encontrado' }, { status: 404 })
  }

  if (cart.items.length === 0) {
    return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
  }

  if (cart.buyer_id !== Number(buyer_id)) {
    return NextResponse.json({ error: 'El carrito no pertenece a este comprador' }, { status: 403 })
  }

  if (!cart.seller_id) {
    return NextResponse.json({ error: 'El carrito no tiene vendedor asignado' }, { status: 400 })
  }

  // ── 3. Reservar stock en Seller App ───────────────────────────────────────
  const reserva = await reservarStock({
    buyer_id: Number(buyer_id),
    seller_id: cart.seller_id,
    items: cart.items.map(i => ({ product_id: i.product_id, cantidad: i.cantidad }))
  })

  if (!reserva.ok) {
    // No se crea la orden si no hay stock
    return NextResponse.json(
      { error: reserva.error ?? 'No se pudo reservar el stock. Intentá de nuevo.' },
      { status: 409 }
    )
  }

  // ── 4. Obtener snapshots de productos ─────────────────────────────────────
  const itemsConSnapshot = await Promise.all(
    cart.items.map(async (item) => {
      const producto = await getProductoById(item.product_id)
      return {
        product_id: item.product_id,
        product_name_snapshot: producto?.nombre ?? `Producto #${item.product_id}`,
        unit_price_snapshot: item.precio_unitario,
        cantidad: item.cantidad
      }
    })
  )

  const total = cart.items.reduce((acc, item) => {
    return acc + Number(item.precio_unitario) * item.cantidad
  }, 0)

  // ── 5. Crear ORDER en estado pendiente ────────────────────────────────────
  const order = await prisma.order.create({
    data: {
      buyer_id: Number(buyer_id),
      seller_id: cart.seller_id,
      total,
      estado: 'pendiente',
      items: { create: itemsConSnapshot }
    },
    include: { items: true }
  })

  // ── 6. Iniciar pago en Payments App ───────────────────────────────────────
  const pago = await iniciarPago({
    order_id: order.id,
    buyer_id: Number(buyer_id),
    seller_id: cart.seller_id,
    total,
    reservation_id: reserva.reservation_id!
  })

  // Payments App no respondió — orden queda pendiente, redirigir a /pedidos
  if (!pago.ok && pago.timeout) {
    await prisma.cartItem.deleteMany({ where: { cart_id: cart.id } })
    await prisma.cart.update({
      where: { id: cart.id },
      data: { estado: 'checked_out' }
    })

    return NextResponse.json(
      {
        pending: true,
        order_id: order.id,
        message: 'Tu pago está siendo procesado. Podés ver el estado en Mis pedidos.'
      },
      { status: 202 }
    )
  }

  // Error claro de Payments App
  if (!pago.ok) {
    // La orden queda en pendiente para no perder el registro
    // El comprador puede reintentar desde /pedidos o el admin puede intervenir
    return NextResponse.json(
      { error: pago.error ?? 'Error al procesar el pago' },
      { status: 402 }
    )
  }

  // ── 7. Modo desarrollo: PAYMENTS_APP_URL no configurada ───────────────────
  // payment_id === -1 indica mock local, confirmamos directamente
  if (pago.payment_id === -1) {
    await prisma.order.update({
      where: { id: order.id },
      data: { estado: 'confirmada' }
    })

    await prisma.cartItem.deleteMany({ where: { cart_id: cart.id } })
    await prisma.cart.update({
      where: { id: cart.id },
      data: { estado: 'checked_out' }
    })

    return NextResponse.json({ success: true, order_id: order.id }, { status: 201 })
  }

  // ── 8. Payments App respondió: vaciar carrito y esperar callback ──────────
  // La orden queda en `pendiente` hasta que llegue POST /api/approved-payment
  // o POST /api/rejected-payment desde Payments App
  await prisma.cartItem.deleteMany({ where: { cart_id: cart.id } })
  await prisma.cart.update({
    where: { id: cart.id },
    data: { estado: 'checked_out' }
  })

  return NextResponse.json(
    {
      pending: true,
      order_id: order.id,
      message: 'Tu pago está siendo procesado. Podés ver el estado en Mis pedidos.'
    },
    { status: 202 }
  )
}

// ── GET /api/orders — expuesto para Payments App ──────────────────────────────

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
  if (apiKey !== process.env.BUYER_SERVICE_API_KEY) {
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