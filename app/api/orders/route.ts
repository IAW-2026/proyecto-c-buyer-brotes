import { prisma } from '../../lib/prisma'
import { vendedores } from '../../lib/mock-data'
import { NextRequest, NextResponse } from 'next/server'

const PAYMENTS_APP_URL = process.env.PAYMENTS_APP_URL
const SELLER_APP_URL = process.env.SELLER_APP_URL
const SERVICE_API_KEY = process.env.BUYER_SERVICE_API_KEY

// ── Helpers ───────────────────────────────────────────────────────────────────

function getProductName(product_id: number): string | null {
  return vendedores
    .flatMap(v => v.productos)
    .find(p => p.id === product_id)?.nombre ?? null
}

// ── GET /api/orders?buyer_id=X ────────────────────────────────────────────────
// Usado por Payments App para consultar órdenes de un buyer

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
  if (apiKey !== SERVICE_API_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const buyer_id = request.nextUrl.searchParams.get('buyer_id')
  if (!buyer_id || isNaN(Number(buyer_id))) {
    return NextResponse.json({ error: 'buyer_id es requerido y debe ser un número' }, { status: 400 })
  }

  const orders = await prisma.order.findMany({
    where: { buyer_id: Number(buyer_id) },
    include: { items: true },
    orderBy: { created_at: 'desc' }
  })

  return NextResponse.json(orders)
}

// ── POST /api/orders ──────────────────────────────────────────────────────────
// Convierte un carrito activo en una orden y dispara el pago

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)

  if (!body) {
    return NextResponse.json({ error: 'El cuerpo de la request es inválido' }, { status: 400 })
  }

  const { buyer_id, cart_id } = body

  if (!buyer_id || isNaN(Number(buyer_id))) {
    return NextResponse.json({ error: 'buyer_id es requerido y debe ser un número' }, { status: 400 })
  }
  if (!cart_id || isNaN(Number(cart_id))) {
    return NextResponse.json({ error: 'cart_id es requerido y debe ser un número' }, { status: 400 })
  }

  // ── Validar estado del buyer ──────────────────────────────────────────────
  const buyer = await prisma.buyer.findUnique({ where: { id: Number(buyer_id) } })

  if (!buyer) {
    return NextResponse.json({ error: 'Comprador no encontrado' }, { status: 404 })
  }
  if (buyer.estado === 'eliminado') {
    return NextResponse.json(
      { error: 'Tu cuenta fue eliminada. No podés realizar compras.' },
      { status: 403 }
    )
  }
  if (buyer.estado === 'suspendido') {
    return NextResponse.json(
      { error: 'Tu cuenta está suspendida. Contactá al soporte para reactivarla.' },
      { status: 403 }
    )
  }
  if (!buyer.direccion?.trim()) {
    return NextResponse.json(
      { error: 'Necesitás una dirección de entrega para realizar la compra.' },
      { status: 400 }
    )
  }

  // ── Obtener el carrito activo ─────────────────────────────────────────────
  const cart = await prisma.cart.findFirst({
    where: {
      id: Number(cart_id),
      buyer_id: Number(buyer_id),
      estado: 'active'
    },
    include: { items: true }
  })

  if (!cart) {
    return NextResponse.json(
      { error: 'Carrito no encontrado o ya procesado' },
      { status: 404 }
    )
  }
  if (cart.items.length === 0) {
    return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
  }
  if (!cart.seller_id) {
    return NextResponse.json(
      { error: 'El carrito no tiene un vendedor asociado' },
      { status: 400 }
    )
  }

  // ── Reservar stock en Seller App ──────────────────────────────────────────
  if (SELLER_APP_URL) {
    try {
      const stockRes = await fetch(`${SELLER_APP_URL}/api/stock-reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_API_KEY}`
        },
        body: JSON.stringify({
          buyer_id: Number(buyer_id),
          buyer_order_id: null,
          items: cart.items.map(item => ({
            product_id: item.product_id,
            quantity: item.cantidad
          }))
        })
      })

      if (!stockRes.ok) {
        const errData = await stockRes.json().catch(() => ({}))
        console.error('[orders] Stock reservation failed:', stockRes.status, errData)
        return NextResponse.json(
          { error: errData.error ?? 'No hay stock disponible para uno o más productos' },
          { status: 409 }
        )
      }
    } catch (err) {
      // Seller App no disponible — modo desarrollo, continuamos sin reserva
      console.warn('[orders] Seller App no disponible para stock-reservations, continuando sin reserva')
    }
  }

  // ── Calcular total y preparar items con snapshot ──────────────────────────
  const total = cart.items.reduce(
    (sum, item) => sum + Number(item.precio_unitario) * item.cantidad,
    0
  )

  const orderItemsData = cart.items.map(item => ({
    product_id: item.product_id,
    product_name_snapshot: getProductName(item.product_id) ?? `Producto #${item.product_id}`,
    unit_price_snapshot: Number(item.precio_unitario),
    cantidad: item.cantidad
  }))

  // ── Crear la Order en estado pendiente ────────────────────────────────────
  const order = await prisma.order.create({
    data: {
      buyer_id: Number(buyer_id),
      seller_id: cart.seller_id,
      total,
      estado: 'pendiente',
      items: { create: orderItemsData }
    },
    include: { items: true }
  })

  // ── Limpiar el carrito: borrar items y marcarlo como checked_out ──────────
  await prisma.cartItem.deleteMany({ where: { cart_id: cart.id } })
  await prisma.cart.update({
    where: { id: cart.id },
    data: {
      estado: 'checked_out',
      seller_id: null
    }
  })

  // ── Intentar llamar a Payments App ────────────────────────────────────────
  if (PAYMENTS_APP_URL) {
    try {
      const paymentRes = await fetch(`${PAYMENTS_APP_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_API_KEY}`
        },
        body: JSON.stringify({
          order_id: order.id,
          buyer_id: Number(buyer_id),
          seller_id: cart.seller_id,
          amount: total,
          currency: 'ARS',
          buyer_email: buyer.email
        })
      })

      if (paymentRes.ok) {
        const paymentData = await paymentRes.json()
        console.log('[orders] Payments response:', JSON.stringify(paymentData))

        if (paymentData.status === 'approved' && paymentData.payment_id) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              estado: 'confirmada',
              payment_id: Number(paymentData.payment_id)
            }
          })
          return NextResponse.json(
            { success: true, order_id: order.id, payment_id: paymentData.payment_id },
            { status: 201 }
          )
        }

        // Pago pendiente: si Payments App nos manda el init_point de Mercado Pago,
        // lo reenviamos al frontend para que redirija al usuario al checkout de MP.
        return NextResponse.json(
          {
            pending: true,
            order_id: order.id,
            mp_init_point: paymentData.mp_init_point ?? null
          },
          { status: 201 }
        )
      }

      console.error('[orders] Payments App error:', paymentRes.status)
      return NextResponse.json({ pending: true, order_id: order.id }, { status: 201 })

    } catch (err) {
      console.error('[orders] Payments App no disponible:', err)
      return NextResponse.json({ pending: true, order_id: order.id }, { status: 201 })
    }
  }

  // ── Sin Payments App: mock de pago aprobado (dev/testing) ─────────────────
  await prisma.order.update({
    where: { id: order.id },
    data: {
      estado: 'confirmada',
      payment_id: Math.floor(Math.random() * 90000) + 10000
    }
  })

  return NextResponse.json({ success: true, order_id: order.id }, { status: 201 })
}