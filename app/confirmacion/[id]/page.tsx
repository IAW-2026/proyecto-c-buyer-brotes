import { prisma } from '../../lib/prisma'
import { getVendedorById } from '../../lib/api'
import Link from 'next/link'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ConfirmacionPage({ params }: Props) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { items: true }
  })

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F2EA' }}>
        <p style={{ color: '#243B27' }}>Orden no encontrada</p>
      </main>
    )
  }

  const vendedor = await getVendedorById(order.seller_id)

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-4 sm:px-8 py-16 max-w-2xl mx-auto">

        {/* Icono de éxito */}
        <div className="text-center mb-10">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: '#EAF3E6' }}
          >
            <CheckCircle2 size={48} style={{ color: '#4C6B3D' }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#243B27' }}>
            ¡Compra confirmada!
          </h1>
          <p className="text-lg" style={{ color: '#4C6B3D' }}>
            Tu pedido #{order.id} fue registrado exitosamente
          </p>
        </div>

        {/* Detalle de la orden */}
        <div className="rounded-3xl border border-[#EAF3E6] bg-white p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#EAF3E6]">
            <Package size={20} style={{ color: '#4C6B3D' }} />
            <div>
              <p className="font-semibold" style={{ color: '#243B27' }}>
                {vendedor?.nombre ?? `Vendedor #${order.seller_id}`}
              </p>
              <p className="text-sm" style={{ color: '#7BA05D' }}>
                📍 {vendedor?.ubicacion}
              </p>
            </div>
          </div>

          <div className="grid gap-3 mb-6">
            {order.items.map(item => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b border-[#EAF3E6] last:border-0"
              >
                <div>
                  <p className="font-medium text-sm" style={{ color: '#243B27' }}>
                    {item.product_name_snapshot}
                  </p>
                  <p className="text-xs" style={{ color: '#7BA05D' }}>
                    Cantidad: {item.cantidad}
                  </p>
                </div>
                <p className="font-semibold text-sm" style={{ color: '#4C6B3D' }}>
                  ${(Number(item.unit_price_snapshot) * item.cantidad).toLocaleString('es-AR')}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="font-bold" style={{ color: '#243B27' }}>Total pagado</span>
            <span className="text-2xl font-bold" style={{ color: '#4C6B3D' }}>
              ${Number(order.total).toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="grid gap-3">
          <Link
            href="/pedidos"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: '#4C6B3D' }}
          >
            Ver mis pedidos <ArrowRight size={18} />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center w-full py-3 rounded-full font-semibold border-2 transition-all hover:bg-[#EAF3E6]"
            style={{ borderColor: '#4C6B3D', color: '#4C6B3D' }}
          >
            Seguir comprando
          </Link>
        </div>

      </section>
    </main>
  )
}