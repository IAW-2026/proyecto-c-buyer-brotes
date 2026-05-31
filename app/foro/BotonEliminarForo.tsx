'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

type Props = {
  tipo: 'thread' | 'reply'
  id: number
  redirectTo?: string // si se elimina un hilo, redirige al foro
}

export default function BotonEliminarForo({ tipo, id, redirectTo }: Props) {
  const [cargando, setCargando] = useState(false)
  const router = useRouter()

  const eliminar = async () => {
    const confirmMsg = tipo === 'thread'
      ? '¿Eliminar este hilo y todas sus respuestas?'
      : '¿Eliminar esta respuesta?'

    if (!confirm(confirmMsg)) return

    setCargando(true)
    try {
      const endpoint = tipo === 'thread'
        ? `/api/admin/buyers/forum/threads/${id}`
        : `/api/admin/buyers/forum/replies/${id}`

      const res = await fetch(endpoint, { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) {
        alert(data.error ?? 'Error al eliminar')
        return
      }

      if (redirectTo) {
        router.push(redirectTo)
      } else {
        router.refresh()
      }
    } catch {
      alert('Error de conexión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <button
      onClick={eliminar}
      disabled={cargando}
      title={tipo === 'thread' ? 'Eliminar hilo' : 'Eliminar respuesta'}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-150 border"
      style={{
        backgroundColor: '#FFF5F2',
        color: '#E07A5F',
        borderColor: '#FFBDBD',
        opacity: cargando ? 0.6 : 1,
        cursor: cargando ? 'not-allowed' : 'pointer'
      }}
    >
      <Trash2 size={12} />
      {cargando ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}