import { getVendedorById } from '../../lib/api'
import { prisma } from '../../lib/prisma'
import BotonCarrito from '../../components/BotonCarrito'
import BotonFavorito from '../../components/BotonFavorito'
import Link from 'next/link'

type Props = {
  params: Promise<{ id: string }>
}

export default async function VendedorPage({ params }: Props) {
  const { id } = await params
  const vendedor = await getVendedorById(Number(id))

  const favoritos = await prisma.favorite.findMany({
    where: { buyer_id: 1 }
  })

  if (!vendedor) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F2EA' }}>
        <p style={{ color: '#243B27' }}>Vendedor no encontrado</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>

      {/* Header del vendedor */}
      <section className="px-8 py-10" style={{ backgroundColor: '#EAF3E6' }}>
        <Link href="/" className="text-sm mb-4 inline-block" style={{ color: '#7BA05D' }}>
          ← Volver al inicio
        </Link>
        <div className="flex items-center gap-6 mt-2">
          <div className="text-7xl">{vendedor.imagen}</div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#243B27' }}>
              {vendedor.nombre}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#7BA05D' }}>
              📍 {vendedor.ubicacion}
            </p>
            <p className="mt-2" style={{ color: '#4C6B3D' }}>
              {vendedor.descripcion}
            </p>
          </div>
        </div>
      </section>

      {/* Catálogo de productos */}
      <section className="px-8 py-10">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#243B27' }}>
          Productos disponibles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendedor.productos.map((producto) => (
            <div
              key={producto.id}
              className="rounded-2xl overflow-hidden shadow-md"
              style={{ backgroundColor: 'white' }}
            >
              {/* Imagen del producto */}
              <div
                className="h-36 flex items-center justify-center text-6xl relative"
                style={{ backgroundColor: '#EAF3E6' }}
              >
                {producto.imagen}
                <BotonFavorito
                  productoId={producto.id}
                  sellerId={vendedor.id}
                  buyerId={1}
                  esFavorito={favoritos.some(f => f.product_id === producto.id)}
                />
              </div>

              {/* Info del producto */}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1" style={{ color: '#243B27' }}>
                  {producto.nombre}
                </h3>
                <p className="text-sm mb-3" style={{ color: '#4C6B3D' }}>
                  {producto.descripcion}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold" style={{ color: '#4C6B3D' }}>
                    ${producto.precio.toLocaleString('es-AR')}
                  </span>
                  <span className="text-sm" style={{ color: producto.stock <= 3 ? '#E07A5F' : '#7BA05D' }}>
                    Stock: {producto.stock}
                  </span>
                </div>
                <BotonCarrito
                  productoId={producto.id}
                  productNombre={producto.nombre}
                  precio={producto.precio}
                  sellerId={vendedor.id}
                  buyerId={1}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}