import { prisma } from './prisma'

export async function cancelarOrdenesCaducadas(buyerId: number) {
  const diezMinutosAtras = new Date(Date.now() - 10 * 60 * 1000)

  await prisma.order.updateMany({
    where: {
      buyer_id: buyerId,
      estado: 'pendiente',
      created_at: { lt: diezMinutosAtras }
    },
    data: { estado: 'caducada' }
  })
}