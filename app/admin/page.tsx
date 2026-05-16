import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '../lib/prisma'
import AdminPanel from './AdminPanel'

export default async function AdminPage() {
  const { sessionClaims } = await auth()
  const roles = (sessionClaims?.metadata as any) ?? []
  const esAdmin = Array.isArray(roles) ? roles.includes('admin') : roles === 'admin'

  if (!esAdmin) redirect('/')

  const buyersRaw = await prisma.buyer.findMany({
    include: { orders: true },
    orderBy: { id: 'desc' }
  })

  // Convertir Decimal a number para poder pasarlo al Client Component
  const buyers = buyersRaw.map(buyer => ({
    ...buyer,
    created_at: buyer.created_at.toISOString(),
    deleted_at: buyer.deleted_at?.toISOString() ?? null,
    orders: buyer.orders.map(order => ({
      ...order,
      total: Number(order.total),
      created_at: order.created_at.toISOString()
    }))
  }))

  return <AdminPanel buyersIniciales={buyers} />
}