import { prisma } from '../lib/prisma'
import { getBuyerFromClerk } from '../lib/auth'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, MapPin, Package, Heart, ShoppingCart, Edit } from 'lucide-react'

export default async function PerfilPage() {
  const buyer = await getBuyerFromClerk()

  if (!buyer) redirect('/sign-in')

  const clerkUser = await currentUser()

  const [totalPedidos, totalFavoritos, pedidosRecientes] = await Promise.all([
    prisma.order.count({ where: { buyer_id: buyer.id } }),
    prisma.favorite.count({ where: { buyer_id: buyer.id } }),
    prisma.order.findMany({
      where: { buyer_id: buyer.id },
      include: { items: true },
      orderBy: { id: 'desc' },
      take: 3
    })
  ])

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-4 sm:px-8 py-10 max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest font-semibold mb-1" style={{ color: '#7BA05D' }}>
            Mi cuenta
          </p>
          <h1 className="text-4xl font-bold" style={{ color: '#243B27' }}>
            Mi perfil
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">

          {/* Card de perfil */}
          <div className="rounded-3xl border border-[#EAF3E6] bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center text-center gap-4">

              {/* Avatar */}
              {clerkUser?.imageUrl ? (
                <img
                  src={clerkUser.imageUrl}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border-4"
                  style={{ borderColor: '#EAF3E6' }}
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                  style={{ backgroundColor: '#4C6B3D' }}
                >
                  {(buyer.nombre ?? '?').charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#243B27' }}>
                  {(buyer.nombre ?? 'Usuario')}
                </h2>
                <p className="text-sm mt-1" style={{ color: '#7BA05D' }}>
                  Comprador en Brotes
                </p>
              </div>

              {/* Info */}
              <div className="w-full grid gap-3 mt-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F5F2EA' }}>
                  <Mail size={16} style={{ color: '#7BA05D' }} />
                  <span className="text-sm" style={{ color: '#243B27' }}>{buyer.email}</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F5F2EA' }}>
                  <MapPin size={16} style={{ color: '#7BA05D' }} />
                  <span className="text-sm" style={{ color: buyer.direccion ? '#243B27' : '#B9B9B0' }}>
                    {buyer.direccion || 'Sin dirección cargada'}
                  </span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F5F2EA' }}>
                  <User size={16} style={{ color: '#7BA05D' }} />
                  <span className="text-sm" style={{ color: '#243B27' }}>
                    Miembro desde {new Date(buyer.created_at).toLocaleDateString('es-AR', {
                      month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Estado */}
              <span
                className="px-4 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: buyer.estado === 'activo' ? '#7BA05D' : '#E07A5F' }}
              >
                Cuenta {buyer.estado}
              </span>
            </div>
          </div>

          {/* Panel derecho */}
          <div className="flex flex-col gap-6">

            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-[#EAF3E6] bg-white p-6 shadow-sm text-center">
                <Package size={28} className="mx-auto mb-2" style={{ color: '#4C6B3D' }} />
                <p className="text-3xl font-bold" style={{ color: '#243B27' }}>{totalPedidos}</p>
                <p className="text-sm mt-1" style={{ color: '#7BA05D' }}>Pedidos realizados</p>
              </div>
              <div className="rounded-3xl border border-[#EAF3E6] bg-white p-6 shadow-sm text-center">
                <Heart size={28} className="mx-auto mb-2" style={{ color: '#E07A5F' }} />
                <p className="text-3xl font-bold" style={{ color: '#243B27' }}>{totalFavoritos}</p>
                <p className="text-sm mt-1" style={{ color: '#7BA05D' }}>Favoritos guardados</p>
              </div>
            </div>

            {/* Pedidos recientes */}
            <div className="rounded-3xl border border-[#EAF3E6] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold" style={{ color: '#243B27' }}>Pedidos recientes</h3>
                <Link href="/pedidos" className="text-sm underline" style={{ color: '#7BA05D' }}>
                  Ver todos
                </Link>
              </div>

              {pedidosRecientes.length === 0 ? (
                <div className="text-center py-6">
                  <ShoppingCart size={32} className="mx-auto mb-2" style={{ color: '#B9B9B0' }} />
                  <p className="text-sm" style={{ color: '#B9B9B0' }}>Todavía no realizaste compras</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {pedidosRecientes.map(order => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl"
                      style={{ backgroundColor: '#F5F2EA' }}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#243B27' }}>
                          Pedido #{order.id}
                        </p>
                        <p className="text-xs" style={{ color: '#7BA05D' }}>
                          {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: '#4C6B3D' }}>
                          ${Number(order.items.reduce((acc, i) =>
                            acc + Number(i.unit_price_snapshot) * i.cantidad, 0
                          )).toLocaleString('es-AR')}
                        </p>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#EAF3E6', color: '#4C6B3D' }}
                        >
                          {order.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accesos rápidos */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/favoritos"
                className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-[#EAF3E6] bg-white hover:border-[#7BA05D] transition-all"
              >
                <Heart size={20} style={{ color: '#E07A5F' }} />
                <span className="text-sm font-semibold" style={{ color: '#243B27' }}>Mis favoritos</span>
              </Link>
              <Link
                href="/pedidos"
                className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-[#EAF3E6] bg-white hover:border-[#7BA05D] transition-all"
              >
                <Package size={20} style={{ color: '#4C6B3D' }} />
                <span className="text-sm font-semibold" style={{ color: '#243B27' }}>Mis pedidos</span>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}