'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Loader2 } from 'lucide-react'

type Props = {
  threadId: number
}

export default function FormRespuesta({ threadId }: Props) {
  const router = useRouter()
  const [contenido, setContenido] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const enviar = async () => {
    setError('')
    if (!contenido.trim()) {
      setError('La respuesta no puede estar vacía')
      return
    }

    setCargando(true)
    try {
      const res = await fetch(`/api/forum/threads/${threadId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al enviar la respuesta')
        return
      }
      setContenido('')
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="rounded-3xl border border-[#EAF3E6] bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold mb-4" style={{ color: '#243B27' }}>
        Dejá tu respuesta
      </p>

      <textarea
        value={contenido}
        onChange={e => setContenido(e.target.value)}
        placeholder="Compartí tu experiencia, consejo o pregunta..."
        rows={4}
        className="w-full px-4 py-3 rounded-2xl border-2 outline-none text-sm resize-none transition-all focus:border-[#7BA05D]"
        style={{ borderColor: '#EAF3E6', color: '#243B27' }}
      />

      {error && (
        <p
          className="text-xs px-3 py-2 rounded-xl mt-3"
          style={{ backgroundColor: '#FFF5F2', color: '#E07A5F' }}
        >
          ⚠️ {error}
        </p>
      )}

      <div className="flex justify-end mt-4">
        <button
          onClick={enviar}
          disabled={cargando || !contenido.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
          style={{ backgroundColor: '#4C6B3D' }}
        >
          {cargando
            ? <Loader2 size={14} className="animate-spin" />
            : <Send size={14} />
          }
          {cargando ? 'Enviando...' : 'Responder'}
        </button>
      </div>
    </div>
  )
}