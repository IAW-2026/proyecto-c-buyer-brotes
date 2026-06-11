'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, Minus, Plus, Store } from 'lucide-react'
import Link from 'next/link'
import BotonVaciarCarrito from '../components/BotonVaciarCarrito'
import BotonConfirmarCompra from '../components/BotonConfirmarCompra'

type CartItem = {
  id: number
  product_id: number
  product_name?: string | null
  cantidad: number
  precio_unitario: number
}

type Cart = {
  id: number
  items: CartItem[]
}

type Props = {
  initialCart: Cart | null
  buyerId: number
  tieneNombre: boolean
  tieneDireccion: boolean
  sellerId: number | null
}

function formatPrice(value: number) {
  return `$${value.toLocaleString('es-AR')}`
}

export default function CartDetails({ initialCart, buyerId, tieneNombre, tieneDireccion, sellerId }: Props) {
  const [cart, setCart] = useState<Cart | null>(initialCart)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [mensaje, setMensaje] = useState('')
  const router = useRouter()

  useEffect(() => {
    setCart(initialCart)
  }, [initialCart])

  const updateCartItem = async (itemId: number, cantidad: number) => {
    if (cantidad < 0) return
    setUpdatingId(itemId)
    setMensaje('')

    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_item_id: itemId, cantidad })
      })

      if (!res.ok) {
        setMensaje('Error al actualizar la cantidad')
        return
      }

      // Actualizar estado local
      setCart(prev => {
        if (!prev) return prev
        const updatedItems = prev.items
          .map(item => (item.id === itemId ? { ...item, cantidad } : item))
          .filter(item => item.cantidad > 0)
        return { ...prev, items: updatedItems }
      })

      // Notificar al CarritoFlotante
      window.dispatchEvent(new Event('cartUpdated'))

    } catch {
      setMensaje('Error de conexión')
    } finally {
      setUpdatingId(null)
    }
  }

  const total = cart?.items.reduce((sum, item) => sum + item.precio_unitario * item.cantidad, 0) ?? 0

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <Leaf size={80} className="mx-auto mb-4" style={{ color: '#7BA05D' }} />
        <p className="text-xl mb-6" style={{ color: '#4C6B3D' }}>
          Tu carrito está vacío
        </p>
        <a
          href="/"
          className="px-8 py-3 rounded-full text-white font-semibold transition-all hover:brightness-110"
          style={{ backgroundColor: '#4C6B3D' }}
        >
          Explorar vendedores
        </a>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {mensaje && (
        <div className="rounded-3xl border border-[#EAF3E6] bg-[#FFF8E5] p-4 text-sm text-[#874B00]">
          {mensaje}
        </div>
      )}

      <div className="grid gap-4">
        {cart.items.map(item => (
          <div
            key={item.id}
            className="rounded-3xl border border-[#EAF3E6] bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-3xl bg-[#EAF3E6] flex items-center justify-center text-[#4C6B3D]">
                  <Leaf size={28} />
                </div>
                <div>
                  <p className="font-semibold text-lg" style={{ color: '#243B27' }}>
                    {item.product_name ? item.product_name : `Producto #${item.product_id}`}
                  </p>
                  <p className="text-sm text-[#7BA05D]">ID de producto: {item.product_id}</p>
                </div>
              </div>

              <div className="grid gap-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => updateCartItem(item.id, item.cantidad - 1)}
                    disabled={updatingId === item.id}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#EAF3E6] bg-white text-[#4C6B3D] transition hover:bg-[#EAF3E6] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold" style={{ color: '#243B27' }}>
                    {item.cantidad}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartItem(item.id, item.cantidad + 1)}
                    disabled={updatingId === item.id}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#EAF3E6] bg-white text-[#4C6B3D] transition hover:bg-[#EAF3E6] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-[#4C6B3D]">Precio unitario</p>
                <p className="text-xl font-bold" style={{ color: '#243B27' }}>
                  {formatPrice(item.precio_unitario)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#4C6B3D]">Total</p>
                <p className="text-lg font-semibold" style={{ color: '#4C6B3D' }}>
                  {formatPrice(item.precio_unitario * item.cantidad)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-[#EAF3E6] bg-white p-6 shadow-sm">
          <p className="text-sm mb-2" style={{ color: '#4C6B3D' }}>Resumen del pedido</p>
          <div className="flex items-center justify-between pb-4 border-b border-[#EAF3E6]">
            <span className="text-sm" style={{ color: '#243B27' }}>Subtotal</span>
            <span className="font-semibold" style={{ color: '#243B27' }}>{formatPrice(total)}</span>
          </div>
          <div className="flex items-center justify-between py-4">
            <span className="text-sm" style={{ color: '#243B27' }}>Envío</span>
            <span className="text-sm text-[#7BA05D]">Gratis</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: '#243B27' }}>Total estimado</span>
            <span className="text-lg font-bold" style={{ color: '#4C6B3D' }}>{formatPrice(total)}</span>
          </div>
          <p className="mt-4 text-xs text-[#4C6B3D]">*Los precios son estimados y pueden variar al momento del checkout.</p>
        </div>

        <div className="rounded-3xl bg-[#EAF3E6] p-6 shadow-sm flex flex-col gap-3">
          <BotonConfirmarCompra
            cartId={cart.id}
            buyerId={buyerId}
            tieneNombre={tieneNombre}
            tieneDireccion={tieneDireccion}
          />
          <BotonVaciarCarrito cartId={cart.id} />

          {sellerId && (
            <Link
              href={`/vendedores/${sellerId}`}
              className="w-full py-3 rounded-full text-sm font-semibold border-2 inline-flex items-center justify-center gap-2 transition-all duration-200 hover:bg-white"
              style={{ borderColor: '#4C6B3D', color: '#4C6B3D', backgroundColor: 'transparent' }}
            >
              <Store size={16} />
              Volver a la tienda
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}