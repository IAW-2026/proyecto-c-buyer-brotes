'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { Buyer } from './types'
import { USUARIOS_POR_PAGINA } from './helpers'
import TarjetaUsuario from './TarjetaUsuario'
import Paginacion from './Paginacion'

type Props = {
  buyersIniciales: Buyer[]
  initialQuery: string
  tab: 'usuarios' | 'reporte'
}

export default function GestionUsuarios({ buyersIniciales, initialQuery, tab }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const [buyers, setBuyers] = useState<Buyer[]>(buyersIniciales)
  const [inputValue, setInputValue] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const [expandido, setExpandido] = useState<number | null>(null)
  const [vistaEliminados, setVistaEliminados] = useState(false)
  const [cargando, setCargando] = useState<number | null>(null)
  const [paginaUsuarios, setPaginaUsuarios] = useState(1)

  const aplicarBusqueda = useCallback((valor: string) => {
    setQuery(valor)
    setPaginaUsuarios(1)
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

  const handleVistaEliminados = (val: boolean) => {
    setVistaEliminados(val)
    setPaginaUsuarios(1)
    setExpandido(null)
  }

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

  const buyersFiltrados = buyers.filter(b =>
    vistaEliminados ? b.estado === 'eliminado' : b.estado !== 'eliminado'
  )

  const totalPaginasUsuarios = Math.ceil(buyersFiltrados.length / USUARIOS_POR_PAGINA)
  const buyersPagina = buyersFiltrados.slice(
    (paginaUsuarios - 1) * USUARIOS_POR_PAGINA,
    paginaUsuarios * USUARIOS_POR_PAGINA
  )

  return (
    <>
      {/* Filtro activos / eliminados */}
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

      {/* Buscador */}
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

      {/* Lista de usuarios */}
      <div className="grid gap-4">
        {buyersPagina.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-white border border-[#EAF3E6]">
            <p style={{ color: '#4C6B3D' }}>No se encontraron usuarios</p>
          </div>
        ) : (
          buyersPagina.map(buyer => (
            <TarjetaUsuario
              key={buyer.id}
              buyer={buyer}
              expandido={expandido === buyer.id}
              onToggle={() => setExpandido(expandido === buyer.id ? null : buyer.id)}
              onAccion={ejecutarAccion}
              cargando={cargando === buyer.id}
            />
          ))
        )}
      </div>

      {/* Paginación */}
      <Paginacion
        paginaActual={paginaUsuarios}
        totalPaginas={totalPaginasUsuarios}
        onChange={(p) => {
          setPaginaUsuarios(p)
          setExpandido(null)
        }}
      />
    </>
  )
}