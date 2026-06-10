'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, PauseCircle, PlayCircle, Trash2 } from 'lucide-react'
import { Buyer } from './types'
import { formatDate, formatMoney, estadoColorBadge } from './helpers'

type Props = {
  buyer: Buyer
  expandido: boolean
  onToggle: () => void
  onAccion: (id: number, accion: string, motivo?: string) => Promise<void>
  cargando: boolean
}

export default function TarjetaUsuario({ buyer, expandido, onToggle, onAccion, cargando }: Props) {
  const [motivo, setMotivo] = useState('')

  const handleEliminar = () => {
    if (confirm(`¿Seguro que querés eliminar la cuenta de ${buyer.nombre ?? 'este usuario'}?`)) {
      onAccion(buyer.id, 'eliminar', motivo)
    }
  }

  return (
    <div className="rounded-3xl border border-[#EAF3E6] bg-white shadow-sm overflow-hidden">

      {/* Fila principal */}
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
            onClick={onToggle}
            className="p-2 rounded-full hover:bg-[#EAF3E6] transition-all"
          >
            {expandido
              ? <ChevronUp size={18} style={{ color: '#4C6B3D' }} />
              : <ChevronDown size={18} style={{ color: '#4C6B3D' }} />}
          </button>
        </div>
      </div>

      {/* Acordeón */}
      {expandido && (
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

          {/* Motivo de eliminación (solo para eliminados) */}
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

          {/* Acciones (solo para no eliminados) */}
          {buyer.estado !== 'eliminado' && (
            <div className="flex flex-col gap-3">

              {/* Suspender / Reactivar */}
              {buyer.estado === 'activo' ? (
                <button
                  onClick={() => onAccion(buyer.id, 'suspender')}
                  disabled={cargando}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all w-fit"
                  style={{ backgroundColor: '#FFF5F2', color: '#E07A5F', border: '1.5px solid #E07A5F' }}
                >
                  <PauseCircle size={16} />
                  {cargando ? 'Procesando...' : 'Suspender cuenta'}
                </button>
              ) : (
                <button
                  onClick={() => onAccion(buyer.id, 'reactivar')}
                  disabled={cargando}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all w-fit"
                  style={{ backgroundColor: '#EAF3E6', color: '#4C6B3D', border: '1.5px solid #4C6B3D' }}
                >
                  <PlayCircle size={16} />
                  {cargando ? 'Procesando...' : 'Reactivar cuenta'}
                </button>
              )}

              {/* Eliminar */}
              <div className="flex flex-col gap-2">
                <textarea
                  value={motivo}
                  onChange={e => setMotivo(e.target.value)}
                  placeholder="Justificación para eliminar la cuenta..."
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl border border-[#EAF3E6] outline-none text-sm resize-none"
                  style={{ color: '#243B27' }}
                />
                <button
                  onClick={handleEliminar}
                  disabled={cargando || !motivo.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all w-fit"
                  style={{
                    backgroundColor: (!motivo.trim() || cargando) ? '#F5F5F5' : '#E07A5F',
                    color: (!motivo.trim() || cargando) ? '#B9B9B0' : 'white',
                    cursor: (!motivo.trim() || cargando) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Trash2 size={16} />
                  {cargando ? 'Procesando...' : 'Eliminar cuenta'}
                </button>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  )
}