'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import ModalDireccion from './ModalDireccion'

type Props = {
  cartId: number
  buyerId: number
  tieneDireccion: boolean
}

export default function BotonConfirmarCompra({ cartId, buyerId, tieneDireccion }: Props) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mostrarModal, setMostrarModal] = useState(false)
  const router = useRouter()

  const confirmarCompra = async () => {
    if (!tieneDireccion) {
      setMostrarModal(true)
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

      // Pago confirmado → página de confirmación
      if (data.success && data.order_id) {
        router.push(`/confirmacion/${data.order_id}`)
        return
      }

      // Pago siendo procesado (PA no respondió o respondió async) → Mis pedidos
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
      {mostrarModal && <ModalDireccion onClose={() => setMostrarModal(false)} />}

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