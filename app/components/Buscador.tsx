'use client'

import { useState } from 'react'
import { Vendedor } from '../lib/mock-data'
import Link from 'next/link'

type Props = {
  vendedores: Vendedor[]
}

// Elimina acentos y convierte a minúsculas
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function Buscador({ vendedores }: Props) {
  const [query, setQuery] = useState('')

  const resultados = vendedores.filter((vendedor) => {
    const q = normalizar(query.trim())
    if (!q) return false

    const porNombre = normalizar(vendedor.nombre).includes(q)
    const porCiudad = normalizar(vendedor.ubicacion).includes(q)
    const porPlanta = vendedor.productos.some(p =>
      normalizar(p.nombre).includes(q)
    )

    return porNombre || porCiudad || porPlanta
  })

  return (
    <div className="max-w-xl mx-auto relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscá vendedores, plantas o ciudades..."
        className="w-full px-6 py-3 rounded-full border-2 text-lg outline-none"
        style={{ borderColor: '#7BA05D', backgroundColor: 'white', color: '#243B27' }}
      />

      {/* Resultados */}
      {query.trim() && (
        <div
          className="absolute top-14 left-0 right-0 rounded-2xl shadow-xl overflow-hidden z-10"
          style={{ backgroundColor: 'white' }}
        >
          {resultados.length === 0 ? (
            <div className="px-6 py-4 text-center" style={{ color: '#B9B9B0' }}>
              No se encontraron resultados para "{query}"
            </div>
          ) : (
            resultados.map((vendedor) => (
              <Link
                key={vendedor.id}
                href={`/vendedores/${vendedor.id}`}
                onClick={() => setQuery('')}
                className="flex items-center gap-4 px-6 py-4 hover:opacity-80 transition-opacity border-b last:border-0"
                style={{ borderColor: '#EAF3E6' }}
              >
                <span className="text-3xl">{vendedor.imagen}</span>
                <div>
                  <p className="font-semibold" style={{ color: '#243B27' }}>
                    {vendedor.nombre}
                  </p>
                  <p className="text-sm" style={{ color: '#7BA05D' }}>
                    📍 {vendedor.ubicacion}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#4C6B3D' }}>
                    {vendedor.descripcion}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}