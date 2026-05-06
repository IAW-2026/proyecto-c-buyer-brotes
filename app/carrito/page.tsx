import { prisma } from '../lib/prisma'
import Link from 'next/link'
import BotonVaciarCarrito from '../components/BotonVaciarCarrito'
import { ShoppingCart, Leaf } from 'lucide-react'

export default async function CarritoPage() {
  const cart = await prisma.cart.findFirst({
    where: {
      buyer_id: 1,
      estado: 'active'
    },
    include: {
      items: true
    }
  })

  const total = cart?.items.reduce((acc, item) => {
    return acc + Number(item.precio_unitario) * item.cantidad
  }, 0) ?? 0

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-8 py-10 max-w-3xl mx-auto">
        <Link href="/" className="text-sm mb-6 inline-block" style={{ color: '#7BA05D' }}>
          ← Volver al inicio
        </Link>

        <h1 className="text-4xl font-bold mb-8 flex items-center gap-2" style={{ color: '#243B27' }}>
          <ShoppingCart size={32} /> Mi carrito
        </h1>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-20">
            <Leaf size={80} className="mx-auto mb-4" style={{ color: '#7BA05D' }} />
            <p className="text-xl mb-6" style={{ color: '#4C6B3D' }}>
              Tu carrito está vacío
            </p>
            <Link
              href="/"
              className="px-8 py-3 rounded-full text-white font-semibold transition-all hover:brightness-110"
              style={{ backgroundColor: '#4C6B3D' }}
            >
              Explorar vendedores
            </Link>
          </div>
        ) : (
          <div>
            {/* Lista de items */}
            <div className="rounded-2xl overflow-hidden shadow-md mb-6" style={{ backgroundColor: 'white' }}>
              {cart.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between px-6 py-4 ${index !== cart.items.length - 1 ? 'border-b' : ''}`}
                  style={{ borderColor: '#EAF3E6' }}
                >
                  <div>
                    <p className="font-semibold" style={{ color: '#243B27' }}>
                      Producto #{item.product_id}
                    </p>
                    <p className="text-sm" style={{ color: '#7BA05D' }}>
                      Cantidad: {item.cantidad}
                    </p>
                  </div>
                  <p className="font-bold" style={{ color: '#4C6B3D' }}>
                    ${(Number(item.precio_unitario) * item.cantidad).toLocaleString('es-AR')}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="rounded-2xl px-6 py-4 mb-6 flex justify-between items-center" style={{ backgroundColor: '#EAF3E6' }}>
              <span className="text-xl font-bold" style={{ color: '#243B27' }}>Total</span>
              <span className="text-2xl font-bold" style={{ color: '#4C6B3D' }}>
                ${total.toLocaleString('es-AR')}
              </span>
            </div>

            {/* Botón confirmar */}
            <button
              className="w-full py-4 rounded-full text-white font-bold text-lg"
              style={{ backgroundColor: '#7BA05D' }}
            >
              Confirmar compra
            </button>

            {/* Botón vaciar */}
            <BotonVaciarCarrito cartId={cart.id} />
          </div>
        )}
      </section>
    </main>
  )
}