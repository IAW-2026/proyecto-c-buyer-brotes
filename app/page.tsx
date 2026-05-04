import { getVendedores } from './lib/api'
import Link from 'next/link'
import Buscador from './components/Buscador'

export default async function Home() {
  const vendedores = await getVendedores()

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>

      {/* Hero */}
      <section className="text-center py-16 px-8">
        <h1 className="text-5xl font-bold mb-4" style={{ color: '#243B27' }}>
          Tu vivero online 🌿
        </h1>
        <p className="text-xl mb-8" style={{ color: '#4C6B3D' }}>
          Encontrá plantas y accesorios de jardinería de los mejores vendedores
        </p>

        {/* Buscador */}
        <Buscador vendedores={vendedores} />
      </section>

      {/* Catálogo de vendedores */}
      <section className="px-8 pb-16">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#243B27' }}>
          Viveros destacados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendedores.map((vendedor) => (
            <div
              key={vendedor.id}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              style={{ backgroundColor: 'white' }}
            >
              {/* Imagen del vendedor */}
              <div
                className="h-40 flex items-center justify-center text-7xl"
                style={{ backgroundColor: '#EAF3E6' }}
              >
                {vendedor.imagen}
              </div>

              {/* Info del vendedor */}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1" style={{ color: '#243B27' }}>
                  {vendedor.nombre}
                </h3>
                <p className="text-sm mb-2" style={{ color: '#7BA05D' }}>
                  📍 {vendedor.ubicacion}
                </p>
                <p className="text-sm mb-4" style={{ color: '#4C6B3D' }}>
                  {vendedor.descripcion}
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
          ))}
        </div>
      </section>

    </main>
  )
}