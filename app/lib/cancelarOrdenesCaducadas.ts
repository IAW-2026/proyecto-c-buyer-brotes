import { prisma } from './prisma'

export async function cancelarOrdenesCaducadas(buyerId: number) {
  const unaHoraAtras = new Date(Date.now() - 60 * 60 * 1000)

  await prisma.order.updateMany({
    where: {
      buyer_id: buyerId,
      estado: 'pendiente',
      created_at: { lt: unaHoraAtras }
    },
    data: { estado: 'caducada' }
  })
}