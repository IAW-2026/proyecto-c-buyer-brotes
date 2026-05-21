'use client'

import { useState } from 'react'
import ModalDireccion from './ModalDireccion'

type Props = {
  productoId: number
  productNombre: string
  precio: number
  sellerId: number
  buyerId: number
  tieneDireccion: boolean
}

export default function BotonCarrito({ productoId, productNombre, precio, sellerId, buyerId, tieneDireccion }: Props) {
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [mostrarModal, setMostrarModal] = useState(false)

  const agregarAlCarrito = async () => {
    if (!tieneDireccion) {
      setMostrarModal(true)
      return
    }

    setCargando(true)
    setMensaje('')

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: buyerId,
          product_id: productoId,
          product_name: productNombre,
          precio_unitario: precio,
          cantidad: 1,
          seller_id: sellerId
        })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setMensaje(data?.error || '❌ Error al agregar al carrito')
        return
      }

      setMensaje('✅ Agregado al carrito')

    } catch (error) {
      setMensaje('❌ Error de conexión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div>
      {mostrarModal && <ModalDireccion onClose={() => setMostrarModal(false)} />}

      <button
        onClick={agregarAlCarrito}
        disabled={cargando}
        className="w-full py-2 rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: cargando ? '#B9B9B0' : '#7BA05D' }}
      >
        {cargando ? 'Agregando...' : 'Agregar al carrito'}
      </button>

      {mensaje && (
        <p className="text-xs text-center mt-2" style={{ color: '#4C6B3D' }}>
          {mensaje}
        </p>
      )}
      <div className="text-center mt-2">
        <a href="/carrito" className="text-xs underline" style={{ color: '#7BA05D' }}>
          Ver carrito
        </a>
      </div>
    </div>
  )
}