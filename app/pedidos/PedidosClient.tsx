'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock3, CheckCircle2, Package, ArrowRight, XCircle, Truck, Wrench } from 'lucide-react'

type OrderItem = {
  id: number
  product_name_snapshot: string
  unit_price_snapshot: number
  cantidad: number
}

type Order = {
  id: number
  seller_id: number
  total: number
  estado: string
  created_at: string
  items: OrderItem[]
  sellerNombre: string
}

type Props = {
  orders: Order[]
  totalOrdenes: number
}

function formatPrice(value: number) {
  return `$${value.toLocaleString('es-AR')}`
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

const ESTADOS = [
  { value: 'todos', label: 'Todos', icon: Package },
  { value: 'pendiente', label: 'Pendiente', icon: Clock3 },
  { value: 'confirmada', label: 'Confirmada', icon: CheckCircle2 },
  { value: 'en_preparacion', label: 'En preparación', icon: Wrench },
  { value: 'listo', label: 'Listo', icon: Truck },
  { value: 'entregada', label: 'Entregada', icon: CheckCircle2 },
  { value: 'caducada', label: 'Caducada', icon: XCircle },
]

const estadoColor: Record<string, { bg: string; text: string; border: string; iconColor: string }> = {
  pendiente:      { bg: '#FFF8E5', text: '#92600A', border: '#F4C842', iconColor: '#E0A85F' },
  confirmada:     { bg: '#EAF3E6', text: '#2E5E1E', border: '#7BA05D', iconColor: '#7BA05D' },
  en_preparacion: { bg: '#E8F0FF', text: '#1E3A8A', border: '#6B8FD4', iconColor: '#5F9BE0' },
  listo:          { bg: '#F3EEFF', text: '#4C1D95', border: '#A78BFA', iconColor: '#9B7BE0' },
  entregada:      { bg: '#EAF3E6', text: '#243B27', border: '#4C6B3D', iconColor: '#4C6B3D' },
  caducada:       { bg: '#F5F5F5', text: '#555', border: '#D9D9D4', iconColor: '#B9B9B0' },
}

const estadoIcono: Record<string, React.ElementType> = {
  pendiente:      Clock3,
  confirmada:     CheckCircle2,
  en_preparacion: Wrench,
  listo:          Truck,
  entregada:      CheckCircle2,
  caducada:       XCircle,
}

export default function PedidosClient({ orders, totalOrdenes }: Props) {
  const [filtroActivo, setFiltroActivo] = useState('todos')

  const pedidosFiltrados = filtroActivo === 'todos'
    ? orders
    : orders.filter(o => o.estado === filtroActivo)

  // Conteo por estado para mostrar en los chips
  const conteoEstados = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.estado] = (acc[o.estado] ?? 0) + 1
    return acc
  }, {})

  // Solo mostrar chips de estados que tienen al menos 1 pedido, más "Todos"
  const estadosDisponibles = ESTADOS.filter(
    e => e.value === 'todos' || conteoEstados[e.value]
  )

  return (
    <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm mb-2" style={{ color: '#7BA05D' }}>Mis pedidos</p>
          <h1 className="text-4xl font-bold" style={{ color: '#243B27' }}>
            Seguimiento y historial
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF3E6] px-4 py-2 text-sm font-semibold text-[#4C6B3D]">
          <Package size={18} />
          {totalOrdenes} pedido{totalOrdenes === 1 ? '' : 's'} registrados
        </div>
      </div>

      {totalOrdenes === 0 ? (
        <div className="rounded-[2rem] border border-[#EAF3E6] bg-white p-10 text-center shadow-sm">
          <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: '#7BA05D' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#243B27' }}>Todavía no tenés pedidos</h2>
          <p className="text-sm text-[#4C6B3D] mb-6">Cuando completes una compra, tus pedidos aparecerán aquí.</p>
          <Link href="/explorar" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4C6B3D] px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110">
            Explorar plantas <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">

          {/* Chips de filtro */}
          <div className="flex flex-wrap gap-2">
            {estadosDisponibles.map(({ value, label, icon: Icon }) => {
              const activo = filtroActivo === value
              const conteo = value === 'todos' ? totalOrdenes : (conteoEstados[value] ?? 0)
              const colores = value !== 'todos' ? estadoColor[value] : null

              return (
                <button
                  key={value}
                  onClick={() => setFiltroActivo(value)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-2"
                  style={
                    activo
                      ? {
                          backgroundColor: colores?.bg ?? '#EAF3E6',
                          color: colores?.text ?? '#243B27',
                          borderColor: colores?.border ?? '#4C6B3D',
                        }
                      : {
                          backgroundColor: 'white',
                          color: '#7BA05D',
                          borderColor: '#EAF3E6',
                        }
                  }
                >
                  <Icon size={14} />
                  {label}
                  <span
                    className="rounded-full px-1.5 py-0.5 text-xs font-bold"
                    style={
                      activo
                        ? { backgroundColor: colores?.border ?? '#4C6B3D', color: 'white' }
                        : { backgroundColor: '#EAF3E6', color: '#4C6B3D' }
                    }
                  >
                    {conteo}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Resultados */}
          {pedidosFiltrados.length === 0 ? (
            <div className="rounded-[2rem] border border-[#EAF3E6] bg-white p-10 text-center shadow-sm">
              <Package size={40} className="mx-auto mb-3" style={{ color: '#B9B9B0' }} />
              <p className="text-lg font-semibold" style={{ color: '#243B27' }}>
                No hay pedidos con estado "{ESTADOS.find(e => e.value === filtroActivo)?.label}"
              </p>
              <button
                onClick={() => setFiltroActivo('todos')}
                className="mt-4 text-sm underline"
                style={{ color: '#7BA05D' }}
              >
                Ver todos los pedidos
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {pedidosFiltrados.map(order => {
                const colores = estadoColor[order.estado] ?? estadoColor['caducada']
                const IconoEstado = estadoIcono[order.estado] ?? Package

                return (
                  <article
                    key={order.id}
                    className="rounded-3xl border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                    style={{ borderColor: '#EAF3E6' }}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
                      <div>
                        <p className="text-sm text-[#4C6B3D]">Pedido #{order.id}</p>
                        <h3 className="text-xl font-bold" style={{ color: '#243B27' }}>
                          {order.sellerNombre}
                        </h3>
                        <p className="text-sm text-[#7BA05D]">Creado el {formatDate(order.created_at)}</p>
                      </div>

                      {/* Badge de estado */}
                      <div
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border"
                        style={{
                          backgroundColor: colores.bg,
                          color: colores.text,
                          borderColor: colores.border,
                        }}
                      >
                        <IconoEstado size={15} style={{ color: colores.iconColor }} />
                        {ESTADOS.find(e => e.value === order.estado)?.label ?? order.estado}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="grid gap-3 mb-5">
                      {order.items.map(item => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-[#EAF3E6] bg-[#FAFDF8] p-4"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold text-[#243B27]">{item.product_name_snapshot}</p>
                              <p className="text-sm text-[#7BA05D]">Cantidad: {item.cantidad}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-[#4C6B3D]">Precio unitario</p>
                              <p className="text-base font-semibold" style={{ color: '#243B27' }}>
                                {formatPrice(item.unit_price_snapshot)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between border-t border-[#EAF3E6] pt-4">
                      <p className="text-sm text-[#4C6B3D]">Total</p>
                      <p className="text-2xl font-bold" style={{ color: '#243B27' }}>
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      )}
    </section>
  )
}