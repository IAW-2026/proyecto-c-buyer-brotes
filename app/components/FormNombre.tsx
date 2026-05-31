'use client'

import { useState } from 'react'
import { User, Check, Loader2 } from 'lucide-react'

type Props = {
  nombreActual: string | null
}

export default function FormNombre({ nombreActual }: Props) {
  const [valor, setValor] = useState(nombreActual ?? '')
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)
  const [editando, setEditando] = useState(!nombreActual)

  const guardar = async () => {
    if (!valor.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre no puede estar vacío' })
      return
    }

    setCargando(true)
    setMensaje(null)

    try {
      const res = await fetch('/api/perfil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: valor })
      })

      const data = await res.json()

      if (!res.ok) {
        setMensaje({ tipo: 'error', texto: data.error ?? 'Error al guardar' })
        return
      }

      setMensaje({ tipo: 'ok', texto: '¡Nombre guardado!' })
      setEditando(false)
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error de conexión' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {editando ? (
        <>
          <div className="relative">
            <User
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: '#7BA05D' }}
            />
            <input
              type="text"
              value={valor}
              onChange={e => setValor(e.target.value)}
              placeholder="Ej: María González"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 outline-none text-sm transition-all"
              style={{
                borderColor: '#7BA05D',
                color: '#243B27',
                backgroundColor: 'white'
              }}
              autoFocus
            />
          </div>

          {mensaje && (
            <p
              className="text-xs px-3 py-2 rounded-xl"
              style={{
                backgroundColor: mensaje.tipo === 'ok' ? '#EAF3E6' : '#FFF5F2',
                color: mensaje.tipo === 'ok' ? '#4C6B3D' : '#E07A5F'
              }}
            >
              {mensaje.tipo === 'ok' ? '✅ ' : '⚠️ '}{mensaje.texto}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={guardar}
              disabled={cargando}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
              style={{ backgroundColor: '#4C6B3D' }}
            >
              {cargando
                ? <Loader2 size={14} className="animate-spin" />
                : <Check size={14} />
              }
              {cargando ? 'Guardando...' : 'Guardar nombre'}
            </button>

            {nombreActual && (
              <button
                onClick={() => { setEditando(false); setValor(nombreActual); setMensaje(null) }}
                className="px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all hover:bg-[#EAF3E6]"
                style={{ borderColor: '#EAF3E6', color: '#4C6B3D' }}
              >
                Cancelar
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-2xl" style={{ backgroundColor: '#F5F2EA' }}>
            <User size={16} style={{ color: '#7BA05D' }} />
            <span className="text-sm" style={{ color: '#243B27' }}>{valor}</span>
          </div>
          <button
            onClick={() => setEditando(true)}
            className="px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all hover:bg-[#EAF3E6] shrink-0"
            style={{ borderColor: '#7BA05D', color: '#7BA05D' }}
          >
            Editar
          </button>
        </div>
      )}
    </div>
  )
}