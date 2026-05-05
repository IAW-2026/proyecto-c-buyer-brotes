import { prisma } from '../../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/favorites?buyer_id=1 → trae todos los favoritos
export async function GET(request: NextRequest) {
  const buyer_id = request.nextUrl.searchParams.get('buyer_id')

  if (!buyer_id) {
    return NextResponse.json({ error: 'buyer_id requerido' }, { status: 400 })
  }

  const favorites = await prisma.favorite.findMany({
    where: { buyer_id: Number(buyer_id) }
  })

  return NextResponse.json(favorites)
}

// POST /api/favorites → agrega a favoritos
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { buyer_id, product_id, seller_id } = body

  const favorite = await prisma.favorite.create({
    data: {
      buyer_id: Number(buyer_id),
      product_id: Number(product_id),
      seller_id: Number(seller_id)
    }
  })

  return NextResponse.json(favorite, { status: 201 })
}

// DELETE /api/favorites?buyer_id=1&product_id=2 → elimina de favoritos
export async function DELETE(request: NextRequest) {
  const buyer_id = request.nextUrl.searchParams.get('buyer_id')
  const product_id = request.nextUrl.searchParams.get('product_id')

  if (!buyer_id || !product_id) {
    return NextResponse.json({ error: 'buyer_id y product_id requeridos' }, { status: 400 })
  }

  await prisma.favorite.deleteMany({
    where: {
      buyer_id: Number(buyer_id),
      product_id: Number(product_id)
    }
  })

  return NextResponse.json({ success: true })
}