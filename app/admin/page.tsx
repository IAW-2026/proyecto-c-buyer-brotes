import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '../lib/prisma'
import AdminPanel from './AdminPanel'

export default async function AdminPage() {
  const { sessionClaims } = await auth()
  const roles = (sessionClaims?.metadata as any) ?? []
  const esAdmin = Array.isArray(roles) ? roles.includes('admin') : roles === 'admin'

  if (!esAdmin) redirect('/')

  const buyers = await prisma.buyer.findMany({
    include: { orders: true },
    orderBy: { id: 'desc' }
  })

  return <AdminPanel buyersIniciales={buyers} />
}