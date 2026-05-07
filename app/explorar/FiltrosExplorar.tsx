'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, ArrowUpDown } from 'lucide-react'

type FiltroPrecio = 'todos' | 'bajo' | 'medio' | 'alto' | 'premium'
type FiltroTipo = 'todos' | 'suculentas' | 'interior' | 'aromaticas' | 'frutales' | 'cactus' | 'raras' | 'accesorios'
type OrdenPrecio = 'default' | 'asc' | 'desc'

const tiposPlantas = [
  { value: 'todos', label: 'Todos los productos' },
  { value: 'suculentas', label: 'Suculentas' },
  { value: 'interior', label: 'Plantas de interior' },
  { value: 'aromaticas', label: 'Aromáticas' },
  { value: 'frutales', label: 'Frutales' },
  { value: 'cactus', label: 'Cactus' },
  { value: 'raras', label: 'Colecciones raras' },
  { value: 'accesorios', label: 'Macetas & kits' }
]

const rangosPrecio = [
  { value: 'todos', label: 'Todos los precios' },
  { value: 'bajo', label: 'Hasta $10.000' },
  { value: 'medio', label: '$10.000 - $20.000' },
  { value: 'alto', label: '$20.000 - $50.000' },
  { value: 'premium', label: 'Más de $50.000' }
]

const opcionesOrden = [
  { value: 'default', label: 'Orden por defecto' },
  { value: 'asc', label: 'Precio: menor a mayor' },
  { value: 'desc', label: 'Precio: mayor a menor' }
]

export default function FiltrosExplorar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [tipo, setTipo] = useState<FiltroTipo>((searchParams.get('tipo') as FiltroTipo) || 'todos')
  const [precio, setPrecio] = useState<FiltroPrecio>((searchParams.get('precio') as FiltroPrecio) || 'todos')
  const [orden, setOrden] = useState<OrdenPrecio>((searchParams.get('orden') as OrdenPrecio) || 'default')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const aplicarFiltros = () => {
    const params = new URLSearchParams()
    if (tipo !== 'todos') params.set('tipo', tipo)
    if (precio !== 'todos') params.set('precio', precio)
    if (orden !== 'default') params.set('orden', orden)

    const nuevaURL = params.toString() ? `?${params.toString()}` : ''
    router.push(`/explorar${nuevaURL}`)
  }

  const limpiarFiltros = () => {
    setTipo('todos')
    setPrecio('todos')
    setOrden('default')
    router.push('/explorar')
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm border border-[#EAF3E6] transition hover:bg-[#EAF3E6]"
            style={{ color: '#4C6B3D' }}
          >
            <Filter size={16} />
            Filtros
          </button>
          <span className="text-sm" style={{ color: '#7BA05D' }}>
            {tipo !== 'todos' || precio !== 'todos' || orden !== 'default' ? 'Filtros aplicados' : 'Sin filtros'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} style={{ color: '#7BA05D' }} />
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as OrdenPrecio)}
            className="rounded-full bg-white px-3 py-2 text-sm border border-[#EAF3E6] outline-none"
            style={{ color: '#4C6B3D' }}
          >
            {opcionesOrden.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mostrarFiltros && (
        <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm border border-[#EAF3E6]">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: '#243B27' }}>
                Tipo de planta
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as FiltroTipo)}
                className="w-full rounded-xl bg-[#F5F2EA] px-4 py-3 text-sm border border-[#EAF3E6] outline-none"
                style={{ color: '#4C6B3D' }}
              >
                {tiposPlantas.map((tipoPlanta) => (
                  <option key={tipoPlanta.value} value={tipoPlanta.value}>
                    {tipoPlanta.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: '#243B27' }}>
                Rango de precio
              </label>
              <select
                value={precio}
                onChange={(e) => setPrecio(e.target.value as FiltroPrecio)}
                className="w-full rounded-xl bg-[#F5F2EA] px-4 py-3 text-sm border border-[#EAF3E6] outline-none"
                style={{ color: '#4C6B3D' }}
              >
                {rangosPrecio.map((rango) => (
                  <option key={rango.value} value={rango.value}>
                    {rango.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={limpiarFiltros}
              className="text-sm font-semibold underline"
              style={{ color: '#7BA05D' }}
            >
              Limpiar filtros
            </button>
            <button
              onClick={aplicarFiltros}
              className="rounded-full bg-[#4C6B3D] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
