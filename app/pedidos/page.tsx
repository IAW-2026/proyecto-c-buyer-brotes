import { prisma } from '../lib/prisma'
import { vendedores } from '../lib/mock-data'
import Link from 'next/link'
import { Clock3, CheckCircle2, Package, ArrowRight } from 'lucide-react'

function formatPrice(value: number) {
  return `$${value.toLocaleString('es-AR')}`
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export default async function PedidosPage() {
  const orders = await prisma.order.findMany({
    where: { buyer_id: 1 },
    include: { items: true },
    orderBy: { created_at: 'desc' }
  })

  const pendingOrders = orders.filter(order => order.estado === 'pending')
  const historyOrders = orders.filter(order => order.estado !== 'pending')

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm mb-2" style={{ color: '#7BA05D' }}>
              Mis pedidos
            </p>
            <h1 className="text-4xl font-bold" style={{ color: '#243B27' }}>
              Seguimiento y historial de compra
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF3E6] px-4 py-2 text-sm font-semibold text-[#4C6B3D]">
            <Package size={18} />
            {orders.length} pedido{orders.length === 1 ? '' : 's'} registrados
          </div>
        </div>

        {pendingOrders.length === 0 && historyOrders.length === 0 ? (
          <div className="rounded-[2rem] border border-[#EAF3E6] bg-white p-10 text-center shadow-sm">
            <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: '#7BA05D' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#243B27' }}>
              Todavía no tenés pedidos
            </h2>
            <p className="text-sm text-[#4C6B3D] mb-6">
              Cuando completes una compra, tus pedidos aparecerán aquí con el estado y el historial.
            </p>
            <Link
              href="/explorar"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4C6B3D] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110"
            >
              Explorar plantas
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8">
            {pendingOrders.length > 0 && (
              <section className="rounded-[2rem] border border-[#EAF3E6] bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] font-semibold" style={{ color: '#7BA05D' }}>
                      Pedidos pendientes
                    </p>
                    <h2 className="text-2xl font-bold" style={{ color: '#243B27' }}>
                      Tus pedidos en curso
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#F0F9F1] px-4 py-2 text-sm font-semibold text-[#4C6B3D]">
                    {pendingOrders.length} pendiente{pendingOrders.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="grid gap-6">
                  {pendingOrders.map(order => {
                    const seller = vendedores.find(v => v.id === order.seller_id)
                    return (
                      <article key={order.id} className="rounded-3xl border border-[#EAF3E6] bg-[#FAFDF8] p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-[#4C6B3D]">Pedido #{order.id}</p>
                            <h3 className="text-xl font-bold" style={{ color: '#243B27' }}>
                              {seller?.nombre ?? `Vendedor ${order.seller_id}`}
                            </h3>
                            <p className="text-sm text-[#7BA05D]">Creado el {formatDate(order.created_at)}</p>
                          </div>
                          <div className="inline-flex items-center gap-3 rounded-full bg-[#EAF3E6] px-4 py-2 text-sm font-semibold text-[#4C6B3D]">
                            <Clock3 size={16} />
                            {order.estado === 'pending' ? 'Pendiente' : order.estado}
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4">
                          {order.items.map(item => (
                            <div key={item.id} className="rounded-3xl border border-[#EAF3E6] bg-white p-4 sm:p-5">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="font-semibold text-[#243B27]">{item.product_name_snapshot}</p>
                                  <p className="text-sm text-[#7BA05D]">Cantidad: {item.cantidad}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-[#4C6B3D]">Precio unitario</p>
                                  <p className="text-lg font-semibold" style={{ color: '#243B27' }}>
                                    {formatPrice(item.unit_price_snapshot.toNumber())}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm text-[#4C6B3D]">Total estimado</p>
                          <p className="text-2xl font-bold" style={{ color: '#243B27' }}>
                            {formatPrice(order.total.toNumber())}
                          </p>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            )}

            {historyOrders.length > 0 && (
              <section className="rounded-[2rem] border border-[#EAF3E6] bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] font-semibold" style={{ color: '#7BA05D' }}>
                      Historial de pedidos
                    </p>
                    <h2 className="text-2xl font-bold" style={{ color: '#243B27' }}>
                      Pedidos ya realizados
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#F7FFF2] px-4 py-2 text-sm font-semibold text-[#4C6B3D]">
                    {historyOrders.length} historial
                  </span>
                </div>

                <div className="grid gap-6">
                  {historyOrders.map(order => {
                    const seller = vendedores.find(v => v.id === order.seller_id)
                    return (
                      <article key={order.id} className="rounded-3xl border border-[#EAF3E6] bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-[#4C6B3D]">Pedido #{order.id}</p>
                            <h3 className="text-xl font-bold" style={{ color: '#243B27' }}>
                              {seller?.nombre ?? `Vendedor ${order.seller_id}`}
                            </h3>
                            <p className="text-sm text-[#7BA05D]">Completado el {formatDate(order.created_at)}</p>
                          </div>
                          <div className="inline-flex items-center gap-3 rounded-full bg-[#EAF3E6] px-4 py-2 text-sm font-semibold text-[#4C6B3D]">
                            <CheckCircle2 size={16} />
                            {order.estado}
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4">
                          {order.items.map(item => (
                            <div key={item.id} className="rounded-3xl border border-[#EAF3E6] bg-[#FAFDF8] p-4 sm:p-5">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="font-semibold text-[#243B27]">{item.product_name_snapshot}</p>
                                  <p className="text-sm text-[#7BA05D]">Cantidad: {item.cantidad}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-[#4C6B3D]">Precio unitario</p>
                                  <p className="text-lg font-semibold" style={{ color: '#243B27' }}>
                                    {formatPrice(item.unit_price_snapshot.toNumber())}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm text-[#4C6B3D]">Total</p>
                          <p className="text-2xl font-bold" style={{ color: '#243B27' }}>
                            {formatPrice(order.total.toNumber())}
                          </p>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
