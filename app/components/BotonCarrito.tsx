'use client'

import { useState } from 'react'
import Link from 'next/link'
import ModalDireccion from './ModalDireccion'
import ModalLogin from './ModalLogin'
import ModalPerfilIncompleto from './ModalPerfilIncompleto'

type Props = {
  productoId: number
  productNombre: string
  precio: number
  sellerId: number
  buyerId: number
  tieneNombre: boolean
  tieneDireccion: boolean
  estadoBuyer: string
}

export default function BotonCarrito({
  productoId, productNombre, precio, sellerId, buyerId,
  tieneNombre, tieneDireccion, estadoBuyer
}: Props) {
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [mostrarModalDireccion, setMostrarModalDireccion] = useState(false)
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false)
  const [mostrarModalPerfil, setMostrarModalPerfil] = useState(false)

  // Usuario no logueado
  if (buyerId === 0) {
    return (
      <div>
        {mostrarModalLogin && <ModalLogin onClose={() => setMostrarModalLogin(false)} />}
        <button
          onClick={() => setMostrarModalLogin(true)}
          className="w-full py-2 rounded-full text-sm font-semibold text-white transition-all hover:brightness-110"
          style={{ backgroundColor: '#7BA05D' }}
        >
          Agregar al carrito
        </button>
      </div>
    )
  }

  // Cuenta eliminada
  if (estadoBuyer === 'eliminado') {
    return (
      <div>
        <button disabled className="w-full py-2 rounded-full text-sm font-semibold text-white cursor-not-allowed" style={{ backgroundColor: '#B9B9B0' }}>
          Cuenta eliminada
        </button>
        <p className="text-xs text-center mt-2" style={{ color: '#E07A5F' }}>
          Tu cuenta fue eliminada. No podés realizar compras.
        </p>
      </div>
    )
  }

  // Cuenta suspendida
  if (estadoBuyer === 'suspendido') {
    return (
      <div>
        <button disabled className="w-full py-2 rounded-full text-sm font-semibold text-white cursor-not-allowed" style={{ backgroundColor: '#B9B9B0' }}>
          Cuenta suspendida
        </button>
        <p className="text-xs text-center mt-2" style={{ color: '#E07A5F' }}>
          Tu cuenta está suspendida. Contactá al soporte para reactivarla.
        </p>
      </div>
    )
  }

  const agregarAlCarrito = async () => {
    // Falta nombre o dirección → modal de perfil incompleto
    if (!tieneNombre || !tieneDireccion) {
      setMostrarModalPerfil(true)
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

    } catch {
      setMensaje('❌ Error de conexión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div>
      {mostrarModalDireccion && <ModalDireccion onClose={() => setMostrarModalDireccion(false)} />}
      {mostrarModalPerfil && (
        <ModalPerfilIncompleto
          faltaNombre={!tieneNombre}
          faltaDireccion={!tieneDireccion}
          onClose={() => setMostrarModalPerfil(false)}
        />
      )}

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
        <Link href="/carrito" className="text-xs underline" style={{ color: '#7BA05D' }}>
          Ver carrito
        </Link>
      </div>
    </div>
  )
}