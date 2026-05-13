import { prisma } from '../lib/prisma'
import { getVendedorById } from '../lib/api'
import ImagenPlaceholder from '../components/ImagenPlaceholder'
import Link from 'next/link'
import { Heart, MapPin, ArrowRight } from 'lucide-react'
import { getBuyerFromClerk } from '../lib/auth'

export default async function FavoritosPage() {
  const buyer = await getBuyerFromClerk()

  if (!buyer) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F2EA' }}>
        <p style={{ color: '#243B27' }}>Tenés que iniciar sesión para ver tus favoritos</p>
      </main>
    )
  }

  const favoritos = await prisma.favorite.findMany({
    where: { buyer_id: buyer.id }
  })

  const items = await Promise.all(
    favoritos.map(async (fav) => {
      const vendedor = await getVendedorById(fav.seller_id)
      const producto = vendedor?.productos.find(p => p.id === fav.product_id)
      return { fav, vendedor, producto }
    })
  )

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-4 sm:px-8 py-10 max-w-5xl mx-auto">
        <Link href="/" className="text-sm mb-6 inline-block" style={{ color: '#7BA05D' }}>
          ← Volver al inicio
        </Link>

        <h1 className="text-4xl font-bold mb-8" style={{ color: '#243B27' }}>
          Mis favoritos
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto mb-4" style={{ color: '#7BA05D' }} />
            <p className="text-lg mb-6" style={{ color: '#4C6B3D' }}>
              Todavía no tenés favoritos
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(({ fav, vendedor, producto }) => {
              if (!vendedor || !producto) return null
              return (
                <div
                  key={fav.id}
                  className="rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-[#EAF3E6] hover:border-[#7BA05D] hover:-translate-y-1"
                  style={{ backgroundColor: 'white' }}
                >
                  <div className="h-36 flex items-center justify-center" style={{ backgroundColor: '#EAF3E6' }}>
                    <ImagenPlaceholder tipo="producto" imagen={producto.imagen} />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs uppercase font-semibold tracking-[0.16em] text-[#7BA05D]">Favorito</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#243B27' }}>
                      {producto.nombre}
                    </h3>
                    <div className="mb-3 space-y-2 text-sm text-[#4C6B3D]">
                      <p className="flex items-center gap-2">
                        <MapPin size={14} /> {vendedor.ubicacion}
                      </p>
                      <p className="text-[#7BA05D]">{vendedor.nombre}</p>
                    </div>
                    <p className="text-xl font-bold mb-4" style={{ color: '#243B27' }}>
                      ${producto.precio.toLocaleString('es-AR')}
                    </p>
                    <Link
                      href={`/vendedores/${vendedor.id}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4C6B3D] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110"
                    >
                      Ir a tienda <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}