'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Search, Trash2, PauseCircle, PlayCircle,
  ChevronDown, ChevronUp, BarChart2, Users,
  ChevronLeft, ChevronRight
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type Order = {
  id: number
  total: number
  estado: string
  created_at: string
}

type Buyer = {
  id: number
  nombre: string | null
  email: string
  estado: string
  created_at: string
  deleted_at: string | null
  delete_reason: string | null
  orders: Order[]
}

type OrdenReporte = {
  id: number
  buyer_nombre: string
  buyer_email: string
  seller_id: number
  total: number
  estado: string
  items_count: number
  created_at: string
}

type EstadoCount = {
  estado: string
  _count: { estado: number }
}

type Reporte = {
  totalOrdenes: number
  ordenesPorEstado: EstadoCount[]
  ingresoTotal: number
  ordenesRecientes: OrdenReporte[]
}

type Props = {
  buyersIniciales: Buyer[]
  reporte: Reporte
  initialQuery: string
  initialTab: 'usuarios' | 'reporte'
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const USUARIOS_POR_PAGINA = 8
const ORDENES_POR_PAGINA = 10

const estadoColorBadge: Record<string, string> = {
  activo:     '#7BA05D',
  suspendido: '#E07A5F',
  eliminado:  '#B9B9B0'
}

const estadoOrdenColor: Record<string, string> = {
  pendiente:      '#E0A85F',
  confirmada:     '#7BA05D',
  en_preparacion: '#5F9BE0',
  listo:          '#9B7BE0',
  entregada:      '#4C6B3D',
  caducada:       '#B9B9B0'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

function formatMoney(value: number) {
  return `$${value.toLocaleString('es-AR')}`
}

// ── Componente de Paginación reutilizable ─────────────────────────────────────

function Paginacion({
  paginaActual,
  totalPaginas,
  onChange,
}: {
  paginaActual: number
  totalPaginas: number
  onChange: (pagina: number) => void
}) {
  if (totalPaginas <= 1) return null

  const inicio = Math.max(1, paginaActual - 2)
  const fin = Math.min(totalPaginas, inicio + 4)
  const paginas = Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)

  return (
    <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-[#EAF3E6]">
      <button
        onClick={() => onChange(paginaActual - 1)}
        disabled={paginaActual === 1}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all hover:bg-[#EAF3E6] disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ borderColor: '#7BA05D', color: '#7BA05D' }}
      >
        <ChevronLeft size={15} />
        Anterior
      </button>

      <div className="flex items-center gap-1">
        {inicio > 1 && (
          <>
            <button
              onClick={() => onChange(1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
              style={{ backgroundColor: 'white', color: '#4C6B3D', border: '2px solid #EAF3E6' }}
            >
              1
            </button>
            {inicio > 2 && (
              <span className="w-8 h-8 flex items-center justify-center text-sm" style={{ color: '#B9B9B0' }}>…</span>
            )}
          </>
        )}

        {paginas.map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
            style={{
              backgroundColor: num === paginaActual ? '#4C6B3D' : 'white',
              color: num === paginaActual ? 'white' : '#4C6B3D',
              border: '2px solid',
              borderColor: num === paginaActual ? '#4C6B3D' : '#EAF3E6',
            }}
          >
            {num}
          </button>
        ))}

        {fin < totalPaginas && (
          <>
            {fin < totalPaginas - 1 && (
              <span className="w-8 h-8 flex items-center justify-center text-sm" style={{ color: '#B9B9B0' }}>…</span>
            )}
            <button
              onClick={() => onChange(totalPaginas)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
              style={{ backgroundColor: 'white', color: '#4C6B3D', border: '2px solid #EAF3E6' }}
            >
              {totalPaginas}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onChange(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all hover:bg-[#EAF3E6] disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ borderColor: '#7BA05D', color: '#7BA05D' }}
      >
        Siguiente
        <ChevronRight size={15} />
      </button>
    </div>
  )
}

// ── Subcomponent: Reporte ─────────────────────────────────────────────────────

function ReporteVentas({ reporte }: { reporte: Reporte }) {
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [paginaOrdenes, setPaginaOrdenes] = useState(1)

  const ordenesFiltradas = filtroEstado === 'todos'
    ? reporte.ordenesRecientes
    : reporte.ordenesRecientes.filter(o => o.estado === filtroEstado)

  const totalPaginasOrdenes = Math.ceil(ordenesFiltradas.length / ORDENES_POR_PAGINA)
  const ordenesPagina = ordenesFiltradas.slice(
    (paginaOrdenes - 1) * ORDENES_POR_PAGINA,
    paginaOrdenes * ORDENES_POR_PAGINA
  )

  const estados = [
    'todos',
    ...Array.from(new Set(reporte.ordenesRecientes.map(o => o.estado)))
  ]

  // Resetear página cuando cambia el filtro
  const handleFiltroEstado = (estado: string) => {
    setFiltroEstado(estado)
    setPaginaOrdenes(1)
  }

  return (
    <div className="grid gap-6">

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-white border border-[#EAF3E6] p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#7BA05D' }}>
            Total de órdenes
          </p>
          <p className="text-4xl font-bold" style={{ color: '#243B27' }}>
            {reporte.totalOrdenes}
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-[#EAF3E6] p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#7BA05D' }}>
            Ingresos confirmados
          </p>
          <p className="text-4xl font-bold" style={{ color: '#243B27' }}>
            {formatMoney(reporte.ingresoTotal)}
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-[#EAF3E6] p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: '#7BA05D' }}>
            Órdenes por estado
          </p>
          <div className="flex flex-col gap-1.5">
            {reporte.ordenesPorEstado.map(e => (
              <div key={e.estado} className="flex items-center justify-between">
                <span
                  className="text-xs px-2 py-0.5 rounded-full text-white font-semibold"
                  style={{ backgroundColor: estadoOrdenColor[e.estado] ?? '#B9B9B0' }}
                >
                  {e.estado}
                </span>
                <span className="text-sm font-bold" style={{ color: '#243B27' }}>
                  {e._count.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtro por estado */}
      <div className="flex items-center gap-2 flex-wrap">
        {estados.map(e => (
          <button
            key={e}
            onClick={() => handleFiltroEstado(e)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              backgroundColor: filtroEstado === e ? '#4C6B3D' : '#EAF3E6',
              color: filtroEstado === e ? 'white' : '#4C6B3D'
            }}
          >
            {e}
          </button>
        ))}
      </div>

      {/* Tabla de órdenes */}
      <div className="rounded-3xl border border-[#EAF3E6] bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EAF3E6] flex items-center justify-between">
          <div>
            <h2 className="font-bold" style={{ color: '#243B27' }}>Órdenes recientes</h2>
            <p className="text-sm" style={{ color: '#7BA05D' }}>
              {ordenesFiltradas.length} orden{ordenesFiltradas.length !== 1 ? 'es' : ''}
              {filtroEstado !== 'todos' && ` con estado "${filtroEstado}"`}
            </p>
          </div>
          {totalPaginasOrdenes > 1 && (
            <span className="text-xs" style={{ color: '#B9B9B0' }}>
              Página {paginaOrdenes} de {totalPaginasOrdenes}
            </span>
          )}
        </div>

        {ordenesPagina.length === 0 ? (
          <div className="p-8 text-center" style={{ color: '#B9B9B0' }}>
            No hay órdenes para mostrar
          </div>
        ) : (
          <div className="divide-y divide-[#EAF3E6]">
            {ordenesPagina.map(orden => (
              <div
                key={orden.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
                    style={{ backgroundColor: '#4C6B3D' }}
                  >
                    #{orden.id}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#243B27' }}>
                      {orden.buyer_nombre}
                    </p>
                    <p className="text-xs" style={{ color: '#7BA05D' }}>{orden.buyer_email}</p>
                    <p className="text-xs" style={{ color: '#B9B9B0' }}>
                      {formatDate(orden.created_at)} · {orden.items_count} producto{orden.items_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full text-white font-semibold"
                    style={{ backgroundColor: estadoOrdenColor[orden.estado] ?? '#B9B9B0' }}
                  >
                    {orden.estado}
                  </span>
                  <span className="font-bold text-sm" style={{ color: '#243B27' }}>
                    {formatMoney(orden.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación dentro del card */}
        {totalPaginasOrdenes > 1 && (
          <div className="px-6 pb-6">
            <Paginacion
              paginaActual={paginaOrdenes}
              totalPaginas={totalPaginasOrdenes}
              onChange={setPaginaOrdenes}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminPanel({ buyersIniciales, reporte, initialQuery, initialTab }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const [tab, setTab] = useState<'usuarios' | 'reporte'>(initialTab)
  const [buyers, setBuyers] = useState<Buyer[]>(buyersIniciales)
  const [inputValue, setInputValue] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const [expandido, setExpandido] = useState<number | null>(null)
  const [motivoEliminar, setMotivoEliminar] = useState<Record<number, string>>({})
  const [vistaEliminados, setVistaEliminados] = useState(false)
  const [cargando, setCargando] = useState<number | null>(null)
  const [paginaUsuarios, setPaginaUsuarios] = useState(1)

  const cambiarTab = (nuevaTab: 'usuarios' | 'reporte') => {
    setTab(nuevaTab)
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    params.set('tab', nuevaTab)
    router.push(`${pathname}?${params.toString()}`)
  }

  const aplicarBusqueda = useCallback((valor: string) => {
    setQuery(valor)
    setPaginaUsuarios(1) // resetear página al buscar
    const params = new URLSearchParams()
    if (valor) params.set('q', valor)
    params.set('tab', tab)
    router.push(`${pathname}?${params.toString()}`)
  }, [tab, pathname, router])

  useEffect(() => {
    const timeout = setTimeout(() => {
      aplicarBusqueda(inputValue)
    }, 400)
    return () => clearTimeout(timeout)
  }, [inputValue, aplicarBusqueda])

  useEffect(() => {
    setBuyers(buyersIniciales)
    setPaginaUsuarios(1)
  }, [buyersIniciales])

  // Resetear página al cambiar entre vista activos/eliminados
  const handleVistaEliminados = (val: boolean) => {
    setVistaEliminados(val)
    setPaginaUsuarios(1)
    setExpandido(null)
  }

  const buyersFiltrados = buyers.filter(b =>
    vistaEliminados ? b.estado === 'eliminado' : b.estado !== 'eliminado'
  )

  const totalPaginasUsuarios = Math.ceil(buyersFiltrados.length / USUARIOS_POR_PAGINA)
  const buyersPagina = buyersFiltrados.slice(
    (paginaUsuarios - 1) * USUARIOS_POR_PAGINA,
    paginaUsuarios * USUARIOS_POR_PAGINA
  )

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
          deleted_at: accion === 'eliminar' ? new Date().toISOString() : b.deleted_at,
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

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">

        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest font-semibold" style={{ color: '#7BA05D' }}>
            Panel de administración
          </p>
          <h1 className="text-4xl font-bold" style={{ color: '#243B27' }}>
            Control del sistema
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => cambiarTab('usuarios')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={{
              backgroundColor: tab === 'usuarios' ? '#4C6B3D' : '#EAF3E6',
              color: tab === 'usuarios' ? 'white' : '#4C6B3D'
            }}
          >
            <Users size={16} /> Gestión de usuarios
          </button>
          <button
            onClick={() => cambiarTab('reporte')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={{
              backgroundColor: tab === 'reporte' ? '#4C6B3D' : '#EAF3E6',
              color: tab === 'reporte' ? 'white' : '#4C6B3D'
            }}
          >
            <BarChart2 size={16} /> Reporte de ventas
          </button>
        </div>

        {tab === 'reporte' && <ReporteVentas reporte={reporte} />}

        {tab === 'usuarios' && (
          <>
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => handleVistaEliminados(false)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  backgroundColor: !vistaEliminados ? '#4C6B3D' : '#EAF3E6',
                  color: !vistaEliminados ? 'white' : '#4C6B3D'
                }}
              >
                Activos / Suspendidos
              </button>
              <button
                onClick={() => handleVistaEliminados(true)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  backgroundColor: vistaEliminados ? '#4C6B3D' : '#EAF3E6',
                  color: vistaEliminados ? 'white' : '#4C6B3D'
                }}
              >
                Eliminados
              </button>
            </div>

            <div className="relative mb-2">
              <Search size={18} className="absolute left-4 top-3.5" style={{ color: '#7BA05D' }} />
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="w-full pl-11 pr-6 py-3 rounded-full border-2 outline-none"
                style={{ borderColor: '#7BA05D', backgroundColor: 'white', color: '#243B27' }}
              />
            </div>

            {query && (
              <p className="text-xs mb-4 pl-2" style={{ color: '#7BA05D' }}>
                Resultados para <strong>"{query}"</strong> ·{' '}
                <button className="underline" onClick={() => { setInputValue(''); aplicarBusqueda('') }}>
                  limpiar
                </button>
              </p>
            )}

            {/* Info de paginación */}
            {buyersFiltrados.length > 0 && (
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm" style={{ color: '#7BA05D' }}>
                  {buyersFiltrados.length} usuario{buyersFiltrados.length !== 1 ? 's' : ''}
                </p>
                {totalPaginasUsuarios > 1 && (
                  <p className="text-xs" style={{ color: '#B9B9B0' }}>
                    Página {paginaUsuarios} de {totalPaginasUsuarios}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-4">
              {buyersPagina.length === 0 ? (
                <div className="text-center py-20 rounded-3xl bg-white border border-[#EAF3E6]">
                  <p style={{ color: '#4C6B3D' }}>No se encontraron usuarios</p>
                </div>
              ) : (
                buyersPagina.map(buyer => (
                  <div key={buyer.id} className="rounded-3xl border border-[#EAF3E6] bg-white shadow-sm overflow-hidden">
                    <div className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                          style={{ backgroundColor: '#4C6B3D' }}
                        >
                          {(buyer.nombre ?? '?').charAt(0).toUpperCase()}
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
                          style={{ backgroundColor: estadoColorBadge[buyer.estado] ?? '#B9B9B0' }}
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

                    {expandido === buyer.id && (
                      <div className="px-6 pb-6 border-t border-[#EAF3E6] pt-4">
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
                                  <span className="text-sm" style={{ color: '#243B27' }}>Pedido #{order.id}</span>
                                  <span className="text-sm" style={{ color: '#7BA05D' }}>{formatDate(order.created_at)}</span>
                                  <span className="text-sm font-semibold" style={{ color: '#4C6B3D' }}>
                                    {formatMoney(order.total)}
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
                                  if (confirm(`¿Seguro que querés eliminar la cuenta de ${buyer.nombre ?? 'este usuario'}?`)) {
                                    ejecutarAccion(buyer.id, 'eliminar', motivoEliminar[buyer.id])
                                  }
                                }}
                                disabled={cargando === buyer.id || !motivoEliminar[buyer.id]?.trim()}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all w-fit"
                                style={{
                                  backgroundColor: (!motivoEliminar[buyer.id]?.trim() || cargando === buyer.id)
                                    ? '#F5F5F5'
                                    : '#E07A5F',
                                  color: (!motivoEliminar[buyer.id]?.trim() || cargando === buyer.id)
                                    ? '#B9B9B0'
                                    : 'white',
                                  cursor: (!motivoEliminar[buyer.id]?.trim() || cargando === buyer.id)
                                    ? 'not-allowed'
                                    : 'pointer'
                                }}
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

            {/* Paginación de usuarios */}
            <Paginacion
              paginaActual={paginaUsuarios}
              totalPaginas={totalPaginasUsuarios}
              onChange={(p) => {
                setPaginaUsuarios(p)
                setExpandido(null) // cerrar acordeón al cambiar de página
              }}
            />
          </>
        )}
      </section>
    </main>
  )
}