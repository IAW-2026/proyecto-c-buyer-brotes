import { prisma } from './prisma'

export async function cancelarOrdenesCaducadas(buyerId: number) {
  const cincoMinutosAtras = new Date(Date.now() - 5 * 60 * 1000)

  await prisma.order.updateMany({
    where: {
      buyer_id: buyerId,
      estado: 'pendiente',
      created_at: { lt: cincoMinutosAtras }
    },
    data: { estado: 'caducada' }
  })
}