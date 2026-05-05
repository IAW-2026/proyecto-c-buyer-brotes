import { prisma } from '../lib/prisma'
import { getVendedorById } from '../lib/api'
import Link from 'next/link'

export default async function FavoritosPage() {
  const favoritos = await prisma.favorite.findMany({
    where: { buyer_id: 1 }
  })

  // Para cada favorito obtenemos el producto y vendedor del mock
  const items = await Promise.all(
    favoritos.map(async (fav) => {
      const vendedor = await getVendedorById(fav.seller_id)
      const producto = vendedor?.productos.find(p => p.id === fav.product_id)
      return { fav, vendedor, producto }
    })
  )

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-8 py-10 max-w-4xl mx-auto">
        <Link href="/" className="text-sm mb-6 inline-block" style={{ color: '#7BA05D' }}>
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold mb-8" style={{ color: '#243B27' }}>
          Mis favoritos ❤️
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🤍</p>
            <p className="text-xl mb-6" style={{ color: '#4C6B3D' }}>
              Todavía no tenés favoritos
            </p>
            <Link
              href="/"
              className="px-8 py-3 rounded-full text-white font-semibold"
              style={{ backgroundColor: '#7BA05D' }}
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
                  className="rounded-2xl overflow-hidden shadow-md"
                  style={{ backgroundColor: 'white' }}
                >
                  {/* Imagen */}
                  <div
                    className="h-36 flex items-center justify-center text-6xl"
                    style={{ backgroundColor: '#EAF3E6' }}
                  >
                    {producto.imagen}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1" style={{ color: '#243B27' }}>
                      {producto.nombre}
                    </h3>
                    <p className="text-sm mb-1" style={{ color: '#7BA05D' }}>
                      🏪 {vendedor.nombre}
                    </p>
                    <p className="text-sm mb-3" style={{ color: '#4C6B3D' }}>
                      📍 {vendedor.ubicacion}
                    </p>
                    <p className="text-xl font-bold mb-4" style={{ color: '#4C6B3D' }}>
                      ${producto.precio.toLocaleString('es-AR')}
                    </p>
                    <Link
                      href={`/vendedores/${vendedor.id}`}
                      className="block w-full py-2 rounded-full text-sm font-semibold text-white text-center"
                      style={{ backgroundColor: '#7BA05D' }}
                    >
                      Ver tienda
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