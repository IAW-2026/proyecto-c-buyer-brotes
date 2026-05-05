'use client'

import { useState } from 'react'

type Props = {
  productoId: number
  sellerId: number
  buyerId: number
  esFavorito: boolean
}

export default function BotonFavorito({ productoId, sellerId, buyerId, esFavorito: inicial }: Props) {
  const [esFavorito, setEsFavorito] = useState(inicial)
  const [cargando, setCargando] = useState(false)

  const toggleFavorito = async () => {
    setCargando(true)
    try {
      if (esFavorito) {
        await fetch(`/api/favorites?buyer_id=${buyerId}&product_id=${productoId}`, {
          method: 'DELETE'
        })
        setEsFavorito(false)
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buyer_id: buyerId,
            product_id: productoId,
            seller_id: sellerId
          })
        })
        setEsFavorito(true)
      }
    } catch (error) {
      console.error('Error al actualizar favorito')
    } finally {
      setCargando(false)
    }
  }

  return (
    <button
      onClick={toggleFavorito}
      disabled={cargando}
      className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-125"
      style={{ backgroundColor: 'transparent' }}
      title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        stroke={esFavorito ? '#e53e3e' : '#1a1a1a'}
        strokeWidth="2"
        fill={esFavorito ? '#e53e3e' : 'none'}
        style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}