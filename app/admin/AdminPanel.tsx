'use client'

import { useState } from 'react'
import { Search, Trash2, PauseCircle, PlayCircle, ChevronDown, ChevronUp } from 'lucide-react'

type Order = {
  id: number
  total: any
  estado: string
  created_at: Date
}

type Buyer = {
  id: number
  nombre: string
  email: string
  estado: string
  created_at: Date
  deleted_at: Date | null
  delete_reason: string | null
  orders: Order[]
}

type Props = {
  buyersIniciales: Buyer[]
}

export default function AdminPanel({ buyersIniciales }: Props) {
  const [buyers, setBuyers] = useState<Buyer[]>(buyersIniciales)
  const [query, setQuery] = useState('')
  const [expandido, setExpandido] = useState<number | null>(null)
  const [motivoEliminar, setMotivoEliminar] = useState<Record<number, string>>({})
  const [vistaEliminados, setVistaEliminados] = useState(false)
  const [cargando, setCargando] = useState<number | null>(null)

  const buyersFiltrados = buyers.filter(b => {
    const q = query.toLowerCase()
    const coincide = b.nombre.toLowerCase().includes(q) || b.email.toLowerCase().includes(q)
    if (vistaEliminados) return b.estado === 'eliminado' && coincide
    return b.estado !== 'eliminado' && coincide
  })

  const ejecutarAccion = async (id: number, accion: string, motivo?: string) => {
    setCargando(id)
    try {
      const res = await fetch(`/api/admin/buyers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion, motivo })
      })
      const data = await res.json()
      if (res.ok) {
        setBuyers(prev => prev.map(b => b.id === id ? {
          ...b,
          estado: data.estado,
          deleted_at: accion === 'eliminar' ? new Date() : b.deleted_at,
          delete_reason: motivo ?? b.delete_reason
        } : b))
      } else {
        alert(data.error)
      }
    } catch {
      alert('Error de conexión')
    } finally {
      setCargando(null)
    }
  }

  const formatDate = (date: Date) => new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  const estadoColor: Record<string, string> = {
    activo: '#7BA05D',
    suspendido: '#E07A5F',
    eliminado: '#B9B9B0'
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest font-semibold" style={{ color: '#7BA05D' }}>
              Panel de administración
            </p>
            <h1 className="text-4xl font-bold" style={{ color: '#243B27' }}>
              Gestión de usuarios
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setVistaEliminados(false)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                backgroundColor: !vistaEliminados ? '#4C6B3D' : '#EAF3E6',
                color: !vistaEliminados ? 'white' : '#4C6B3D'
              }}
            >
              Activos / Suspendidos
            </button>
            <button
              onClick={() => setVistaEliminados(true)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                backgroundColor: vistaEliminados ? '#4C6B3D' : '#EAF3E6',
                color: vistaEliminados ? 'white' : '#4C6B3D'
              }}
            >
              Eliminados
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-3.5" style={{ color: '#7BA05D' }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full pl-11 pr-6 py-3 rounded-full border-2 outline-none"
            style={{ borderColor: '#7BA05D', backgroundColor: 'white', color: '#243B27' }}
          />
        </div>

        {/* Lista de buyers */}
        <div className="grid gap-4">
          {buyersFiltrados.length === 0 ? (
            <div className="text-center py-20 rounded-3xl bg-white border border-[#EAF3E6]">
              <p style={{ color: '#4C6B3D' }}>No se encontraron usuarios</p>
            </div>
          ) : (
            buyersFiltrados.map(buyer => (
              <div
                key={buyer.id}
                className="rounded-3xl border border-[#EAF3E6] bg-white shadow-sm overflow-hidden"
              >
                {/* Header del buyer */}
                <div className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                      style={{ backgroundColor: '#4C6B3D' }}
                    >
                      {buyer.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-lg" style={{ color: '#243B27' }}>{buyer.nombre}</p>
                      <p className="text-sm" style={{ color: '#7BA05D' }}>{buyer.email}</p>
                      <p className="text-xs mt-1" style={{ color: '#B9B9B0' }}>
                        Registrado el {formatDate(buyer.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: estadoColor[buyer.estado] ?? '#B9B9B0' }}
                    >
                      {buyer.estado}
                    </span>

                    <span className="text-sm" style={{ color: '#4C6B3D' }}>
                      {buyer.orders.length} compra{buyer.orders.length !== 1 ? 's' : ''}
                    </span>

                    <button
                      onClick={() => setExpandido(expandido === buyer.id ? null : buyer.id)}
                      className="p-2 rounded-full hover:bg-[#EAF3E6] transition-all"
                    >
                      {expandido === buyer.id
                        ? <ChevronUp size={18} style={{ color: '#4C6B3D' }} />
                        : <ChevronDown size={18} style={{ color: '#4C6B3D' }} />}
                    </button>
                  </div>
                </div>

                {/* Detalle expandido */}
                {expandido === buyer.id && (
                  <div className="px-6 pb-6 border-t border-[#EAF3E6] pt-4">

                    {/* Historial de compras */}
                    {buyer.orders.length > 0 && (
                      <div className="mb-6">
                        <p className="text-sm font-semibold mb-3" style={{ color: '#243B27' }}>
                          Historial de compras
                        </p>
                        <div className="grid gap-2">
                          {buyer.orders.map(order => (
                            <div
                              key={order.id}
                              className="flex justify-between items-center px-4 py-2 rounded-xl"
                              style={{ backgroundColor: '#F5F2EA' }}
                            >
                              <span className="text-sm" style={{ color: '#243B27' }}>
                                Pedido #{order.id}
                              </span>
                              <span className="text-sm" style={{ color: '#7BA05D' }}>
                                {formatDate(order.created_at)}
                              </span>
                              <span className="text-sm font-semibold" style={{ color: '#4C6B3D' }}>
                                ${Number(order.total).toLocaleString('es-AR')}
                              </span>
                              <span
                                className="text-xs px-2 py-1 rounded-full"
                                style={{ backgroundColor: '#EAF3E6', color: '#4C6B3D' }}
                              >
                                {order.estado}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Info eliminado */}
                    {buyer.estado === 'eliminado' && buyer.delete_reason && (
                      <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: '#FFF5F2' }}>
                        <p className="text-sm font-semibold mb-1" style={{ color: '#E07A5F' }}>
                          Motivo de eliminación
                        </p>
                        <p className="text-sm" style={{ color: '#243B27' }}>{buyer.delete_reason}</p>
                        {buyer.deleted_at && (
                          <p className="text-xs mt-1" style={{ color: '#B9B9B0' }}>
                            Eliminado el {formatDate(buyer.deleted_at)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Acciones */}
                    {buyer.estado !== 'eliminado' && (
                      <div className="flex flex-col gap-3">
                        {buyer.estado === 'activo' ? (
                          <button
                            onClick={() => ejecutarAccion(buyer.id, 'suspender')}
                            disabled={cargando === buyer.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all w-fit"
                            style={{ backgroundColor: '#FFF5F2', color: '#E07A5F', border: '1.5px solid #E07A5F' }}
                          >
                            <PauseCircle size={16} />
                            {cargando === buyer.id ? 'Procesando...' : 'Suspender cuenta'}
                          </button>
                        ) : (
                          <button
                            onClick={() => ejecutarAccion(buyer.id, 'reactivar')}
                            disabled={cargando === buyer.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all w-fit"
                            style={{ backgroundColor: '#EAF3E6', color: '#4C6B3D', border: '1.5px solid #4C6B3D' }}
                          >
                            <PlayCircle size={16} />
                            {cargando === buyer.id ? 'Procesando...' : 'Reactivar cuenta'}
                          </button>
                        )}

                        {/* Eliminar */}
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={motivoEliminar[buyer.id] ?? ''}
                            onChange={e => setMotivoEliminar(prev => ({ ...prev, [buyer.id]: e.target.value }))}
                            placeholder="Justificación para eliminar la cuenta..."
                            rows={2}
                            className="w-full px-4 py-2 rounded-xl border border-[#EAF3E6] outline-none text-sm resize-none"
                            style={{ color: '#243B27' }}
                          />
                          <button
                            onClick={() => {
                              if (!motivoEliminar[buyer.id]?.trim()) {
                                alert('Ingresá una justificación para eliminar la cuenta')
                                return
                              }
                              if (confirm(`¿Seguro que querés eliminar la cuenta de ${buyer.nombre}?`)) {
                                ejecutarAccion(buyer.id, 'eliminar', motivoEliminar[buyer.id])
                              }
                            }}
                            disabled={cargando === buyer.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all w-fit"
                            style={{ backgroundColor: '#E07A5F', color: 'white' }}
                          >
                            <Trash2 size={16} />
                            {cargando === buyer.id ? 'Procesando...' : 'Eliminar cuenta'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}