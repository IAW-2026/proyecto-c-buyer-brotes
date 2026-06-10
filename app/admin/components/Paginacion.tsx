'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  paginaActual: number
  totalPaginas: number
  onChange: (pagina: number) => void
}

export default function Paginacion({ paginaActual, totalPaginas, onChange }: Props) {
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