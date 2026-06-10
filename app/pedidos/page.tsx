import { prisma } from '../lib/prisma'
import { getBuyerFromClerk } from '../lib/auth'
import { vendedores } from '../lib/mock-data'
import Link from 'next/link'
import PedidosClient from './PedidosClient'



export default async function PedidosPage() {
  const buyer = await getBuyerFromClerk()

  if (!buyer) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F2EA' }}>
        <p style={{ color: '#243B27' }}>Tenés que iniciar sesión para ver tus pedidos</p>
      </main>
    )
  }

  const orders = await prisma.order.findMany({
    where: { buyer_id: buyer.id },
    include: { items: true },
    orderBy: { created_at: 'desc' },
  })
/*La serialización convierte los Decimal de Prisma a Number y los Date a strings ISO,
  porque los server components no pueden pasar tipos complejos directamente a client components.*/
  const ordersSerializadas = orders.map(order => {
    const seller = vendedores.find(v => v.id === order.seller_id)
    return {
      id: order.id,
      seller_id: order.seller_id,
      total: Number(order.total),
      estado: order.estado,
      created_at: order.created_at.toISOString(),
      sellerNombre: seller?.nombre ?? `Vendedor ${order.seller_id}`,
      items: order.items.map(item => ({
        id: item.id,
        product_name_snapshot: item.product_name_snapshot,
        unit_price_snapshot: Number(item.unit_price_snapshot),
        cantidad: item.cantidad,
      })),
    }
  })

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <PedidosClient
        orders={ordersSerializadas}
        totalOrdenes={ordersSerializadas.length}
      />
    </main>
  )
}