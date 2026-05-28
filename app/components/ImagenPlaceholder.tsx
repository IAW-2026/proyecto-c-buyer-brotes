'use client'

import { Leaf } from 'lucide-react'

type Props = {
  tipo: 'vendedor' | 'producto'
  imagen?: string
}

export default function ImagenPlaceholder({ tipo, imagen }: Props) {
  if (imagen && imagen.startsWith('http')) {
    return (
      <img
        src={imagen}
        alt={tipo === 'vendedor' ? 'Foto del vendedor' : 'Foto del producto'}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    )
  }

  if (tipo === 'vendedor') {
    return (
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="56"
        height="56"
        role="img"
        aria-label="Imagen de vendedor"
      >
        <circle cx="40" cy="30" r="13" stroke="#7BA05D" strokeWidth="2.5" />
        <path d="M18 68c0-12.15 9.85-22 22-22s22 9.85 22 22" stroke="#7BA05D" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{ color: '#7BA05D' }}
      role="img"
      aria-label="Imagen de producto"
    >
      <Leaf size={48} />
    </div>
  )
}