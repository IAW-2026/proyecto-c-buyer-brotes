'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Leaf, Loader2 } from 'lucide-react'

export default function NuevoHiloModal() {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const [plantaTag, setPlantaTag] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const cerrar = () => {
    setAbierto(false)
    setTitulo('')
    setContenido('')
    setPlantaTag('')
    setError('')
  }

  const crear = async () => {
    setError('')
    if (!titulo.trim()) { setError('El título es requerido'); return }
    if (!contenido.trim()) { setError('El contenido es requerido'); return }

    setCargando(true)
    try {
      const res = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, contenido, planta_tag: plantaTag })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Error al crear el hilo'); return }
      cerrar()
      router.push(`/foro/${data.id}`)
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white transition-all hover:brightness-110 shrink-0"
        style={{ backgroundColor: '#4C6B3D' }}
      >
        <Plus size={16} /> Nuevo debate
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(36,59,39,0.45)' }}
          onClick={cerrar}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-[#EAF3E6]"
            style={{ backgroundColor: 'white' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={cerrar}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#EAF3E6] transition-all"
              style={{ color: '#7BA05D' }}
            >
              <X size={16} />
            </button>

            {/* Título del modal */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#EAF3E6' }}
              >
                <Leaf size={18} style={{ color: '#4C6B3D' }} />
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#243B27' }}>
                Nuevo debate
              </h2>
            </div>

            <div className="flex flex-col gap-4">

              {/* Título */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#243B27' }}>
                  Título <span style={{ color: '#E07A5F' }}>*</span>
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  placeholder="Ej: ¿Cada cuánto regar una Monstera?"
                  className="w-full px-4 py-3 rounded-2xl border-2 outline-none text-sm transition-all focus:border-[#7BA05D]"
                  style={{ borderColor: '#EAF3E6', color: '#243B27' }}
                />
              </div>

              {/* Planta tag */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#243B27' }}>
                  Planta relacionada <span className="font-normal" style={{ color: '#B9B9B0' }}>(opcional)</span>
                </label>
                <input
                  type="text"
                  value={plantaTag}
                  onChange={e => setPlantaTag(e.target.value)}
                  placeholder="Ej: Monstera, Pothos, Lavanda..."
                  className="w-full px-4 py-3 rounded-2xl border-2 outline-none text-sm transition-all focus:border-[#7BA05D]"
                  style={{ borderColor: '#EAF3E6', color: '#243B27' }}
                />
              </div>

              {/* Contenido */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#243B27' }}>
                  Contenido <span style={{ color: '#E07A5F' }}>*</span>
                </label>
                <textarea
                  value={contenido}
                  onChange={e => setContenido(e.target.value)}
                  placeholder="Contá tu experiencia o hacé tu pregunta con el mayor detalle posible..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border-2 outline-none text-sm resize-none transition-all focus:border-[#7BA05D]"
                  style={{ borderColor: '#EAF3E6', color: '#243B27' }}
                />
              </div>

              {/* Error */}
              {error && (
                <p
                  className="text-xs px-3 py-2 rounded-xl"
                  style={{ backgroundColor: '#FFF5F2', color: '#E07A5F' }}
                >
                  ⚠️ {error}
                </p>
              )}

              {/* Botones */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={cerrar}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all hover:bg-[#EAF3E6]"
                  style={{ borderColor: '#EAF3E6', color: '#4C6B3D' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={crear}
                  disabled={cargando}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                  style={{ backgroundColor: '#4C6B3D' }}
                >
                  {cargando
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Plus size={14} />
                  }
                  {cargando ? 'Publicando...' : 'Publicar debate'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}