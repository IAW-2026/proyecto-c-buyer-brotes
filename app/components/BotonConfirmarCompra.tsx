'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import ModalPerfilIncompleto from './ModalPerfilIncompleto'

type Props = {
  cartId: number
  buyerId: number
  tieneNombre: boolean
  tieneDireccion: boolean
}

export default function BotonConfirmarCompra({ cartId, buyerId, tieneNombre, tieneDireccion }: Props) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mostrarModalPerfil, setMostrarModalPerfil] = useState(false)
  const router = useRouter()

  const confirmarCompra = async () => {
    if (!tieneNombre || !tieneDireccion) {
      setMostrarModalPerfil(true)
      return
    }

    setCargando(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyer_id: buyerId, cart_id: cartId })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al procesar la compra')
        return
      }

      if (data.success && data.order_id) {
        router.push(`/confirmacion/${data.order_id}`)
        return
      }

      if (data.pending && data.mp_init_point) {
        // Redirige al usuario al Checkout de Mercado Pago
        window.location.href = data.mp_init_point
        return
      }

      if (data.pending && data.order_id) {
        router.push('/pedidos')
        return
      }

    } catch {
      setError('Error de conexión. Intentá de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div>
      {mostrarModalPerfil && (
        <ModalPerfilIncompleto
          faltaNombre={!tieneNombre}
          faltaDireccion={!tieneDireccion}
          onClose={() => setMostrarModalPerfil(false)}
        />
      )}

      {error && (
        <p className="text-sm text-center mb-3" style={{ color: '#E07A5F' }}>
          ⚠️ {error}
        </p>
      )}

      <button
        onClick={confirmarCompra}
        disabled={cargando}
        className="w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110"
        style={{ backgroundColor: cargando ? '#B9B9B0' : '#4C6B3D', color: 'white' }}
      >
        {cargando ? 'Procesando...' : 'Confirmar compra'}
        {!cargando && <ArrowRight size={20} />}
      </button>
    </div>
  )
}