'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'

type Props = {
  buyerId: number | null
}

export default function CarritoFlotante({ buyerId }: Props) {
  const [cantidad, setCantidad] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  const fetchCantidad = useCallback(async () => {
    if (!buyerId) {
      setCantidad(0)
      return
    }
    try {
      const res = await fetch(`/api/cart?buyer_id=${buyerId}`)
      if (!res.ok) {
        setCantidad(0)
        return
      }
      const data = await res.json()
      if (!data || !Array.isArray(data.items)) {
        setCantidad(0)
        return
      }
      const total = data.items.reduce(
        (acc: number, item: { cantidad: number }) => acc + item.cantidad,
        0
      )
      setCantidad(total)
    } catch {
      setCantidad(0)
    }
  }, [buyerId])

  useEffect(() => {
    fetchCantidad()

    window.addEventListener('cartUpdated', fetchCantidad)
    return () => window.removeEventListener('cartUpdated', fetchCantidad)
  }, [fetchCantidad, pathname])

  if (!buyerId) return null

  return (
    <button
      onClick={() => router.push('/carrito')}
      aria-label="Ver carrito"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200 hover:brightness-110 hover:scale-105 active:scale-95"
      style={{ backgroundColor: '#4C6B3D' }}
    >
      <ShoppingCart size={24} color="white" />
      {cantidad > 0 && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: '#E07A5F' }}
        >
          {cantidad > 99 ? '99+' : cantidad}
        </span>
      )}
    </button>
  )
}