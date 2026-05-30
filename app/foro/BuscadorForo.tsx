'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

type Props = {
  tags: string[]
  initialQ: string
  initialTag: string
}

export default function BuscadorForo({ tags, initialQ, initialTag }: Props) {
  const router = useRouter()
  const [q, setQ] = useState(initialQ)
  const [tag, setTag] = useState(initialTag)

  const aplicar = (nuevoQ: string, nuevoTag: string) => {
    const params = new URLSearchParams()
    if (nuevoQ) params.set('q', nuevoQ)
    if (nuevoTag) params.set('tag', nuevoTag)
    const query = params.toString()
    router.push(`/foro${query ? `?${query}` : ''}`)
  }

  const handleSearch = (value: string) => {
    setQ(value)
    aplicar(value, tag)
  }

  const handleTag = (t: string) => {
    const nuevoTag = tag === t ? '' : t
    setTag(nuevoTag)
    aplicar(q, nuevoTag)
  }

  const limpiar = () => {
    setQ('')
    setTag('')
    router.push('/foro')
  }

  return (
    <div className="mb-6 flex flex-col gap-4">

      {/* Input de búsqueda */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: '#7BA05D' }}
        />
        <input
          type="text"
          value={q}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Buscá por título, contenido o planta..."
          className="w-full pl-10 pr-10 py-3 rounded-full border-2 outline-none text-sm transition-all"
          style={{ borderColor: '#7BA05D', backgroundColor: 'white', color: '#243B27' }}
        />
        {q && (
          <button
            onClick={limpiar}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: '#B9B9B0' }}
            aria-label="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filtros por tag */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold" style={{ color: '#7BA05D' }}>
            Filtrar por planta:
          </span>
          {tags.map(t => (
            <button
              key={t}
              onClick={() => handleTag(t)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
              style={{
                backgroundColor: tag === t ? '#4C6B3D' : 'white',
                color: tag === t ? 'white' : '#4C6B3D',
                borderColor: tag === t ? '#4C6B3D' : '#EAF3E6',
              }}
            >
              🌿 {t}
            </button>
          ))}
          {(q || tag) && (
            <button
              onClick={limpiar}
              className="text-xs font-semibold underline ml-1"
              style={{ color: '#7BA05D' }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

    </div>
  )
}