'use client'

import { useState } from 'react'
import { Leaf, Loader2, Search } from 'lucide-react'

type Consejo = {
  emoji: string
  titulo: string
  texto: string
}

type Estado = 'idle' | 'cargando' | 'ok' | 'error'

export default function AsistentePlanta() {
  const [input, setInput] = useState('')
  const [estado, setEstado] = useState<Estado>('idle')
  const [planta, setPlanta] = useState('')
  const [consejos, setConsejos] = useState<Consejo[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const consultar = async () => {
    const nombre = input.trim()
    if (!nombre) return

    setEstado('cargando')
    setConsejos([])
    setErrorMsg('')

    try {
      const res = await fetch('/api/plantas/consejos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planta: nombre })
      })

      const data = await res.json()

      if (!res.ok || !data.consejos) {
        setErrorMsg(data.error ?? 'Ocurrió un error inesperado')
        setEstado('error')
        return
      }

      setPlanta(data.planta)
      setConsejos(data.consejos)
      setEstado('ok')
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setEstado('error')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') consultar()
  }

  return (
    <div className="flex flex-col gap-4">

      <p className="text-xs leading-relaxed" style={{ color: '#4C6B3D' }}>
        Escribí el nombre de una planta y te digo cómo cuidarla.
      </p>

      <div className="flex flex-col gap-2">
        <div className="relative">
          <Leaf
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#7BA05D' }}
          />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ej: Monstera, Pothos, Aloe..."
            disabled={estado === 'cargando'}
            className="w-full pl-8 pr-3 py-2.5 rounded-full border-2 text-sm outline-none transition-all"
            style={{
              borderColor: '#EAF3E6',
              color: '#243B27',
              backgroundColor: estado === 'cargando' ? '#F5F2EA' : 'white'
            }}
            aria-label="Nombre de la planta"
          />
        </div>
        <button
          onClick={consultar}
          disabled={estado === 'cargando' || !input.trim()}
          className="w-full py-2.5 rounded-full text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:brightness-110"
          style={{ backgroundColor: '#4C6B3D' }}
          aria-label="Consultar cuidados de la planta"
        >
          {estado === 'cargando' ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Search size={15} />
          )}
          {estado === 'cargando' ? 'Consultando...' : 'Consultar'}
        </button>
      </div>

      {estado === 'idle' && (
        <div className="flex flex-wrap gap-1.5">
          {['Monstera', 'Pothos', 'Lavanda', 'Aloe Vera', 'Bonsai'].map(sugerencia => (
            <button
              key={sugerencia}
              onClick={() => setInput(sugerencia)}
              className="px-3 py-1 rounded-full text-xs font-medium border transition-all hover:bg-[#EAF3E6]"
              style={{ borderColor: '#EAF3E6', color: '#4C6B3D', backgroundColor: 'white' }}
            >
              {sugerencia}
            </button>
          ))}
        </div>
      )}

      {estado === 'error' && (
        <p
          className="text-xs px-3 py-2 rounded-xl"
          style={{ backgroundColor: '#FFF5F2', color: '#E07A5F' }}
        >
          ⚠️ {errorMsg}
        </p>
      )}

      {estado === 'ok' && consejos.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#7BA05D' }}>
            Consejos para {planta}
          </p>
          {consejos.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl p-3"
              style={{ backgroundColor: '#F5F2EA' }}
            >
              <span className="text-lg leading-none mt-0.5" role="img" aria-label={c.titulo}>
                {c.emoji}
              </span>
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: '#243B27' }}>
                  {c.titulo}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#4C6B3D' }}>
                  {c.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}