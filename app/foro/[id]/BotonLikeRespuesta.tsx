'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'

type Props = {
  replyId: number
  initialCount: number
  initialLiked: boolean
  isLoggedIn: boolean
}

export default function BotonLikeRespuesta({ replyId, initialCount, initialLiked, isLoggedIn }: Props) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [cargando, setCargando] = useState(false)

  const toggle = async () => {
    if (!isLoggedIn || cargando) return

    setCargando(true)
    try {
      const res = await fetch(`/api/forum/replies/${replyId}/likes`, {
        method: 'POST'
      })
      const data = await res.json()
      if (res.ok) {
        setLiked(data.liked)
        setCount(data.count)
      }
    } catch {
      // silencioso
    } finally {
      setCargando(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={!isLoggedIn || cargando}
      title={!isLoggedIn ? 'Iniciá sesión para dar like' : liked ? 'Quitar like' : 'Me gusta'}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-150"
      style={{
        backgroundColor: liked ? '#FFF0F0' : '#F5F2EA',
        color: liked ? '#e53e3e' : '#B9B9B0',
        border: `1.5px solid ${liked ? '#FFBDBD' : '#EAF3E6'}`,
        cursor: !isLoggedIn ? 'default' : 'pointer',
        opacity: cargando ? 0.6 : 1,
      }}
    >
      <Heart
        size={13}
        fill={liked ? '#e53e3e' : 'none'}
        stroke={liked ? '#e53e3e' : '#B9B9B0'}
        style={{ transition: 'fill 0.15s ease, stroke 0.15s ease' }}
      />
      {count > 0 && <span>{count}</span>}
    </button>
  )
}