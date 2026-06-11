'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

type Props = {
  cartId: number
}

export default function BotonVaciarCarrito({ cartId }: Props) {
  const [cargando, setCargando] = useState(false)
  const router = useRouter()

  const vaciarCarrito = async () => {
    if (!confirm('¿Seguro que querés vaciar el carrito?')) return

    setCargando(true)
    try {
      await fetch(`/api/cart?cart_id=${cartId}`, { method: 'DELETE' })

      // Notificar al CarritoFlotante
      window.dispatchEvent(new Event('cartUpdated'))

      router.refresh()
    } catch (error) {
      alert('Error al vaciar el carrito')
    } finally {
      setCargando(false)
    }
  }

  return (
    <button
      onClick={vaciarCarrito}
      disabled={cargando}
      className="w-full py-3 rounded-full text-sm font-semibold border-2 mt-3 inline-flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#E07A5F]/10"
      style={{ borderColor: '#E07A5F', color: '#E07A5F', backgroundColor: 'transparent' }}
    >
      <Trash2 size={16} />
      {cargando ? 'Vaciando...' : 'Vaciar carrito'}
    </button>
  )
}