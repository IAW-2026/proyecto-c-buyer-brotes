import { prisma } from '../lib/prisma'
import Link from 'next/link'
import CartDetails from './CartDetails'
import { vendedores } from '../lib/mock-data'
import { ShoppingCart, Truck } from 'lucide-react'
import { getBuyerFromClerk } from '../lib/auth'

function getProductName(productId: number) {
  const product = vendedores
    .flatMap(vendor => vendor.productos)
    .find(producto => producto.id === productId)
  return product?.nombre ?? null
}

export default async function CarritoPage() {
  const buyer = await getBuyerFromClerk()

  if (!buyer) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F2EA' }}>
        <p style={{ color: '#243B27' }}>Tenés que iniciar sesión para ver tu carrito</p>
      </main>
    )
  }

  const tieneDireccion = !!buyer.direccion?.trim()

  const cart = await prisma.cart.findFirst({
    where: { buyer_id: buyer.id, estado: 'active' },
    include: { items: true }
  })

  const cartData = cart
    ? {
        ...cart,
        items: cart.items.map(item => ({
          ...item,
          precio_unitario: Number(item.precio_unitario),
          product_name: getProductName(item.product_id)
        }))
      }
    : null

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-4 sm:px-8 py-10 max-w-5xl mx-auto">
        <Link href="/" className="text-sm mb-6 inline-block" style={{ color: '#7BA05D' }}>
          {'<'} Volver al inicio
        </Link>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold flex items-center gap-3" style={{ color: '#243B27' }}>
            <ShoppingCart size={32} /> Mi carrito
          </h1>
          <div className="inline-flex items-center rounded-full bg-[#EAF3E6] px-4 py-2 text-sm font-semibold text-[#4C6B3D]">
            <Truck size={16} className="mr-2" /> Retiro en el local del vendedor
          </div>
        </div>

        <CartDetails
          initialCart={cartData}
          buyerId={buyer.id}
          tieneDireccion={tieneDireccion}
          sellerId={cart?.seller_id ?? null}
        />
      </section>
    </main>
  )
}