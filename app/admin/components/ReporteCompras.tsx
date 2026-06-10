'use client'

import { useState } from 'react'
import { Reporte } from './types'
import { formatDate, formatMoney, estadoOrdenColor, ORDENES_POR_PAGINA } from './helpers'
import Paginacion from './Paginacion'

type Props = {
  reporte: Reporte
}

export default function ReporteCompras({ reporte }: Props) {
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

      {/* Filtros por estado */}
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
            <h2 className="font-bold" style={{ color: '#243B27' }}>Compras recientes</h2>
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