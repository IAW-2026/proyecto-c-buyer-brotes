'use client'

import { useState, useEffect } from 'react'

type Props = {
  imagenes: string[]
  alt: string
  intervalo?: number
}

export default function ImagenCarousel({ imagenes, alt, intervalo = 3000 }: Props) {
  const [indice, setIndice] = useState(0)

  useEffect(() => {
    if (imagenes.length <= 1) return
    const timer = setInterval(() => {
      setIndice(prev => (prev + 1) % imagenes.length)
    }, intervalo)
    return () => clearInterval(timer)
  }, [imagenes, intervalo])

  if (imagenes.length === 0) return null

  return (
    <img
      src={imagenes[indice]}
      alt={alt || 'Imagen del carrusel'}
      aria-label={alt || 'Imagen del carrusel'}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'opacity 0.7s ease'
      }}
    />
  )
}